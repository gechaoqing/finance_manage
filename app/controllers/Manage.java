package controllers;

import java.util.List;

import models.InsuranceAgent;
import models.Managers;
import models.MonadPrintRecord;
import play.mvc.Controller;

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
	
	public static void getPrintRecords(){
		List<MonadPrintRecord> list=MonadPrintRecord.findAll();
		renderJSON(list);
	}
	
	public static void getAgents(){
		List<InsuranceAgent> list=InsuranceAgent.findAll();
		renderJSON(list);
	}
}
