package com.forum.forum_backend.validator;

import com.forum.forum_backend.annotations.ValidToken;
import com.forum.forum_backend.repository.UserRepository;
import com.forum.forum_backend.utility.JWTUtility;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ValidTokenValidator implements ConstraintValidator<ValidToken,String> {
    private final JWTUtility jwtUtility;
    private final UserRepository userRepository;
    @Override
    public boolean isValid(String token, ConstraintValidatorContext context){
        return jwtUtility.validateToken(token,userRepository);
    }
}
