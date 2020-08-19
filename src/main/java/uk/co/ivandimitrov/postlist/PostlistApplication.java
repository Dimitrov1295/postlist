package uk.co.ivandimitrov.postlist;

import com.thedeanda.lorem.Lorem;
import com.thedeanda.lorem.LoremIpsum;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

import uk.co.ivandimitrov.postlist.storage.StorageProperties;
import uk.co.ivandimitrov.postlist.storage.StorageService;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class PostlistApplication {

	public static void main(String[] args) {
		SpringApplication.run(PostlistApplication.class, args);
	}

	@Bean
	public Lorem getLorem() {
		return LoremIpsum.getInstance();
	}

	@Bean
	public LoremIpsum getLoremIpsum() {
		return new LoremIpsum();
	}

	@Bean
	CommandLineRunner init(StorageService storageService, StorageProperties storageProperties) {
		return (args) -> {
			storageService.deleteAll(storageProperties.getLocation());
			storageService.init();
		};
	}

}
