# 09 - Settings Screen
## Stribe UX Specification

---

## SCREEN METADATA
```yaml
screen_id: 09_SETTINGS
screen_name: Settings
screen_type: Settings
previous_screen: 05_HOME
can_navigate_to: [Pro Upgrade Sheet]
presentation: push_navigation
```

---

## 1. VISUAL LAYOUT

```
┌─────────────────────────────────────┐
│            STATUS BAR               │
├─────────────────────────────────────┤
│  ← Indstillinger                    │  ← Header
├─────────────────────────────────────┤
│                                     │
│   GENERELT                          │  ← Section header
│   ─────────────────────────────     │
│   ┌─────────────────────────────┐   │
│   │ Dag starter kl.      04:00 >│   │  ← Row with value
│   ├─────────────────────────────┤   │
│   │ Ugen starter        Mandag >│   │
│   ├─────────────────────────────┤   │
│   │ Sprog                Dansk >│   │
│   └─────────────────────────────┘   │
│                                     │
│   NOTIFIKATIONER                    │
│   ─────────────────────────────     │
│   ┌─────────────────────────────┐   │
│   │ Påmindelser            🟢   │   │  ← Toggle
│   ├─────────────────────────────┤   │
│   │ Lyd                    🟢   │   │  ← Toggle
│   └─────────────────────────────┘   │
│                                     │
│   DATA                              │
│   ─────────────────────────────     │
│   ┌─────────────────────────────┐   │
│   │ Eksporter data (CSV)      > │   │  ← Action (Pro)
│   ├─────────────────────────────┤   │
│   │ Slet alle data            > │   │  ← Destructive
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  ⭐ Opgrader til Pro        │   │  ← Pro banner
│   │                             │   │
│   │  • Ubegrænset habits        │   │
│   │  • CSV eksport              │   │
│   │  • Alle badges              │   │
│   │                             │   │
│   │  19 kr/md · 149 kr engang   │   │
│   └─────────────────────────────┘   │
│                                     │
│   ─────────────────────────────     │
│   Om Stribe  •  Privatlivspolitik   │  ← Footer links
│   Version 1.0.0                     │
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
background: background
padding_horizontal: space_4 (16dp)
layout: flex_row
align_items: center
border_bottom: 1dp solid divider

children:
  - back_button:
      type: IconButton
      icon: arrow_left (←)
      size: 44dp
      on_tap: navigate_back
      
  - title:
      type: text
      content: "Indstillinger"
      style:
        font_size: text_xl (20sp)
        font_weight: font_semibold
        color: text_primary
      margin_left: space_2 (8dp)
```

### 2.2 Section Header
```yaml
element: section_header
type: text
content: "{SECTION_NAME}"
style:
  font_size: text_xs (12sp)
  font_weight: font_semibold
  color: text_tertiary
  letter_spacing: 0.5sp
  text_transform: uppercase
margin:
  top: space_6 (24dp)
  bottom: space_2 (8dp)
  horizontal: space_4 (16dp)
```

### 2.3 Settings Group (Card)
```yaml
element: settings_group
type: surface_card
background: surface
border_radius: radius_lg (12dp)
margin_horizontal: space_4 (16dp)
overflow: hidden

children: [SettingsRow, ...]
```

### 2.4 Settings Row - Navigation Style
```yaml
element: settings_row_nav
type: pressable_row
height: 52dp
padding_horizontal: space_4 (16dp)
background: surface
border_bottom: 1dp solid divider (except last)
layout: flex_row
align_items: center
justify_content: space_between

children:
  - label:
      type: text
      content: "{setting_label}"
      style:
        font_size: text_base (16sp)
        color: text_primary
        
  - right_section:
      layout: flex_row
      align_items: center
      gap: space_2 (8dp)
      
      children:
        - value:
            type: text
            content: "{current_value}"
            style:
              font_size: text_base (16sp)
              color: text_secondary
              
        - chevron:
            type: icon
            name: chevron_right
            size: icon_sm (20dp)
            color: text_tertiary

on_tap: open_setting_detail
```

