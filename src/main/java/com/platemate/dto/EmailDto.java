package com.platemate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EmailDto {
    
    @NotBlank(message = "Email recipient is required")
    @Email(message = "Invalid email format")
    private String to;
    
    @NotBlank(message = "Email subject is required")
    private String subject;
    
    @NotBlank(message = "Email body is required")
    private String body;
    
    // Optional fields
    private String cc;
    private String bcc;
    private Boolean isHtml = true; // Default to HTML
    
    // Constructor
    public EmailDto() {}
    
    public EmailDto(String to, String subject, String body) {
        this.to = to;
        this.subject = subject;
        this.body = body;
    }
    
    // Getters and Setters
    public String getTo() {
        return to;
    }
    
    public void setTo(String to) {
        this.to = to;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getBody() {
        return body;
    }
    
    public void setBody(String body) {
        this.body = body;
    }
    
    public String getCc() {
        return cc;
    }
    
    public void setCc(String cc) {
        this.cc = cc;
    }
    
    public String getBcc() {
        return bcc;
    }
    
    public void setBcc(String bcc) {
        this.bcc = bcc;
    }
    
    public Boolean getIsHtml() {
        return isHtml;
    }
    
    public void setIsHtml(Boolean isHtml) {
        this.isHtml = isHtml;
    }
}

