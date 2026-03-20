# CampusConnect

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Welcome / Role Selection screen with Teacher and Student buttons
- Teacher Login screen with Name, ID, Email fields and Login button
- Teacher Dashboard with ON/OFF availability toggle and auto-location status
- Student Login screen with Name, ID, Email fields and Login button
- Student Dashboard with teacher search bar, results list showing name/status/location
- Role-based access: Teacher and Student roles
- Location zone mapping: Block, Lab, Food Court, etc.
- Auto-location logic: teacher's location auto-detected inside campus; outside campus sets status to OFF
- Green (available) / Red (offline) status indicators

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend (Motoko):
   - User model with roles (Teacher, Student), name, ID, email
   - Teacher availability state (on/off)
   - Teacher location zone (enum: Block, Lab, FoodCourt, Library, etc.)
   - Campus detection: a flag indicating whether teacher is on campus
   - APIs: register/login for both roles, toggle availability, update location zone, get all available teachers, search teachers by name
2. Frontend (React):
   - Welcome screen with role selection
   - Teacher login + dashboard (toggle + location display)
   - Student login + dashboard (search + results list)
   - Blue/white/green color scheme, mobile-first layout, rounded buttons, subtle shadows
