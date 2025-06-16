package com.forum.forum_backend.repository;

import com.forum.forum_backend.entity.Report;
import com.forum.forum_backend.utility.ReportStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ReportRepository extends JpaRepository<Report,Integer> {
    @Query("SELECT r FROM Report r WHERE r.status = :status")
    public Slice<Report> getRepliesForReview(@Param("status") ReportStatus status, Pageable pageable);
    @Modifying
    @Transactional
    @Query("UPDATE Report r SET r.status = :status WHERE r.id = :id")
    void updateStatus(@Param("status") ReportStatus status,@Param("id") int reportId);
    @Query("SELECT r.status FROM Report r WHERE r.id = :id")
    ReportStatus getReportStatus(@Param("id") int reportId);
    @Query("SELECT r FROM Report r where r.id = :id")
    Report getReportForUpdate(@Param("id")int id);
}
