package com.forum.forum_backend.exeptions;

public class ReportHasBeenReviewed extends RuntimeException{
    public ReportHasBeenReviewed(){
        super("Report already has been reviewed");
    }
}
