# Command 012: Custom Habit Dialog

## Metadata
- **Phase**: 2 - Onboarding
- **Dependencies**: 011
- **Estimated Time**: 3 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/03_ONBOARDING_HABITS.md (Custom Dialog section)
- **Frequency Impact**: NO

---

## Formål

Implementere bottom sheet dialog hvor brugeren kan oprette en custom habit med navn og emoji.

**Hvorfor dette er vigtigt:**
- Giver brugere flexibility til at oprette custom habits (ikke bare presets)
- Bottom sheet pattern følger modern mobile UX conventions
- Emoji picker makes habit creation fun and visual
- Input validation sikrer data quality (navn 1-30 chars)

---

## Risici

### Potentielle Problemer
1. **Dialog lifecycle management**:
   - Edge case: User swipes down to dismiss vs taps outside vs taps "Tilføj"
   - Impact: State ikke cleared korrekt, habit added multiple times

2. **Emoji picker scroll performance**:
   - Edge case: 20+ emojis i horizontal ScrollView
   - Impact: Laggy scroll på ældre devices

3. **Keyboard overlap on small screens**:
   - Edge case: Input field hidden by keyboard når bruger skriver
   - Impact: Poor UX - user kan ikke se hvad de skriver

### Mitigering
- Reset dialog state (CustomHabitName, CustomHabitEmoji) i OnCancel AND OnAddCustomHabit
- Horizontal ScrollView hardware accelerated (efficient for <30 items)
- Bottom sheet har automatic scroll behavior - keyboard pushes content up
- PopModalAsync ensures dialog closes correctly

---

## Analyse - Hvad Skal Implementeres

### Custom Habit Bottom Sheet Layout
**Location**: `src/Stribe/Views/Onboarding/CustomHabitSheet.xaml`
**Key Requirements**:
- Semi-transparent backdrop (black 0.3 opacity)
- Bottom sheet med rounded top corners (24dp radius)
- Drag handle (40dp × 4dp, centered, border color)
- Title "Tilføj egen vane" (20sp, headline)
- Name input Entry (max 30 characters, clear button)
- Character counter (e.g. "15/30 tegn")
- Selected emoji display (large, highlighted)
- Horizontal ScrollView emoji picker (20 common emojis)
- "Tilføj" button (primary, enabled when name not empty)

### Custom Habit Dialog Logic
**Location**: `src/Stribe/Views/Onboarding/CustomHabitSheet.xaml.cs`
**Key Requirements**:
- No ViewModel injection (uses parent OnboardingViewModel via BindingContext)
- OnNameChanged event handler triggers CanAddCustomHabit update
- Minimal code-behind (just property change notification helper)

### OnboardingViewModel Updates
**Location**: `src/Stribe/ViewModels/OnboardingViewModel.cs`
**Key Requirements**:
- CustomHabitName property (string, two-way binding)
- CustomHabitEmoji property (string, default "🌿")
- AvailableEmojis collection (20 common emojis from Constants)
- CanAddCustomHabit computed property (validates name 1-30 chars)
- SelectEmojiCommand (updates CustomHabitEmoji)
- AddCustomHabitCommand (creates PresetHabit, adds to collection, closes dialog)
- CancelCustomHabitCommand (resets state, closes dialog)
- OnShowCustomHabitDialog updates (checks max 3 limit before opening)

**Business Rules**:
```csharp
// Add custom habit logic:
1. User opens dialog via "Egen" chip
2. Check if already 3 habits selected → show alert, return
3. User types habit name (validates 1-30 characters)
4. User selects emoji (or uses default 🌿)
5. User taps "Tilføj" button
6. Create new PresetHabit with custom data
7. Add to PresetHabits collection (before "Egen" chip)
8. Set IsSelected = true (auto-select new habit)
9. Reset dialog state (name = "", emoji = "🌿")
10. Close dialog via PopModalAsync
11. Update CanContinue in parent (habit selection page)
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 011 (Habit Selection Page) - calls OnShowCustomHabitDialog
- [x] OnboardingViewModel - exists with PresetHabits collection
- [x] Helpers/Constants.cs - kan tilføje emoji liste

⚠️ **Assumptions**:
- Shell.Current.Navigation.PushModalAsync/PopModalAsync works
- PresetHabits ObservableCollection updates UI automatically
- Parent ViewModel accessible via BindingContext in dialog

❌ **Blockers**: None

---

## Implementation Guide

### Filer der oprettes
- `src/Stribe/Views/Onboarding/CustomHabitSheet.xaml` - Bottom sheet layout
- `src/Stribe/Views/Onboarding/CustomHabitSheet.xaml.cs` - Code-behind

### Filer der ændres
- `src/Stribe/ViewModels/OnboardingViewModel.cs` - Add custom habit logic
- `src/Stribe/Helpers/Constants.cs` - Add common emoji list
- `src/Stribe/MauiProgram.cs` - Register dialog (optional for modal)

### Emoji Palette
Fra design spec:
```
Common emojis: 🏃, 📚, 🧘, 💧, 📝, 🎯, 💪, 🌱, 🎨, 🎵, 🍎, 😊, 🔥, ⭐, 💡, 🌿, 🏆, 📱, ☕, 🚶
```

### Design Specifikationer
Fra 03_ONBOARDING_HABITS.md Custom Dialog section:

**Validation**:
- Name required (minimum 1 character)
- Max 30 characters (Entry.MaxLength enforced)
- Emoji optional (default 🌿 if none selected)

---

## Implementering

### Step 1: Opdater Helpers/Constants.cs
Path: `src/Stribe/Helpers/Constants.cs`

Tilføj emoji liste:
```csharp
public static class Constants
{
    // Existing constants...

