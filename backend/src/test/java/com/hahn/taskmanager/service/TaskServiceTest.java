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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectService projectService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private TaskService taskService;

    private Project project;
    private User user;

    @BeforeEach
    void setup() {
        project = new Project();
        project.setId(10L);
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        project.setUser(user);

        // Mock security context
        when(authentication.getName()).thenReturn("test@example.com");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        // Mock user repository
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        // Mock project repository for ownership verification
        when(projectRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(project));
    }

    @Test
    void createTask_setsStatusAndCompletedSync() {

        Task toPersist = new Task();
        toPersist.setId(100L);
        toPersist.setTitle("T1");
        toPersist.setDescription("D");
        toPersist.setProject(project);
        toPersist.setStatus(TaskStatus.DONE);
        toPersist.setCompleted(true);

        when(taskRepository.save(any(Task.class))).thenReturn(toPersist);

        TaskRequest req = new TaskRequest();
        req.setTitle("T1");
        req.setDescription("D");
        req.setDueDate(LocalDate.now());
        req.setStatus("DONE");

        TaskResponse resp = taskService.createTask(10L, req);

        assertEquals(100L, resp.getId());
        assertTrue(resp.isCompleted());
        assertEquals("DONE", resp.getStatus());

        ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(captor.capture());
        Task saved = captor.getValue();
        assertEquals(TaskStatus.DONE, saved.getStatus());
        assertTrue(saved.isCompleted(), "completed must reflect DONE status");
    }

    @Test
    void updateTask_updatesStatusAndCompletedSync() {
        Task existing = new Task();
        existing.setId(101L);
        existing.setProject(project);
        existing.setTitle("Old");
        existing.setStatus(TaskStatus.NOT_STARTED);
        existing.setCompleted(false);

        when(taskRepository.findById(101L)).thenReturn(Optional.of(existing));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        TaskRequest req = new TaskRequest();
        req.setTitle("New");
        req.setDescription("D2");
        req.setDueDate(LocalDate.now());
        req.setStatus("IN_PROGRESS");

        TaskResponse resp = taskService.updateTask(10L, 101L, req);

        assertEquals("IN_PROGRESS", resp.getStatus());
        assertFalse(resp.isCompleted(), "completed must be false when not DONE");
    }

    @Test
    void toggleTask_switchesCompletedAndStatus() {
        Task existing = new Task();
        existing.setId(102L);
        existing.setProject(project);
        existing.setTitle("Toggle");
        existing.setStatus(TaskStatus.IN_PROGRESS);
        existing.setCompleted(false);

        when(taskRepository.findById(102L)).thenReturn(Optional.of(existing));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        TaskResponse toggled = taskService.toggleTaskCompletion(10L, 102L);

        assertTrue(toggled.isCompleted());
        assertEquals("DONE", toggled.getStatus());
    }
}
