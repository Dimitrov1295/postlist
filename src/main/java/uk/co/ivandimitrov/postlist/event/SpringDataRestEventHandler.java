package uk.co.ivandimitrov.postlist.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import uk.co.ivandimitrov.postlist.model.User;
import uk.co.ivandimitrov.postlist.model.UserRepository;
import uk.co.ivandimitrov.postlist.model.Post;

@Component
@RepositoryEventHandler(User.class)
public class SpringDataRestEventHandler {

	private final UserRepository userRepository;

	@Autowired
	public SpringDataRestEventHandler(UserRepository managerRepository) {
		this.userRepository = managerRepository;
	}

	@HandleBeforeCreate
	@HandleBeforeSave
	public void applyUserInformationUsingSecurityContext(Post post) {

		String name = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = this.userRepository.findById(name).orElseThrow();
		if (user == null) {
			User newUser = new User();
			newUser.setName(name);
			newUser.setRoles(new String[] { "ROLE_USER" });
			user = this.userRepository.save(newUser);
		}
		post.setUser(user);
	}

}
