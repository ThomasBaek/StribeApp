# 05 - Home Screen
## Stribe UX Specification

---

## SCREEN METADATA
```yaml
screen_id: 05_HOME
screen_name: Home / Daily View
screen_type: Main
is_root: true
can_navigate_to: [06_HABIT_DETAIL, 07_ADD_HABIT, 09_SETTINGS, 10_MILESTONE]
```

---

## 1. VISUAL LAYOUT

```
┌─────────────────────────────────────┐
│            STATUS BAR               │
├─────────────────────────────────────┤
│  ☰                    Stribe   ⚙️   │  ← Header
├─────────────────────────────────────┤
│                                     │
│   Tirsdag, 23. december             │  ← Date header
│   ─────────────────────────────     │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 🏃 Motion            🔥 14  │   │  ← Habit Card 1
│   │                             │   │
│   │ ████████████░░░░░░░░░░░░░░  │   │  ← Weekly progress
│   │                        ○    │   │  ← Checkbox
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 📚 Læse              🔥 7   │   │  ← Habit Card 2
│   │                             │   │
│   │ ████████████████████░░░░░░  │   │
│   │                        ○    │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 🧘 Meditation        🔥 21  │   │  ← Habit Card 3
│   │                             │   │     (completed)
│   │ ██████████████████████████  │   │
│   │                   ✓ Done    │   │
│   └─────────────────────────────┘   │
│                                     │
│   ─────────────────────────────     │
│   2 af 3 i dag • Bliv ved! 💪      │  ← Progress summary
│                                     │
├─────────────────────────────────────┤
│              [ ➕ ]                 │  ← FAB
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
background: background (#FAFBFA)
padding_horizontal: space_4 (16dp)
layout: flex_row
align_items: center
justify_content: space_between
border_bottom: 1dp solid divider (#E5EBE8)

children:
  - menu_button:
      type: IconButton
      icon: menu (☰)
      size: 44dp
      icon_size: icon_md (24dp)
      icon_color: text_primary
      on_tap: show_menu_drawer  # v2, for now: no-op
      visible: false  # Hide in v1, just show logo
      
  - app_title:
      type: text
      content: "Stribe"
      style:
        font_size: text_xl (20sp)
        font_weight: font_bold
        color: primary (#2D5A4A)
      position: center
      
  - settings_button:
      type: IconButton
      icon: settings_outline (⚙️)
      size: 44dp
      icon_size: icon_md (24dp)
      icon_color: text_secondary
      on_tap: navigate_to_settings
```

### 2.2 Date Header
```yaml
element: date_header
type: container
padding_horizontal: space_4 (16dp)
padding_vertical: space_4 (16dp)
layout: flex_row
align_items: center
justify_content: space_between

children:
  - date_navigation_left:
      type: IconButton
      icon: chevron_left
      size: 44dp
      icon_color: text_tertiary
      on_tap: go_to_previous_day
      visible: true  # Always show
      
  - date_display:
      type: container
      layout: flex_column
      align_items: center
      
      children:
        - date_text:
            type: text
            content: dynamic  # "Tirsdag, 23. december" | "I går" | "I dag"
            style:
              font_size: text_lg (18sp)
              font_weight: font_semibold
              color: text_primary
              
        - relative_date:
            type: text
            content: dynamic  # "i dag" | null
            style:
              font_size: text_sm (14sp)
              color: text_tertiary
            visible: if not today
            
  - date_navigation_right:
      type: IconButton
      icon: chevron_right
      size: 44dp
      icon_color: text_tertiary
      on_tap: go_to_next_day
      visible: if not_today  # Hide when viewing today
      opacity: if is_today then 0.3  # Or hide completely
```

### 2.3 Habit List
```yaml
element: habit_list
type: scroll_view
direction: vertical
padding_horizontal: space_4 (16dp)
padding_bottom: space_20 (80dp)  # Space for FAB
content_inset_bottom: safe_area
show_scrollbar: false

children:
  - habit_cards: array of HabitCard components
  - Rendered in order of: creation date (oldest first)
```

