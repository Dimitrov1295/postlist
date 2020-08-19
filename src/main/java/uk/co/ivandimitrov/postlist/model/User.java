package uk.co.ivandimitrov.postlist.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class User {
    public static final PasswordEncoder PASSWORD_ENCODER = PasswordEncoderFactories.createDelegatingPasswordEncoder();

    @Id
    private String Name;
    private String[] roles;
    private String phoneNumber;

    private @JsonIgnore String password;

    @Version
    @JsonIgnore
    private Long version;

    public void setPassword(String password) {
        this.password = PASSWORD_ENCODER.encode(password);
    }

    public User(String Name, String password, String phoneNumber, String... roles) {
        this.Name = Name;
        this.setPassword(password);
        this.phoneNumber = phoneNumber;
        this.roles = roles;
    }

}