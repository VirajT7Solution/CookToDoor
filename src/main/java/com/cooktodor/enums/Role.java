package com.cooktodor.enums;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(using = RoleDeserializer.class)
public enum Role {
	ROLE_CUSTOMER, ROLE_PROVIDER, ROLE_DELIVERY_PARTNER, ROLE_ADMIN,
}