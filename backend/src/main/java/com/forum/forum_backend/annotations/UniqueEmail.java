package com.forum.forum_backend.annotations;

import com.forum.forum_backend.validator.UniqueEmailValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = UniqueEmailValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface UniqueEmail {
    String message() default "Електронна пошта вже використовується";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
