package com.forum.forum_backend.exeptions;

import lombok.Getter;
import org.springframework.security.authentication.AccountStatusException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Getter
public class UserIsBanned extends AccountStatusException {
    private  String duration;
    private  String reason;
    public UserIsBanned(LocalDateTime duration, String reason){
        super("User is for %s for reason: %s".formatted(duration,reason));
        setFields(duration,reason);
    }
    public UserIsBanned(LocalDateTime duration,String reason,Throwable cause){
        super("User is for %s for reason: %s".formatted(duration,reason),cause);
        setFields(duration,reason);
    }
    public void setFields(LocalDateTime duration,String reason){
        Duration duration1 = Duration.between(LocalDateTime.now(),duration).abs();
        this.duration = String.format("%d днів %d годин %02d хвилин",duration1.toDays(),duration1.toHours() % 24,duration1.toMinutes()%60);
        this.reason = reason;

    }
}
