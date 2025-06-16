package com.forum.forum_backend.exeptions;

public class NotYourEntity extends RuntimeException{
    public NotYourEntity(){
        super("Not your entity");
    }
}
