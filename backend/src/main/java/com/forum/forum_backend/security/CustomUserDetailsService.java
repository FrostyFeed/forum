package com.forum.forum_backend.security;

import com.forum.forum_backend.entity.Ban;
import com.forum.forum_backend.exeptions.UserIsBanned;
import com.forum.forum_backend.repository.UserRepository;
import com.forum.forum_backend.utility.BanStatus;
import com.forum.forum_backend.utility.Status;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var user = userRepository.getUserByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Set<GrantedAuthority> authorities = user.getRoles().stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toSet());
        boolean isEnabled = Status.VERIFIED.equals(user.getStatus());
        if(Status.BANNED.equals(user.getStatus()))
            user.getBans().stream()
                    .filter(ban -> BanStatus.ACTIVE.equals(ban.getStatus()))
                    .findFirst()
                    .ifPresent(ban -> {
                        throw new UserIsBanned(ban.getExpirationDate(),ban.getReason());
                    });

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                isEnabled,
                true,  // accountNonExpired
                true,  // credentialsNonExpired
                true,  // accountNonLocked
                authorities);
    }
}
