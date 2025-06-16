package com.forum.forum_backend.annotations;


import com.forum.forum_backend.validator.TokenAlreadyVerifiedValidator;
import com.forum.forum_backend.validator.ValidTokenValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = TokenAlreadyVerifiedValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface TokenAlreadyVerified {
    String message() default "Електронну пошту вже підтверджено";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
