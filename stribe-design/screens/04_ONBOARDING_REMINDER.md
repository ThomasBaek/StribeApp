# 04 - Onboarding: Set Reminder
## Stribe UX Specification

---

## SCREEN METADATA
```yaml
screen_id: 04_ONBOARDING_REMINDER
screen_name: Set Reminder
screen_type: Onboarding
previous_screen: 03_ONBOARDING_HABITS
next_screen: 05_HOME
flow_position: 3 of 3 (final)
```

---

## 1. VISUAL LAYOUT

```
┌─────────────────────────────────────┐
│            STATUS BAR               │
├─────────────────────────────────────┤
│  ←                                  │  ← Back button
├─────────────────────────────────────┤
│                                     │
│   Hvornår skal vi                   │  ← Headline
│   minde dig?                        │
│                                     │
│   En daglig påmindelse hjælper      │  ← Subtitle
│   dig med at holde din streak       │
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │      ┌───────────────┐      │   │
│   │      │     09:00     │      │   │  ← Time Picker
│   │      └───────────────┘      │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│   ☑ Samme tid for alle vaner        │  ← Checkbox option
│                                     │
│                                     │
│   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │
│   │   Eller spring over →       │   │  ← Text button (skip)
│   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │    Start tracking →         │   │  ← Primary Button
│   └─────────────────────────────┘   │
│                                     │
│              ○ ○ •                  │  ← Page indicator
│                                     │
└─────────────────────────────────────┘
```

---

## 2. ELEMENT SPECIFICATIONS

### 2.1 Header
```yaml
element: header
type: container
height: 56dp
padding_horizontal: space_4 (16dp)

children:
  - back_button:
      type: IconButton
      icon: arrow_left
      on_tap: navigate_back
```

### 2.2 Title Section
```yaml
element: title_section
type: container
padding_horizontal: space_6 (24dp)
margin_top: space_4 (16dp)
margin_bottom: space_8 (32dp)

children:
  - headline:
      type: text
      content: "Hvornår skal vi\nminde dig?"
      style:
        font_size: text_2xl (24sp)
        font_weight: font_bold
        color: text_primary
        line_height: leading_tight
        
  - subtitle:
      type: text
      content: "En daglig påmindelse hjælper dig med at holde din streak"
      style:
        font_size: text_base (16sp)
        font_weight: font_normal
        color: text_secondary
      margin_top: space_2 (8dp)
```

### 2.3 Time Picker Card
```yaml
element: time_picker_card
type: surface_card
background: surface
border_radius: radius_lg (12dp)
padding: space_6 (24dp)
margin_horizontal: space_6 (24dp)
shadow: shadow_sm
align_items: center

children:
  - time_display:
      type: time_picker_button
      layout: flex_row
      align_items: center
      gap: space_2 (8dp)
      
      children:
        - clock_icon:
            type: icon
            name: clock_outline
            size: icon_md (24dp)
            color: primary
            
        - time_text:
            type: text
            content: "{selected_time}" # "09:00"
            style:
              font_size: text_4xl (36sp)
              font_weight: font_bold
              color: text_primary
              font_family: font_family_mono
              
      on_tap: show_time_picker
```

### 2.4 Native Time Picker
```yaml
element: time_picker_modal
type: platform_time_picker
mode: time_only
format: 24h # or 12h based on locale
initial_time: "09:00"
minute_interval: 15 # or 5

platform_specific:
  ios:
    style: wheel
    presentation: action_sheet
    
  android:
    style: clock | spinner (based on Android version)
    presentation: dialog
```

### 2.5 Same Time Checkbox
```yaml
element: same_time_checkbox
type: checkbox_row
margin_top: space_6 (24dp)
margin_horizontal: space_6 (24dp)
padding: space_3 (12dp)

children:
  - checkbox:
      type: Checkbox
      size: 24dp
      checked: true # default
      color_checked: primary
      color_unchecked: border
      
  - label:
      type: text
      content: "Samme tid for alle vaner"
      style:
        font_size: text_base (16sp)
        color: text_primary
      margin_left: space_3 (12dp)

on_tap_row: toggle_checkbox
```

### 2.6 Skip Button
```yaml
element: skip_button
type: TextButton
text: "Eller spring over"
icon_right: arrow_right (small, 16dp)
margin_top: space_6 (24dp)

style:
  color: text_tertiary
  font_size: text_sm (14sp)

on_tap: skip_reminders
```

### 2.7 Primary Button
```yaml
element: start_button
type: PrimaryButton
text: "Start tracking"
icon_right: arrow_right
width: calc(100% - 48dp)
margin_horizontal: space_6 (24dp)
margin_top: space_4 (16dp)

on_tap: complete_onboarding
```

### 2.8 Page Indicator
```yaml
element: page_indicator
active_dot: 3  # Third dot
```

---

## 3. STATES

### 3.1 Default State
```yaml
state: default
selected_time: "09:00"
same_time_for_all: true
reminders_enabled: true
```

### 3.2 Skipped Reminders State
```yaml
state: skipped
reminders_enabled: false
note: User can enable later in settings
```

---

## 4. INTERACTIONS

