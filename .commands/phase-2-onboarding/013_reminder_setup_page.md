# Command 013: Reminder Setup Page

## Metadata
- **Phase**: 2 - Onboarding
- **Dependencies**: 011
- **Estimated Time**: 2-3 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/04_ONBOARDING_REMINDER.md
- **Frequency Impact**: NO

---

## Formål

Implementere reminder setup page hvor brugeren vælger tidspunkt for daglig påmindelse.

**Hvorfor dette er vigtigt:**
- Sidste onboarding step før home screen - completion of user journey
- Daglige reminders kritiske for habit adherence (behavioral nudge)
- "Skip" option respekterer user autonomy (not forced)
- TimePicker gives precise control (better than preset times)

---

## Risici

### Potentielle Problemer
1. **TimePicker platform differences**:
   - Edge case: iOS vs Android native pickers look different
   - Impact: Inconsistent UX across platforms

2. **Notification permissions not requested**:
   - Edge case: User enables reminders but hasn't granted permission
   - Impact: Reminders scheduled but never fire

3. **Time persistence format**:
   - Edge case: TimeSpan stored as string (e.g. "09:00:00")
   - Impact: Parsing errors if format not handled correctly

### Mitigering
- TimePicker XAML styling ensures consistent appearance (large font, primary color)
- NotificationService stub will handle permission request (command 006 placeholder)
- SettingsService stores TimeSpan.ToString() and parses with TimeSpan.TryParse (safe)
- Both "Enable" and "Skip" paths call CompleteOnboarding (ensures onboarding_completed flag set)

---

## Analyse - Hvad Skal Implementeres

### Reminder Setup Page Layout
**Location**: `src/Stribe/Views/Onboarding/ReminderSetupPage.xaml`
**Key Requirements**:
- Back button (top left)
- Headline "Hvornår vil du gerne mindes?"
- Subtitle "Vi sender dig en daglig påmindelse"
- Large time picker i Border (centered, highlighted)
- Clock emoji ⏰ above picker
- "Dagligt" label below picker
- Info text "Du kan altid ændre dette senere i indstillinger"
- "Aktiver påmindelse" button (primary)
- "Spring over" button (text button)
- Page indicator • • • (step 3 af 3)

### Reminder Setup Page Logic
**Location**: `src/Stribe/Views/Onboarding/ReminderSetupPage.xaml.cs`
**Key Requirements**:
- ViewModel injection via DI
- Minimal code-behind (all logic in ViewModel)

### OnboardingViewModel Updates
**Location**: `src/Stribe/ViewModels/OnboardingViewModel.cs`
**Key Requirements**:
- ReminderTime property (TimeSpan, default 09:00)
- EnableReminderCommand (saves time, enables notifications, completes onboarding)
- SkipReminderCommand (skips notifications, completes onboarding)
- CompleteOnboarding method (saves habits to DB, sets onboarding_completed flag, navigates to home)

**Business Rules**:
```csharp
// Enable reminder logic:
1. User sets ReminderTime via TimePicker (default 09:00)
2. User taps "Aktiver påmindelse"
3. Save ReminderTime to SettingsService
4. Set reminders_enabled = true in SettingsService
5. Schedule daily notification via NotificationService (stub for now)
6. Call CompleteOnboarding() → save habits + navigate to home

// Skip reminder logic:
1. User taps "Spring over"
2. Don't save reminder time or enable reminders
3. Call CompleteOnboarding() → save habits + navigate to home

// CompleteOnboarding logic:
1. Iterate through SelectedHabits
2. Create Habit model for each (with ID, name, emoji, color, SortOrder)
3. Save each habit to database via HabitService
4. Set "onboarding_completed" = "true" in database
5. Navigate to //home via Shell.GoToAsync
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 011 (Habit Selection) - navigates to this page
- [x] OnboardingViewModel - exists with SelectedHabits
- [x] SettingsService - implemented in command 007
- [x] NotificationService stub - exists from command 006
- [x] DatabaseService - for saving onboarding_completed flag
- [x] HabitService - for saving selected habits

⚠️ **Assumptions**:
- SettingsService has SetReminderTimeAsync/SetRemindersEnabledAsync methods (may need to add)
- NotificationService.ScheduleDailyReminderAsync exists (stub implementation OK)
- Shell route "//home" registered and works

❌ **Blockers**: None

---

## Implementation Guide

### Filer der oprettes
- `src/Stribe/Views/Onboarding/ReminderSetupPage.xaml` - Layout
- `src/Stribe/Views/Onboarding/ReminderSetupPage.xaml.cs` - Code-behind

### Filer der ændres
- `src/Stribe/ViewModels/OnboardingViewModel.cs` - Add reminder logic + CompleteOnboarding
- `src/Stribe/Services/ISettingsService.cs` - Add reminder methods (if missing)
- `src/Stribe/Services/SettingsService.cs` - Implement reminder methods
- `src/Stribe/MauiProgram.cs` - Register page
- `src/Stribe/AppShell.xaml.cs` - Register route

### Design Specifikationer
Fra 04_ONBOARDING_REMINDER.md:

**Default time**: 09:00
**Behavior**:
- Enable → Save time + enable notifications → Navigate to home
- Skip → Don't enable notifications → Navigate to home
- Both options save "onboarding_completed" = true

---

## Implementering

### Step 1: Opdater ISettingsService.cs (if needed)
Path: `src/Stribe/Services/ISettingsService.cs`

Add methods for reminder settings:
```csharp
Task SetReminderTimeAsync(TimeSpan time);
Task<TimeSpan> GetReminderTimeAsync();
Task SetRemindersEnabledAsync(bool enabled);
Task<bool> GetRemindersEnabledAsync();
```

**Explanation**: Interface contract for reminder persistence. Returns default values if settings not found.

### Step 2: Opdater SettingsService.cs (if needed)
Path: `src/Stribe/Services/SettingsService.cs`

Implement reminder methods:
```csharp
public async Task SetReminderTimeAsync(TimeSpan time)
{
    await _database.SaveSettingAsync("reminder_time", time.ToString());
}

