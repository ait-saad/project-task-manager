# Use pre-built JAR approach - build locally and copy
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Install wget for health check and create non-root user for security
RUN apk add --no-cache wget && \
    addgroup -g 1001 -S spring && \
    adduser -S spring -u 1001

# Copy pre-built JAR from local target directory
COPY target/taskmanager-0.0.1-SNAPSHOT.jar app.jar

# Change ownership to spring user
RUN chown spring:spring app.jar

# Switch to non-root user
USER spring

# Expose port
EXPOSE 8080

# Health check - remove for now since Spring Security blocks it
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#     CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]