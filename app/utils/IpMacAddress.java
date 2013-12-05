package utils;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import play.mvc.Http.Header;
import play.mvc.Http.Request;

public class IpMacAddress {
	private static IpMacAddress address=new IpMacAddress();
	private IpMacAddress(){}
	public static IpMacAddress instance(){
		return address;
	}
	public String getIpAddress(Request request) {
		String ipAddress = null;
		Header header=null;
		header=request.headers.get("x-forwarded-for");
		if(header!=null)
		{
			ipAddress = header.value();
		}
		if (ipAddress == null || ipAddress.length() == 0
				|| "unknown".equalsIgnoreCase(ipAddress)) {
			header=request.headers.get("Proxy-Client-IP");
			if(header!=null)
			ipAddress = header.value();
		}
		if (ipAddress == null || ipAddress.length() == 0
				|| "unknown".equalsIgnoreCase(ipAddress)) {
			header=request.headers.get("WL-Proxy-Client-IP");
			if(header!=null)
			ipAddress = header.value();
		}
		if (ipAddress == null || ipAddress.length() == 0
				|| "unknown".equalsIgnoreCase(ipAddress)) {
			ipAddress = request.remoteAddress;
			if (ipAddress.equals("127.0.0.1")||ipAddress.equals("0:0:0:0:0:0:0:1")) {
				InetAddress inet = null;
				try {
					inet = InetAddress.getLocalHost();
				} catch (UnknownHostException e) {
					e.printStackTrace();
				}
				ipAddress = inet.getHostAddress();
			}
		}
		if (ipAddress != null && ipAddress.length() > 15) { 
			if (ipAddress.indexOf(",") > 0) {
				ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));
			}
		}
		return ipAddress;
	}
	
	public Map<String,String> getAddress(Request request){
		Map<String,String> addressMap=new HashMap<String, String>();
		String ip=getIpAddress(request);
		addressMap.put("ip", ip);
		String mac=getMacAddress(ip);
		addressMap.put("mac", mac);
		return addressMap;
	}
	
	public String getMacAddress(String ip){
		try {
			InetAddress address = InetAddress.getByName(ip);
			NetworkInterface ni = NetworkInterface.getByInetAddress(address);
			if (ni != null) {
				byte[] mac = ni.getHardwareAddress();
				if (mac != null) {
					StringBuilder macStr=new StringBuilder();
					for (int i = 0; i < mac.length; i++) {
						macStr.append(String.format("%02X%s", mac[i],(i < mac.length - 1) ? "-" : ""));
					}
					return macStr.toString();
				} else {
					System.out
							.println("Address doesn't exist or is not accessible.");
					return null;
				}
			} else {
				System.out
						.println("Network Interface for the specified address is not found.");
				return null;
			}
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (SocketException e) {
			e.printStackTrace();
		}
		return null;
	}
	public static String [] getMacAddresses()  
    {  
        try {  
            Enumeration<NetworkInterface> nis = NetworkInterface.getNetworkInterfaces();  
            ArrayList<String> macs = new ArrayList<String>();  
            while( nis.hasMoreElements() ) {  
                String mac = macToString( nis.nextElement() );  
                if( mac != null ) {  
                    macs.add( mac );  
                }  
            }  
            return macs.toArray( new String[0] );  
        } catch( SocketException ex ) {  
            System.err.println( "SocketException:: " + ex.getMessage() );  
            ex.printStackTrace();  
        } catch( Exception ex ) {  
            System.err.println( "Exception:: " + ex.getMessage() );  
            ex.printStackTrace();  
        }  
  
        return new String[0]; 
    }
	public static String macToString( NetworkInterface ni, String separator, String format ) throws SocketException  
    {  
        byte mac [] = ni.getHardwareAddress();    
        if( mac != null ) {  
            StringBuffer macAddress = new StringBuffer( "" );  
            String sep = "";  
            for( byte o : mac ) {  
                macAddress.append( sep ).append( String.format( format, o ) );  
                sep = separator;  
            }  
            return macAddress.toString();  
        }  
  
        return null;  
    }
	public static String macToString( NetworkInterface ni ) throws SocketException  
    {  
        return macToString( ni, "-",  "%02X" );  
    }
	public static void main(String[] a){
		String[] as=getMacAddresses();
		for (String s : as) {
			System.out.println(s);
		}
	}
       
}