### 2.4 HabitCard Component (CRITICAL)
```yaml
element: HabitCard
type: composite_component
file: ../components/HABIT_CARD.md  # See separate detailed spec

# Quick reference:
width: 100%
height: auto (typically ~100dp)
margin_bottom: space_3 (12dp)
background: surface (#FFFFFF)
border_radius: radius_lg (12dp)
shadow: shadow_sm
padding: space_4 (16dp)

layout: |
  ┌────────────────────────────────────────┐
  │  [emoji]  [name]              [streak] │  Row 1: Identity + Streak
  │                                        │
  │  [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]   │  Row 2: Week progress bar
  │                                        │
  │                              [button]  │  Row 3: Action
  └────────────────────────────────────────┘

data_binding:
  - habit: Habit object from database
  - today_completed: boolean
  - current_streak: number
  - week_completions: array of 7 booleans (Mon-Sun)
```

### 2.5 Progress Summary
```yaml
element: progress_summary
type: container
padding: space_4 (16dp)
margin_top: space_2 (8dp)
layout: flex_row
align_items: center
justify_content: center
gap: space_2 (8dp)

children:
  - summary_text:
      type: text
      content: dynamic  # "{completed} af {total} i dag"
      style:
        font_size: text_sm (14sp)
        color: text_secondary
        
  - motivation_text:
      type: text
      content: dynamic  # Based on progress
      style:
        font_size: text_sm (14sp)
        color: text_secondary
        
motivation_logic:
  0_completed: "Start dagen godt! ☀️"
  some_completed: "Bliv ved! 💪"
  all_completed: "Perfekt dag! 🎉"
  all_completed_streak: "Du er på en streak! 🔥"
```

### 2.6 Floating Action Button (FAB)
```yaml
element: fab
type: FloatingActionButton
icon: plus (+)
size: 56dp
icon_size: icon_md (24dp)
background: primary (#2D5A4A)
icon_color: white
shadow: shadow_lg
position:
  horizontal: center
  bottom: space_6 (24dp) + safe_area_bottom
  
on_tap: navigate_to_add_habit

accessibility:
  label: "Tilføj ny vane"
```

---

## 3. STATES

### 3.1 Default State (Today with habits)
```yaml
state: default
conditions: 
  - viewing_date == today
  - habits.length > 0
elements_visible: all
navigation_right: hidden or disabled
```

### 3.2 Past Day State
```yaml
state: viewing_past
conditions:
  - viewing_date < today
changes:
  - date_header: Show full date + "X dage siden"
  - navigation_right: visible
  - habit_cards: Show historical completion state
  - Cards are NOT interactive (can't change past)
  
card_appearance:
  completed: Normal completed style
  missed: Grayed out with "Misset" label
```

### 3.3 Empty State (No habits)
```yaml
state: empty
conditions:
  - habits.length == 0
  
layout:
  ┌─────────────────────────────────────┐
  │            [Header]                 │
  ├─────────────────────────────────────┤
  │                                     │
  │                                     │
  │           [Illustration]            │  ← Empty state graphic
  │                                     │
  │      Ingen vaner endnu              │
  │                                     │
  │   Tilføj din første vane og         │
  │   begynd at bygge gode rutiner      │
  │                                     │
  │   ┌─────────────────────────────┐   │
  │   │   ➕ Tilføj første vane     │   │
  │   └─────────────────────────────┘   │
  │                                     │
  │                                     │
  └─────────────────────────────────────┘
  
elements:
  - illustration:
      type: image
      asset: empty_state_illustration
      size: 200dp × 160dp
      
  - title:
      type: text
      content: "Ingen vaner endnu"
      style: headline_medium
      
  - description:
      type: text
      content: "Tilføj din første vane og begynd at bygge gode rutiner"
      style: body_medium, text_secondary
      text_align: center
      
  - cta_button:
      type: PrimaryButton
      text: "Tilføj første vane"
      icon_left: plus
      on_tap: navigate_to_add_habit
```

### 3.4 All Completed State
```yaml
state: all_completed
conditions:
  - All habits for today are marked completed
  
changes:
  - progress_summary.motivation_text: "Perfekt dag! 🎉"
  - Optional: Subtle celebration animation on summary
  - Optional: Confetti burst (if first time all complete)
```

### 3.5 Loading State
```yaml
state: loading
conditions:
  - Initial data load
  
show:
  - Skeleton cards (3 placeholder cards)
  - Shimmer animation
duration: Should be < 200ms (local database)
```

---

## 4. INTERACTIONS

### 4.1 Habit Card Tap (on card body)
```yaml
interaction: tap_habit_card
element: HabitCard (excluding checkbox)
gesture: tap

on_tap:
  - Haptic feedback (light)
  - Navigate to: 06_HABIT_DETAIL
  - Pass: habit_id
  - Transition: slide_up (bottom sheet style)
```

