Voici un **guide complet et clair** pour déployer une image Docker en local avec **GitHub Actions** vers **Minikube (Kubernetes)**, en prenant ton exemple d’API **Node.js + MongoDB** 🚀

---

# 🎯 Objectif

1. Push ton code sur GitHub
2. GitHub Actions build l’image Docker
3. L’image est utilisée par Minikube en local
4. Déploiement automatique dans Kubernetes

---

# 🧱 Architecture

- API : Node.js (Express)
- Base de données : MongoDB
- Cluster local : Minikube
- CI/CD : GitHub Actions
- Containerisation : Docker

---

# ⚠️ Important (cas local)

GitHub Actions tourne dans le cloud.

👉 Donc tu as **2 options** :

### ✅ Option recommandée (propre)

Push l’image vers Docker Hub → Minikube la récupère.

### ⚠️ Option avancée

Self-hosted runner GitHub Actions installé sur ta machine locale.

Je vais te montrer **la méthode propre (Docker Hub)**.

---

# 1️⃣ Structure du projet

```
todo-api/
 ├── app.js
 ├── package.json
 ├── Dockerfile
 ├── k8s/
 │    ├── deployment.yaml
 │    ├── service.yaml
 │    └── mongo.yaml
 └── .github/workflows/deploy.yml
```

---

# 2️⃣ Dockerfile (Node.js API)

```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

---

# 3️⃣ Kubernetes Configuration

## 📌 MongoDB (k8s/mongo.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
        - name: mongo
          image: mongo:6
          ports:
            - containerPort: 27017
---
apiVersion: v1
kind: Service
metadata:
  name: mongo
spec:
  selector:
    app: mongo
  ports:
    - port: 27017
```

---

## 📌 API Deployment (k8s/deployment.yaml)

⚠️ Remplace `USERNAME` par ton Docker Hub username.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: todo-api
  template:
    metadata:
      labels:
        app: todo-api
    spec:
      containers:
        - name: todo-api
          image: USERNAME/todo-api:latest
          ports:
            - containerPort: 3000
          env:
            - name: MONGO_URL
              value: mongodb://mongo:27017/todo
---
apiVersion: v1
kind: Service
metadata:
  name: todo-api-service
spec:
  type: NodePort
  selector:
    app: todo-api
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30007
```

---

# 4️⃣ Workflow GitHub Actions

Fichier : `.github/workflows/deploy.yml`

```yaml
name: Build and Push Docker Image

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Push
        run: |
          docker build -t USERNAME/todo-api:latest .
          docker push USERNAME/todo-api:latest
```

---

# 5️⃣ Ajouter les Secrets GitHub

Dans ton repo GitHub :

Settings → Secrets and Variables → Actions

Ajoute :

```
DOCKER_USERNAME
DOCKER_PASSWORD
```

---

# 6️⃣ Lancer Minikube

```bash
minikube start
```

Vérifie :

```bash
kubectl get nodes
```

---

# 7️⃣ Déployer dans Kubernetes

```bash
kubectl apply -f k8s/mongo.yaml
kubectl apply -f k8s/deployment.yaml
```

Vérifie :

```bash
kubectl get pods
kubectl get services
```

---

# 8️⃣ Accéder à l’API

```bash
minikube service todo-api-service
```

Ou :

```
http://<minikube-ip>:30007
```

---

# 🔥 Workflow final

```
git push origin main
        ↓
GitHub Actions build image
        ↓
Push Docker Hub
        ↓
kubectl rollout restart deployment todo-api
        ↓
Minikube pull nouvelle image
```

---

# 🚀 Version plus avancée (pro)

Si tu veux faire du vrai CD automatique :

Ajouter dans GitHub Actions :

```yaml
- name: Set up kubectl
  uses: azure/setup-kubectl@v3

- name: Deploy to Kubernetes
  run: |
    kubectl apply -f k8s/
```

⚠️ Dans ce cas il faut un **self-hosted runner** installé sur ta machine locale.

---

# 🎓 Résumé

| Étape         | Outil          |
| ------------- | -------------- |
| Build         | Docker         |
| CI            | GitHub Actions |
| Registry      | Docker Hub     |
| Orchestration | Kubernetes     |
| Cluster Local | Minikube       |

---

Si tu veux, je peux te faire :

- 🔥 Une architecture CI/CD propre pour soutenance
- 📊 Un diagramme DevOps
- 🧠 Une version avec Helm
- ⚡ Une version avec auto versioning (tag v1.0.0)
- 🤖 Une version avec GitHub Actions + MLOps (comme ton projet FlowOps)

Tu veux aller à quel niveau ?
