pipeline {
  agent any
  environment {
    NODE_ENV = 'test'
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install') {
      steps {
        sh 'npm --prefix backend ci'
      }
    }
    stage('Lint') {
      steps {
        sh 'npm --prefix backend run lint'
      }
    }
    stage('Unit Tests') {
      steps {
        sh 'npm --prefix backend test --silent'
      }
    }
    stage('Contract Tests') {
      steps {
        sh 'npm --prefix backend test --silent -- tests/contract'
      }
    }
    stage('Integration Smoke') {
      steps {
        echo 'Start integration smoke stage (docker-compose up + smoke tests)'
      }
    }
    stage('Security Scan') {
      steps {
        echo 'Placeholder: run static security scans (Snyk/OWASP etc.)'
      }
    }
  }
  post {
    always {
      junit 'backend/test-results/*.xml'
    }
  }
}
