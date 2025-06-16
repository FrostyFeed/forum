package com.forum.forum_backend.repository;

import com.forum.forum_backend.entity.Reply;
import com.forum.forum_backend.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface RepliesRepository extends JpaRepository<Reply,Integer> {
    public Slice<Reply> findByThreadId(@Param("id") int id, Pageable pageable);
    public List<Reply> findByUserId(int id);
    public Reply findById(int id);
    @Modifying
    @Transactional
    @Query("UPDATE Reply r SET r.user = :user WHERE r.id = :id")
    void updateUser(@Param("user")User user,@Param("id") int id);
    @Query("""
    SELECT r FROM Reply r
    WHERE r.user = :user
      AND (:thisMonth = false OR 
           (YEAR(r.creationDate) = :year AND MONTH(r.creationDate) = :month))
    ORDER BY r.upvoteCount DESC
""")
    List<Reply> findTopRepliesByUser(
            @Param("user") User user,
            @Param("thisMonth") boolean thisMonth,
            @Param("year") int year,
            @Param("month") int month,
            Pageable pageable
    );
    @Transactional
    @Modifying
    @Query("DELETE  FROM Reply r WHERE r.id = :id AND r.user.id = :userId")
    void deleteReply(@Param("id")int id,@Param("userId")int userId);

}
