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
// NOTE: removed an accidental duplicate top-level pipeline block.
// Keep a single declarative pipeline above. If you want a short, separate
// pipeline for quick checks, create a separate Jenkinsfile or job.
