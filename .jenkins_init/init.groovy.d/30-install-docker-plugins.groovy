import jenkins.model.*

def instance = Jenkins.getInstance()
def uc = instance.getUpdateCenter()
def pluginManager = instance.getPluginManager()

def required = ['docker-workflow', 'docker-plugin']
def toInstall = []

required.each { id ->
  if (pluginManager.getPlugin(id)) {
    println("Plugin ${id} already installed")
  } else {
    def pi = uc.getPlugin(id)
    if (pi) {
      println("Queuing install for plugin ${id}")
      toInstall << pi
    } else {
      println("Plugin ${id} not available in update center")
    }
  }
}

if (!toInstall.isEmpty()) {
  toInstall.each { p ->
    try {
      def fut = p.deploy(true)
      fut.get()
      println("Installed plugin: ${p.name}")
    } catch (e) {
      println("Failed to install ${p.name}: ${e}")
    }
  }
  println('Requesting safeRestart to activate newly installed plugins')
  instance.safeRestart()
} else {
  println('No docker-related plugins needed install')
}
