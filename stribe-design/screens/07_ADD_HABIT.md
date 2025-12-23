# 07 - Add Habit Screen
## Stribe UX Specification

---

## SCREEN METADATA
```yaml
screen_id: 07_ADD_HABIT
screen_name: Add New Habit
screen_type: Form / Bottom Sheet
previous_screen: 05_HOME
next_screen: 05_HOME (with new habit)
presentation: bottom_sheet or full_screen_modal
```

---

## 1. VISUAL LAYOUT

```
┌─────────────────────────────────────┐
│            STATUS BAR               │
├─────────────────────────────────────┤
│  ✕ Ny vane                    Gem   │  ← Header
├─────────────────────────────────────┤
│                                     │
│   Navn                              │  ← Label
│   ┌─────────────────────────────┐   │
│   │ Drik vand                   │   │  ← Text input
│   └─────────────────────────────┘   │
│                                     │
│   Vælg ikon                         │  ← Label
│   ┌───┬───┬───┬───┬───┬───┬───┐     │
│   │ 🏃│ 📚│ 🧘│ 💧│ 🥗│ 💊│ ✍️│     │  ← Emoji grid
│   ├───┼───┼───┼───┼───┼───┼───┤     │     (selected has
│   │ 🎸│ 🌱│ 🧹│ 💤│ 📵│ 🎯│ 💪│     │      highlight)
│   ├───┼───┼───┼───┼───┼───┼───┤     │
│   │ 🚴│ 🏊│ ⚽│ 🍎│ 🙏│ 😊│ 🎨│     │
│   └───┴───┴───┴───┴───┴───┴───┘     │
│                                     │
│   Vælg farve                        │  ← Label
│   ┌──┬──┬──┬──┬──┬──┐               │
│   │🔵│🟢│🟡│🟠│🔴│🟣│               │  ← Color palette
│   ├──┼──┼──┼──┼──┼──┤               │
│   │  │  │  │  │  │  │               │
│   └──┴──┴──┴──┴──┴──┘               │
│                                     │
│   Påmindelse (valgfrit)             │  ← Label
│   ┌─────────────────────────────┐   │
│   │  🔔  09:00                ▼ │   │  ← Time picker
│   └─────────────────────────────┘   │
│   ┌─────────────────────────────┐   │
│   │  ☐  Ingen påmindelse        │   │  ← Toggle option
│   └─────────────────────────────┘   │
│                                     │
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
background: surface
border_bottom: 1dp solid divider
padding_horizontal: space_4 (16dp)
layout: flex_row
align_items: center
justify_content: space_between

children:
  - close_button:
      type: IconButton
      icon: close (✕)
      size: 44dp
      icon_color: text_secondary
      on_tap: confirm_and_close
      
  - title:
      type: text
      content: "Ny vane"
      style:
        font_size: text_xl (20sp)
        font_weight: font_semibold
        color: text_primary
        
  - save_button:
      type: TextButton
      text: "Gem"
      style:
        font_size: text_lg (18sp)
        font_weight: font_semibold
        color: primary
      on_tap: save_habit
      
      states:
        enabled:
          condition: name.length > 0
          color: primary
        disabled:
          condition: name.length == 0
          color: text_tertiary
          opacity: 0.5
```

### 2.2 Form Container
```yaml
element: form_container
type: scroll_view
padding: space_6 (24dp)
keyboard_avoiding: true
```

### 2.3 Name Input Section
```yaml
element: name_section
type: container
margin_bottom: space_6 (24dp)

children:
  - label:
      type: text
      content: "Navn"
      style:
        font_size: text_sm (14sp)
        font_weight: font_medium
        color: text_secondary
      margin_bottom: space_2 (8dp)
      
  - name_input:
      type: TextField
      placeholder: "F.eks. Drik vand, Læse, Motion..."
      max_length: 30
      auto_focus: true
      keyboard_type: default
      return_key: done
      clear_button: true (show when has text)
      
      style:
        height: 52dp
        padding: space_4 (16dp)
        background: surface
        border: 1.5dp solid border
        border_radius: radius_md (8dp)
        font_size: text_base (16sp)
        
      states:
        focused:
          border_color: primary
          border_width: 2dp
          
      on_change: update_save_button_state
      on_submit: focus_next_or_save
```