### 4.2 Habit Checkbox Tap
```yaml
interaction: tap_checkbox
element: HabitCard.checkbox
gesture: tap
condition: viewing_date == today

on_tap:
  if not completed:
    - Play haptic feedback (success)
    - Animate checkbox: empty → filled with checkmark
    - Animate card: brief glow/pulse
    - Update database: INSERT completion
    - Update streak count (animate number change)
    - Check for milestone
    - If milestone reached:
        - Delay 500ms
        - Show 10_MILESTONE_CELEBRATION
        
  if already completed:
    - Play haptic feedback (light)
    - Animate checkbox: filled → empty
    - Update database: DELETE completion
    - Update streak count
    - Note: Undoing should be easy, no confirmation
```

### 4.3 Date Navigation
```yaml
interaction: tap_previous_day
element: date_navigation_left
gesture: tap

on_tap:
  - Animate date change (slide left)
  - viewing_date = viewing_date - 1 day
  - Load completions for that date
  - Update all habit cards
  
interaction: tap_next_day
element: date_navigation_right
gesture: tap
condition: viewing_date < today

on_tap:
  - Animate date change (slide right)
  - viewing_date = viewing_date + 1 day
  - Load completions for that date
```

### 4.4 Swipe Navigation
```yaml
interaction: swipe_date
gesture: horizontal_swipe
threshold: 50dp

swipe_left:
  - If can go to previous day:
      - Same as tap_previous_day
      
swipe_right:
  - If viewing_date < today:
      - Same as tap_next_day
```

### 4.5 Pull to Refresh
```yaml
interaction: pull_to_refresh
gesture: pull_down
threshold: 80dp

on_trigger:
  - Show refresh indicator
  - Reload habits from database
  - Recalculate all streaks
  - Hide indicator
  
note: Mostly cosmetic since data is local, but useful for:
  - Day rollover check
  - Streak recalculation
```

### 4.6 FAB Tap
```yaml
interaction: tap_fab
element: fab
gesture: tap

on_tap:
  - Haptic feedback (light)
  - Animate FAB (scale down briefly)
  - Navigate to: 07_ADD_HABIT
  - Transition: slide_up
```

### 4.7 Settings Tap
```yaml
interaction: tap_settings
element: settings_button
gesture: tap

on_tap:
  - Navigate to: 09_SETTINGS
  - Transition: slide_left
```

---

## 5. ANIMATIONS

### 5.1 Screen Entry Animation
```yaml
animation: home_entry
trigger: screen_appear (first time or from onboarding)

sequence:
  - step_1:
      element: header
      properties: opacity 0 → 1
      duration: 200ms
      
  - step_2:
      element: date_header
      properties: 
        - opacity: 0 → 1
        - translateY: -10dp → 0
      duration: 300ms
      delay: 100ms
      
  - step_3:
      element: habit_cards (staggered)
      properties:
        - opacity: 0 → 1
        - translateY: 20dp → 0
      duration: 300ms
      stagger: 80ms per card
      easing: ease_out
```

### 5.2 Checkbox Completion Animation
```yaml
animation: complete_habit
trigger: checkbox_tap (uncompleted → completed)
duration: 400ms

sequence:
  - step_1: # Checkbox fill
      element: checkbox
      properties:
        - scale: 1.0 → 1.3 → 1.0
        - background: transparent → success
      duration: 250ms
      easing: ease_bounce
      
  - step_2: # Checkmark draw
      element: checkmark_icon
      properties:
        - stroke_dashoffset: 100% → 0%  # Draw effect
        - opacity: 0 → 1
      duration: 200ms
      delay: 100ms
      
  - step_3: # Card glow
      element: HabitCard
      properties:
        - shadow: shadow_sm → shadow_lg → shadow_sm
        - border_color: transparent → success (brief)
      duration: 400ms
      
  - step_4: # Streak number update
      element: streak_count
      properties:
        - Old number: scale down + fade out
        - New number: scale up + fade in
      duration: 300ms
      delay: 200ms
```

### 5.3 Checkbox Undo Animation
```yaml
animation: undo_habit
trigger: checkbox_tap (completed → uncompleted)
duration: 200ms

properties:
  - checkbox.background: success → transparent
  - checkmark: fade out
  - streak_count: update (reverse animation)
  
note: Simpler than completion, less celebration
```

