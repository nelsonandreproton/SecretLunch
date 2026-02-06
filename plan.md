# Team Member Random Selector – Specification

## 1. Overview

This is a lightweight web application designed to be deployed on **GitHub Pages**.
It allows users to:

- Create multiple teams
- Add members to each team
- Randomly select **one member per team** with a single button click
- Ensure fair rotation: a member can only be selected again **after all members of the same team have already been selected**

The application is fully client-side and requires no backend or authentication.

---

## 2. Goals & Constraints

### Goals
- Simple and intuitive UI
- Fair and transparent selection logic
- Persistent state across page reloads
- Easy deployment and zero-cost hosting

### Constraints
- Runs entirely in the browser
- Deployable on **GitHub Pages**
- No paid services or APIs
- Uses browser storage for persistence

---

## 3. Technology Stack

### Core Technologies
- HTML5
- CSS3
- JavaScript (Vanilla)

### Optional
- Minimal CSS framework (Pico.css, Vanilla CSS)
- UUID utility (or custom ID generator)

### Deployment
- GitHub Pages (static hosting)

---

## 4. Application Architecture

The application follows a simple layered structure:

- UI Layer (HTML + CSS)
- State Management Layer (JavaScript objects + localStorage)
- Logic Layer (selection fairness algorithm)

No build step or framework is required.

---

## 5. Data Model

### Team
```ts
Team {
  id: string
  name: string
  members: Member[]
}
```

### Member
```ts
Member {
  id: string
  name: string
  selectedCount: number
}
```

### Global State
```ts
AppState {
  teams: Team[]
}
```

---

## 6. Core Business Rules

### Team Rules
- A team may have zero or more members
- Teams without members are ignored during selection

### Member Rules
- Each member belongs to exactly one team
- Each member tracks how many times they were selected

---

## 7. Selection Logic (Fair Random Algorithm)

### Rules
1. One member is selected per team
2. A member cannot be re-selected until all members in the same team have been selected
3. Fairness is enforced per team independently

---

### Algorithm (Per Team)

1. Determine the minimum `selectedCount` among team members
2. Build a pool of members with that minimum value
3. Randomly select one member from that pool
4. Increment `selectedCount` for the selected member
5. Persist updated state

This approach ensures:
- Randomness within a fair pool
- No member is selected twice before others are selected once

---

## 8. Persistence Strategy

### Storage
- `localStorage`

### Stored Data
- Teams
- Members
- `selectedCount` per member

### Behavior
- State is saved after every change
- State is restored on page load
- Clearing browser storage resets the app

---

## 9. UI / UX Specification

### Main Sections

#### Team Management
- Input to create a team
- List of teams
- Select active team
- Optional delete team button

#### Member Management
- Add member to selected team
- List members per team
- Optional remove member button

#### Selection Area
- Button: **Select Members**
- Results display:
  ```
  Team A → Alice
  Team B → João
  Team C → Maria
  ```

---

## 10. Edge Cases

- Team with zero members → skipped
- Team with one member → always selected
- Removing members:
  - Recalculate fairness naturally via `selectedCount`
- Page reload:
  - Must preserve selection history

---

## 11. File Structure

```
/
├── index.html
├── styles.css
├── app.js
├── plan.md
└── README.md
```

---

## 12. Deployment Instructions

1. Push files to GitHub repository
2. Go to **Settings → Pages**
3. Select:
   - Branch: `main`
   - Folder: `/root`
4. Access app at:
   ```
   https://<username>.github.io/<repository>/
   ```

---

## 13. Future Enhancements

- Import/export teams as JSON
- Animated selection reveal
- Manual reset per team
- Mobile-first layout
- Seeded randomness

---

## 14. Non-Goals

- Authentication
- Backend services
- Databases
- Real-time collaboration

---

## 15. Definition of Done

- Deployed on GitHub Pages
- Fair selection logic verified
- State persists across reloads
- No external services required
