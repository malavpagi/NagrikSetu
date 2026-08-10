# SIH1516 — AI-Based Citizen Grievance Management Platform

## 1. Technology Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + HTTP-only cookies
- **AI:** Gemini Flash-Lite for text + image analysis
- **Image Storage:** Multer local disk storage
- **Maps:** Leaflet + OpenStreetMap
- **Geocoding:** Free reverse-geocoding API such as Nominatim
- **Security:** bcrypt, RBAC, basic rate limiting, file validation

> No Socket.IO, Zod, Cloudinary, or refresh-token database storage is required for the hackathon MVP.

> This document follows the requested MERN architecture. MongoDB's geospatial indexes and `$near` / `$geoWithin` can be used for complaint grouping and location queries.

---

## 2. Critical Requirement — Mobile-First UI

**The entire platform MUST be designed for mobile phones first.**

The citizen side is expected to be used primarily from mobile devices because citizens will normally capture evidence using their phone camera and location.

Requirements:

- Responsive UI for mobile, tablet, and desktop.
- Camera interface must work well on mobile browsers.
- Location permission flow must be clear.
- Complaint forms must be comfortable on small screens.
- Buttons and inputs must be touch-friendly.
- Government dashboards should also be responsive, although desktop use may be more common for officials.
- Do not design desktop first and simply shrink it for mobile.

---

# 3. User Roles

The system should have three main roles:

1. **Citizen**
2. **Department Official**
3. **Super Admin**

Role-based access control (RBAC) must be enforced by the backend, not only by hiding UI elements in React.

---

# 4. Citizen Registration

The registration page collects:

- Unique username
- Full name
- Mobile number
- Email
- Password
- Other required account information

Requirements:

- Username must be unique.
- Email and mobile number should be validated.
- Password must be securely hashed with bcrypt.
- Password must never be stored as plain text.

After successful registration, the user goes to the login page.

---

# 5. Citizen Login

The user logs in using:

- Username
- Password

After successful authentication, the user is taken to the citizen home screen.

Use a simple JWT authentication flow with secure HTTP-only cookies.

For the hackathon MVP:

- Access-token-based authentication is sufficient.
- There is no need to store refresh tokens in MongoDB.
- Passwords are hashed with bcrypt.
- Backend middleware verifies the JWT on protected routes.

---

# 6. Citizen Home Screen

The home screen contains:

- Profile
- Take Photo / Capture Evidence
- Show Images
- Create Complaint
- My Complaints / Past Requests

---

# 7. Citizen Profile

The citizen can:

- View profile information.
- Manage contact information.
- Manage contact/privacy preferences.

Citizen contact information should not automatically become visible to officials unless the citizen has allowed it.

---

# 8. Evidence Capture

## 8.1 Mandatory Location Permission

Before taking an evidence photo:

1. The website requests the user's current location.
2. If location permission is denied/unavailable, the user cannot capture evidence.
3. A photo captured through the platform must have an associated capture location and timestamp.

This is an anti-fraud signal.

### Important correction

The captured GPS location represents **where the camera/user was when the image was captured**.

It does **not guarantee that the photographed problem is exactly at those coordinates**.

Therefore the system should distinguish:

- **Capture Location:** location of the user/camera at capture time.
- **Incident Location:** location where the actual problem is reported.

For the initial version, capture location can be the default incident location. A stronger version can let the citizen confirm the incident location on a map while preserving the original capture location as immutable evidence.

The platform should not claim that GPS alone completely prevents fraudulent location reporting.

---

# 9. Taking an Evidence Photo

The citizen takes the photo using the camera interface provided by the website.

The evidence record should contain:

- Image
- User ID
- Capture timestamp
- Capture latitude
- Capture longitude
- storage reference
- Optional camera/device metadata where available

The image should be stored in local user disk storage rather than storing files directly in MongoDB. 

MongoDB stores the image storage reference and evidence metadata.

---

# 10. Show Images

The citizen can open **Show Images** from the home screen.

Each evidence item can show:

- Image
- Capture date/time
- Location/address

---

# 11. Create Complaint

The citizen clicks **Create Complaint**.

The complaint form requires exactly one previously captured image.

