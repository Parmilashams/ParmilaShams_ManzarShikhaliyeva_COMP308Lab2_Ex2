pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ParmilaShams/ParmilaShams_ManzarShikhaliyeva_COMP308Lab2_Ex2.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                bat 'echo Build successful'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                bat 'echo Tests executed (mock)'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Running static code analysis...'
                bat 'echo SonarQube analysis completed (mock)'
            }
        }

        stage('Deliver') {
            steps {
                echo 'Delivering artifact...'
                bat 'echo Artifact delivered'
            }
        }

        stage('Deploy to Dev') {
            steps {
                echo 'Deploying to Dev environment...'
                bat 'echo App deployed to Dev'
            }
        }

        stage('Deploy to QAT') {
            steps {
                echo 'Deploying to QAT environment...'
                bat 'echo App deployed to QAT'
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo 'Deploying to Staging environment...'
                bat 'echo App deployed to Staging'
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Deploying to Production environment...'
                bat 'echo App deployed to Production'
            }
        }
    }
}