### 2.5 Settings Row - Toggle Style
```yaml
element: settings_row_toggle
type: container
height: 52dp
padding_horizontal: space_4 (16dp)
background: surface
border_bottom: 1dp solid divider (except last)
layout: flex_row
align_items: center
justify_content: space_between

children:
  - label:
      type: text
      content: "{setting_label}"
      style:
        font_size: text_base (16sp)
        color: text_primary
        
  - toggle:
      type: Toggle
      value: {setting_value}
      on_change: update_setting

on_tap_row: toggle the Toggle
```

### 2.6 Settings Row - Action Style
```yaml
element: settings_row_action
type: pressable_row
# Same structure as nav, but:
  - No value text
  - May have Pro badge if locked

children:
  - label_section:
      layout: flex_row
      align_items: center
      gap: space_2 (8dp)
      
      children:
        - label:
            content: "{action_label}"
            
        - pro_badge:  # If feature is Pro-only
            type: badge
            content: "PRO"
            background: primary
            text_color: white
            font_size: text_xs
            padding: 2dp 6dp
            border_radius: radius_sm
            visible: !is_pro_user
```

### 2.7 Pro Upgrade Banner
```yaml
element: pro_banner
type: pressable_card
margin: space_4 (16dp)
padding: space_5 (20dp)
background: linear_gradient(135deg, primary, primary_light)
border_radius: radius_lg (12dp)
visible: !is_pro_user

children:
  - header_row:
      layout: flex_row
      align_items: center
      gap: space_2 (8dp)
      
      children:
        - star_icon:
            type: text
            content: "⭐"
            font_size: 24sp
            
        - title:
            type: text
            content: "Opgrader til Pro"
            style:
              font_size: text_lg (18sp)
              font_weight: font_bold
              color: white
              
  - features_list:
      margin_top: space_3 (12dp)
      
      children:
        - feature_row: "• Ubegrænset habits"
        - feature_row: "• CSV eksport"
        - feature_row: "• Alle badges"
      
      feature_style:
        font_size: text_sm (14sp)
        color: rgba(255,255,255,0.9)
        margin_bottom: space_1 (4dp)
        
  - price_row:
      margin_top: space_3 (12dp)
      
      children:
        - price_text:
            type: text
            content: "19 kr/md  •  149 kr engang"
            style:
              font_size: text_sm (14sp)
              font_weight: font_medium
              color: rgba(255,255,255,0.8)

on_tap: show_pro_upgrade_sheet
```

### 2.8 Footer
```yaml
element: footer
type: container
margin_top: space_8 (32dp)
margin_bottom: space_6 (24dp)
align_items: center

children:
  - links_row:
      layout: flex_row
      gap: space_4 (16dp)
      
      children:
        - about_link:
            type: TextButton
            text: "Om Stribe"
            style:
              font_size: text_sm (14sp)
              color: text_secondary
            on_tap: open_about
            
        - divider:
            type: text
            content: "•"
            color: text_tertiary
            
        - privacy_link:
            type: TextButton
            text: "Privatlivspolitik"
            style:
              font_size: text_sm (14sp)
              color: text_secondary
            on_tap: open_privacy_url
            
  - version:
      type: text
      content: "Version 1.0.0"
      style:
        font_size: text_xs (12sp)
        color: text_tertiary
      margin_top: space_2 (8dp)
```

---

## 3. SETTINGS OPTIONS

### 3.1 General Settings
```yaml
settings:
  day_start_time:
    label: "Dag starter kl."
    type: time_picker
    default: "04:00"
    description: "Vaner logges til den dag der startede på dette tidspunkt"
    
  week_start_day:
    label: "Ugen starter"
    type: picker
    options: ["Mandag", "Søndag"]
    default: "Mandag"
    
  language:
    label: "Sprog"
    type: picker
    options: ["Dansk", "English"]  # v2: add more
    default: "Dansk"
```

### 3.2 Notification Settings
```yaml
settings:
  reminders_enabled:
    label: "Påmindelser"
    type: toggle
    default: true
    on_disable: Cancel all scheduled notifications
    on_enable: Reschedule all habit notifications
    
  sound_enabled:
    label: "Lyd"
    type: toggle
    default: true
    affects: Notification sound
```

### 3.3 Data Settings
```yaml
settings:
  export_data:
    label: "Eksporter data (CSV)"
    type: action
    requires_pro: true
    action: generate_and_share_csv
    
  delete_all_data:
    label: "Slet alle data"
    type: destructive_action
    action: show_delete_confirmation
```

