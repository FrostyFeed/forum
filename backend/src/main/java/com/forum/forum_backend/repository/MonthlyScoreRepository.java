package com.forum.forum_backend.repository;

import com.forum.forum_backend.entity.MonthlyScore;
import com.forum.forum_backend.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyScoreRepository extends JpaRepository<MonthlyScore,Integer> {
    @Query("SELECT m FROM MonthlyScore m WHERE m.user = :user AND m.date = :yearMonth")
    Optional<MonthlyScore> findUserScoreByYearMonth(
            @Param("user") User user,
            @Param("yearMonth") String yearMonth
    );
    @Modifying
    @Transactional
    @Query("UPDATE MonthlyScore m SET m.reputation = m.reputation + 1 WHERE m.id = :id")
    void addScore(@Param("id") int id);
    @Modifying
    @Transactional
    @Query("UPDATE MonthlyScore m SET m.reputation = m.reputation - 1 WHERE m.id = :id")
    void removeScore(@Param("id") int id);
    List<MonthlyScore> findTop10ByDateOrderByReputationDesc(String yearMonth);

}
