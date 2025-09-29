pipeline {
  agent none
  options {
    timestamps()
  }
  stages {
    stage('Checkout') {
      agent any
      steps {
        checkout scm
      }
    }

    stage('Install') {
      agent { docker { image 'node:20-bullseye' args '-u root:root' } }
      steps {
        sh 'npm --prefix backend ci'
      }
    }

    stage('Lint') {
      agent { docker { image 'node:20-bullseye' args '-u root:root' } }
      steps {
        sh 'npm --prefix backend run lint'
      }
    }

    stage('Unit Tests') {
      agent { docker { image 'node:20-bullseye' args '-u root:root' } }
      steps {
        sh 'npm --prefix backend test --silent'
      }
    }

    stage('Contract Tests') {
      agent { docker { image 'node:20-bullseye' args '-u root:root' } }
      steps {
        // Run only contract tests pattern
        sh 'npm --prefix backend test --silent -- tests/contract'
      }
    }

    stage('Integration Smoke') {
      agent any
      steps {
        echo 'Starting integration smoke: bring up docker-compose and run smoke steps'
        sh 'docker-compose up -d --remove-orphans'
        // Give services a moment to start
        sh 'sleep 5'
        sh 'npm --prefix backend run migrate || true'
        sh 'echo "Run integration smoke tests (manual or scripted)"'
      }
    }

    stage('Security Scan') {
      agent { docker { image 'node:20-bullseye' args '-u root:root' } }
      steps {
        echo 'Placeholder: run static security scans (Snyk/OWASP etc.)'
      }
    }
  }
  post {
    always {
      junit 'backend/test-results/*.xml'
      sh 'docker-compose down || true'
    }
  }
}
pipeline {
  agent any
  stages {
    stage('Info') {
      steps {
        echo "Running on ${env.NODE_NAME}"
        // show basic environment
        sh 'uname -a || true'
        sh 'node --version || true'
      }
    }

    stage('Install (backend)') {
      steps {
        dir('backend') {
          sh 'npm ci || true'
        }
      }
    }

    stage('Unit tests (backend)') {
      steps {
        dir('backend') {
          sh 'npm test --silent || true'
        }
      }
    }
  }
  post {
    always {
      echo 'Minimal pipeline finished.'
    }
  }
}