---

## 4. PICKER MODALS

### 4.1 Day Start Time Picker
```yaml
modal: day_start_picker
type: bottom_sheet
title: "Dag starter kl."

content:
  description: "Vaner logges til den dag der startede på dette tidspunkt. Nyttigt hvis du ofte er oppe efter midnat."
  
  time_picker:
    type: wheel_picker or time_picker
    values: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00"]
    selected: current_setting
    
  save_button:
    text: "Gem"
    on_tap: save_and_dismiss
```

### 4.2 Week Start Picker
```yaml
modal: week_start_picker
type: bottom_sheet
title: "Ugen starter"

content:
  options_list:
    - "Mandag" (selected indicator if current)
    - "Søndag"
    
  on_select: save_and_dismiss
```

---

## 5. DESTRUCTIVE ACTIONS

### 5.1 Delete All Data
```yaml
action: delete_all_data

confirmation_dialog:
  title: "Slet alle data?"
  message: "Dette sletter alle dine vaner, streaks og historik permanent. Denne handling kan ikke fortrydes."
  
  buttons:
    - text: "Annuller"
      style: secondary
      
    - text: "Slet alt"
      style: destructive
      
on_confirm:
  - DELETE FROM completions
  - DELETE FROM habits
  - DELETE FROM settings (except core)
  - Cancel all notifications
  - Navigate to empty home state
  - Show toast: "Alle data slettet"
```

---

## 6. PRO UPGRADE SHEET

```yaml
modal: pro_upgrade_sheet
type: bottom_sheet
height: auto

content:
  - header:
      icon: ⭐
      title: "Stribe Pro"
      subtitle: "Få det fulde udbytte"
      
  - features:
      - icon: ∞, text: "Ubegrænset antal vaner"
      - icon: 📊, text: "Eksporter data til CSV"
      - icon: 🏅, text: "Alle milestone badges"
      - icon: ❤️, text: "Støt udviklingen"
      
  - pricing_options:
      - monthly:
          price: "19 kr/md"
          button: "Start abonnement"
          
      - lifetime:
          price: "149 kr"
          badge: "Mest populær"
          button: "Køb for altid"
          
  - restore_link:
      text: "Gendan køb"
      on_tap: restore_purchases
      
  - legal_text:
      content: "Abonnement fornyes automatisk..."
      font_size: text_xs
      color: text_tertiary
```

---

## 7. INTERACTIONS

### 7.1 Navigation Row Tap
```yaml
interaction: tap_nav_row
on_tap:
  - Show appropriate picker/modal
  - Or navigate to sub-screen
```

### 7.2 Toggle Row Tap
```yaml
interaction: tap_toggle_row
on_tap:
  - Toggle the switch
  - Save setting immediately
  - Apply change (e.g., reschedule notifications)
```

### 7.3 Pro Banner Tap
```yaml
interaction: tap_pro_banner
on_tap:
  - Show pro_upgrade_sheet
```

### 7.4 Pro Feature Tap (when not Pro)
```yaml
interaction: tap_locked_feature
on_tap:
  - Show pro_upgrade_sheet
  - Highlight the relevant feature
```

---

## 8. ACCESSIBILITY

```yaml
screen_reader:
  announce_on_appear: "Indstillinger"
  
elements:
  - settings_row_nav:
      label: "{label}: {current_value}"
      hint: "Tryk for at ændre"
      
  - settings_row_toggle:
      label: "{label}"
      state: "slået til" | "slået fra"
      hint: "Tryk for at skifte"
      
  - pro_banner:
      label: "Opgrader til Stribe Pro. {features}. {price}"
      hint: "Tryk for at se muligheder"
```

---

## 9. TEST SCENARIOS

| Scenario | Expected |
|----------|----------|
| Tap back | Return to home |
| Change day start time | Show picker, save on select |
| Toggle reminders off | Cancel notifications, save |
| Tap export (not Pro) | Show Pro upgrade sheet |
| Tap delete all | Show confirmation |
| Confirm delete all | Delete data, return to empty home |
| Tap Pro banner | Show upgrade sheet |
| Complete purchase | Unlock features, dismiss sheet |

---

*Settings screen specification complete.*
