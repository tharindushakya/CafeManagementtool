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
          // By default this source will discover all branches. If you want to limit
          // discovery to specific branch names (e.g. main, master) we can add a
          // branch filtering trait — let me know and I can add that in a follow-up.
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
