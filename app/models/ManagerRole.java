package models;

import java.sql.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import play.db.jpa.Model;
@Entity
@Table(name="t_manager_roles")
public class ManagerRole extends Model {
	public String name;
	@Column(name="last_update_date")
	public Date updateAt;
	@Column(name="create_date")
	public Date createAt;
	
	@ManyToMany(cascade={CascadeType.REFRESH,CascadeType.MERGE,CascadeType.PERSIST},mappedBy="roles")
	public List<Managers> managers;
	
	@ManyToMany(cascade={CascadeType.REFRESH,CascadeType.MERGE,CascadeType.PERSIST})
	@JoinTable(name = "t_roles_privileges",inverseJoinColumns =@JoinColumn(name="privilege_id"), joinColumns = @JoinColumn(name = "role_id"))
	public List<ManagerPrivilege> privileges;
	
	public void addPrivilege(ManagerPrivilege privi){
		if(!this.privileges.contains(privi)){
			this.privileges.add(privi);
		}
	}
	
	public void removePrivilege(ManagerPrivilege privi){
		if(this.privileges.contains(privi)){
			this.privileges.remove(privi);
			em().merge(this);
		}
	}
}
