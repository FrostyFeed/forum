package com.forum.forum_backend.validator;

import com.forum.forum_backend.annotations.TokenAlreadyVerified;
import com.forum.forum_backend.repository.UserRepository;
import com.forum.forum_backend.utility.JWTUtility;
import com.forum.forum_backend.utility.Status;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TokenAlreadyVerifiedValidator implements ConstraintValidator<TokenAlreadyVerified,String> {
    private final UserRepository userRepository;
    private final JWTUtility jwtUtility;
    @Override
    public boolean isValid(String token, ConstraintValidatorContext context){
        String email = jwtUtility.extractEmail(token);
        return !userRepository.getStatusByEmail(email).equals(Status.VERIFIED);
    }
}
