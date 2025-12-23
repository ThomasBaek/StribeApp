# 10 - Milestone Celebration
## Stribe UX Specification

---

## SCREEN METADATA

| Property | Value |
|----------|-------|
| Screen ID | `10_MILESTONE_CELEBRATION` |
| Screen Name | Milestone Celebration |
| Type | Modal Overlay |
| Entry Point | Auto-trigger når habit når milestone |
| Exit Point | → Home (efter dismiss) |
| Milestones | 7, 21, 30, 60, 90, 365 dage |

---

## SCREEN PURPOSE

Modal der fejrer brugerens milestone. Vises automatisk når en habit når et milestone antal dage. Skaber dopamin-boost og motivation til at fortsætte.

---

## VISUAL LAYOUT

```
┌─────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ ← Dimmed background
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓┌─────────────────────────────┐▓▓▓│
│▓▓▓│                             │▓▓▓│
│▓▓▓│      🎉 ✨ 🎊              │▓▓▓│ ← Animated emojis
│▓▓▓│                             │▓▓▓│
│▓▓▓│          🏅                 │▓▓▓│ ← Badge icon
│▓▓▓│                             │▓▓▓│
│▓▓▓│        21 DAGE              │▓▓▓│ ← Big number
│▓▓▓│                             │▓▓▓│
│▓▓▓│        🧘 Motion            │▓▓▓│ ← Habit icon + name
│▓▓▓│                             │▓▓▓│
│▓▓▓│   "Tre uger! Du har         │▓▓▓│ ← Motivational text
│▓▓▓│   skabt en ny vane!"        │▓▓▓│
│▓▓▓│                             │▓▓▓│
│▓▓▓│  ┌───────┐  ┌────────────┐  │▓▓▓│
│▓▓▓│  │ Del 📤│  │ Fortsæt →  │  │▓▓▓│ ← Action buttons
│▓▓▓│  └───────┘  └────────────┘  │▓▓▓│
│▓▓▓│                             │▓▓▓│
│▓▓▓└─────────────────────────────┘▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└─────────────────────────────────────┘

+ Konfetti animation over hele skærmen
```

---

## ELEMENT SPECIFICATIONS

### Background Overlay
```yaml
id: overlay_background
type: View
properties:
  background_color: rgba(0, 0, 0, 0.6)
  position: full_screen
  z_index: 100
behavior:
  on_tap: dismiss_modal  # Tap udenfor = luk
```

### Modal Card
```yaml
id: celebration_card
type: Card
properties:
  background_color: surface (#FFFFFF)
  border_radius: 24dp
  padding: 32dp
  width: screen_width - 48dp  # 24dp margin på hver side
  max_width: 340dp
  position:
    center_horizontal: true
    center_vertical: true
  shadow: shadow_xl
```

### Confetti Layer
```yaml
id: confetti_layer
type: ConfettiView
properties:
  position: full_screen
  z_index: 150  # Over modal
  particle_count: 100
  colors: 
    - "#F5A623"  # Guld
    - "#4CAF7A"  # Grøn
    - "#5B8FB9"  # Blå
    - "#E89B47"  # Orange
    - "#9B7BB9"  # Lilla
  spread: 360
  gravity: 0.8
  initial_velocity: 30
  decay: 0.95
```

### Celebration Emojis
```yaml
id: celebration_emojis
type: Text
properties:
  text: "🎉 ✨ 🎊"
  font_size: 32sp
  text_align: center
  margin_bottom: 16dp
```

### Badge Icon
```yaml
id: badge_icon
type: Text  # Emoji
properties:
  text: dynamic  # Varies by milestone
  font_size: 64sp
  text_align: center
  margin_bottom: 8dp
  
# Badge variants:
# 7 dage:   "🥉" (bronze)
# 21 dage:  "🥈" (sølv)
# 30 dage:  "🥇" (guld)
# 60 dage:  "🏆" (trofæ)
# 90 dage:  "💎" (diamant)
# 365 dage: "👑" (krone)
```

### Milestone Number
```yaml
id: milestone_number
type: Text
properties:
  text: "{days} DAGE"  # Dynamic: "21 DAGE"
  font_size: 36sp
  font_weight: bold (700)
  color: text_primary (#1A2421)
  text_align: center
  margin_bottom: 8dp
```

### Habit Info
```yaml
id: habit_info
type: Row
properties:
  alignment: center
  gap: 8dp
  margin_bottom: 24dp
  
children:
  - type: Text
    id: habit_emoji
    properties:
      text: "{habit.icon}"  # Dynamic: "🧘"
      font_size: 24sp
      
  - type: Text
    id: habit_name
    properties:
      text: "{habit.name}"  # Dynamic: "Meditation"
      font_size: 18sp
      font_weight: medium (500)
      color: text_secondary (#5A6B65)
```

