package com.forum.forum_backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    private final CustomAuthenticationEntryPoint entryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/user/register",
                                "/api/user/verification",
                                "/api/user/email/**",
                                "/api/user/password-reset-request",
                                "/api/auth/reset-password",
                                "/api/user/avatar"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/news",
                                "/api/leaderboards/**",
                                "/api/rules",
                                "/api/topics",
                                "/api/topic/**",
                                "/api/thread/**",
                                "/api/replies/**",
                                "/api/stats/**",
                                "/api/user/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/auth/me",
                                "/api/news/reaction",
                                "/api/img/**",
                                "/api/reply/**",
                                "/api/reports"
                        ).hasRole("User")
                        .requestMatchers(HttpMethod.POST, "/api/thread").hasRole("User")
                        .requestMatchers(HttpMethod.PUT, "/api/thread").hasRole("User")
                        .requestMatchers(HttpMethod.DELETE, "/api/thread/**").hasRole("User")
                        .requestMatchers("/api/user/nickname", "/api/user/avatar").hasRole("User")


                        // =================================================================
                        // ADMIN-ONLY ENDPOINTS
                        // =================================================================
                        .requestMatchers(
                                "/api/news",
                                "/api/bans",
                                "/api/rules/**",
                                "/admin/**"
                        ).hasRole("Admin")
                        .requestMatchers(HttpMethod.POST, "/api/topic").hasRole("Admin")
                        .requestMatchers(HttpMethod.PUT, "/api/topic").hasRole("Admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/topic").hasRole("Admin")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(entryPoint)
                )
                .build();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
        return config.getAuthenticationManager();
    }
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // Your frontend URL
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // 👈 Important for cookies!

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
