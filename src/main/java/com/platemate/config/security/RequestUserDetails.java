package com.platemate.config.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.io.Serializable;
import java.util.Set;

public class RequestUserDetails extends User implements Serializable {

    private static final long serialVersionUID = -6411988532329234916L;

    private Long userFrontId;
    private Long roleId;
    private Long userType;


    public RequestUserDetails(String username, String password, Set<GrantedAuthority> authorities,
                              Long userFrontId, Long roleId, Long userType) {
        super(username, password, authorities);
        this.userFrontId = userFrontId;
        this.roleId = roleId;
        this.userType = userType;
    }


	public Long getUserFrontId() {
		return userFrontId;
	}


	public void setUserFrontId(Long userFrontId) {
		this.userFrontId = userFrontId;
	}


	public Long getRoleId() {
		return roleId;
	}


	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}


	public Long getUserType() {
		return userType;
	}


	public void setUserType(Long userType) {
		this.userType = userType;
	}


	public static long getSerialversionuid() {
		return serialVersionUID;
	}
    
    

}
