package com.forum.forum_backend.utility;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    @Async
    public void sendVerificationEmail(String to,String verificationLink){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("vlad.negerey1@gmail.com");
        message.setTo(to);
        message.setSubject("Підтвердження електронної пошти");
        message.setText("http://localhost:5173/user/verification/" + verificationLink);
        mailSender.send(message);
    }
    @Async
    public void sendPasswordRestEmail(String to,String jwt){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("vlad.negerey1@gmail.com");
        message.setTo(to);
        message.setSubject("Скидання пароля");
        message.setText("http://localhost:5173/user/password-reset/" + jwt);
        mailSender.send(message);

    }
}
