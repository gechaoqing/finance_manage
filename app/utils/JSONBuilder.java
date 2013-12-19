package utils;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JSONBuilder {
	public static Gson build(final Class<?> skip){
		Gson gson=new GsonBuilder().addSerializationExclusionStrategy(new ExclusionStrategy() {
			
			@Override
			public boolean shouldSkipField(FieldAttributes f) {
				return false;
			}
			
			@Override
			public boolean shouldSkipClass(Class<?> cla) {
				if(cla==skip){
					return true;
				}
				return false;
			}
		}).serializeNulls().setDateFormat("yyyy-MM-dd").create();
		return gson;
	}
}
