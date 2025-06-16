package com.forum.forum_backend.repository;

import com.forum.forum_backend.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends JpaRepository<News,Integer> {
    Slice<News> findAllBy(Pageable pageable);
    News findById(int id);
    void deleteById(int id);
}
