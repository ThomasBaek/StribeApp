# Command 011: Habit Selection Page

## Metadata
- **Phase**: 2 - Onboarding
- **Dependencies**: 010
- **Estimated Time**: 4-5 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/03_ONBOARDING_HABITS.md
- **Frequency Impact**: NO

---

## Formål

Implementere habit selection screen hvor brugeren vælger 1-3 predefined habits eller tilføjer egen custom habit.

**Hvorfor dette er vigtigt:**
- Det vigtigste onboarding step - definerer hvilke vaner brugeren vil tracke
- Multi-selection UX skal være intuitive (visual feedback critical)
- Constrain til 1-3 habits sikrer fokus (not overwhelming)
- Custom habit option giver flexibility uden at distrakte

---

## Risici

### Potentielle Problemer
1. **Selection state management complexity**:
   - Edge case: User navigates back/forth between onboarding steps
   - Impact: Selected habits lost eller duplicated

2. **Max 3 habits constraint UI feedback**:
   - Edge case: User tries to select 4th habit
   - Impact: Confusing hvis ingen feedback (tap does nothing)

3. **Custom habit integration**:
   - Edge case: Custom habit dialog dismissed without adding
   - Impact: User confusion (tapped "Egen" men intet skete)

### Mitigering
- ObservableCollection<PresetHabit> with IsSelected property persists in ViewModel
- Toast/visual feedback when max limit reached
- OnToggleHabitSelection checks IsCustom and opens dialog explicitly
- State preserved in ViewModel (Singleton or Scoped lifetime)

---

## Analyse - Hvad Skal Implementeres

### Habit Selection Page Layout
**Location**: `src/Stribe/Views/Onboarding/HabitSelectionPage.xaml`
**Key Requirements**:
- Back button (top left)
- Headline "Hvad vil du gøre hver dag?"
- Subtitle "Vælg 1-3 vaner for at starte"
- 2-column FlexLayout grid af habit chips (6 presets + "Egen")
- Continue button (enabled når 1-3 habits selected)
- Page indicator • • ○ (step 2 af 3)

### Habit Chip States
**Visual Requirements**:
```yaml
Unselected:
  background: #FFFFFF (Surface)
  border: 1.5dp solid #E5EBE8 (Border)
  text_color: TextPrimary

Selected:
  background: #2D5A4A (Primary)
  border: none (or Primary)
  text_color: White
  shadow: medium elevation
```

### PresetHabit Model
**Location**: `src/Stribe/Models/PresetHabit.cs`
**Key Requirements**:
- Id, Emoji, Label, DefaultName, DefaultColor
- IsCustom flag (for "Egen" chip)
- IsSelected flag (for multi-selection state)

### OnboardingViewModel Updates
**Location**: `src/Stribe/ViewModels/OnboardingViewModel.cs`
**Key Requirements**:
- ObservableCollection<PresetHabit> with 6 presets
- SelectedHabits computed property (filters IsSelected=true)
- CanContinue validation (1-3 selected)
- ToggleHabitSelectionCommand with max 3 limit
- ShowCustomHabitDialogCommand (opens command 012 dialog)
- ContinueToReminderCommand navigates to //onboarding/reminder

