package com.forum.forum_backend.repository;

import com.forum.forum_backend.entity.Stats;
import com.forum.forum_backend.utility.StatsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface StatsRepository extends JpaRepository<Stats,Integer> {
    @Modifying
    @Transactional
    @Query(value = "UPDATE Stats s SET s.amount = s.amount + 1 WHERE s.date = :date AND s.type = :type")
    int increaseCount(@Param("date")String date, @Param("type") StatsType type);
    @Query(value = "SELECT * FROM stats WHERE date LIKE :year AND type = :type",nativeQuery = true)
    List<Stats> getStatsForYear(@Param("year")String year, @Param("type")String type);
}
