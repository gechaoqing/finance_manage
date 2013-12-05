package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import play.db.jpa.GenericModel;
import utils.Encryption;
@Entity
@Table(name="t_users")
public class Managers extends GenericModel {
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue
	@Column(name="user_id")
	public Integer userId;
	@Column(name="last_login_pc_ip")
	public String lastLoginPcIp;
	@Column(name="last_login_pc_name")
	public String lastLoginPcName;
	@Column(name="user_name")
	public String userName;
	@Column(name="user_account")
	public String userAccount;
	@Column(name="user_pass")
	public String userPass;
	@Column(name="user_pass_salt")
	public String userPassSalt;
	
	private boolean verifyUserPass(String pass) {
		return Encryption.instance().validEncryptedChar(pass, this.userPass, this.userPassSalt);
	}
	
	public static Managers validateUser(String account,String pass){
		Managers u=Managers.find("userAccount=?", account).first();
		if(u!=null){
			if(u.verifyUserPass(pass)){
				return u;
			}else{
				return null;
			}
		}
		return null;
	}
}
