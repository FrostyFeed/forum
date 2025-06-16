package com.forum.forum_backend.repository;

import com.forum.forum_backend.entity.NewsReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface NewsReactionRepository extends JpaRepository<NewsReaction,Integer> {
    @Transactional
    @Modifying
    @Query("DELETE FROM NewsReaction n WHERE n.news.id = :id")
    void undoReaction(@Param("id")int id);
}
