package com.forum.forum_backend.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record UserDAtaDAO(String username, LocalDate registrationDate, OffsetDateTime lastSeen,String avatarURL) {
}
