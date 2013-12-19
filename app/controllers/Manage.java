package controllers;

import java.util.List;

import models.InsuranceAgent;
import models.Managers;
import models.MonadPrintRecord;
import play.mvc.Controller;
import utils.JSONBuilder;

public class Manage extends Controller {
	public static void index(Managers manager){
		if(manager==null||(manager!=null&&manager.userId==null)){
			Application.index("超时!");
		}
		render(manager);
	}
	public static void printRecords(){
		render();
	}
	
	public static void getPrintRecords(String date,String client,String operator){
		if(date!=null||client!=null||operator!=null){
			
		}
		List<MonadPrintRecord> list=MonadPrintRecord.findAll();
		String js=JSONBuilder.build(List.class).toJson(list);
		renderJSON(js);
	}
	
	public static void getAgents(){
		List<InsuranceAgent> list=InsuranceAgent.findAll();
		renderJSON(JSONBuilder.build(List.class).toJson(list));
	}
}
