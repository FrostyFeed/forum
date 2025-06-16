package com.forum.forum_backend.validator;

import com.forum.forum_backend.annotations.PasswordMatches;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Component
public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {
    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context){
        try {
            Method getPassword = obj.getClass().getMethod("getPassword");
            Method getConfirmPassword = obj.getClass().getMethod("getConfirmPassword");

            String password = (String) getPassword.invoke(obj);
            String confirmPassword = (String) getConfirmPassword.invoke(obj);


            return password != null && password.equals(confirmPassword);
        } catch (Exception e) {
            e.printStackTrace(); // helpful for debugging
            return false;
        }
    }
}