The system should not allow arbitrary gallery uploads if the goal is to enforce the evidence-capture workflow.

If the wrong image was selected:

- Remove it.
- Select another previously captured image.

---

# 12. Automatic Location Filling

After the evidence image is selected:

- The system reads the capture latitude/longitude stored with that evidence.
- The coordinates are not normally shown directly to the citizen.
- A geocoding service converts the coordinates into a human-readable address.
- The location field is automatically filled.
- The citizen cannot directly edit this location in the basic workflow.

Example:

```text
Latitude + Longitude
        ↓
Ahmedabad, Gujarat
```

### Important limitation

This is the **capture location**. If a citizen photographs a problem from far away, capture location and actual incident location may differ.

---

# 13. Contact Information Privacy

The complaint form contains:

- Username
- Mobile number

The citizen can choose whether to expose contact information to the department by filling the contact fields. The contact fields will not be mandatory.

The complaint can still be processed using the evidence and location. Officials can communicate through the platform or investigate the reported location directly.

---

# 14. Complaint Description

The citizen writes a description of the problem.

Example:

> There is a large pothole near my house which is causing problems for people and has already caused bike accidents.

---

# 15. Complaint Submission Pipeline

When the citizen clicks **Submit**, the backend verifies:

- Authenticated user
- Valid evidence
- Evidence has stored latitude/longitude
- Evidence has timestamp
- Complaint description
- Valid complaint data

Contact information is optional.

The backend must never trust validation performed only by the frontend.

---

# 16. AI Complaint Analysis

The backend sends to Gemini Flash-Lite:

1. Evidence image
2. Citizen description

The model performs:

### 16.1 Image validation

Checks whether the image appears relevant.

Examples:

- Unrelated image
- Adult/sexual content
- Abusive/inappropriate visual content
- Completely irrelevant image
- No recognizable grievance

### 16.2 Description validation and correction

Checks whether the description is:

- Relevant
- Related to a grievance
- Free from unacceptable abusive content

If the description is relevant but contains spelling or grammar mistakes, the LLM should correct the grammar/spelling and return a cleaned version.

Example:

```text
User:
There is big hole in road and many bike is crashed.

AI:
There is a big hole in the road, and many bikes have crashed because of it.
```

### 16.3 Image-description consistency

Checks whether the image and description appear to describe the same problem.

Example:

```text
Image: road pothole
Description: large pothole causing accidents
→ Match
```

If they do not match, the complaint should not automatically be accepted.

---

# 17. AI Output Must Use a Fixed Structured Format

The LLM should return structured JSON rather than free-form text.

Example:

```json
{
  "isValidComplaint": true,
  "reason": null,
  "imageRelevant": true,
  "descriptionRelevant": true,
  "imageDescriptionMatch": true,
  "department": "ROAD_MAINTENANCE",
  "problemType": "POTHOLE",
  "severity": "HIGH",
  "summary": "Large pothole causing road safety risk"
}
```

Invalid example:

```json
{
  "isValidComplaint": false,
  "reason": "IMAGE_DESCRIPTION_MISMATCH",
  "imageRelevant": true,
  "descriptionRelevant": true,
  "imageDescriptionMatch": false,
  "department": null,
  "problemType": null,
  "severity": null,
  "summary": null
}
```

The backend must validate the AI response before using it.

---

# 18. Invalid Complaint Handling

If AI determines that the complaint is invalid because of:

- Unrelated image
- Unacceptable image content
- Unacceptable description
- Image-description mismatch
- No recognizable grievance

then the complaint should **not be stored as an active departmental complaint**.

The user receives a clear reason.

Do not expose unnecessary internal model reasoning.

---

# 19. Important AI Limitation

AI can assess:

- What appears in the image.
- Whether the description appears relevant.
- Whether image and description appear consistent.
- Likely department.
- Problem type.
- Estimated severity.

AI cannot guarantee:

> This problem definitely exists at this exact physical location.

AI output is an automated assessment, not absolute proof.

Suspicious/high-risk/undetermined cases can be routed for official/manual verification.

---

# 20. Department Classification

If valid, the AI identifies the relevant department from a **predefined list**.

The system prompt sent with every AI request should explicitly instruct the LLM to classify the complaint only into these predefined categories.

