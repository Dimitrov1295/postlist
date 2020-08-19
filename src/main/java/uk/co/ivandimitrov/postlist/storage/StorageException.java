package uk.co.ivandimitrov.postlist.storage;

public class StorageException extends RuntimeException {
    /**
     *
     */
    private static final long serialVersionUID = 3104819884719620121L;

    public StorageException(String message) {
        super(message);
    }

    public StorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
