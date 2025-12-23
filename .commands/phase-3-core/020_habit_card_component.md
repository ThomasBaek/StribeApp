# Command 020: HabitCard Component

## Metadata
- **ID:** 020
- **Fase:** 3 - Core
- **Estimeret tid:** 4-5 timer
- **Afhængigheder:** 001, 002, 003, 015
- **Design reference:** stribe-design/components/HABIT_CARD.md

## Analyse

### Hvad skal implementeres
HabitCard er den mest kritiske UI komponent i hele appen. Den vises på home screen for hver habit og indeholder emoji, navn, streak counter, week progress bar og checkbox.

### Filer der oprettes/ændres
- `src/Stribe/Controls/HabitCard.xaml` - Card layout
- `src/Stribe/Controls/HabitCard.xaml.cs` - Component logic
- `src/Stribe/Converters/BoolToColorConverter.cs` - For week progress
- `src/Stribe/Converters/StreakToVisibilityConverter.cs` - Hide/show fire emoji

### Design specifikationer
Fra HABIT_CARD.md:

**Structure:**
```
┌────────────────────────────────────┐
│ [emoji 40dp] [Name]      🔥[streak]│  Row 1: Header
│                                    │
│ [████████░░░░░░░░░░░░░░]          │  Row 2: Week progress (7 segments)
│                                    │
│                          [   ○   ] │  Row 3: Checkbox (44dp)
└────────────────────────────────────┘
```

**Props needed:**
- Habit object (Id, Name, Emoji, Color)
- IsCompleted: bool
- CurrentStreak: int
- WeekCompletions: bool[7] (Mon-Sun)
- IsToday: bool (affects interactivity)
- OnTapCard: EventHandler (navigate to detail)
- OnTapCheckbox: EventHandler (toggle completion)

**States:**
- Uncompleted: Empty circle checkbox
- Completed: Filled green checkbox with ✓
- Past day (read-only): Grayed out, "Misset" text instead of checkbox

**Animations:**
- Checkbox tap: Scale 1.0 → 1.3 → 1.0 with bounce (250ms)
- Card tap: Scale 0.98 (press feedback)
- Streak update: Number flip animation

### Tekniske overvejelser
- Custom Control (ContentView) med Bindable Properties
- Week progress: 7 BoxViews med gap 4dp, rounded corners
- Checkbox hit area: minimum 44x44dp
- Card shadow: use Frame eller Border with shadow
- Touch gestures: TapGestureRecognizer for both card and checkbox

## Implementering

### Prompt til Claude Code
```
Implementer HabitCard custom control for Stribe:

1. **Opret Controls/HabitCard.xaml**:
- ContentView som root
- Frame/Border som container (shadow, rounded corners 12dp)
- Grid med 3 rows:
  * Row 0 (Header): HorizontalStackLayout med:
    - Border med emoji (40x40, rounded 8dp, background med habit color 15% opacity)
    - Label for habit name (18sp, semibold)
    - Spacer (fills)
    - Fire emoji 🔥 (visible når streak > 0)
    - Streak count label (18sp, bold, orange #F5A623)
  * Row 1 (Week progress): HorizontalStackLayout med 7 BoxViews:
    - Hver 4dp høj, flex 1, rounded 4dp
    - Farve baseret på completion (habit color eller border color)
  * Row 2 (Action): HorizontalStackLayout, align right:
    - Checkbox circle (28dp diameter, 2dp border)
    - Filled with checkmark når completed

2. **Controls/HabitCard.xaml.cs** skal have:
- BindableProperty for hver prop:
```csharp
public static readonly BindableProperty HabitProperty = BindableProperty.Create(
    nameof(Habit), typeof(Habit), typeof(HabitCard), propertyChanged: OnHabitChanged);

public Habit Habit
{
    get => (Habit)GetValue(HabitProperty);
    set => SetValue(HabitProperty, value);
}
// + IsCompleted, CurrentStreak, WeekCompletions, IsToday
```
- TapGestureRecognizers:
  * Card body → OnCardTapped event
  * Checkbox → OnCheckboxTapped event
- OnHabitChanged callback for updating UI elements

3. **Converters/BoolToColorConverter.cs**:
```csharp
public class BoolToColorConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        var isCompleted = (bool)value;
        var habitColor = parameter as Color ?? Colors.Green;
        return isCompleted ? habitColor : Color.FromArgb("#E5EBE8");
    }
    public object ConvertBack(...) => throw new NotImplementedException();
}
```

4. **Brug i HomePage.xaml** (eksempel):
```xaml
<controls:HabitCard
    Habit="{Binding .}"
    IsCompleted="{Binding IsTodayCompleted}"
    CurrentStreak="{Binding CurrentStreak}"
    WeekCompletions="{Binding WeekCompletions}"
    IsToday="True"
    CardTapped="OnHabitCardTapped"
    CheckboxTapped="OnCheckboxTapped" />
```

Reference complete spec: stribe-design/components/HABIT_CARD.md
Brug Colors.xaml og Styles.xaml tokens.
```

### Forventet resultat
- HabitCard control kan genbruges på home screen
- Viser alle elementer korrekt (emoji, name, streak, week bar, checkbox)
- Touch gestures virker for både card og checkbox
- Responsive og pæn på alle skærmstørrelser

### Verifikation

#### Automatiske tests
```bash
dotnet build src/Stribe/Stribe.csproj
```

#### Manuelle tests
- [ ] Card vises med korrekt layout
- [ ] Emoji og navn fra habit object vises
- [ ] Streak counter vises når > 0
- [ ] Week progress bar viser 7 segmenter med correct colors
- [ ] Checkbox tom når not completed
- [ ] Checkbox filled med checkmark når completed
- [ ] Tap på card body trigger CardTapped event
- [ ] Tap på checkbox trigger CheckboxTapped event
- [ ] Past day variant viser "Misset" text korrekt

### Acceptkriterier
- [ ] HabitCard.xaml med korrekt layout struktur
- [ ] Alle BindableProperties defineret
- [ ] Gesture recognizers fungerer separat
- [ ] Converters oprettet og virker
- [ ] Component kan bruges i CollectionView
- [ ] Build succeeds

## Status
- [ ] Analyse gennemført
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
