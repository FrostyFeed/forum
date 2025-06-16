package com.forum.forum_backend.repository;

import com.forum.forum_backend.dto.BestScoreEverDTO;
import com.forum.forum_backend.dto.UserDataDTO;
import com.forum.forum_backend.entity.User;
import com.forum.forum_backend.utility.Status;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    public boolean existsByEmail(String email);
    @Query("SELECT u.status FROM User u WHERE u.email = :email")
    public Status getStatusByEmail(@Param("email") String email);
    public Optional<User> getUserByEmail(String email);
    public Optional<User> getUserById(int id);
    @Query("SELECT new com.forum.forum_backend.dto.UserDataDTO(" +
            "u.username, " +
            "u.registerDate, " +
            "u.lastSeen, " +
            "u.avatarUrl, " +
            "u.replyCount, " +
            "u.threadCount, " +
            "u.reputation, " +
            "(EXISTS (SELECT r FROM u.roles r WHERE r.name = 'ROLE_Admin'))" +
            ") " +
            "FROM User u WHERE u.id = :id")
    UserDataDTO findUserDataDtoById(@Param("id") int id);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :password WHERE u.email = :email ")
    public void changeUserPassword(@Param("email") String email,@Param("password") String password);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
    void updateUserStatus(@Param("status") Status status,@Param("id") int userId);
    <T> T getUserPasswordByEmail(String email,Class<T> type);
    @Transactional
    void deleteByEmail(String email);
    @Query("SELECT u FROM User u WHERE u.id = :id")
    User getDeleteUser(@Param("id")int id);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.reputation = u.reputation + 1 WHERE u.id = :id")
    void increaseUserReputation(@Param("id") int id);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.reputation = u.reputation - 1 WHERE u.id = :id")
    void decreaseUserReputation(@Param("id") int id);
    @Query("""
    SELECT new com.forum.forum_backend.dto.BestScoreEverDTO(u.id,u.reputation,u.username,u.avatarUrl) FROM User u 
    WHERE u.reputation <> 0 
    ORDER BY u.reputation DESC
""")
    List<BestScoreEverDTO> findTop10ByReputationNotZero( Pageable pageable);
    @Query("SELECT u.id FROM User u WHERE u.email = :email")
    int getUserId(@Param("email")String email);
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.avatarUrl = :url WHERE u.email = :email")
    void changeAvatarUrl(@Param("url")String url,@Param("email") String email);
}