### 2.4 Icon Selection Section
```yaml
element: icon_section
type: container
margin_bottom: space_6 (24dp)

children:
  - label:
      type: text
      content: "Vælg ikon"
      style:
        font_size: text_sm (14sp)
        font_weight: font_medium
        color: text_secondary
      margin_bottom: space_3 (12dp)
      
  - icon_grid:
      type: grid
      columns: 7
      gap: space_2 (8dp)
      
      items: # Curated emoji list
        row_1: ["🏃", "📚", "🧘", "💧", "🥗", "💊", "✍️"]
        row_2: ["🎸", "🌱", "🧹", "💤", "📵", "🎯", "💪"]
        row_3: ["🚴", "🏊", "⚽", "🍎", "🙏", "😊", "🎨"]
        row_4: ["☀️", "🌙", "💰", "📞", "🎵", "🧠", "❤️"]
        
      each_item:
        element: icon_button
        type: pressable
        width: (available_width - 6 * 8dp) / 7  # ~44dp
        height: 44dp
        border_radius: radius_md (8dp)
        align_items: center
        justify_content: center
        
        content:
          type: text
          font_size: 24sp
          
        states:
          unselected:
            background: transparent
            
          selected:
            background: primary
            border_radius: radius_md
            
        on_tap: select_icon(emoji)
```

### 2.5 Color Selection Section
```yaml
element: color_section
type: container
margin_bottom: space_6 (24dp)

children:
  - label:
      type: text
      content: "Vælg farve"
      style:
        font_size: text_sm (14sp)
        font_weight: font_medium
        color: text_secondary
      margin_bottom: space_3 (12dp)
      
  - color_grid:
      type: grid
      columns: 6
      gap: space_3 (12dp)
      
      items:
        row_1:
          - { key: "habit_blue", color: "#5B8FB9" }
          - { key: "habit_green", color: "#7CB97B" }
          - { key: "habit_yellow", color: "#E8C547" }
          - { key: "habit_orange", color: "#E89B47" }
          - { key: "habit_red", color: "#D4736A" }
          - { key: "habit_purple", color: "#9B7BB9" }
        row_2:
          - { key: "habit_pink", color: "#D4A5B9" }
          - { key: "habit_teal", color: "#5BB9A7" }
          - { key: "habit_indigo", color: "#6B7BB9" }
          - { key: "habit_brown", color: "#A68B6B" }
          - { key: "habit_gray", color: "#8B9A9A" }
          - { key: "habit_mint", color: "#7BC9B9" }
          
      each_item:
        element: color_button
        type: pressable
        width: 44dp
        height: 44dp
        border_radius: radius_full (22dp)
        background: item.color
        
        states:
          unselected:
            border: none
            
          selected:
            border: 3dp solid text_primary
            # Or: Show checkmark overlay
            
        on_tap: select_color(item.key)
```

### 2.6 Reminder Section
```yaml
element: reminder_section
type: container
margin_bottom: space_6 (24dp)

children:
  - label:
      type: text
      content: "Påmindelse (valgfrit)"
      style:
        font_size: text_sm (14sp)
        font_weight: font_medium
        color: text_secondary
      margin_bottom: space_3 (12dp)
      
  - reminder_options:
      type: container
      
      children:
        - time_picker_row:
            type: pressable_row
            visible: reminder_enabled
            padding: space_4 (16dp)
            background: surface
            border: 1.5dp solid border
            border_radius: radius_md (8dp)
            margin_bottom: space_2 (8dp)
            layout: flex_row
            align_items: center
            gap: space_3 (12dp)
            
            children:
              - bell_icon:
                  type: icon
                  name: bell
                  size: icon_md (24dp)
                  color: primary
                  
              - time_text:
                  type: text
                  content: selected_time  # "09:00"
                  style:
                    font_size: text_lg (18sp)
                    font_weight: font_medium
                    color: text_primary
                  flex: 1
                  
              - chevron:
                  type: icon
                  name: chevron_down
                  size: icon_sm (20dp)
                  color: text_tertiary
                  
            on_tap: show_time_picker
            
        - no_reminder_row:
            type: pressable_row
            padding: space_4 (16dp)
            layout: flex_row
            align_items: center
            gap: space_3 (12dp)
            
            children:
              - checkbox:
                  type: Checkbox
                  checked: !reminder_enabled
                  on_change: toggle_reminder
                  
              - label:
                  type: text
                  content: "Ingen påmindelse"
                  style:
                    font_size: text_base (16sp)
                    color: text_primary
                    
            on_tap: toggle_reminder
```

---

## 3. FORM STATE

