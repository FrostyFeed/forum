package com.forum.forum_backend.entity;

import com.forum.forum_backend.dto.LatestActivityDTO;
import com.forum.forum_backend.events.CloudCleanupEntityListener;
import com.forum.forum_backend.events.HasCloudResource;
import com.forum.forum_backend.events.HasStatsType;
import com.forum.forum_backend.events.StatsEntityListener;
import com.forum.forum_backend.interfaces.HasLatestActivity;
import com.forum.forum_backend.interfaces.Post;
import com.forum.forum_backend.utility.StatsType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Formula;

import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "reply")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EntityListeners({CloudCleanupEntityListener.class, StatsEntityListener.class})
public class Reply implements HasCloudResource, Post, HasStatsType, HasLatestActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "isEdited")
    private boolean isEdited;
    @Column(name = "content")
    private String content;
    @Column(name = "creation_date")
    private OffsetDateTime creationDate;
    @ManyToOne
    @JoinColumn(name = "thread_id")
    private Threads thread;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToMany(mappedBy = "upvotes")
    private Set<User> upvotedBy = new HashSet<>();
    @Formula("(SELECT COUNT(*) FROM upvotes u WHERE u.reply_id = id)")
    private int upvoteCount;
    @OneToMany(mappedBy = "reply",orphanRemoval = true,cascade = CascadeType.ALL)
    private List<Report> reports = new ArrayList<>();
    @Transient
    private final StatsType statsType = StatsType.POST;

    public Reply(String content,OffsetDateTime dateTime,Threads thread,User user){
        this.content = content;
        creationDate = dateTime;
        this.thread = thread;
        this.user = user;
    }

    @Override
    public LatestActivityDTO toLatestActivityDTO() {
        return new LatestActivityDTO(this.getId(),this.getContent(),this.getThread().getTopic().getId(),
                this.getThread().getTopic().getTittle(),"Коментар",this.getCreationDate(),this.getThread().getId());
    }
}
