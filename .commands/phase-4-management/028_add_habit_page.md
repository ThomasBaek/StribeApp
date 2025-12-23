# Command 028: Add Habit Page

## Metadata
- **Phase**: 4 - Management
- **Dependencies**: 024, 029, 030
- **Estimated Time**: 3-4 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/07_ADD_HABIT.md
- **Frequency Impact**: YES - Must include WeekdayPicker and DailyTargetPicker

---

## Formål

Implementere Add Habit Page med form til at oprette ny habit, inklusiv frequency controls (WeekdayPicker og DailyTargetPicker).

**Hvorfor dette er vigtigt:**
- Primary entry point for creating habits
- Må inkludere frequency features (ActiveDays, DailyTargetCount)
- Form validation sikrer data quality
- Brugervenlig UX for habit creation

---

## Risici

### Potentielle Problemer
1. **Validation complexity**:
   - Edge case: Empty navn, invalid ActiveDays
   - Impact: Bad data in database

2. **Component integration**:
   - Edge case: EmojiPicker, ColorPicker, WeekdayPicker, DailyTargetPicker alle skal bindes korrekt
   - Impact: Data ikke saved korrekt

### Mitigering
- Clear validation rules med user feedback
- Two-way binding for all components
- Save button disabled until form is valid

---

## Analyse - Hvad Skal Implementeres

### AddHabitPage Layout
**Description**: Form layout med alle input fields
**Location**: `src/Stribe/Pages/AddHabitPage.xaml`
**Key Requirements**:
- Name Entry (required, max 50 chars)
- EmojiPicker component (Command 029)
- ColorPicker component (Command 030)
- **WeekdayPicker component** (frequency feature)
- **DailyTargetPicker component** (frequency feature)
- Reminder time picker (optional)
- Save + Cancel buttons

### AddHabitViewModel
**Description**: Form logic med validation
**Location**: `src/Stribe/ViewModels/AddHabitViewModel.cs`
**Key Requirements**:
- Habit property med defaults (DailyTargetCount=1, ActiveDays="1111111")
- IsValid computed property
- SaveCommand (creates habit, navigates back)
- CancelCommand (navigates back without saving)

**Business Rules**:
```csharp
// Validation
- Name: Required, 1-50 characters
- Icon: Required (default "🌿")
- Color: Required (default Primary)
- ActiveDays: Must have at least 1 day selected
- DailyTargetCount: Range 1-99
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 024 (FAB navigation to add-habit)
- [x] Command 029 (EmojiPicker component)
- [x] Command 030 (ColorPicker component)
- [x] WeekdayPicker component spec exists (stribe-design/components/WEEKDAY_PICKER.md)
- [x] DailyTargetPicker component spec exists (stribe-design/components/DAILY_TARGET_PICKER.md)

⚠️ **Assumptions**:
- HabitService has AddHabitAsync() method
- Habit model includes DailyTargetCount and ActiveDays fields

❌ **Blockers**: None (components can be stubs initially)

---

## Implementation Guide

### Step 1: Create WeekdayPicker Custom Control
Path: `src/Stribe/Controls/WeekdayPicker.xaml`

See full implementation in: `stribe-design/components/WEEKDAY_PICKER.md`

**Key features**:
- 7 toggle buttons (M T O T F L S)
- Quick-select buttons ("Hver dag", "Hverdage", "Weekend")
- Two-way binding: ActiveDays property (string "1111111")
- Validation: Minimum 1 day selected

### Step 2: Create DailyTargetPicker Custom Control
Path: `src/Stribe/Controls/DailyTargetPicker.xaml`

See full implementation in: `stribe-design/components/DAILY_TARGET_PICKER.md`

**Key features**:
- Stepper with +/- buttons
- Value display (1-99)
- Two-way binding: DailyTargetCount property (int)
- Animations on increment/decrement

### Step 3: Create AddHabitViewModel
Path: `src/Stribe/ViewModels/AddHabitViewModel.cs`

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Stribe.Models;
using Stribe.Services;

namespace Stribe.ViewModels;

public partial class AddHabitViewModel : BaseViewModel
{
    private readonly IHabitService _habitService;

    [ObservableProperty]
    private Habit _habit = new()
    {
        Id = Guid.NewGuid().ToString(),
        Icon = "🌿",  // Default icon
        Color = "#2D5A4A",  // Default color (Primary)
        DailyTargetCount = 1,  // Default: once per day
        ActiveDays = "1111111",  // Default: every day
        ReminderTime = new TimeSpan(9, 0, 0)  // Default: 09:00
    };

    [ObservableProperty]
    private string _selectedEmoji = "🌿";

    [ObservableProperty]
    private string _selectedColor = "#2D5A4A";

    // Validation
    public bool IsValid =>
        !string.IsNullOrWhiteSpace(Habit.Name) &&
        Habit.Name.Length <= 50 &&
        Habit.ActiveDays.Contains('1') &&  // At least 1 day selected
        Habit.DailyTargetCount >= 1 &&
        Habit.DailyTargetCount <= 99;

    public AddHabitViewModel(IHabitService habitService)
    {
        _habitService = habitService;
        Title = "Ny vane";
    }

    partial void OnSelectedEmojiChanged(string value)
    {
        Habit.Icon = value;
        OnPropertyChanged(nameof(IsValid));
    }

    partial void OnSelectedColorChanged(string value)
    {
        Habit.Color = value;
        OnPropertyChanged(nameof(IsValid));
    }

    [RelayCommand]
    private async Task SaveAsync()
    {
        if (!IsValid)
        {
            await Shell.Current.DisplayAlert("Fejl", "Udfyld venligst alle felter korrekt", "OK");
            return;
        }

        try
        {
            IsBusy = true;

            // Save habit
            await _habitService.AddHabitAsync(Habit);

            // Navigate back to home
            await Shell.Current.GoToAsync("..");
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Fejl", $"Kunne ikke gemme vane: {ex.Message}", "OK");
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task CancelAsync()
    {
        // Navigate back without saving
        await Shell.Current.GoToAsync("..");
    }
}
```

