## **1\. File & Project Structure**

* **Folder names:** PascalCase  
* **File names:** PascalCase (for Vue components) and camelCase (for JS utility files)  
* **Project structure follows layered architecture:**

/src

  /presentation   (UI components, Vue files)

  /logic          (business logic, detection handling)

  /data    (data handling, mapping files)

 

---

## **2\. Naming Conventions**

* **Vue Components:** PascalCase  
* **Variables & Functions:** camelCase  
* **Constants:** UPPER\_CASE\_WITH\_UNDERSCORES  
* **Data keys (JSON / objects):** camel\_case  
* Use clear names instead of abbreviations  
   *(If abbreviation is used, add a comment explaining it)*

---

## **3\. Formatting & Style**

* Use tabs for indentation  
* Maximum line length: 120 characters  
* Braces `{}` go on a new line  
* Avoid braces for single-line `if` statements  
* Leave one blank line between functions/methods  
* Keep functions small and focused (single responsibility)

---

## **4\. Commenting Practices**

* Add **header comments** at the top of each file:

*// File name: CaptureScreen.vue*

*// Description: Handles camera input and object capture*

* Add function-level comments for important logic:

*// Select top 5 objects based on confidence score*

* Use:  
  * `//` for single-line comments  
  * `/* */` for multi-line comments  
* Avoid over-commenting \- code should be mostly self-explanatory

---

## **5\. Code Organization**

For each file:

* Order of content:  
  * Constants  
  * Imports  
  * Reactive variables / data  
  * Methods / functions  
  * Helper/private functions  
* Keep UI (presentation) separate from logic  
* Do not mix:  
  * Detection logic inside UI components  
  * Data mapping inside UI  
* Reuse logic through `/logic` files instead of duplicating code

---

## **6\. Error Handling**

* Use `try-catch` only for:  
  * Camera access errors  
  * Model loading failures  
  * External library errors  
* Show **user-friendly messages in UI**  
   *(e.g., “Camera not accessible. Please allow permission.”)*  
* Do not silently ignore errors

---

## **7\. Version Control Practices**

* Branch names: camelCase and meaningful  
* Commit message format example:  
  * Added fallback option for object detection  
  * Displays object list when detection fails  
  * Improved user experience for retry flow  
  * Dev Notes:  
    * Updated logic in detectionHandler.js  
* Always:  
  * Pull before pushing  
  * Push after completing a feature  
  * Use pull requests if working in a team  
* Code must be reviewed by at least one team member before merge

---

## **8\. Testing Standards**

* Manual testing is required for:  
  * Object detection accuracy  
  * UI flow (capture → result → story)  
  * Mobile responsiveness  
* Test cases should include:  
  * Valid object detection  
  * Detection failure scenarios  
  * Camera permission denial  
* Ensure all features work on:  
  * Chrome  
  * Edge  
  * Mobile browser

---

## **9\. Dependency Management**

* Use only required libraries:  
  * TensorFlow.js  
  * COCO-SSD  
* Avoid unnecessary dependencies  
* Ensure project runs in browser without complex setup  
* Keep versions consistent across team

---

## **10\. Collaboration & Workflow Norms**

* Divide work by layers:  
  * UI (presentation)  
  * Logic (detection, mapping)  
  * Data (objects, themes, stories)  
* Avoid working on the same files simultaneously  
* Communicate changes before modifying shared logic  
* Keep commits small and focused