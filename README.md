# SentiMeet

SentiMeet is a P2P video conferencing application that integrates real-time AI sentiment analysis. This project allows users to have video calls while simultaneously analyzing the emotions of participants, enhancing virtual interactions.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)

## Features

- Peer-to-peer video conferencing.
- Real-time sentiment analysis using AI.
- User-friendly interface for sign-in and sign-up.
- Google authentication integration.
- Error handling and user notifications.

## Technologies Used

- **Frontend:** React, Redux
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **WebSocket for real-time communication**
- **Styling:** CSS Modules
- **AI Sentiment Analysis**

## Setup Instructions

To set up **SentiMeet** on your local machine, follow these steps:

### 1. Install Redis

Make sure you have Redis installed. You can download and install Redis from the official website: [Redis.io](https://redis.io/download).

### 2. Start a Redis Server

After installing Redis, start the Redis server using the following command:

```bash
redis-server.exe
```
### 3. Navigate to the Server Directory

Open your terminal and navigate to the server directory of the project, and then run these commands to install dependencies and start the server:

```bash
npm install
node server.js
```
### 4. Navigate to the WebSocket Directory
Next, navigate to the WebSocket directory. Install the dependencies and start the WebSocket server:

```bash
npm install
node server.js
```
### 5. Navigate to the Emotion_Recognition Directory
Next, navigate to the Emotion Recognition directory (emotion_recognition). Install the dependancies and run the python script:

```bash
pip install -r requirements.txt
python emotion.py
```

### 6. Navigate to the My-App Directory
Finally, navigate to the React app directory (my-app). Install the dependencies and start the React application:

```bash
npm install
npm start
```
## Running the Application

Once all servers are running, you should be able to access the SentiMeet application in your web browser at http://localhost:3001
