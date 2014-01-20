package controllers;

/**
 * Created by Administrator on 14-1-20.
 */
public class ManageUtils {
    static String genKeys(String[] key, boolean sp, String... value) {
        if (key == null)
            return "";
        StringBuilder sbk = new StringBuilder();
        String split = " and ", OR = " OR ";
        int j = 0;
        for (String k : key) {
            if (k == null) {
                continue;
            }
            if (k.indexOf("%") == 0) {
                sbk.append(split + k.substring(1) + " like ?");
            } else if (k.indexOf(">") == 0 || k.indexOf("<") == 0) {
                sbk.append(split + k.substring(1) + " " + k.substring(0, 1)
                        + "=?");
            } else if (k.indexOf("<>") == 0) {
                sbk.append(split + k.substring(2) + "<>?");
            } else if (k.indexOf("null") == 0) {
                sbk.append(split + k.substring(4) + " is null");
                if (value != null)
                    value[j] = null;
            } else if (k.indexOf("notnull") == 0) {
                sbk.append(split + k.substring(7) + " is not null");
                if (value != null)
                    value[j] = null;
            } else if (k.indexOf("OR") == 0) {
                sbk.append(OR + k.substring(2) + "=?");
            } else {
                sbk.append(split + k + "=?");
            }
            j++;
        }
        return (sp && sbk.length() > 0 ? sbk.indexOf(split) == 0 ? sbk
                .substring(split.length()) : sbk.substring(OR.length()) : sbk
                .toString());
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
}