### Motivational Text
```yaml
id: motivation_text
type: Text
properties:
  text: dynamic  # Varies by milestone
  font_size: 16sp
  font_weight: normal (400)
  color: text_secondary (#5A6B65)
  text_align: center
  line_height: 1.5
  margin_bottom: 32dp
  
# Text variants:
# 7 dage:   "Én uge! Du er godt på vej. Bliv ved!"
# 21 dage:  "Tre uger! Du har officielt skabt en ny vane."
# 30 dage:  "En hel måned! Din dedikation er imponerende."
# 60 dage:  "To måneder! Denne vane er en del af dig nu."
# 90 dage:  "Tre måneder! Du er en mester i vedholdenhed."
# 365 dage: "ET HELT ÅR! Du er absolut fantastisk! 🌟"
```

### Button Row
```yaml
id: button_row
type: Row
properties:
  gap: 12dp
  alignment: center
  
children:
  - id: share_button
    type: SecondaryButton
    properties:
      text: "Del 📤"
      height: 48dp
      padding_x: 20dp
      flex: 1
    behavior:
      on_tap: open_share_sheet
      
  - id: continue_button
    type: PrimaryButton
    properties:
      text: "Fortsæt →"
      height: 48dp
      padding_x: 24dp
      flex: 1.5
    behavior:
      on_tap: dismiss_modal
```

---

## ANIMATIONS

### Modal Entry Animation
```yaml
animation_name: modal_entry
trigger: on_screen_appear
sequence:
  # Step 1: Background fade in
  - target: overlay_background
    type: fade
    properties:
      opacity: 0 → 0.6
      duration: 200ms
      easing: ease_out
      
  # Step 2: Card scale + fade (with bounce)
  - target: celebration_card
    type: scale + fade
    properties:
      opacity: 0 → 1
      scale: 0.8 → 1.05 → 1.0
      duration: 500ms
      delay: 100ms
      easing: ease_bounce
      
  # Step 3: Badge bounce in
  - target: badge_icon
    type: scale + rotate
    properties:
      scale: 0 → 1.2 → 1.0
      rotate: -10deg → 10deg → 0deg
      duration: 600ms
      delay: 300ms
      easing: ease_bounce
      
  # Step 4: Confetti burst
  - target: confetti_layer
    type: confetti_start
    properties:
      delay: 400ms
      duration: 3000ms  # Confetti falder i 3 sek
```

### Badge Pulse Animation (Continuous)
```yaml
animation_name: badge_pulse
trigger: after_entry_complete
target: badge_icon
type: scale
properties:
  scale: 1.0 → 1.08 → 1.0
  duration: 1500ms
  easing: ease_in_out
  loop: infinite
```

### Emoji Float Animation (Continuous)
```yaml
animation_name: emoji_float
trigger: after_entry_complete
target: celebration_emojis
type: translate_y
properties:
  translate_y: 0 → -8dp → 0
  duration: 2000ms
  easing: ease_in_out
  loop: infinite
```

### Button Tap Animations
```yaml
share_button_tap:
  type: scale
  properties:
    scale: 1.0 → 0.95 → 1.0
    duration: 150ms
    easing: ease_out

continue_button_tap:
  type: scale
  properties:
    scale: 1.0 → 0.95 → 1.0
    duration: 150ms
    easing: ease_out
```

### Modal Exit Animation
```yaml
animation_name: modal_exit
trigger: on_dismiss
sequence:
  - target: confetti_layer
    type: fade
    properties:
      opacity: 1 → 0
      duration: 200ms
      
  - target: celebration_card
    type: scale + fade
    properties:
      opacity: 1 → 0
      scale: 1.0 → 0.9
      duration: 250ms
      easing: ease_in
      
  - target: overlay_background
    type: fade
    properties:
      opacity: 0.6 → 0
      duration: 200ms
      delay: 100ms
```

---

## LOGIC & BEHAVIOR

### Trigger Conditions
```yaml
show_milestone_celebration:
  trigger: after_habit_completion
  conditions:
    - habit.current_streak IN [7, 21, 30, 60, 90, 365]
    - NOT already_shown_for_this_streak  # Vis kun én gang per milestone
    
  data_to_pass:
    - habit.id
    - habit.name
    - habit.icon
    - habit.current_streak
    - milestone_type  # "7", "21", etc.
```

### On Screen Load
```yaml
on_load:
  - action: play_haptic_feedback
    type: success  # iOS: .success, Android: EFFECT_HEAVY_CLICK
    
  - action: play_sound
    sound: "celebration_chime.mp3"
    volume: 0.7
    
  - action: start_entry_animation
  
  - action: mark_milestone_shown
    logic: |
      await Database.saveMilestoneShown(habit.id, milestone)
```

