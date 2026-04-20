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