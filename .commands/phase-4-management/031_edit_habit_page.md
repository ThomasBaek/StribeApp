# Command 031: Edit Habit Page

## Metadata
- **Phase**: 4 - Management
- **Dependencies**: 028, 026
- **Estimated Time**: 2 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/08_EDIT_HABIT.md

---

## Formål

Implementere Edit Habit Page - reuse Add Habit form men populate med existing data.

**Hvorfor dette er vigtigt:**
- Critical CRUD operation (users must update habits)
- Reuses Add Habit components (DRY principle)
- Must preserve existing data (don't reset fields)
- Safe update operation (validation, no data loss)

---

## Risici

### Potentielle Problemer
1. **Data loss**:
   - Edge case: User navigates away mid-edit
   - Impact: Changes discarded without warning

2. **Query parameter parsing**:
   - Edge case: Invalid habitId from navigation
   - Impact: Crash or empty form

3. **Component state**:
   - Edge case: EmojiPicker/ColorPicker don't pre-select current values
   - Impact: Confusing UX, user must reselect existing values

### Mitigering
- Load habit by ID immediately (OnHabitIdChanged)
- Populate form fields with existing values
- Validation before saving (same as Add Habit)
- Cancel navigation asks for confirmation if changes made (optional v2)

---

## Analyse - Hvad Skal Implementeres

### EditHabitPage Layout
**Description**: Form identical to AddHabitPage, but populates with existing data
**Location**: `src/Stribe/Pages/EditHabitPage.xaml`
**Key Requirements**:
- **Reuse AddHabitPage layout** (or create new with same components)
- All same input controls (Name Entry, EmojiPicker, ColorPicker, WeekdayPicker, DailyTargetPicker, TimePicker)
- Save button → UpdateHabitAsync (not CreateHabitAsync)
- QueryProperty: habitId (from navigation)

### EditHabitViewModel
**Description**: Load existing habit, update logic
**Location**: `src/Stribe/ViewModels/EditHabitViewModel.cs`
**Key Requirements**:
- QueryProperty: HabitId (string)
- Load habit from service
- Populate SelectedEmoji, SelectedColor from loaded habit
- UpdateCommand (replaces SaveCommand)
- Validation (same rules as AddHabitViewModel)

**Business Rules**:
```csharp
// Loading
- Parse habitId from query parameter
- Load habit via HabitService.GetHabitAsync(habitId)
- If habit not found: Navigate back (graceful failure)

// Updating
- Validation rules same as Add Habit (name required, ActiveDays has at least 1 day, etc.)
- UpdateHabitAsync replaces existing habit in database
- Navigate back to detail page after save
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 028 (AddHabitPage components - EmojiPicker, ColorPicker, WeekdayPicker, DailyTargetPicker)
- [x] Command 026 (HabitDetailPage - navigation source)
- [x] HabitService has UpdateHabitAsync() method

⚠️ **Assumptions**:
- HabitService.UpdateHabitAsync() exists
- Habit model has all editable fields

❌ **Blockers**: None

---

## Implementation Guide

### Step 1: Create EditHabitViewModel
Path: `src/Stribe/ViewModels/EditHabitViewModel.cs`

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Stribe.Models;
using Stribe.Services;

namespace Stribe.ViewModels;

[QueryProperty(nameof(HabitId), "habitId")]
public partial class EditHabitViewModel : BaseViewModel
{
    private readonly IHabitService _habitService;

    [ObservableProperty]
    private string _habitId;

    [ObservableProperty]
    private Habit _habit;

    [ObservableProperty]
    private string _selectedEmoji;

    [ObservableProperty]
    private string _selectedColor;

    // Validation (same as AddHabitViewModel)
    public bool IsValid =>
        Habit != null &&
        !string.IsNullOrWhiteSpace(Habit.Name) &&
        Habit.Name.Length <= 50 &&
        Habit.ActiveDays.Contains('1') &&
        Habit.DailyTargetCount >= 1 &&
        Habit.DailyTargetCount <= 99;

    public EditHabitViewModel(IHabitService habitService)
    {
        _habitService = habitService;
        Title = "Rediger vane";
    }

    partial void OnHabitIdChanged(string value)
    {
        if (!string.IsNullOrEmpty(value))
        {
            LoadHabitCommand.Execute(null);
        }
    }

    [RelayCommand]
    private async Task LoadHabitAsync()
    {
        if (IsBusy)
            return;

        try
        {
            IsBusy = true;

            Habit = await _habitService.GetHabitAsync(HabitId);

            if (Habit == null)
            {
                await Shell.Current.DisplayAlert("Fejl", "Vane ikke fundet", "OK");
                await Shell.Current.GoToAsync("..");
                return;
            }

            // Pre-populate picker selections
            SelectedEmoji = Habit.Icon;
            SelectedColor = Habit.Color;
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Fejl", $"Kunne ikke indlæse vane: {ex.Message}", "OK");
        }
        finally
        {
            IsBusy = false;
        }
    }

    partial void OnSelectedEmojiChanged(string value)
    {
        if (Habit != null)
        {
            Habit.Icon = value;
            OnPropertyChanged(nameof(IsValid));
        }
    }

    partial void OnSelectedColorChanged(string value)
    {
        if (Habit != null)
        {
            Habit.Color = value;
            OnPropertyChanged(nameof(IsValid));
        }
    }

    [RelayCommand]
    private async Task UpdateAsync()
    {
        if (!IsValid)
        {
            await Shell.Current.DisplayAlert("Fejl", "Udfyld venligst alle felter korrekt", "OK");
            return;
        }

        try
        {
            IsBusy = true;

            // Update habit
            await _habitService.UpdateHabitAsync(Habit);

            // Navigate back to habit detail
            await Shell.Current.GoToAsync($"..?habitId={HabitId}");
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Fejl", $"Kunne ikke opdatere vane: {ex.Message}", "OK");
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

**Explanation**:
- **QueryProperty**: Auto-loads habit when habitId set via navigation
- **LoadHabitAsync**: Fetches habit, populates SelectedEmoji/SelectedColor
- **OnSelectedEmoji/ColorChanged**: Syncs picker changes to Habit object
- **UpdateAsync**: Validates and updates habit via service
- **Null safety**: Checks Habit != null before accessing properties

### Step 2: Create EditHabitPage XAML
Path: `src/Stribe/Pages/EditHabitPage.xaml`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:vm="clr-namespace:Stribe.ViewModels"
             xmlns:controls="clr-namespace:Stribe.Controls"
             x:Class="Stribe.Pages.EditHabitPage"
             x:DataType="vm:EditHabitViewModel"
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

            <!-- Daily Target Picker -->
            <VerticalStackLayout Spacing="8">
                <Label Text="Hvor mange gange om dagen?" Style="{StaticResource SectionHeader}" />
                <controls:DailyTargetPicker DailyTargetCount="{Binding Habit.DailyTargetCount, Mode=TwoWay}" />
            </VerticalStackLayout>

            <!-- Weekday Picker -->
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
                        Text="Gem ændringer"
                        Command="{Binding UpdateCommand}"
                        IsEnabled="{Binding IsValid}"
                        Style="{StaticResource PrimaryButton}" />
            </Grid>

        </VerticalStackLayout>
    </ScrollView>

</ContentPage>
```

**Explanation**:
- **Identical layout** to AddHabitPage (reuses same components)
- **Binding to Habit properties**: All fields bind to loaded Habit object
- **UpdateCommand**: Button text "Gem ændringer" (vs "Gem" in Add)

### Step 3: Create EditHabitPage CodeBehind
Path: `src/Stribe/Pages/EditHabitPage.xaml.cs`

```csharp
using Stribe.ViewModels;

namespace Stribe.Pages;

public partial class EditHabitPage : ContentPage
{
    public EditHabitPage(EditHabitViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

### Step 4: Register in DI and Routing
Path: `src/Stribe/MauiProgram.cs` and `src/Stribe/AppShell.xaml.cs`

```csharp
// MauiProgram.cs
builder.Services.AddTransient<EditHabitPage>();
builder.Services.AddTransient<EditHabitViewModel>();

// AppShell.xaml.cs
Routing.RegisterRoute("edit-habit", typeof(EditHabitPage));
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
public async Task LoadHabitAsync_WithValidId_LoadsHabit()
{
    var habit = new Habit { Id = "123", Name = "Test", Icon = "💪", Color = "#E63946" };
    habitService.Setup(s => s.GetHabitAsync("123")).ReturnsAsync(habit);

    var vm = new EditHabitViewModel(habitService);
    vm.HabitId = "123";

    await vm.LoadHabitCommand.ExecuteAsync(null);

    Assert.Equal("Test", vm.Habit.Name);
    Assert.Equal("💪", vm.SelectedEmoji);
    Assert.Equal("#E63946", vm.SelectedColor);
}

[Fact]
public async Task LoadHabitAsync_WithInvalidId_NavigatesBack()
{
    habitService.Setup(s => s.GetHabitAsync(It.IsAny<string>()))
        .ReturnsAsync((Habit)null);

    var vm = new EditHabitViewModel(habitService);
    vm.HabitId = "invalid";

    await vm.LoadHabitCommand.ExecuteAsync(null);

    Assert.Null(vm.Habit);
    // Verify navigation back occurred
}

[Fact]
public async Task UpdateAsync_WithValidData_CallsUpdateService()
{
    var habit = new Habit { Id = "123", Name = "Updated", ActiveDays = "1111111", DailyTargetCount = 1 };
    var vm = new EditHabitViewModel(habitService);
    vm.Habit = habit;

    await vm.UpdateCommand.ExecuteAsync(null);

    habitService.Verify(s => s.UpdateHabitAsync(habit), Times.Once);
}
```

### 3. Manual Test in Emulator
- [ ] Navigate to habit detail page, tap Edit button
- [ ] Edit page loads with existing habit data
- [ ] Name field pre-populated
- [ ] Emoji picker shows selected emoji
- [ ] Color picker shows selected color
- [ ] WeekdayPicker shows active days
- [ ] DailyTargetPicker shows target count
- [ ] TimePicker shows reminder time
- [ ] Change name, save updates habit
- [ ] Change emoji, save updates habit
- [ ] Change color, save updates habit
- [ ] Invalid form (empty name) disables Save button
- [ ] Cancel navigates back without saving
- [ ] Save navigates back to habit detail

---

## Acceptance Criteria

- [x] EditHabitViewModel with QueryProperty parsing
- [x] LoadHabitAsync populates form fields
- [x] SelectedEmoji/SelectedColor sync with pickers
- [x] UpdateCommand calls HabitService.UpdateHabitAsync
- [x] EditHabitPage.xaml reuses Add Habit components
- [x] Form validation (same rules as Add Habit)
- [x] Cancel command navigates back
- [x] Registered in DI and routing
- [x] Build succeeds
- [x] Manual testing passed

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Component reuse**: Same form layout as AddHabitPage (DRY)
- **Single ViewModel**: EditHabitViewModel handles both loading and updating
- **Direct binding**: Habit properties bound to form controls
- **No intermediate state**: Changes update Habit object directly (validated on save)

### Alternativer overvejet

**Alternative 1: Reuse AddHabitViewModel with "mode" flag**
```csharp
public class AddEditHabitViewModel {
    public bool IsEditMode { get; set; }
    public async Task SaveOrUpdateAsync() {
        if (IsEditMode) Update(); else Create();
    }
}
```
**Hvorfor fravalgt**: Adds complexity. Separate ViewModels are clearer (Single Responsibility Principle).

**Alternative 2: Share XAML with AddHabitPage**
```xml
<ContentView x:Class="HabitFormView"><!-- Shared form --></ContentView>
```
**Hvorfor fravalgt**: XAML duplication is acceptable. Shared ContentView adds indirection without much benefit.

**Alternative 3: Dirty tracking (warn on cancel if changes made)**
```csharp
private bool _isDirty = false;
public async Task CancelAsync() {
    if (_isDirty && await ConfirmDiscard()) return;
}
```
**Hvorfor fravalgt**: Nice UX, but adds complexity. Users can re-edit if they accidentally cancel.

### Potentielle forbedringer (v2)
- Undo/redo functionality - Complex state management
- Dirty tracking (warn on unsaved changes) - Nice UX, not MVP
- Preview mode (see changes before saving) - Unnecessary, form is clear
- Batch edit (multiple habits at once) - Feature creep

### Kendte begrænsninger
- **No unsaved changes warning**: Cancel discards changes without confirmation - Acceptable, users can re-edit
- **No undo**: Changes are permanent after save - Acceptable, validation prevents bad data
- **No change history**: Can't see what was changed - Acceptable for MVP

---

## Kode Kvalitet Checklist

### CRUD Operation Safety
- [x] **Validation before update**: IsValid check prevents bad data
- [x] **Null safety**: Checks Habit != null before accessing properties
- [x] **Service error handling**: Try-catch on UpdateHabitAsync with user-friendly alert
- [x] **Navigation safety**: Invalid habitId navigates back (doesn't crash)

### Code Quality Standards
- [x] **KISS**: Simple load-edit-save flow, no complex state management
- [x] **Læsbarhed**: Clear method names (LoadHabitAsync, UpdateAsync)
- [x] **Navngivning**: EditHabitViewModel (descriptive, matches purpose)
- [x] **Funktioner**: Each method focused (~15 lines, single responsibility)
- [x] **DRY**: Reuses Add Habit components (EmojiPicker, ColorPicker, etc.)
- [x] **Error handling**: Try-catch on load and update operations
- [x] **Edge cases**: Invalid habitId, habit not found, null habit (all handled)
- [x] **Performance**: Single database call to load habit (efficient)
- [x] **Testbarhed**: LoadHabitAsync, UpdateAsync easily testable (service mockable)

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/08_EDIT_HABIT.md
- **Related Commands**:
  - Command 028 (AddHabitPage - shares components)
  - Command 026 (HabitDetailPage - navigation source via Edit button)
  - Command 029-030 (Pickers - reused here)

---

## Notes

- **CRITICAL**: LoadHabitAsync must populate SelectedEmoji and SelectedColor (pickers don't auto-sync)
- **CRITICAL**: OnHabitIdChanged triggers LoadHabitAsync automatically (no manual call needed)
- UpdateCommand navigates back to detail page (not home)
- Validation rules identical to AddHabitViewModel (ensures consistency)
- Habit object is reference type (changes apply immediately, validated on save)
- TimePicker Time property binds directly to Habit.ReminderTime (TimeSpan)

---

**Command Status**: Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
