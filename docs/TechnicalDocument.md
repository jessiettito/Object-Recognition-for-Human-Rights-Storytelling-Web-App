## **1\. System Overview**

### **1.1 System Name**

### Human Rights Object Recognition Web App

### **1.2 Version**

* Current Version: v1.0  
* Last Updated: *April 20th, 2026* 

### **1.3 System Purpose**

* This system allows users to detect everyday objects using a camera and link them to human rights stories.  
* It is designed as a browser-based application for interactive storytelling.  
* The goal is to provide an engaging and educational experience for users.

### **1.4 Business Context**

* Developed for: Canadian Museum for Human Rights (CMHR)  
* Supports: Visitor engagement and digital storytelling  
* Problem Solved:  
  * Traditional museum content is static  
  * This system makes learning interactive and personalized

### **1.5 System Interfaces & Relationships**

* **Frontend ←→ Backend communication:** REST APIs  
* **Object Detection:** TensorFlow.js (COCO-SSD model)  
* **Data Source:** Internal JSON   
* Here is the link to the Architecture diagram. 

---

## **2\. System Architecture & Design**

### **2.1 Technology Stack**

* **Frontend:** Vue.js  
* **Backend:** No backend   
* **AI/ML:** TensorFlow.js  
* **Languages:** JavaScript, HTML, CSS  
* **Browser Requirements:** Modern browsers (Chrome, Edge)  
* **Hardware:** Camera-enabled device

### **2.2 System Components**

Break into layers:

* **Presentation Layer (UI)**  
  * Welcome Screen  
  * Capture Screen  
  * Result Screen  
  * Story Pages  
* **Logic Layer**  
  * Object detection handling  
* **Data Layer**  
  * Object → Theme → Story mapping  
  * JS files for all object, themes, reflective prompts and their mapping

### **2.3 Javascript files Schema**

* Objects Table  
  * id, name in english (en), name in french(fr), object icon  
* Themes Table  
  * id, name in english (en), name in french(fr), theme icon  
* Stories Table  
  * id, category (both languages), title (both language), theme (array), summary (both languages), full (both languages),  URL (museum website)   
* Relationships:  
  * ObjectThemeMap: One object → many themes; object id: array of theme Ids  
  * PromptsByTheme: One theme → three reflective prompts; theme id: array of three prompts in both languages

### **2.4 External Dependencies**

* TensorFlow.js  
* COCO-SSD model  
* Browser APIs (Camera access)

---

## **3\. Data Dictionary**

### **3.1 Data Elements**

| Field Name | Type | Description |
| ----- | ----- | ----- |
| objectId | String | Name of the object with no space |
| objectName | String | Name of detected object |
| themeId | String | Linked theme name |
| storyId | Integer | Linked story |

### **3.2 Business Meaning**

* **Object:** Physical item detected (e.g., bottle)  
* **Theme:** Human rights concept (e.g., clean water)  
* **Story:** Real-world example connected to the theme

---

## **4\. Business Processes**

### **4.1 User Roles**

* Visitor (main user)  
* Admin (optional future role)

### **4.2 Business Rules**

* Ignore detection of “person”  
* Select top 5 confidence objects  
* If detection fails → option to choose from list  
* If detected wrong object → give “try again” option 3 times   
* Each object must map to at least 1 theme

### **4.3 Application Flow**

1. User opens the application  
2. Camera permission is requested  
3. User captures an object  
4. Object is detected using COCO-SSD  
5. Top 5 confidence objects are shown  
6. Related themes are displayed  
7. Story summaries are presented  
8. User can explore full story which will also include the reflective prompt

---

## **5\. System Analysis**

### **5.1 Current Usage**

* Used in prototype environment  
* Designed for museum visitors  
* Can be used on mobile and desktop

### **5.2 Reliability**

* Depends on:  
  * Camera quality  
  * Lighting conditions  
* Known limitation: small objects may not be detected

### **5.3 Maintainability**

* Modular architecture (UI, logic, data separated)  
* Easy to update:  
  * Add new objects  
  * Add new stories  
* Code follows camelCase and PascelCase 

### **5.4 Known Issues**

* COCO-SSD sometimes detects background objects incorrectly  
* Performance varies on mobile devices  
* Limited dataset (needs expansion)

---

## **6\. Additional Sections**

### **6.1 Deployment & Environment**

* Runs in browser   
* Can be hosted on:  
  * Netlify / Vercel / cloud server  
* No backend dependency

### **6.2 Security & Compliance**

* Camera permission required  
* No personal data stored  
* Complies with basic privacy standards

### **6.3 Future Recommendations**

* Add more objects and stories  
* Add user analytics  
* Optimize for mobile performance

