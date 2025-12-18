package com.hahn.taskmanager.controller;

import com.hahn.taskmanager.dto.TaskWithProjectResponse;
import com.hahn.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class AllTasksController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskWithProjectResponse>> getAllTasksForUser(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(taskService.getTasksWithProjectForUser(getCurrentUserId(), status));
    }

    private Long getCurrentUserId() {
        // Delegate to TaskService's helper via calling a trivial method that reads SecurityContext
        // Or alternatively, we could inject UserRepository and resolve here. To avoid duplication,
        // we expose a lightweight call through service (no DB hit) – but since it's private there,
        // we inline the SecurityContext read here.
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return taskService.resolveUserId(email);
    }
}
