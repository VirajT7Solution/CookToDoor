package com.cooktodor.enums;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

/**
 * Custom Jackson deserializer for Role enum that handles both formats:
 * - "ROLE_DELIVERY_PARTNER" (with ROLE_ prefix)
 * - "DELIVERY_PARTNER" (without ROLE_ prefix)
 * 
 * This ensures backward compatibility with API requests that may send
 * roles without the ROLE_ prefix.
 */
public class RoleDeserializer extends JsonDeserializer<Role> {

    @Override
    public Role deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        if (value == null || value.trim().isEmpty()) {
            return Role.ROLE_CUSTOMER;
        }
        
        String normalized = value.trim().toUpperCase();
        
        // If it already has ROLE_ prefix, use it directly
        if (normalized.startsWith("ROLE_")) {
            try {
                return Role.valueOf(normalized);
            } catch (IllegalArgumentException e) {
                return Role.ROLE_CUSTOMER;
            }
        }
        
        // If it doesn't have ROLE_ prefix, add it
        String withPrefix = "ROLE_" + normalized;
        try {
            return Role.valueOf(withPrefix);
        } catch (IllegalArgumentException e) {
            // If that fails, try the original value
            try {
                return Role.valueOf(normalized);
            } catch (IllegalArgumentException e2) {
                return Role.ROLE_CUSTOMER;
            }
        }
    }
}
