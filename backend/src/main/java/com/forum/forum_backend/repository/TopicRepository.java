package com.forum.forum_backend.repository;

import com.forum.forum_backend.entity.Topic;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TopicRepository extends CrudRepository<Topic,Integer> {
    @Modifying
    @Transactional
    @Query("UPDATE Topic t SET t.tittle=:tittle,t.description=:desc WHERE t.id=:id")
    public int updateTopicById(@Param("tittle")String title,@Param("desc")String desc,@Param("id")int id);
}
