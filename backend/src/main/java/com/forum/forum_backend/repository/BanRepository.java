package com.forum.forum_backend.repository;

import com.forum.forum_backend.entity.Ban;
import com.forum.forum_backend.utility.BanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Repository
public interface BanRepository extends JpaRepository<Ban,Integer> {
    @Transactional
    @Modifying
    @Query("UPDATE Ban b SET b.status = :expired WHERE b.status = :active AND b.expirationDate <= :date")
    int unbanUsers(@Param("expired") BanStatus expired,@Param("active")BanStatus active, @Param("date") LocalDateTime currentDate);
}
