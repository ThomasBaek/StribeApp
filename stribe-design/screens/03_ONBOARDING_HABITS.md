# 03 - Onboarding: Select Habits
## Stribe UX Specification

---

## SCREEN METADATA
```yaml
screen_id: 03_ONBOARDING_HABITS
screen_name: Select Habits
screen_type: Onboarding
previous_screen: 02_ONBOARDING_WELCOME
next_screen: 04_ONBOARDING_REMINDER
flow_position: 2 of 3
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
│   Hvad vil du gøre                  │  ← Headline (24sp)
│   hver dag?                         │
│                                     │
│   Vælg 1-3 vaner for at starte      │  ← Subtitle (16sp)
│                                     │
│   ┌─────────┐ ┌─────────┐           │
│   │   🏃    │ │   📚    │           │  ← Habit chips
│   │ Motion  │ │  Læse   │           │     Row 1
│   └─────────┘ └─────────┘           │
│                                     │
│   ┌─────────┐ ┌─────────┐           │
│   │   🧘    │ │   💧    │           │     Row 2
│   │Meditation│ │  Vand   │           │
│   └─────────┘ └─────────┘           │
│                                     │
│   ┌─────────┐ ┌─────────┐           │
│   │   📝    │ │   ➕    │           │     Row 3
│   │ Journal │ │  Egen   │           │
│   └─────────┘ └─────────┘           │
│                                     │
│                                     │
│   ┌─────────────────────────────┐   │
│   │       Fortsæt →             │   │  ← Primary Button
│   └─────────────────────────────┘   │
│                                     │
│              ○ • ○                  │  ← Page indicator
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
layout: flex_row
align_items: center

children:
  - back_button:
      type: IconButton
      icon: arrow_left (←)
      size: 44dp
      icon_size: 24dp
      icon_color: text_primary
      on_tap: navigate_back
```

### 2.2 Title Section
```yaml
element: title_section
type: container
padding_horizontal: space_6 (24dp)
margin_top: space_4 (16dp)
margin_bottom: space_6 (24dp)

children:
  - headline:
      type: text
      content: "Hvad vil du gøre\nhver dag?"
      style:
        font_size: text_2xl (24sp)
        font_weight: font_bold
        color: text_primary (#1A2421)
        line_height: leading_tight (1.2)
        
  - subtitle:
      type: text
      content: "Vælg 1-3 vaner for at starte"
      style:
        font_size: text_base (16sp)
        font_weight: font_normal
        color: text_secondary (#5A6B65)
      margin_top: space_2 (8dp)
```

### 2.3 Habit Grid
```yaml
element: habit_grid
type: grid
columns: 2
gap: space_3 (12dp)
padding_horizontal: space_6 (24dp)

children: [habit_chip × 6]
```

### 2.4 Habit Chip (Component)
```yaml
element: habit_chip
type: selectable_card
width: (screen_width - 24dp × 2 - 12dp) / 2  # ~160dp
height: 100dp
border_radius: radius_lg (12dp)
layout: flex_column
align_items: center
justify_content: center
gap: space_2 (8dp)

states:
  unselected:
    background: surface (#FFFFFF)
    border: 1.5dp solid border (#E5EBE8)
    shadow: none
    
  selected:
    background: primary (#2D5A4A)
    border: none
    shadow: shadow_md
    
  pressed:
    scale: 0.97

children:
  - emoji:
      type: text
      font_size: 32sp
      # Color doesn't change (emoji)
      
  - label:
      type: text
      font_size: text_base (16sp)
      font_weight: font_medium
      color: 
        unselected: text_primary (#1A2421)
        selected: text_inverse (#FFFFFF)
```

