package uk.co.ivandimitrov.postlist.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.hibernate.annotations.GenericGenerator;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class Post {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid")
	private String Id;

	private String title;

	private String comment;

	private Number price;

	@Column(length = 10000)
	private String description;

	private @ManyToOne User User;

	@Column(length = 10000)
	private String[] images;

	private @Version @JsonIgnore Long version;

	public Post(String title, String address, Double price, String description, User User, String... images) {
		this.title = title;
		this.comment = address;
		this.price = price;
		this.description = description;
		this.User = User;
		this.images = images;
	}

}