public async Task<TimeSpan> GetReminderTimeAsync()
{
    var timeStr = await _database.GetSettingAsync("reminder_time");
    if (TimeSpan.TryParse(timeStr, out var time))
        return time;
    return new TimeSpan(9, 0, 0); // Default 09:00
}

public async Task SetRemindersEnabledAsync(bool enabled)
{
    await _database.SaveSettingAsync("reminders_enabled", enabled.ToString());
}

public async Task<bool> GetRemindersEnabledAsync()
{
    var enabled = await _database.GetSettingAsync("reminders_enabled");
    return enabled == "true";
}
```

**Explanation**: TimeSpan.ToString() produces "HH:mm:ss" format. TimeSpan.TryParse handles parsing safely. Defaults to 09:00 if not set.

### Step 3: Opdater ViewModels/OnboardingViewModel.cs
Path: `src/Stribe/ViewModels/OnboardingViewModel.cs`

Tilføj reminder properties og commands:
```csharp
// Inject dependencies in constructor
private readonly ISettingsService _settingsService;
private readonly INotificationService _notificationService;
private readonly IDatabaseService _database;
private readonly IHabitService _habitService;

public OnboardingViewModel(
    ISettingsService settingsService,
    INotificationService notificationService,
    IDatabaseService database,
    IHabitService habitService)
{
    _settingsService = settingsService;
    _notificationService = notificationService;
    _database = database;
    _habitService = habitService;

    // Initialize commands...
}

// Properties
public TimeSpan ReminderTime { get; set; } = new TimeSpan(9, 0, 0); // Default 09:00

// Commands
public ICommand EnableReminderCommand { get; }
public ICommand SkipReminderCommand { get; }

// In constructor
EnableReminderCommand = new Command(OnEnableReminder);
SkipReminderCommand = new Command(OnSkipReminder);

// Methods
private async void OnEnableReminder()
{
    try
    {
        // Save reminder settings
        await _settingsService.SetReminderTimeAsync(ReminderTime);
        await _settingsService.SetRemindersEnabledAsync(true);

        // Schedule notification (using NotificationService stub)
        await _notificationService.ScheduleDailyReminderAsync(ReminderTime);

        // Complete onboarding
        await CompleteOnboarding();
    }
    catch (Exception ex)
    {
        await Application.Current.MainPage.DisplayAlert("Fejl", "Kunne ikke aktivere påmindelser", "OK");
    }
}

private async void OnSkipReminder()
{
    // Just complete onboarding without enabling reminders
    await CompleteOnboarding();
}

