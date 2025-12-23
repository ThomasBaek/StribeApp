# 06 - Habit Detail Screen
## Stribe UX Specification

---

## SCREEN METADATA
```yaml
screen_id: 06_HABIT_DETAIL
screen_name: Habit Detail
screen_type: Detail / Bottom Sheet
previous_screen: 05_HOME
can_navigate_to: [08_EDIT_HABIT]
presentation: bottom_sheet (70% height) or full_screen
```

---

## 1. VISUAL LAYOUT

```
┌─────────────────────────────────────┐
│░░░░░░░░░░░ Dimmed Background ░░░░░░░│  ← Tap to dismiss
├─────────────────────────────────────┤
│            ───────                  │  ← Handle
├─────────────────────────────────────┤
│  ←                          🗑️ ✏️  │  ← Header
├─────────────────────────────────────┤
│                                     │
│              🏃                     │  ← Icon (64dp)
│            Motion                   │  ← Name (24sp)
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │      🔥 14 dage i træk      │   │  ← Streak hero
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌────────────┐ ┌────────────┐     │
│   │ Længste    │ │ Completion │     │  ← Stats cards
│   │    23      │ │    78%     │     │
│   └────────────┘ └────────────┘     │
│                                     │
│   December 2025            ◄  ►     │  ← Month navigation
│   ┌──┬──┬──┬──┬──┬──┬──┐           │
│   │Ma│Ti│On│To│Fr│Lø│Sø│           │  ← Calendar grid
│   ├──┼──┼──┼──┼──┼──┼──┤           │
│   │██│██│██│░░│██│██│██│           │
│   ├──┼──┼──┼──┼──┼──┼──┤           │
│   │██│██│██│██│██│░░│██│           │
│   ├──┼──┼──┼──┼──┼──┼──┤           │
│   │██│██│░░│░░│░░│░░│░░│           │
│   └──┴──┴──┴──┴──┴──┴──┘           │
│                                     │
│   🔔 Påmindelse: 09:00              │  ← Reminder info
│                                     │
└─────────────────────────────────────┘
```

---

## 2. ELEMENT SPECIFICATIONS

### 2.1 Background Overlay
```yaml
element: overlay
type: pressable_view
background: rgba(0, 0, 0, 0.3)
covers: full_screen
on_tap: dismiss_sheet
```

### 2.2 Bottom Sheet Container
```yaml
element: sheet_container
type: container
background: surface (#FFFFFF)
border_radius_top: radius_2xl (24dp)
min_height: 70%
max_height: 90%

# Drag behavior
draggable: true
drag_handle: true
dismiss_threshold: 100dp drag down
snap_points: [70%, 90%]
```

### 2.3 Handle
```yaml
element: drag_handle
type: view
width: 40dp
height: 4dp
background: border (#E5EBE8)
border_radius: radius_full
margin_top: space_3 (12dp)
margin_bottom: space_2 (8dp)
align_self: center
```

### 2.4 Header
```yaml
element: header
type: container
height: 48dp
padding_horizontal: space_4 (16dp)
layout: flex_row
align_items: center
justify_content: space_between

children:
  - close_button:
      type: IconButton
      icon: close (×) or arrow_down
      size: 44dp
      icon_color: text_secondary
      on_tap: dismiss_sheet
      
  - action_buttons:
      layout: flex_row
      gap: space_1 (4dp)
      
      children:
        - delete_button:
            type: IconButton
            icon: trash_outline (🗑️)
            size: 44dp
            icon_color: error
            on_tap: show_delete_confirmation
            
        - edit_button:
            type: IconButton
            icon: edit_outline (✏️)
            size: 44dp
            icon_color: text_secondary
            on_tap: navigate_to_edit
```

### 2.5 Hero Section
```yaml
element: hero_section
type: container
align_items: center
padding: space_6 (24dp)

children:
  - icon_container:
      type: container
      width: 80dp
      height: 80dp
      background: habit.color (15% opacity)
      border_radius: radius_xl (16dp)
      align_items: center
      justify_content: center
      
      children:
        - habit_emoji:
            type: text
            content: habit.icon
            font_size: 48sp
            
  - habit_name:
      type: text
      content: habit.name
      style:
        font_size: text_2xl (24sp)
        font_weight: font_bold
        color: text_primary
      margin_top: space_3 (12dp)
```

