package com.forum.forum_backend.controller;

import com.forum.forum_backend.dto.LoginRequestDTO;
import com.forum.forum_backend.dto.LoginRequestResponseDTO;
import com.forum.forum_backend.entity.User;
import com.forum.forum_backend.service.UserService;
import com.forum.forum_backend.utility.CookieUtilityService;
import com.forum.forum_backend.utility.JWTUtility;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final JWTUtility jwtUtility;
    private final UserService userService;
    private final CookieUtilityService cookieUtilityService;

    @PostMapping("/login")
    public ResponseEntity<LoginRequestResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDAO, HttpServletResponse response){
        User user = userService.loginUser(loginRequestDAO);
        String token = jwtUtility.generateToken(user);
        jwtUtility.setJwtTokenCookie(response,token,loginRequestDAO.remember());
        return ResponseEntity.ok(new LoginRequestResponseDTO(user));
    }
    @GetMapping("/me")
    public ResponseEntity<LoginRequestResponseDTO> validateUser(HttpServletRequest request){
        String jwt = cookieUtilityService.extractJwt(request);
        System.out.printf("JWT: %s",jwt);
        String email = jwtUtility.extractEmail(jwt);
        Optional<User> user =userService.getUserByEmail(email);
        user.ifPresent(a ->a.setLastSeen(LocalDateTime.now().atOffset(ZoneOffset.systemDefault().getRules().getOffset(LocalDateTime.now()))) );
        user.ifPresent(userService::saveUser);
        return ResponseEntity.ok(new LoginRequestResponseDTO(user.get()));
    }
}