Example instruction:

```text
If the image and description indicate road damage,
classify the complaint as "Road Maintenance".

If the image and description indicate a water-related problem,
classify the complaint as "Water Department".

Only use the predefined department categories.
Do not create new department categories.
```

Examples:

```text
Pothole / damaged road
→ Road Maintenance

Water leakage / broken water pipeline
→ Water Department

Garbage accumulation
→ Sanitation Department

Street light failure
→ Street Lighting Department
```

The backend maintains the allowed department list, and the AI must return one of those categories. This prevents the LLM from inventing its own departments.

# 21. Complaint Document

After successful AI validation, the backend creates the complaint document.

Conceptually:

```text
Complaint
├── Complaint ID
├── Citizen ID
├── Evidence ID
├── Image reference
├── Citizen description
├── AI summary
├── Department ID
├── Problem type
├── Severity
├── Capture latitude
├── Capture longitude
├── Human-readable location
├── Contact-sharing preference
├── Status
├── Priority
├── Created timestamp
└── Updated timestamp
```

Initial status:

```text
SUBMITTED
```

---

# 22. Citizen Complaint List

The citizen sees submitted complaints as cards.

Each card can show:

- Problem type
- Department
- Complaint date
- Location
- Status

Possible statuses:

```text
Submitted
Under Review
Assigned
Work In Progress
Resolved
Rejected
```

---

# 23. Government Official Side

Government officials have a separate authenticated interface.

An official can only access complaints belonging to the department to which they are assigned.

Example:

```text
Road Official
→ Road complaints only

Water Official
→ Water complaints only
```

This must be enforced at the backend/database query level.

---

# 24. How Officials Get Their Role

A unique-ID-only system is **not sufficient for secure authorization**.

Recommended flow:

```text
Super Admin
    ↓
Creates/approves official account
    ↓
Assigns department
    ↓
Assigns role
    ↓
Official logs in
    ↓
Backend reads official's department
    ↓
Only that department's complaints are returned
```

Example:

```json
{
  "name": "Official Name",
  "employeeId": "ROAD-1024",
  "departmentId": "ROAD_DEPT",
  "role": "DEPARTMENT_OFFICIAL",
  "isActive": true
}
```

The employee ID can identify the official, but it should not itself be the security credential. The official should authenticate with a password or other proper credential.

---

# 25. Super Admin

The Super Admin is responsible for:

- Creating/approving department official accounts.
- Assigning officials to departments.
- Activating/deactivating officials.
- Managing departments.
- Managing complaint categories.
- Monitoring the overall platform.

The Super Admin should be created through a controlled initial setup/seed or administrator-approved process.

There should be no public Super Admin registration.

---

# 26. RBAC Model

Minimum roles:

```text
CITIZEN
DEPARTMENT_OFFICIAL
SUPER_ADMIN
```

### Citizen

- Manage own profile
- Capture evidence
- Create complaints
- View own complaints
- View complaint status
- Communicate through permitted complaint channels

### Department Official

- View complaints for assigned department
- Open complaint details
- Review evidence
- Reject complaint
- Start/accept work
- Mark work in progress
- Mark complaint resolved
- View permitted citizen contact information

### Super Admin

- Manage officials
- Manage departments
- Manage system configuration
- View all departments
- Manage roles/permissions

---

# 27. Department Dashboard

After login, a department official sees only that department's complaints.

Main components:

- Profile
- Complaint statistics
- Complaint cards
- Map/heatmap
- Pending complaints
- High-priority complaints
- Resolved complaints
- Rejected complaints

---

# 28. Complaint Merging / Duplicate Detection

The purpose of merging is to avoid showing thousands of separate cards for the same physical problem.

For the hackathon MVP, keep this logic simple.

When a new valid complaint is created:

1. Check existing **active/unresolved** complaint documents.
2. Check whether the complaint belongs to the same department/problem type.
3. Check whether its latitude/longitude is within the configured distance threshold of an existing complaint.
4. If a matching active complaint document exists, merge the new complaint into that document.
5. If no match exists, create a new complaint document.

For the MVP, duplicate detection uses only:

- Department/problem type
- Geographic coordinates
- Active/unresolved status

Do not use another AI call for duplicate detection.

