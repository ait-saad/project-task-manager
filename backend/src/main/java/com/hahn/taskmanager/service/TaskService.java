package com.hahn.taskmanager.service;

import com.hahn.taskmanager.dto.TaskRequest;
import com.hahn.taskmanager.dto.TaskResponse;
import com.hahn.taskmanager.entity.Project;
import com.hahn.taskmanager.entity.Task;
import com.hahn.taskmanager.entity.TaskStatus;
import com.hahn.taskmanager.entity.User;
import com.hahn.taskmanager.exception.AccessDeniedException;
import com.hahn.taskmanager.repository.ProjectRepository;
import com.hahn.taskmanager.repository.TaskRepository;
import com.hahn.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<TaskResponse> getTasksByProjectId(Long projectId) {
        verifyProjectOwnership(projectId);
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TaskResponse createTask(Long projectId, TaskRequest request) {
        Project project = verifyProjectOwnership(projectId);

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setProject(project);
        if (request.getStatus() != null) {
            try {
                task.setStatus(TaskStatus.valueOf(request.getStatus()));
            } catch (IllegalArgumentException ex) {
                throw new RuntimeException("Invalid status. Allowed: NOT_STARTED, IN_PROGRESS, DONE");
            }
        }
        // keep completed in sync
        task.setCompleted(task.getStatus() == TaskStatus.DONE);

        Task saved = taskRepository.save(task);
        return mapToResponse(saved);
    }

    public TaskResponse updateTask(Long projectId, Long taskId, TaskRequest request) {
        verifyProjectOwnership(projectId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task does not belong to this project");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        if (request.getStatus() != null) {
            try {
                task.setStatus(TaskStatus.valueOf(request.getStatus()));
            } catch (IllegalArgumentException ex) {
                throw new RuntimeException("Invalid status. Allowed: NOT_STARTED, IN_PROGRESS, DONE");
            }
        }
        // keep completed in sync
        task.setCompleted(task.getStatus() == TaskStatus.DONE);

        Task updated = taskRepository.save(task);
        return mapToResponse(updated);
    }

    public TaskResponse toggleTaskCompletion(Long projectId, Long taskId) {
        System.out.println("DEBUG: toggleTaskCompletion called with projectId=" + projectId + ", taskId=" + taskId);

        try {
            verifyProjectOwnership(projectId);
            System.out.println("DEBUG: Project ownership verified successfully");

            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task not found"));
            System.out.println("DEBUG: Task found: " + task.getTitle());

            if (!task.getProject().getId().equals(projectId)) {
                System.err.println("ERROR: Task " + taskId + " belongs to project " + task.getProject().getId() + ", not " + projectId);
                throw new RuntimeException("Task does not belong to this project");
            }

            boolean wasCompleted = task.isCompleted();
            task.setCompleted(!task.isCompleted());
            // derive status from completed flag
            task.setStatus(task.isCompleted() ? TaskStatus.DONE : TaskStatus.IN_PROGRESS);
            System.out.println("DEBUG: Toggling task from completed=" + wasCompleted + " to completed=" + task.isCompleted());

            Task updated = taskRepository.save(task);
            System.out.println("DEBUG: Task updated successfully");

            return mapToResponse(updated);
        } catch (Exception e) {
            System.err.println("ERROR in toggleTaskCompletion: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void deleteTask(Long projectId, Long taskId) {
        verifyProjectOwnership(projectId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task does not belong to this project");
        }

        taskRepository.delete(task);
    }

    private Project verifyProjectOwnership(Long projectId) {
        System.out.println("DEBUG: Verifying project ownership for project ID: " + projectId);
        Long userId = getCurrentUserId();
        System.out.println("DEBUG: User ID from authentication: " + userId);

        var project = projectRepository.findByIdAndUserId(projectId, userId);
        System.out.println("DEBUG: Project found: " + project.isPresent());

        if (project.isEmpty()) {
            System.err.println("ERROR: Project " + projectId + " not found for user " + userId);
            // Let's also check if the project exists at all
            var anyProject = projectRepository.findById(projectId);
            if (anyProject.isPresent()) {
                System.err.println("ERROR: Project " + projectId + " exists but belongs to user " + anyProject.get().getUser().getId() + ", not " + userId);
            } else {
                System.err.println("ERROR: Project " + projectId + " does not exist at all");
            }
        }

        return project.orElseThrow(() -> new AccessDeniedException("Project not found or access denied"));
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .completed(task.isCompleted())
                .status(task.getStatus().name())
                .createdAt(task.getCreatedAt())
                .build();
    }

    private Long getCurrentUserId() {
        try {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("DEBUG: Authentication object: " + authentication);
            System.out.println("DEBUG: Authentication name: " + (authentication != null ? authentication.getName() : "null"));
            System.out.println("DEBUG: Authentication principal: " + (authentication != null ? authentication.getPrincipal() : "null"));

            if (authentication == null) {
                throw new AccessDeniedException("No authentication found");
            }

            String email = authentication.getName();
            System.out.println("DEBUG: Extracted email: " + email);

            if (email == null || email.equals("anonymousUser")) {
                throw new AccessDeniedException("User is not authenticated");
            }

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new AccessDeniedException("User not found with email: " + email));

            System.out.println("DEBUG: Found user ID: " + user.getId() + " for email: " + email);
            return user.getId();
        } catch (Exception e) {
            System.err.println("ERROR in getCurrentUserId: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // helper to resolve user id from email (for controllers that can't access SecurityContext cleanly)
    public Long resolveUserId(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    public List<TaskResponse> getTasksForUser(Long currentUserId, String status) {
        List<Task> tasks;
        if (status != null && !status.isBlank()) {
            TaskStatus st;
            try {
                st = TaskStatus.valueOf(status);
            } catch (IllegalArgumentException ex) {
                throw new RuntimeException("Invalid status. Allowed: NOT_STARTED, IN_PROGRESS, DONE");
            }
            tasks = taskRepository.findByProjectUserIdAndStatus(currentUserId, st);
        } else {
            tasks = taskRepository.findByProjectUserId(currentUserId);
        }
        return tasks.stream().map(this::mapToResponse).toList();
    }

    public List<com.hahn.taskmanager.dto.TaskWithProjectResponse> getTasksWithProjectForUser(Long currentUserId, String status) {
        List<Task> tasks;
        if (status != null && !status.isBlank()) {
            TaskStatus st;
            try {
                st = TaskStatus.valueOf(status);
            } catch (IllegalArgumentException ex) {
                throw new RuntimeException("Invalid status. Allowed: NOT_STARTED, IN_PROGRESS, DONE");
            }
            tasks = taskRepository.findByProjectUserIdAndStatus(currentUserId, st);
        } else {
            tasks = taskRepository.findByProjectUserId(currentUserId);
        }
        return tasks.stream().map(this::mapToTaskWithProjectResponse).toList();
    }

    private com.hahn.taskmanager.dto.TaskWithProjectResponse mapToTaskWithProjectResponse(Task task) {
        return com.hahn.taskmanager.dto.TaskWithProjectResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .completed(task.isCompleted())
                .status(task.getStatus().name())
                .createdAt(task.getCreatedAt())
                .projectId(task.getProject().getId())
                .projectTitle(task.getProject().getTitle())
                .build();
    }
}