### 5.4 Date Change Animation
```yaml
animation: date_slide
trigger: date_navigation or swipe
duration: 300ms

direction_left: # Going to past
  - Current content: slide right + fade out
  - New content: slide in from left + fade in
  
direction_right: # Going to future (towards today)
  - Current content: slide left + fade out
  - New content: slide in from right + fade in
```

### 5.5 Card Reorder Animation (after completion)
```yaml
animation: card_reorder
trigger: after_completion (optional - if sorting completed to bottom)
duration: 400ms
easing: ease_out

note: In v1, cards don't reorder. Keep simple.
```

---

## 6. BEHAVIOR & LOGIC

### 6.1 Day Rollover Logic
```yaml
day_rollover:
  day_start_time: from settings (default 04:00)
  
  logic:
    current_time = now()
    if current_time.hour < day_start_hour:
      effective_date = today - 1 day
    else:
      effective_date = today
      
  on_app_foreground:
    - Check if effective_date changed since last check
    - If changed:
        - Refresh habit list
        - Reset all checkboxes for new day
        - Calculate new streaks
```

### 6.2 Streak Calculation
```yaml
streak_calculation:
  # Called when: app opens, completion added/removed, date changes
  
  algorithm:
    streak = 0
    date = today (or effective_date)
    
    while true:
      if has_completion(habit_id, date):
        streak += 1
        date = date - 1 day
      else:
        break
        
    return streak
    
  cache:
    - Cache streak values
    - Invalidate on completion change
```

### 6.3 Milestone Detection
```yaml
milestone_detection:
  thresholds: [7, 21, 30, 60, 90, 180, 365]
  
  on_completion:
    new_streak = calculate_streak()
    if new_streak in thresholds:
      # Check if this milestone was already shown for this habit
      if not milestone_shown(habit_id, new_streak):
        show_milestone_celebration(habit, new_streak)
        mark_milestone_shown(habit_id, new_streak)
```

### 6.4 Week Progress Bar
```yaml
week_progress:
  shows: Last 7 days (Mon-Sun of current week)
  
  calculation:
    for each day in current_week:
      filled = has_completion(habit_id, day)
      
  visual:
    - 7 segments
    - Filled segment: habit color (or primary)
    - Empty segment: border color
    - Today highlighted (slightly different)
```

---

## 7. ACCESSIBILITY

```yaml
screen_reader:
  announce_on_appear: "Stribe. {date}. {completed} af {total} vaner færdige."
  
elements:
  - date_navigation_left:
      label: "Gå til forrige dag"
      
  - date_display:
      label: "{full_date}"
      
  - HabitCard:
      label: "{name}. {streak} dages streak. {status}."
      hint: "Tryk for detaljer. Tryk på knappen for at markere som færdig."
      
  - checkbox:
      label: "Marker {habit_name} som færdig"
      state: "ikke markeret" | "markeret"
      
  - fab:
      label: "Tilføj ny vane"
      
focus_order: 
  [date_nav_left, date_display, date_nav_right, habit_cards..., fab, settings]

reduce_motion:
  - Skip entry animations
  - Instant checkbox state changes
  - No card glow effect
```

---

## 8. ERROR HANDLING

```yaml
errors:
  database_read_error:
    show: Toast "Kunne ikke indlæse vaner"
    action: Retry button
    
  database_write_error:
    show: Toast "Kunne ikke gemme"
    action: Retry automatically
    visual: Keep checkbox in loading state
```

---

## 9. PERFORMANCE

```yaml
performance_targets:
  initial_render: < 100ms
  database_query: < 50ms
  animation_fps: 60fps
  
optimizations:
  - Use RecyclerView / CollectionView for habit list
  - Cache streak calculations
  - Lazy load historical data
  - Preload adjacent dates
```

---

## 10. TEST SCENARIOS

| Scenario | Expected |
|----------|----------|
| First open after onboarding | Show habits from onboarding |
| Tap checkbox | Complete habit, animate, update streak |
| Tap checkbox again | Undo completion |
| Complete all habits | Show celebration message |
| Navigate to yesterday | Show past completions (read-only) |
| Navigate to future | Not possible (blocked) |
| Reach milestone | Show celebration modal |
| No habits | Show empty state |
| Pull to refresh | Reload data |

---

*Home screen specification complete. This is the core experience.*
