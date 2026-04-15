# Overview

This project is a web-based application developed in collaboration with the Canadian Museum for Human Rights (CMHR).

The goal is to allow users to scan everyday objects using their camera and explore human rights stories connected to those objects.

The system detects an object, maps it to relevant themes, and presents reflective prompts and stories to the user.

# Team Members
- Jessie Ttito Tello
- Sukhveer Kaur

# Tech Stack
- Object Recognition: COCO-SSD
- Frontend: Vue.js
- Language: JavaScript

# Key Features
- Real-time object detection using camera
- Mapping objects to human rights themes
- Reflective prompts for user engagement
- Story summaries and full story view
- Fallback option when detection fails
- Bilingual-ready structure (English & French support)

# How to Run the Project (Setup Guide)
## Recommended Method: Docker
### Prerequisites
Before running the project, make sure the following is installed:

- Docker
- Docker Desktop (recommended for Windows and Mac)
- A modern web browser (Google Chrome or Microsoft Edge recommended)

### Build the Docker Image
From the root of the project, run:

```bash
docker build -t cmhr-object-recognition .
```

### Run the Docker Container
After the image is built, run:

```bash
docker run -p 8080:8080 cmhr-object-recognition
```

### Open the Application
Once the container is running, open the application in your browser at:
    http://localhost:8080

### Stop the Container
To stop the running container, press:

Ctrl + C

### Rebuild After Changes
If changes are made to the project, rebuild the Docker image:

```bash 
docker build -t cmhr-object-recognition .
```
Then run the container again.


## Application Flow

1. User opens the application  
2. Camera permission is requested  
3. User captures an object  
4. Object is detected using COCO-SSD  
5. top 5 confidence objects are selected  
6. Related themes are displayed  
7. Story summaries are presented  
8. User can explore full story which will also include the reflective prompt

## Object Detection Logic

* Uses COCO-SSD model via TensorFlow.js  
* Ignores irrelevant detections (e.g., “person”)  
* Selects objects with top 5 confidence  
* Provides fallback if detection fails

### Limitations

* May miss small objects  
* May detect background objects incorrectly

## Folder Structure

/src  
  /presentation  
  /logic  
  /persistence  
  /objects  


# Branching Strategy 

# Architecture Diagram
- [Here is a link to our diagram](https://github.com/jessiettito/Object-Recognition-for-Human-Rights-Storytelling-Web-App/blob/main/docs/SystemDiagram.md)
# Meeting minutes
- [Here is a link to our meeting minutes](https://github.com/jessiettito/Object-Recognition-for-Human-Rights-Storytelling-Web-App/blob/main/docs/MeetingMinutes.md)
