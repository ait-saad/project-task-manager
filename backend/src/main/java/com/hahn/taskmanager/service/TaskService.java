package com.hahn.taskmanager.service;

import com.hahn.taskmanager.dto.TaskRequest;
import com.hahn.taskmanager.dto.TaskResponse;
import com.hahn.taskmanager.entity.Project;
import com.hahn.taskmanager.entity.Task;
import com.hahn.taskmanager.entity.TaskStatus;
import com.hahn.taskmanager.entity.User;
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
        verifyProjectOwnership(projectId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task does not belong to this project");
        }

        task.setCompleted(!task.isCompleted());
        // derive status from completed flag
        task.setStatus(task.isCompleted() ? TaskStatus.DONE : TaskStatus.IN_PROGRESS);
        Task updated = taskRepository.save(task);
        return mapToResponse(updated);
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
        Long userId = getCurrentUserId();
        return projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
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
}
