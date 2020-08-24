package uk.co.ivandimitrov.postlist.config;

import java.util.concurrent.ThreadLocalRandom;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import uk.co.ivandimitrov.postlist.model.Post;
import uk.co.ivandimitrov.postlist.storage.StorageService;

@Component
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

	static final String MESSAGE_PREFIX = "/topic";

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/properties").withSockJS();
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker(MESSAGE_PREFIX);
		registry.setApplicationDestinationPrefixes("/app");
	}

	@Component
	@RepositoryEventHandler(Post.class)
	public class PostEventHandler {

		private final SimpMessagingTemplate websocket;

		private final EntityLinks entityLinks;

		private final StorageService storageService;

		@Autowired
		public PostEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks,
				StorageService storageService) {
			this.websocket = websocket;
			this.entityLinks = entityLinks;
			this.storageService = storageService;
		}

		@HandleAfterCreate
		public void newpost(Post post) {
			ObjectMapper mapper = new ObjectMapper();
			ObjectNode message = mapper.createObjectNode();
			message.put("path", getPath(post));
			message.put("user", SecurityContextHolder.getContext().getAuthentication().getName());
			this.websocket.convertAndSend(MESSAGE_PREFIX + "/newPost", message);
		}

		@HandleAfterDelete
		public void deletepost(Post post) {
			if (post.getImages().length > 0 && post.getImages()[0].contains("images/")) {
				this.storageService.deleteAll(post.getImages()[0].split("/")[1]);
			}
			this.websocket.convertAndSend(MESSAGE_PREFIX + "/deletePost", getPath(post));
		}

		@HandleAfterSave
		public void updatepost(Post post) {
			this.websocket.convertAndSend(MESSAGE_PREFIX + "/updatePost", getPath(post));
		}

		@HandleBeforeCreate
		public void beforeCreate(Post post) {
			ThreadLocalRandom random = ThreadLocalRandom.current();
			int numberOfImages = random.nextInt(5, 10);
			String[] images = new String[numberOfImages];
			for (int i = 0; i < numberOfImages; i++) {
				int j = random.nextInt(10000);
				images[i] = "https://source.unsplash.com/random?sig=" + j;
			}
			post.setImages(images);
		}

		/**
		 * Take an {@link Post} and get the URI using Spring Data REST's
		 * {@link EntityLinks}.
		 * @param post
		 */
		private String getPath(Post post) {
			return this.entityLinks.linkForItemResource(post.getClass(), post.getId()).toUri().getPath();
		}

	}

}