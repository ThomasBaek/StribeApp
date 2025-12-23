# 08 - Edit Habit Screen
## Stribe UX Specification

---

## SCREEN METADATA
```yaml
screen_id: 08_EDIT_HABIT
screen_name: Edit Habit
screen_type: Form
previous_screen: 06_HABIT_DETAIL
next_screen: 06_HABIT_DETAIL (updated)
presentation: push_navigation or modal
```

---

## 1. VISUAL LAYOUT

```
┌─────────────────────────────────────┐
│            STATUS BAR               │
├─────────────────────────────────────┤
│  ✕ Rediger vane               Gem   │  ← Header
├─────────────────────────────────────┤
│                                     │
│   Navn                              │
│   ┌─────────────────────────────┐   │
│   │ Motion                      │   │  ← Pre-filled
│   └─────────────────────────────┘   │
│                                     │
│   Vælg ikon                         │
│   ┌───┬───┬───┬───┬───┬───┬───┐     │
│   │ 🏃│ 📚│ 🧘│ 💧│ 🥗│ 💊│ ✍️│     │  ← Current selected
│   ├───┼───┼───┼───┼───┼───┼───┤     │
│   │...│...│...│...│...│...│...│     │
│   └───┴───┴───┴───┴───┴───┴───┘     │
│                                     │
│   Vælg farve                        │
│   ┌──┬──┬──┬──┬──┬──┐               │
│   │🔵│🟢│🟡│🟠│🔴│🟣│               │  ← Current selected
│   ├──┼──┼──┼──┼──┼──┤               │
│   │  │  │  │  │  │  │               │
│   └──┴──┴──┴──┴──┴──┘               │
│                                     │
│   Påmindelse                        │
│   ┌─────────────────────────────┐   │
│   │  🔔  09:00                ▼ │   │
│   └─────────────────────────────┘   │
│                                     │
│   ─────────────────────────────     │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  🗑️  Slet vane              │   │  ← Delete option
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 2. RELATIONSHIP TO ADD HABIT

```yaml
inheritance:
  base_screen: 07_ADD_HABIT
  
differences:
  - Header title: "Rediger vane" (not "Ny vane")
  - Form pre-populated with existing habit data
  - Save button: Updates instead of creates
  - Delete section: Added at bottom
  - No auto-focus on name (keyboard not auto-open)
```

---

## 3. PRE-POPULATED STATE

```yaml
on_open:
  - Load habit from database by habit_id
  - Populate form fields:
      name: habit.name
      icon: habit.icon (selected in grid)
      color: habit.color (selected in grid)
      reminder_enabled: habit.reminder_time != null
      reminder_time: habit.reminder_time or default
      
  - Store original_values for change detection
```

---

## 4. ADDITIONAL ELEMENTS

### 4.1 Delete Section
```yaml
element: delete_section
type: container
margin_top: space_8 (32dp)
padding_top: space_6 (24dp)
border_top: 1dp solid divider

children:
  - delete_button:
      type: pressable_row
      padding: space_4 (16dp)
      background: error_bg (#FDEDED)
      border_radius: radius_md (8dp)
      layout: flex_row
      align_items: center
      gap: space_3 (12dp)
      
      children:
        - trash_icon:
            type: icon
            name: trash
            size: icon_md (24dp)
            color: error (#D4736A)
            
        - delete_text:
            type: text
            content: "Slet vane"
            style:
              font_size: text_base (16sp)
              font_weight: font_medium
              color: error (#D4736A)
              
      on_tap: show_delete_confirmation
```

---

## 5. INTERACTIONS

### 5.1 Save (Update) Tap
```yaml
interaction: tap_save
condition: form_has_changes AND can_save

on_tap:
  - Validate form
  - UPDATE habits SET name=?, icon=?, color=?, reminder_time=? WHERE id=?
  - If reminder changed:
      - Cancel old notification
      - Schedule new notification (if enabled)
  - Dismiss screen
  - Return to detail (with updated data)
  - Show toast: "Vane opdateret"
```

### 5.2 Delete Confirmation
```yaml
interaction: show_delete_confirmation
on_tap_delete_button:
  show_dialog:
    type: alert
    title: "Slet '{habit.name}'?"
    message: "Al historik og statistik for denne vane vil blive slettet permanent."
    buttons:
      - text: "Annuller"
        style: secondary
        action: dismiss_dialog
        
      - text: "Slet"
        style: destructive
        action: delete_habit

on_delete_confirmed:
  - DELETE FROM completions WHERE habit_id = ?
  - DELETE FROM habits WHERE id = ?
  - Cancel scheduled notification
  - Dismiss edit screen
  - Dismiss detail screen
  - Return to home
  - Show toast: "Vane slettet"
```

### 5.3 Close with Changes
```yaml
interaction: tap_close
on_tap:
  if has_unsaved_changes:
    show_dialog:
      title: "Kassér ændringer?"
      message: "Dine ændringer vil ikke blive gemt."
      buttons:
        - "Fortsæt redigering"
        - "Kassér"
    on_discard: dismiss_screen
  else:
    dismiss_screen
```

---

## 6. CHANGE DETECTION

```yaml
change_detection:
  algorithm:
    has_changes = (
      current.name != original.name OR
      current.icon != original.icon OR
      current.color != original.color OR
      current.reminder_enabled != original.reminder_enabled OR
      current.reminder_time != original.reminder_time
    )
    
  save_button:
    enabled: has_changes AND name.length > 0
    
  close_confirmation:
    show_if: has_changes
```

---

## 7. ACCESSIBILITY

```yaml
screen_reader:
  announce_on_appear: "Rediger {habit.name}."
  
elements:
  # Same as 07_ADD_HABIT, plus:
  
  - delete_button:
      label: "Slet vane"
      hint: "Sletter vanen og al dens historik permanent"
      role: button
```

---

## 8. TEST SCENARIOS

| Scenario | Expected |
|----------|----------|
| Open screen | Form pre-filled with habit data |
| No changes, tap close | Dismiss immediately |
| Make changes, tap close | Show confirmation |
| Change name, tap save | Update habit, return to detail |
| Change reminder time | Update notification schedule |
| Disable reminder | Cancel notification |
| Tap delete | Show confirmation dialog |
| Confirm delete | Delete habit, return to home |
| Cancel delete | Stay on edit screen |

---

*Edit Habit screen specification complete.*
