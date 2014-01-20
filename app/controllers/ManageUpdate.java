package controllers;

import models.Managers;
import models.MonadPrintRecord;
import play.db.jpa.Model;
import play.mvc.Controller;
import utils.DateUtils;
import utils.JsonResponse;

import static controllers.Application.*;

/**
 * Created by Administrator on 14-1-15.
 */
public class ManageUpdate extends Controller {
    public static void getPerDataById(int type, Long id) {
        Model data;
        Manage.goSignin(true);
        String mt = session.get(Application.LOGIN_USER_TYPE);
        int mtype = Integer.parseInt(mt);
        switch (type) {
            case MANAGER:
                data= Managers.findById(id);
                render("/Manage/manager.html",data);
                break;
        }
    }

    public static void updatePrintRecord(MonadPrintRecord data){
        data.save();
        renderJSON(new JsonResponse(0,"change success!"));
    }

    public static void addPrintRecord(MonadPrintRecord data){
        data.save();
        renderJSON(new JsonResponse(0,data.recordId+""));
    }

    public static void updateData(int type) {
        switch (type) {
            case PRINT_RECORD:
                renderJSON(data(MonadPrintRecord.class, "出单记录更新成功", "出单记录更新失败", type, false));
                break;
        }
    }

    private static <T extends Model> JsonResponse data(Class<?> type, String ok, String error, int model, boolean add) {
        return data(type, ok, error, error, model, add);
    }

    private static <T extends Model> JsonResponse data(Class<?> type, String ok, String error, String noData, int model, boolean add) {
        T t = (T) params.get("data", type);
        if (t != null) {
            if (add) {
                return createT(t, model, ok, error);
            } else {
                return updateT(t, model, ok, error);
            }
        } else {
            return new JsonResponse(-1, noData);
        }
    }

    private static <T extends Model> JsonResponse createT(T t, int model, String ok, String error) {
        t.id = null;
        switch (model) {
        }
        try {
            t.save();
            return new JsonResponse(0, ok);
        } catch (Exception e) {
            return new JsonResponse(-1, error);
        }
    }

    private static <T extends Model> JsonResponse updateT(T t, int model, String ok, String error) {
        switch (model) {
        }
        try {
            t.save();
            return new JsonResponse(0, ok);
        } catch (Exception e) {
            e.printStackTrace();
            return new JsonResponse(-1, error);
        }
    }
}
