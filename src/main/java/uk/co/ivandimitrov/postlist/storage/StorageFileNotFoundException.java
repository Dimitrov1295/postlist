package uk.co.ivandimitrov.postlist.storage;

public class StorageFileNotFoundException extends StorageException {

    /**
     *
     */
    private static final long serialVersionUID = -1301296804517984544L;

    public StorageFileNotFoundException(String message) {
        super(message);
    }

    public StorageFileNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