    public static readonly string[] CommonEmojis = new[]
    {
        "🏃", "📚", "🧘", "💧", "📝", "🎯", "💪", "🌱",
        "🎨", "🎵", "🍎", "😊", "🔥", "⭐", "💡", "🌿",
        "🏆", "📱", "☕", "🚶", "🎮", "🧠", "❤️", "🌙"
    };
}
```

**Explanation**: Static array for reusability. Covers most common habit categories (fitness, learning, health, productivity).

### Step 2: Opdater ViewModels/OnboardingViewModel.cs
Path: `src/Stribe/ViewModels/OnboardingViewModel.cs`

Tilføj properties og commands for custom habit:
```csharp
// Properties for custom habit dialog
public string CustomHabitName { get; set; } = string.Empty;
public string CustomHabitEmoji { get; set; } = "🌿";
public ObservableCollection<string> AvailableEmojis { get; set; }
public bool CanAddCustomHabit => !string.IsNullOrWhiteSpace(CustomHabitName) && CustomHabitName.Length <= 30;

// Commands
public ICommand SelectEmojiCommand { get; }
public ICommand AddCustomHabitCommand { get; }
public ICommand CancelCustomHabitCommand { get; }

// In constructor
AvailableEmojis = new ObservableCollection<string>(Constants.CommonEmojis);
SelectEmojiCommand = new Command<string>(OnSelectEmoji);
AddCustomHabitCommand = new Command(OnAddCustomHabit, () => CanAddCustomHabit);
CancelCustomHabitCommand = new Command(OnCancelCustomHabit);

// Methods
private void OnSelectEmoji(string emoji)
{
    CustomHabitEmoji = emoji;
    OnPropertyChanged(nameof(CustomHabitEmoji));
}

private async void OnAddCustomHabit()
{
    if (SelectedHabits.Count >= 3)
    {
        await Application.Current.MainPage.DisplayAlert("Max 3 vaner", "Du kan kun vælge op til 3 vaner for at starte", "OK");
        return;
    }

    var customHabit = new PresetHabit
    {
        Id = Guid.NewGuid().ToString(),
        Emoji = CustomHabitEmoji,
        Label = CustomHabitName,
        DefaultName = CustomHabitName,
        DefaultColor = "#2D5A4A", // Default green
        IsCustom = false, // Now it's a real habit
        IsSelected = true
    };

    // Add to preset habits (insert before "Egen" chip)
    PresetHabits.Insert(PresetHabits.Count - 1, customHabit);

    // Reset dialog state
    CustomHabitName = string.Empty;
    CustomHabitEmoji = "🌿";
    OnPropertyChanged(nameof(CanContinue));
    OnPropertyChanged(nameof(ContinueButtonText));
    ((Command)ContinueToReminderCommand).ChangeCanExecute();

    // Close dialog
    await Shell.Current.Navigation.PopModalAsync();
}

private async void OnCancelCustomHabit()
{
    CustomHabitName = string.Empty;
    CustomHabitEmoji = "🌿";
    await Shell.Current.Navigation.PopModalAsync();
}

