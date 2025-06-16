package com.forum.forum_backend.exeptions;

public class UserAlreadyVerifiedException extends RuntimeException {
    public UserAlreadyVerifiedException(String s) {
        super(s);
    }
}
