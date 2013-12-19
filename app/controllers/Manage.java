package controllers;

import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

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
	
	public static void getPrintRecords(String date,String client,String operator){
		if(date!=null||client!=null||operator!=null){
			
		}
		List<MonadPrintRecord> list=MonadPrintRecord.findAll();
		Gson gson = new GsonBuilder()
				.serializeNulls().setDateFormat("yyyy-MM-dd")
				.create();
		renderJSON(gson.toJson(list));
	}
	
	public static void getAgents(){
		List<InsuranceAgent> list=InsuranceAgent.findAll();
		renderJSON(list);
	}
}
