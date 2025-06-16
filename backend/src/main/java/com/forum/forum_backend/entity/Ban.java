package com.forum.forum_backend.entity;

import com.forum.forum_backend.events.HasStatsType;
import com.forum.forum_backend.events.StatsEntityListener;
import com.forum.forum_backend.utility.BanStatus;
import com.forum.forum_backend.utility.StatsType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "bans")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners({StatsEntityListener.class})
public class Ban implements HasStatsType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "reason")
    private String reason;
    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User bannedUser;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private User admin;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id",unique = true)
    private Report report;
    @Column(name = "status")
    @Enumerated(value = EnumType.STRING)
    private BanStatus status;
    @Transient
    private final StatsType statsType = StatsType.BAN;
}
