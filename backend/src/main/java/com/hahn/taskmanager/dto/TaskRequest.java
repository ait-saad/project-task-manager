package com.hahn.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String title;

    private String description;

    private LocalDate dueDate;

    // Optional: allow setting status when creating/updating
    private String status; // NOT_STARTED | IN_PROGRESS | DONE
}
