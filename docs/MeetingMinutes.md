# Meeting 1
**Date & Time**

February 5th. (10:00 am - 10:30 am)

**Agenda**
- Welcome and meeting context
- Research summary and key findings
- Proposed constraints and assumptions
- High-level system architecture overview
- Object-to-story mapping framework
- Engagement and user experience concepts
- Feedback, questions, and direction check
- Next steps and action items

**Minutes**

_Research_

- Model: COCO-SSD
- Consider: multiple languages. (french  & english)
- Vue is a good choice:  easy to pick up.

_Content/scope constraints_
- Recommend sources: start by CMHR website
- Maybe consider other museums? (Ben to confirm)
- Project is Experimental (proof-of-concept, not production deployment)
- Focus is on testing feasibility and experience
- Web-based application only

_Multiple objects make it more interactive_
- Options for choosing directly from the objects instead of scanning
- Options for exploring directly from themes
- Multiple objects can map to same theme
- Multiple stories can exist per theme

_UI Direction_
- Keep UI simpler not too much detail
- Focus on storytelling rather than navigation
- Bilingual 

_Suggestions:_
- Provide text option if user doesn’t have an object to scan
- Different tabs to scroll
- Different topics
- Lightweight web server architecture
- Docker container (or a VM)
- Include dependency management within the project

_Goals: Easy deployment, reproducible environment and future scalability_

  
