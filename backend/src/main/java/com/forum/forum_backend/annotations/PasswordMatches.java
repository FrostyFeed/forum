package com.forum.forum_backend.annotations;

import com.forum.forum_backend.validator.PasswordMatchesValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordMatchesValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordMatches {
    String message() default "Паролі не співпадають";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
