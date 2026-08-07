# 🧠 Thinkz AI – Learning Management System (LMS)

[![Version](https://img.shields.io/badge/version-1.0-blue.svg)](https://shields.io/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://shields.io/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node.js-18.x-339933?logo=nodedotjs)](https://nodejs.org/)

**Thinkz AI** is a comprehensive technology upskilling ecosystem, inspired by structured platforms like GeeksforGeeks. It enables learners to master modern tech skills through self-paced articles, structured video courses, interactive live cohorts, coding practice, assessments, and verified certifications.

---

## 🎯 Vision & Architecture

- **Future-Proof Frontend**: Built with React.js, architected to allow effortless migration to React Native (targeting ~70-80% code reuse).
- **Modular Backend**: Node.js + Express with isolated service modules.
- **Dual Database Strategy**: PostgreSQL (structured data: users, enrollments, payments) + MongoDB (unstructured: course content, forums, chat logs).
---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, React Router v6, Redux Toolkit, Axios, Tailwind CSS |
| **Future Mobile** | React Native (Shared Redux Store, Hooks, API Services) |
| **Backend** | Node.js, Express.js |
| **Databases** | PostgreSQL (Primary), MongoDB (Content/Logs) |
| **Authentication** | JWT, OAuth2, Bcrypt, RBAC Middleware |
| **Video/Interaction** | Jitsi Meet API / Zoom SDK, Excalidraw (Whiteboard) |
| **Code Execution** | Judge0 API / Docker Containers |
| **Payments** | Stripe / Razorpay |
| **Cloud** | AWS (S3, CloudFront, EC2, RDS), Nginx |
| **DevOps** | Docker, GitHub Actions (CI/CD), CloudWatch |

---

## 🚀 Getting Started (Local Development)

Follow these steps to spin up the entire platform locally.

### 1. Prerequisites
- Node.js (v18.x or higher)
- Docker (for local database containers)
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/your-org/thinkz-ai.git
cd thinkz-ai
