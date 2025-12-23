# 01 - Splash Screen
## Stribe UX Specification

---

## SCREEN INFO

| Property | Value |
|----------|-------|
| **Screen ID** | 01_SPLASH |
| **Name** | Splash Screen |
| **Type** | Launch Screen |
| **Previous** | App launch |
| **Next** | 02_WELCOME (first time) eller 05_HOME (returning) |

---

## PURPOSE

Vises kort ved app start. Giver branding-moment og tid til at indlæse data fra SQLite.

---

## VISUAL LAYOUT

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│              🌿                     │
│                                     │
│            Stribe                   │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

---

## ELEMENTS

### 1. Background
```yaml
id: background
type: View
properties:
  background_color: "#2D5A4A"  # primary
  width: 100%
  height: 100%
```

### 2. App Icon
```yaml
id: app_icon
type: Image
properties:
  source: "icon_splash.png"  # eller emoji 🌿
  width: 80dp
  height: 80dp
  tint_color: "#FFFFFF"
position:
  horizontal: center
  vertical: center
  offset_y: -40dp  # lidt over center
```

### 3. App Name
```yaml
id: app_name
type: Label
properties:
  text: "Stribe"
  font_size: 32sp
  font_weight: bold
  text_color: "#FFFFFF"
  text_align: center
position:
  horizontal: center
  below: app_icon
  margin_top: 16dp
```

---

## ANIMATIONS

### Entry Animation
```yaml
animation_sequence:
  - step: 1
    target: app_icon
    type: scale_fade_in
    from: { scale: 0.5, opacity: 0 }
    to: { scale: 1.0, opacity: 1 }
    duration: 400ms
    easing: ease_out
    delay: 200ms

  - step: 2
    target: app_name
    type: fade_in_up
    from: { opacity: 0, translate_y: 20dp }
    to: { opacity: 1, translate_y: 0 }
    duration: 300ms
    easing: ease_out
    delay: 400ms
```

### Exit Animation
```yaml
exit_animation:
  target: entire_screen
  type: fade_out
  duration: 300ms
  easing: ease_in
  trigger: after 1500ms total display time
```

---

## BEHAVIOR

```yaml
on_appear:
  1. Start entry animations
  2. Load settings from SQLite
  3. Check has_completed_onboarding
  
after_delay: 1500ms
  if: has_completed_onboarding == true
    navigate_to: 05_HOME
  else:
    navigate_to: 02_WELCOME
```

---

## ASSETS NEEDED

| Asset | Size | Notes |
|-------|------|-------|
| icon_splash.png | 80dp | Hvid app icon |

---

*Fil: screens/01_SPLASH.md*
