package com.forum.forum_backend.handlers;

import com.forum.forum_backend.exeptions.*;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> handleInvalidExceptions(MethodArgumentNotValidException ex){
        Map<String,String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(),error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<?> handleExpiredJwtException(ExpiredJwtException ex) {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String,String>> invalidCredentials(InvalidCredentialsException ex){
        Map <String,String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
    @ExceptionHandler(UserAlreadyHasBeenBannedException.class)
    public ResponseEntity<String> userHasBeenBanned(UserAlreadyHasBeenBannedException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
    @ExceptionHandler(ReportHasBeenReviewed.class)
    public ResponseEntity<String> reportHasBeenReviewed(ReportHasBeenReviewed ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
    @ExceptionHandler(NotYourEntity.class)
    public ResponseEntity<String> notYourEntity(NotYourEntity ex){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> userNotFound(UserNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
    @ExceptionHandler(UserAlreadyVerifiedException.class)
    public ResponseEntity<String> userAlreadyVerified(UserAlreadyVerifiedException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
    @ExceptionHandler(TopicNotFoundException.class)
    public ResponseEntity<String> topicNotFound(TopicNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
