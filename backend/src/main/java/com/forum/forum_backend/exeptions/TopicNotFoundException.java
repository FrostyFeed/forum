package com.forum.forum_backend.exeptions;

public class TopicNotFoundException extends RuntimeException {
    public TopicNotFoundException(String s) {
        super(s);
    }
}
