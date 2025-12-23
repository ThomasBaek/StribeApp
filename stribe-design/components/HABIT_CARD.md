# HabitCard Component
## Stribe Component Specification

---

## COMPONENT METADATA
```yaml
component_id: HABIT_CARD
component_name: HabitCard
type: Composite Component
used_in: [05_HOME, 06_HABIT_DETAIL]
```

---

## 1. VISUAL STRUCTURE

```
┌────────────────────────────────────────────────────────┐
│  padding: 16dp                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │  ┌────┐                                          │  │
│  │  │ 🏃 │  Motion                        🔥 14     │  │  ← Row 1
│  │  └────┘                                          │  │
│  │                                                  │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │  │  ← Row 2
│  │  Ma Ti On To Fr Lø Sø                           │  │
│  │                                                  │  │
│  │                                       ┌─────┐   │  │  ← Row 3
│  │                                       │  ○  │   │  │
│  │                                       └─────┘   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘

States:
○ = Uncompleted (empty circle)
✓ = Completed (filled with checkmark)
```

---

## 2. COMPONENT PROPERTIES (Props)

```yaml
props:
  habit:
    type: Habit
    required: true
    description: "Habit object from database"
    shape:
      id: string
      name: string
      icon: string (emoji)
      color: string (color key)
      reminder_time: string | null
      created_at: string
      
  is_completed:
    type: boolean
    required: true
    description: "Whether habit is completed for viewed date"
    
  current_streak:
    type: number
    required: true
    description: "Current streak count"
    
  week_completions:
    type: array[7]
    required: true
    description: "Boolean array for Mon-Sun completion status"
    example: [true, true, true, false, true, true, false]
    
  is_today:
    type: boolean
    required: true
    description: "Whether viewing today (affects interactivity)"
    
  on_tap_card:
    type: function
    required: true
    description: "Callback when card body is tapped"
    
  on_tap_checkbox:
    type: function
    required: true
    description: "Callback when checkbox is tapped"
```

---

## 3. ELEMENT SPECIFICATIONS

### 3.1 Card Container
```yaml
element: card_container
type: pressable_surface
width: 100%
min_height: 100dp
background: surface (#FFFFFF)
border_radius: radius_lg (12dp)
shadow: shadow_sm
padding: space_4 (16dp)

# Touch feedback
on_press:
  background: surface (no change)
  scale: 0.98
  shadow: shadow_none
  duration: 150ms

layout: flex_column
gap: space_3 (12dp)
```

### 3.2 Row 1: Header Row
```yaml
element: header_row
type: container
layout: flex_row
align_items: center
justify_content: space_between
width: 100%

children:
  - left_section:
      layout: flex_row
      align_items: center
      gap: space_3 (12dp)
      
      children:
        - icon_container:
            type: container
            width: 40dp
            height: 40dp
            background: habit.color (with 15% opacity)
            border_radius: radius_md (8dp)
            align_items: center
            justify_content: center
            
            children:
              - habit_emoji:
                  type: text
                  content: habit.icon
                  font_size: 24sp
                  
        - habit_name:
            type: text
            content: habit.name
            style:
              font_size: text_lg (18sp)
              font_weight: font_semibold
              color: text_primary
            max_lines: 1
            ellipsize: end
            max_width: 180dp  # Prevent overflow
            
  - right_section:
      layout: flex_row
      align_items: center
      gap: space_1 (4dp)
      
      children:
        - fire_emoji:
            type: text
            content: "🔥"
            font_size: 16sp
            visible: current_streak > 0
            
        - streak_count:
            type: text
            content: "{current_streak}"
            style:
              font_size: text_lg (18sp)
              font_weight: font_bold
              color: streak_fire (#F5A623)
            visible: current_streak > 0
            
            # Animation on change
            animation_on_change:
              type: number_flip
              duration: 300ms
```

