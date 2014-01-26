package models;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import play.db.jpa.GenericModel;
@Entity
@Table(name="t_insurance_agent")
public class InsuranceAgent extends GenericModel {
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue
	@Column(name="agent_id")
	public Integer agentId;
	@Column(name="agent_name")
	public String agentName;
	@Column(name="agent_rebate")
	public Integer agentRebate;
}
