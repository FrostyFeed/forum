package com.forum.forum_backend.entity;

import com.forum.forum_backend.events.CloudCleanupEntityListener;
import com.forum.forum_backend.events.HasCloudResource;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.event.EventListener;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "news")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners({CloudCleanupEntityListener.class})
public class News implements HasCloudResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "title")
    private String title;
    @Column(name = "content")
    private String content;
    @Column(name = "description")
    private String description;
    @Column(name = "creation_date")
    private OffsetDateTime creationDate;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private User admin;
    @OneToMany(mappedBy = "news",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<NewsReaction> reactions = new ArrayList<>();
}
