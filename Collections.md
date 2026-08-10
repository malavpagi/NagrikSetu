# SIH1516 — Updated MongoDB Collection Schemas

This document defines the updated MVP MongoDB collections based on the project README and the schema decisions made during discussion.

## Collections

For the MVP, we will use these four collections:

1. `users`
2. `departments`
3. `evidence`
4. `complaints`

> `statusHistory` is intentionally excluded from this updated MVP design. The current complaint status is stored directly in `complaints.status`.

---

# 1. `users`

Stores citizens, department officials, and the Super Admin.

### Schema

| Field | Data Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | MongoDB document identifier |
| `username` | String | Yes | Unique username used for login |
| `fullName` | String | Yes | User's full name |
| `mobile` | String | Yes | User's mobile number |
| `email` | String | Yes | User's email address |
| `passwordHash` | String | Yes | bcrypt-hashed password; never store plain password |
| `role` | String / Enum | Yes | `CITIZEN`, `DEPARTMENT_OFFICIAL`, or `SUPER_ADMIN` |
| `employeeId` | String | No | Official's employee ID; not required for citizens |
| `departmentId` | ObjectId | No | Reference to `departments`; used for department officials |
| `isActive` | Boolean | Yes | Whether the account is currently active |
| `createdAt` | Date | Yes | Account creation time |
| `updatedAt` | Date | Yes | Last account update time |

### Notes

- `username` should be unique.
- `email` and `mobile` should be validated.
- `passwordHash` contains the bcrypt hash.
- `employeeId` is for identifying officials, but it is not the authentication credential.
- `departmentId` should normally be populated only for `DEPARTMENT_OFFICIAL`.
- `isActive` allows the Super Admin to activate/deactivate official accounts.

---

# 2. `departments`

Stores the predefined government department categories.

### Schema

| Field | Data Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | MongoDB document identifier |
| `name` | String | Yes | Human-readable department name |
| `code` | String | Yes | Stable machine-readable department identifier |
| `description` | String | No | Description of the department |
| `isActive` | Boolean | Yes | Whether the department is currently active |
| `createdAt` | Date | Yes | Department creation time |
| `updatedAt` | Date | Yes | Last department update time |

### Example

```json
{
  "name": "Road Maintenance",
  "code": "ROAD_MAINTENANCE",
  "description": "Handles potholes and road damage",
  "isActive": true
}
```

### Notes

- `code` is used as the stable value for AI/backend classification.
- The AI must only return department categories defined by the system.
- `code` should be unique.
- `isActive` allows the Super Admin to deactivate a department without deleting historical data.

---

# 3. `evidence`

Stores metadata about photographs captured through the platform.

The actual image file is stored on local disk. MongoDB stores its storage reference and metadata.

### Schema

| Field | Data Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | MongoDB document identifier |
| `userId` | ObjectId | Yes | Reference to the citizen who captured the evidence |
| `imagePath` | String | Yes | Local storage path/reference for the image |
| `latitude` | Number | Yes | Capture latitude |
| `longitude` | Number | Yes | Capture longitude |
| `capturedAt` | Date | Yes | Time when the image was captured |
| `createdAt` | Date | Yes | Evidence record creation time |

### Notes

- `userId` identifies who captured the evidence.
- `latitude` and `longitude` represent the camera/user's capture location.
- `capturedAt` is the capture timestamp.
- The capture location is not guaranteed to be the exact incident location.
- `deviceMetadata` is intentionally excluded because it is optional and not required for the MVP.
- An evidence item must belong to the authenticated citizen who captured it.

---

# 4. `complaints`

This is the main operational collection.

One complaint document represents one physical problem. Multiple similar citizen complaints can be merged into the same document.

There is no separate `ComplaintGroup` collection in the MVP.

### Schema

