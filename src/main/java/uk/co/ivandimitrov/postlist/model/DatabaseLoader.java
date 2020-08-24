package uk.co.ivandimitrov.postlist.model;

import java.util.concurrent.ThreadLocalRandom;

import com.thedeanda.lorem.Lorem;
import com.thedeanda.lorem.LoremIpsum;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

	private final PostRepository postRepository;

	private final UserRepository agentRepository;

	private final Lorem lorem;

	@Autowired
	public DatabaseLoader(PostRepository postRepository, UserRepository agentRepository, LoremIpsum loremIpsum) {
		this.postRepository = postRepository;
		this.agentRepository = agentRepository;
		this.lorem = loremIpsum;
	}

	@Override
	public void run(String... strings) throws Exception {
		SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("user1",
				"password", AuthorityUtils.createAuthorityList("ROLE_AGENT")));

		User agent1 = this.agentRepository.save(new User("user1", "password", lorem.getPhone(), "ROLE_USER"));
		User agent2 = this.agentRepository.save(new User("user2", "password", lorem.getPhone(), "ROLE_USER"));

		for (int i = 0; i < 8; i++) {
			load(agent1);
		}
		SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("user2",
				"password", AuthorityUtils.createAuthorityList("ROLE_AGENT")));

		for (int i = 0; i < 90; i++) {
			load(agent2);
		}
	}

	private void load(User agent) {
		ThreadLocalRandom random = ThreadLocalRandom.current();
		int numberOfImages = random.nextInt(5, 10);
		String[] images = new String[numberOfImages];
		for (int i = 0; i < numberOfImages; i++) {
			int j = random.nextInt(10000);
			images[i] = "https://source.unsplash.com/random?sig=" + j;
		}
		this.postRepository.save(new Post(lorem.getTitle(2, 6), lorem.getTitle(3, 7), (double) random.nextInt(1000),
				lorem.getParagraphs(2, 6), agent, images));
	}

}