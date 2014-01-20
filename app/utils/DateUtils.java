package utils;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class DateUtils {
    static SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
	public static Date getNowDate() {
		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
		java.util.Date utilDate = new java.util.Date();
		Date sqlDate = new Date(utilDate.getTime());
		return Date.valueOf(f.format(sqlDate));
	}

	public static String getDaysNearStr(int near){
		return f.format(getDaysNear(near));
	}

    public static Date getDaysNear(int near){
        Calendar cal = Calendar.getInstance();//使用默认时区和语言环境获得一个日历。
        cal.add(Calendar.DAY_OF_MONTH, near);
        return Date.valueOf(f.format(cal.getTime()));
    }
	
	public static String getMonthNearStr(int near){
		Calendar cal = Calendar.getInstance();//使用默认时区和语言环境获得一个日历。
		cal.set(Calendar.DAY_OF_MONTH,cal.getActualMinimum(Calendar.DAY_OF_MONTH));  
		cal.add(Calendar.MONTH, near);
		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
		return f.format(cal.getTime());
	}
	
	public static Timestamp getNowTimestamp(){
		java.util.Date utilDate = new java.util.Date();
		return new Timestamp(utilDate.getTime());
	}
	
	public static Timestamp convertTimestamp(Timestamp time){
		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return Timestamp.valueOf(f.format(time));
	}
	
	@SuppressWarnings("deprecation")
	public static java.util.Date parse(String time){
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		try {
			return dateFormat.parse(time);
		} catch (ParseException e) {
			return new Date(Date.parse(time));
		} 
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String ls="13438340391";
		String phone="3834";
		int de=ls.indexOf(phone);
		ls=ls.substring(0,de)+"["+phone+"]"+ls.substring(de+phone.length());
		System.out.println(ls);
	}

}
