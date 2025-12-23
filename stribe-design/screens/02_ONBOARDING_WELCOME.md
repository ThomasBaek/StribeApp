# 02 - Onboarding: Welcome
## Stribe UX Specification

---

## SCREEN METADATA
```yaml
screen_id: 02_ONBOARDING_WELCOME
screen_name: Welcome Screen
screen_type: Onboarding
previous_screen: 01_SPLASH
next_screen: 03_ONBOARDING_HABITS
flow_position: 1 of 3
```

---

## 1. VISUAL LAYOUT

```
┌─────────────────────────────────────┐
│            STATUS BAR               │
├─────────────────────────────────────┤
│                                     │
│                                     │
│                                     │
│                                     │
│              🌿                     │  ← Logo (80dp)
│                                     │
│            Stribe                   │  ← App name (30sp)
│                                     │
│    "Byg vaner der holder"           │  ← Tagline (18sp)
│                                     │
│                                     │
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │       Kom i gang →          │   │  ← Primary Button
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│      Ingen konto nødvendig          │  ← Privacy note (14sp)
│                                     │
│              • ○ ○                  │  ← Page indicator
│                                     │
│          SAFE AREA                  │
└─────────────────────────────────────┘
```

---

## 2. ELEMENT SPECIFICATIONS

### 2.1 Container
```yaml
element: screen_container
type: safe_area_view
background: background (#FAFBFA)
padding: 
  horizontal: space_6 (24dp)
  top: space_16 (64dp)
  bottom: space_8 (32dp)
layout: flex_column
justify_content: space_between
```

### 2.2 Logo Section
```yaml
element: logo_section
type: container
layout: flex_column
align_items: center
gap: space_4 (16dp)
position: top_third of screen

children:
  - logo_icon:
      type: image | emoji
      content: 🌿
      size: 80dp × 80dp
      color: primary (#2D5A4A)
      
  - app_name:
      type: text
      content: "Stribe"
      style:
        font_size: text_3xl (30sp)
        font_weight: font_bold
        color: text_primary (#1A2421)
        letter_spacing: 1sp
        
  - tagline:
      type: text
      content: "Byg vaner der holder"
      style:
        font_size: text_lg (18sp)
        font_weight: font_normal
        color: text_secondary (#5A6B65)
      margin_top: space_2 (8dp)
```

### 2.3 CTA Section
```yaml
element: cta_section
type: container
layout: flex_column
align_items: center
gap: space_4 (16dp)
position: bottom

children:
  - primary_button:
      type: PrimaryButton
      text: "Kom i gang"
      icon_right: arrow_right (→)
      width: 100%
      height: 52dp
      on_tap: navigate_to_next
      
  - privacy_note:
      type: text
      content: "Ingen konto nødvendig"
      style:
        font_size: text_sm (14sp)
        font_weight: font_normal
        color: text_tertiary (#8A9B95)
      icon_left: lock_outline (12dp, same color)
      gap: space_1 (4dp)
```

### 2.4 Page Indicator
```yaml
element: page_indicator
type: dot_indicator
total_dots: 3
active_dot: 1
position:
  horizontal: center
  bottom: space_6 (24dp) from safe area

dot_style:
  active:
    size: 8dp
    color: primary (#2D5A4A)
    shape: circle
  inactive:
    size: 8dp
    color: border (#E5EBE8)
    shape: circle
gap: space_2 (8dp)
```

---

## 3. STATES

### 3.1 Default State
```yaml
state: default
description: Standard visning ved entry
all_elements: visible, interactive
button_state: enabled
```

### 3.2 Button Pressed State
```yaml
state: button_pressed
trigger: on_press_down
changes:
  - primary_button:
      background: primary_dark (#1E3D32)
      scale: 0.98
duration: while_pressed
```

---

## 4. INTERACTIONS

### 4.1 Primary Button Tap
```yaml
interaction: tap_kom_i_gang
element: primary_button
gesture: tap

on_tap:
  - Play haptic feedback (light)
  - Animate button press
  - Navigate to: 03_ONBOARDING_HABITS
  - Transition: slide_left (400ms)
```

