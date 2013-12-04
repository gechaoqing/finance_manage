package controllers;

import models.Managers;
import play.mvc.Controller;

public class Manage extends Controller {
	public static void index(Managers manager){
		if(manager==null||(manager!=null&&manager.userId==null)){
			Application.index("超时!");
		}
		render(manager);
	}
}
