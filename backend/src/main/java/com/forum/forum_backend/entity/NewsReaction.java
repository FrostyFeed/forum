package com.forum.forum_backend.entity;

import com.forum.forum_backend.utility.NewsReactionsTypes;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "news_reactions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NewsReaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_id")
    private News news;
    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private NewsReactionsTypes type;

}
