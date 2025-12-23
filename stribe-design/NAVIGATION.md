# Stribe Navigation & App Flow
## Komplet oversigt over navigation og skærm-hierarki

---

## 1. APP STRUCTURE

```
┌─────────────────────────────────────────────────────────────┐
│                         APP                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐                                            │
│  │   SPLASH    │ → Auto-navigate efter 1.5s                 │
│  └──────┬──────┘                                            │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────┐                    │
│  │  ONBOARDING (kun første gang)       │                    │
│  │  ├── Welcome                        │                    │
│  │  ├── Select Habits                  │                    │
│  │  └── Set Reminder                   │                    │
│  └──────┬──────────────────────────────┘                    │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────┐                    │
│  │           MAIN APP                  │                    │
│  │  ┌─────────────────────────────┐    │                    │
│  │  │         HOME                │◄───┼─── Tab 1 (default) │
│  │  │  (habit list + daily view)  │    │                    │
│  │  └─────────────────────────────┘    │                    │
│  │              │                      │                    │
│  │              ├──► Habit Detail      │                    │
│  │              ├──► Add Habit         │                    │
│  │              └──► Edit Habit        │                    │
│  │                                     │                    │
│  │  ┌─────────────────────────────┐    │                    │
│  │  │       SETTINGS              │◄───┼─── Settings icon   │
│  │  └─────────────────────────────┘    │                    │
│  │              │                      │                    │
│  │              └──► Pro Upgrade       │                    │
│  └─────────────────────────────────────┘                    │
│                                                             │
│  ┌─────────────────────────────────────┐                    │
│  │  OVERLAYS (modal)                   │                    │
│  │  ├── Milestone Celebration          │                    │
│  │  ├── Delete Confirmation            │                    │
│  │  └── Pro Upgrade Prompt             │                    │
│  └─────────────────────────────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. SCREEN INVENTORY

| ID | Skærm | Fil | Type | Entry Point |
|----|-------|-----|------|-------------|
| 01 | Splash | `01_SPLASH.md` | Launch | App start |
| 02 | Welcome | `02_ONBOARDING_WELCOME.md` | Onboarding | Efter splash (første gang) |
| 03 | Select Habits | `03_ONBOARDING_HABITS.md` | Onboarding | Fra Welcome |
| 04 | Set Reminder | `04_ONBOARDING_REMINDER.md` | Onboarding | Fra Select Habits |
| 05 | Home | `05_HOME.md` | Main | Efter onboarding / app start |
| 06 | Habit Detail | `06_HABIT_DETAIL.md` | Detail | Tap på habit card |
| 07 | Add Habit | `07_ADD_HABIT.md` | Form | Tap på "+" button |
| 08 | Edit Habit | `08_EDIT_HABIT.md` | Form | Tap på edit i detail |
| 09 | Settings | `09_SETTINGS.md` | Settings | Tap på ⚙️ icon |
| 10 | Milestone | `10_MILESTONE_CELEBRATION.md` | Modal | Auto ved milestone |

---

## 3. NAVIGATION PATTERNS

### 3.1 Primary Navigation
```yaml
type: None (single-screen app med modals)
reason: Simpelt - én hovedskærm med habit liste
```

### 3.2 Screen Transitions

```yaml
splash_to_onboarding:
  type: fade
  duration: 400ms
  easing: ease_out

onboarding_between_steps:
  type: slide_left
  duration: 400ms
  easing: ease_out

onboarding_to_home:
  type: fade_scale
  duration: 500ms
  scale: 0.95 → 1.0
  easing: ease_out

home_to_detail:
  type: slide_up (bottom sheet style)
  duration: 400ms
  easing: ease_out
  background_dim: 0.3

home_to_add_habit:
  type: slide_up
  duration: 400ms
  easing: ease_out

detail_to_edit:
  type: slide_left
  duration: 300ms
  easing: ease_out

home_to_settings:
  type: slide_left
  duration: 300ms
  easing: ease_out

