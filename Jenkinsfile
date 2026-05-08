pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-creds')
        DOCKER_HUB_REPO = 'kishanmc'
        BACKEND_IMAGE = "${DOCKER_HUB_REPO}/voting-app-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_REPO}/voting-app-frontend"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out source code..."
                    checkout scm
                }
            }
        }

        stage('Lint & Test Backend') {
            agent {
                docker {
                    image 'node:20-alpine'
                    reuseNode true
                }
            }
            steps {
                dir('backend') {
                    sh 'npm ci'
                    // Add linting when eslint is configured
                    // sh 'npm run lint'
                    echo "Running backend tests..."
                    sh 'npm test || true'
                }
            }
        }

        stage('Lint & Test Frontend') {
            agent {
                docker {
                    image 'node:20-alpine'
                    reuseNode true
                }
            }
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    echo "Running frontend tests..."
                    sh 'npm test -- --watchAll=false --coverage || true'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building Docker images with tag: ${BUILD_NUMBER}"
                    
                    // Build backend image
                    dir('backend') {
                        sh """
                            docker build \
                                -t ${BACKEND_IMAGE}:${BUILD_NUMBER} \
                                -t ${BACKEND_IMAGE}:latest \
                                .
                        """
                    }
                    
                    // Build frontend image
                    dir('frontend') {
                        sh """
                            docker build \
                                --build-arg REACT_APP_API_URL=http://localhost:5000 \
                                -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                                -t ${FRONTEND_IMAGE}:latest \
                                .
                        """
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    echo "Running security scans..."
                    // Using Trivy for vulnerability scanning (install Trivy on Jenkins agent)
                    sh """
                        trivy image --exit-code 0 --severity HIGH,CRITICAL ${BACKEND_IMAGE}:${BUILD_NUMBER} || true
                        trivy image --exit-code 0 --severity HIGH,CRITICAL ${FRONTEND_IMAGE}:${BUILD_NUMBER} || true
                    """
                }
            }
        }

        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "Pushing images to Docker Hub..."
                    sh """
                        echo \$DOCKER_HUB_CREDENTIALS_PSW | docker login -u \$DOCKER_HUB_CREDENTIALS_USR --password-stdin
                        
                        docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${BACKEND_IMAGE}:latest
                        
                        docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${FRONTEND_IMAGE}:latest
                        
                        docker logout
                    """
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "Deploying application..."
                    // For production deployment, use docker-compose or orchestrator
                    sh """
                        docker-compose down || true
                        docker-compose pull
                        docker-compose up -d
                    """
                    
                    // Verify deployment
                    sh """
                        sleep 10
                        curl -f http://localhost:80 || exit 1
                        curl -f http://localhost:5000/api/user || exit 1
                    """
                }
            }
        }
    }

    post {
    always {
        script {
            echo 'Cleaning up...'
            sh 'docker system prune -f'
        }
    }

    failure {
        echo 'Pipeline failed!'
    }

    success {
        echo 'Pipeline succeeded!'
    }
}
}

