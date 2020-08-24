package uk.co.ivandimitrov.postlist.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties("storage")
public class StorageProperties {

	/**
	 * Folder location for storing files
	 */
	private String location = System.getProperty("java.io.tmpdir") + "/src/main/resources/static/images";

}
