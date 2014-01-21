package utils;

import com.google.gson.Gson;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.methods.GetMethod;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * Created by Administrator on 14-1-21.
 */
public class Sms {
    public static void main(String [] a){
        sendSms("13438340391","祝君：马年吉祥，马上发财！");
    }
    static void sendSms(String mobile,String text){
        try {
            text= URLEncoder.encode(text, "gbk");
        } catch (UnsupportedEncodingException e1) {
            e1.printStackTrace();
        }
        HttpClient htc=new HttpClient();
        HttpMethod method=new GetMethod("http://opendata.baidu.com/get_vcode.php?need_vcode=-1");
        try {
            htc.executeMethod(method);
            Gson g=new Gson();
            response res=g.fromJson(method.getResponseBodyAsString(), response.class);
//		     System.out.println(res);
            method.releaseConnection();
            method=new GetMethod("http://opendata.baidu.com/sendsms_vcode.php?phone="+mobile+"&msg_content="+text+"&vcode="+res.vcode_url.substring(res.vcode_url.indexOf("?")+1)+"&ie=utf-8");
            htc.executeMethod(method);
            System.out.println(method.getResponseBodyAsString());
            method.releaseConnection();
        } catch (HttpException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }


    }

    static class response{
        public String msg;
        public Integer status;
        public String vcode_url;
        @Override
        public String toString() {
            return "response [msg=" + msg + ", status=" + status
                    + ", vcode_url=" + vcode_url + "]";
        }

    }
}
