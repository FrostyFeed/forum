package com.forum.forum_backend.entity;


import com.forum.forum_backend.utility.StatsType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stats")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Stats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "date")
    private String date;
    @Column(name = "amount")
    private int amount;
    @Column(name = "type")
    @Enumerated(value = EnumType.STRING)
    private StatsType type;
}
