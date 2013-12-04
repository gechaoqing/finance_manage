package utils;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;


public class PropertiesUtils {
	private static PropertiesUtils pu=new PropertiesUtils();
	private PropertiesUtils(){}
	public static PropertiesUtils instance(){
		return pu;
	}
	public Properties $(String conf){
		try {
			FileInputStream ins = new FileInputStream(conf);
			return $(ins);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} 
		return null;
	}
	
	public Properties $(InputStream ins){
		Properties prop=new Properties();
		try {
			prop.load(ins);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return prop;
	}
	
}
