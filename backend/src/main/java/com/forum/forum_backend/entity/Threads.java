package com.forum.forum_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "threads")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Thread {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @Column(name = "creation_date")
    private Date creationDate;
    @Column(name = "content")
    private String content;
    @OneToMany(mappedBy = "thread")
    private List<Reply> replies;
}