### 2.6 Streak Card
```yaml
element: streak_card
type: surface_card
width: 200dp
padding: space_5 (20dp)
margin_top: space_4 (16dp)
background: primary (#2D5A4A)
border_radius: radius_lg (12dp)
align_self: center
align_items: center

children:
  - streak_row:
      layout: flex_row
      align_items: center
      gap: space_2 (8dp)
      
      children:
        - fire_emoji:
            type: text
            content: "🔥"
            font_size: 32sp
            
        - streak_text:
            type: text
            content: "{current_streak} dage i træk"
            style:
              font_size: text_xl (20sp)
              font_weight: font_bold
              color: white

# Pulse animation on fire emoji
animation:
  element: fire_emoji
  type: scale_pulse
  from: 1.0
  to: 1.1
  duration: 1000ms
  repeat: infinite
```

### 2.7 Stats Row
```yaml
element: stats_row
type: container
layout: flex_row
justify_content: center
gap: space_4 (16dp)
margin_top: space_6 (24dp)
padding_horizontal: space_6 (24dp)

children:
  - stat_card:  # Longest streak
      type: surface_card
      flex: 1
      padding: space_4 (16dp)
      background: surface
      border: 1dp solid border
      border_radius: radius_lg (12dp)
      align_items: center
      
      children:
        - stat_label:
            type: text
            content: "Længste streak"
            style:
              font_size: text_sm (14sp)
              color: text_secondary
              
        - stat_value:
            type: text
            content: "{longest_streak}"
            style:
              font_size: text_2xl (24sp)
              font_weight: font_bold
              color: text_primary
            margin_top: space_1 (4dp)
            
  - stat_card:  # Completion rate
      type: surface_card
      flex: 1
      padding: space_4 (16dp)
      background: surface
      border: 1dp solid border
      border_radius: radius_lg (12dp)
      align_items: center
      
      children:
        - stat_label:
            type: text
            content: "Gennemførsel"
            style:
              font_size: text_sm (14sp)
              color: text_secondary
              
        - stat_value:
            type: text
            content: "{completion_rate}%"
            style:
              font_size: text_2xl (24sp)
              font_weight: font_bold
              color: text_primary
            margin_top: space_1 (4dp)
```

### 2.8 Calendar Section
```yaml
element: calendar_section
type: container
margin_top: space_6 (24dp)
padding_horizontal: space_4 (16dp)

children:
  - calendar_header:
      layout: flex_row
      align_items: center
      justify_content: space_between
      margin_bottom: space_3 (12dp)
      
      children:
        - month_year:
            type: text
            content: "{month} {year}"  # "December 2025"
            style:
              font_size: text_lg (18sp)
              font_weight: font_semibold
              color: text_primary
              
        - nav_buttons:
            layout: flex_row
            
            children:
              - prev_month:
                  type: IconButton
                  icon: chevron_left
                  size: 36dp
                  on_tap: go_previous_month
                  
              - next_month:
                  type: IconButton
                  icon: chevron_right
                  size: 36dp
                  on_tap: go_next_month
                  enabled: if month < current_month
                  
  - calendar_grid:
      type: CalendarGrid  # See component below
```

### 2.9 Calendar Grid Component
```yaml
element: CalendarGrid
type: custom_component

structure:
  - weekday_header:
      type: row
      children: ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"]
      style:
        font_size: text_xs (12sp)
        color: text_tertiary
        text_align: center
        
  - week_rows:
      type: array of rows (4-6 rows depending on month)
      
      each_cell:
        type: view
        width: (screen_width - 32dp) / 7
        height: 40dp
        align_items: center
        justify_content: center
        border_radius: radius_sm (4dp)
        
        variants:
          completed:
            background: habit.color
            text_color: white
            
          missed:
            background: transparent
            text_color: text_tertiary
            # Optional: subtle X or empty indicator
            
          future:
            background: transparent
            text_color: text_tertiary
            opacity: 0.5
            
          today:
            border: 2dp solid primary
            
          outside_month:
            visible: false (or very faded)
```

### 2.10 Reminder Info
```yaml
element: reminder_info
type: container
layout: flex_row
align_items: center
gap: space_2 (8dp)
padding: space_4 (16dp)
margin_top: space_4 (16dp)

children:
  - bell_icon:
      type: icon
      name: bell_outline
      size: icon_sm (20dp)
      color: text_secondary
      
  - reminder_text:
      type: text
      content: "Påmindelse: {reminder_time}"  # or "Ingen påmindelse"
      style:
        font_size: text_base (16sp)
        color: text_secondary
```

---

## 3. STATES

### 3.1 Default State
```yaml
state: default
- All elements visible
- Calendar shows current month
- Stats calculated from all data
```