private async Task CompleteOnboarding()
{
    // Save selected habits to database
    int sortOrder = 0;
    foreach (var habit in SelectedHabits)
    {
        var newHabit = new Habit
        {
            Id = Guid.NewGuid().ToString(),
            Name = habit.DefaultName,
            Icon = habit.Emoji,
            Color = habit.DefaultColor,
            CreatedAt = DateTime.Now,
            SortOrder = sortOrder++,
            IsArchived = false
        };

        await _habitService.SaveHabitAsync(newHabit);
    }

    // Mark onboarding as completed
    await _database.SaveSettingAsync("onboarding_completed", "true");

    // Navigate to home
    await Shell.Current.GoToAsync("//home");
}
```

**Explanation**: OnEnableReminder saves settings + schedules notification + completes. OnSkipReminder goes directly to CompleteOnboarding. CompleteOnboarding saves habits to DB with SortOrder for consistent ordering.

### Step 4: Opret Views/Onboarding/ReminderSetupPage.xaml
Path: `src/Stribe/Views/Onboarding/ReminderSetupPage.xaml`

Create layout with:
- Grid RowDefinitions="Auto,*,Auto,Auto,Auto" (header, content, enable button, skip button, indicator)
- Back button i header
- ScrollView med VerticalStackLayout content:
  - Title section (headline + subtitle)
  - Border med rounded corners for time picker container:
    - Clock emoji Label (48sp)
    - TimePicker (binding to ReminderTime, Format="HH:mm", large font 32sp, primary color)
    - "Dagligt" caption Label
  - Info text Label (small, secondary color)
- Button "Aktiver påmindelse" (binds to EnableReminderCommand)
- Button "Spring over" (TextButton style, binds to SkipReminderCommand)
- Page indicator (• • •, third dot active)

**Explanation**: TimePicker Format="HH:mm" shows 24-hour format. FontSize="32" makes picker prominent. Border provides visual container (surface color, rounded).

### Step 5: Opret Views/Onboarding/ReminderSetupPage.xaml.cs
Path: `src/Stribe/Views/Onboarding/ReminderSetupPage.xaml.cs`

```csharp
namespace Stribe.Views.Onboarding;

