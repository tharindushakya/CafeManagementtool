// Run this Groovy script from Jenkins Script Console (Manage Jenkins -> Script Console)
// It will list currently pending script approvals, and then approve them.
// IMPORTANT: This must be run by a Jenkins admin (SYSTEM). Use with caution.

import jenkins.model.*
import org.jenkinsci.plugins.scriptsecurity.scripts.ScriptApproval

println('\n== Pending Script Signatures ==\n')
ScriptApproval.get().getPendingSignatures().each { sig ->
  println("Pending: ${sig}")
}

println('\nApproving all pending signatures...')
ScriptApproval.get().getPendingSignatures().each { sig ->
  ScriptApproval.get().approveSignature(sig)
  println("Approved: ${sig}")
}

println('\nDone. Please re-run the seed job.')
