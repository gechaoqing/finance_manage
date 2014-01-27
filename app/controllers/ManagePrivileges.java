package controllers;

import models.InsuranceAgent;
import models.ManagerPrivilege;
import models.ManagerRole;
import play.db.jpa.Model;
import utils.JSONBuilder;
import utils.JsonResponse;
import utils.Pagination;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 14-1-26.
 */
public class ManagePrivileges extends Application {
    public static void assignPrivileges(Long id, String name) {
        ManagerRole role = ManagerRole.findById(id);
        List<ManagerPrivilege> has = role.privileges;
        List<ManagerPrivilege> notHas = new ArrayList<ManagerPrivilege>();
        List<ManagerPrivilege> all = ManagerPrivilege.findAll();
        for (ManagerPrivilege allp : all) {
            if (!has.contains(allp)) {
                notHas.add(allp);
            }
        }
        render("/Manage/assignPrivileges.hmtl",has, notHas, name, id);
    }

    public static void assignPrivilegesDo(String add, String remove, Long id) {
        ManagerRole role = ManagerRole.findById(id);
        if (!"".equals(add)) {
            String[] adds = add.split(";");
            for (String id_ : adds) {
                Long _id = Long.parseLong(id_);
                role.addPrivilege((ManagerPrivilege) ManagerPrivilege
                        .findById(_id));
            }
        }
        if (!"".equals(remove)) {
            String[] removes = remove.split(";");
            for (String id_ : removes) {
                Long _id = Long.parseLong(id_);
                role.removePrivilege((ManagerPrivilege) ManagerPrivilege
                        .findById(_id));
            }
        }
        try {
            role.save();
            renderJSON(new JsonResponse(0, "[" + role.name + "] 权限分配成功，重新登录生效。"));
        } catch (Exception e) {
            renderJSON(new JsonResponse(-1, "[" + role.name + "] 权限分配失败。"));
        }
    }
    static Map<Object,Object> getPrivileges(Pagination page,int current,String [] key,String [] val){
        String keys=ManageUtils.genKeys(key,true);
        Object[] val_=ManageUtils.genVals(val);
        List<Model> list;
        int count;
        if(key==null){
            count=(int) ManagerPrivilege.count();
            page.setTotalRecord(count);
            page.setCurrentPage(current);
            list=ManagerPrivilege.findAll();
        }
        else{
            count=(int)ManagerPrivilege.count(keys,val_);
            page.setTotalRecord(count);
            page.setCurrentPage(current);
            list=ManagerPrivilege.find(keys,val_).from(page.getStartRow()).fetch(page.getDisplayCountOfPerPage());
        }
        return JSONBuilder.paginationList(page, list);
    }
}
