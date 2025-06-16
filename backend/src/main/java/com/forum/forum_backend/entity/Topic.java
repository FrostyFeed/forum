package com.forum.forum_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "topics")
@AllArgsConstructor
@Setter
@NoArgsConstructor
@Getter
@Builder
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "description")
    private String description;
    @Column(name = "tittle")
    private String tittle;
    @OneToMany(mappedBy = "topic",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Threads> threads;
}
