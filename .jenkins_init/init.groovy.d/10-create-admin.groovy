import jenkins.model.*
import hudson.security.*

def instance = Jenkins.get()

// If security already configured, do nothing
if (instance.getSecurityRealm() instanceof hudson.security.HudsonPrivateSecurityRealm) {
    println("Security realm already configured, skipping admin creation.")
} else {
    println("Creating admin user 'admin' with password 'admin'")
    def realm = new HudsonPrivateSecurityRealm(false)
    realm.createAccount('admin','admin')
    instance.setSecurityRealm(realm)
    instance.setAuthorizationStrategy(new FullControlOnceLoggedInAuthorizationStrategy())
    // mark setup as completed so the setup wizard does not block automation
    try {
        instance.setInstallState(jenkins.install.InstallState.INITIAL_SETUP_COMPLETED)
    } catch(all) {
        println("Could not set install state: ${all}")
    }
    instance.save()
}

println("Init script finished")
