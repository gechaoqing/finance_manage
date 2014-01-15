package controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import models.*;
import play.db.jpa.Model;
import play.mvc.Controller;
import utils.JSONBuilder;
import utils.JsonResponse;
import utils.Pagination;

import static controllers.Application.*;

public class Manage extends Controller {
	public static void index(){
        String uid=session.get(LOGIN_USER_ID);
		if(uid==null){
            session.put(LOGIN_RESPONSE,"超时!");
			Application.index();
		}
        Managers manager=Managers.findById(Integer.decode(uid));
        List<ManagerRole> roles = manager.roles;
        List<ManagerPrivilege> privis = new ArrayList<ManagerPrivilege>();
        for (ManagerRole role : roles) {
            for (ManagerPrivilege privi : role.privileges) {
                if (!privis.contains(privi)) {
                    privis.add(privi);
                }
            }
        }
		render(manager,privis);
	}

    public static void assignRoles(Long id, String name) {
        Managers manager = Managers.findById(id);
        List<ManagerRole> has = manager.roles;
        List<ManagerRole> notHas = new ArrayList<ManagerRole>();
        List<ManagerRole> all = ManagerRole.findAll();
        for (ManagerRole ar : all) {
            if (!has.contains(ar)) {
                notHas.add(ar);
            }
        }
        render(has, notHas, name, id);
    }

    public static void assignRolesDo(String add, String remove, Long id) {
        Managers manager = Managers.findById(id);
        if (!"".equals(add)) {
            String[] adds = add.split(";");
            for (String id_ : adds) {
                Long _id = Long.parseLong(id_);
                manager.addRole((ManagerRole) ManagerRole.findById(_id));
            }
        }
        if (!"".equals(remove)) {
            String[] removes = remove.split(";");
            for (String id_ : removes) {
                Long _id = Long.parseLong(id_);
                manager.removeRole((ManagerRole) ManagerRole.findById(_id));
            }
        }
        try {
            manager.save();
            renderJSON(new JsonResponse(0, "[" + manager.userAccount
                    + "] 角色分配成功，重新登录生效。"));
        } catch (Exception e) {
            renderJSON(new JsonResponse(-1, "[" + manager.userAccount + "] 角色分配失败。"));
        }
    }

    public static void assignPrivileges(Long id, String name) {
        ManagerRole role = ManagerRole.findById(id);
        List<ManagerPrivilege> has = role.privileges;
        List<ManagerPrivilege> notHas = new ArrayList<ManagerPrivilege>();
        List<ManagerPrivilege> all = ManagerPrivilege.findAll();
        for (ManagerPrivilege allp : all) {
            if (!has.contains(allp)) {
                notHas.add(allp);
            }
        }
        render(has, notHas, name, id);
    }

    public static void assignPrivilegesDo(String add, String remove, Long id) {
        ManagerRole role = ManagerRole.findById(id);
        if (!"".equals(add)) {
            String[] adds = add.split(";");
            for (String id_ : adds) {
                Long _id = Long.parseLong(id_);
                role.addPrivilege((ManagerPrivilege) ManagerPrivilege
                        .findById(_id));
            }
        }
        if (!"".equals(remove)) {
            String[] removes = remove.split(";");
            for (String id_ : removes) {
                Long _id = Long.parseLong(id_);
                role.removePrivilege((ManagerPrivilege) ManagerPrivilege
                        .findById(_id));
            }
        }
        try {
            role.save();
            renderJSON(new JsonResponse(0, "[" + role.name + "] 权限分配成功，重新登录生效。"));
        } catch (Exception e) {
            renderJSON(new JsonResponse(-1, "[" + role.name + "] 权限分配失败。"));
        }
    }

    public static void html(String manage){
        String uid=session.get(LOGIN_USER_ID);
        if(uid==null){
            render("/Manage/login.html");
        }else{
            render("/Manage/"+manage+".html");
        }
    }

    public static void noPage(int type,String [] key,String [] val){
        String keys=genKeys(key,true);
        Object[] vals=genVals(val);
        String data="";
        switch (type){
            case PRINT_RECORD:
                if("".equals(keys)){
                    keys="printDate";
                    vals=new Object[]{new java.util.Date()};
                }
                List<MonadPrintRecord> list=MonadPrintRecord.find(keys,vals).fetch();
                data=JSONBuilder.build(List.class).toJson(list);
                break;
        }
        renderJSON(data);
    }
	public static void data(int type,int current,String [] key,String [] val){
        Pagination page=Pagination.getInstance();
        switch (type){
            case AGENTS:
                renderJSON(getAgents(page,current,key,val));
                break;
            case AGENT_TYPE:
                 renderJSON(getAgentType(page,current,key,val));
                break;
            case BANK_CARD:
                renderJSON(getBankCard(page,current,key,val));
                break;
            case MANAGER:
                renderJSON(getManagers(page,current,key,val));
                break;
            case BUSINESS:
                renderJSON(getBusiness(page,current,key,val));
                break;
        }
	}

    static Map<Object,Object> getBusiness(Pagination page,int current,String [] key,String [] val){
        String keys=genKeys(key,true);
        Object[] val_=genVals(val);
        List<Model> list;
        int count;
        if(key==null){
            count=(int)Business.count();
            page.setTotalRecord(count);
            page.setCurrentPage(current);
            list=Business.findAll();
        }
        else{
            count=(int)Business.count(keys,val_);
            page.setTotalRecord(count);
            page.setCurrentPage(current);
            list=Business.find(keys,val_).from(page.getStartRow()).fetch(page.getDisplayCountOfPerPage());
        }
        return JSONBuilder.paginationList(page,list);
    }

