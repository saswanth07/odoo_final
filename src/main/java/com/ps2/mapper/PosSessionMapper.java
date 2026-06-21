package com.ps2.mapper;

import com.ps2.dto.PosSessionDto;
import com.ps2.entity.PosSession;
import com.ps2.entity.User;
import org.springframework.stereotype.Component;

@Component
public class PosSessionMapper {

    public PosSessionDto toDto(PosSession entity) {
        if (entity == null) {
            return null;
        }
        PosSessionDto dto = new PosSessionDto();
        dto.setSessionId(entity.getSessionId());
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getUserId());
            dto.setUserName(entity.getUser().getName());
        }
        dto.setOpeningTime(entity.getOpeningTime());
        dto.setClosingTime(entity.getClosingTime());
        dto.setOpeningAmount(entity.getOpeningAmount());
        dto.setClosingAmount(entity.getClosingAmount());
        dto.setStatus(entity.getStatus());
        return dto;
    }

    public PosSession toEntity(PosSessionDto dto, User user) {
        if (dto == null) return null;
        PosSession entity = new PosSession();
        entity.setSessionId(dto.getSessionId());
        entity.setUser(user);
        entity.setOpeningTime(dto.getOpeningTime());
        entity.setClosingTime(dto.getClosingTime());
        entity.setOpeningAmount(dto.getOpeningAmount());
        entity.setClosingAmount(dto.getClosingAmount());
        entity.setStatus(dto.getStatus());
        return entity;
    }
}