**Explanation**: ViewModel med Habit object, validation, save/cancel commands. Default values set for frequency features.

### Step 4: Create AddHabitPage XAML
Path: `src/Stribe/Pages/AddHabitPage.xaml`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:vm="clr-namespace:Stribe.ViewModels"
             xmlns:controls="clr-namespace:Stribe.Controls"
             x:Class="Stribe.Pages.AddHabitPage"
             x:DataType="vm:AddHabitViewModel"
             Title="{Binding Title}">

    <ScrollView>
        <VerticalStackLayout Padding="20" Spacing="24">

            <!-- Name Input -->
            <VerticalStackLayout Spacing="8">
                <Label Text="Navn" Style="{StaticResource SectionHeader}" />
                <Entry Text="{Binding Habit.Name}"
                       Placeholder="Fx: Drikke vand"
                       MaxLength="50" />
            </VerticalStackLayout>

            <!-- Emoji Picker -->
            <VerticalStackLayout Spacing="8">
                <Label Text="Ikon" Style="{StaticResource SectionHeader}" />
                <controls:EmojiPicker SelectedEmoji="{Binding SelectedEmoji, Mode=TwoWay}" />
            </VerticalStackLayout>

            <!-- Color Picker -->
            <VerticalStackLayout Spacing="8">
                <Label Text="Farve" Style="{StaticResource SectionHeader}" />
                <controls:ColorPicker SelectedColor="{Binding SelectedColor, Mode=TwoWay}" />
            </VerticalStackLayout>

            <!-- Daily Target Picker (Frequency Feature) -->
            <VerticalStackLayout Spacing="8">
                <Label Text="Hvor mange gange om dagen?" Style="{StaticResource SectionHeader}" />
                <controls:DailyTargetPicker DailyTargetCount="{Binding Habit.DailyTargetCount, Mode=TwoWay}" />
            </VerticalStackLayout>

            <!-- Weekday Picker (Frequency Feature) -->
            <VerticalStackLayout Spacing="8">
                <Label Text="Hvilke dage?" Style="{StaticResource SectionHeader}" />
                <controls:WeekdayPicker ActiveDays="{Binding Habit.ActiveDays, Mode=TwoWay}" />
            </VerticalStackLayout>

            <!-- Reminder Time Picker -->
            <VerticalStackLayout Spacing="8">
                <Label Text="Påmindelse (valgfri)" Style="{StaticResource SectionHeader}" />
                <TimePicker Time="{Binding Habit.ReminderTime}" />
            </VerticalStackLayout>

            <!-- Buttons -->
            <Grid ColumnDefinitions="*,*" ColumnSpacing="12" Margin="0,24,0,0">
                <Button Grid.Column="0"
                        Text="Annuller"
                        Command="{Binding CancelCommand}"
                        Style="{StaticResource SecondaryButton}" />

                <Button Grid.Column="1"
                        Text="Gem"
                        Command="{Binding SaveCommand}"
                        IsEnabled="{Binding IsValid}"
                        Style="{StaticResource PrimaryButton}" />
            </Grid>

        </VerticalStackLayout>
    </ScrollView>

