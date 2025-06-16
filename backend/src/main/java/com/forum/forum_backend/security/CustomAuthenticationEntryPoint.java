package com.forum.forum_backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.forum.forum_backend.exeptions.UserIsBanned;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {

        String originalRequestUri = (String) request.getAttribute(RequestDispatcher.FORWARD_REQUEST_URI);

        Throwable originalError = (Throwable) request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);



        if (response.isCommitted()) {
            return;
        }

        Throwable exceptionToHandle = authException;

        if ("/error".equals(request.getRequestURI()) && originalError != null) {
            exceptionToHandle = originalError;
        }

        response.setContentType("application/json");
        Map<String, Object> body = new HashMap<>();

        if (exceptionToHandle instanceof UserIsBanned bannedEx) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 for banned
            body.put("error", "Access Denied");
            String banMessage = bannedEx.getMessage();
            if (banMessage != null && banMessage.startsWith("User is banned until User is banned until ")) {
                banMessage = banMessage.substring("User is banned until ".length());
            }
            body.put("message", banMessage != null ? banMessage : "User is banned.");
            body.put("errorCode", "USER_BANNED");
            body.put("duration",bannedEx.getDuration());
            body.put("reason",bannedEx.getReason());
        }
        try {
            objectMapper.writeValue(response.getOutputStream(), body);
        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            System.err.println(sw.toString());
            if (!response.isCommitted()) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        }        }
    }