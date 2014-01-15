package utils;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JSONBuilder {
    public static Map<Object, Object> paginationList(Pagination page, List<?> list) {
        return paginationList(page, list, List.class);
    }

    public static Map<Object, Object> paginationList(Pagination page, List<?> list,
                                              Class<?>... filter) {
        return paginationList(page, list, null, filter);
    }

    public static Map<Object, Object> paginationList(Pagination page, List<?> list,
                                              String... fields) {
        return paginationList(page, list, fields, List.class);
    }
   public static Map<Object, Object> paginationList(Pagination page, List<?> list,
                                              String[] fields, Class<?>... filter) {
        Map<Object, Object> map = new HashMap<Object, Object>();
        Gson gson = build(fields, filter);
        String listStr = gson.toJson(list);
        map.put("page", page);
        map.put("list", listStr);
        return map;
    }
    public static Gson build(final Class<?>... skip){
        return build(null,skip);
    }
    public static Gson build(final String...field){
        return build(field,null);
    }
	public static Gson build(final String[] field,final Class<?>... skip){
		Gson gson=new GsonBuilder().addSerializationExclusionStrategy(new ExclusionStrategy() {
			
			@Override
			public boolean shouldSkipField(FieldAttributes f) {
                if(field!=null)
                for(String fi:field){
                    if(fi.equals(f.getName())){
                        return true;
                    }
                }
				return false;
			}
			
			@Override
			public boolean shouldSkipClass(Class<?> cla) {
                if(skip!=null)
                for(Class<?> c:skip){
                    if(c==cla){
                        return true;
                    }
                }
				return false;
			}
		}).serializeNulls().setDateFormat("yyyy-MM-dd").create();
		return gson;
	}
}
