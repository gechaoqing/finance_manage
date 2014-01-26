package controllers;

import models.BankCard;
import play.db.jpa.Model;
import utils.JSONBuilder;
import utils.Pagination;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 14-1-26.
 */
public class ManageBankCards extends Application {
    static Map<Object,Object> getBankCard(Pagination page,int current,String [] key,String [] val){
        String keys=ManageUtils.genKeys(key,true);
        Object[] val_=ManageUtils.genVals(val);
        List<Model> list;
        int count;
        if(key==null){
            count=(int) BankCard.count();
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
        return JSONBuilder.paginationList(page, list);
    }
}
