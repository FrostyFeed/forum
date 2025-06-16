package com.forum.forum_backend.repository;

import com.forum.forum_backend.dto.CreateRuleDTO;
import com.forum.forum_backend.dto.RuleDTO;
import com.forum.forum_backend.entity.Rule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface RuleRepository extends JpaRepository<Rule,Integer> {
    void deleteById(int id);
    @Query("SELECT new com.forum.forum_backend.dto.RuleDTO(r.id,r.text) FROM Rule r")
    List<RuleDTO> getAll();
    @Transactional
    @Modifying
    @Query("UPDATE Rule r SET r.text = :text WHERE r.id = :id")
    void updateTextById(@Param("id") int id, @Param("text") String text);
}
