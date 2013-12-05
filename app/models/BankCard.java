package models;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import play.db.jpa.GenericModel;
@Entity
@Table(name="t_card")
public class BankCard extends GenericModel {
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue
	@Column(name="card_id")
	public Integer cardId;
	@Column(name="card_name")
	public String cardName;
	@Column(name="add_date")
	public Timestamp addDate;
}