### 3.3 Row 2: Week Progress Bar
```yaml
element: week_progress
type: container
layout: flex_row
gap: space_1 (4dp)
width: 100%
height: 8dp
margin_top: space_1 (4dp)

children:
  - For each day (Mon-Sun, index 0-6):
      element: day_segment
      type: view
      flex: 1
      height: 8dp
      border_radius: radius_sm (4dp)
      
      background:
        if week_completions[index] == true:
          color: habit.color
        else:
          color: border (#E5EBE8)
          
      # Today indicator
      if index == today_weekday_index:
        border: 2dp solid primary
        
      # Optional: Past days that are missed have different style
      if day < today && !completed:
        background: error_bg (#FDEDED)
```

### 3.4 Row 3: Action Row
```yaml
element: action_row
type: container
layout: flex_row
align_items: center
justify_content: flex_end
margin_top: space_2 (8dp)

children:
  - checkbox_button:
      type: pressable
      width: 44dp
      height: 44dp
      align_items: center
      justify_content: center
      
      children:
        # Uncompleted state
        - checkbox_empty:
            type: view
            width: 28dp
            height: 28dp
            border_radius: radius_full (14dp)
            border: 2dp solid border (#E5EBE8)
            background: transparent
            visible: !is_completed
            
        # Completed state
        - checkbox_filled:
            type: view
            width: 28dp
            height: 28dp
            border_radius: radius_full (14dp)
            background: success (#4CAF7A)
            visible: is_completed
            align_items: center
            justify_content: center
            
            children:
              - checkmark_icon:
                  type: icon
                  name: checkmark
                  size: 16dp
                  color: white
                  stroke_width: 2.5dp
```

### 3.5 Completed Card Variant
```yaml
# When is_completed == true, additional styling:
variant: completed
changes:
  - checkbox: Show filled with checkmark
  - Optional subtle styling:
      - card_container.background: success_bg (#E8F5ED) subtle
      - OR: Just the checkbox change (cleaner)
```

### 3.6 Past Day Card Variant (Read-only)
```yaml
# When is_today == false (viewing past)
variant: past_day
changes:
  - checkbox_button.enabled: false
  - checkbox_button.opacity: 0.5
  - If missed (is_completed == false):
      - Show "Misset" text instead of checkbox
      - text_color: error (#D4736A)
      - font_size: text_sm
```

---

## 4. STATES

### 4.1 Default State (Uncompleted, Today)
```yaml
state: default
conditions:
  - is_completed: false
  - is_today: true
  
appearance:
  - checkbox: empty circle
  - card: normal styling
  - interactive: true
```

### 4.2 Completed State (Today)
```yaml
state: completed
conditions:
  - is_completed: true
  - is_today: true
  
appearance:
  - checkbox: filled with checkmark
  - card: subtle success background (optional)
  - interactive: true (can undo)
```

### 4.3 Pressed State
```yaml
state: pressed
trigger: on_press_down
duration: while_pressed

appearance:
  - scale: 0.98
  - shadow: shadow_none
  - background: unchanged
```

### 4.4 Past Completed State
```yaml
state: past_completed
conditions:
  - is_completed: true
  - is_today: false
  
appearance:
  - checkbox: filled (but not interactive)
  - opacity: slightly reduced (0.9)
```

### 4.5 Past Missed State
```yaml
state: past_missed
conditions:
  - is_completed: false
  - is_today: false
  
appearance:
  - checkbox: replaced with "Misset" text
  - card: subtle error styling
  - opacity: 0.7
```

---

## 5. ANIMATIONS

### 5.1 Checkbox Tap Animation (Complete)
```yaml
animation: checkbox_complete
trigger: tap when uncompleted
duration: 400ms

sequence:
  - step_1:
      element: checkbox_empty
      duration: 150ms
      properties:
        - scale: 1.0 → 1.2 → 0
        - opacity: 1 → 0
      easing: ease_in
      
  - step_2:
      element: checkbox_filled
      start: after step_1 (150ms)
      duration: 250ms
      properties:
        - scale: 0 → 1.2 → 1.0
        - opacity: 0 → 1
      easing: ease_bounce
      
  - step_3:
      element: checkmark_icon
      start: after 200ms
      duration: 200ms
      properties:
        - stroke_dashoffset: 100% → 0%  # Draw effect
      easing: ease_out
      
  - step_4:
      element: card_container
      start: 0ms
      duration: 400ms
      properties:
        - Apply brief glow/border pulse
      
haptic: success (medium)
sound: soft_pop (optional)
```

