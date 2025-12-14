package com.hahn.taskmanager.repository;

import com.hahn.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    long countByProjectId(Long projectId);
    long countByProjectIdAndCompletedTrue(Long projectId);

    // New status-based count (for Kanban progress)
    long countByProjectIdAndStatus(Long projectId, com.hahn.taskmanager.entity.TaskStatus status);

    // All tasks belonging to a user's projects
    List<Task> findByProjectUserId(Long userId);
    List<Task> findByProjectUserIdAndStatus(Long userId, com.hahn.taskmanager.entity.TaskStatus status);
}