### 4.1 Time Display Tap
```yaml
interaction: tap_time
element: time_picker_card
gesture: tap

on_tap:
  - Haptic feedback (light)
  - Show native time picker
  - On time selected:
      - Update time_display
      - Store selected_time
```

### 4.2 Checkbox Tap
```yaml
interaction: tap_checkbox
element: same_time_checkbox (entire row)
gesture: tap

on_tap:
  - Toggle checkbox state
  - Update same_time_for_all value
  - Note: If unchecked, each habit can have individual time in settings later
```

### 4.3 Skip Button Tap
```yaml
interaction: tap_skip
element: skip_button
gesture: tap

on_tap:
  - Set reminders_enabled: false
  - Complete onboarding without reminders
  - Navigate to: 05_HOME
```

### 4.4 Start Button Tap
```yaml
interaction: tap_start
element: start_button
gesture: tap

on_tap:
  - Request notification permission (if not already granted)
  - On permission granted:
      - Save habits to database
      - Save reminder time to settings
      - Schedule notifications
      - Set onboarding_completed: true
      - Navigate to: 05_HOME with celebration entry
  - On permission denied:
      - Save habits anyway
      - Show inline message about enabling later
      - Navigate to: 05_HOME
```

### 4.5 Back Button Tap
```yaml
interaction: tap_back
element: back_button
gesture: tap

on_tap:
  - Navigate to: 03_ONBOARDING_HABITS
  - Preserve habit selections
  - Transition: slide_right
```

---

## 5. ANIMATIONS

### 5.1 Entry Animation
```yaml
animation: reminder_entry
trigger: screen_appear
sequence:
  - step_1:
      element: title_section
      properties:
        - opacity: 0 → 1
        - translateY: -10dp → 0dp
      duration: 300ms
      
  - step_2:
      element: time_picker_card
      properties:
        - opacity: 0 → 1
        - scale: 0.95 → 1.0
      duration: 300ms
      delay: 150ms
      
  - step_3:
      element: [same_time_checkbox, skip_button, start_button]
      properties:
        - opacity: 0 → 1
      duration: 250ms
      delay: 300ms
```

### 5.2 Time Change Animation
```yaml
animation: time_change
trigger: time_selected
element: time_text
duration: 200ms

properties:
  - Old time: fade out + scale down
  - New time: fade in + scale up
easing: ease_out
```

### 5.3 Button Press Animation
```yaml
animation: start_button_press
trigger: on_tap
duration: 150ms
properties:
  - scale: 0.98
  - background: primary_dark
```

---

## 6. BEHAVIOR & LOGIC

### 6.1 Notification Permission Flow
```yaml
permission_flow:
  step_1: Check current permission status
  
  step_2: 
    if not_determined:
      - Show system permission dialog
    if denied:
      - Show inline message: "Du kan aktivere påmindelser senere i Indstillinger"
    if granted:
      - Proceed with scheduling
      
  step_3:
    - Save onboarding state
    - Navigate to home
```

### 6.2 Saving Habits
```yaml
on_complete_onboarding:
  database_operations:
    - For each selected_habit:
        INSERT INTO habits (
          id: generate_uuid(),
          name: habit.default_name,
          icon: habit.emoji,
          color: habit.default_color,
          reminder_time: if reminders_enabled then selected_time else null,
          created_at: now()
        )
        
    - INSERT INTO settings (key, value):
        - ('onboarding_completed', 'true')
        - ('day_start_time', '04:00')
        - ('default_reminder_time', selected_time)
```

### 6.3 Scheduling Notifications
```yaml
schedule_notifications:
  for_each_habit:
    - Create daily repeating notification
    - Time: selected_time
    - Title: "Husk {habit.name}"
    - Body: "Tid til at holde din streak 🔥"
    - Identifier: habit.id
```

---

## 7. ACCESSIBILITY

```yaml
screen_reader:
  announce_on_appear: "Indstil påmindelse. Vælg hvornår du vil mindes om dine vaner."
  
elements:
  - time_picker_card:
      label: "Påmindelsestidspunkt: {time}"
      hint: "Tryk for at ændre tidspunkt"
      role: button
      
  - same_time_checkbox:
      label: "Samme tid for alle vaner"
      state: "markeret" | "ikke markeret"
      
  - skip_button:
      label: "Spring påmindelser over"
      
  - start_button:
      label: "Start tracking af dine vaner"

focus_order: [back_button, time_picker_card, same_time_checkbox, skip_button, start_button]
```

---

## 8. ERROR HANDLING

```yaml
errors:
  notification_permission_denied:
    behavior: Continue without notifications
    message: "Du kan aktivere påmindelser i Indstillinger"
    show_as: Inline text below checkbox (subtle, not blocking)
    
  database_error:
    behavior: Retry once, then show error
    message: "Noget gik galt. Prøv igen."
    show_as: Toast with retry button
```

---

## 9. TEST SCENARIOS

| Scenario | Expected |
|----------|----------|
| Default view | Time shows 09:00, checkbox checked |
| Change time | Time picker appears, time updates |
| Uncheck same time | Checkbox unchecks (visual only, setting for later) |
| Tap Skip | Navigate to home without reminders |
| Tap Start | Request permission → Save → Navigate |
| Permission denied | Continue anyway, show message |
| Back button | Return to habit selection (preserve choices) |

---

*Reminder screen specification complete.*
