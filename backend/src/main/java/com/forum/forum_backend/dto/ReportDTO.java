package com.forum.forum_backend.dto;

import com.forum.forum_backend.entity.Report;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record ReportDTO(int id,int userId ,String reason, String avatarUrl, String nickname, OffsetDateTime reportCreationDate,
                        LocalDate userRegistrationDate, String postContent, OffsetDateTime postCreationDate,String threadTittle,int threadId) {
    public ReportDTO(Report report){
        this(report.getId(),report.getUser().getId() ,report.getReason(), report.getUser().getAvatarUrl(), report.getUser().getUsername(),report.getCreationDate(),report.getUser().getRegisterDate(),
                report.getReply() != null ? report.getReply().getContent() :
                        report.getThread() != null ? report.getThread().getContent() : null,
                report.getReply() != null ? report.getReply().getCreationDate() :
                        report.getThread() != null ? report.getThread().getCreationDate() : null,
                report.getReply() != null ? report.getReply().getThread().getTittle() :
                        report.getThread() != null ? report.getThread().getTittle() : null,
                report.getReply() != null ? report.getReply().getThread().getId() :
                        report.getThread() != null ? report.getThread().getId() : null);

    }
}