### 2.5 Preset Habits Data
```yaml
preset_habits:
  - id: "motion"
    emoji: "🏃"
    label: "Motion"
    default_name: "Motion"
    default_color: habit_green
    
  - id: "reading"
    emoji: "📚"
    label: "Læse"
    default_name: "Læse"
    default_color: habit_blue
    
  - id: "meditation"
    emoji: "🧘"
    label: "Meditation"
    default_name: "Meditation"
    default_color: habit_purple
    
  - id: "water"
    emoji: "💧"
    label: "Vand"
    default_name: "Drik vand"
    default_color: habit_teal
    
  - id: "journal"
    emoji: "📝"
    label: "Journal"
    default_name: "Skriv journal"
    default_color: habit_yellow
    
  - id: "custom"
    emoji: "➕"
    label: "Egen"
    is_custom: true
    on_tap: show_custom_habit_dialog
```

### 2.6 Custom Habit Dialog
```yaml
element: custom_habit_dialog
type: bottom_sheet
height: auto (content based)
max_height: 70%
border_radius_top: radius_2xl (24dp)
background: surface
padding: space_6 (24dp)

children:
  - handle:
      type: view
      width: 40dp
      height: 4dp
      background: border
      border_radius: radius_full
      margin_bottom: space_4 (16dp)
      align_self: center
      
  - title:
      type: text
      content: "Tilføj egen vane"
      style: headline_medium
      margin_bottom: space_4 (16dp)
      
  - name_input:
      type: TextField
      placeholder: "Navn på vane"
      max_length: 30
      auto_focus: true
      
  - emoji_picker:
      type: horizontal_scroll
      margin_top: space_4 (16dp)
      label: "Vælg ikon"
      items: [common emojis - see emoji palette in design system]
      selected_style:
        background: primary_light
        border_radius: radius_md
        
  - confirm_button:
      type: PrimaryButton
      text: "Tilføj"
      margin_top: space_6 (24dp)
      enabled: name_input.length > 0
```

### 2.7 Continue Button
```yaml
element: continue_button
type: PrimaryButton
text: "Fortsæt"
icon_right: arrow_right
width: calc(100% - 48dp)
margin_horizontal: space_6 (24dp)
margin_bottom: space_4 (16dp)

states:
  enabled:
    condition: selected_habits.length >= 1
    background: primary
    
  disabled:
    condition: selected_habits.length == 0
    background: primary
    opacity: 0.5
    text: "Vælg mindst 1 vane"
```

### 2.8 Page Indicator
```yaml
element: page_indicator
# Same as 02_ONBOARDING_WELCOME
active_dot: 2  # Second dot
```

---

## 3. STATES

### 3.1 Initial State
```yaml
state: initial
selected_habits: []
button_enabled: false
button_text: "Vælg mindst 1 vane"
```

### 3.2 Selection States
```yaml
state: has_selection
condition: selected_habits.length >= 1 && <= 3
button_enabled: true
button_text: "Fortsæt"

state: max_selection
condition: selected_habits.length == 3
behavior: Show toast "Max 3 vaner for at starte"
remaining_chips: Disable tap (visual: opacity 0.5)
```

---

## 4. INTERACTIONS

### 4.1 Habit Chip Tap
```yaml
interaction: tap_habit_chip
element: habit_chip (not custom)
gesture: tap

logic:
  if chip.selected:
    - Deselect chip
    - Remove from selected_habits
    - Animate: selected → unselected
    
  else if selected_habits.length < 3:
    - Select chip
    - Add to selected_habits
    - Animate: unselected → selected
    - Haptic feedback (light)
    
  else:
    - Show toast: "Max 3 vaner"
    - Shake animation on chip
```

### 4.2 Custom Chip Tap
```yaml
interaction: tap_custom_chip
element: habit_chip[custom]
gesture: tap

on_tap:
  - if selected_habits.length < 3:
      - Show custom_habit_dialog
  - else:
      - Show toast: "Fjern en vane først"
```

### 4.3 Back Button Tap
```yaml
interaction: tap_back
element: back_button
gesture: tap

on_tap:
  - Navigate to: 02_ONBOARDING_WELCOME
  - Transition: slide_right
  - Note: Selections are NOT persisted
```

