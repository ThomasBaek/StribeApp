# Stribe Design System
## Version 1.0 - December 2025

---

## 1. BRAND IDENTITY

### App Name
- **Navn:** Stribe
- **Tagline:** "Byg vaner der holder"
- **Tone:** Venlig, rolig, motiverende, skandinavisk minimalistisk

### Logo
- Simpelt planteikon 🌿 eller abstrakt streak-symbol
- Bruges i splash screen og navigation header

---

## 2. COLOR PALETTE

### Primary Colors
```
primary:          #2D5A4A    // Mørk skovgrøn - hovedfarve
primary_light:    #4A8B73    // Lys grøn - hover/active states
primary_dark:     #1E3D32    // Mørkere grøn - pressed states
```

### Secondary Colors (Habit Colors - bruger vælger)
```
habit_blue:       #5B8FB9    // Rolig blå
habit_green:      #7CB97B    // Frisk grøn
habit_yellow:     #E8C547    // Varm gul
habit_orange:     #E89B47    // Energisk orange
habit_red:        #D4736A    // Blød rød
habit_purple:     #9B7BB9    // Kreativ lilla
habit_pink:       #D4A5B9    // Blød pink
habit_teal:       #5BB9A7    // Havgrøn
habit_indigo:     #6B7BB9    // Dyb indigo
habit_brown:      #A68B6B    // Jordfarve
habit_gray:       #8B9A9A    // Neutral grå
habit_mint:       #7BC9B9    // Frisk mint
```

### Neutral Colors
```
background:       #FAFBFA    // Næsten hvid med grønt tint
surface:          #FFFFFF    // Ren hvid (cards)
surface_elevated: #FFFFFF    // Cards med shadow

text_primary:     #1A2421    // Næsten sort
text_secondary:   #5A6B65    // Grå-grøn
text_tertiary:    #8A9B95    // Lys grå-grøn
text_inverse:     #FFFFFF    // Hvid på mørk baggrund

border:           #E5EBE8    // Subtil grøn-grå
border_focus:     #2D5A4A    // Primary ved focus

divider:          #E5EBE8    // Samme som border
```

### Semantic Colors
```
success:          #4CAF7A    // Grøn - completed
success_bg:       #E8F5ED    // Lys grøn baggrund

warning:          #E8A847    // Orange - attention
warning_bg:       #FFF8E8    // Lys orange baggrund

error:            #D4736A    // Rød - fejl/missed
error_bg:         #FDEDED    // Lys rød baggrund

streak_fire:      #F5A623    // Orange-guld til 🔥
```

---

## 3. TYPOGRAPHY

### Font Family
```
font_family:      "SF Pro Display" (iOS) / "Roboto" (Android)
font_family_mono: "SF Mono" (iOS) / "Roboto Mono" (Android)
```

### Font Sizes
```
text_xs:          12sp    // Små labels
text_sm:          14sp    // Sekundær tekst
text_base:        16sp    // Body tekst (default)
text_lg:          18sp    // Større body
text_xl:          20sp    // Sektion headers
text_2xl:         24sp    // Skærm titler
text_3xl:         30sp    // Store tal (streak count)
text_4xl:         36sp    // Hero tal
text_5xl:         48sp    // Celebration tal
```

### Font Weights
```
font_normal:      400     // Regular tekst
font_medium:      500     // Mellemvægt
font_semibold:    600     // Semi-bold
font_bold:        700     // Overskrifter
```

### Line Heights
```
leading_tight:    1.2     // Overskrifter
leading_normal:   1.5     // Body tekst
leading_relaxed:  1.75    // Større tekst
```

### Text Styles (præ-definerede)
```yaml
headline_large:
  size: text_2xl (24sp)
  weight: font_bold
  color: text_primary
  
headline_medium:
  size: text_xl (20sp)
  weight: font_semibold
  color: text_primary

body_large:
  size: text_lg (18sp)
  weight: font_normal
  color: text_primary

body_medium:
  size: text_base (16sp)
  weight: font_normal
  color: text_primary

body_small:
  size: text_sm (14sp)
  weight: font_normal
  color: text_secondary

label:
  size: text_xs (12sp)
  weight: font_medium
  color: text_tertiary
  letter_spacing: 0.5sp
  text_transform: uppercase

streak_number:
  size: text_3xl (30sp)
  weight: font_bold
  color: streak_fire
```

---

## 4. SPACING SYSTEM

### Base Unit
```
base: 4dp (alle spacing er multipla af 4)
```

