package com.forum.forum_backend.validator;

import com.forum.forum_backend.annotations.UniqueEmail;
import com.forum.forum_backend.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail,String> {
    @Autowired
    private UserRepository userRepository;
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context){
        return !userRepository.existsByEmail(email);
    }
}
