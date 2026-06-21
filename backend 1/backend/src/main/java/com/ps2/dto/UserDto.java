package com.ps2.dto;

import com.ps2.entity.UserRole;

public class UserDto {
    private Long userId;
    private String name;
    private String email;
    private UserRole role;
    private Boolean active;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    private String theme;
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
}