### Spacing Scale
```
space_0:    0dp
space_1:    4dp     // Minimal
space_2:    8dp     // Tight
space_3:    12dp    // Compact
space_4:    16dp    // Default
space_5:    20dp    // Comfortable
space_6:    24dp    // Relaxed
space_8:    32dp    // Large
space_10:   40dp    // Extra large
space_12:   48dp    // Section gaps
space_16:   64dp    // Major sections
space_20:   80dp    // Hero spacing
```

### Component Spacing
```
card_padding:           space_4 (16dp)
card_gap:               space_3 (12dp)
screen_padding:         space_4 (16dp)
section_gap:            space_6 (24dp)
button_padding_x:       space_6 (24dp)
button_padding_y:       space_3 (12dp)
input_padding:          space_4 (16dp)
list_item_gap:          space_3 (12dp)
icon_text_gap:          space_2 (8dp)
```

---

## 5. CORNER RADIUS

```
radius_none:    0dp
radius_sm:      4dp     // Små elementer
radius_md:      8dp     // Buttons, inputs
radius_lg:      12dp    // Cards
radius_xl:      16dp    // Modals
radius_2xl:     24dp    // Bottom sheets
radius_full:    9999dp  // Cirkulære elementer
```

---

## 6. SHADOWS & ELEVATION

```yaml
shadow_none:
  offset: 0, 0
  blur: 0
  color: transparent

shadow_sm:
  offset: 0, 1dp
  blur: 2dp
  color: rgba(0, 0, 0, 0.05)

shadow_md:
  offset: 0, 2dp
  blur: 4dp
  color: rgba(0, 0, 0, 0.08)

shadow_lg:
  offset: 0, 4dp
  blur: 12dp
  color: rgba(0, 0, 0, 0.12)

shadow_xl:
  offset: 0, 8dp
  blur: 24dp
  color: rgba(0, 0, 0, 0.16)
```

---

## 7. ICONOGRAPHY

### Icon Set
- Primær: **Fluent UI System Icons** (Microsoft) eller **SF Symbols** (iOS)
- Habit ikoner: Native emoji support

### Icon Sizes
```
icon_xs:    16dp    // Inline med tekst
icon_sm:    20dp    // Små actions
icon_md:    24dp    // Standard (default)
icon_lg:    32dp    // Fremhævede
icon_xl:    48dp    // Hero/feature icons
icon_2xl:   64dp    // Celebrations
```

### Habit Emoji Palette
```
Fitness:    🏃 🚴 🏋️ 🧘 🏊 ⚽ 🎾 🥊
Wellness:   💧 😴 💊 🧘 🌿 🍎 🥗 💪
Learning:   📚 ✍️ 🎸 🎨 💻 🧠 📝 🎯
Lifestyle:  🧹 💰 📱 ☀️ 🌙 🙏 😊 🎵
Social:     👋 💬 ❤️ 🤝 📞 ✉️ 👨‍👩‍👧 🎁
```

---

## 8. MOTION & ANIMATION

### Duration Scale
```
duration_instant:   0ms
duration_fast:      150ms   // Micro-interactions
duration_normal:    250ms   // Standard transitions
duration_slow:      400ms   // Emphasis animations
duration_slower:    600ms   // Major transitions
```

### Easing Curves
```
ease_default:       cubic-bezier(0.4, 0.0, 0.2, 1)    // Material standard
ease_in:            cubic-bezier(0.4, 0.0, 1, 1)      // Accelerate
ease_out:           cubic-bezier(0.0, 0.0, 0.2, 1)    // Decelerate
ease_bounce:        cubic-bezier(0.34, 1.56, 0.64, 1) // Overshoot
ease_spring:        spring(1, 100, 10, 0)             // Spring physics
```

### Animation Patterns
```yaml
# Tap feedback
tap_scale:
  duration: duration_fast (150ms)
  scale: 0.95 → 1.0
  easing: ease_out

# Checkmark appear
check_appear:
  duration: duration_normal (250ms)
  scale: 0 → 1.0 (med overshoot til 1.1)
  opacity: 0 → 1
  easing: ease_bounce

# Card press
card_press:
  duration: duration_fast (150ms)
  scale: 1.0 → 0.98
  shadow: shadow_md → shadow_sm
  easing: ease_out

# Konfetti burst
confetti_burst:
  duration: duration_slower (600ms)
  particle_count: 50
  spread: 360°
  gravity: 0.8
  
# Streak fire pulse
fire_pulse:
  duration: 1000ms
  scale: 1.0 → 1.05 → 1.0
  loop: infinite
  easing: ease_in_out

# Page transition
page_slide:
  duration: duration_slow (400ms)
  translate_x: 100% → 0%
  easing: ease_out
```