Do not compare images using AI.

Do not compare descriptions using AI.

Resolved complaint documents are not targets for new complaint merging.

The distance threshold should be configurable, for example 20–50 meters.

# 29. Complaint Group Model

## Merged Complaint Document

There is no separate `ComplaintGroup` collection for the MVP.

One complaint document represents one physical problem. That document can contain arrays when multiple similar complaints are merged into it.

Example:

```json
{
  "department": "ROAD_MAINTENANCE",
  "problemType": "POTHOLE",
  "complaintIds": ["C101", "C105", "C118"],
  "locations": [
    {"latitude": 23.0225, "longitude": 72.5714},
    {"latitude": 23.0227, "longitude": 72.5715}
  ],
  "userDescriptions": [
    "Large pothole near the road.",
    "Many bikes are having problems because of this pothole.",
    "Road needs urgent repair."
  ],
  "images": [
    "/uploads/evidence1.jpg",
    "/uploads/evidence2.jpg",
    "/uploads/evidence3.jpg"
  ],
  "userIds": ["U101", "U105", null],
  "userContact": ["999xxxxxxx", "999xxxxxxx", null],
  "mergeCount": 3,
  "status": "SUBMITTED"
}
```

A document with one complaint simply contains one item in these arrays.

A document with multiple matching complaints contains multiple items.

The official dashboard displays **one card per complaint document**.

```text
1 document
→ 1 physical problem
→ 1 dashboard card

That document can contain:
→ One or many merged complaints
```

Individual complaint IDs, users, descriptions, locations, and evidence are preserved inside the document.

# 30. Merge Count

For a complaint group:

```text
mergeCount = number of citizen complaints associated with the same physical problem
```

Example:

```text
1 complaint → 1
10 complaints → 10
500 complaints → 500
```

A high count indicates that many citizens are reporting the same issue.

---

# 31. Priority

Priority depends **only on merge count**.

```text
mergeCount = 1
→ normal priority

mergeCount = 10
→ higher priority

mergeCount = 100
→ very high priority
```

The greater the `mergeCount`, the higher the priority.

No additional priority score is required for the MVP.

# 32. Complaint Details for Officials

The complain card preview shows:

### Preview

- Status
- Problem type

When an official opens a complaint card, show:

### Problem information

- Problem type
- Department
- AI summary
- Severity
- Location
- Map

### Evidence

All associated citizen evidence images.

Each evidence item can retain:

- Image
- Citizen description
- Capture timestamp
- Capture location
- Contact information if allowed

### Merged complaint information

- Number of merged complaints
- First report time
- Latest report time
- Current status
- Priority

No information should be lost during grouping.

---

# 33. Complaint Status Lifecycle

Recommended lifecycle:

```text
SUBMITTED
    ↓
UNDER_REVIEW
    ↓
ASSIGNED
    ↓
WORK_IN_PROGRESS
    ↓
RESOLVED
```

Alternative path:

```text
SUBMITTED
    ↓
REJECTED
```

Rejected complaints should include a rejection reason.

---

# 34. Status Synchronization After Grouping

If C1, C2, C3 and C4 belong to the same complaint group:

```text
Group G100
Status = WORK_IN_PROGRESS
```

all associated citizen complaints should display:

```text
WORK_IN_PROGRESS
```

When the group becomes:

```text
RESOLVED
```

all associated citizen complaints should reflect:

```text
RESOLVED
```

The group is the operational source of truth for the shared physical problem.

---

# 35. Official Rejection

An official can reject a complaint/group when it is determined to be:

- Fraudulent
- Incorrect
- Already resolved
- Invalid
- Outside department responsibility
- Duplicate of an existing resolved issue

A rejection reason must be stored.

The citizen should see:

```text
Status: Rejected
Reason: ...
```

The system should record who rejected it and when.

---

# 36. Heatmap

The department dashboard contains a heatmap.

The heatmap represents complaint concentration/current risk.

Example:

```text
Few active complaints
→ Low intensity

Many active complaints
→ High intensity
```

---

# 37. Important Heatmap Correction

The heatmap should not remain red forever because historical complaints exist.

For current operational risk:

```text
100 active complaints
→ High intensity

100 complaints, all resolved
→ Low/no active risk
```

