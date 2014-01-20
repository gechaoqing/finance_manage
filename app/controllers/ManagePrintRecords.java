package controllers;

import models.MonadPrintRecord;
import play.mvc.Controller;
import utils.DateUtils;
import utils.JSONBuilder;

import java.util.List;


/**
 * Created by Administrator on 14-1-20.
 */
public class ManagePrintRecords extends Controller {
    public static void recordQuery(String[] key, String[] value,int isFirst) {
        String keys = ManageUtils.genKeys(key, true);
        Object[] vals = ManageUtils.genVals(value);
        String data = "";
        if(key!=null){
            for(int j=0;j<key.length;j++){
                if(key[j].indexOf("printDate")!=-1){
                    vals[j]=DateUtils.parse(value[j]);
                }
            }
        }
        if (key == null&&isFirst==1) {
            keys = "printDate = ?";
            vals = new Object[]{DateUtils.getDaysNear(0)};
        }
        if (!"".equals(keys)) {
            List<MonadPrintRecord> list = MonadPrintRecord.find(keys, vals).fetch();
            data = JSONBuilder.build(List.class).toJson(list);
        } else {
            List<MonadPrintRecord> list = MonadPrintRecord.findAll();
            data = JSONBuilder.build(List.class).toJson(list);
        }
        renderJSON(data);
    }
}
