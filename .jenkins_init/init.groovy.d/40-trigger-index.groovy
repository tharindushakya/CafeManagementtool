import jenkins.model.*
import jenkins.branch.*

def instance = Jenkins.getInstance()
def jobName = 'CafeManagementTool-baseline'

try {
  def item = instance.getItem(jobName)
  if (item == null) {
    println("Job ${jobName} not found to index")
  } else if (item instanceof org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject) {
    println("Triggering indexing for ${jobName}")
    item.scheduleBuild2(0)
    // also trigger indexing
    item.getSCMSourceCriteria()?.getSCMSourceOwners()?.each { o -> println o }
    item.getOrCreateProjectFactories()
    item.getSCMSourceOwners()
    item.scheduleBuild2(0)
  } else {
    println("${jobName} exists but is not a multibranch workflow project: ${item.getClass()}")
  }
} catch (e) {
  println("Error while triggering index: ${e}")
  e.printStackTrace()
}
