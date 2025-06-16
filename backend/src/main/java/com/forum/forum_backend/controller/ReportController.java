package com.forum.forum_backend.controller;

import com.forum.forum_backend.dto.CreateReportRequestDTO;
import com.forum.forum_backend.dto.ReportDTO;
import com.forum.forum_backend.dto.SliceResponse;
import com.forum.forum_backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {
    private final ReportService reportService;

    @PostMapping("/reports")
    public ResponseEntity<String> createReport(@RequestBody CreateReportRequestDTO createReportRequestDTO){
        return ResponseEntity.ok(reportService.createReport(createReportRequestDTO));
    }
    @GetMapping("/reports")
    public ResponseEntity<SliceResponse<ReportDTO>> getReports(@RequestParam int page){
        Sort sort = Sort.by("creationDate").descending();
        Pageable pageable = PageRequest.of(page,1,sort);
        return ResponseEntity.ok(reportService.getReportsForReview(pageable));
    }
    @PostMapping("/reports/dismiss")
    public ResponseEntity<String> dismissReport(@RequestParam int reportId){
        return ResponseEntity.ok(reportService.dismissReport(reportId));
    }
}