| Field | Data Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | MongoDB document identifier |
| `departmentId` | ObjectId | Yes | Reference to `departments` |
| `problemType` | String | Yes | AI-classified problem type, e.g. `POTHOLE` |
| `complaintIds` | Array of String | Yes | IDs of individual citizen complaints merged into this document |
| `userIds` | Array of ObjectId | Yes | Citizens associated with the complaints |
| `evidenceIds` | Array of ObjectId | Yes | Evidence records associated with the complaints |
| `descriptions` | Array of String | Yes | Citizen descriptions corresponding to individual complaints |
| `locations` | Array of Object | Yes | Capture/complaint location information |
| `contactNumbers` | Array of String | No | Contact numbers where citizens have allowed contact |
<!-- | `contactAllowed` | Array of Boolean | Yes | Whether contact information is permitted for each associated complaint | -->
| `aiSummary` | String | Yes | AI-generated summary of the reported problem |
| `severity` | String / Enum | Yes | AI-estimated severity |
| `mergeCount` | Number | Yes | Number of citizen complaints associated with this physical problem |
| `priority` | String / Enum | Yes | Priority derived from merge count |
| `status` | String / Enum | Yes | Current complaint status |
| `rejectionReason` | String | No | Reason when the complaint/group is rejected |
| `createdAt` | Date | Yes | Time the complaint document was created |
| `updatedAt` | Date | Yes | Last complaint document update time |

### `locations` object

Each item in the `locations` array:

| Field | Data Type | Required | Description |
|---|---|---:|---|
| `latitude` | Number | Yes | Capture latitude |
| `longitude` | Number | Yes | Capture longitude |
| `textLocation` | String | Yes | Human-readable address produced through geocoding |

Example:

```json
{
  "latitude": 23.0225,
  "longitude": 72.5714,
  "textLocation": "Ahmedabad, Gujarat"
}
```

### Status values

```text
SUBMITTED
UNDER_REVIEW
ASSIGNED
WORK_IN_PROGRESS
RESOLVED
REJECTED
```

### Priority

Priority is based only on `mergeCount` for the MVP.

Example:

```text
mergeCount = 1
→ NORMAL

mergeCount = 10
→ HIGH

mergeCount = 100
→ VERY_HIGH
```

The exact numeric thresholds can be configured later.

### Example merged complaint

```json
{
  "departmentId": "66exampledept",
  "problemType": "POTHOLE",

  "complaintIds": [
    "C101",
    "C105",
    "C118"
  ],

  "userIds": [
    "66user101",
    "66user105",
    "66user118"
  ],

  "evidenceIds": [
    "66evidence101",
    "66evidence105",
    "66evidence118"
  ],

  "descriptions": [
    "Large pothole near the road.",
    "Many bikes are having problems because of this pothole.",
    "Road needs urgent repair."
  ],

  "locations": [
    {
      "latitude": 23.0225,
      "longitude": 72.5714,
      "textLocation": "Ahmedabad, Gujarat"
    },
    {
      "latitude": 23.0227,
      "longitude": 72.5715,
      "textLocation": "Ahmedabad, Gujarat"
    },
    {
      "latitude": 23.0227,
      "longitude": 72.5715,
      "textLocation": "Ahmedabad, Gujarat"
    }
  ],

  "contactNumbers": [
    "999xxxxxxx",
    "888xxxxxxx",
    null
  ],

  // "contactAllowed": [
  //   true,
  //   true,
  //   false
  // ],

  "aiSummary": "Large pothole causing road safety risk",
  "severity": "HIGH",

  "mergeCount": 3,
  "priority": "NORMAL",
  "status": "SUBMITTED",

  "createdAt": "2026-08-10T10:00:00.000Z",
  "updatedAt": "2026-08-10T10:00:00.000Z"
}
```

---

# Relationships


### Main references

```text
users._id
   ↓
evidence.userId

users._id
   ↓
complaints.userIds[]

departments._id
   ↓
users.departmentId

departments._id
   ↓
complaints.departmentId

evidence._id
   ↓
complaints.evidenceIds[]
```

---

# Final MVP Collection List

```text
MongoDB
│
├── users
├── departments
├── evidence
└── complaints
```
