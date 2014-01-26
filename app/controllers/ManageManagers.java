package controllers;

import models.Managers;
import play.db.jpa.Model;
import utils.JSONBuilder;
import utils.Pagination;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 14-1-26.
 */
public class ManageManagers extends  Application {
    static Map<Object,Object> getManagers(Pagination page,int current,String [] key,String [] val){
        String keys=ManageUtils.genKeys(key,true);
        Object[] val_=ManageUtils.genVals(val);
        List<Model> list;
        int count;
        if(key==null){
            count=(int) Managers.count();
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
        return JSONBuilder.paginationList(page, list);
    }
}
