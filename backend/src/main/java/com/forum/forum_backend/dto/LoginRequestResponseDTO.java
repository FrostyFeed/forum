package com.forum.forum_backend.dto;

import com.forum.forum_backend.entity.Reply;
import com.forum.forum_backend.entity.Roles;
import com.forum.forum_backend.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class LoginRequestResponseDTO {
    private String id;
    private String username;
    private String email;
    private String avatarUrl;
    private String[] roles;
    private List<Integer> upvotedReplies = new ArrayList<>();
    public LoginRequestResponseDTO(User user){
        id = Integer.toString(user.getId());
        username = user.getUsername();
        email = user.getEmail();
        avatarUrl  =user.getAvatarUrl();
        roles = user.getRoles().stream().map(Roles::getName).toArray(String[]::new);
        upvotedReplies = user.getUpvotes().stream().map(Reply::getId).toList();
    }
}