Historical data can remain available in a separate analytics view.

---

# 38. Real-Time Heatmap

When a new complaint arrives:

```text
New complaint
    ↓
Complaint group updated
    ↓
Heatmap data updated
    ↓
Official dashboard receives update
```

The same approach can be used for complaint status changes.

---

# 39. Notifications

# Status Updates

No separate notification system is required for the MVP.

The citizen checks the complaint status from **My Complaints**.

Example:

```text
SUBMITTED
→ UNDER_REVIEW
→ WORK_IN_PROGRESS
→ RESOLVED
```

or:

```text
SUBMITTED
→ REJECTED
```

When an official changes the status, the latest status is shown to the citizen when the complaint data is fetched.

Real-time push notifications can be a future feature.

# 40. Communication

There is no chat or communication system between citizens and officials in the MVP.

If a citizen has allowed contact information:

- The official can see the permitted mobile number.
- The official can directly call the citizen if required.

If contact information is hidden:

- The official cannot see the private mobile number.
- The official can investigate the reported location and evidence without contacting the citizen.

# 41. Security Requirements

The platform should include:

- Password hashing with bcrypt.
- JWT authentication.
- HTTP-only cookies.
- Backend authorization.
- Role-based access control.
- Department-level authorization.
- Rate limiting.
- Request validation.
- File type validation.
- File size limits.
- Secure image storage.
- Protection against unauthorized complaint access.
- Protection against users modifying another user's complaint.
- Audit logs for official actions.
- Secure handling of contact information.
- No exposure of private user information to unauthorized officials.

---

# 42. Fraud/Evidence Verification

The evidence system should not claim to completely prevent fraud.

Use multiple verification signals:

```text
Capture GPS
+
Capture timestamp
+
Image analysis
+
Description analysis
+
Image-description consistency
+
Duplicate/nearby complaints
+
User complaint history
```

Suspicious/low-confidence cases can be routed for manual verification.

---

# 43. Recommended MongoDB Collections

Keep the database simple.

```text
users
departments
evidence
complaints
statusHistory
```

### users

Stores citizens, department officials, and the Super Admin.

### departments

Stores the predefined department categories.

### evidence

Stores captured image references and capture metadata:

- Image path
- User ID
- Latitude
- Longitude
- Timestamp

### complaints

Stores complaint documents.

A single document can represent one complaint or multiple merged complaints.

Arrays can store:

- Complaint IDs
- User IDs
- User descriptions
- Locations
- Images
- Contact information where permitted

The document also stores:

- Department
- Problem type
- Merge count
- Status
- Created/updated timestamps

### statusHistory

Stores important status changes for audit/history.

# 44. Recommended Complaint Data Model

A simplified complaint document can look like:

```text
complaints
{
    _id,

    department,
    problemType,

    complaintIds: [],
    userIds: [],

    images: [],
    descriptions: [],

    locations: [
        {
            latitude,
            longitude,
            textLocation
        }
    ],

    contactNumbers: [],
    contactAllowed: [],

    mergeCount,

    status,

    createdAt,
    updatedAt
}
```

The arrays allow multiple similar complaints to be stored inside one document.

For a single complaint:

```text
complaintIds = [C101]
```

For merged complaints:

```text
complaintIds = [C101, C105, C118, C121]
```

The official dashboard loads complaint documents and displays **one card per document**.

# 45. End-to-End Citizen Flow

```text
Register
   ↓
Login
   ↓
Home
   ↓
Capture Evidence
   ↓
Allow Location
   ↓
Take Photo
   ↓
Save Image + GPS + Timestamp
   ↓
Show Images
   ↓
Create Complaint
   ↓
Select Captured Image
   ↓
Automatic Location
   ↓
Choose Contact Privacy
   ↓
Write Description
   ↓
Submit
   ↓
Backend Validation
   ↓
Gemini Image + Text Analysis
   ↓
┌─────────────────────────┐
│ Invalid / mismatch      │
│ → Show reason to user   │
└─────────────────────────┘
             OR
             ↓
           Valid
             ↓
Department + Problem Type + Severity
             ↓
Create Complaint
             ↓
Find Nearby Similar Complaints
             ↓
Find Matching Active Complaint Document
             ↓
Merge Into Existing Document OR Create New Document
             ↓
Merge Count Updated
             ↓
Department Dashboard
```

