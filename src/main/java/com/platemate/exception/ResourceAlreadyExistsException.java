package com.platemate.exception;

public class ResourceAlreadyExistsException extends RuntimeException {
    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
    
    public ResourceAlreadyExistsException(String resourceName, String identifier) {
        super(String.format("%s already exists with identifier: %s", resourceName, identifier));
    }
}
