package com.forum.forum_backend.utility;

import com.forum.forum_backend.entity.User;
import com.forum.forum_backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.util.Date;

import static ch.qos.logback.core.encoder.ByteArrayUtil.hexStringToByteArray;

@Component
public class JWTUtility {
    @Value("${key}")
    private String key;
    private SecretKey secretKey;
    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));
    }
    public String generateToken(String email){
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(secretKey,Jwts.SIG.HS256)
                .compact();
    }
    public String generateToken(User user){
        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 14))
                .signWith(secretKey,Jwts.SIG.HS256)
                .compact();
    }
    public String extractEmail(String token){
        if(token != null && !token.isEmpty() )
            return extractClaims(token).getSubject();
        else
            return "";
    }
    private Claims extractClaims(String token){
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    private boolean isTokenExpired(String token){
        return extractClaims(token).getExpiration().before(new Date());
    }
    public boolean validateToken(String token, UserRepository userRepository){
        String email = extractEmail(token);
        return userRepository.existsByEmail(email) && !isTokenExpired(token);
    }
    public void setJwtTokenCookie(HttpServletResponse response, String token,boolean rememberMe) {
        ResponseCookie cookie = ResponseCookie.from("jwt", token) // key & value
                .httpOnly(true)    // Prevent access to the cookie from JavaScript
                .secure(false)      // Send the cookie only over HTTPS (use false for local dev)
                .maxAge(rememberMe ? Duration.ofDays(14) : Duration.ofDays(-1)) // 14 days or 30 minutes (session cookie)
                .sameSite("Lax")   // Set SameSite to Lax
                .path("/")         // Cookie is available to the entire site
                .build();

        // Add the cookie to the response
        response.addHeader("Set-Cookie", cookie.toString());
    }

}