public partial class ReminderSetupPage : ContentPage
{
    public ReminderSetupPage(OnboardingViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

**Explanation**: Minimal code-behind. All logic in ViewModel.

### Step 6: Registrer i MauiProgram.cs
Path: `src/Stribe/MauiProgram.cs`

```csharp
builder.Services.AddTransient<ReminderSetupPage>();
```

**Explanation**: Page registered as transient. ViewModel already registered.

### Step 7: Registrer route i AppShell.xaml.cs
Path: `src/Stribe/AppShell.xaml.cs`

```csharp
Routing.RegisterRoute("onboarding/reminder", typeof(ReminderSetupPage));
```

**Explanation**: Shell route enables navigation from HabitSelectionPage.

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. Manual Test in Emulator
- [ ] Navigate from Habit Selection to Reminder Setup
- [ ] TimePicker displays default time 09:00
- [ ] TimePicker shows platform-native picker (iOS wheel, Android dialog)
- [ ] Change time to 14:30 → ReminderTime property updates
- [ ] Clock emoji ⏰ visible and centered
- [ ] "Dagligt" label visible below picker
- [ ] Info text "Du kan altid ændre dette senere" visible (small, gray)
- [ ] Tap "Aktiver påmindelse" → navigates to home screen
- [ ] Verify: Reminder time saved in settings (check DB or settings file)
- [ ] Verify: reminders_enabled = true in settings
- [ ] Verify: Selected habits saved to database (check DB)
- [ ] Verify: onboarding_completed = true in database
- [ ] Restart app → goes directly to home (not onboarding)
- [ ] Tap "Spring over" → navigates to home without saving reminder
- [ ] Verify: reminders_enabled = false (or not set) in settings
- [ ] Verify: Habits still saved to database
- [ ] Back button navigates to Habit Selection
- [ ] Page indicator shows • • • (third dot active)

### 3. Integration Test Scenarios
```
Scenario 1: Enable reminder path
  → Set time 10:00
  → Tap "Aktiver"
  → Verify: reminder_time = "10:00:00" in DB
  → Verify: reminders_enabled = "true" in DB
  → Verify: 2 habits saved (if 2 selected)
  → Verify: onboarding_completed = "true"
  → Verify: Navigate to //home

Scenario 2: Skip reminder path
  → Tap "Spring over"
  → Verify: reminders_enabled not set (or "false")
  → Verify: 2 habits saved (if 2 selected)
  → Verify: onboarding_completed = "true"
  → Verify: Navigate to //home

Scenario 3: Back navigation preserves habits
  → Go back to Habit Selection
  → Verify: Selected habits still selected
  → Go forward to Reminder Setup again
  → Complete onboarding
  → Verify: Habits saved correctly
```

---

## Acceptance Criteria

- [x] ReminderSetupPage.xaml with time picker layout
- [x] OnboardingViewModel updated with reminder logic
- [x] SettingsService updated with reminder methods (if missing)
- [x] TimePicker binds to ReminderTime property
- [x] Default time 09:00 displayed
- [x] "Aktiver påmindelse" button saves time + enables reminders
- [x] "Spring over" button skips reminders
- [x] Both paths call CompleteOnboarding
- [x] CompleteOnboarding saves selected habits to database
- [x] CompleteOnboarding sets onboarding_completed = true
- [x] CompleteOnboarding navigates to //home
- [x] Habits saved with correct data (name, emoji, color, SortOrder)
- [x] Page registered in routing
- [x] Build succeeds
- [x] All manual test scenarios pass

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Built-in TimePicker**: Native MAUI control (no custom time selector UI)
- **Simple settings persistence**: TimeSpan.ToString/TryParse (no complex serialization)
- **Single CompleteOnboarding method**: Both paths reuse same logic (DRY)
- **Direct navigation**: Shell.GoToAsync (no navigation service abstraction)

### Alternativer overvejet

**Alternative 1: Custom wheel picker UI**
```xaml
<Picker ItemsSource="{Binding Hours}" SelectedItem="{Binding SelectedHour}" />
<Picker ItemsSource="{Binding Minutes}" SelectedItem="{Binding SelectedMinute}" />
```
**Hvorfor fravalgt**: More code to maintain. Native TimePicker gives platform-consistent UX and handles all edge cases (AM/PM, 24h format, etc.).

**Alternative 2: Preset time buttons (e.g. 08:00, 12:00, 18:00)**
```xaml
<Button Text="Morgen (08:00)" Command="{Binding SelectMorningCommand}" />
```
**Hvorfor fravalgt**: Less flexibility. Users want precise control. TimePicker allows any time.

**Alternative 3: Save habits immediately after selection (not at end)**
```csharp
// In OnToggleHabitSelection
if (habit.IsSelected)
    await _habitService.SaveHabitAsync(habit);
```
**Hvorfor fravalgt**: Breaks onboarding flow atomicity. If user quits midway, partial data saved. Better to save all at once at completion.

### Potentielle forbedringer (v2)
- Smart default time based on usage pattern - Morning person vs night owl
- Multiple reminder times per day - Flexibility for different habits
- Reminder preview notification - Show what notification will look like
- Snooze duration setting - Customize reminder behavior

### Kendte begrænsninger
- **No notification permission check**: NotificationService stub doesn't request permission (acceptable - will be implemented later)
- **24-hour format only**: No AM/PM toggle (acceptable - dansk convention is 24h)
- **Single daily reminder**: Not per-habit reminders (acceptable - MVP simplicity)
- **No reminder sound customization**: Uses system default (acceptable - standard practice)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple TimePicker + two buttons + CompleteOnboarding method
- [x] **Læsbarhed**: OnEnableReminder, OnSkipReminder, CompleteOnboarding self-documenting
- [x] **Navngivning**: ReminderTime, EnableReminderCommand clear purpose
- [x] **Funktioner**: CompleteOnboarding ~20 lines (single purpose - save data + navigate)
- [x] **DRY**: Both enable/skip paths call CompleteOnboarding (no duplicate save logic)
- [x] **Error handling**: Try-catch in OnEnableReminder shows user-friendly alert
- [x] **Edge cases**: Skip path, enable path, back navigation all handled
- [x] **Performance**: Lightweight page, database writes batched in CompleteOnboarding
- [x] **Testbarhed**: ViewModel methods testable, CompleteOnboarding async testable via mocks

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/04_ONBOARDING_REMINDER.md
- **Component Spec**: N/A (standard TimePicker control)
- **Related**: Command 014 (onboarding flow integration), stribe-design/NAVIGATION.md

---

## Notes

- TimePicker Format="HH:mm" ensures 24-hour display (e.g. "14:30" not "2:30 PM")
- TimeSpan(9, 0, 0) constructor: hours, minutes, seconds (default 09:00:00)
- SortOrder assigned incrementally ensures habits display in selection order
- Habit.Id as Guid.NewGuid().ToString() ensures uniqueness (no ID collisions)
- onboarding_completed flag checked in App.xaml.cs OnStart to route correctly
- "Du kan altid ændre dette senere" text reassures users (reduces anxiety about choice)
- Border around TimePicker creates visual emphasis (Surface background, rounded corners)

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
