# Meeting Minutes \#1: 

Date: February 5th, 2026 

* Research   
  * Model: COCO-SSD   
  * Consider: multiple languages. (french  & english)  
  * Vue is a good choice:  easy to pick up.  
* Content/scope constraints  
  * Recommend sources: start by CMHR website  
    * Maybe consider other museums? (Ben to confirm)   
  * Project is Experimental (proof-of-concept, not production deployment)  
  * Focus is on testing feasibility and experience   
  * Web-based application only   
* Multiple objects make it more interactive  
  * Options for choosing directly from the objects instead of scanning  
  * Options for exploring directly from themes  
  * Multiple objects can map to same theme  
  * Multiple stories can exist per theme  
* UI Direction  
  * Keep UI simpler not too much detail   
  * Focus on storytelling rather than navigation   
  * Bilingual   
* Suggestions:   
  * Provide text option if user doesn’t have an object to scan   
  * Different tabs to scroll  
  * Different topics  
  * Lightweight web server architecture  
  * Docker container  
    * Or a VM  
    * Include dependency management within the project  
* Goals: Easy deployment, reproducible environment and future scalability 

# 

# Meeting Minutes \#2

* Progress overview:  
  * Completed: Object Recognition is working, Welcome screen, Capture screen, Result screen.  
  * In-progress: Themes & Reflective prompt screen and Objects/Themes Lists screen.  
  * To-do by next meeting: Story mapping.  
  * Architecture: presentation and logic layer separated so changes are easily made.   
* Current design choices:  
  * Ignoring person when doing object recognition.  
  * Multiple objects being detected \-\> show object with higher confidence level only.  
  * Issue:  e.g. eyeglasses have trouble being recognized.  
    * Solution: presenting a list of objects that are being detected.  
    * Object recognition failing (multiple attempts) \-\> redirect to objects list.   
    * Idea: reduce friction as much as possible.  
  * Double ‘allow’ window popup to be fixed.  
  * Fixed list of objects that will be mapped to.   
* UI:  
  * Currently: images as background.  
  * Solid color is probably better.	   
* **Next meeting: march 19th at 10 am**  
* Considerations:  
  * Accessibility for phones

# Meeting 3:

Date: March 19, 2026 

1. Progress overview:  
   1. Completed:   
      1. Themes & Reflective Prompt Screen  
      2. Objects/Themes List around 30 objects and 20 themes. Each object mapped to at least 3 themes   
      3. Each theme have at least 3 reflective prompts and get chosen randomly ( logical, educational and emotional)   
      4. Fixed permission popup: doesn’t show the created UI version only the actual permission pop up shows   
      5. UI update (solid background)  
   2. In-progress:  
      1. Full story screen: currently we have a paragraph for the stories  
      2. Adding more themes/objects/prompts.  
   3. By next meeting:  
      1. Add reflective prompt to story directly   
      2. Have the object being detected and captured without clicking a button. (video rendering)   
      3. Fix object not being recognized(e.g. person) has the same format as object being recognized.   
      4. List of the objects button make them visible which one is selected  
      5. Change “continue without selecting theme” to “ check all stories”   
2. Story mapping  
   1. Currently we have 2 versions:  
      1. Link (directs to full story in CMHR website)  
      2. Full text  
   2. Suggestion: have text but add link to CMHR website for full experience  
   3. En/Fr: Keep the way it is being translated  
3. UI:  
   1. Relevance is on functionality  
   2. Images to be added to stories  
   3. Make preview in capture screen bigger and buttons smaller.  
4. **Next meeting tentative dates:**  
   1. Thursday April 2nd: any time before 3pm  
      2. Tuesday March 31st: L any time between 8 am-11am or 1:30 pm \- 3pm  
      3. Wednesday: any time before 3pm


# Meeting 4

Date: April 2nd, 2026 

1. Progress overview:  
   1. Auto capture implemented   
   2. Result screen UI changes    
   3. Unknown object UI added   
   4. Select theme UI    
   5. Full story screen redesign   
        
2. Capture screen changes  
   1. Either capture button or have a timer   
      1. Timer causes friction  
      2. either way is fine   
      3. Make timer into more of video rendering and capture button for capture only   
           
3. Objects/Prompts/Stories content  
   1. 20-25 themes  
   2. 50 objects  
   3. 15 stories. 

\*\*\* We want to expand stories and objects as much as we can .

4. Next steps  
   1. Technical documentation   
   2. Test on fresh environment   
   3. Add intro to the welcome page (e.g. object detection for human story telling)  
   4. Get rid of ‘Themes’ screen  
        
5. Availability  
   1. **Reminder: final presentation is on April 10th from 9am \-11:30 am**   
      1. Other groups and us will be showing our projects. We would love to have you there\!  
   2. **Final handoff tentative dates: April 20th/21st** (in person) before 3 pm\!

			Please propose times that you would like 

# Final handoff meeting

Date: April 21st, 2026 

1. Deliverables  
   1. Working prototype: fully functional browser based prototype, no installation   
   2. Object recognition: detects the object and connect it to the real world human rights stories  
   3. Smooth and simple UI  
   4. Mapping system connects objects with themes, prompts and stories  
   5. Detailed technical documentation, as well as set up instructions

2. Updates:  
   1. UX/UI improvements  
      1. Added objects and themes in title for Stories Screen  
      2. Added explore other objects section (5 randomly chose objects) on Stories Screen  
      3. Breadcrumb navigation  
      4. Next/previous buttons on Full Story Screen  
   2. Added video rendering (on separate branch)  
      1. Not merged it with our main branch as we have kept it optional  
      2. Experience takes more time, and is a bit “overwhelming” when multiple objects are being shown at the same time.  
3. Handoff & code transfer  
   1. Repository and other technicalities are explained in detail in the docs folder in repo.  
   2. Open source project  
   3. Will be adding CMHR as admin collaborator   
4. Limitations  
   1. Detection                                                                        
      1. COCO-SSD only recognizes \~80 common everyday objects.   
         1. it's not trained on   human rights artifacts specifically, so niche or culturally specific objects won't be detected                                             
      2. Confidence is inconsistent in poor lighting or with unusual angles          
      3. Model takes a few seconds to load on first use (cold start)   
   2. Performance                                                                        
      1. Runs entirely in the browser. On older devices the detection can be slow or drain battery      
   3. The object/story library is fixed (limited dataset): adding new objects or stories requires a  developer to update the data files manually. Not very efficient.

