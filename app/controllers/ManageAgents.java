package controllers;

import models.InsuranceAgent;
import play.db.jpa.Model;
import utils.JSONBuilder;
import utils.Pagination;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 14-1-26.
 */
public class ManageAgents extends  Application {
    static Map<Object,Object> getAgents(Pagination page,int current,String [] key,String [] val){
        String keys=ManageUtils.genKeys(key,true);
        Object[] val_=ManageUtils.genVals(val);
        if(key!=null){
            for(int j=0;j<key.length;j++){
                if("agentRebate".equals(key[j])){
                    val_[j]=Integer.parseInt(val[j]);
                }
            }
        }
        List<Model> list;
        int count;
        if(key==null){
            count=(int) InsuranceAgent.count();
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
        return JSONBuilder.paginationList(page, list);
    }
}
