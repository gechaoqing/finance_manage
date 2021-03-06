package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import play.db.jpa.GenericModel;

import java.util.Date;

@Entity
@Table(name = "t_print_record")
public class MonadPrintRecord extends GenericModel {
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue
	@Column(name = "record_id")
	public Integer recordId;
	@Column(name = "print_date")
	public Date printDate;
	@Column(name = "client_name")
	public String clientName;
//	@Column(name = "agent_id")
//	public Integer insuranceAgentId;
//	@ManyToOne
//	@JoinColumn(name="agent_id")
//	public InsuranceAgent agent;
    @Column(name="agent_name")
    public String agentName;
	@Column(name = "tevel_tax")
	public Float tavelTax;// 车船税
//	@Column(name = "insurace_type_id")
//	public Integer insuraceTypeId;// 0-交通强制险，1-商业险
    @Column(name = "insurance_type_name")
    public String insuranceTypeName;
	@Column(name = "sum")
	public Float sum;
	@Column(name = "invoice_no")
	public String invoiceNo;// 发票号
	@Column(name = "insurance_no")
	public String insuranceNo;// 保单号
	@Column(name = "insurance_serial_no")
	public String insuranceSerialNo;// 保单流水号
	@Column(name = "business_name")
	public String businessName;// 商家
//	@Column(name = "card_id")
//	public Integer cardId;
    @Column(name = "card_name")
    public String cardName;
	@Column(name = "payment")
	public String payment;
//	@Column(name = "user_id")
//	public Integer operatUserId;
    @Column(name = "user_name")
    public String userName;
	@Column(name = "back_off")
	public String backOff = "回销";// 回销

}
