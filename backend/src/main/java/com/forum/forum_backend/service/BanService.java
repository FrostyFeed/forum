package com.forum.forum_backend.service;

import com.forum.forum_backend.dto.BanPOSTRequestDTO;
import com.forum.forum_backend.entity.*;
import com.forum.forum_backend.exeptions.UserAlreadyHasBeenBannedException;
import com.forum.forum_backend.repository.*;
import com.forum.forum_backend.utility.BanStatus;
import com.forum.forum_backend.utility.ReportStatus;
import com.forum.forum_backend.utility.Status;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BanService {
    private final BanRepository banRepository;
    private final UserService userService;
    private final ReportService reportService;
    private final ThreadService threadService;
    private final ReplyService replyService;
    private static final String DELETED_BY_ADMIN_CONTENT = "<p style=\"color:red;\">Видалено адміністратором.</p>";

    public String createBan(BanPOSTRequestDTO banRequest) {
        User bannedUser = userService.getReferenceById(banRequest.bannedUserId());
        User admin = userService.getReferenceById(banRequest.adminId());
        Report report = reportService.findById(banRequest.reportId()).orElseThrow();
        if(report.getStatus() != ReportStatus.REVIEW){
            throw new UserAlreadyHasBeenBannedException();
        }
        reportService.updateStatus(banRequest.reportId(), ReportStatus.GRANTED);
        if(banRequest.deletePostContent())
            deletePostContent(report.getId());
        Ban ban = Ban.builder()
                .reason(banRequest.reason())
                .bannedUser(bannedUser)
                .admin(admin)
                .status(BanStatus.ACTIVE)
                .expirationDate(LocalDateTime.now().plusDays(banRequest.duration()))
                .report(report)
                .build();
        banRepository.save(ban);
        userService.updateUserStatus(Status.BANNED, banRequest.bannedUserId());
        return "OK";

    }
    public void deletePostContent(int reportId){
        Report report = reportService.findById(reportId)
                .orElseThrow(() -> new EntityNotFoundException("Звіт з ID " + reportId + " не знайдено."));

        Optional<Threads> optionalThread = Optional.ofNullable(report.getThread());

        optionalThread.ifPresentOrElse(
                thread -> {
                    thread.setContent(DELETED_BY_ADMIN_CONTENT);
                    threadService.save(thread);
                },
                () -> {
                    Reply reply = Optional.ofNullable(report.getReply())
                            .orElseThrow(() -> new EntityNotFoundException(
                                    "Некоректний стан звіту: Звіт з ID " + reportId + " не має пов’язаного Thread або Reply."
                            ));

                    reply.setContent(DELETED_BY_ADMIN_CONTENT);
                    replyService.save(reply);
                }
        );

    }
}