---

## 9. COMPONENT LIBRARY

### 9.1 Buttons

```yaml
PrimaryButton:
  height: 48dp
  padding_x: space_6 (24dp)
  background: primary
  text_color: text_inverse
  text_style: body_large + font_semibold
  border_radius: radius_md (8dp)
  states:
    default: { background: primary }
    pressed: { background: primary_dark, scale: 0.98 }
    disabled: { background: primary, opacity: 0.5 }

SecondaryButton:
  height: 48dp
  padding_x: space_6 (24dp)
  background: transparent
  border: 1.5dp solid primary
  text_color: primary
  text_style: body_large + font_semibold
  border_radius: radius_md (8dp)
  states:
    default: { background: transparent }
    pressed: { background: primary, opacity: 0.1 }
    disabled: { opacity: 0.5 }

TextButton:
  height: 40dp
  padding_x: space_4 (16dp)
  background: transparent
  text_color: primary
  text_style: body_medium + font_medium
  states:
    pressed: { opacity: 0.7 }

IconButton:
  size: 44dp (touch target)
  icon_size: icon_md (24dp)
  background: transparent
  icon_color: text_secondary
  border_radius: radius_full
  states:
    pressed: { background: rgba(0,0,0,0.05) }

FloatingActionButton:
  size: 56dp
  icon_size: icon_md (24dp)
  background: primary
  icon_color: text_inverse
  border_radius: radius_full
  shadow: shadow_lg
```

### 9.2 Input Fields

```yaml
TextField:
  height: 52dp
  padding: space_4 (16dp)
  background: surface
  border: 1dp solid border
  border_radius: radius_md (8dp)
  text_style: body_medium
  placeholder_color: text_tertiary
  states:
    focused: { border_color: border_focus, border_width: 2dp }
    error: { border_color: error }
```

### 9.3 Cards

```yaml
HabitCard:
  # Se separat fil: components/HABIT_CARD.md
  
SurfaceCard:
  padding: card_padding (16dp)
  background: surface
  border_radius: radius_lg (12dp)
  shadow: shadow_sm
```

### 9.4 Toggle/Switch

```yaml
Toggle:
  width: 52dp
  height: 32dp
  track_color_off: border
  track_color_on: success
  thumb_size: 28dp
  thumb_color: surface
  thumb_shadow: shadow_sm
  animation: duration_fast + ease_out
```

---

## 10. LAYOUT PATTERNS

### Safe Areas
```
status_bar_height: system (ca. 44dp iOS, 24dp Android)
navigation_bar_height: system
bottom_safe_area: system (ca. 34dp på phones med gesture bar)
```

### Screen Layout Template
```
┌─────────────────────────────────────┐
│          STATUS BAR (system)        │
├─────────────────────────────────────┤
│  ← Title                     [⚙️]  │  ← Header (56dp)
├─────────────────────────────────────┤
│                                     │
│                                     │
│         SCROLLABLE CONTENT          │  ← padding: 16dp
│                                     │
│                                     │
├─────────────────────────────────────┤
│         BOTTOM SAFE AREA            │
└─────────────────────────────────────┘
```

### Header Variants
```yaml
header_simple:
  height: 56dp
  background: background
  title: centered, headline_medium
  
header_with_back:
  height: 56dp
  left: back_arrow (IconButton)
  center: title (headline_medium)
  right: optional actions

header_large:
  height: 96dp
  title: left-aligned, headline_large
  subtitle: optional, body_small
```

---

## 11. ACCESSIBILITY

### Touch Targets
- Minimum: 44dp × 44dp
- Recommended: 48dp × 48dp

### Color Contrast
- Normal text: minimum 4.5:1
- Large text: minimum 3:1
- Interactive elements: minimum 3:1

### Motion
- Respect "Reduce Motion" system setting
- Provide alternative static states

### Screen Reader
- Alle interaktive elementer skal have labels
- Streak: "Streak på 14 dage"
- Habit card: "Motion, 14 dages streak, ikke færdig i dag"

---

## 12. PLATFORM SPECIFICS

### iOS
- Brug SF Pro font
- SF Symbols for system icons
- Native iOS switches
- Swipe-to-go-back gesture
- Haptic feedback på check

### Android
- Brug Roboto font
- Material icons
- Material switches
- System back button support
- Vibration feedback på check

---

## CHANGELOG

| Version | Dato | Ændringer |
|---------|------|-----------|
| 1.0 | 2025-12-23 | Initial design system |

---

*Dette dokument er source of truth for alle visuelle beslutninger i Stribe.*
