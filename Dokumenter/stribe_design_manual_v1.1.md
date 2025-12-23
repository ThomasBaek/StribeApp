# Stribe - Design Manual v1.1
## Fleksibel Frekvens & Ugedage

**Version**: 1.1
**Dato**: 23. december 2025
**Ændringer**: Tilføjet daglige gentagelser og ugedag-planlægning

---

## Oversigt over Ændringer i v1.1

### Nye Funktioner
1. **Daglige gentagelser**: Vaner kan sættes til 1-99 gange per dag
2. **Ugedag-planlægning**: Vaner kan konfigureres til specifikke ugedage
3. **Progress tracking**: Multi-completion visualisering med progress ring

### Design Implikationer
- Nyt UI: Daily Target Picker (stepper component)
- Nyt UI: Weekday Picker (7 toggle buttons)
- Opdateret UI: Habit Card (nu med to varianter)
- Opdateret flow: Onboarding inkluderer nu frekvens-konfiguration

---

## 1. Data Model Udvidelser

### 1.1 Habit Model (v1.1)

```csharp
public class Habit
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Emoji { get; set; }
    public string Color { get; set; }
    public string? ReminderTime { get; set; }

    // NYE FELTER v1.1
    public int DailyTargetCount { get; set; } = 1;        // 1-99 gange per dag
    public string ActiveDays { get; set; } = "1111111";   // Bitmask Mon-Sun

    public DateTime CreatedAt { get; set; }
    public bool IsArchived { get; set; }
    public int SortOrder { get; set; }
}
```

**DailyTargetCount**:
- **Type**: int
- **Range**: 1-99
- **Default**: 1
- **Beskrivelse**: Hvor mange gange per dag vanen skal gennemføres
- **Eksempel**: 8 for "Drik 8 glas vand"