### 4.2 Swipe Gesture
```yaml
interaction: swipe_to_next
gesture: swipe_left
threshold: 50dp
on_complete:
  - Navigate to: 03_ONBOARDING_HABITS
  - Transition: slide_left (400ms)
```

---

## 5. ANIMATIONS

### 5.1 Entry Animation
```yaml
animation: welcome_entry
trigger: screen_appear
sequence:
  - step_1:
      element: logo_icon
      properties:
        - opacity: 0 → 1
        - scale: 0.8 → 1.0
        - translateY: -20dp → 0dp
      duration: 500ms
      delay: 0ms
      easing: ease_out
      
  - step_2:
      element: app_name
      properties:
        - opacity: 0 → 1
        - translateY: 10dp → 0dp
      duration: 400ms
      delay: 200ms
      easing: ease_out
      
  - step_3:
      element: tagline
      properties:
        - opacity: 0 → 1
      duration: 400ms
      delay: 350ms
      easing: ease_out
      
  - step_4:
      element: primary_button
      properties:
        - opacity: 0 → 1
        - translateY: 20dp → 0dp
      duration: 400ms
      delay: 500ms
      easing: ease_out
      
  - step_5:
      element: [privacy_note, page_indicator]
      properties:
        - opacity: 0 → 1
      duration: 300ms
      delay: 600ms
      easing: ease_out
```

### 5.2 Exit Animation
```yaml
animation: welcome_exit
trigger: navigate_to_next
type: slide_left
duration: 400ms
easing: ease_out
```

### 5.3 Button Hover/Press Animation
```yaml
animation: button_press
trigger: on_press
properties:
  - scale: 1.0 → 0.98
  - background: primary → primary_dark
duration: 150ms
easing: ease_out

animation: button_release
trigger: on_release
properties:
  - scale: 0.98 → 1.0
  - background: primary_dark → primary
duration: 150ms
easing: ease_out
```

---

## 6. BEHAVIOR & LOGIC

### 6.1 Skip Logic
```yaml
# Denne skærm vises KUN hvis onboarding ikke er completed
on_mount:
  - Check: settings.onboarding_completed
  - If true: Skip directly to 05_HOME
  - If false: Show this screen
```

### 6.2 Analytics Events
```yaml
events:
  - screen_view: "onboarding_welcome"
  - button_tap: "onboarding_start"
```

---

## 7. RESPONSIVE BEHAVIOR

### 7.1 Small Screens (< 360dp width)
```yaml
adjustments:
  - logo_icon.size: 64dp
  - app_name.font_size: text_2xl (24sp)
  - tagline.font_size: text_base (16sp)
  - Reduce top padding
```

### 7.2 Large Screens (tablets)
```yaml
adjustments:
  - Max content width: 400dp
  - Center content horizontally
  - Increase logo size to 96dp
```

---

## 8. ACCESSIBILITY

```yaml
screen_reader:
  announce_on_appear: "Velkommen til Stribe. Byg vaner der holder."
  
elements:
  - primary_button:
      label: "Kom i gang med Stribe"
      hint: "Tryk for at starte opsætning"
      
  - privacy_note:
      label: "Ingen konto nødvendig. Dine data gemmes kun på din enhed."
      
  - page_indicator:
      label: "Side 1 af 3"

focus_order: [logo_section, primary_button, privacy_note, page_indicator]

reduce_motion:
  if_enabled: Disable entry animations, show all elements immediately
```

---

## 9. COPY/TEKST

| Element | Dansk | Engelsk (v2) |
|---------|-------|--------------|
| tagline | Byg vaner der holder | Build habits that last |
| button | Kom i gang | Get started |
| privacy | Ingen konto nødvendig | No account needed |

---

## 10. ASSETS NEEDED

| Asset | Type | Notes |
|-------|------|-------|
| logo_icon | SVG | Primary color version |
| arrow_right | Icon | 20dp, for button |
| lock_outline | Icon | 12dp, for privacy note |

---

## 11. TEST SCENARIOS

| Scenario | Expected |
|----------|----------|
| First launch | Show welcome screen with animations |
| Tap button | Navigate to habit selection |
| Swipe left | Navigate to habit selection |
| Swipe right | Nothing (first screen) |
| Return from next screen | Show without entry animation |

---

*Welcome screen specification complete.*
