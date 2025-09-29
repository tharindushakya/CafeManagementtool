# Running Jenkins in Docker and importing the pipeline job

This guide shows how to run Jenkins in Docker and import the provided pipeline job that points at the repository `Jenkinsfile`.

## Run Jenkins with docker-compose (recommended)

1. Start Jenkins (this repository assumes Jenkins is already running in Docker):

```powershell
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

2. Open Jenkins at http://localhost:8080 and complete the initial setup.

## Import the pipeline job (Job DSL approach)

1. Install the "Job DSL" and "Pipeline: Multibranch" plugins in Jenkins.
2. Create a new "Freestyle" job called `seed-job`.
3. In `seed-job` configure a build step: "Process Job DSLs" and point it to `.jenkins/pipeline-job.groovy` in the repo (you can also paste the script directly).
4. Run `seed-job` to create the `CafeManagementTool-baseline` job. Edit the generated job to point to your repository URL (replace the placeholder in `.jenkins/pipeline-job.groovy`).

## Manual import (alternate)
1. In Jenkins, create a new *Multibranch Pipeline*.
2. For the Branch Sources, add your Git repository and credentials.
3. Set the *Script Path* to `Jenkinsfile`.

## Notes
- The provided `Jenkinsfile` uses Docker agents for Node steps (image `node:20-bullseye`). Make sure your Jenkins agent can run Docker (e.g., Jenkins is running on a host with Docker or using Docker-in-Docker agent setup).
- If Jenkins runs inside Docker, ensure the socket is mounted (e.g., `-v /var/run/docker.sock:/var/run/docker.sock`) or configure a remote Docker agent.
