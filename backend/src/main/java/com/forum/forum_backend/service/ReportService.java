package com.forum.forum_backend.service;

import com.forum.forum_backend.dto.CreateReportRequestDTO;
import com.forum.forum_backend.dto.ReportDTO;
import com.forum.forum_backend.dto.SliceResponse;
import com.forum.forum_backend.entity.Reply;
import com.forum.forum_backend.entity.Report;
import com.forum.forum_backend.entity.Threads;
import com.forum.forum_backend.entity.User;
import com.forum.forum_backend.exeptions.ReportHasBeenReviewed;
import com.forum.forum_backend.interfaces.Post;
import com.forum.forum_backend.repository.RepliesRepository;
import com.forum.forum_backend.repository.ReportRepository;
import com.forum.forum_backend.repository.ThreadRepository;
import com.forum.forum_backend.repository.UserRepository;
import com.forum.forum_backend.utility.ReportStatus;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;
    private final ThreadService threadService;
    private final ReplyService replyService;


    public String createReport(CreateReportRequestDTO createReportRequestDTO){
        boolean isReply = createReportRequestDTO.type().equals("reply");
        Post post = isReply ? replyService.findById(createReportRequestDTO.postId())
                : threadService.findById(createReportRequestDTO.postId())
                .orElseThrow(() -> new EntityNotFoundException("Пост не знайдено"));
        User user = post.getUser();
        Report report = Report.builder().user(user)
                .creationDate(OffsetDateTime.now())
                .reason(createReportRequestDTO.reason()).
                reply(isReply ? (Reply) post : null)
                .thread(isReply ? null : (Threads) post)
                .status(ReportStatus.REVIEW).build();
        reportRepository.save(report);
        return "OK";
    }
    public SliceResponse<ReportDTO> getReportsForReview(Pageable pageable){
        Slice<Report> reportsSlice = reportRepository.getRepliesForReview(ReportStatus.REVIEW,pageable);
        Slice<ReportDTO> reportDTOSlice = reportsSlice.map(ReportDTO::new);
        return new SliceResponse<>(reportDTOSlice);
    }

    public String dismissReport(int reportId) {
        if (reportRepository.getReportStatus(reportId) == ReportStatus.REVIEW)
            reportRepository.updateStatus(ReportStatus.DISMISSED,reportId);
        else{
            throw new ReportHasBeenReviewed();
        }
        return "OK";
    }
    public void updateStatus(int id,ReportStatus status){
        Report report = reportRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Скаргу не знайдено"));
        report.setStatus(status);
        reportRepository.save(report);

    }

    public Optional<Report> findById(int i) {
        return reportRepository.findById(i);
    }
}
