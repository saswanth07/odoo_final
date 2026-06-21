package com.ps2.repository;

import com.ps2.entity.PosSession;
import com.ps2.entity.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PosSessionRepository extends JpaRepository<PosSession, Long> {
    List<PosSession> findByUser_UserIdAndStatus(Long userId, SessionStatus status);
}
