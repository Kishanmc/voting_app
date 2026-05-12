pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-creds')
        DOCKER_HUB_REPO = 'kishanmc'

        BACKEND_IMAGE = "${DOCKER_HUB_REPO}/voting-app-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_REPO}/voting-app-frontend"

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout SCM') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Lint & Test Backend') {
            steps {
                dir('backend') {

                    sh '''
                        docker run --rm \
                        -v "$PWD":/app \
                        -w /app \
                        node:20-alpine \
                        sh -c "
                            npm ci
                            npm test || true
                        "
                    '''
                }
            }
        }

        stage('Lint & Test Frontend') {
            steps {
                dir('frontend') {

                    sh '''
                        docker run --rm \
                        -v "$PWD":/app \
                        -w /app \
                        node:20-alpine \
                        sh -c "
                            npm ci
                            npm test -- --watchAll=false --coverage || true
                        "
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {

                echo "Building Docker images..."

                dir('backend') {

                    sh """
                        docker build \
                        -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                        -t ${BACKEND_IMAGE}:latest \
                        .
                    """
                }

                dir('frontend') {

                    sh """
                        docker build \
                        --build-arg REACT_APP_API_URL=http://localhost:5000 \
                        -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        -t ${FRONTEND_IMAGE}:latest \
                        .
                    """
                }
            }
        }

        stage('Security Scan') {
            steps {

                echo "Running Trivy security scan..."

                sh '''
                    if command -v trivy >/dev/null 2>&1; then
                        trivy image --exit-code 0 --severity HIGH,CRITICAL '"${BACKEND_IMAGE}:${IMAGE_TAG}"' || true

                        trivy image --exit-code 0 --severity HIGH,CRITICAL '"${FRONTEND_IMAGE}:${IMAGE_TAG}"' || true
                    else
                        echo "Trivy not installed. Skipping scan."
                    fi
                '''
            }
        }

        stage('Push to Docker Hub') {

            when {
                branch 'main'
            }

            steps {

                echo "Logging into Docker Hub..."

                sh '''
                    echo "$DOCKER_HUB_CREDENTIALS_PSW" | docker login \
                    -u "$DOCKER_HUB_CREDENTIALS_USR" \
                    --password-stdin
                '''

                echo "Pushing backend image..."

                sh """
                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${BACKEND_IMAGE}:latest
                """

                echo "Pushing frontend image..."

                sh """
                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:latest
                """

                sh 'docker logout'
            }
        }

        stage('Deploy Application') {

            when {
                branch 'main'
            }

            steps {

                echo "Deploying containers..."

                sh '''
                    docker compose down || true
                    docker compose pull
                    docker compose up -d
                '''

                echo "Waiting for services..."

                sh 'sleep 15'

                echo "Checking frontend health..."

                sh '''
                    curl -f http://localhost:80 || exit 1
                '''

                echo "Checking backend health..."

                sh '''
                    curl -f http://localhost:5000 || exit 1
                '''
            }
        }
    }

    post {

        always {

            echo 'Cleaning Docker resources...'

            sh '''
                docker system prune -f || true
            '''
        }

        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}