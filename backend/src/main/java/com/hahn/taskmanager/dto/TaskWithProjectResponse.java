package com.hahn.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskWithProjectResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private boolean completed;
    private String status; // NOT_STARTED | IN_PROGRESS | DONE
    private LocalDateTime createdAt;

    // Project information
    private Long projectId;
    private String projectTitle;
}