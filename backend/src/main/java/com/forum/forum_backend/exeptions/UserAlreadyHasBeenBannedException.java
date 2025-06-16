package com.forum.forum_backend.exeptions;

public class UserAlreadyHasBeenBannedException extends RuntimeException{
    public UserAlreadyHasBeenBannedException(){
        super("User already has been banned");
    }
}
