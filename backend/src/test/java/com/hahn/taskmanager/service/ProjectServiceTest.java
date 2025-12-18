package com.hahn.taskmanager.service;

import com.hahn.taskmanager.dto.ProjectResponse;
import com.hahn.taskmanager.entity.Project;
import com.hahn.taskmanager.repository.ProjectRepository;
import com.hahn.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    private ProjectResponse invokeMap(ProjectService svc, Project project) {
        try {
            var m = ProjectService.class.getDeclaredMethod("mapToResponse", Project.class);
            m.setAccessible(true);
            return (ProjectResponse) m.invoke(svc, project);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private ProjectService projectService;

    private Project project;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setId(1L);
        project.setTitle("Test Project");
    }

    @Test
    void progress_isZero_whenNoTasks() {
        when(taskRepository.countByProjectId(1L)).thenReturn(0L);
        when(taskRepository.countByProjectIdAndCompletedTrue(1L)).thenReturn(0L);
        when(taskRepository.countByProjectIdAndStatus(eq(1L), any())).thenReturn(0L);

        ProjectResponse resp = projectService.buildProjectResponse(project);

        assertEquals(0, resp.getTotalTasks());
        assertEquals(0, resp.getCompletedTasks());
        assertEquals(0.0, resp.getProgressPercentage());
    }

    @Test
    void progress_isCalculated_usingDoneOrCompleted() {
        when(taskRepository.countByProjectId(1L)).thenReturn(10L);
        // simulate 6 DONE via status and 5 completed via legacy flag → service should pick max
        when(taskRepository.countByProjectIdAndCompletedTrue(1L)).thenReturn(5L);
        when(taskRepository.countByProjectIdAndStatus(eq(1L), any())).thenReturn(6L);

        ProjectResponse resp = projectService.buildProjectResponse(project);

        assertEquals(10, resp.getTotalTasks());
        assertEquals(6, resp.getCompletedTasks());
        assertEquals(60.0, resp.getProgressPercentage());
    }
}
