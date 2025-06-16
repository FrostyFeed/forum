package com.forum.forum_backend.repository;

import com.forum.forum_backend.entity.Threads;
import com.forum.forum_backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThreadRepository extends JpaRepository<Threads,Integer>, JpaSpecificationExecutor<Threads> {
    public List<Threads> findByTopicId(int topicId);
    public List<Threads> findTop5ByOrderByCreationDateDesc();
    public List<Threads> findByUserId(int id);
    public Optional<Threads> findById(int id);
    public Slice<Threads> findAllByTopicId(int id, Pageable pageable);
    @Modifying
    @Transactional
    @Query("UPDATE Threads t SET t.user = :user WHERE t.id = :id")
    void updateUser(@Param("user")User user,@Param("id") int id);
    @Query(value = "SELECT id FROM threads ORDER BY RAND() LIMIT 1", nativeQuery = true)
    int findRandomRecord();
    @Transactional
    @Modifying
    @Query("DELETE FROM Threads t WHERE t.id = :id AND t.user.email = :email")
    int deleteThread(@Param("id")int id,@Param("email")String email);

}
