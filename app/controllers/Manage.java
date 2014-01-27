package controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import models.*;
import play.db.jpa.Model;
import play.mvc.Controller;
import utils.DateUtils;
import utils.JSONBuilder;
import utils.JsonResponse;
import utils.Pagination;

import static controllers.Application.*;

public class Manage extends Controller {
	public static void index(){
        String uid=session.get(LOGIN_USER_ID);
		if(uid==null){
            session.put(LOGIN_RESPONSE,"请登录!");
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

    public static void noPage(int type,String [] key,String [] val){
        String keys=ManageUtils.genKeys(key,true);
        Object[] vals=ManageUtils.genVals(val);
        String data="";
        switch (type){
        }
        renderJSON(data);
    }
	public static void data(int type,int current,String [] key,String [] value){
        Pagination page=Pagination.getInstance();
        switch (type){
            case AGENTS:
                renderJSON(ManageAgents.getAgents(page,current,key,value));
                break;
            case AGENT_TYPE:
                 renderJSON(ManageAgentTypes.getAgentType(page,current,key,value));
                break;
            case BANK_CARD:
                renderJSON(ManageBankCards.getBankCard(page,current,key,value));
                break;
            case MANAGER:
                renderJSON(ManageManagers.getManagers(page,current,key,value));
                break;
            case BUSINESS:
                renderJSON(ManageBusinesses.getBusiness(page,current,key,value));
                break;
            case PRIVILEGE:
                renderJSON(ManagePrivileges.getPrivileges(page,current,key,value));
                break;
        }
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