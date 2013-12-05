package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import play.db.jpa.GenericModel;
@Entity
@Table(name="t_ip_limit")
public class IPLimit extends GenericModel {
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue
	@Column(name="ip_id")
	public Integer ipId;
	@Column(name="ip_value")
	public String ipValue;
	
	public static boolean volidIp(String value){
		IPLimit ip=IPLimit.find("ipValue=?", value).first();
		return ip==null?false:true;
	}
}