### 5.2 Checkbox Tap Animation (Undo)
```yaml
animation: checkbox_undo
trigger: tap when completed
duration: 200ms

properties:
  - checkbox_filled.scale: 1.0 → 0.8 → 0
  - checkbox_filled.opacity: 1 → 0
  - checkbox_empty.opacity: 0 → 1 (after 100ms)
  
easing: ease_out
haptic: light
```

### 5.3 Card Press Animation
```yaml
animation: card_press
trigger: on_press_start (card body, not checkbox)
duration: 150ms

properties:
  - scale: 1.0 → 0.98
  - shadow: shadow_sm → shadow_none
  
easing: ease_out
```

### 5.4 Card Release Animation
```yaml
animation: card_release
trigger: on_press_end
duration: 150ms

properties:
  - scale: 0.98 → 1.0
  - shadow: shadow_none → shadow_sm
  
easing: ease_out
```

### 5.5 Streak Count Update Animation
```yaml
animation: streak_update
trigger: streak count changes
duration: 300ms

# Flip animation
sequence:
  - Old number:
      properties:
        - rotateX: 0 → 90deg
        - opacity: 1 → 0
      duration: 150ms
      
  - New number:
      properties:
        - rotateX: -90deg → 0
        - opacity: 0 → 1
      duration: 150ms
      delay: 150ms
```

---

## 6. INTERACTION DETAILS

### 6.1 Touch Areas
```yaml
touch_areas:
  card_body:
    area: Entire card EXCEPT checkbox area
    gesture: tap
    action: on_tap_card (navigate to detail)
    
  checkbox:
    area: 44dp × 44dp around checkbox (minimum touch target)
    gesture: tap
    action: on_tap_checkbox (toggle completion)
    
touch_feedback:
  card: scale + shadow change
  checkbox: ripple effect (Android) or highlight (iOS)
```

### 6.2 Long Press (Future)
```yaml
# v2 feature
long_press:
  gesture: long_press (500ms)
  action: show_quick_actions_menu
  menu_items: [Edit, Delete, Skip Today]
```

---

## 7. ACCESSIBILITY

```yaml
accessibility:
  card_container:
    role: button
    label: "{habit.name}. Streak: {current_streak} dage."
    hint: "Tryk for at se detaljer"
    
  checkbox_button:
    role: checkbox
    label: "Marker {habit.name} som færdig"
    state: 
      if is_completed: "markeret"
      else: "ikke markeret"
    action: "Tryk for at ændre"
    
  week_progress:
    role: progressbar
    label: "Ugens fremgang: {completed_days} af 7 dage"
    
  # Announce changes
  on_complete:
    announce: "{habit.name} markeret som færdig. Streak: {new_streak} dage."
    
  on_undo:
    announce: "{habit.name} ikke længere markeret."
```

---

## 8. USAGE EXAMPLE

```yaml
# In Home screen:
HabitCard(
  habit: {
    id: "abc123",
    name: "Motion",
    icon: "🏃",
    color: "habit_green",
    reminder_time: "09:00",
    created_at: "2025-12-01T10:00:00Z"
  },
  is_completed: false,
  current_streak: 14,
  week_completions: [true, true, true, false, true, true, false],
  is_today: true,
  on_tap_card: () => navigate('habit_detail', { id: 'abc123' }),
  on_tap_checkbox: () => toggleCompletion('abc123')
)
```

---

## 9. VARIATIONS

### 9.1 Compact Variant (for future use)
```yaml
variant: compact
use_case: Widget or list view
changes:
  - Remove week progress bar
  - Reduce padding to 12dp
  - Reduce icon size to 32dp
  - height: 64dp
```

### 9.2 Large Variant (for detail screen header)
```yaml
variant: large
use_case: Hero section in detail screen
changes:
  - icon_size: 64dp
  - name_font_size: text_2xl
  - streak_font_size: text_3xl
  - Remove week progress (shown separately)
  - Remove checkbox
```

---

*HabitCard component specification complete.*
