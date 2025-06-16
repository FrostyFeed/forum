package com.forum.forum_backend.annotations;


import com.forum.forum_backend.validator.UniqueEmailValidator;
import com.forum.forum_backend.validator.ValidTokenValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ValidTokenValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidToken {
    String message() default "Токен недійсний (сплив термін дії або користувача не існує)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
