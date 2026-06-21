package com.ps2.service;

import com.ps2.dto.UserDto;
import java.util.List;

public interface UserService {
    List<UserDto> getAllEmployees();
    UserDto getEmployeeById(Long id);
    UserDto updateEmployee(Long id, UserDto userDto);
    void archiveEmployee(Long id);
    void deleteEmployee(Long id);
    void changePassword(Long id, String newPassword);
}
