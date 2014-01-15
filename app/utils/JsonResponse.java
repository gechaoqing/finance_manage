package utils;

public class JsonResponse {
	public int responseCode;
	public String response;
	public JsonResponse(){}
	public JsonResponse(int code,String res){
		responseCode=code;
		response=res;
	}
}
