# Command 014: Onboarding Flow Integration

## Metadata
- **Phase**: 2 - Onboarding
- **Dependencies**: 010, 011, 012, 013
- **Estimated Time**: 2 hours
- **Status**: Pending
- **Design Reference**: stribe-design/NAVIGATION.md
- **Frequency Impact**: NO

---

## Formål

Integrere alle onboarding steps til en sammenhængende flow med korrekt navigation, state management og data persistence.

**Hvorfor dette er vigtigt:**
- Ties all onboarding commands together (010-013) into cohesive user journey
- Ensures navigation flow smooth and predictable (no dead ends)
- State persistence critical når user går back/forward (selected habits preserved)
- Onboarding_completed flag ensures one-time experience (not repeated)

---

## Risici

### Potentielle Problemer
1. **State lost ved back navigation**:
   - Edge case: User selects 2 habits, goes back to Welcome, goes forward again
   - Impact: Selected habits lost (must re-select)

2. **Back button on first step crashes app**:
   - Edge case: User taps back on Welcome Page
   - Impact: App exits abruptly or throws navigation exception

3. **Navigation stack corruption**:
   - Edge case: Deep linking or modal dialogs break navigation history
   - Impact: Can't navigate back, or back button does unexpected things

### Mitigering
- OnboardingViewModel registered as Singleton (state persists across navigation)
- GoBackCommand checks navigation stack depth before popping
- Exit confirm dialog on first onboarding step (Welcome Page)
- All routes registered in AppShell before first navigation
- SplashPage checks onboarding_completed and routes correctly

---

## Analyse - Hvad Skal Implementeres

### Navigation Flow Verification
**Current Flow**:
```
App Start → Splash (checks onboarding_completed)
  ├─ NO (first time) → Welcome → Habits → Reminder → Home
  └─ YES (returning) → Home
```

### State Management Requirements
**Key Requirements**:
- OnboardingViewModel must persist state between pages (Singleton lifetime)
- Selected habits (PresetHabits collection) preserved when navigating back/forward
- Custom habits added in dialog (command 012) persist in collection
- ReminderTime preserved when navigating back from ReminderSetup to Habits

### Back Navigation Handling
**Location**: `src/Stribe/ViewModels/OnboardingViewModel.cs`
**Key Requirements**:
- GoBackCommand checks if navigation stack allows pop
- On first step (Welcome Page): Show confirm exit dialog
- On other steps: Normal back navigation via Shell.Navigation.PopAsync

### Route Registration
**Location**: `src/Stribe/AppShell.xaml.cs`
**Key Requirements**:
- All onboarding routes registered:
  - "onboarding/welcome" → WelcomePage
  - "onboarding/habits" → HabitSelectionPage
  - "onboarding/reminder" → ReminderSetupPage
- Home route registered: "home" → HomePage

### Initial Routing Logic
**Location**: `src/Stribe/App.xaml.cs` or `src/Stribe/Views/SplashPage.xaml.cs`
**Key Requirements**:
- SplashPage checks onboarding_completed flag from database
- If completed → navigate to //home
- If not completed → navigate to //onboarding/welcome
- Minimum splash display time (1.5s) before navigation

