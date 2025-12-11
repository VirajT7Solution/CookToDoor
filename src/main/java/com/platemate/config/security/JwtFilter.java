package com.platemate.config.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
    private JwtUtil jwtUtil;
	@Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // Skip JWT processing for public URLs
        String requestURI = request.getRequestURI();
        System.out.println("JWT Filter - Request URI: " + requestURI);
        
        if (isPublicUrl(requestURI)) {
            System.out.println("JWT Filter - Skipping JWT processing for public URL: " + requestURI);
            chain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("JWT Filter - No valid Authorization header found");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Missing or invalid Authorization header\"}");
            return;
        }

        String token = authHeader.substring(7);

        try {
            String username = jwtUtil.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("JWT Filter - Authentication successful for user: " + username);
                } else {
                    sendError(response, "Invalid or expired token");
                    return;
                }
            }
        } catch (Exception e) {
            sendError(response, "Authentication failed: " + e.getMessage());
            return;
        }

        chain.doFilter(request, response);
    }

    private void sendError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"" + message + "\"}");
    }

    private boolean isPublicUrl(String requestURI) {
        // Remove query parameters and normalize the path
        String path = requestURI;
        if (requestURI.contains("?")) {
            path = requestURI.substring(0, requestURI.indexOf("?"));
        }
        // Remove trailing slash for consistent matching
        if (path.endsWith("/") && path.length() > 1) {
            path = path.substring(0, path.length() - 1);
        }
        
        // Exact match public URLs (auth endpoints)
        if (path.equals("/api/auth/login") ||
            path.equals("/api/auth/signup") ||
            path.equals("/api/auth/forgot-password") ||
            path.equals("/api/auth/resend-otp") ||
            path.equals("/api/auth/verify-otp") ||
            path.equals("/api/auth/reset-password")) {
            return true;
        }
        
        // Wildcard patterns (Swagger/docs)
        if (path.startsWith("/v3/api-docs/") ||
            path.equals("/v3/api-docs") ||
            path.startsWith("/swagger-ui/") ||
            path.equals("/swagger-ui") ||
            path.equals("/swagger-ui.html") ||
            path.startsWith("/swagger-resources/") ||
            path.equals("/swagger-resources") ||
            path.startsWith("/webjars/") ||
            path.equals("/webjars")) {
            return true;
        }
        
        return false;
    }
}