    static Map<Object,Object> getAgents(Pagination page,int current,String [] key,String [] val){
        String keys=genKeys(key,true);
        Object[] val_=genVals(val);
        List<Model> list;
        int count;
        if(key==null){
            count=(int)InsuranceAgent.count();
            page.setTotalRecord(count);
            page.setCurrentPage(current);
            list=InsuranceAgent.findAll();
        }
        else{
            count=(int)InsuranceAgent.count(keys,val_);
            page.setTotalRecord(count);
            page.setCurrentPage(current);
            list=InsuranceAgent.find(keys,val_).from(page.getStartRow()).fetch(page.getDisplayCountOfPerPage());
        }
        return JSONBuilder.paginationList(page,list);
    }

    static Map<Object,Object> getManagers(Pagination page,int current,String [] key,String [] val){
        String keys=genKeys(key,true);
        Object[] val_=genVals(val);
        List<Model> list;
        int count;
        if(key==null){
            count=(int)Managers.count();
            page.setTotalRecord(count);
            page.setCurrentPage(current);
            list=Managers.findAll();
        }
        else{
            count=(int)Managers.count(keys,val_);
            page.setTotalRecord(count);
            page.setCurrentPage(current);
            list=Managers.find(keys,val_).from(page.getStartRow()).fetch(page.getDisplayCountOfPerPage());
        }
        return JSONBuilder.paginationList(page,list);
    }

    static Map<Object,Object> getBankCard(Pagination page,int current,String [] key,String [] val){
        String keys=genKeys(key,true);
        Object[] val_=genVals(val);
        List<Model> list;
        int count;
        if(key==null){
            count=(int)BankCard.count();
            page.setTotalRecord(count);
            page.setCurrentPage(current);
            list=BankCard.findAll();
        }
        else{
            count=(int)BankCard.count(keys,val_);
            page.setTotalRecord(count);
            page.setCurrentPage(current);
            list=BankCard.find(keys,val_).from(page.getStartRow()).fetch(page.getDisplayCountOfPerPage());
        }
        return JSONBuilder.paginationList(page,list);
    }

    static Map<Object,Object> getAgentType(Pagination page,int current,String [] key,String [] val){
        String keys=genKeys(key,true);
        Object[] val_=genVals(val);
        List<Model> list;
        int count;
        if(key==null){
            count=(int)InsuranceType.count();
            page.setTotalRecord(count);
            page.setCurrentPage(current);
            list=InsuranceType.findAll();
        }
        else{
            count=(int)InsuranceType.count(keys,val_);
            page.setTotalRecord(count);
            page.setCurrentPage(current);
            list=InsuranceType.find(keys,val_).from(page.getStartRow()).fetch(page.getDisplayCountOfPerPage());
        }
        return JSONBuilder.paginationList(page,list);
    }

    static String genKeys(String[] key,boolean isplit,String... val){
        if(key==null){
            return "";
        }
        StringBuilder sb = new StringBuilder();
        String split=" and ";
        for(int i=0;i<key.length;i++){
            String k=key[i];
            if(k.indexOf("%")==0){
                sb.append(split+k.substring(1)+" like ?");
            }else if(k.indexOf(">")==0||k.indexOf("<")==0){
                sb.append(split+k.substring(1)+k.substring(0,1)+"=?");
            }else if(k.indexOf("null")==0||k.indexOf("notnull")==0){
                if(k.indexOf("null")==0)
                {
                    sb.append(split+k.substring(4)+" is null");
                }
                else{
                    sb.append(split+k.substring(4)+" is not null");
                }
                if(val!=null){
                    val[i]=null;
                }
            }
            else {
                sb.append(split+key+"=?");
            }
        }
        return isplit?sb.length()>0?sb.substring(split.length()):"":sb.toString();
    }

    static Object[] genVals(String[] val){
        if(val==null){
            return null;
        }
        int j=0;
        for(String v:val){
            if(v!=null){
                j++;
            }
        }
        Object[] val_=new Object[j];
        j=0;
        for(String v:val){
            if(v!=null){
                val_[j]=v;
                j++;
            }
        }
        return val_;
    }

    public static void getSource(int type){
        List<Model> list;
        switch (type){
            case Application.SOURCE_AGENT:
                list=InsuranceAgent.findAll();
                renderJSON(JSONBuilder.build(List.class).toJson(list));
                break;
            case Application.SOURCE_AGENT_TYPE:
                list= InsuranceType.findAll();
                renderJSON(list);
                break;
            case Application.SOURCE_BANK_CARD:
                list=BankCard.findAll();
                renderJSON(list);
                break;
            case Application.SOURCE_MANAGER:
                list=Managers.findAll();
                renderJSON(list);
                break;
        }
    }

    static Long goSignin(boolean isModal) {
        String longid = session.get(Application.LOGIN_USER_ID);
        if (longid == null) {
            if (isModal) {
                render("/Manage/modalSignin.html");
            }
            render("/Manage/signin.html");
            return null;
        }
        return Long.parseLong(longid);
    }
}