### 4.4 Continue Button Tap
```yaml
interaction: tap_continue
element: continue_button
gesture: tap
enabled: selected_habits.length >= 1

on_tap:
  - Store selected_habits in memory (not DB yet)
  - Navigate to: 04_ONBOARDING_REMINDER
  - Transition: slide_left
```

### 4.5 Swipe Gestures
```yaml
interaction: swipe_left
gesture: swipe_left
condition: selected_habits.length >= 1
on_complete: Same as tap_continue

interaction: swipe_right
gesture: swipe_right
on_complete: Same as tap_back
```

---

## 5. ANIMATIONS

### 5.1 Entry Animation
```yaml
animation: habits_entry
trigger: screen_appear
sequence:
  - step_1:
      element: title_section
      properties:
        - opacity: 0 → 1
        - translateY: -10dp → 0dp
      duration: 300ms
      delay: 0ms
      easing: ease_out
      
  - step_2:
      element: habit_chips (staggered)
      properties:
        - opacity: 0 → 1
        - scale: 0.9 → 1.0
      duration: 250ms
      stagger: 50ms (each chip delayed 50ms more)
      easing: ease_out
```

### 5.2 Chip Selection Animation
```yaml
animation: chip_select
trigger: on_select
duration: 200ms
easing: ease_bounce

properties:
  - scale: 1.0 → 1.05 → 1.0
  - background: instant change
  - border: fade out (100ms)
  
additional:
  - Checkmark appears in corner (optional, v2)
```

### 5.3 Chip Deselection Animation
```yaml
animation: chip_deselect
trigger: on_deselect
duration: 200ms
easing: ease_out

properties:
  - scale: 1.0 → 0.95 → 1.0
  - background: instant change
  - border: fade in (100ms)
```

### 5.4 Button Enable Animation
```yaml
animation: button_enable
trigger: first_selection
duration: 300ms

properties:
  - opacity: 0.5 → 1.0
  - text: crossfade "Vælg mindst 1" → "Fortsæt"
```

### 5.5 Custom Dialog Animation
```yaml
animation: dialog_appear
trigger: show_dialog
type: slide_up + fade
duration: 300ms

background_dim:
  from: transparent
  to: rgba(0,0,0,0.3)
  duration: 200ms
```

---

## 6. BEHAVIOR & LOGIC

### 6.1 Selection Validation
```yaml
rules:
  min_habits: 1
  max_habits: 3
  
validation_messages:
  none_selected: "Vælg mindst 1 vane"
  max_reached: "Max 3 vaner for at starte"
```

### 6.2 Data Handling
```yaml
on_continue:
  store_in_memory:
    - selected_habits: array of habit objects
    
  note: Not saved to database until onboarding complete
```

---

## 7. ACCESSIBILITY

```yaml
screen_reader:
  announce_on_appear: "Vælg dine daglige vaner. Tryk på op til 3 vaner du vil bygge."
  
elements:
  - habit_chip:
      label: "{emoji} {label}"
      state: "valgt" | "ikke valgt"
      hint: "Tryk for at vælge eller fravælge"
      
  - continue_button:
      label: "Fortsæt til næste trin"
      state: "aktiv" | "deaktiveret, vælg mindst 1 vane først"

focus_order: [back_button, headline, habit_chips_in_order, continue_button]
```

---

## 8. RESPONSIVE BEHAVIOR

### 8.1 Small Screens
```yaml
adjustments:
  - Reduce chip height to 90dp
  - Reduce emoji size to 28sp
  - Reduce padding
```

### 8.2 Large Screens (tablets)
```yaml
adjustments:
  - 3 columns instead of 2
  - Max content width: 500dp
  - Center grid
```

---

## 9. TEST SCENARIOS

| Scenario | Expected |
|----------|----------|
| No selection | Button disabled with "Vælg mindst 1" |
| Select 1 habit | Button enables with "Fortsæt" |
| Select 3 habits | Other chips become disabled |
| Tap disabled chip | Toast appears |
| Tap custom | Dialog opens |
| Submit custom with empty name | Button disabled |
| Swipe right | Go back to welcome |

---

*Select Habits screen specification complete.*
