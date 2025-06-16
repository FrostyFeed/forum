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
import lombok.*;
import org.hibernate.annotations.Formula;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "threads")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@EntityListeners({CloudCleanupEntityListener.class, StatsEntityListener.class})
public class Threads implements Post, HasCloudResource, HasStatsType, HasLatestActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "isEdited")
    private boolean isEdited;
    @Column(name = "tittle")
    private String tittle;
    @Column(name = "creation_date")
    private OffsetDateTime creationDate;
    @Column(name = "content")
    private String content;
    @ManyToOne
    @JoinColumn(name="topic_id")
    private Topic topic;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @OneToMany(mappedBy = "thread",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Reply> replies;
    @Formula("(SELECT MAX(r.creation_date) FROM reply r WHERE r.thread_id = id)")
    private OffsetDateTime lastReplyDate;
    @OneToMany(mappedBy = "thread",orphanRemoval = true,cascade = CascadeType.ALL)
    private List<Report> reports = new ArrayList<>();
    @Transient
    private final StatsType statsType = StatsType.POST;

    @Override
    public LatestActivityDTO toLatestActivityDTO() {
        return new LatestActivityDTO(
                this.getId(),this.getContent(),this.getTopic().getId(),this.getTopic().getTittle(),"Пост",this.getCreationDate(),this.getId()
        );
    }
}
