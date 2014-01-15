package models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import play.db.jpa.Model;
@Entity
@Table(name="t_manager_privileges")
public class ManagerPrivilege extends Model {
	public String name;
	public String value;
	public String url;
	public String icon;
	
	@ManyToMany(cascade={CascadeType.REFRESH,CascadeType.MERGE,CascadeType.PERSIST},mappedBy="privileges")
	public List<ManagerRole> roles;
	
	public List<ManagerPrivilege> getChildren(List<ManagerPrivilege> has){
		List<ManagerPrivilege> children=ManagerPrivilege.find("parent=?", this.id).fetch();
		List<ManagerPrivilege> temp=new ArrayList<ManagerPrivilege>();
		for (ManagerPrivilege mp : children) {
			if(has.contains(mp)){
				temp.add(mp);
			}
		}
		return temp;
	}
}
