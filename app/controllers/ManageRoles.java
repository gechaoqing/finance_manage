package controllers;

import models.ManagerRole;
import models.Managers;
import utils.JsonResponse;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 14-1-26.
 */
public class ManageRoles extends Application {
    public static void assignRoles(Long id, String name) {
        Managers manager = Managers.findById(id);
        List<ManagerRole> has = manager.roles;
        List<ManagerRole> notHas = new ArrayList<ManagerRole>();
        List<ManagerRole> all = ManagerRole.findAll();
        for (ManagerRole ar : all) {
            if (!has.contains(ar)) {
                notHas.add(ar);
            }
        }
        render("/Manage/assignRoles.html",has, notHas, name, id);
    }

    public static void assignRolesDo(String add, String remove, Long id) {
        Managers manager = Managers.findById(id);
        if (!"".equals(add)) {
            String[] adds = add.split(";");
            for (String id_ : adds) {
                Long _id = Long.parseLong(id_);
                manager.addRole((ManagerRole) ManagerRole.findById(_id));
            }
        }
        if (!"".equals(remove)) {
            String[] removes = remove.split(";");
            for (String id_ : removes) {
                Long _id = Long.parseLong(id_);
                manager.removeRole((ManagerRole) ManagerRole.findById(_id));
            }
        }
        try {
            manager.save();
            renderJSON(new JsonResponse(0, "[" + manager.userAccount
                    + "] 角色分配成功，重新登录生效。"));
        } catch (Exception e) {
            renderJSON(new JsonResponse(-1, "[" + manager.userAccount + "] 角色分配失败。"));
        }
    }
}
