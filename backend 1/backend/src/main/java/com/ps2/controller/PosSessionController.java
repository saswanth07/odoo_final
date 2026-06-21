package com.ps2.controller;

import com.ps2.dto.PosSessionDto;
import com.ps2.service.PosSessionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
public class PosSessionController {

    private final PosSessionService sessionService;

    public PosSessionController(PosSessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/open")
    public ResponseEntity<PosSessionDto> openSession(@Valid @RequestBody PosSessionDto sessionDto) {
        PosSessionDto created = sessionService.openSession(sessionDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/{sessionId}/close")
    public ResponseEntity<PosSessionDto> closeSession(@PathVariable Long sessionId) {
        PosSessionDto closed = sessionService.closeSession(sessionId);
        return ResponseEntity.ok(closed);
    }

    @GetMapping("/active/user/{userId}")
    public ResponseEntity<List<PosSessionDto>> getActiveSessionsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(sessionService.getActiveSessionsByUser(userId));
    }
}
