package com.ps2.service;

import com.ps2.dto.PosSessionDto;
import java.util.List;

public interface PosSessionService {
    PosSessionDto openSession(PosSessionDto sessionDto);
    PosSessionDto closeSession(Long sessionId);
    List<PosSessionDto> getActiveSessionsByUser(Long userId);
}
