package com.forum.forum_backend.specification;

import com.forum.forum_backend.entity.Threads;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ThreadSpecification {
    public static Specification<Threads> findByCriteria(Integer topicId, Integer userId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (topicId != null) {
                predicates.add(criteriaBuilder.equal(root.get("topic").get("id"), topicId));
            }

            // If userId is provided...
            if (userId != null) {
                predicates.add(criteriaBuilder.equal(root.get("user").get("id"), userId));
            }

            // The list will always contain exactly one predicate.
            // criteriaBuilder.and() with a single predicate is a valid operation.
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
