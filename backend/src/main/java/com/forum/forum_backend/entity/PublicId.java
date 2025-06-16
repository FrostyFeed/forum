package com.forum.forum_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "publicIds")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PublicId {
    @Id
    private String url;
    @Column(name = "public_id")
    private String publicId;
}
