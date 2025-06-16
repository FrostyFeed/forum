package com.forum.forum_backend.repository;

import com.forum.forum_backend.entity.PublicId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicIdRepository extends CrudRepository<PublicId,String> {

}
