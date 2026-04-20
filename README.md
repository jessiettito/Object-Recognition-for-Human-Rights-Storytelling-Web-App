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


## Application Flow

1. User opens the application  
2. Camera permission is requested  
3. User captures an object  
4. Object is detected using COCO-SSD  
5. top 5 confidence objects are selected  
6. Related themes are displayed  
7. Story summaries are presented  
8. User can explore full story which will also include the reflective prompt


# Architecture Diagram
- [Here is a link to our diagram](https://github.com/jessiettito/Object-Recognition-for-Human-Rights-Storytelling-Web-App/blob/main/docs/SystemDiagram.md)

# Documents 

- [Meeting Minutes](https://github.com/jessiettito/Object-Recognition-for-Human-Rights-Storytelling-Web-App/blob/main/docs/MeetingMinutes.md)
- [Technical Document](https://github.com/jessiettito/Object-Recognition-for-Human-Rights-Storytelling-Web-App/blob/main/docs/TechnicalDocument.md)

# Set up Guide
- [Here is the link to Set up and run guide](https://github.com/jessiettito/Object-Recognition-for-Human-Rights-Storytelling-Web-App/blob/main/docs/SetupGuide.md)