### 3.2 No Streak State
```yaml
state: no_streak
condition: current_streak == 0

changes:
  - streak_card:
      content: "Ingen streak endnu"
      subtext: "Marker som færdig for at starte"
      background: surface (not primary)
      border: 1dp solid border
```

### 3.3 Loading State
```yaml
state: loading
show: Skeleton placeholders for stats and calendar
duration: Should be minimal (< 100ms)
```

---

## 4. INTERACTIONS

### 4.1 Dismiss Sheet
```yaml
interactions:
  - tap_overlay: dismiss
  - tap_close_button: dismiss
  - swipe_down: dismiss (if dragged > 100dp)
  - hardware_back (Android): dismiss
```

### 4.2 Edit Button Tap
```yaml
interaction: tap_edit
on_tap:
  - Navigate to: 08_EDIT_HABIT
  - Pass: habit object
  - Transition: slide_left (within sheet) or present new sheet
```

### 4.3 Delete Button Tap
```yaml
interaction: tap_delete
on_tap:
  - Show confirmation dialog:
      title: "Slet vane?"
      message: "Al historik for '{habit.name}' vil blive slettet."
      buttons:
        - "Annuller" (secondary)
        - "Slet" (destructive/error color)
        
  on_confirm:
    - Delete habit from database
    - Delete all completions for habit
    - Dismiss sheet
    - Return to home (habit removed from list)
    - Show toast: "Vane slettet"
```

### 4.4 Calendar Month Navigation
```yaml
interaction: calendar_navigation
on_tap_previous:
  - Animate calendar slide right
  - Load previous month data
  
on_tap_next:
  - Only if not current month
  - Animate calendar slide left
  - Load next month data
```

### 4.5 Calendar Day Tap (Future)
```yaml
# v2 feature
interaction: tap_calendar_day
on_tap:
  - If past day: Toggle completion (with confirmation)
  - If today: Same as checkbox on home
  - If future: Nothing
```

---

## 5. ANIMATIONS

### 5.1 Sheet Entry
```yaml
animation: sheet_enter
trigger: screen_open
duration: 400ms

sequence:
  - overlay:
      properties:
        - opacity: 0 → 0.3
      duration: 200ms
      
  - sheet_container:
      properties:
        - translateY: 100% → 0%
      duration: 400ms
      easing: ease_out
```

### 5.2 Sheet Exit
```yaml
animation: sheet_exit
trigger: dismiss
duration: 300ms

sequence:
  - sheet_container:
      properties:
        - translateY: 0% → 100%
      duration: 300ms
      easing: ease_in
      
  - overlay:
      properties:
        - opacity: 0.3 → 0
      duration: 200ms
      delay: 100ms
```

### 5.3 Stats Count Animation
```yaml
animation: stats_count
trigger: on_appear
duration: 800ms

properties:
  - count_up from 0 to actual value
  - easing: ease_out
```

---

## 6. DATA CALCULATIONS

### 6.1 Current Streak
```yaml
calculation: current_streak
algorithm:
  count = 0
  date = today
  while has_completion(habit_id, date):
    count++
    date = date - 1 day
  return count
```

### 6.2 Longest Streak
```yaml
calculation: longest_streak
algorithm:
  Find all completion dates for habit
  Sort by date
  Find longest consecutive sequence
  Return length
```

### 6.3 Completion Rate
```yaml
calculation: completion_rate
algorithm:
  total_days = days_since_creation
  completed_days = count(completions)
  rate = (completed_days / total_days) * 100
  return round(rate)
```

---

## 7. ACCESSIBILITY

```yaml
screen_reader:
  announce_on_appear: "{habit.name}. {current_streak} dages streak."
  
elements:
  - streak_card:
      label: "Nuværende streak: {streak} dage"
      
  - stat_card_longest:
      label: "Længste streak: {longest} dage"
      
  - stat_card_rate:
      label: "Gennemførselsprocent: {rate} procent"
      
  - calendar_day:
      label: "{day} {month}. {status}"
      status: "gennemført" | "ikke gennemført" | "i dag"
      
  - delete_button:
      label: "Slet vane"
      hint: "Sletter al historik for denne vane"
```

---

## 8. TEST SCENARIOS

| Scenario | Expected |
|----------|----------|
| Open detail | Sheet slides up, stats load |
| Swipe down | Sheet dismisses |
| Tap overlay | Sheet dismisses |
| Tap edit | Navigate to edit screen |
| Tap delete | Show confirmation |
| Confirm delete | Delete and return home |
| Navigate months | Calendar updates |
| No streak | Show "no streak" state |

---

*Habit Detail screen specification complete.*
