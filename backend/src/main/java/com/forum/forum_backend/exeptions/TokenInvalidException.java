package com.forum.forum_backend.exeptions;

public class TokenInvalidException extends RuntimeException{
    public TokenInvalidException(String text){
        super(text);
    }
}
