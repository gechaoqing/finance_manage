String.prototype.startsWith = function(str) {
	return this.indexOf(str) == 0;
};
String.prototype.endsWith = function(str) {
	return this.slice(-str.length) == str;
};
String.prototype.replaceAll= function(str1,str2){
    return this.replace(new RegExp(str1,"gm"),str2);  
};
String.prototype.trim= function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");  
};
String.prototype.isEmpty=function(){
	return this.trim()=="";
};