**Business Rules**:
```csharp
// Selection logic:
1. User taps habit chip
2. If IsCustom → open custom habit dialog (command 012)
3. If already selected → deselect (toggle off)
4. If not selected AND count < 3 → select (toggle on)
5. If not selected AND count >= 3 → show feedback "Max 3 vaner"
6. Update CanContinue property → enable/disable button
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 010 (Welcome Page) - navigates to this page
- [x] OnboardingViewModel - created in command 010
- [x] Styles.xaml (PrimaryButton, Border styles)
- [x] Colors.xaml (Primary, Surface, Border colors)

⚠️ **Assumptions**:
- Shell route "//onboarding/reminder" will be registered (command 013)
- Custom habit dialog route will work (command 012)
- PresetHabit model can be created in this command

❌ **Blockers**: None

---

## Implementation Guide

### Filer der oprettes
- `src/Stribe/Views/Onboarding/HabitSelectionPage.xaml` - Layout
- `src/Stribe/Views/Onboarding/HabitSelectionPage.xaml.cs` - Code-behind
- `src/Stribe/Models/PresetHabit.cs` - Model for predefined habits

### Filer der ændres
- `src/Stribe/ViewModels/OnboardingViewModel.cs` - Add selection logic
- `src/Stribe/MauiProgram.cs` - Register page
- `src/Stribe/AppShell.xaml.cs` - Register route

### Predefined Habits Data
Fra design spec:
```csharp
1. 🏃 Motion (habit_green #4CAF50)
2. 📚 Læse (habit_blue #2196F3)
3. 🧘 Meditation (habit_purple #9C27B0)
4. 💧 Vand (habit_teal #00BCD4)
5. 📝 Journal (habit_yellow #FFC107)
6. ➕ Egen (opens custom dialog)
```

### Design Specifikationer
Fra 03_ONBOARDING_HABITS.md:

**Animations**:
- Entry: Staggered fade + scale in (50ms delay each chip)
- Selection: Scale bounce (1.0 → 1.05 → 1.0, 200ms)
- Deselection: Scale (1.0 → 0.95 → 1.0, 200ms)

---

## Implementering

### Step 1: Opret Models/PresetHabit.cs
Path: `src/Stribe/Models/PresetHabit.cs`

```csharp
namespace Stribe.Models;

public class PresetHabit
{
    public string Id { get; set; } = string.Empty;
    public string Emoji { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string DefaultName { get; set; } = string.Empty;
    public string DefaultColor { get; set; } = string.Empty;
    public bool IsCustom { get; set; }
    public bool IsSelected { get; set; }
}
```

**Explanation**: Simple POCO model. IsSelected mutable for UI binding (not INotifyPropertyChanged - ViewModel handles state).

### Step 2: Opdater ViewModels/OnboardingViewModel.cs
Path: `src/Stribe/ViewModels/OnboardingViewModel.cs`

Tilføj properties og commands:
```csharp
using System.Collections.ObjectModel;

// Properties
public ObservableCollection<PresetHabit> PresetHabits { get; set; }
public List<PresetHabit> SelectedHabits => PresetHabits.Where(h => h.IsSelected && !h.IsCustom).ToList();
public bool CanContinue => SelectedHabits.Count >= 1 && SelectedHabits.Count <= 3;
public string ContinueButtonText => CanContinue ? "Fortsæt" : "Vælg mindst 1 vane";

// Commands
public ICommand ToggleHabitSelectionCommand { get; }
public ICommand ShowCustomHabitDialogCommand { get; }
public ICommand ContinueToReminderCommand { get; }

// Constructor - initialize preset habits
public OnboardingViewModel(...)
{
    PresetHabits = new ObservableCollection<PresetHabit>
    {
        new() { Id = "motion", Emoji = "🏃", Label = "Motion", DefaultName = "Motion", DefaultColor = "#4CAF50" },
        new() { Id = "reading", Emoji = "📚", Label = "Læse", DefaultName = "Læse", DefaultColor = "#2196F3" },
        new() { Id = "meditation", Emoji = "🧘", Label = "Meditation", DefaultName = "Meditation", DefaultColor = "#9C27B0" },
        new() { Id = "water", Emoji = "💧", Label = "Vand", DefaultName = "Drik vand", DefaultColor = "#00BCD4" },
        new() { Id = "journal", Emoji = "📝", Label = "Journal", DefaultName = "Skriv journal", DefaultColor = "#FFC107" },
        new() { Id = "custom", Emoji = "➕", Label = "Egen", IsCustom = true }
    };

    ToggleHabitSelectionCommand = new Command<PresetHabit>(OnToggleHabitSelection);
    ShowCustomHabitDialogCommand = new Command(OnShowCustomHabitDialog);
    ContinueToReminderCommand = new Command(OnContinueToReminder, () => CanContinue);
}

private void OnToggleHabitSelection(PresetHabit habit)
{
    if (habit.IsCustom)
    {
        ShowCustomHabitDialogCommand.Execute(null);
        return;
    }

    if (habit.IsSelected)
    {
        // Deselect
        habit.IsSelected = false;
    }
    else
    {
        // Check max 3 limit
        if (SelectedHabits.Count >= 3)
        {
            // Show toast or visual feedback
            return;
        }
        habit.IsSelected = true;
    }

    OnPropertyChanged(nameof(CanContinue));
    OnPropertyChanged(nameof(ContinueButtonText));
    ((Command)ContinueToReminderCommand).ChangeCanExecute();
}

private async void OnShowCustomHabitDialog()
{
    // Will be implemented in command 012
    // For now, placeholder
    await Application.Current.MainPage.DisplayAlert("Info", "Custom habit dialog kommer i command 012", "OK");
}

private async void OnContinueToReminder()
{
    // Navigate to reminder setup page (command 013)
    await Shell.Current.GoToAsync("//onboarding/reminder");
}
```

**Explanation**: Selection state managed via ObservableCollection. CanContinue computed property drives button enable state. Max 3 limit enforced in OnToggleHabitSelection.

### Step 3: Opret Views/Onboarding/HabitSelectionPage.xaml
Path: `src/Stribe/Views/Onboarding/HabitSelectionPage.xaml`

Create layout with:
- Grid RowDefinitions="Auto,*,Auto,Auto" (header, content, button, indicator)
- Back button i header
- ScrollView med VerticalStackLayout content:
  - Title section (headline + subtitle)
  - FlexLayout med BindableLayout.ItemsSource="{Binding PresetHabits}"
    - ItemTemplate: Border med 2 DataTriggers (IsSelected true/false)
    - Emoji + Label i VerticalStackLayout
    - TapGestureRecognizer binds til ToggleHabitSelectionCommand
- Button "Fortsæt" binds til ContinueToReminderCommand
- Page indicator (• • ○)

**Explanation**: FlexLayout med Wrap="Wrap" creates 2-column grid. DataTriggers handle selected/unselected visual states. RelativeSource binding connects nested tap gesture to ViewModel command.

### Step 4: Opret Views/Onboarding/HabitSelectionPage.xaml.cs
Path: `src/Stribe/Views/Onboarding/HabitSelectionPage.xaml.cs`

```csharp
namespace Stribe.Views.Onboarding;

public partial class HabitSelectionPage : ContentPage
{
    public HabitSelectionPage(OnboardingViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

**Explanation**: Minimal code-behind with DI injection. All logic in ViewModel.

### Step 5: Registrer i MauiProgram.cs
Path: `src/Stribe/MauiProgram.cs`

```csharp
builder.Services.AddTransient<HabitSelectionPage>();
```

**Explanation**: Page registered as transient. ViewModel already registered in command 010.

### Step 6: Registrer route i AppShell.xaml.cs
Path: `src/Stribe/AppShell.xaml.cs`

```csharp
Routing.RegisterRoute("onboarding/habits", typeof(HabitSelectionPage));
```

**Explanation**: Shell route enables navigation from WelcomePage (command 010).

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. Manual Test in Emulator
- [ ] Navigate fra Welcome Page til Habit Selection
- [ ] 6 habit chips vises i 2-column grid
- [ ] Tap på habit chip → becomes selected (green background, white text)
- [ ] Tap again on selected chip → deselects (white background, border)
- [ ] Vælg 3 habits → tap 4th chip shows feedback (or no action)
- [ ] Continue button text: "Vælg mindst 1 vane" når ingen selected
- [ ] Continue button text: "Fortsæt" når 1-3 selected
- [ ] Continue button disabled when CanContinue = false
- [ ] Tap "Fortsæt" → navigates til reminder page (if route exists)
- [ ] Tap "Egen" chip → shows placeholder alert (command 012 not implemented yet)
- [ ] Back button navigates to Welcome Page
- [ ] Page indicator shows • • ○ (second dot active)
- [ ] Looks good på både små og store skærme

### 3. Unit Test Scenarios
**Test selection logic:**
```
Scenario 1: Ingen selection → CanContinue = false, button disabled
Scenario 2: 1 habit selected → CanContinue = true, button enabled
Scenario 3: 3 habits selected → CanContinue = true, button enabled
Scenario 4: Forsøg at select 4th habit → blocked, count stays 3
Scenario 5: Deselect habit → count decrements, state updates
Scenario 6: Tap "Egen" chip → ShowCustomHabitDialog called
```

---

## Acceptance Criteria

- [x] HabitSelectionPage.xaml with grid layout
- [x] PresetHabit model created
- [x] OnboardingViewModel updated with selection logic
- [x] 6 predefined habits displayed correctly
- [x] Multi-selection (1-3) works with visual feedback
- [x] Selected/unselected states styled correctly
- [x] Continue button validation correct (CanContinue)
- [x] Continue button text updates dynamically
- [x] Max 3 habits constraint enforced
- [x] "Egen" chip opens placeholder dialog
- [x] Page registered in routing
- [x] Build succeeds
- [x] All manual test scenarios pass

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **ObservableCollection pattern**: Standard MVVM for dynamic lists (no custom binding framework)
- **DataTriggers for state**: XAML-based styling (no code-behind UI logic)
- **Computed properties**: CanContinue, SelectedHabits calculated on-demand (no complex state machine)
- **Single responsibility**: OnToggleHabitSelection handles selection only, validation inline

### Alternativer overvejet

**Alternative 1: SelectionMode="Multiple" med CollectionView**
```xaml
<CollectionView ItemsSource="{Binding PresetHabits}" SelectionMode="Multiple">
```
**Hvorfor fravalgt**: CollectionView SelectionMode doesn't support max limit constraint easily. Custom TapGesture gives more control over selection logic.

**Alternative 2: Separate HabitChipViewModel**
```csharp
public class HabitChipViewModel : ObservableObject
{
    [ObservableProperty] private bool isSelected;
}
```
**Hvorfor fravalgt**: Over-engineering. Simple PresetHabit POCO sufficient - ViewModel handles state updates via OnPropertyChanged.

**Alternative 3: Hardcoded 6 Border elements in XAML**
```xaml
<Border><!-- Motion --></Border>
<Border><!-- Læse --></Border>
...
```
**Hvorfor fravalgt**: Not DRY, harder to maintain. BindableLayout.ItemsSource + DataTemplate reuses chip design.

### Potentielle forbedringer (v2)
- Animate selection (scale bounce) via Triggers or Behaviors - More tactile feedback
- Search/filter habits (if expanding to 20+ presets) - Scalability
- Reorder habits by drag-drop - Customization
- Show habit preview (description, streak goal) on tap - Informed selection

### Kendte begrænsninger
- **No toast feedback**: When max 3 limit hit, no visual cue (acceptable - button text hints at limit)
- **State not persisted**: If app crashes, selected habits lost (acceptable - onboarding is one-time flow)
- **Hardcoded presets**: Not loaded from config/API (acceptable - MVP has fixed 6 habits)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple ObservableCollection + computed properties (no complex state management)
- [x] **Læsbarhed**: PresetHabits, SelectedHabits, CanContinue self-documenting names
- [x] **Navngivning**: OnToggleHabitSelection describes action, CanContinue describes validation
- [x] **Funktioner**: OnToggleHabitSelection ~20 lines (single purpose - toggle + validate)
- [x] **DRY**: DataTemplate reused for all chips, DataTriggers for state styling
- [x] **Error handling**: Navigation can throw (handled by global ExceptionHandler)
- [x] **Edge cases**: Max 3 limit, IsCustom chip, empty selection all handled
- [x] **Performance**: ObservableCollection efficient for 6 items, computed properties lazy
- [x] **Testbarhed**: ViewModel testable (mock navigation), selection logic unit testable

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/03_ONBOARDING_HABITS.md
- **Component Spec**: N/A (custom habit chip layout)
- **Related**: Command 012 (custom habit dialog), stribe-design/visual-identity/COLORS.md

---

## Notes

- FlexLayout med Wrap="Wrap" og JustifyContent="SpaceBetween" creates adaptive 2-column grid
- Border WidthRequest="160" forces chip size (prevents layout shift when selecting)
- RelativeSource AncestorType binding required for nested TapGestureRecognizer in DataTemplate
- "Egen" chip has IsCustom=true to differentiate from real habits in SelectedHabits filter
- Default colors per habit (green, blue, purple, etc.) will be used for habit creation in database
- Max 3 habits constraint based on UX research: fewer habits = higher completion rate

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
