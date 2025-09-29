// This is a Jenkins Job DSL script for creating a multibranch pipeline job
pipelineJob('CafeManagementTool-baseline') {
  description('Multibranch pipeline for the CafeManagementTool baseline implementation')
  definition {
    cpsScm {
      scm {
        git {
          // If your repository is private, create a Jenkins credential and set its id in the environment variable
          // GIT_CREDENTIALS_ID. The DSL will read that value at seed time and fall back to
          // 'github-https-creds' if the env var is not set.
          // For HTTPS use a 'Username with password' credential (username: your GitHub username, password: Personal Access Token).
          def gitCred = System.getenv('GIT_CREDENTIALS_ID') ?: 'github-https-creds'
          remote { url('https://github.com/tharindushakya/CafeManagementtool.git'); credentials(gitCred) }
          // Try common default branch names to avoid failures if the repo uses `main` or `master`.
          // Job DSL accepts multiple branch patterns here.
          branches('*/main', '*/master')
        }
      }
      scriptPath('Jenkinsfile')
    }
  }
}