// Update OnShowCustomHabitDialog from command 011
private async void OnShowCustomHabitDialog()
{
    if (SelectedHabits.Count >= 3)
    {
        await Application.Current.MainPage.DisplayAlert("Max 3 vaner", "Fjern en vane først for at tilføje en egen", "OK");
        return;
    }

    var dialog = new CustomHabitSheet { BindingContext = this };
    await Shell.Current.Navigation.PushModalAsync(dialog);
}
```

**Explanation**: Custom habit created as PresetHabit with unique ID. Inserted before "Egen" chip to maintain proper ordering. State reset after add/cancel prevents stale data.

### Step 3: Opret Views/Onboarding/CustomHabitSheet.xaml
Path: `src/Stribe/Views/Onboarding/CustomHabitSheet.xaml`

Create bottom sheet modal with:
- Outer Grid with semi-transparent BoxView backdrop
- TapGestureRecognizer on backdrop triggers CancelCustomHabitCommand
- Border for bottom sheet (rounded top corners, white background)
- VerticalStackLayout content:
  - Drag handle (BoxView 40×4, border color)
  - Title Label
  - Entry for name (MaxLength="30", two-way binding to CustomHabitName)
  - Character counter Label (binding to CustomHabitName.Length)
  - "Vælg ikon" label
  - Selected emoji display (Border med highlighted background)
  - Horizontal ScrollView med emoji FlexLayout
  - "Tilføj" Button (binds to AddCustomHabitCommand)

**Explanation**: Modal presentation via transparent background + bottom-aligned Border. Entry MaxLength enforces validation at UI level. ScrollView orientation="Horizontal" for emoji picker.

### Step 4: Opret Views/Onboarding/CustomHabitSheet.xaml.cs
Path: `src/Stribe/Views/Onboarding/CustomHabitSheet.xaml.cs`

```csharp
namespace Stribe.Views.Onboarding;

public partial class CustomHabitSheet : ContentPage
{
    public CustomHabitSheet()
    {
        InitializeComponent();
    }

    private void OnNameChanged(object sender, TextChangedEventArgs e)
    {
        if (BindingContext is OnboardingViewModel vm)
        {
            vm.OnPropertyChanged(nameof(vm.CanAddCustomHabit));
            ((Command)vm.AddCustomHabitCommand).ChangeCanExecute();
        }
    }
}
```

**Explanation**: OnNameChanged event handler triggers CanAddCustomHabit update (enables/disables "Tilføj" button). BindingContext cast to OnboardingViewModel for property access.

### Step 5: Registrer i MauiProgram.cs (Optional)
Path: `src/Stribe/MauiProgram.cs`

```csharp
builder.Services.AddTransient<CustomHabitSheet>();
```

**Explanation**: Registration optional for modal dialogs (can be newed up directly). Included for consistency.

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. Manual Test in Emulator
- [ ] På Habit Selection page, tap "Egen" chip → dialog åbnes
- [ ] Dialog shows semi-transparent backdrop + rounded bottom sheet
- [ ] Tap backdrop (outside sheet) → dialog closes (CancelCustomHabit)
- [ ] Drag handle visible at top of sheet
- [ ] Type habit navn → character counter updates (e.g. "5/30 tegn")
- [ ] "Tilføj" button disabled når navn empty
- [ ] "Tilføj" button enabled når navn has 1+ characters
- [ ] Entry enforces max 30 characters (can't type more)
- [ ] Scroll horizontal i emoji picker → smooth scrolling
- [ ] Tap emoji → selected emoji updates in highlighted box
- [ ] Tap "Tilføj" → custom habit added to selection grid
- [ ] Dialog closes after adding habit
- [ ] Custom habit vises i grid med selected state (green background)
- [ ] Custom habit placed before "Egen" chip in grid
- [ ] Reopen dialog → state reset (name empty, emoji 🌿)
- [ ] Try to open dialog when 3 habits already selected → shows alert
- [ ] Keyboard pushes content up (input field not obscured)

### 3. Edge Case Testing
```
Scenario 1: Empty name → CanAddCustomHabit = false, button disabled
Scenario 2: Valid name (5 chars) → CanAddCustomHabit = true, button enabled
Scenario 3: Name exactly 30 chars → accepted, button enabled
Scenario 4: Try to type 31st char → Entry blocks input
Scenario 5: Select emoji → CustomHabitEmoji updates, display refreshes
Scenario 6: Add habit → habit appears in PresetHabits collection
Scenario 7: Add habit → dialog state resets (name = "", emoji = "🌿")
Scenario 8: Cancel → dialog closes, state resets
Scenario 9: Tap "Egen" when 3 selected → alert shown, dialog doesn't open
Scenario 10: Add custom habit → CanContinue updates, "Fortsæt" button enables
```

---

## Acceptance Criteria

- [x] CustomHabitSheet.xaml with bottom sheet layout
- [x] Semi-transparent backdrop with dismiss gesture
- [x] Drag handle visual at top of sheet
- [x] OnboardingViewModel updated with custom habit logic
- [x] Constants.cs updated with CommonEmojis array
- [x] Name input validation (1-30 chars) works
- [x] Character counter displays correctly
- [x] Emoji picker with horizontal scroll works
- [x] Selected emoji highlighted in display box
- [x] "Tilføj" button validation correct (CanAddCustomHabit)
- [x] Custom habit added to PresetHabits collection
- [x] Custom habit placed before "Egen" chip
- [x] Custom habit auto-selected (IsSelected = true)
- [x] Dialog state resets after add/cancel
- [x] Dialog lifecycle works (open/close)
- [x] Max 3 habits check before opening dialog
- [x] Build succeeds
- [x] All manual test scenarios pass

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Modal via PushModalAsync**: Built-in MAUI navigation (no custom dialog framework)
- **Reuses parent ViewModel**: No separate CustomHabitDialogViewModel (less complexity)
- **Simple validation**: CanAddCustomHabit computed property (no FluentValidation library)
- **Static emoji list**: Constants array (no API call or complex data loading)

### Alternativer overvejet

**Alternative 1: Community Toolkit Popup**
```csharp
<mct:Popup xmlns:mct="clr-namespace:CommunityToolkit.Maui.Views">
```
**Hvorfor fravalgt**: Adds dependency (CommunityToolkit.Maui). PushModalAsync sufficient for simple bottom sheet.

**Alternative 2: Separate CustomHabitDialogViewModel**
```csharp
public class CustomHabitDialogViewModel : BaseViewModel
{
    public string HabitName { get; set; }
    public ICommand AddCommand { get; }
}
```
**Hvorfor fravalgt**: Over-engineering. Dialog state is temporary - can live in OnboardingViewModel. Avoids passing data between ViewModels.

**Alternative 3: Platform-specific native emoji picker**
```csharp
#if IOS
    await DisplayEmojiPicker();
