package com.hahn.taskmanager.exception;

/**
 * Custom exception for access denied scenarios (403 Forbidden)
 */
public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException(String message) {
        super(message);
    }
}