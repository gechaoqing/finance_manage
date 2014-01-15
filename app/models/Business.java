package models;

import play.db.jpa.GenericModel;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by Administrator on 14-1-15.
 */
@Entity
@Table(name = "t_business")
public class Business extends GenericModel{
    @Id
    @Column(name = "business_id")
    public Integer businessId;
    @Column(name = "business_name")
    public String businessName;
    @Column(name = "business_store")
    public String businessStore;
}
