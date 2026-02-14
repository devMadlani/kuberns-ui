# Kuberns – Full Stack Cloud Deployment Platform

## Overview

This project implements the "Create New App" workflow described in the Kuberns Full Stack Assessment. The goal was to design and build a self-service cloud deployment system similar to platforms like Heroku, Vercel, Render, or Railway.

The system allows users to:

- Register and authenticate
- Connect GitHub
- Select organization, repository, and branch
- Configure application settings
- Configure environment variables
- Select region and plan
- Launch an AWS EC2 instance
- Track deployment status
- View deployment logs
- Retrieve the public IP address of the deployed instance

The application is built with production-level architectural principles, clean separation of concerns, and region-safe AWS provisioning.

---

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript (strict mode)
- Prisma ORM
- PostgreSQL
- AWS SDK v3
- Zod for validation
- Clean Architecture
- Dependency Injection pattern
- Repository pattern

### Frontend

- React
- JWT-based authentication
- Multi-step application setup flow

---

## System Architecture

The backend follows a layered architecture:

Controller → Service → Repository → Prisma

Responsibilities:

- Controller: Handles HTTP layer only
- Service: Contains business logic
- Repository: Handles database access only
- AWS Service: Handles cloud provisioning logic

This structure ensures:

- Separation of concerns
- Testability
- Scalability
- Maintainability
- Replaceable infrastructure layer

No AWS logic exists inside controllers.
No database queries exist inside controllers.
All external integrations are isolated within services.

---

## Data Model Design

The data model was designed to support multi-environment and multi-deployment scenarios in the future.

Entity Relationship:

User  
 └── WebApp  
 └── Environment  
 └── Instance  
 └── Deployment  
 └── DeploymentLog

### User

- id
- email
- passwordHash
- githubAccessToken
- createdAt
- updatedAt

### WebApp

- id
- name
- userId
- region
- plan
- framework
- repoProvider
- repoOwner
- repoName
- defaultBranch
- createdAt
- updatedAt

Unique constraint: (userId, name)

### Environment

- id
- webAppId
- name (default: production)
- branch
- port
- envVars (JSONB)
- status
- createdAt
- updatedAt

### Instance

- id
- environmentId
- cpu
- ram
- storage
- instanceType
- publicIp
- status
- createdAt
- updatedAt

### Deployment

- id
- webAppId
- environmentId
- status (pending → provisioning → active → failed)
- startedAt
- finishedAt
- errorMessage
- createdAt

### DeploymentLog

- id
- deploymentId
- level (info | error)
- message
- createdAt

This design ensures strong relational integrity, multi-tenant safety, and clean lifecycle tracking.

---

## WebApp Creation Strategy

When the user clicks “Finish My Setup”:

1. WebApp is created
2. Default Environment is created
3. Instance configuration is created (logical infra configuration)
4. Deployment record is created with status = pending
5. Provisioning process starts

All database operations are wrapped in a Prisma transaction to ensure atomicity.

---

## AWS EC2 Provisioning Strategy

### Multi-Region Support

The system supports major AWS regions including:

- us-east-1
- us-east-2
- us-west-1
- us-west-2
- ap-south-1
- eu-central-1
- and others

The region selected by the user is used to initialize region-scoped AWS clients:

EC2Client({ region })
SSMClient({ region })

No region is hardcoded in the application.

---

### Dynamic AMI Resolution

Problem encountered:

AMI IDs are region-scoped. When a hardcoded AMI ID was used across regions, AWS returned:

InvalidAMIID.NotFound

Solution implemented:

The system dynamically resolves the correct Amazon Linux AMI for the selected region using AWS Systems Manager public parameters:

/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64

Using SSM GetParameter ensures:

- Region-safe deployments
- No hardcoded AMI IDs
- Automatic AMI updates
- Future-proof provisioning

---

### IAM Permission Issue

During development, provisioning failed with:

ssm:GetParameter not authorized

Root cause:
The IAM user did not have permission to read SSM parameters.

Resolution:
Added minimal policy allowing:

ssm:GetParameter

This ensured dynamic AMI resolution worked correctly.

---

## Deployment Lifecycle

Deployment state transitions:

pending  
→ provisioning  
→ active

If failure occurs:

→ failed

During provisioning:

- AMI is resolved dynamically
- EC2 instance is launched
- System waits until instance is running
- Public IP address is retrieved
- Instance record is updated
- Deployment status is updated
- Deployment logs are inserted

All major steps are recorded in the DeploymentLog table.

---

## Plan to Instance Mapping

Application plan determines infrastructure configuration:

starter:

- t2.micro
- 1 CPU
- 1024 MB RAM

pro:

- t3.medium
- 2 CPU
- 4096 MB RAM

Mapping is handled in the service layer and not in controllers.

---

## API Endpoints

Authentication

- POST /auth/register
- POST /auth/login

GitHub Integration

- GET /git/github/orgs
- GET /git/github/repos
- GET /git/github/branches

WebApps

- POST /webapps
- GET /webapps
- GET /webapps/:id

Deployment

- POST /deployments/:id/start
- GET /deployments/:id
- GET /deployments/:id/logs

---

## Security Considerations

- JWT-based authentication middleware
- Environment variables stored securely
- No AWS credentials logged
- Region validation enforced
- Zod validation for all inputs
- Unique WebApp name per user
- Clean separation between user and resource ownership

---

## Key Engineering Decisions

1. Used dependency injection for service wiring.
2. Implemented repository pattern for database abstraction.
3. Used Prisma transactions for atomic operations.
4. Avoided hardcoded AMI IDs.
5. Implemented region-scoped AWS clients.
6. Solved IAM permission edge cases.
7. Designed deployment lifecycle tracking.
8. Persisted provisioning logs for observability.

---

## Setup Instructions

1. Clone repository.
2. Install dependencies:

   npm install

3. Setup environment variables:

   DATABASE_URL=
   JWT_SECRET=
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=

4. Run Prisma migrations:

   npx prisma migrate dev

5. Start backend:

   npm run dev

6. Start frontend:

   npm start

---

## Time Estimate

Frontend:
8–10 hours

Backend Core:
10–12 hours

AWS Provisioning:
6–8 hours

Documentation and Testing:
3–4 hours

---

## Future Improvements

- Async job queue for non-blocking provisioning
- Auto-deploy on Git push
- Docker-based builds
- Load balancer integration
- HTTPS automation
- CI/CD pipeline integration
- Multi-environment (staging/preview) support

---

## Conclusion

This project demonstrates:

- Full-stack system design
- Clean architectural layering
- Dependency Injection strategy
- Scalable relational data modeling
- Region-safe AWS provisioning
- Secure IAM handling
- Deployment lifecycle management

The system fully implements the required Create New App workflow and completes the AWS EC2 provisioning challenge described in the assessment.
