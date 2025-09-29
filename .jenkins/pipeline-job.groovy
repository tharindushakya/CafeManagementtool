// This is a Jenkins Job DSL script for creating a multibranch pipeline job
pipelineJob('CafeManagementTool-baseline') {
  description('Multibranch pipeline for the CafeManagementTool baseline implementation')
  definition {
    cpsScm {
      scm {
        git {
          remote { url('https://github.com/tharindushakya/CafeManagementtool.git') }
          branches { branch('*/main') }
        }
      }
      scriptPath('Jenkinsfile')
    }
  }
}