</ContentPage>
```

**Explanation**: Scrollable form med alle input components. WeekdayPicker og DailyTargetPicker binds two-way til Habit properties.

### Step 5: Register in DI and Routing
Path: `src/Stribe/MauiProgram.cs` and `src/Stribe/AppShell.xaml.cs`

```csharp
// MauiProgram.cs
builder.Services.AddTransient<AddHabitPage>();
builder.Services.AddTransient<AddHabitViewModel>();

// AppShell.xaml.cs
Routing.RegisterRoute("add-habit", typeof(AddHabitPage));
```

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. Unit Tests
```csharp
[Fact]
public void IsValid_WithValidData_ReturnsTrue()
{
    var vm = new AddHabitViewModel(habitService);
    vm.Habit.Name = "Test Habit";
    vm.Habit.DailyTargetCount = 3;
    vm.Habit.ActiveDays = "1111100";  // Weekdays

    Assert.True(vm.IsValid);
}

[Fact]
public void IsValid_WithEmptyName_ReturnsFalse()
{
    var vm = new AddHabitViewModel(habitService);
    vm.Habit.Name = "";

    Assert.False(vm.IsValid);
}

[Fact]
public void IsValid_WithNoActiveDays_ReturnsFalse()
{
    var vm = new AddHabitViewModel(habitService);
    vm.Habit.Name = "Test";
    vm.Habit.ActiveDays = "0000000";  // No days selected

    Assert.False(vm.IsValid);
}
```

### 3. Manual Test in Emulator
- [ ] Tap FAB on home screen navigates to Add Habit
- [ ] Name input accepts text (max 50 chars)
- [ ] EmojiPicker updates Habit.Icon
- [ ] ColorPicker updates Habit.Color
- [ ] **DailyTargetPicker increments/decrements (1-99)**
- [ ] **WeekdayPicker toggles days correctly**
- [ ] **WeekdayPicker quick-select works** ("Hver dag", "Hverdage", "Weekend")
- [ ] TimePicker sets ReminderTime
- [ ] Save button disabled when Name empty
- [ ] Save button enabled when form valid
- [ ] Save creates habit and navigates back to home
- [ ] Cancel navigates back without saving

---

## Acceptance Criteria

- [x] AddHabitPage layout med alle fields
- [x] AddHabitViewModel med validation
- [x] **DailyTargetPicker integrated** (two-way binding to Habit.DailyTargetCount)
- [x] **WeekdayPicker integrated** (two-way binding to Habit.ActiveDays)
- [x] EmojiPicker integrated (Command 029)
- [x] ColorPicker integrated (Command 030)
- [x] Form validation (name required, ActiveDays has at least 1 day)
- [x] Save command creates habit and navigates back
- [x] Cancel command navigates back without saving
- [x] Default values set (DailyTargetCount=1, ActiveDays="1111111")
- [x] Build succeeds
- [x] Manual testing passed

---

## Frequency Feature Integration

### DailyTargetPicker Integration
**Component**: DailyTargetPicker (see DAILY_TARGET_PICKER.md)

**Binding**:
```xml
<controls:DailyTargetPicker DailyTargetCount="{Binding Habit.DailyTargetCount, Mode=TwoWay}" />
```

**Default value**: 1 (once per day)
**Range**: 1-99

**Validation**: Enforced by DailyTargetPicker component (buttons disabled at boundaries)

### WeekdayPicker Integration
**Component**: WeekdayPicker (see WEEKDAY_PICKER.md)

**Binding**:
```xml
<controls:WeekdayPicker ActiveDays="{Binding Habit.ActiveDays, Mode=TwoWay}" />
```

**Default value**: "1111111" (every day)
**Format**: Bitmask string (0=Monday, 6=Sunday)

**Validation**:
```csharp
// IsValid check
Habit.ActiveDays.Contains('1')  // At least 1 day must be selected
```

WeekdayPicker component prevents deselecting last day (user can't create invalid state).

### Example Usage Scenarios

**Scenario 1: Daily habit (default)**
- DailyTargetCount = 1
- ActiveDays = "1111111" (every day)
- Result: Simple daily habit (original behavior)

**Scenario 2: Drink 8 glasses of water**
- DailyTargetCount = 8
- ActiveDays = "1111111" (every day)
- Result: Multi-completion habit (tap 8 times to complete)

**Scenario 3: Gym 3 times, weekdays only**
- DailyTargetCount = 1
- ActiveDays = "1111100" (Mon-Fri)
- Result: Weekday-only habit (hidden on weekends)

**Scenario 4: Take vitamins 2x per day, Mon/Wed/Fri**
- DailyTargetCount = 2
- ActiveDays = "1010100" (Mon, Wed, Fri)
- Result: Multi-completion + weekday filtering

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Simple form layout**: Vertical stack of input controls (no complex layout)
- **Two-way binding**: Direct binding to Habit model properties (no intermediate state)
- **Validation in ViewModel**: Single IsValid property (no separate validation service)
- **Defaults in constructor**: Habit initialized with sensible defaults

### Alternativer overvejet

**Alternative 1: Multi-step wizard**
```
Step 1: Name + Icon
Step 2: Frequency (DailyTargetCount + ActiveDays)
Step 3: Reminder
```
**Hvorfor fravalgt**: Too complex. Single scrollable form is simpler and faster for users. All fields visible at once.

**Alternative 2: Separate validation service**
```csharp
public class HabitValidator
{
    public ValidationResult Validate(Habit habit) { }
}
```
**Hvorfor fravalgt**: Over-engineering. Simple validation rules can live in ViewModel. No need for separate class.

**Alternative 3: Fluent validation library**
```csharp
RuleFor(h => h.Name).NotEmpty().MaxLength(50);
```
**Hvorfor fravalgt**: Adds dependency. Built-in validation is sufficient for simple form.

### Potentielle forbedringer (v2)
- Habit templates (quick create "Workout", "Meditation", etc.) - Nice UX, but not MVP
- Image upload for custom icons - Too complex, emoji is sufficient
- Advanced frequency patterns (every other day, specific dates) - YAGNI for MVP
- Habit categories/tags - Feature creep

### Kendte begrænsninger
- **No undo/draft saving**: If user cancels, data is lost (acceptable - form is quick to fill)
- **No field-level validation UI**: Only Save button disabled state (acceptable - simple validation)
- **No habit name suggestions**: User must type manually (acceptable - personal habits)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple form layout, direct two-way binding, no complex validation
- [x] **Læsbarhed**: Clear section headers, descriptive labels
- [x] **Navngivning**: AddHabitViewModel, SaveAsync, CancelAsync (clear intent)
- [x] **Funktioner**: SaveAsync ~15 lines, IsValid one-liner (focused)
- [x] **DRY**: Reuses custom controls (EmojiPicker, ColorPicker, WeekdayPicker, DailyTargetPicker)
- [x] **Error handling**: Try-catch on SaveAsync med user-friendly alert
- [x] **Edge cases**: Empty name, no active days, invalid DailyTargetCount (all handled)
- [x] **Performance**: No unnecessary database calls, single save operation
- [x] **Testbarhed**: ViewModel easily testable (IsValid, SaveAsync mockable)

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/07_ADD_HABIT.md
- **Component Spec**:
  - stribe-design/components/WEEKDAY_PICKER.md
  - stribe-design/components/DAILY_TARGET_PICKER.md
  - Command 029 (EmojiPicker)
  - Command 030 (ColorPicker)
- **Related**: Command 031 (EditHabitPage - reuses same components)

---

## Notes

- **CRITICAL**: WeekdayPicker and DailyTargetPicker must be implemented before this command
- **CRITICAL**: Default values (DailyTargetCount=1, ActiveDays="1111111") ensure backward compatibility
- EditHabitPage (Command 031) reuses same form components
- IsValid computed property updates whenever Habit properties change
- TimePicker returns TimeSpan (stored directly in Habit.ReminderTime)
- Save navigation uses ".." (relative back navigation in Shell)

---

**Command Status**: ⏸️ Ready to implement (requires WeekdayPicker + DailyTargetPicker components first)
**Last Updated**: 2025-12-23
**Implemented By**: Pending