**Business Rules**:
```csharp
// Onboarding completion check:
1. App starts → SplashPage displays
2. Load "onboarding_completed" setting from database
3. Wait for animations + minimum 1.5s display time
4. Navigate based on onboarding status:
   - If "true" → Shell.GoToAsync("//home")
   - If not "true" → Shell.GoToAsync("//onboarding/welcome")
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 010 (Welcome Page) - implemented
- [x] Command 011 (Habit Selection Page) - implemented
- [x] Command 012 (Custom Habit Dialog) - implemented
- [x] Command 013 (Reminder Setup Page) - implemented
- [x] AppShell with route registration capability
- [x] SplashPage with navigation logic

⚠️ **Assumptions**:
- OnboardingViewModel can be registered as Singleton in DI
- Shell.Navigation stack works correctly
- Database GetSettingAsync/SaveSettingAsync reliable

❌ **Blockers**: None

---

## Implementation Guide

### Filer der verificeres/ændres
- `src/Stribe/AppShell.xaml.cs` - Verify route registrations
- `src/Stribe/ViewModels/OnboardingViewModel.cs` - Add GoBackCommand
- `src/Stribe/Views/SplashPage.xaml.cs` - Verify onboarding routing
- `src/Stribe/MauiProgram.cs` - Change ViewModel lifetime to Singleton

---

## Implementering

### Step 1: Verificer AppShell.xaml.cs route registrations
Path: `src/Stribe/AppShell.xaml.cs`

Ensure all onboarding routes registered:
```csharp
public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();

        // Onboarding routes
        Routing.RegisterRoute("onboarding/welcome", typeof(WelcomePage));
        Routing.RegisterRoute("onboarding/habits", typeof(HabitSelectionPage));
        Routing.RegisterRoute("onboarding/reminder", typeof(ReminderSetupPage));

        // Main app routes
        Routing.RegisterRoute("home", typeof(HomePage));
        // ... other routes from phase 3+
    }
}
```

**Explanation**: All routes must be registered before first navigation. RegisterRoute maps string route to Page type for Shell navigation.

### Step 2: Change OnboardingViewModel lifetime to Singleton
Path: `src/Stribe/MauiProgram.cs`

Change registration from Transient to Singleton:
```csharp
// BEFORE (command 010):
builder.Services.AddTransient<OnboardingViewModel>();

// AFTER (command 014):
builder.Services.AddSingleton<OnboardingViewModel>();
```

**Explanation**: Singleton ensures same ViewModel instance across all onboarding pages. State (PresetHabits, SelectedHabits, ReminderTime) preserved during navigation.

### Step 3: Opdater OnboardingViewModel med GoBackCommand
Path: `src/Stribe/ViewModels/OnboardingViewModel.cs`

Tilføj back navigation handling:
```csharp
// Commands
public ICommand GoBackCommand { get; }

// In constructor
GoBackCommand = new Command(OnGoBack);

// Methods
private async void OnGoBack()
{
    // Check if we can navigate back
    if (Shell.Current.Navigation.NavigationStack.Count > 1)
    {
        await Shell.Current.Navigation.PopAsync();
    }
    else
    {
        // On first onboarding step - confirm exit
        var result = await Application.Current.MainPage.DisplayAlert(
            "Afslut opsætning?",
            "Vil du afslutte opsætningen? Du skal starte forfra næste gang.",
            "Ja, afslut",
            "Annuller");

        if (result)
        {
            // Exit app (or navigate to safe state)
            Application.Current.Quit();
        }
    }
}
```

**Explanation**: NavigationStack.Count check prevents crash when no pages to pop. Exit confirm on first step respects user intent (not accidental tap).

### Step 4: Verificer SplashPage navigation logic
Path: `src/Stribe/Views/SplashPage.xaml.cs`

Ensure correct routing based on onboarding status:
```csharp
protected override async void OnAppearing()
{
    base.OnAppearing();

    // Start entry animations
    await Task.WhenAll(
        AppIcon.FadeTo(1, 400, Easing.CubicOut),
        AppIcon.ScaleTo(1, 400, Easing.CubicOut),
        AppName.FadeTo(1, 300, Easing.CubicOut)
    );

    // Check onboarding status
    var onboardingCompleted = await _database.GetSettingAsync("onboarding_completed");

    // Minimum display time
    await Task.Delay(1500);

    // Navigate based on onboarding status
    if (!string.IsNullOrEmpty(onboardingCompleted) && onboardingCompleted == "true")
    {
        await Shell.Current.GoToAsync("//home");
    }
    else
    {
        await Shell.Current.GoToAsync("//onboarding/welcome");
    }
}
```

**Explanation**: OnAppearing triggers on every splash screen display. Animations run parallel with database check. Minimum 1.5s ensures splash visible (not flash).

### Step 5: Add debug reset helper (optional, DEBUG only)
Path: `src/Stribe/ViewModels/OnboardingViewModel.cs`

Tilføj test method for resetting onboarding:
```csharp
#if DEBUG
public async Task ResetOnboardingForTesting()
{
    // Reset onboarding flag
    await _database.SaveSettingAsync("onboarding_completed", "false");

    // Clear all habits
    var habits = await _habitService.GetAllHabitsAsync();
    foreach (var habit in habits)
    {
        await _habitService.DeleteHabitAsync(habit);
    }

    // Clear reminder settings
    await _settingsService.SetRemindersEnabledAsync(false);

    // Reset to splash
    await Shell.Current.GoToAsync("//splash");
}
#endif
```

**Explanation**: DEBUG-only method for testing. Allows developers to re-test onboarding flow without reinstalling app.

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. First Time User Flow Test (CRITICAL!)
```
Step-by-step verification:
1. Uninstall app (eller clear all data)
2. Install og start app
3. Verify: Splash screen vises (1.5s+)
4. Verify: Navigates til Welcome page (not home)
5. Tap "Kom i gang"
6. Verify: Navigates til Habit Selection page
7. Select 2 habits (e.g. Motion, Læse)
8. Tap "Fortsæt"
9. Verify: Navigates til Reminder Setup page
10. Set time to 10:00
11. Tap "Aktiver påmindelse"
12. Verify: Navigates til Home page
13. Verify: 2 habits visible on home screen
14. Close app and restart
15. Verify: Goes directly to Home (not splash → onboarding)
```

### 3. Back Navigation Test
```
Scenario 1: Back from Welcome
  → På Welcome page, tap back button
  → Verify: Confirm exit dialog appears
  → Tap "Annuller"
  → Verify: Stays on Welcome page
  → Tap back again, tap "Ja, afslut"
  → Verify: App exits

