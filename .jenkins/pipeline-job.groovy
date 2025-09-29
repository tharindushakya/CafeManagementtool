// Job DSL script: create multibranch pipeline for CafeManagementTool
multibranchPipelineJob('CafeManagementTool-baseline') {
  description('Multibranch pipeline for the CafeManagementTool baseline implementation (Phase-2)')

  branchSources {
    branchSource {
      source {
        git {
          id('github-origin')
          remote('https://github.com/tharindushakya/CafeManagementtool.git')
          credentialsId('github-https-creds')
          // include main and master branches; Job DSL expects a space-separated list
          includes('main master')
        }
      }
    }
  }

  orphanedItemStrategy {
    discardOldItems {
      daysToKeep(30)
      numToKeep(20)
    }
  }

  factory {
    workflowBranchProjectFactory {
      scriptPath('Jenkinsfile')
    }
  }

  // periodic indexing (every 1 day) - optional, adjust as needed
  triggers {
    periodic(1)
  }
}
