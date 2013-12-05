package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import play.db.jpa.GenericModel;

@Entity
@Table(name="t_insurace_type")
public class InsuranceType extends GenericModel {
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue
	@Column(name="type_id")
	public Integer typeId;
	@Column(name="type_value")
	public int typeValue;
	@Column(name="type_name")
	public String typeName;
}