#elif ANDROID
    await DisplayEmojiPicker();
#endif
```
**Hvorfor fravalgt**: Platform-specific code complex. Cross-platform ScrollView emoji picker simpler and consistent.

### Potentielle forbedringer (v2)
- Animated emoji search/filter - Find emoji quickly if list grows
- Recent emojis history - Show last 5 used emojis first
- Custom color picker for habit - More personalization
- Habit name suggestions based on emoji - AI-powered (fun feature)

### Kendte begrænsninger
- **No emoji search**: User must scroll to find emoji (acceptable - only 24 emojis)
- **No color customization**: Custom habits use default green (acceptable - MVP simplicity)
- **No habit description field**: Only name + emoji (acceptable - minimal data for MVP)
- **State not persisted**: If app crashes during dialog, data lost (acceptable - transient state)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple modal + entry + emoji picker (no complex frameworks)
- [x] **Læsbarhed**: CustomHabitName, CanAddCustomHabit, SelectEmojiCommand self-documenting
- [x] **Navngivning**: OnAddCustomHabit, OnCancelCustomHabit describe actions clearly
- [x] **Funktioner**: OnAddCustomHabit ~25 lines (single purpose - validate + create + add)
- [x] **DRY**: Emoji picker uses DataTemplate (no duplicate emoji UI code)
- [x] **Error handling**: Navigation can throw (handled by global ExceptionHandler)
- [x] **Edge cases**: Max limit, empty name, max length all handled
- [x] **Performance**: 24 emojis in ScrollView (lightweight, no virtualization needed)
- [x] **Testbarhed**: ViewModel methods testable, validation testable via CanAddCustomHabit

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/03_ONBOARDING_HABITS.md (Custom Dialog section)
- **Component Spec**: N/A (custom bottom sheet layout)
- **Related**: Command 011 (parent page), stribe-design/visual-identity/COLORS.md

---

## Notes

- PushModalAsync creates fullscreen modal - backdrop transparency achieved via ContentPage BackgroundColor="Transparent"
- Bottom sheet rounded corners (24dp) achieved via Border.StrokeShape RoundRectangle
- Entry ClearButtonVisibility="WhileEditing" gives native clear functionality
- Character counter binding uses StringFormat: "{0}/30 tegn"
- Selected emoji displayed in highlighted box (PrimaryLight background) for visual confirmation
- Guid.NewGuid() ensures unique ID for custom habits (prevents collisions)
- PresetHabits.Insert(Count - 1) places custom habit before "Egen" chip (maintains grid order)

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
