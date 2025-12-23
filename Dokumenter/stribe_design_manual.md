# Stribe - UX Design Specification
## Version 1.0 | December 2025

Dette dokument indeholder detaljerede UX specifikationer for hver skÃ¦rm i Stribe appen. 
Dokumentet er designet til at kunne lÃ¦ses af Claude Code for prÃ¦cis implementering.

---

# SKÃ†RM 1: Onboarding - Velkomst

## SkÃ¦rm ID
`onboarding_welcome`

## FormÃ¥l
FÃ¸rste skÃ¦rm brugeren ser. Skal kommunikere app'ens vÃ¦rdi hurtigt og invitere til at komme i gang uden konto.

## Layout Struktur

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                         â”‚
â”‚              [STATUS BAR]               â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚                                         â”‚
â”‚            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”              â”‚
â”‚            â”‚             â”‚              â”‚
â”‚            â”‚   ðŸŒ¿ LOGO   â”‚              â”‚
â”‚            â”‚             â”‚              â”‚
â”‚            â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜              â”‚
â”‚                                         â”‚
â”‚              "Stribe"                   â”‚
â”‚           [APP TITLE]                   â”‚
â”‚                                         â”‚
â”‚                                         â”‚
â”‚      "Byg vaner der holder"             â”‚
â”‚           [TAGLINE]                     â”‚
â”‚                                         â”‚
â”‚                                         â”‚
â”‚                                         â”‚
â”‚    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”‚
â”‚    â”‚                             â”‚      â”‚
â”‚    â”‚      Kom i gang â†’          â”‚      â”‚
â”‚    â”‚                             â”‚      â”‚
â”‚    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜      â”‚
â”‚           [PRIMARY CTA]                 â”‚
â”‚                                         â”‚
â”‚      "Ingen konto nÃ¸dvendig"            â”‚
â”‚         [TRUST SIGNAL]                  â”‚
â”‚                                         â”‚
â”‚                                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Elementer

### 1. Logo
- **Type:** Statisk billede eller Lottie animation
- **Placering:** Centreret, Ã¸verste tredjedel af skÃ¦rmen
- **StÃ¸rrelse:** 120x120 dp
- **Asset:** `logo_stribe.svg` eller `logo_stribe.json` (Lottie)
- **Animation ved load:** Fade in + subtle scale (0.8 â†’ 1.0) over 600ms med ease-out