**ActiveDays**:
- **Type**: string (bitmask)
- **Length**: 7 characters
- **Format**: "MTWTFSS" (Monday-Sunday)
- **Default**: "1111111" (hver dag)
- **Beskrivelse**: Hvilke ugedage vanen gælder
- **Eksempler**:
  - `"1111111"` = Hver dag (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
  - `"1111100"` = Hverdage (Mon-Fri)
  - `"0000011"` = Weekend (Sat-Sun)
  - `"1010100"` = Mandag, Onsdag, Fredag

### 1.2 Completion Model (v1.1)

```csharp
public class Completion
{
    public string Id { get; set; }
    public string HabitId { get; set; }
    public string Date { get; set; }  // "yyyy-MM-dd"

    // NYT FELT v1.1
    public int Count { get; set; } = 1;  // Antal completions denne dag

    public DateTime CompletedAt { get; set; }
}
```

**Count**:
- **Type**: int
- **Range**: 0-99 (matches DailyTargetCount max)
- **Default**: 1
- **Beskrivelse**: Hvor mange gange vanen er gennemført på denne dato
- **Eksempel**: Hvis target er 8, count kan være 0-8

### 1.3 Business Logic

**IsActiveOnDay(date)**:
```csharp
public bool IsActiveOnDay(DateTime date)
{
    int dayIndex = (int)date.DayOfWeek;
    dayIndex = dayIndex == 0 ? 6 : dayIndex - 1; // Sunday=0 → 6
    return ActiveDays[dayIndex] == '1';
}
```

**IsCompletedForDay(count, target)**:
```csharp
public bool IsCompletedForDay(int count, int target)
{
    return count >= target;
}
```

**GetActiveDaysLabel(activeDays)**:
```csharp
public string GetActiveDaysLabel(string activeDays)
{
    if (activeDays == "1111111") return "Hver dag";
    if (activeDays == "1111100") return "Hverdage";
    if (activeDays == "0000011") return "Weekend";

    int activeCount = activeDays.Count(d => d == '1');
    return $"{activeCount} dage/uge";
}
```

---

## 2. Nye UI Komponenter

### 2.1 Daily Target Picker

**Formål**: Lad bruger vælge antal daglige gentagelser (1-99)

**Design**:
```
┌─────────────────────────────────┐
│ Hvor mange gange om dagen?      │
├─────────────────────────────────┤
│                                 │
│      [ - ]    8    [ + ]        │
│                                 │
└─────────────────────────────────┘
```

**Specifikationer**:
- **Type**: Stepper (increment/decrement buttons)
- **Layout**: Horizontal
  - Minus button (left)
  - Value display (center, large)
  - Plus button (right)
- **Range**: 1-99
- **Default**: 1
- **Buttons**:
  - Size: 48x48 dp (minimum touch target)
  - Style: Outlined circle
  - Color: Primary color
  - Icons: "−" and "+"
- **Value Display**:
  - Font: Display (32sp, bold)
  - Color: TextPrimary
  - Width: 80dp (center-aligned)
- **Behavior**:
  - Tap [ - ]: Decrement (minimum 1)
  - Tap [ + ]: Increment (maximum 99)
  - At boundaries: Button becomes disabled (opacity 0.3)
- **Accessibility**:
  - Label: "Dagligt mål"
  - Announce: "{number} gange per dag"

**Usage Context**:
- Add Habit Page
- Edit Habit Page
- (Optional) Quick-edit modal

---

### 2.2 Weekday Picker

**Formål**: Lad bruger vælge hvilke ugedage vanen gælder

**Design**:
```
┌─────────────────────────────────────┐
│ Hvilke dage?                        │
├─────────────────────────────────────┤
│                                     │
│  ┌───┬───┬───┬───┬───┬───┬───┐     │
│  │ M │ T │ O │ T │ F │ L │ S │     │
│  │ ● │ ● │ ● │ ● │ ● │ ○ │ ○ │     │
│  └───┴───┴───┴───┴───┴───┴───┘     │
│                                     │
│  [Hver dag] [Hverdage] [Weekend]   │
│                                     │
└─────────────────────────────────────┘
```

**Specifikationer**:

**Day Toggle Buttons**:
- **Layout**: Horizontal grid (7 columns)
- **Size**: 44x60 dp each
- **Spacing**: 4dp gap
- **Labels**: M, T, O, T, F, L, S (Ma, Ti, On, To, Fr, Lø, Sø)
- **States**:
  - **Selected**: Filled circle (●), Primary color background, White text
  - **Unselected**: Empty circle (○), Border only, TextSecondary
- **Animation**: Scale 0.95 → 1.0 on tap (100ms)
- **Behavior**: Toggle on/off ved tap
- **Minimum**: Mindst 1 dag skal være valgt (disable if trying to deselect last)

**Quick-Select Buttons**:
- **Layout**: Horizontal row, 3 buttons
- **Type**: Outlined chips
- **Labels**:
  - "Hver dag" → Sets `"1111111"`
  - "Hverdage" → Sets `"1111100"`
  - "Weekend" → Sets `"0000011"`
- **Size**: Auto-width, 36dp height
- **Style**: Secondary button style
- **Spacing**: 8dp gap
- **Behavior**: Tap overrides current selection

**Default State**: Alle dage valgt ("1111111")

**Accessibility**:
- Each day button: "Mandag", "Tirsdag", etc.
- State announced: "Selected" / "Not selected"
- Quick-select: "Vælg alle dage", "Vælg kun hverdage", "Vælg kun weekend"

**Usage Context**:
- Add Habit Page
- Edit Habit Page
- Onboarding (after habit selection)

---

### 2.3 Progress Ring Component

**Formål**: Visualiser delvis completion for habits med DailyTargetCount > 1

**Design**:
```
     ╭─────────╮
    ╱  3  /  8  ╲    ← Text shows current/target
   │             │
   │   ████▒▒▒   │   ← Ring shows progress
   │             │
    ╲           ╱
     ╰─────────╯
```

**Specifikationer**:

**Ring**:
- **Size**: 56x56 dp (default)
- **Stroke Width**: 4dp
- **Colors**:
  - Background ring: Border color (#E8E8EC)
  - Progress ring: Habit color (from Habit.Color)
- **Progress Calculation**: `current / target` (0.0 - 1.0)
- **Animation**: Smooth transition on count change (200ms ease-out)
- **Cap Style**: Round (strokeLinecap)

**Center Text**:
- **Format**: "{current}/{target}"
- **Font**: Bold, 14sp
- **Color**:
  - Incomplete: TextSecondary
  - Complete (count >= target): White text on colored background circle
- **Complete State**:
  - Background circle fills with habit color
  - Checkmark icon (✓) replaces numbers

**Interaction**:
- **Tap**: Increment count (same as toggle logic)
- **Visual Feedback**: Scale 0.95 → 1.0 (100ms)
- **Haptic**: Light impact on iOS/Android

**Variants**:
- **Small**: 44x44 dp (for compact views)
- **Large**: 72x72 dp (for detail screens)

**States**:
1. **Empty** (count = 0):
   - Gray ring, "0/8" text
2. **Partial** (0 < count < target):
   - Colored ring partial fill, "3/8" text
3. **Complete** (count >= target):
   - Full colored ring + filled center circle, "✓" icon
4. **Over-complete** (count > target):
   - Shows as complete (count = target in display)

**Usage Context**:
- Habit Card (when DailyTargetCount > 1)
- Habit Detail Page
- Home screen habit list

---

## 3. Opdaterede Komponenter

### 3.1 Habit Card (Updated)

**To Varianter**:

**Variant A: Simple Checkbox** (DailyTargetCount = 1)
```
┌──────────────────────────────────┐
│ 🏃 Motion          🔥 14    [ ] │
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░       │
│ Hver dag                         │
└──────────────────────────────────┘
```

**Variant B: Progress Ring** (DailyTargetCount > 1)
```
┌──────────────────────────────────┐
│ 💧 Drik vand       🔥 7    (●)  │
│                            3/8   │
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░       │
│ Hver dag                         │
└──────────────────────────────────┘
```

**Specifikationer**:

**Header**:
- Emoji (left, 32sp)
- Name (Title style, 18sp)
- Streak indicator (if > 0): 🔥 + number
- **Right Control**:
  - If DailyTargetCount = 1: Checkbox (48x48 dp)
  - If DailyTargetCount > 1: Progress Ring (56x56 dp)

**Week Progress Bar**:
- 7 segments (4dp height each)
- Gap: 4dp between segments
- Colors:
  - Completed: Habit color
  - Incomplete: Border color
  - Inactive day: Hidden (Option A from questions)
- **Note**: For habits with ActiveDays ≠ "1111111", only show active day segments

**Active Days Indicator** (Bottom):
- Small text (12sp, TextTertiary)
- Shows: "Hver dag", "Hverdage", "Weekend", or "{n} dage/uge"
- Only shown if ActiveDays ≠ "1111111"

**Layout Adjustments**:
- If progress ring: Increase right padding to accommodate larger component
- Week bar width adjusts based on number of active days

---

### 3.2 Onboarding Flow (Updated)

**Ny Step efter Habit Selection**:

```
Step 2A: Habit Selection (unchanged)
    ↓
Step 2B: Frequency Configuration (NEW)
    ↓
Step 3: Reminder Setup (unchanged)
```

**Step 2B: Frequency Configuration**

```
┌─────────────────────────────────────┐
│  ← Tilbage                   2/3    │
├─────────────────────────────────────┤
│                                     │
│   "Tilpas dine vaner"               │
│        [HEADLINE]                   │
│                                     │
│   Vise valgte habits i liste:      │
│                                     │
│   ┌───────────────────────────────┐ │
│   │ 🏃 Motion                     │ │
│   │                               │ │
│   │ Hvor ofte?                    │ │
│   │   [ - ]    1    [ + ]         │ │
│   │                               │ │
│   │ Hvilke dage?                  │ │
│   │ [M][T][O][T][F][L][S]         │ │
│   │ [Hver dag][Hverdage][Weekend] │ │
│   └───────────────────────────────┘ │
│                                     │
│   ┌───────────────────────────────┐ │
│   │ 💧 Drik vand                  │ │
│   │ (samme struktur)              │ │
│   └───────────────────────────────┘ │
│                                     │
│        [Spring over →]              │
│        [Fortsæt →]                  │
│                                     │
└─────────────────────────────────────┘
```

**Specifikationer**:
- **Headline**: "Tilpas dine vaner" (24sp, bold)
- **Subtext**: "Du kan altid ændre dette senere"
- **List**: Each selected habit gets a card with:
  - Habit name + emoji (top)
  - Daily Target Picker
  - Weekday Picker (collapsed by default)
- **Default Values**:
  - DailyTargetCount: 1
  - ActiveDays: "1111111"
- **Buttons**:
  - "Spring over →" (secondary) - Uses defaults for all
  - "Fortsæt →" (primary) - Saves custom values
- **Behavior**:
  - User can expand/configure each habit
  - Or just skip with defaults

---

## 4. Add/Edit Habit Pages (Updated)

### 4.1 Add Habit Page - New Layout

```
┌─────────────────────────────────────┐
│ ← Ny vane                      Gem  │
├─────────────────────────────────────┤
│                                     │
│   Navn                              │
│   ┌───────────────────────────┐     │
│   │ Drik vand                 │     │
│   └───────────────────────────┘     │
│                                     │
│   Vælg ikon                         │
│   ┌───┬───┬───┬───┬───┬───┐        │
│   │🏃│📚│🧘│💧│🥗│💊│ (etc...)    │
│   └───┴───┴───┴───┴───┴───┘        │
│                                     │
│   Vælg farve                        │
│   [●][●][●][●][●][●]                │
│                                     │
│   ─────────────────────────────     │
│                                     │
│   Hvor ofte?                        │
│      [ - ]    8    [ + ]            │
│   (Tip: fx 8 glas vand)             │
│                                     │
│   ─────────────────────────────     │
│                                     │
│   Hvilke dage?                      │
│   [M][T][O][T][F][L][S]             │
│   [Hver dag][Hverdage][Weekend]     │
│                                     │
│   ─────────────────────────────     │
│                                     │
│   Påmindelse                        │
│   ┌───────────────────────────┐     │
│   │  🕘  09:00           ▼    │     │
│   └───────────────────────────┘     │
│                                     │
│        [ Gem vane ]                 │
│                                     │
└─────────────────────────────────────┘
```

**Nye Sektioner**:
1. **Hvor ofte?** (Daily Target Picker)
   - Mellem "Farve" og "Hvilke dage"
   - Help text: "(Tip: fx 8 glas vand)" hvis > 1
2. **Hvilke dage?** (Weekday Picker)
   - Mellem "Hvor ofte" og "Påmindelse"
   - Dividers (horizontal lines) omkring frequency section

**Validation**:
- Name: Required, max 50 chars
- Emoji: Required (default ⭐)
- Color: Required (default HabitGreen)
- DailyTargetCount: 1-99
- ActiveDays: Mindst 1 dag selected
- ReminderTime: Optional

**Gem Button Behavior**:
- Validate fields
- Create Habit object
- Save via HabitService
- Navigate back to home
- Show toast: "Vane oprettet!" (optional)

### 4.2 Edit Habit Page

**Layout**: Identisk med Add Habit Page

**Differences**:
- Title: "Rediger vane" (instead of "Ny vane")
- Fields pre-populated with existing values
- Additional button: "Slet vane" (bottom, destructive style)
- Gem button: "Gem ændringer"

---

## 5. Streak & Statistics Updates

### 5.1 Streak Calculation (Updated Algorithm)

**Regel**: Kun aktive dage tæller i streak

```
streak = 0
currentDate = Today

while (currentDate >= habit.CreatedAt):
    if NOT IsActiveOnDay(habit, currentDate):
        currentDate = currentDate - 1 day
        continue  // Skip inactive days

    completion = GetCompletion(habit, currentDate)
    if completion == null OR completion.Count < habit.DailyTargetCount:
        break  // Streak broken

    streak++
    currentDate = currentDate - 1 day

return streak
```

**Eksempel**:
- Habit: "Træning" kun Mandag, Onsdag, Fredag (`"1010100"`)
- Completed: Man (✓), Tir (skip), Ons (✓), Tor (skip), Fre (✓)
- Streak: **3 dage** (Mon, Wed, Fri)

### 5.2 Streak Visualization

**Display Format**: "14 day streak" (Answer confirmed)
- Altid vis antal dage (ikke "2 week streak")
- Dansk: "14 dage i træk"
- Engelsk: "14 day streak"

**Icon**: 🔥 (fire emoji)

**Colors** (based on length):
- 1-6 dage: TextSecondary
- 7-20 dage: StreakMedium (#F5A623)
- 21+ dage: StreakFire (#FF6B35)

### 5.3 Completion Rate Calculation

**Updated Formula**:
```
activeDaysInPeriod = Count of days where IsActiveOnDay() = true
completedActiveDays = Count of active days where Count >= Target
completionRate = completedActiveDays / activeDaysInPeriod
```

**Eksempel**:
- Habit: Weekdays only, 30 days periode
- Active days in 30 days: ~21 days (Mon-Fri)
- Completed: 18 days
- Rate: 18/21 = 85.7%

---

## 6. Inactive Day Handling

**Design Decision (Answer A)**: Hide completely

**Implementation**:

**Home Screen**:
- `GetHabitsForDateAsync(date)` returns only habits where `IsActiveOnDay(date) == true`
- Result: Inactive habits don't appear in list at all

**Habit Detail Screen**:
- Calendar heatmap: Inactive days shown as blank/empty (not gray, not X)
- Week progress bar: Only shows active day segments

**Implications**:
- Cleaner, less cluttered home screen
- Users only see what's relevant for today
- Reduces decision fatigue

---

## 7. Partial Completion UX

**Design Decision (Answer confirmed)**: Vane er KUN completed hvis Count >= DailyTargetCount

**Rules**:
- 3/8 completions → **IKKE** completed for streak
- Habit card shows progress (3/8) men er ikke "done"
- Week bar shows incomplete (empty segment)
- Streak breaks if day ends with partial completion

**Rationale**:
- Clear, binary success criteria
- Prevents "good enough" mindset
- Encourages full commitment to target

**Future Consideration (v2)**:
- Could add "grace mode" hvor 80% counts
- But MVP: All or nothing (KISS principle)

---

## 8. Design Tokens Updates

### New Colors (if needed)

```yaml
# Existing colors remain
Primary: #2D5A4A
Success: #4CAF7A
...

# New/Updated
ProgressRingBackground: #E8E8EC  # For unfilled ring
ProgressIncomplete: #8A8AA3      # For partial completion text
```

### New Spacing Values

```yaml
space_stepper: 12dp  # Gap between stepper buttons and value
space_weekday: 4dp   # Gap between weekday toggle buttons
```

---

## 9. Accessibility Considerations

### Daily Target Picker
- Accessibility Label: "Dagligt mål: {number} gange"
- Increment: "Forøg dagligt mål"
- Decrement: "Reducer dagligt mål"
- Announce on change: "{number} gange per dag"

### Weekday Picker
- Each button: "{Day name}, {Selected/Not selected}"
- Quick-select: "Vælg {preset}"
- Announce on change: "{X} dage valgt"

### Progress Ring
- Label: "{Habit name}, {current} af {target} gennemført"
- Complete state: "{Habit name}, mål nået"
- Tap hint: "Tryk for at øge antal"

---

## 10. Implementation Checklist

### Models
- [x] Add `DailyTargetCount` to Habit model
- [x] Add `ActiveDays` to Habit model
- [x] Add `Count` to Completion model

### Components (New)
- [ ] DailyTargetPicker.xaml
- [ ] WeekdayPicker.xaml
- [ ] ProgressRing.xaml

### Components (Updated)
- [ ] HabitCard.xaml - Add progress ring variant
- [ ] HabitCard.xaml.cs - Conditional rendering logic

### Pages (Updated)
- [ ] AddHabitPage.xaml - Add frequency pickers
- [ ] AddHabitPage.xaml.cs - Handle new fields
- [ ] EditHabitPage.xaml - Add frequency pickers
- [ ] OnboardingHabitsPage.xaml - Add frequency config step

### Services
- [ ] HabitService.CalculateStreakAsync() - ActiveDays aware
- [ ] HabitService.GetHabitsForDateAsync() - Filter by ActiveDays
- [ ] HabitService.ToggleCompletionAsync() - Handle Count increment

### ViewModels
- [ ] AddHabitViewModel - New properties
- [ ] EditHabitViewModel - New properties
- [ ] HomeViewModel - Use updated service methods

---

## 11. Testing Scenarios

### Frequency Features
1. **Daily Target = 1** (traditional habit)
   - Toggle once → Complete
   - Toggle again → Incomplete
   - Verify checkbox behavior unchanged

2. **Daily Target = 8** (multi-completion)
   - Toggle 1-7 times → Shows progress
   - Toggle 8 times → Complete
   - Toggle 9 times → Resets to 0

3. **Weekdays Only**
   - Saturday: Habit doesn't appear in list
   - Monday: Habit appears and can be completed
   - Streak skips weekends correctly

4. **Weekend Only**
   - Monday-Friday: Habit hidden
   - Saturday: Habit appears
   - Streak only counts Sat/Sun

### Edge Cases
1. Habit created today with ActiveDays excluding today → Not shown
2. Habit with 1 active day (e.g., only Monday) → Shows correctly
3. Change ActiveDays mid-week → Existing completions preserved
4. Change DailyTargetCount → Existing count preserved (may be > new target)

---

**Document Version**: 1.1
**Last Updated**: 2025-12-23
**Next Review**: After Phase 3 implementation
