package com.forum.forum_backend.entity;

import com.forum.forum_backend.events.HasStatsType;
import com.forum.forum_backend.events.StatsEntityListener;
import com.forum.forum_backend.utility.ReportStatus;
import com.forum.forum_backend.utility.StatsType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.OffsetDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
@EntityListeners({StatsEntityListener.class})
public class Report implements HasStatsType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "creation_date")
    private OffsetDateTime creationDate;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id")
    private Threads thread;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_id")
    private Reply reply;
    @Column(name = "reason")
    private String reason;
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ReportStatus status;
    @Transient
    private final StatsType statsType = StatsType.REPORT;
}