### 2. App Titel
- **Type:** Text
- **Indhold:** "Stribe"
- **Font:** Primary font, Bold, 32sp
- **Farve:** `$color-text-primary` (#1A1A2E)
- **Margin top:** 16dp under logo
- **Animation:** Fade in 200ms efter logo animation

### 3. Tagline
- **Type:** Text
- **Indhold:** "Byg vaner der holder"
- **Font:** Primary font, Regular, 18sp
- **Farve:** `$color-text-secondary` (#4A4A68)
- **Margin top:** 8dp under titel
- **Animation:** Fade in 100ms efter titel

### 4. Primary CTA Button
- **Type:** Filled Button
- **Indhold:** "Kom i gang â†’"
- **StÃ¸rrelse:** Full width med 24dp horizontal margin, 56dp hÃ¸j
- **Baggrundsfarve:** `$color-primary` (#2D5A27)
- **Tekstfarve:** `$color-white` (#FFFFFF)
- **Font:** Primary font, SemiBold, 16sp
- **Border radius:** 12dp
- **Placering:** 80dp fra bunden
- **Animation ved load:** Slide up + fade in fra 20dp nedefra, 400ms delay
- **Animation ved tap:** 
  - Scale til 0.98 pÃ¥ press
  - Ripple effect
  - Scale tilbage til 1.0 pÃ¥ release

### 5. Trust Signal Text
- **Type:** Text
- **Indhold:** "Ingen konto nÃ¸dvendig"
- **Font:** Primary font, Regular, 14sp
- **Farve:** `$color-text-tertiary` (#8A8AA3)
- **Margin top:** 16dp under CTA
- **Ikon (valgfrit):** Lille checkmark ikon fÃ¸r tekst

## Interaktioner

| Element | Gesture | Handling |
|---------|---------|----------|
| Primary CTA | Tap | Navigate til `onboarding_habit_select` |
| Hele skÃ¦rmen | Swipe left | Navigate til `onboarding_habit_select` |

## Farvepalette (Skandinavisk)

```
$color-primary:         #2D5A27  (Skov grÃ¸n)
$color-primary-light:   #4A7C43
$color-background:      #FAFAF8  (Varm hvid)
$color-surface:         #FFFFFF
$color-text-primary:    #1A1A2E
$color-text-secondary:  #4A4A68
$color-text-tertiary:   #8A8AA3
```

## Animationer Timing

```yaml
page_enter:
  - logo: fade_in + scale(0.8â†’1.0), duration: 600ms, easing: ease-out
  - title: fade_in, delay: 200ms, duration: 300ms
  - tagline: fade_in, delay: 300ms, duration: 300ms  
  - cta_button: slide_up(20dp) + fade_in, delay: 400ms, duration: 400ms
  - trust_text: fade_in, delay: 600ms, duration: 300ms
```

## Accessibility

- Logo: `contentDescription = "Stribe logo"`
- CTA: `accessibilityLabel = "Kom i gang med at tracke dine vaner"`
- Minimum touch target: 48x48dp

## Edge Cases

- **Returnerende bruger:** Hvis bruger allerede har habits, skip direkte til `home_screen`
- **Meget lille skÃ¦rm:** Reducer logo til 80x80dp, mindre margins

## Implementerings Noter

```csharp
// Check for existing habits on app start
if (await _habitService.HasHabitsAsync())
{
    await Shell.Current.GoToAsync("//home");
}
else
{
    await Shell.Current.GoToAsync("//onboarding/welcome");
}
```

---

# SKÃ†RM 2: Onboarding - Habit Selection

## SkÃ¦rm ID
`onboarding_habit_select`

## FormÃ¥l
Lad brugeren vÃ¦lge 1-3 starter-habits fra predefinerede forslag eller oprette egen. Reducerer friktion ved at give nemme valg.

## Layout Struktur

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚              [STATUS BAR]               â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  â†                              1/3     â”‚
â”‚  [BACK]                    [PROGRESS]   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   "Hvad vil du gÃ¸re hver dag?"          â”‚
â”‚            [HEADLINE]                   â”‚
â”‚                                         â”‚
â”‚   "VÃ¦lg 1-3 for at starte"              â”‚
â”‚            [SUBTEXT]                    â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”            â”‚
â”‚  â”‚    ðŸƒ    â”‚  â”‚    ðŸ“š    â”‚            â”‚
â”‚  â”‚  Motion  â”‚  â”‚   LÃ¦se   â”‚            â”‚
â”‚  â”‚  [ ]     â”‚  â”‚  [âœ“]     â”‚            â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜            â”‚
â”‚                                         â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”            â”‚
â”‚  â”‚    ðŸ§˜    â”‚  â”‚    ðŸ’§    â”‚            â”‚
â”‚  â”‚ Mediter  â”‚  â”‚   Vand   â”‚            â”‚
â”‚  â”‚  [ ]     â”‚  â”‚  [ ]     â”‚            â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜            â”‚
â”‚                                         â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”            â”‚
â”‚  â”‚    ðŸ“    â”‚  â”‚    âž•    â”‚            â”‚
â”‚  â”‚ Journal  â”‚  â”‚   Egen   â”‚            â”‚
â”‚  â”‚  [ ]     â”‚  â”‚          â”‚            â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜            â”‚
â”‚       [HABIT GRID]                      â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”‚
â”‚    â”‚       FortsÃ¦t â†’            â”‚      â”‚
â”‚    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜      â”‚
â”‚           [PRIMARY CTA]                 â”‚
â”‚                                         â”‚
â”‚    "Du kan altid tilfÃ¸je flere"         â”‚
â”‚         [HELPER TEXT]                   â”‚
â”‚                                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Elementer

### 1. Navigation Header
- **Back button:** 
  - Ikon: `arrow_left` eller `chevron_left`
  - StÃ¸rrelse: 24x24dp, touch target 48x48dp
  - Farve: `$color-text-primary`
  - Tap: Navigate tilbage til `onboarding_welcome`
- **Progress indicator:**
  - Text: "1/3"
  - Font: Primary, Regular, 14sp
  - Farve: `$color-text-secondary`

### 2. Headline
- **Type:** Text
- **Indhold:** "Hvad vil du gÃ¸re hver dag?"
- **Font:** Primary font, SemiBold, 24sp
- **Farve:** `$color-text-primary`
- **Alignment:** Left
- **Margin:** 24dp horizontal, 24dp top

### 3. Subtext
- **Type:** Text
- **Indhold:** "VÃ¦lg 1-3 for at starte"
- **Font:** Primary font, Regular, 16sp
- **Farve:** `$color-text-secondary`
- **Margin top:** 8dp

### 4. Habit Grid
- **Type:** 2-column grid
- **Gap:** 12dp mellem items
- **Horizontal padding:** 24dp

### 5. Habit Card (Predefineret)
- **StÃ¸rrelse:** (screen_width - 24*2 - 12) / 2 = ~160dp bred, 100dp hÃ¸j
- **Background:** `$color-surface` (#FFFFFF)
- **Border:** 2dp solid `$color-border` (#E8E8EC)
- **Border radius:** 16dp
- **Shadow:** elevation 2dp (subtle)
- **States:**
  - Default: Hvid baggrund, grÃ¥ border
  - Selected: `$color-primary-light` (#E8F5E3) baggrund, `$color-primary` border
  - Pressed: Scale 0.97

#### Habit Card Indhold:
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                    â”‚
â”‚       [EMOJI]      â”‚  â† 32sp stÃ¸rrelse, centreret
â”‚                    â”‚
â”‚    [HABIT NAME]    â”‚  â† 14sp, SemiBold, centreret
â”‚                    â”‚
â”‚   [CHECKBOX]       â”‚  â† 20x20dp, nederst hÃ¸jre
â”‚                    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### 6. Predefinerede Habits Data

```yaml
habits:
  - id: motion
    emoji: "ðŸƒ"
    name: "Motion"
    default_color: "#4CAF50"
    
  - id: reading
    emoji: "ðŸ“š"
    name: "LÃ¦se"
    default_color: "#2196F3"
    
  - id: meditation
    emoji: "ðŸ§˜"
    name: "Mediter"
    default_color: "#9C27B0"
    
  - id: water
    emoji: "ðŸ’§"
    name: "Vand"
    default_color: "#00BCD4"
    
  - id: journal
    emoji: "ðŸ“"
    name: "Journal"
    default_color: "#FF9800"
```

### 7. "Egen" Card (Add Custom)
- **Samme stÃ¸rrelse** som andre cards
- **Ikon:** âž• i `$color-text-tertiary`
- **Text:** "Egen"
- **Tap:** Ã…bn `add_habit_modal` eller navigate til `onboarding_custom_habit`
- **Ingen checkbox**

### 8. Primary CTA Button
- **Indhold:** "FortsÃ¦t â†’"
- **States:**
  - Disabled: NÃ¥r 0 habits valgt. Opacity 0.5, ikke klikkbar
  - Enabled: NÃ¥r 1-3 habits valgt. Fuld opacity
- **Animation ved enable:** Fade + subtle bounce

### 9. Helper Text
- **Indhold:** "Du kan altid tilfÃ¸je flere"
- **Font:** Primary, Regular, 14sp
- **Farve:** `$color-text-tertiary`
- **Centreret**

## Interaktioner

| Element | Gesture | Handling |
|---------|---------|----------|
| Back button | Tap | Navigate til `onboarding_welcome` |
| Habit card | Tap | Toggle selection state |
| "Egen" card | Tap | Navigate til `onboarding_custom_habit` |
| CTA (enabled) | Tap | Navigate til `onboarding_reminder` |

## Selection Logic

```typescript
interface SelectionState {
  selectedHabits: string[];  // max 3
  canProceed: boolean;       // selectedHabits.length >= 1
  canSelectMore: boolean;    // selectedHabits.length < 3
}

// Ved tap pÃ¥ habit card
function toggleHabit(habitId: string) {
  if (selectedHabits.includes(habitId)) {
    // Deselect
    selectedHabits.remove(habitId);
  } else if (selectedHabits.length < 3) {
    // Select
    selectedHabits.add(habitId);
  } else {
    // Max reached - show subtle feedback
    showToast("Du kan vÃ¦lge max 3 habits");
  }
}
```

## Animationer

```yaml
card_select:
  duration: 200ms
  easing: ease-out
  properties:
    - background_color: $color-surface â†’ $color-primary-light
    - border_color: $color-border â†’ $color-primary
    - scale: 1.0 â†’ 0.97 â†’ 1.02 â†’ 1.0 (bounce effect)
    
card_deselect:
  duration: 150ms
  easing: ease-in
  properties:
    - background_color: $color-primary-light â†’ $color-surface
    - border_color: $color-primary â†’ $color-border

checkbox_check:
  type: Lottie animation
  asset: "checkbox_check.json"
  duration: 300ms
  
page_enter:
  - stagger cards fade_in + slide_up, 50ms delay between each
```

## Accessibility

- Habit cards: `accessibilityRole = "checkbox"`
- Selection count announced: "1 af 3 habits valgt"
- CTA state announced: "FortsÃ¦t knap, [disabled/aktiveret]"

## Edge Cases

- **Bruger vil have > 3:** Toast message, gentle shake pÃ¥ CTA
- **Bruger trykker "Egen" fÃ¸rst:** GÃ¥ til custom habit, vend tilbage med den tilfÃ¸jet
- **Landscape mode:** 3-column grid i stedet

---

# SKÃ†RM 3: Onboarding - Custom Habit (Valgfri)

## SkÃ¦rm ID
`onboarding_custom_habit`

## FormÃ¥l
Lad brugeren oprette en custom habit med navn, ikon og farve. Vises kun hvis bruger tapper "Egen" pÃ¥ habit selection.

## Layout Struktur

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚              [STATUS BAR]               â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  âœ•                               Gem    â”‚
â”‚  [CLOSE]                       [SAVE]   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚         "Opret din egen habit"          â”‚
â”‚              [HEADLINE]                 â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   Navn                                  â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚ Drik mere vand                  â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚            [TEXT INPUT]                 â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   VÃ¦lg ikon                             â”‚
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”            â”‚
â”‚   â”‚ ðŸƒâ”‚ ðŸ“šâ”‚ ðŸ§˜â”‚ ðŸ’§â”‚ ðŸ¥—â”‚ ðŸ’Šâ”‚            â”‚
â”‚   â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤            â”‚
â”‚   â”‚ âœï¸â”‚ ðŸŽ¸â”‚ ðŸŒ±â”‚ ðŸ§¹â”‚ ðŸ’¤â”‚ ðŸŽ¯â”‚            â”‚
â”‚   â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤            â”‚
â”‚   â”‚ ðŸ’ªâ”‚ ðŸ§ â”‚ â¤ï¸â”‚ ðŸŒžâ”‚ ðŸŒ™â”‚ â­â”‚            â”‚
â”‚   â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜            â”‚
â”‚           [EMOJI PICKER]                â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   VÃ¦lg farve                            â”‚
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”                  â”‚
â”‚   â”‚ðŸŸ¢â”‚ðŸ”µâ”‚ðŸŸ£â”‚ðŸŸ¡â”‚ðŸŸ â”‚ðŸ”´â”‚                  â”‚
â”‚   â””â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”˜                  â”‚
â”‚         [COLOR PICKER]                  â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   Preview                               â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚  ðŸ’§  Drik mere vand    ðŸ”¥ 0    â”‚   â”‚
â”‚   â”‚  â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘ [ ]    â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚           [LIVE PREVIEW]                â”‚
â”‚                                         â”‚
â”‚                                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Elementer

### 1. Header
- **Close button (âœ•):**
  - StÃ¸rrelse: 24x24dp, touch target 48x48dp
  - Farve: `$color-text-primary`
  - Tap: Dismiss modal, return til `onboarding_habit_select`
  
- **Save button:**
  - Type: Text button
  - Indhold: "Gem"
  - Font: Primary, SemiBold, 16sp
  - Farve (enabled): `$color-primary`
  - Farve (disabled): `$color-text-tertiary`
  - State: Disabled indtil navn er udfyldt

### 2. Text Input - Navn
- **Label:** "Navn"
- **Placeholder:** "Skriv habit navn..."
- **Max length:** 30 karakterer
- **Font:** Primary, Regular, 16sp
- **Border:** 1dp `$color-border`, 2dp `$color-primary` on focus
- **Border radius:** 12dp
- **Padding:** 16dp
- **Height:** 56dp
- **Keyboard:** Default, capitalize sentences
- **Character counter:** "0/30" i hÃ¸jre side (vises efter 20 chars)

### 3. Emoji Picker Grid
- **Columns:** 6
- **Cell size:** 48x48dp
- **Gap:** 8dp
- **Selection indicator:** 3dp `$color-primary` border + scale 1.1

#### Emoji Set (MVP - 18 emojis)
```yaml
emojis:
  row_1: ["ðŸƒ", "ðŸ“š", "ðŸ§˜", "ðŸ’§", "ðŸ¥—", "ðŸ’Š"]
  row_2: ["âœï¸", "ðŸŽ¸", "ðŸŒ±", "ðŸ§¹", "ðŸ’¤", "ðŸŽ¯"]
  row_3: ["ðŸ’ª", "ðŸ§ ", "â¤ï¸", "ðŸŒž", "ðŸŒ™", "â­"]
```

### 4. Color Picker
- **Columns:** 6
- **Circle size:** 40dp diameter
- **Gap:** 12dp
- **Selection indicator:** White inner ring (4dp) + scale 1.15

#### Color Palette
```yaml
colors:
  - id: green
    value: "#4CAF50"
    
  - id: blue
    value: "#2196F3"
    
  - id: purple
    value: "#9C27B0"
    
  - id: yellow
    value: "#FFC107"
    
  - id: orange
    value: "#FF9800"
    
  - id: red
    value: "#F44336"
```

### 5. Live Preview Card
- **Viser hvordan habit card vil se ud pÃ¥ home screen**
- **Opdateres i real-time nÃ¥r bruger Ã¦ndrer vÃ¦rdier**
- **Reduceret stÃ¸rrelse (80% af normal)**
- **Inkluderer:**
  - Valgt emoji
  - Indtastet navn (eller "Din habit" som placeholder)
  - Streak counter (altid 0)
  - Checkbox (ikke interaktiv)
  - Progress bar i valgt farve

## Interaktioner

| Element | Gesture | Handling |
|---------|---------|----------|
| Close (âœ•) | Tap | Dismiss, return to habit select |
| Save | Tap | Valider, gem habit, return med habit tilfÃ¸jet |
| Text input | Focus | Show keyboard, change border color |
| Emoji cell | Tap | Select emoji, update preview |
| Color circle | Tap | Select color, update preview |

## Validation

```typescript
interface CustomHabitForm {
  name: string;        // Required, 1-30 chars
  emoji: string;       // Required
  color: string;       // Required, default = first color
}

function validateForm(form: CustomHabitForm): boolean {
  return form.name.trim().length >= 1 
      && form.name.length <= 30
      && form.emoji !== null
      && form.color !== null;
}
```

## Animationer

```yaml
emoji_select:
  duration: 200ms
  easing: spring(damping: 0.7)
  properties:
    - scale: 1.0 â†’ 1.2 â†’ 1.1
    - border: none â†’ 3dp $color-primary

color_select:
  duration: 150ms  
  easing: ease-out
  properties:
    - scale: 1.0 â†’ 1.15
    - add inner white ring

preview_update:
  duration: 300ms
  easing: ease-in-out
  type: crossfade between states

keyboard_appear:
  - Scroll view shifts up to keep input visible
  - Preview card may hide on small screens
```

## Accessibility

- Input: `accessibilityLabel = "Habit navn input"`
- Emoji grid: `accessibilityRole = "radiogroup"`, each emoji has label
- Color picker: Each color labeled by name ("GrÃ¸n", "BlÃ¥", etc.)
- Preview: `accessibilityLabel = "ForhÃ¥ndsvisning af din habit"`

## Edge Cases

- **Navn for langt:** Stop input ved 30 chars, subtle shake
- **Keyboard covers content:** Scroll view adjusts, preview hides on small phones
- **Empty name on save attempt:** Shake input, show inline error "Indtast et navn"
- **Duplicate name:** Tillad det (bruger kan have flere habits med samme navn)

---

# SKÃ†RM 4: Onboarding - PÃ¥mindelse

## SkÃ¦rm ID
`onboarding_reminder`

## FormÃ¥l
SÃ¦t en daglig pÃ¥mindelse for alle valgte habits. Simpel opsÃ¦tning med Ã©n fÃ¦lles tid (individuelle tider kan Ã¦ndres senere).

## Layout Struktur

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚              [STATUS BAR]               â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  â†                              2/3     â”‚
â”‚  [BACK]                    [PROGRESS]   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚                                         â”‚
â”‚              ðŸ””                         â”‚
â”‚            [BELL ICON]                  â”‚
â”‚                                         â”‚
â”‚   "HvornÃ¥r skal vi minde dig?"          â”‚
â”‚            [HEADLINE]                   â”‚
â”‚                                         â”‚
â”‚   "Vi sender Ã©n pÃ¥mindelse per dag"     â”‚
â”‚            [SUBTEXT]                    â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚           â”Œâ”€â”€â”€â”€â”€â”€â”€â”             â”‚   â”‚
â”‚   â”‚           â”‚ 09:00 â”‚             â”‚   â”‚
â”‚   â”‚           â””â”€â”€â”€â”€â”€â”€â”€â”˜             â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚    08:00   09:00   10:00        â”‚   â”‚
â”‚   â”‚      â†‘       â—        â†‘         â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚            [TIME PICKER]                â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚  â˜€ï¸ Morgen (06-09)      â—‹      â”‚   â”‚
â”‚   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤   â”‚
â”‚   â”‚  ðŸŒ¤ï¸ Formiddag (09-12)   â—      â”‚   â”‚
â”‚   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤   â”‚
â”‚   â”‚  â˜€ï¸ Eftermiddag (12-17) â—‹      â”‚   â”‚
â”‚   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤   â”‚
â”‚   â”‚  ðŸŒ™ Aften (17-21)       â—‹      â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚         [QUICK SELECT OPTIONS]          â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   â–¡ Ingen pÃ¥mindelser                   â”‚
â”‚       [SKIP OPTION]                     â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”‚
â”‚    â”‚    Start tracking â†’        â”‚      â”‚
â”‚    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜      â”‚
â”‚           [PRIMARY CTA]                 â”‚
â”‚                                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Elementer

### 1. Bell Icon
- **Type:** Animeret ikon (Lottie) eller statisk
- **StÃ¸rrelse:** 64x64dp
- **Farve:** `$color-primary`
- **Animation:** Subtle wobble ved page load

### 2. Headline & Subtext
- **Headline:** "HvornÃ¥r skal vi minde dig?"
- **Font:** Primary, SemiBold, 24sp
- **Subtext:** "Vi sender Ã©n pÃ¥mindelse per dag"
- **Font:** Primary, Regular, 16sp, `$color-text-secondary`

### 3. Time Picker
- **Type:** iOS-style wheel picker ELLER custom minimal picker
- **Default value:** 09:00
- **Format:** 24-hour (HH:mm)
- **Step:** 15 minutter (09:00, 09:15, 09:30...)
- **Height:** 150dp
- **Style:** Transparant fade pÃ¥ kanter

#### Alternative: Simple Number Display
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                     â”‚
â”‚    [âˆ’]     09 : 00     [+]         â”‚
â”‚                                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```
- Tap +/- Ã¦ndrer tid med 15 min
- Long press = hurtig scroll
- Tap pÃ¥ tallet = Ã¥bn full picker

### 4. Quick Select Options
- **Type:** Single-select list (radio buttons)
- **Items:**

```yaml
quick_select:
  - id: morning
    icon: "â˜€ï¸"
    label: "Morgen"
    time_range: "06-09"
    default_time: "07:00"
    
  - id: mid_morning
    icon: "ðŸŒ¤ï¸"
    label: "Formiddag"
    time_range: "09-12"
    default_time: "09:00"
    selected: true  # Default
    
  - id: afternoon
    icon: "â˜€ï¸"
    label: "Eftermiddag"
    time_range: "12-17"
    default_time: "14:00"
    
  - id: evening
    icon: "ðŸŒ™"
    label: "Aften"
    time_range: "17-21"
    default_time: "19:00"
```

- **Interaktion:** Tap pÃ¥ option sÃ¦tter time picker til default_time
- **Styling:**
  - Height per row: 56dp
  - Dividers: 1dp `$color-border`
  - Selected: Radio filled, row has subtle primary background

### 5. Skip Option (Checkbox)
- **Type:** Checkbox med label
- **Label:** "Ingen pÃ¥mindelser"
- **Font:** Primary, Regular, 16sp, `$color-text-secondary`
- **Behavior:** NÃ¥r checked:
  - Time picker becomes disabled/greyed out
  - Quick select becomes disabled
  - CTA remains active

### 6. Primary CTA
- **Indhold:** "Start tracking â†’"
- **Altid enabled** (reminder er valgfri)
- **Tap handling:**
  1. Request notification permission (if not skipped)
  2. Save reminder time (or null if skipped)
  3. Create selected habits with reminder
  4. Navigate til `home_screen`
  5. Vis kort celebratory animation

## Notification Permission Flow

```typescript
async function handleContinue() {
  if (!skipReminders) {
    const permission = await requestNotificationPermission();
    
    if (permission === 'denied') {
      // Show gentle explanation, but continue anyway
      showToast("Du kan aktivere pÃ¥mindelser senere i indstillinger");
    }
  }
  
  // Save habits and continue regardless
  await saveHabitsWithReminder(selectedTime);
  navigateTo('home_screen');
}
```

## Interaktioner

| Element | Gesture | Handling |
|---------|---------|----------|
| Back button | Tap | Return til `onboarding_habit_select` |
| Time picker | Scroll/drag | Change time, deselect quick options |
| Quick option | Tap | Select option, update time picker |
| Skip checkbox | Tap | Toggle, disable/enable time picker |
| CTA | Tap | Finish onboarding, go to home |

## Animationer

```yaml
page_enter:
  - bell_icon: wobble animation, duration: 800ms
  - headline: fade_in, delay: 100ms
  - time_picker: fade_in + slide_up, delay: 200ms
  - quick_options: stagger fade_in, delay: 300ms, 50ms between
  - cta: fade_in, delay: 500ms

quick_option_select:
  duration: 200ms
  easing: ease-out
  properties:
    - background_color: transparent â†’ $color-primary-light
    - radio_button: empty â†’ filled (with spring animation)
    
time_picker_scroll:
  - Update quick option selection based on time range
  - Deselect if time doesn't match any range exactly

completion_transition:
  duration: 600ms
  type: shared_element_transition
  - Screen fades out
  - Subtle confetti burst
  - Home screen fades in
```

## Accessibility

- Time picker: `accessibilityLabel = "VÃ¦lg pÃ¥mindelsestidspunkt"`
- Quick options: `accessibilityRole = "radiogroup"`
- Each quick option: Announce full label + time range
- Skip checkbox: `accessibilityLabel = "Spring pÃ¥mindelser over"`
- CTA: `accessibilityLabel = "FÃ¦rdiggÃ¸r opsÃ¦tning og start tracking"`

## Edge Cases

- **Notification permission denied:** Vis venlig besked, fortsÃ¦t alligevel
- **System DND active:** Note at pÃ¥mindelse mÃ¥ske ikke vises
- **Bruger skifter quick option og custom time:** Quick option vinder
- **Bruger scroller time picker efter quick select:** Deselect quick option

---

# SKÃ†RM 5: Home Screen (HovedskÃ¦rm)

## SkÃ¦rm ID
`home_screen`

## FormÃ¥l
Den primÃ¦re daglige interaktion. Vis alle habits, marker som done, se streaks. Skal vÃ¦re ultra-simpel og satisfying at bruge.

## Layout Struktur

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚              [STATUS BAR]               â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  â˜°                     Stribe      âš™ï¸   â”‚
â”‚  [MENU]               [TITLE]  [SETTINGS]â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   â—€ Tirsdag, 23. december â–¶            â”‚
â”‚          [DATE HEADER]                  â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚ ðŸƒ Motion              ðŸ”¥ 14   â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚ â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘   â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚                          [ âœ“ ] â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚            [HABIT CARD 1]               â”‚
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚ ðŸ“š LÃ¦se                ðŸ”¥ 7    â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚ â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘   â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚                          [   ] â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚            [HABIT CARD 2]               â”‚
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚ ðŸ§˜ Meditation          ðŸ”¥ 21   â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚ â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ   â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚                       âœ… Done   â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚            [HABIT CARD 3]               â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€    â”‚
â”‚   2 af 3 i dag                          â”‚
â”‚         [DAILY SUMMARY]                 â”‚
â”‚                                         â”‚
â”‚            [ âž• Ny habit ]              â”‚
â”‚           [ADD HABIT FAB]               â”‚
â”‚                                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Elementer

### 1. App Bar

```yaml
app_bar:
  height: 56dp
  background: $color-background
  
  menu_button:
    icon: "hamburger" (â˜°)
    size: 24x24dp
    touch_target: 48x48dp
    color: $color-text-primary
    action: open_drawer (future: statistics, badges)
    # MVP: Kan vise simple stats i drawer
    
  title:
    text: "Stribe"
    font: Primary, SemiBold, 20sp
    color: $color-text-primary
    centered: true
    
  settings_button:
    icon: "gear" (âš™ï¸)
    size: 24x24dp
    touch_target: 48x48dp
    color: $color-text-secondary
    action: navigate_to('settings')
```

### 2. Date Header

```yaml
date_header:
  container:
    padding_vertical: 16dp
    padding_horizontal: 24dp
    
  left_arrow:
    icon: "chevron_left" (â—€)
    size: 20x20dp
    touch_target: 44x44dp
    color: $color-text-secondary
    action: show_previous_day
    
  date_text:
    format: "EEEE, d. MMMM"  # "Tirsdag, 23. december"
    font: Primary, Medium, 16sp
    color: $color-text-primary
    tap_action: open_calendar_picker
    
  right_arrow:
    icon: "chevron_right" (â–¶)
    size: 20x20dp
    touch_target: 44x44dp
    color: $color-text-secondary
    action: show_next_day
    visibility: hidden if viewing today
    
  # Special states
  today_indicator:
    - Show "I dag" badge hvis dato = today
    - Hvis viewing past: Show "â† Tilbage til i dag" link
```

### 3. Habit Card (KRITISK ELEMENT)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                                   â”‚
â”‚  [EMOJI]  [HABIT NAME]              [STREAK]     â”‚
â”‚                                                   â”‚
â”‚  [PROGRESS BAR - sidste 7 dage]                  â”‚
â”‚                                                   â”‚
â”‚                              [CHECKBOX/STATUS]    â”‚
â”‚                                                   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

#### Card Styling
```yaml
habit_card:
  margin_horizontal: 16dp
  margin_vertical: 6dp
  padding: 16dp
  background: $color-surface (#FFFFFF)
  border_radius: 16dp
  shadow:
    elevation: 2dp
    color: rgba(0, 0, 0, 0.08)
  
  # Different states
  states:
    default:
      border: none
      
    completed:
      background: linear-gradient(right, $color-surface, habit_color @ 5% opacity)
      
    pressed:
      scale: 0.98
      shadow: elevation 1dp
```

#### Card Components

**Emoji**
```yaml
emoji:
  size: 28sp
  margin_right: 12dp
  vertical_align: center
```

**Habit Name**
```yaml
habit_name:
  font: Primary, SemiBold, 16sp
  color: $color-text-primary
  max_lines: 1
  ellipsize: end
  flex: 1 (takes remaining space)
```

**Streak Counter**
```yaml
streak:
  container:
    flex_direction: row
    align_items: center
    
  fire_emoji:
    content: "ðŸ”¥"
    size: 16sp
    margin_right: 4dp
    
  count:
    font: Primary, Bold, 16sp
    color: $color-text-primary
    
  # Special styling
  milestone_glow:
    - At 7, 21, 30, etc.: Add subtle glow animation
    - Color: habit_color at 30% opacity
```

**Progress Bar (7-Day History)**
```yaml
progress_bar:
  container:
    height: 8dp
    margin_top: 12dp
    margin_bottom: 8dp
    border_radius: 4dp
    background: $color-border (#E8E8EC)
    
  segments: 7  # One for each of last 7 days
  
  segment_styling:
    completed_day:
      fill: habit_color
      
    missed_day:
      fill: transparent (shows background)
      
    today_incomplete:
      fill: habit_color at 30% opacity (striped?)
      
    future:
      fill: none (not visible)
      
  # Visual
  segment_gap: 2dp
  segment_border_radius: 2dp
```

**Checkbox / Status**
```yaml
checkbox:
  # Uncompleted state
  uncompleted:
    type: outlined_square
    size: 32x32dp
    border: 2dp $color-border
    border_radius: 8dp
    background: transparent
    
  # Completed state
  completed:
    type: filled_square_with_check
    size: 32x32dp
    background: habit_color
    border_radius: 8dp
    icon: checkmark, white, 20dp
    text: "Done" (shown to right of checkbox)
    text_font: Primary, Medium, 12sp
    text_color: habit_color
    
  touch_target: 48x48dp
  position: bottom-right of card
```

### 4. Daily Summary

```yaml
daily_summary:
  container:
    margin_top: 16dp
    padding_horizontal: 24dp
    
  divider:
    height: 1dp
    color: $color-border
    margin_bottom: 12dp
    
  text:
    format: "{completed} af {total} i dag"
    font: Primary, Regular, 14sp
    color: $color-text-secondary
    
  # States
  all_complete:
    text: "ðŸŽ‰ Alle habits done i dag!"
    color: $color-primary
    animation: subtle celebratory pulse
```

### 5. Add Habit Button

```yaml
add_button:
  type: outlined_button (not FAB in MVP)
  text: "âž• Ny habit"
  font: Primary, Medium, 14sp
  color: $color-primary
  border: 1.5dp dashed $color-primary
  border_radius: 12dp
  padding_vertical: 12dp
  padding_horizontal: 24dp
  margin_top: 16dp
  center_horizontally: true
  
  tap_action: navigate_to('add_habit')
  
  animation_on_tap:
    - Scale: 0.95 â†’ 1.0
    - Ripple effect
```

## Interaktioner

### PrimÃ¦re Interaktioner

| Element | Gesture | Handling |
|---------|---------|----------|
| Checkbox (uncompleted) | Tap | Mark habit as done for today |
| Checkbox (completed) | Tap | Unmark habit (with confirmation on streaks > 7) |
| Habit card | Tap (on card, not checkbox) | Navigate to `habit_detail` |
| Habit card | Long press | Show quick actions menu |
| Date left arrow | Tap | View previous day |
| Date right arrow | Tap | View next day (hidden if today) |
| Date text | Tap | Open calendar date picker |
| Add habit button | Tap | Navigate to `add_habit` |

### Gesture Navigation

```yaml
gestures:
  swipe_left_on_screen:
    action: view_previous_day
    animation: slide_out_right, new_day_slide_in_left
    
  swipe_right_on_screen:
    condition: not_viewing_today
    action: view_next_day
    animation: slide_out_left, new_day_slide_in_right
    
  pull_to_refresh:
    action: recalculate_streaks (for debugging/edge cases)
    show_refreshing_indicator: true
```

### Quick Actions Menu (Long Press)

```yaml
quick_actions:
  trigger: long_press on habit_card
  appearance: bottom_sheet or popover
  haptic: medium_impact
  
  options:
    - icon: "edit"
      label: "Rediger"
      action: navigate_to('edit_habit', habit_id)
      
    - icon: "bell"
      label: "Ã†ndr pÃ¥mindelse"
      action: show_time_picker_dialog
      
    - icon: "archive"
      label: "Arkiver"
      action: archive_habit (with confirmation)
      
    - icon: "trash"
      label: "Slet"
      action: delete_habit (with confirmation)
      color: $color-error
```

## Animationer

### Checkbox Completion Animation (KRITISK)

```yaml
checkbox_complete:
  trigger: tap on uncompleted checkbox
  duration: 400ms
  sequence:
    1. checkbox_fill:
       - Border collapses inward
       - Fill color expands from center
       - Duration: 150ms
       - Easing: ease-out
       
    2. checkmark_draw:
       - SVG path animation (stroke-dashoffset)
       - Duration: 200ms
       - Easing: ease-in-out
       
    3. card_pulse:
       - Subtle scale: 1.0 â†’ 1.02 â†’ 1.0
       - Background gets hint of habit_color
       - Duration: 300ms
       
    4. progress_bar_update:
       - Today's segment fills in
       - Duration: 250ms
       - Easing: ease-out
       
    5. streak_increment:
       - Number counts up (+1)
       - Subtle bounce on fire emoji
       - Duration: 200ms
       
  haptic_feedback: success (light)
  sound: soft_pop (optional, respects settings)
```

### Checkbox Uncomplete Animation

```yaml
checkbox_uncomplete:
  trigger: tap on completed checkbox
  
  # If streak <= 7: Just undo
  simple_undo:
    duration: 200ms
    - Fade out checkmark
    - Shrink fill color
    - Border reappears
    - Streak decrements
    
  # If streak > 7: Show confirmation first
  confirmation:
    dialog:
      title: "Fjern markering?"
      message: "Dette vil nulstille din streak pÃ¥ {streak} dage"
      actions:
        - label: "Behold"
          style: primary
          action: dismiss
        - label: "Fjern alligevel"
          style: destructive
          action: uncomplete_habit
```

### Date Navigation Animation

```yaml
date_change:
  duration: 300ms
  type: slide
  
  go_to_previous:
    - Current content slides out right
    - New content slides in from left
    - Date text crossfades
    
  go_to_next:
    - Current content slides out left
    - New content slides in from right
    
  easing: ease-in-out
```

### Card Entry Animation

```yaml
cards_appear:
  trigger: page_load or date_change
  type: stagger
  
  each_card:
    - Fade in
    - Slide up from 10dp
    - Duration: 250ms
    - Stagger delay: 50ms between cards
    
  easing: ease-out
```

## State Management

### Habit Card State Machine

```typescript
enum HabitCardState {
  INCOMPLETE = 'incomplete',      // Default, checkbox empty
  COMPLETING = 'completing',      // Animation playing
  COMPLETED = 'completed',        // Checkbox filled
  UNCOMPLETING = 'uncompleting',  // Reverse animation
}

interface HabitViewState {
  habit: Habit;
  state: HabitCardState;
  currentStreak: number;
  longestStreak: number;
  last7Days: boolean[];  // [true, true, false, true, true, true, false]
  isToday: boolean;
  canEdit: boolean;      // Can only edit today and yesterday
}
```

### Date State

```typescript
interface DateViewState {
  selectedDate: Date;
  isToday: boolean;
  canGoForward: boolean;
  formattedDate: string;
  habits: HabitViewState[];
}
```

## Accessibility

```yaml
accessibility:
  habit_card:
    role: "button"
    label: "{habit_name}, streak pÃ¥ {streak} dage"
    hint: "Tryk for detaljer, tryk pÃ¥ checkbox for at markere som udfÃ¸rt"
    
  checkbox_incomplete:
    role: "checkbox"
    label: "Marker {habit_name} som udfÃ¸rt"
    state: "ikke markeret"
    
  checkbox_completed:
    role: "checkbox"
    label: "{habit_name} udfÃ¸rt"
    state: "markeret"
    hint: "Tryk for at fjerne markering"
    
  date_navigation:
    left_arrow: "Vis forrige dag"
    right_arrow: "Vis nÃ¦ste dag"
    date_text: "Valgt dato: {formatted_date}. Tryk for at vÃ¦lge dato"
    
  daily_summary:
    live_region: true
    announcement_on_change: "{completed} af {total} habits udfÃ¸rt"
```

## Edge Cases

1. **Ingen habits endnu:**
   - Vis empty state med illustration
   - CTA: "Opret din fÃ¸rste habit"
   
2. **Set habits men all archived:**
   - Vis empty state: "Ingen aktive habits"
   - CTA: "Opret ny habit" eller "Genaktiver habits"
   
3. **Viewing past date (> 30 days):**
   - Vis data men disable editing
   - Note: "Kan ikke redigere gamle entries"
   
4. **Midnight rollover:**
   - Auto-refresh ved midnat (hvis app Ã¥ben)
   - Respekter "dag starter kl." setting
   
5. **Mange habits (> 10):**
   - Scrollable list
   - Consider grouping i v2

---

# SKÃ†RM 6: Habit Detail

## SkÃ¦rm ID
`habit_detail`

## FormÃ¥l
Vis detaljeret statistik og historik for Ã©n habit. Kalendervisning, streaks, completion rate.

## Layout Struktur

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚              [STATUS BAR]               â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  â†                         ðŸ—‘ï¸  âœï¸       â”‚
â”‚  [BACK]                 [DELETE][EDIT]  â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚              ðŸƒ                         â”‚
â”‚            [EMOJI]                      â”‚
â”‚                                         â”‚
â”‚           "Motion"                      â”‚
â”‚         [HABIT NAME]                    â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚      ðŸ”¥ 14 dage i trÃ¦k          â”‚   â”‚
â”‚   â”‚        [CURRENT STREAK]         â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚  LÃ¦ngste      â”‚  Completion     â”‚   â”‚
â”‚   â”‚  streak       â”‚  rate           â”‚   â”‚
â”‚   â”‚               â”‚                 â”‚   â”‚
â”‚   â”‚  ðŸ† 23 dage   â”‚  ðŸ“Š 78%         â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚            [STATS ROW]                  â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   December 2025                    â–¼    â”‚
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”               â”‚
â”‚   â”‚Maâ”‚Tiâ”‚Onâ”‚Toâ”‚Frâ”‚LÃ¸â”‚SÃ¸â”‚               â”‚
â”‚   â”œâ”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¤               â”‚
â”‚   â”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–‘â–‘â”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚  Uge 49       â”‚
â”‚   â”œâ”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¤               â”‚
â”‚   â”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–‘â–‘â”‚â–ˆâ–ˆâ”‚  Uge 50       â”‚
â”‚   â”œâ”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¤               â”‚
â”‚   â”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚  Uge 51       â”‚
â”‚   â”œâ”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¤               â”‚
â”‚   â”‚â–ˆâ–ˆâ”‚â–‘â–‘â”‚â–‘â–‘â”‚â–‘â–‘â”‚â–‘â–‘â”‚â–‘â–‘â”‚â–‘â–‘â”‚  Uge 52       â”‚
â”‚   â””â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”˜               â”‚
â”‚         [CALENDAR HEATMAP]              â”‚
â”‚                                         â”‚
â”‚   â–ˆâ–ˆ = done   â–‘â–‘ = missed   â—‹ = today   â”‚
â”‚            [LEGEND]                     â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   ðŸ”” PÃ¥mindelse: 09:00            >     â”‚
â”‚         [REMINDER ROW]                  â”‚
â”‚                                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Elementer

### 1. Header Actions

```yaml
back_button:
  icon: "arrow_left" or "chevron_left"
  size: 24x24dp
  touch_target: 48x48dp
  action: navigate_back

delete_button:
  icon: "trash" ðŸ—‘ï¸
  size: 24x24dp
  touch_target: 48x48dp
  color: $color-text-secondary
  action: show_delete_confirmation
  
edit_button:
  icon: "pencil" âœï¸
  size: 24x24dp
  touch_target: 48x48dp
  color: $color-text-secondary
  action: navigate_to('edit_habit', habit_id)
```

### 2. Habit Identity

```yaml
emoji:
  size: 56sp
  margin_bottom: 8dp
  center: true
  
habit_name:
  font: Primary, Bold, 24sp
  color: $color-text-primary
  center: true
  max_lines: 2
```

### 3. Current Streak Card

```yaml
streak_card:
  background: habit_color at 10% opacity
  border_radius: 16dp
  padding: 24dp
  margin_horizontal: 24dp
  center_content: true
  
  fire_emoji:
    size: 24sp
    margin_right: 8dp
    
  streak_number:
    font: Primary, Bold, 32sp
    color: habit_color
    
  streak_label:
    text: "dage i trÃ¦k"
    font: Primary, Regular, 16sp
    color: $color-text-secondary
    
  # Milestone styling
  at_milestone:
    - Add subtle glow/shimmer
    - Show milestone badge nearby
```

### 4. Stats Row

```yaml
stats_row:
  container:
    flex_direction: row
    gap: 12dp
    margin: 16dp horizontal
    
  stat_card:
    flex: 1
    background: $color-surface
    border: 1dp $color-border
    border_radius: 12dp
    padding: 16dp
    align_items: center
    
    icon:
      size: 20sp
      margin_bottom: 4dp
      
    value:
      font: Primary, Bold, 20sp
      color: $color-text-primary
      
    label:
      font: Primary, Regular, 12sp
      color: $color-text-secondary
      
# Specific stats
longest_streak:
  icon: "ðŸ†"
  value: "{number} dage"
  label: "LÃ¦ngste streak"
  
completion_rate:
  icon: "ðŸ“Š"
  value: "{percentage}%"
  label: "Completion rate"
  # Calculated: (completed_days / total_days_since_creation) * 100
```

### 5. Calendar Heatmap

```yaml
calendar:
  header:
    month_year: "December 2025"
    font: Primary, SemiBold, 16sp
    dropdown_icon: "â–¼"
    tap_action: show_month_picker
    
  weekday_headers:
    labels: ["Ma", "Ti", "On", "To", "Fr", "LÃ¸", "SÃ¸"]
    font: Primary, Medium, 12sp
    color: $color-text-tertiary
    
  grid:
    columns: 7
    rows: 4-6 (depends on month)
    cell_size: 36dp
    gap: 4dp
    
  cell_states:
    completed:
      background: habit_color
      border_radius: 6dp
      
    missed:
      background: $color-border at 50% opacity
      border_radius: 6dp
      
    today_incomplete:
      border: 2dp dashed habit_color
      background: transparent
      
    today_completed:
      background: habit_color
      border: 2dp solid habit_color (darker)
      
    future:
      background: transparent
      color: $color-text-tertiary
      
    before_habit_created:
      background: transparent
      non-interactive: true
      
  legend:
    margin_top: 12dp
    items:
      - "â–ˆâ–ˆ = done"
      - "â–‘â–‘ = missed"
      - "â—‹ = i dag"
    font: Primary, Regular, 12sp
    color: $color-text-tertiary
```

### 6. Reminder Row

```yaml
reminder_row:
  container:
    margin: 24dp horizontal
    padding: 16dp
    background: $color-surface
    border_radius: 12dp
    border: 1dp $color-border
    flex_direction: row
    align_items: center
    
  bell_icon:
    content: "ðŸ””"
    size: 20sp
    margin_right: 12dp
    
  label:
    text: "PÃ¥mindelse:"
    font: Primary, Regular, 14sp
    color: $color-text-secondary
    margin_right: 8dp
    
  time:
    text: "09:00"
    font: Primary, SemiBold, 14sp
    color: $color-text-primary
    
  chevron:
    icon: "chevron_right"
    size: 20dp
    color: $color-text-tertiary
    margin_left: auto
    
  tap_action: show_time_picker_dialog
```

## Interaktioner

| Element | Gesture | Handling |
|---------|---------|----------|
| Back | Tap | Navigate back to home |
| Delete | Tap | Show delete confirmation dialog |
| Edit | Tap | Navigate to edit_habit |
| Calendar cell (past) | Tap | Toggle completion for that date (with restrictions) |
| Calendar cell (today) | Tap | Toggle completion (same as home) |
| Month header | Tap | Show month picker |
| Reminder row | Tap | Show time picker dialog |
| Swipe left | Gesture | Previous month |
| Swipe right | Gesture | Next month |

### Calendar Cell Edit Rules

```typescript
function canEditDate(date: Date): { canEdit: boolean; reason?: string } {
  const today = new Date();
  const daysSince = differenceInDays(today, date);
  
  if (daysSince < 0) {
    return { canEdit: false, reason: "Kan ikke markere fremtidige dage" };
  }
  
  if (daysSince > 2) {
    return { canEdit: false, reason: "Kan kun redigere de sidste 2 dage" };
  }
  
  return { canEdit: true };
}
```

## Animationer

```yaml
page_enter:
  type: slide_up + fade
  duration: 300ms
  elements_stagger:
    - emoji: scale_in from 0.8
    - name: fade_in
    - streak_card: slide_up + fade_in
    - stats: fade_in
    - calendar: fade_in

streak_update:
  trigger: when streak changes (via calendar edit)
  animation:
    - Number morphs to new value
    - Fire emoji bounces
    - Streak card pulses

calendar_cell_toggle:
  duration: 250ms
  sequence:
    1. Cell scales down slightly (0.9)
    2. Color fills/unfills
    3. Cell scales back to 1.0
    4. Stats update with number morph

month_change:
  duration: 250ms
  type: crossfade with subtle slide
```

## Delete Confirmation Dialog

```yaml
delete_dialog:
  title: "Slet habit?"
  message: "Dette sletter '{habit_name}' og al din historik. Denne handling kan ikke fortrydes."
  
  actions:
    - label: "Annuller"
      style: secondary
      action: dismiss
      
    - label: "Slet"
      style: destructive
      action: delete_and_navigate_home
      
  animation: fade_in + scale from 0.95
```

## Accessibility

```yaml
accessibility:
  page:
    title: "Detaljer for {habit_name}"
    
  streak_card:
    label: "NuvÃ¦rende streak: {count} dage i trÃ¦k"
    
  stats:
    longest: "LÃ¦ngste streak: {count} dage"
    rate: "Completion rate: {percentage} procent"
    
  calendar_cell:
    label: "{date}, {status}" # "23. december, udfÃ¸rt"
    hint: canEdit ? "Tryk for at Ã¦ndre" : "Kan ikke redigeres"
    
  delete_button:
    label: "Slet habit"
    hint: "Sletter habit og al historik permanent"
```

## Edge Cases

1. **Ny habit (0 dage):** Vis "Start din streak i dag!"
2. **Brudt streak i gÃ¥r:** Vis "Streak brudt - start forfra i dag!"
3. **Meget gammel habit:** Pagination pÃ¥ calendar, max 12 mÃ¥neder bagud
4. **100% completion:** Special celebration styling

---

# SKÃ†RM 7: Add/Edit Habit

## SkÃ¦rm ID
`add_habit` / `edit_habit`

## FormÃ¥l
Opret ny habit eller rediger eksisterende. Delt layout med kontekstuelle forskelle.

## Layout Struktur

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚              [STATUS BAR]               â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  âœ•  Ny habit                     Gem    â”‚
â”‚      / Rediger habit                    â”‚
â”‚  [CLOSE]    [TITLE]            [SAVE]   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚        [EMOJI PREVIEW]          â”‚   â”‚
â”‚   â”‚            ðŸ’§                   â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   Navn                                  â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚ Drik 8 glas vand               â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   Ikon                                  â”‚
â”‚   â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”            â”‚
â”‚   â”‚ ðŸƒâ”‚ ðŸ“šâ”‚ ðŸ§˜â”‚ ðŸ’§â”‚ ðŸ¥—â”‚ ðŸ’Šâ”‚            â”‚
â”‚   â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤            â”‚
â”‚   â”‚ âœï¸â”‚ ðŸŽ¸â”‚ ðŸŒ±â”‚ ðŸ§¹â”‚ ðŸ’¤â”‚ ðŸŽ¯â”‚            â”‚
â”‚   â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤            â”‚
â”‚   â”‚ ðŸ’ªâ”‚ ðŸ§ â”‚ â¤ï¸â”‚ ðŸŒžâ”‚ ðŸŒ™â”‚ â­â”‚            â”‚
â”‚   â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜            â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   Farve                                 â”‚
â”‚   â”Œâ”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”                  â”‚
â”‚   â”‚ðŸŸ¢â”‚ðŸ”µâ”‚ðŸŸ£â”‚ðŸŸ¡â”‚ðŸŸ â”‚ðŸ”´â”‚                  â”‚
â”‚   â””â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”˜                  â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   PÃ¥mindelse                            â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚  ðŸ””  09:00                  âœ•   â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚   Eller: [+ TilfÃ¸j pÃ¥mindelse]          â”‚
â”‚                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚         Gem habit               â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                         â”‚
â”‚   [Kun i edit mode:]                    â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚         Arkiver habit           â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Mode Differences

```yaml
add_mode:
  title: "Ny habit"
  save_button_text: "Gem"
  initial_values:
    name: ""
    emoji: null (first in grid selected by default)
    color: first color selected by default
    reminder: null
  show_archive_button: false
  show_delete_option: false
  
edit_mode:
  title: "Rediger habit"
  save_button_text: "Gem Ã¦ndringer"
  initial_values: from existing habit
  show_archive_button: true
  show_delete_option: true (in header or footer)
```

## Elementer

### 1. Header

```yaml
header:
  close_button:
    icon: "âœ•"
    size: 24x24dp
    touch_target: 48x48dp
    action: confirm_discard_if_changes, then navigate_back
    
  title:
    add_mode: "Ny habit"
    edit_mode: "Rediger habit"
    font: Primary, SemiBold, 18sp
    centered: true
    
  save_button:
    add_mode: "Gem"
    edit_mode: "Gem"
    font: Primary, SemiBold, 16sp
    color_enabled: $color-primary
    color_disabled: $color-text-tertiary
    enabled_when: name.length > 0
```

### 2. Emoji Preview

```yaml
emoji_preview:
  container:
    height: 100dp
    background: selected_color at 10% opacity
    border_radius: 16dp
    center_content: true
    margin: 16dp horizontal
    
  emoji:
    size: 48sp
    animated: true (subtle bounce on change)
    
  # Changes dynamically with selections
```

### 3. Name Input

```yaml
name_input:
  label: "Navn"
  label_font: Primary, Medium, 14sp
  label_color: $color-text-secondary
  label_margin_bottom: 8dp
  
  field:
    type: text_input
    placeholder: "Skriv habit navn..."
    max_length: 30
    font: Primary, Regular, 16sp
    height: 56dp
    padding: 16dp
    background: $color-surface
    border: 1dp $color-border
    border_focused: 2dp $color-primary
    border_radius: 12dp
    
  character_counter:
    show_after: 20 characters
    format: "{current}/30"
    position: bottom_right
    font: Primary, Regular, 12sp
    color: $color-text-tertiary
```

### 4. Emoji Grid

```yaml
emoji_grid:
  label: "Ikon"
  margin_top: 24dp
  
  grid:
    columns: 6
    cell_size: 48dp
    gap: 8dp
    
  emojis: # 18 emojis - same as onboarding
    [
      "ðŸƒ", "ðŸ“š", "ðŸ§˜", "ðŸ’§", "ðŸ¥—", "ðŸ’Š",
      "âœï¸", "ðŸŽ¸", "ðŸŒ±", "ðŸ§¹", "ðŸ’¤", "ðŸŽ¯",
      "ðŸ’ª", "ðŸ§ ", "â¤ï¸", "ðŸŒž", "ðŸŒ™", "â­"
    ]
    
  cell_default:
    background: transparent
    border: 1dp $color-border
    border_radius: 10dp
    
  cell_selected:
    background: $color-primary at 15%
    border: 2dp $color-primary
    scale: 1.05
```

### 5. Color Picker

```yaml
color_picker:
  label: "Farve"
  margin_top: 24dp
  
  grid:
    columns: 6
    gap: 12dp
    
  colors:
    - { id: "green",  value: "#4CAF50" }
    - { id: "blue",   value: "#2196F3" }
    - { id: "purple", value: "#9C27B0" }
    - { id: "yellow", value: "#FFC107" }
    - { id: "orange", value: "#FF9800" }
    - { id: "red",    value: "#F44336" }
    
  circle_default:
    size: 40dp diameter
    
  circle_selected:
    size: 40dp diameter
    border: 3dp white (inset)
    shadow: elevation 2dp
    scale: 1.1
```

### 6. Reminder Section

```yaml
reminder_section:
  label: "PÃ¥mindelse"
  margin_top: 24dp
  
  # State: No reminder set
  no_reminder:
    button:
      text: "+ TilfÃ¸j pÃ¥mindelse"
      font: Primary, Medium, 14sp
      color: $color-primary
      background: transparent
      border: 1.5dp dashed $color-primary
      border_radius: 12dp
      padding: 12dp 16dp
      tap_action: show_time_picker
      
  # State: Reminder set
  has_reminder:
    container:
      background: $color-surface
      border: 1dp $color-border
      border_radius: 12dp
      padding: 12dp 16dp
      flex_direction: row
      align_items: center
      
    bell_icon:
      content: "ðŸ””"
      size: 20sp
      margin_right: 12dp
      
    time_text:
      font: Primary, SemiBold, 16sp
      color: $color-text-primary
      tap_action: show_time_picker
      
    remove_button:
      icon: "âœ•"
      size: 16dp
      color: $color-text-tertiary
      touch_target: 40dp
      margin_left: auto
      tap_action: remove_reminder
```

### 7. Action Buttons

```yaml
# Primary action
save_button:
  text: "Gem habit"
  type: filled_button
  background: $color-primary
  color: white
  font: Primary, SemiBold, 16sp
  height: 56dp
  border_radius: 12dp
  margin: 24dp horizontal
  
  states:
    disabled:
      opacity: 0.5
      condition: name.trim().length === 0
      
# Secondary action (edit mode only)
archive_button:
  text: "Arkiver habit"
  type: outlined_button
  border: 1.5dp $color-text-secondary
  color: $color-text-secondary
  font: Primary, Medium, 14sp
  height: 48dp
  border_radius: 12dp
  margin_top: 12dp
  
  tap_action: show_archive_confirmation
```

## Interaktioner

| Element | Gesture | Handling |
|---------|---------|----------|
| Close (âœ•) | Tap | Check for changes, confirm discard, go back |
| Save | Tap | Validate, save, navigate back |
| Name input | Focus | Show keyboard |
| Emoji cell | Tap | Select emoji, update preview |
| Color circle | Tap | Select color, update preview |
| Add reminder | Tap | Show time picker |
| Reminder time | Tap | Show time picker to edit |
| Remove reminder (âœ•) | Tap | Clear reminder |
| Archive | Tap | Show confirmation, archive |

## Time Picker Dialog

```yaml
time_picker_dialog:
  type: bottom_sheet or native_picker
  
  title: "VÃ¦lg tid"
  
  picker:
    type: wheel or clock
    format: 24h (HH:mm)
    minute_interval: 15
    
  actions:
    cancel:
      text: "Annuller"
      action: dismiss
      
    confirm:
      text: "Gem"
      action: set_reminder_time, dismiss
```

## Validation

```typescript
interface HabitForm {
  name: string;       // Required, 1-30 chars, trimmed
  emoji: string;      // Required
  color: string;      // Required
  reminderTime: string | null;  // Optional, format "HH:mm"
}

function validate(form: HabitForm): ValidationResult {
  const errors: string[] = [];
  
  if (!form.name.trim()) {
    errors.push("Navn er pÃ¥krÃ¦vet");
  }
  
  if (form.name.length > 30) {
    errors.push("Navn mÃ¥ max vÃ¦re 30 tegn");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

## Animationer

```yaml
page_enter:
  type: slide_up from bottom (modal style)
  duration: 300ms
  
emoji_select:
  duration: 200ms
  sequence:
    - Selected: scale 1.0 â†’ 1.1, add border
    - Previous: remove border, scale back
    - Preview: crossfade emoji
    
color_select:
  duration: 200ms
  sequence:
    - Selected: scale 1.0 â†’ 1.1, add inner ring
    - Preview background: color transition
    
save_success:
  duration: 300ms
  sequence:
    - Button shows checkmark briefly
    - Page slides down/fades out
    
discard_confirmation:
  type: dialog with fade_in + scale
```

## Discard Changes Dialog

```yaml
discard_dialog:
  condition: show only if form has unsaved changes
  
  title: "Forkast Ã¦ndringer?"
  message: "Du har Ã¦ndringer der ikke er gemt."
  
  actions:
    - label: "FortsÃ¦t redigering"
      style: primary
      action: dismiss
      
    - label: "Forkast"
      style: secondary
      action: navigate_back_without_saving
```

## Archive Confirmation Dialog

```yaml
archive_dialog:
  title: "Arkiver habit?"
  message: "'{habit_name}' vil blive skjult fra din liste, men din historik bevares. Du kan genaktivere den senere."
  
  actions:
    - label: "Annuller"
      style: secondary
      action: dismiss
      
    - label: "Arkiver"
      style: primary
      action: archive_habit, navigate_to_home
```

## Accessibility

```yaml
accessibility:
  name_input:
    label: "Habit navn"
    hint: "Indtast et navn til din habit"
    
  emoji_grid:
    role: "radiogroup"
    label: "VÃ¦lg ikon"
    each_cell:
      role: "radio"
      label: "{emoji_description}" # "LÃ¸ber", "Bog", etc.
      
  color_picker:
    role: "radiogroup"
    label: "VÃ¦lg farve"
    each_circle:
      role: "radio"
      label: "{color_name}" # "GrÃ¸n", "BlÃ¥", etc.
      
  save_button:
    label: add_mode ? "Gem ny habit" : "Gem Ã¦ndringer"
    disabled_hint: "Udfyld navn for at gemme"
```

## Edge Cases

1. **Keyboard covers content:** Scroll view adjusts, or use bottom sheet input
2. **Very long name pasted:** Truncate at 30 chars, show toast
3. **Duplicate name:** Allow (user might want "Meditation morgen" and "Meditation aften")
4. **Edit while notification active:** Update notification with new time
5. **Rapid emoji/color taps:** Debounce animation to prevent jank

---

# SKÃ†RM 8: Settings (Indstillinger)

## SkÃ¦rm ID
`settings`

## FormÃ¥l
Central hub for alle app-indstillinger. Dag-reset tid, notifikationer, data eksport, premium upgrade.

## Layout Struktur

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚              [STATUS BAR]               â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  â†  Indstillinger                       â”‚
â”‚  [BACK]     [TITLE]                     â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                         â”‚
â”‚   GENERELT                              â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€     â”‚
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚  ðŸŒ™  Dag starter kl.    04:00 >â”‚   â”‚
â”‚   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤   â”‚
â”‚   â”‚  ðŸ“…  Ugen starter      Mandag >â”‚   â”‚
â”‚   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤   â”‚
â”‚   â”‚  ðŸŒ  Sprog               Dansk >â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                         â”‚
â”‚   NOTIFIKATIONER                        â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€     â”‚
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚  ðŸ””  PÃ¥mindelser         [ON]  â”‚   â”‚
â”‚   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤   â”‚
â”‚   â”‚  ðŸ”Š  Lyd                 [ON]  â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                         â”‚
â”‚   DATA                                  â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€     â”‚
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚  ðŸ“¤  Eksporter data (CSV)    > â”‚   â”‚
â”‚   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤   â”‚
â”‚   â”‚  ðŸ—‘ï¸  Slet alle data          > â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                         â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€     â”‚
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚   â­ Opgrader til Pro          â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚   â€¢ UbegrÃ¦nset habits          â”‚   â”‚
â”‚   â”‚   â€¢ CSV eksport                â”‚   â”‚
â”‚   â”‚   â€¢ Alle badges                â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚   19 kr/mÃ¥ned eller            â”‚   â”‚
â”‚   â”‚   149 kr engang                â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â”‚   [ Opgrader nu ]              â”‚   â”‚
â”‚   â”‚                                 â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚         [PRO UPGRADE CARD]              â”‚
â”‚                                         â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€     â”‚
â”‚                                         â”‚
â”‚   Om Stribe  â€¢  Privatlivspolitik       â”‚
â”‚   Version 1.0.0                         â”‚
â”‚                                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Elementer

### 1. Header

```yaml
header:
  back_button:
    icon: "arrow_left"
    action: navigate_back_to_home
    
  title:
    text: "Indstillinger"
    font: Primary, SemiBold, 18sp
```

### 2. Section Headers

```yaml
section_header:
  text_transform: uppercase
  font: Primary, SemiBold, 12sp
  color: $color-text-tertiary
  letter_spacing: 0.5sp
  margin_top: 24dp
  margin_bottom: 8dp
  margin_horizontal: 16dp
```

### 3. Settings Rows

```yaml
settings_row:
  container:
    height: 56dp
    padding_horizontal: 16dp
    background: $color-surface
    border_bottom: 1dp $color-border (last item: none)
    flex_direction: row
    align_items: center
    
  icon:
    size: 24sp
    margin_right: 16dp
    
  label:
    font: Primary, Regular, 16sp
    color: $color-text-primary
    flex: 1
    
  # Value display (for selection rows)
  value:
    font: Primary, Regular, 14sp
    color: $color-text-secondary
    margin_right: 8dp
    
  # Chevron (for navigation rows)
  chevron:
    icon: "chevron_right"
    size: 20dp
    color: $color-text-tertiary
    
  # Toggle (for switch rows)
  toggle:
    type: switch
    on_color: $color-primary
    off_color: $color-border
```

### 4. Specific Settings

#### Dag starter kl.
```yaml
day_start_setting:
  icon: "ðŸŒ™"
  label: "Dag starter kl."
  current_value: "04:00"
  type: selection
  
  tap_action: show_time_picker
  
  time_picker:
    title: "Dag starter kl."
    description: "Habits efter denne tid tÃ¦ller som nÃ¦ste dag"
    format: HH:mm
    default: "04:00"
    common_options:
      - "00:00" # Midnat
      - "03:00" # Natarbejder
      - "04:00" # Standard
      - "05:00" # Tidlig morgen
```

#### Ugen starter
```yaml
week_start_setting:
  icon: "ðŸ“…"
  label: "Ugen starter"
  current_value: "Mandag"
  type: selection
  
  tap_action: show_bottom_sheet
  
  options:
    - { value: "monday", label: "Mandag" }
    - { value: "sunday", label: "SÃ¸ndag" }
```

#### Sprog
```yaml
language_setting:
  icon: "ðŸŒ"
  label: "Sprog"
  current_value: "Dansk"
  type: selection
  
  # MVP: Only Danish
  tap_action: show_coming_soon_toast
  
  # Future:
  options:
    - { value: "da", label: "Dansk" }
    - { value: "en", label: "English" }
```

#### Notifikationer Toggle
```yaml
notifications_setting:
  icon: "ðŸ””"
  label: "PÃ¥mindelser"
  type: toggle
  
  on_toggle:
    if_enabling:
      - Check notification permission
      - If denied: show permission dialog
    if_disabling:
      - Cancel all scheduled notifications
      - Show confirmation toast
```

#### Lyd Toggle
```yaml
sound_setting:
  icon: "ðŸ”Š"
  label: "Lyd"
  type: toggle
  
  description: "Afspil lyd ved completion"
  
  on_toggle:
    if_enabling:
      - Play sample sound
    if_disabling:
      - Mute completion sounds
```

### 5. Data Actions

#### Eksporter Data
```yaml
export_setting:
  icon: "ðŸ“¤"
  label: "Eksporter data (CSV)"
  type: action
  
  # Free tier
  free_behavior:
    tap_action: show_pro_upsell_dialog
    show_lock_icon: true
    
  # Pro tier
  pro_behavior:
    tap_action: generate_and_share_csv
    
  csv_format:
    filename: "stribe_export_{date}.csv"
    columns:
      - habit_name
      - date
      - completed (boolean)
      - streak_at_time
```

#### Slet alle data
```yaml
delete_all_setting:
  icon: "ðŸ—‘ï¸"
  label: "Slet alle data"
  type: destructive_action
  color: $color-error
  
  tap_action: show_delete_confirmation
  
  confirmation_dialog:
    title: "Slet alle data?"
    message: "Dette sletter ALLE dine habits og historik permanent. Denne handling kan ikke fortrydes."
    
    input_confirmation:
      required: true
      prompt: "Skriv 'SLET' for at bekrÃ¦fte"
      expected: "SLET"
      
    actions:
      - label: "Annuller"
        style: secondary
        action: dismiss
        
      - label: "Slet alt"
        style: destructive
        enabled_when: input === "SLET"
        action: wipe_all_data, navigate_to_onboarding
```

### 6. Pro Upgrade Card

```yaml
pro_card:
  container:
    background: linear-gradient(135deg, #2D5A27, #4A7C43)
    border_radius: 16dp
    padding: 20dp
    margin: 16dp horizontal
    
  star_icon:
    content: "â­"
    size: 24sp
    margin_bottom: 8dp
    
  title:
    text: "Opgrader til Pro"
    font: Primary, Bold, 18sp
    color: white
    
  benefits_list:
    items:
      - "UbegrÃ¦nset habits"
      - "CSV eksport"
      - "Alle badges"
    bullet_style: "â€¢"
    font: Primary, Regular, 14sp
    color: white at 90%
    
  pricing:
    text: "19 kr/mÃ¥ned eller 149 kr engang"
    font: Primary, Regular, 13sp
    color: white at 80%
    margin_top: 12dp
    
  cta_button:
    text: "Opgrader nu"
    background: white
    color: $color-primary
    font: Primary, SemiBold, 14sp
    border_radius: 8dp
    padding: 12dp 24dp
    margin_top: 16dp
    center: true
    
    tap_action: show_purchase_options
    
  # Hide if already Pro
  visibility: user.isPro ? hidden : visible
```

### 7. Footer Links

```yaml
footer:
  container:
    margin_top: 24dp
    margin_bottom: 32dp
    center: true
    
  links:
    - text: "Om Stribe"
      tap_action: show_about_screen
    - separator: " â€¢ "
    - text: "Privatlivspolitik"
      tap_action: open_privacy_url
      
  links_font: Primary, Regular, 14sp
  links_color: $color-text-secondary
  
  version:
    text: "Version 1.0.0"
    font: Primary, Regular, 12sp
    color: $color-text-tertiary
    margin_top: 8dp
```

## Purchase Flow

```yaml
purchase_bottom_sheet:
  title: "VÃ¦lg abonnement"
  
  options:
    - type: subscription
      label: "MÃ¥nedligt"
      price: "19 kr/mÃ¥ned"
      billing_period: "Fornyes automatisk"
      product_id: "pro_monthly"
      
    - type: lifetime
      label: "Lifetime"
      price: "149 kr"
      badge: "Mest populÃ¦r"
      billing_period: "EngangskÃ¸b"
      product_id: "pro_lifetime"
      
  legal_text: "Ved kÃ¸b accepterer du vores vilkÃ¥r. Abonnement kan opsiges nÃ¥r som helst."
  
  cta:
    text: "KÃ¸b {selected_option}"
    action: initiate_purchase
    
  restore_link:
    text: "Gendan kÃ¸b"
    action: restore_purchases
```

## Interaktioner

| Element | Gesture | Handling |
|---------|---------|----------|
| Back | Tap | Navigate to home |
| Dag starter | Tap | Show time picker |
| Ugen starter | Tap | Show selection sheet |
| Sprog | Tap | Show coming soon (MVP) |
| PÃ¥mindelser toggle | Tap | Toggle + permission check |
| Lyd toggle | Tap | Toggle |
| Eksporter | Tap | Pro: export, Free: upsell |
| Slet alle | Tap | Dangerous confirmation flow |
| Pro card | Tap | Show purchase sheet |
| Om Stribe | Tap | Show about screen |
| Privatliv | Tap | Open external URL |

## Animationer

```yaml
toggle_animation:
  duration: 200ms
  easing: spring
  thumb_movement: slide + scale
  track_color_change: crossfade

settings_row_tap:
  background: brief highlight ($color-primary at 10%)
  duration: 100ms

pro_card_tap:
  scale: 0.98 â†’ 1.0
  duration: 150ms
```

## Accessibility

```yaml
accessibility:
  toggles:
    role: "switch"
    state: "on" / "off"
    double_tap_hint: "Tryk to gange for at Ã¦ndre"
    
  selection_rows:
    role: "button"
    label: "{setting_name}, nuvÃ¦rende vÃ¦rdi {value}"
    hint: "Tryk for at Ã¦ndre"
    
  pro_card:
    role: "button"
    label: "Opgrader til Pro. UbegrÃ¦nset habits, CSV eksport, alle badges. 19 kroner per mÃ¥ned eller 149 kroner engang."
```

## Edge Cases

1. **Notification permission denied system-wide:** Show link to system settings
2. **Already Pro user:** Hide upgrade card, change export row
3. **Purchase fails:** Show error with retry option
4. **Offline when trying to purchase:** Show offline message
5. **Day start time change:** Recalculate all streaks

---

# SKÃ†RM 9: Milestone Celebration (Modal)

## SkÃ¦rm ID
`milestone_celebration`

## FormÃ¥l
Fejr brugerens fremskridt ved vigtige milestones. Skab dopamin-boost og motivation til at fortsÃ¦tte.

## Trigger Conditions

```yaml
milestones:
  - days: 7
    title: "Ã‰n uge!"
    message: "Syv dage i trÃ¦k! Du er godt i gang."
    badge: "ðŸ¥‰"
    
  - days: 21
    title: "21 dage!"
    message: "Tre uger! Du har officielt skabt en ny vane."
    badge: "ðŸ¥ˆ"
    
  - days: 30
    title: "Ã‰n mÃ¥ned!"
    message: "30 dage i trÃ¦k! Du er en mester."
    badge: "ðŸ¥‡"
    
  - days: 60
    title: "To mÃ¥neder!"
    message: "60 dage! Din vane er nu en del af dig."
    badge: "ðŸ’Ž"
    
  - days: 90
    title: "Tre mÃ¥neder!"
    message: "90 dage! Intet kan stoppe dig nu."
    badge: "ðŸ‘‘"
    
  - days: 365
    title: "Ã‰T Ã…R!"
    message: "365 dage! Du er legendarisk."
    badge: "ðŸ†"
    special: true  # Extra fancy animation
```

## Layout Struktur

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                         â”‚
â”‚                                         â”‚
â”‚        âœ¨  ðŸŽ‰  âœ¨                       â”‚
â”‚       [CONFETTI BURST]                  â”‚
â”‚                                         â”‚
â”‚                                         â”‚
â”‚    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚    â”‚                               â”‚    â”‚
â”‚    â”‚           ðŸ¥ˆ                  â”‚    â”‚
â”‚    â”‚         [BADGE]               â”‚    â”‚
â”‚    â”‚                               â”‚    â”‚
â”‚    â”‚        21 DAGE!               â”‚    â”‚
â”‚    â”‚        [TITLE]                â”‚    â”‚
â”‚    â”‚                               â”‚    â”‚
â”‚    â”‚    Du har gjort ðŸ§˜            â”‚    â”‚
â”‚    â”‚    i 21 dage i trÃ¦k!          â”‚    â”‚
â”‚    â”‚       [MESSAGE]               â”‚    â”‚
â”‚    â”‚                               â”‚    â”‚
â”‚    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â”‚            [CELEBRATION CARD]           â”‚
â”‚                                         â”‚
â”‚    "Tre uger! Du har officielt          â”‚
â”‚     skabt en ny vane. Bliv ved!"        â”‚
â”‚         [MOTIVATIONAL TEXT]             â”‚
â”‚                                         â”‚
â”‚                                         â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”‚
â”‚   â”‚  Del ðŸ“¤   â”‚   â”‚  FortsÃ¦t â†’   â”‚     â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â”‚
â”‚      [SHARE]        [CONTINUE]          â”‚
â”‚                                         â”‚
â”‚                                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

    [CONFETTI PARTICLES FALLING]
```

## Elementer

### 1. Overlay Background

```yaml
overlay:
  type: full_screen_modal
  background: rgba(0, 0, 0, 0.7)
  backdrop_blur: 8dp (if supported)
  
  animation_enter:
    type: fade_in
    duration: 200ms
    
  tap_outside: dismiss (after 2 seconds)
```

### 2. Confetti Animation

```yaml
confetti:
  type: Lottie animation OR custom particle system
  asset: "confetti_burst.json"
  
  timing:
    - Initial burst: on modal appear
    - Continuous rain: during modal visibility
    - Fade out: on dismiss
    
  colors:
    - habit_color (primary)
    - $color-primary
    - Gold (#FFD700)
    - White
    
  particles:
    count: 100 (burst) + 20 (continuous)
    shapes: [rectangle, circle, star]
    fall_speed: 200-400 dp/s
    rotation: random
    
  # Special for 365 days
  legendary_confetti:
    particle_count: 200
    include_sparkles: true
    include_stars: true
```

### 3. Celebration Card

```yaml
celebration_card:
  container:
    width: screen_width - 48dp
    background: $color-surface
    border_radius: 24dp
    padding: 32dp
    center_content: true
    shadow: elevation 8dp
    
  animation_enter:
    type: scale_in + bounce
    from: 0.8
    to: 1.0
    duration: 400ms
    easing: spring(damping: 0.6)
    delay: 100ms (after overlay)
```

### 4. Badge

```yaml
badge:
  size: 64sp
  margin_bottom: 16dp
  
  animation:
    type: pop_in + subtle_float
    pop_duration: 300ms
    float_amplitude: 4dp
    float_duration: 2000ms
    loop: true
    
  # Glow effect
  glow:
    color: Gold at 30%
    radius: 20dp
    pulse: true
```

### 5. Title

```yaml
title:
  text: "{milestone_days} DAGE!"
  font: Primary, Bold, 32sp
  color: $color-text-primary
  text_transform: uppercase
  letter_spacing: 2sp
  
  animation:
    type: typewriter or scale_in
    delay: 200ms after card appear
```

### 6. Achievement Text

```yaml
achievement_text:
  format: "Du har gjort {habit_emoji}\ni {days} dage i trÃ¦k!"
  font: Primary, Regular, 16sp
  color: $color-text-secondary
  text_align: center
  line_height: 1.4
  margin_top: 8dp
```

### 7. Motivational Quote

```yaml
motivational_text:
  text: milestone.message
  font: Primary, Regular, 14sp
  font_style: italic
  color: $color-text-tertiary
  text_align: center
  margin_top: 24dp
  max_width: 280dp
```

### 8. Action Buttons

```yaml
buttons_container:
  flex_direction: row
  gap: 12dp
  margin_top: 32dp
  
share_button:
  type: outlined
  text: "Del"
  icon: "ðŸ“¤" (leading)
  font: Primary, Medium, 14sp
  color: $color-text-secondary
  border: 1.5dp $color-border
  border_radius: 12dp
  padding: 12dp 20dp
  
  tap_action: trigger_share_sheet
  
continue_button:
  type: filled
  text: "FortsÃ¦t"
  icon: "â†’" (trailing)
  font: Primary, SemiBold, 14sp
  background: $color-primary
  color: white
  border_radius: 12dp
  padding: 12dp 24dp
  
  tap_action: dismiss_modal
```

## Share Functionality

```yaml
share_content:
  # Image generation
  share_image:
    width: 1080px
    height: 1350px (Instagram story format)
    background: gradient($color-primary, $color-primary-dark)
    
    content:
      - Stribe logo (top)
      - Badge emoji (center, large)
      - "{days} DAGE I TRÃ†K!" (bold)
      - Habit name and emoji
      - "Bygget med Stribe" (footer)
      
  # Text share (fallback)
  share_text:
    format: "ðŸ”¥ {days} dage i trÃ¦k med {habit_name}! {habit_emoji}\n\nBygget med Stribe ðŸŒ¿"
    
  share_options:
    - Instagram Stories (image)
    - WhatsApp (text + image)
    - Twitter/X (text)
    - Copy to clipboard
    - More... (system share sheet)
```

## Animation Sequence

```yaml
celebration_sequence:
  # Timeline (all times from modal trigger)
  
  0ms:
    - Overlay fades in (200ms)
    - Confetti burst begins
    
  100ms:
    - Card scales in with bounce (400ms)
    
  300ms:
    - Badge pops in with glow
    
  400ms:
    - Title animates in
    
  500ms:
    - Achievement text fades in
    
  600ms:
    - Motivational text fades in
    
  700ms:
    - Buttons slide up and fade in
    
  ongoing:
    - Confetti continues to fall
    - Badge has subtle float animation
    
  # Sound
  sound:
    trigger: 0ms
    asset: "celebration_chime.mp3"
    respects_mute: true
    
  # Haptics
  haptic:
    trigger: 100ms
    type: success
    
  # Additional haptic at milestone reveal
  haptic_badge:
    trigger: 300ms
    type: medium_impact
```

## Interaktioner

| Element | Gesture | Handling |
|---------|---------|----------|
| Share button | Tap | Open share sheet |
| Continue button | Tap | Dismiss modal |
| Overlay (after 2s) | Tap | Dismiss modal |
| Swipe down | Gesture | Dismiss modal |

## Dismiss Behavior

```yaml
dismiss:
  animation:
    - Confetti stops spawning
    - Card scales down + fades (200ms)
    - Overlay fades out (150ms)
    
  after_dismiss:
    - Return to home screen (already visible underneath)
    - Update badge collection (if applicable)
    - Mark milestone as shown (don't repeat)
```

## Badge Collection

```yaml
# Store in local DB
badge_record:
  habit_id: string
  milestone_days: number
  achieved_at: timestamp
  shared: boolean

# Display in habit detail or separate badges screen (v2)
```

## Accessibility

```yaml
accessibility:
  modal:
    role: "alert"
    label: "Tillykke! Du har nÃ¥et en milepÃ¦l."
    
  badge:
    label: "Badge: {milestone_name}"
    
  share_button:
    label: "Del din prÃ¦station"
    
  continue_button:
    label: "Luk fejring og fortsÃ¦t"
    
  auto_announce:
    on_appear: "Tillykke! {milestone_title}. {motivational_message}"
```

## Edge Cases

1. **Multiple milestones same day:** Show one at a time, queue others
2. **App closed during celebration:** Show on next open
3. **Share fails:** Show toast, don't dismiss modal
4. **Very slow device:** Reduce confetti particles
5. **Accessibility: reduce motion:** Skip confetti, simpler card animation

---

# GLOBAL DESIGN TOKENS & COMPONENTS

## Color Palette

```yaml
# Primary Colors (Scandinavian Forest Theme)
colors:
  primary:
    default: "#2D5A27"      # Forest green - main actions
    light: "#4A7C43"        # Hover/pressed states
    lighter: "#E8F5E3"      # Backgrounds, selections
    dark: "#1E3D1A"         # Dark mode primary
    
  # Neutrals
  background: "#FAFAF8"     # Warm white - main bg
  surface: "#FFFFFF"        # Cards, modals
  
  # Text
  text:
    primary: "#1A1A2E"      # Headings, important
    secondary: "#4A4A68"    # Body text
    tertiary: "#8A8AA3"     # Captions, hints
    
  # UI Elements
  border: "#E8E8EC"         # Dividers, borders
  
  # Semantic
  error: "#D32F2F"          # Errors, destructive
  warning: "#F57C00"        # Warnings
  success: "#388E3C"        # Success states
  
  # Habit Colors (User Selection)
  habit_palette:
    - { id: "green",  hex: "#4CAF50" }
    - { id: "blue",   hex: "#2196F3" }
    - { id: "purple", hex: "#9C27B0" }
    - { id: "yellow", hex: "#FFC107" }
    - { id: "orange", hex: "#FF9800" }
    - { id: "red",    hex: "#F44336" }
```

## Typography

```yaml
typography:
  font_family:
    primary: "Inter"  # or system font
    fallback: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    
  weights:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
    
  scale:
    # Name: size / line-height / weight
    display:    { size: 32sp, line: 40sp, weight: bold }
    headline:   { size: 24sp, line: 32sp, weight: semibold }
    title:      { size: 20sp, line: 28sp, weight: semibold }
    subtitle:   { size: 18sp, line: 26sp, weight: medium }
    body:       { size: 16sp, line: 24sp, weight: regular }
    body_bold:  { size: 16sp, line: 24sp, weight: semibold }
    caption:    { size: 14sp, line: 20sp, weight: regular }
    small:      { size: 12sp, line: 16sp, weight: regular }
    overline:   { size: 12sp, line: 16sp, weight: semibold, spacing: 0.5sp }
```

## Spacing Scale

```yaml
spacing:
  # Base unit: 4dp
  xxs: 4dp
  xs: 8dp
  sm: 12dp
  md: 16dp
  lg: 24dp
  xl: 32dp
  xxl: 48dp
  
  # Semantic spacing
  card_padding: 16dp
  section_gap: 24dp
  screen_horizontal: 16dp
  button_padding_h: 24dp
  button_padding_v: 12dp
```

## Border Radius

```yaml
radii:
  none: 0dp
  sm: 4dp
  md: 8dp
  lg: 12dp
  xl: 16dp
  xxl: 24dp
  full: 9999dp  # Pill/circle
```

## Shadows / Elevation

```yaml
elevation:
  none:
    shadow: none
    
  subtle:
    offset_y: 1dp
    blur: 2dp
    color: "rgba(0, 0, 0, 0.05)"
    
  card:
    offset_y: 2dp
    blur: 8dp
    color: "rgba(0, 0, 0, 0.08)"
    
  modal:
    offset_y: 4dp
    blur: 16dp
    color: "rgba(0, 0, 0, 0.15)"
    
  floating:
    offset_y: 8dp
    blur: 24dp
    color: "rgba(0, 0, 0, 0.2)"
```

## Animation Tokens

```yaml
animations:
  duration:
    instant: 100ms
    fast: 150ms
    normal: 250ms
    slow: 400ms
    decorative: 600ms
    
  easing:
    default: "cubic-bezier(0.4, 0, 0.2, 1)"    # ease-in-out
    enter: "cubic-bezier(0, 0, 0.2, 1)"         # ease-out
    exit: "cubic-bezier(0.4, 0, 1, 1)"          # ease-in
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"  # overshoot
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
```

---

## REUSABLE COMPONENTS

### Component: Primary Button

```yaml
primary_button:
  description: Main action button used throughout the app
  
  properties:
    height: 56dp
    padding_horizontal: 24dp
    border_radius: 12dp
    background: $color-primary
    text_color: white
    font: body_bold
    
  states:
    default:
      background: $color-primary
      
    pressed:
      background: $color-primary-dark
      scale: 0.98
      
    disabled:
      background: $color-primary
      opacity: 0.5
      
  animation:
    press: scale to 0.98, 100ms
    release: scale to 1.0, 150ms with spring
    
  accessibility:
    role: button
    min_touch_target: 48dp
```

### Component: Secondary Button

```yaml
secondary_button:
  description: Less prominent actions
  
  properties:
    height: 48dp
    padding_horizontal: 20dp
    border_radius: 12dp
    background: transparent
    border: 1.5dp $color-text-secondary
    text_color: $color-text-secondary
    font: caption (medium weight)
    
  states:
    pressed:
      background: $color-border at 50%
```

### Component: Icon Button

```yaml
icon_button:
  description: Header icons, close buttons
  
  properties:
    size: 48dp (touch target)
    icon_size: 24dp
    background: transparent
    icon_color: $color-text-primary
    
  states:
    pressed:
      background: $color-border at 30%
      border_radius: full
```

### Component: Text Input

```yaml
text_input:
  description: Single-line text input
  
  properties:
    height: 56dp
    padding: 16dp
    border_radius: 12dp
    background: $color-surface
    border: 1dp $color-border
    font: body
    placeholder_color: $color-text-tertiary
    
  states:
    focused:
      border: 2dp $color-primary
      
    error:
      border: 2dp $color-error
      
  label:
    font: caption (medium)
    color: $color-text-secondary
    margin_bottom: 8dp
```

### Component: Toggle Switch

```yaml
toggle_switch:
  description: On/off toggle
  
  properties:
    track_width: 52dp
    track_height: 32dp
    thumb_size: 28dp
    
  states:
    off:
      track_color: $color-border
      thumb_color: white
      thumb_position: left
      
    on:
      track_color: $color-primary
      thumb_color: white
      thumb_position: right
      
  animation:
    duration: 200ms
    easing: spring
```

### Component: Habit Card

```yaml
habit_card:
  description: Main habit display card on home screen
  
  properties:
    padding: 16dp
    margin_horizontal: 16dp
    margin_vertical: 6dp
    border_radius: 16dp
    background: $color-surface
    shadow: card
    
  layout:
    - Row 1: [emoji, habit_name, streak_counter]
    - Row 2: [progress_bar_7_days]
    - Row 3: [spacer, checkbox]
    
  states:
    default:
      background: $color-surface
      
    completed:
      background: "linear-gradient(to right, $surface, habit_color @ 5%)"
      
    pressed:
      scale: 0.98
      shadow: subtle
```

### Component: Bottom Sheet

```yaml
bottom_sheet:
  description: Modal from bottom for selections/actions
  
  properties:
    background: $color-surface
    border_radius: 24dp 24dp 0 0
    max_height: 80vh
    
  handle:
    width: 36dp
    height: 4dp
    border_radius: 2dp
    background: $color-border
    margin_top: 12dp
    
  overlay:
    background: "rgba(0, 0, 0, 0.5)"
    
  animation:
    enter: slide_up, 300ms, ease-out
    exit: slide_down, 200ms, ease-in
    
  gesture:
    swipe_down: dismiss
    velocity_threshold: 500
```

### Component: Toast/Snackbar

```yaml
toast:
  description: Brief feedback messages
  
  properties:
    background: $color-text-primary
    text_color: white
    font: caption
    padding: 12dp 16dp
    border_radius: 8dp
    max_width: screen_width - 32dp
    position: bottom, 24dp from edge
    
  animation:
    enter: slide_up + fade, 200ms
    exit: fade, 150ms
    auto_dismiss: 3000ms
```

### Component: Empty State

```yaml
empty_state:
  description: Shown when no content available
  
  layout:
    - illustration (optional, 120dp)
    - title (headline font)
    - description (body, secondary color)
    - action_button (optional)
    
  properties:
    padding: 48dp horizontal
    text_align: center
    
  animation:
    enter: fade_in + scale(0.95 -> 1.0), 300ms
```

---

## ICON SET

```yaml
icons:
  navigation:
    - back: "arrow_left" or "chevron_left"
    - close: "x"
    - menu: "hamburger"
    - settings: "gear"
    - more: "dots_vertical"
    
  actions:
    - add: "plus"
    - edit: "pencil"
    - delete: "trash"
    - share: "share"
    - export: "download" or "upload"
    
  habits:
    - check: "checkmark"
    - streak: "fire" (ðŸ”¥)
    - reminder: "bell"
    - calendar: "calendar"
    
  feedback:
    - success: "check_circle"
    - error: "x_circle"
    - info: "info"
    
icon_style:
  stroke_width: 2dp
  default_size: 24dp
  touch_target: 48dp minimum
```

---

## ACCESSIBILITY GUIDELINES

```yaml
accessibility:
  touch_targets:
    minimum: 48dp x 48dp
    recommended: 56dp x 56dp
    
  color_contrast:
    normal_text: 4.5:1 minimum
    large_text: 3:1 minimum
    
  focus_indicators:
    style: 2dp ring, $color-primary
    offset: 2dp from element
    
  reduce_motion:
    respect: prefers-reduced-motion
    fallback: instant transitions, no confetti
    
  screen_reader:
    all_interactive_elements: labeled
    images: contentDescription
    buttons: role + action
    
  font_scaling:
    support: up to 200%
    test_at: 100%, 130%, 200%
```

---

## RESPONSIVE CONSIDERATIONS

```yaml
breakpoints:
  small_phone: < 360dp width
  phone: 360-600dp width
  tablet: > 600dp width
  
adaptations:
  small_phone:
    - Reduce horizontal margins (12dp)
    - Smaller habit cards
    - Stack buttons vertically
    
  tablet:
    - Max content width: 600dp
    - 2-column habit grid option
    - Side-by-side stats
    
orientation:
  portrait: primary layout
  landscape:
    - Scroll for content
    - 3-column calendar on tablet
```

---

## FILE NAMING CONVENTIONS

```yaml
screens:
  pattern: "{flow}_{screen_name}"
  examples:
    - onboarding_welcome
    - onboarding_habit_select
    - home_screen
    - habit_detail
    - add_habit
    - settings

components:
  pattern: "{type}_{name}"
  examples:
    - button_primary
    - card_habit
    - input_text
    - modal_bottom_sheet

assets:
  icons: "ic_{name}.svg"
  illustrations: "il_{name}.svg"
  animations: "anim_{name}.json"
```

---

*End of UX Design Specification - Stribe v1.0*