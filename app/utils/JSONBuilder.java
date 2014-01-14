package utils;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JSONBuilder {
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
