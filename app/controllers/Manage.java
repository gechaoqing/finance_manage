package controllers;

import java.util.List;

import models.*;
import play.mvc.Controller;
import utils.JSONBuilder;

public class Manage extends Controller {
	public static void index(){
        String uid=session.get(Application.LOGIN_USER_ID);
		if(uid==null){
            session.put(Application.LOGIN_RESPONSE,"超时!");
			Application.index();
		}
        Managers manager=Managers.findById(Long.decode(uid));
		render(manager);
	}

    public static void html(String manage){
        String uid=session.get(Application.LOGIN_USER_ID);
        if(uid==null){
            render("/Manage/login.html");
        }else{
            render("/Manage/"+manage+".html");
        }
    }

    public static void nopage(int type,String [] key,String [] val){
        String keys=genKeys(key,true);
        Object[] vals=genVals(val);
        String data="";
        switch (type){
            case Application.PRINT_RECORD:
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
	public static void data(int type,String [] key,String [] val){
        String keys=genKeys(key,true);
        Object[] vals=genVals(val);
        switch (type){
            case Application.PRINT_RECORD:
                if("".equals(keys)){
                    keys="";
                }
                break;
        }
		renderJSON("");
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
	static void getPrintRecords(String date,String client,String operator){
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

    public static void getSource(int type){
        if(type==0){
            List<InsuranceAgent> list=InsuranceAgent.findAll();
            renderJSON(JSONBuilder.build(List.class).toJson(list));
        }else if(type==1){
            List<InsuranceType> list= InsuranceType.findAll();
            renderJSON(list);
        }else if(type==2){
            List<BankCard> list=BankCard.findAll();
            renderJSON(list);
        }else if(type==3){
            List<Managers> list=Managers.findAll();
            renderJSON(list);
        }
    }
}