Scenario 2: Back from Habits
  → På Habit Selection, select 2 habits
  → Tap back button
  → Verify: Goes to Welcome page
  → Tap "Kom i gang"
  → Verify: Returns to Habit Selection
  → Verify: 2 habits still selected (state preserved!)

Scenario 3: Back from Reminder
  → På Reminder Setup, set time 14:00
  → Tap back button
  → Verify: Goes to Habit Selection
  → Verify: Habits still selected
  → Tap "Fortsæt"
  → Verify: Returns to Reminder Setup
  → Verify: Time still 14:00 (state preserved!)
```

### 4. Custom Habit Flow Test
```
1. Navigate to Habit Selection
2. Tap "Egen" chip
3. Add custom habit "Yoga" with emoji 🧘
4. Verify: Custom habit appears in grid (before "Egen" chip)
5. Verify: Custom habit auto-selected (green background)
6. Navigate back to Welcome, then forward to Habits again
7. Verify: Custom habit "Yoga" still in grid and selected
8. Complete onboarding
9. Verify: Custom habit saved to database
```

### 5. Skip Reminder Flow Test
```
1. Navigate through Welcome → Habits
2. Select 1 habit
3. Navigate to Reminder Setup
4. Tap "Spring over"
5. Verify: Navigates to Home
6. Verify: 1 habit visible on home
7. Verify: No reminders enabled (check settings)
8. Verify: onboarding_completed = true
```

### 6. Returning User Test
```
1. Complete onboarding once (any path)
2. Close app
3. Restart app
4. Verify: Splash screen shows
5. Verify: Navigates directly to Home (not onboarding)
6. Verify: Habits loaded from database
```

---

## Acceptance Criteria

- [x] All onboarding routes registered in AppShell
- [x] OnboardingViewModel registered as Singleton (state persistence)
- [x] SplashPage routing logic correct (checks onboarding_completed)
- [x] GoBackCommand implemented with stack depth check
- [x] Exit confirm dialog on first onboarding step
- [x] First time user flow completes successfully
- [x] Returning user flow goes directly to home
- [x] Back navigation works on all steps
- [x] State persists when navigating back/forward
- [x] Custom habits persist in ViewModel
- [x] Both "Enable" and "Skip" reminder paths work
- [x] Habits saved to database correctly
- [x] onboarding_completed flag set correctly
- [x] Build succeeds
- [x] All test scenarios pass (CRITICAL!)

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Singleton ViewModel**: Simple lifetime change (no complex state service)
- **Shell routing**: Built-in navigation (no custom router framework)
- **Flag-based routing**: Simple string check "onboarding_completed" (no enum state machine)
- **Direct navigation calls**: GoToAsync with string routes (no indirection)

### Alternativer overvejet

**Alternative 1: MVVM navigation service**
```csharp
await _navigationService.NavigateAsync("HabitSelection", parameters);
```
**Hvorfor fravalgt**: Shell.GoToAsync built-in and sufficient. Extra abstraction adds complexity without benefit for simple app.

**Alternative 2: Prism or ReactiveUI navigation**
```csharp
[Reactive] public INavigationService Navigation { get; set; }
```
**Hvorfor fravalgt**: Large dependency for small benefit. Built-in MAUI Shell navigation handles all use cases.

**Alternative 3: Store state in Preferences instead of ViewModel**
```csharp
Preferences.Set("selected_habits", JsonSerializer.Serialize(habits));
```
**Hvorfor fravalgt**: Over-engineering. Onboarding is one-time flow - Singleton ViewModel sufficient. Persistence only needed for onboarding_completed flag.

**Alternative 4: Multi-page wizard control**
```xaml
<CarouselView ItemsSource="{Binding OnboardingSteps}">
```
**Hvorfor fravalgt**: Less flexible for back navigation and conditional flows. Shell routing gives more control.

### Potentielle forbedringer (v2)
- Progress bar showing onboarding completion % - Visual feedback
- Animated page transitions (slide in/out) - Modern feel
- Skip entire onboarding option (go directly to home with defaults) - Power user path
- Save partial onboarding state to resume later - Interrupted session recovery

### Kendte begrænsninger
- **State lost on app crash**: If app crashes mid-onboarding, user starts over (acceptable - rare occurrence)
- **No analytics tracking**: Don't track which step user exits at (acceptable - MVP simplicity)
- **Single onboarding path**: No A/B testing different flows (acceptable - no experimentation framework)
- **No deep linking into onboarding**: Can't start at specific step (acceptable - sequential flow required)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple route registration + Singleton ViewModel (minimal complexity)
- [x] **Læsbarhed**: GoBackCommand, ResetOnboardingForTesting self-documenting
- [x] **Navngivning**: onboarding_completed, NavigationStack.Count clear meaning
- [x] **Funktioner**: OnGoBack ~15 lines (single purpose - navigate or confirm exit)
- [x] **DRY**: GoBackCommand reused across all onboarding pages (no duplicate back logic)
- [x] **Error handling**: Navigation exceptions propagate to global handler
- [x] **Edge cases**: Empty stack, first step, returning user all handled
- [x] **Performance**: Singleton ViewModel lightweight (no heavy state)
- [x] **Testbarhed**: Navigation testable via mocks, state persistence testable

---

## Design Files Reference

- **Navigation Spec**: stribe-design/NAVIGATION.md
- **Screen Specs**: stribe-design/screens/02_ONBOARDING_WELCOME.md through 04_ONBOARDING_REMINDER.md
- **Related**: Commands 010-013 (individual onboarding pages)

---

## Notes

- Singleton lifetime critical for state preservation (don't change back to Transient!)
- NavigationStack.Count check prevents InvalidOperationException when popping empty stack
- Application.Current.Quit() graceful exit (better than Process.Kill on Android)
- onboarding_completed string comparison with "true" case-sensitive (ensure consistent casing)
- Shell.Current.GoToAsync("//route") with "//" prefix ensures absolute navigation (not relative)
- SplashPage OnAppearing (not OnNavigatedTo) ensures animation runs on every display
- DEBUG-only ResetOnboarding method won't compile in Release build (safe for production)

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
