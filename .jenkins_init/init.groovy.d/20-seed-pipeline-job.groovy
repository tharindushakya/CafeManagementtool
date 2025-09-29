import jenkins.model.*
import hudson.model.*
import org.jenkinsci.plugins.workflow.job.WorkflowJob
import org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition
import hudson.plugins.git.GitSCM
import hudson.plugins.git.BranchSpec
import hudson.plugins.git.UserRemoteConfig

def instance = Jenkins.getInstance()
def jobName = 'CafeManagementTool-baseline'

if (instance.getItem(jobName) != null) {
  println("Job '${jobName}' already exists. Skipping seed.")
  return
}

try {
  println("Creating job '${jobName}' from init script...")

  // Build GitSCM configuration
  def repoUrl = 'https://github.com/tharindushakya/CafeManagementtool.git'
  def credentialsId = System.getenv('GIT_CREDENTIALS_ID') ?: ''
  def remoteConfig = new UserRemoteConfig(repoUrl, '', '', credentialsId)
  def branches = [new BranchSpec('*/main'), new BranchSpec('*/master')]
  // Use the constructor variant that includes submodule configs and extensions lists to match the Git plugin API
  def scm = new GitSCM([remoteConfig], branches, false, Collections.<hudson.plugins.git.SubmoduleConfig>emptyList(), null, null, Collections.<hudson.plugins.git.extensions.GitSCMExtension>emptyList())

  // Point to the Jenkinsfile in the repo
  def scriptPath = 'Jenkinsfile'
  def flowDef = new CpsScmFlowDefinition(scm, scriptPath)

  // Create the workflow/pipeline job
  def job = instance.createProject(WorkflowJob, jobName)
  job.setDefinition(flowDef)
  job.save()

  println("Created job '${jobName}' successfully.")
} catch (Exception e) {
  println("Failed to create job '${jobName}': ${e}")
  e.printStackTrace()
}