```yaml
form_state:
  name:
    type: string
    default: ""
    validation: required, max 30 chars
    
  icon:
    type: string (emoji)
    default: "🎯" (first available)
    validation: required
    
  color:
    type: string (color key)
    default: "habit_blue"
    validation: required
    
  reminder_enabled:
    type: boolean
    default: true
    
  reminder_time:
    type: string (HH:mm)
    default: "09:00" (or from settings)

computed:
  can_save: name.length > 0
```

---

## 4. INTERACTIONS

### 4.1 Close Button Tap
```yaml
interaction: tap_close
on_tap:
  if form_has_changes:
    show_confirmation:
      title: "Kassér ændringer?"
      message: "Din nye vane vil ikke blive gemt."
      buttons:
        - "Fortsæt redigering"
        - "Kassér" (destructive)
    on_discard: dismiss_screen
  else:
    dismiss_screen
```

### 4.2 Save Button Tap
```yaml
interaction: tap_save
condition: can_save == true

on_tap:
  - Validate form
  - Generate UUID for habit
  - INSERT INTO habits (id, name, icon, color, reminder_time, created_at)
  - If reminder_enabled:
      - Schedule notification
  - Dismiss screen
  - Return to home
  - Show new habit in list (with entry animation)
  - Show toast: "Vane tilføjet"
```

### 4.3 Icon Selection
```yaml
interaction: tap_icon
on_tap:
  - Deselect current icon
  - Select new icon
  - Haptic feedback (light)
  - Update preview (if any)
```

### 4.4 Color Selection
```yaml
interaction: tap_color
on_tap:
  - Deselect current color
  - Select new color
  - Haptic feedback (light)
  - Update icon background tint (preview)
```

### 4.5 Time Picker
```yaml
interaction: tap_time
on_tap:
  - Show native time picker
  - On select:
      - Update reminder_time
      - Update time_text display
```

---

## 5. ANIMATIONS

### 5.1 Screen Entry
```yaml
animation: add_habit_entry
trigger: screen_open
type: slide_up
duration: 400ms
easing: ease_out

additional:
  - Auto focus name input
  - Keyboard appears
```

### 5.2 Selection Feedback
```yaml
animation: selection_feedback
trigger: icon or color tap
duration: 150ms

properties:
  - Selected item: scale 0.9 → 1.0
  - Background: instant change
```

### 5.3 Save Success
```yaml
animation: save_success
trigger: tap_save
duration: 300ms

sequence:
  - Button: brief scale down
  - Screen: slide down / fade out
  - Home: new card appears with entry animation
```

---

## 6. VALIDATION

```yaml
validation_rules:
  name:
    required: true
    min_length: 1
    max_length: 30
    error_message: "Navn er påkrævet"
    
  icon:
    required: true
    # Always has default, so shouldn't fail
    
  color:
    required: true
    # Always has default, so shouldn't fail
```

---

## 7. ACCESSIBILITY

```yaml
screen_reader:
  announce_on_appear: "Tilføj ny vane. Indtast navn."
  
elements:
  - name_input:
      label: "Navn på vane"
      hint: "Påkrævet"
      
  - icon_grid:
      label: "Vælg ikon"
      role: radiogroup
      
  - icon_button:
      label: "{emoji_description}"  # e.g., "Løbende person"
      role: radio
      state: "valgt" | "ikke valgt"
      
  - color_button:
      label: "{color_name}"  # e.g., "Blå"
      role: radio
      state: "valgt" | "ikke valgt"
      
  - save_button:
      label: "Gem vane"
      state: "aktiv" | "deaktiveret"

focus_order: [close, name_input, icon_grid, color_grid, reminder_toggle, save]
```

---

## 8. KEYBOARD HANDLING

```yaml
keyboard:
  on_open:
    - Scroll to keep focused field visible
    - Adjust bottom padding
    
  on_close:
    - Restore layout
    
  done_button:
    - Dismiss keyboard
    - If form valid, focus save button
```

---

## 9. TEST SCENARIOS

| Scenario | Expected |
|----------|----------|
| Open screen | Name input focused, keyboard appears |
| Type name | Save button enables |
| Clear name | Save button disables |
| Select icon | Icon highlighted |
| Select color | Color highlighted, icon preview updates |
| Toggle reminder off | Time picker hides |
| Tap save | Habit created, return to home |
| Tap close with changes | Show confirmation |
| Tap close without changes | Dismiss immediately |

---

*Add Habit screen specification complete.*