### Share Button Action
```yaml
on_share_tap:
  - action: generate_share_image
    content:
      text: "Jeg har gjort {habit.name} i {days} dage i træk! 🔥"
      app_mention: "#Stribe"
      
  - action: open_system_share_sheet
    content_type: text + image
```

### Continue Button Action
```yaml
on_continue_tap:
  - action: play_exit_animation
  - action: dismiss_modal
  - action: return_to_home
```

### Background Tap Action
```yaml
on_background_tap:
  - action: play_exit_animation
  - action: dismiss_modal
```

---

## MILESTONE CONTENT TABLE

| Milestone | Badge | Title | Message |
|-----------|-------|-------|---------|
| 7 | 🥉 | 7 DAGE | "Én uge! Du er godt på vej. Bliv ved!" |
| 21 | 🥈 | 21 DAGE | "Tre uger! Du har officielt skabt en ny vane." |
| 30 | 🥇 | 30 DAGE | "En hel måned! Din dedikation er imponerende." |
| 60 | 🏆 | 60 DAGE | "To måneder! Denne vane er en del af dig nu." |
| 90 | 💎 | 90 DAGE | "Tre måneder! Du er en mester i vedholdenhed." |
| 365 | 👑 | 365 DAGE | "ET HELT ÅR! Du er absolut fantastisk! 🌟" |

---

## HAPTIC & SOUND

```yaml
haptic_feedback:
  trigger: on_modal_appear
  ios: UIImpactFeedbackGenerator.impactOccurred(.heavy)
  android: VibrationEffect.createOneShot(100, EFFECT_HEAVY_CLICK)

sound_effect:
  trigger: on_modal_appear
  file: "celebration_chime.mp3"
  duration: ~1.5s
  fallback: system_notification_sound
```

---

## ACCESSIBILITY

```yaml
accessibility:
  - element: celebration_card
    role: dialog
    label: "Milestone fejring"
    
  - element: badge_icon
    role: image
    label: "{milestone} dages badge"
    
  - element: milestone_number
    role: heading
    label: "{days} dages streak"
    
  - element: motivation_text
    role: text
    
  - element: share_button
    role: button
    label: "Del din præstation"
    
  - element: continue_button
    role: button
    label: "Fortsæt"
    
  - screen_reader:
    announcement_on_appear: |
      "Tillykke! Du har nået {days} dages streak med {habit.name}. 
      {motivation_text}"
      
  - reduce_motion:
    if_enabled:
      - disable: confetti_layer
      - disable: emoji_float
      - disable: badge_pulse
      - simplify: modal_entry to simple fade
```

---

## PREMIUM GATING

```yaml
premium_check:
  milestones_in_free: [7, 21]  # Kun 7 og 21 dage i gratis
  milestones_in_pro: [7, 21, 30, 60, 90, 365]  # Alle i Pro
  
  if_milestone_not_available:
    action: show_upgrade_prompt_instead
    message: "Opgrader til Pro for at fejre alle milestones!"
```

---

## ASSETS NEEDED

| Asset | Filename | Format | Notes |
|-------|----------|--------|-------|
| Celebration sound | `celebration_chime.mp3` | MP3 | ~1.5s, uplifting chime |
| Confetti config | (code-based) | - | Use library like ConfettiView |

---

## TEST CASES

| Test | Expected Result |
|------|-----------------|
| Reach 7-day streak | Modal appears with 🥉 badge |
| Reach 21-day streak | Modal appears with 🥈 badge |
| Reach 30-day streak (free user) | Upgrade prompt instead |
| Reach 30-day streak (Pro user) | Modal appears with 🥇 badge |
| Tap "Fortsæt" | Modal dismisses, return to Home |
| Tap "Del" | System share sheet opens |
| Tap outside modal | Modal dismisses |
| Sound plays | Chime sound on appear |
| Haptic feedback | Device vibrates on appear |
| Confetti animation | Particles fall for 3 seconds |
| Reduce motion enabled | No confetti, simple fade |

---

## IMPLEMENTATION NOTES

### Confetti Library Recommendations
- **iOS:** SPConfetti or ConfettiSwiftUI
- **Android:** Konfetti library
- **.NET MAUI:** Custom SkiaSharp implementation or port

### Sound Implementation
```csharp
// .NET MAUI pseudo-code
var player = AudioManager.CreatePlayer("celebration_chime.mp3");
player.Volume = 0.7;
player.Play();
```

---

*Sidste skærm i serien. Se NAVIGATION.md for komplet flow.*
