package com.forum.forum_backend.exeptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class InvalidCredentialsException extends RuntimeException{
    public InvalidCredentialsException(){
        super("Invalid credentials");
    }
}