milestone_appear:
  type: scale_bounce
  duration: 500ms
  scale: 0 → 1.05 → 1.0
  easing: ease_bounce
  background: instant dim to 0.5
```

### 3.3 Back Navigation

```yaml
android_back_button:
  - Detail → Home: slide down
  - Add Habit → Home: slide down (med confirm hvis data)
  - Edit Habit → Detail: slide right
  - Settings → Home: slide right
  - Milestone → dismiss: fade out

ios_swipe_back:
  - Enabled på alle stacked screens
  - Interactive gesture med parallax
  
close_button:
  - Bruges på modals (X i top-right)
  - Detail screen (X eller ← i top-left)
```

---

## 4. NAVIGATION FLOWS

### 4.1 First Launch Flow
```
[App Launch]
     │
     ▼
[01_SPLASH] ──1.5s delay──► [02_WELCOME]
                                 │
                                 ▼ tap "Kom i gang"
                           [03_HABITS]
                                 │
                                 ▼ tap "Fortsæt"
                           [04_REMINDER]
                                 │
                                 ▼ tap "Start tracking"
                            [05_HOME]
```

### 4.2 Returning User Flow
```
[App Launch]
     │
     ▼
[01_SPLASH] ──check stored habits──► [05_HOME]
```

### 4.3 Complete Habit Flow
```
[05_HOME]
     │
     ▼ tap checkbox på habit card
[Animation: checkmark + card glow]
     │
     ├──► Hvis milestone nået ──► [10_MILESTONE] ──► [05_HOME]
     │
     └──► Ellers ──► Stay on [05_HOME]
```

### 4.4 View/Edit Habit Flow
```
[05_HOME]
     │
     ▼ tap på habit card (ikke checkbox)
[06_DETAIL]
     │
     ├──► tap edit icon ──► [08_EDIT] ──► save ──► [06_DETAIL]
     │
     ├──► tap delete ──► [Confirm Dialog] ──► confirm ──► [05_HOME]
     │
     └──► tap back/close ──► [05_HOME]
```

### 4.5 Add Habit Flow
```
[05_HOME]
     │
     ▼ tap "+" button
[07_ADD_HABIT]
     │
     ├──► tap "Gem" ──► [05_HOME] (med ny habit)
     │
     └──► tap back ──► [Confirm hvis data?] ──► [05_HOME]
```

---

## 5. DEEP LINKING (Future)

```yaml
# Reserved for v2
stribe://habit/{habit_id}     → Open habit detail
stribe://add                  → Open add habit
stribe://settings             → Open settings
```

---

## 6. STATE MANAGEMENT

### 6.1 Navigation State
```yaml
current_screen: string
navigation_stack: array
modal_stack: array
```

### 6.2 Persisted State
```yaml
has_completed_onboarding: boolean  # Gem i SQLite settings
last_viewed_date: date             # For at vise "i går" vs "i dag"
```

---

## 7. GESTURE SUPPORT

| Gesture | Skærm | Action |
|---------|-------|--------|
| Swipe left | Home | Se tidligere dag |
| Swipe right | Home | Se næste dag (hvis relevant) |
| Swipe down | Detail | Dismiss |
| Swipe right | Any stacked | Go back (iOS) |
| Long press | Habit card | Quick edit menu (v2) |
| Pull down | Home | Refresh (visual only, data er lokal) |

---

## 8. ERROR STATES & EDGE CASES

### 8.1 Empty States
```yaml
no_habits:
  screen: HOME
  show: Empty state illustration + "Tilføj din første vane" button
  
no_completions:
  screen: DETAIL
  show: Calendar med alle tomme + motiverende tekst
```

### 8.2 Error Handling
```yaml
database_error:
  action: Show toast "Noget gik galt" + retry option
  
notification_permission_denied:
  action: Show inline message i settings med link til system settings
```

---

*Navigation defineret. Se individuelle skærm-filer for detaljer.*
