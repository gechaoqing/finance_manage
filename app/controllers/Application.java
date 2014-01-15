package controllers;

import play.*;
import play.cache.Cache;
import play.libs.Codec;
import play.libs.Crypto;
import play.libs.Images;
import play.libs.Time;
import play.mvc.*;
import play.mvc.Http.Cookie;
import utils.IpMacAddress;
import utils.PropertiesUtils;

import java.util.*;

import models.*;

public class Application extends Controller {
    final static String LOGIN_RESPONSE = "login-response";
    final static String LOGIN_USER_ID = "login-user-id";
    final static String LOGIN_USER = "login-user";
    final static String LOGIN_USER_TYPE = "login-user-type";

    final static int SOURCE_AGENT = 0;
    final static int SOURCE_AGENT_TYPE = 1;
    final static int SOURCE_BANK_CARD = 2;
    final static int SOURCE_MANAGER = 3;

    final static int PRINT_RECORD = 1000;
    final static int AGENTS = 1001;
    final static int BUSINESS = 1002;
    final static int BANK_CARD = 1003;
    final static int AGENT_TYPE = 1004;
    final static int MANAGER = 1005;
    final static int PRIVILEGE = 1006;
    final static int ROLE = 1007;

    public static void index() {
        PropertiesUtils pro = PropertiesUtils.instance();
        boolean iplimit = Boolean.parseBoolean(pro.$(
                Application.class.getResourceAsStream("systemSetting.conf"))
                .getProperty("ip.limit"));
        boolean access = true;
        if (iplimit) {
            IpMacAddress ima = IpMacAddress.instance();
            String ip = ima.getIpAddress(request);
            access = IPLimit.volidIp(ip);
        }
        if (access) {
            String randomID = Codec.UUID();
            String account = Application.getCookVal("authUser");
            String pwd = Application.getCookVal("authPwd");
            String msg = session.get(LOGIN_RESPONSE);
            render(randomID, account, pwd, msg);
        } else {
            renderHtml("<style>.alert {font-family:'Microsoft Yahei';padding: 15px;display:block;  margin-bottom: 20px;  border: 1px solid transparent;  border-radius: 4px;}.alert-danger {color: #b94a48;  background-color: #f2dede;  border-color: #eed3d7;}</style><div style='padding:50px;text-align:center'><span class='alert alert-danger'><b>无权限！</b><p>你没有权限进入该系统。请自觉离开！</p></span></div>");
        }
    }

    private static String getCookVal(String cookname) {
        Cookie remember = request.cookies.get(cookname);
        if (remember != null) {
            int firstIndex = remember.value.indexOf("-");
            int lastIndex = remember.value.lastIndexOf("-");
            if (lastIndex > firstIndex) {
                String sign = remember.value.substring(0, firstIndex);
                String restOfCookie = remember.value.substring(firstIndex + 1);
                String value = remember.value.substring(firstIndex + 1,
                        lastIndex);
                String time = remember.value.substring(lastIndex + 1);
                Date expirationDate = new Date(Long.parseLong(time));
                Date now = new Date();
                if (expirationDate.before(now)) {
                    response.removeCookie(cookname);
                    return null;
                }
                if (Crypto.sign(restOfCookie).equals(sign)) {
                    return value;
                }
            }
        }
        return null;
    }

    private static void setCook(boolean remember, String cookname,
                                String cookvalue) {
        if (remember) {
            Date expiration = new Date();
            String duration = Play.configuration.getProperty(
                    "secure.rememberme.duration", "30d");
            expiration.setTime(expiration.getTime()
                    + Time.parseDuration(duration) * 1000);
            response.setCookie(cookname,
                    Crypto.sign(cookvalue + "-" + expiration.getTime()) + "-"
                            + cookvalue + "-" + expiration.getTime(), duration);
        } else {
            response.removeCookie(cookname);
        }
    }

    public static void signIn(String account, String pass,
                              String randomID, String code, int rememberme) {
        code = code.toUpperCase();
        session.clear();
        String msg = "验证码错误!";
        if (code.equals(Cache.get(randomID))) {
            Managers m = Managers.validateUser(account, pass);
            if (m != null) {
                setCook(true, "authUser", account);
                setCook((rememberme == 1), "authPwd", pass);
                session.put(LOGIN_USER_ID, m.userId);
                session.put(LOGIN_USER_TYPE, m.userType);
                Manage.index();
            } else {
                msg = "用户名或密码错误!";
                session.put(LOGIN_RESPONSE, msg);
                index();
            }
        } else {
            session.put(LOGIN_RESPONSE, msg);
            index();
        }
    }

    public static void signout() {
        session.clear();
        index();
    }

    public static void getVerifyCode(String id) {
        Images.Captcha captcha = Images.captcha();
        String code = captcha.getText("#ff3300");
        code = code.toUpperCase();
        Cache.set(id, code, "10mn");
        renderBinary(captcha);
    }

    protected static Managers getCacheUser() {
        Managers u = (Managers) Cache.get(LOGIN_USER);
        if (u == null) {
            String user_id = session.get(LOGIN_USER_ID);
            if (user_id == null) {
                return null;
            }
            u = Managers.findById(Long.parseLong(user_id));
            Cache.set(LOGIN_USER, u, "30mn");
        }
        return u;
    }

}