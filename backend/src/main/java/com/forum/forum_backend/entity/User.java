package com.forum.forum_backend.entity;

import com.forum.forum_backend.dto.RegisterRequestDTO;
import com.forum.forum_backend.events.HasStatsType;
import com.forum.forum_backend.events.StatsEntityListener;
import com.forum.forum_backend.utility.StatsType;
import com.forum.forum_backend.utility.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Formula;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EntityListeners({StatsEntityListener.class})
public class User implements HasStatsType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "username")
    private String username;
    @Column(name = "password")
    private String password;
    @Column(name = "register_date")
    private LocalDate registerDate;
    @Column(name = "reputation")
    private int reputation = 0;
    @Column(name = "last_seen")
    private OffsetDateTime lastSeen;
    @Column(name = "email")
    private String email;
    @Column(name = "avatar_url")
    private String avatarUrl;
    @Enumerated(EnumType.STRING)
    private Status status;
    @OneToMany(mappedBy = "user")
    private List<Threads> threads = new ArrayList<>();
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Report> reports = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    private List<Reply> replies = new ArrayList<>();
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id")}
    )
    private Set<Roles> roles = new HashSet<>();
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name="upvotes",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "reply_id")}
    )
    private Set<Reply> upvotes;
    @Formula("(SELECT COUNT(*) FROM reply r WHERE r.user_id=id)")
    private int replyCount;
    @Formula("(SELECT COUNT(*) FROM threads t WHERE t.user_id=id)")
    private int threadCount;
    @OneToMany(mappedBy = "bannedUser",fetch = FetchType.EAGER)
    private List<Ban> bans = new ArrayList<>();
    @Transient
    private final StatsType statsType = StatsType.USER;


    @PrePersist
    protected void onCreate(){
        registerDate=LocalDate.now();
    }
    public User(RegisterRequestDTO registerRequestDAO, String avatarUrl, String role){
        this.password = registerRequestDAO.getPassword();
        this.roles = new HashSet<>();
        this.roles.add(new Roles(1,role));
        this.email = registerRequestDAO.getEmail();
        this.username = registerRequestDAO.getUsername();
        this.avatarUrl = avatarUrl;
        this.lastSeen = OffsetDateTime.now();
        this.status = Status.UNVERIFIED;
    }
}
