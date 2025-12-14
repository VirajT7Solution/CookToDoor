package com.cooktodor.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Custom converter for Role enum that handles both formats:
 * - "ROLE_DELIVERY_PARTNER" (with ROLE_ prefix)
 * - "DELIVERY_PARTNER" (without ROLE_ prefix)
 * 
 * This ensures backward compatibility with existing database records
 * that may have been stored without the ROLE_ prefix.
 */
@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<Role, String> {

    @Override
    public String convertToDatabaseColumn(Role role) {
        if (role == null) {
            return null;
        }
        return role.name(); // Always store with ROLE_ prefix
    }

    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        
        String normalized = dbData.trim().toUpperCase();
        
        // If it already has ROLE_ prefix, use it directly
        if (normalized.startsWith("ROLE_")) {
            try {
                return Role.valueOf(normalized);
            } catch (IllegalArgumentException e) {
                // Fallback to default if enum value doesn't exist
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
                // Fallback to default if enum value doesn't exist
                return Role.ROLE_CUSTOMER;
            }
        }
    }
}