---

# 46. End-to-End Government Flow

```text
Official Login
      ↓
Backend verifies role
      ↓
Backend identifies assigned department
      ↓
Load only that department's complaints
      ↓
Dashboard
      ├── Complaint Documents
      ├── Priority
      ├── Heatmap
      ├── Statistics
      └── Notifications
              ↓
       Open Complaint Group
              ↓
       Review evidence
              ↓
       Review descriptions
              ↓
       Review location
              ↓
      ┌───────┴────────┐
      ↓                ↓
   Reject          Start Work
      ↓                ↓
Citizen notified   WORK_IN_PROGRESS
                       ↓
                    RESOLVED
                       ↓
              All grouped citizens
              receive updated status
```

---

# 47. Required MVP Features

## Citizen

- Registration
- Login
- Profile
- Mandatory location permission
- Website camera
- Evidence capture
- Evidence storage
- Show captured images
- Complaint creation
- AI validation
- AI department classification
- Complaint submission
- Complaint history
- Complaint status
- Notifications
- Contact privacy

## Government

- Official login
- Department-based access
- Dashboard
- Complaint groups
- Complaint details
- Evidence viewing
- Reject complaint
- Start work
- Resolve complaint
- Priority
- Duplicate/grouping
- Heatmap

## Super Admin

- Login
- Create/manage officials
- Assign departments
- Activate/deactivate officials
- Manage departments/categories

---

# 48. Optional Features If Time Allows

- Video evidence
- Advanced fraud detection
- AI severity scoring
- Historical analytics
- Advanced GIS analytics
- Complaint escalation based on SLA/time
- Automatic escalation for unresolved high-priority complaints
- Citizen feedback after resolution
- Resolution proof photo from officials
- Before/after image comparison
- Public anonymized complaint map
- Voice-based complaint description

These should not block the core MVP.

---

# 49. Important Business Rules

1. A citizen cannot create a complaint without valid captured evidence.
2. Evidence capture requires location permission.
3. Evidence must belong to the authenticated citizen.
4. Complaint location is derived from evidence metadata in the initial workflow.
5. Citizen contact information is optional.
6. AI output must follow a fixed schema.
7. The backend validates AI output before using it.
8. Department names come from predefined system data.
9. Officials can only access their assigned department.
10. Citizens can only access their own complaints.
11. Complaint grouping must preserve every individual citizen complaint.
12. Nearby distance alone must not determine merging.
13. Rejection requires a reason.
14. Important official actions should be audited.
15. Active heatmap intensity should primarily represent unresolved/current issues.
16. AI output is an automated assessment and should not be treated as absolute proof.
17. Duplicate merging uses only department/problem type, geographic distance, and active/unresolved status.
18. Merged complaints are stored as arrays inside the same complaint document.
19. Priority depends only on merge count.
20. The citizen cannot change the location stored with a captured image.

---

# 50. Final Project Flow

```text
CITIZEN
   │
   ├── Register/Login
   │
   ├── Capture Evidence
   │       └── Image + GPS + Timestamp
   │
   ├── Create Complaint
   │       ├── Select Evidence
   │       ├── Auto Location
   │       ├── Contact Privacy
   │       └── Description
   │
   └── Submit
           │
           ▼
       BACKEND
           │
           ├── Validate
           │
           └── Gemini
                ├── Image Analysis
                ├── Text Analysis
                ├── Content Validation
                ├── Consistency Check
                ├── Department
                ├── Problem Type
                └── Severity
                       │
                       ▼
                 COMPLAINT
                       │
                       ▼
             DUPLICATE/GROUPING
                       │
                       ▼
                PRIORITY SCORE
                       │
                       ▼
             DEPARTMENT OFFICIAL
                       │
          ┌────────────┼────────────┐
          │            │            │
       Review       Heatmap      Statistics
          │
          ├── Reject
          │
          └── Start Work
                  │
                  ▼
             IN PROGRESS
                  │
                  ▼
               RESOLVED
                  │
                  ▼
           CITIZEN NOTIFIED
```
