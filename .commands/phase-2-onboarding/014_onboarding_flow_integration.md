# Command 014: Onboarding Flow Integration

## Metadata
- **ID:** 014
- **Fase:** 2 - Onboarding
- **Estimeret tid:** 2 timer
- **Afhængigheder:** 010, 011, 012, 013
- **Design reference:** stribe-design/NAVIGATION.md

## Formål
Integrere alle onboarding steps til en sammenhængende flow med korrekt navigation, state management og data persistence. Sikre at onboarding kun vises første gang og at app husker brugerens valg.

## Risici
- **Medium risiko**: Navigation flow skal være smooth og robust
- **Opmærksomhed**:
  - State skal persist når brugeren går frem/tilbage
  - Back button på første step skal exit app eller vise confirm
  - onboarding_completed flag skal sættes korrekt
- **Test grundigt**: Full onboarding flow fra start til slut

## Analyse

### Hvad skal implementeres
- Verificer navigation flow mellem alle onboarding steps
- Implementer state persistence ved navigation
- Håndter back button behavior korrekt
- Test onboarding_completed flag
- Sikre smooth transitions mellem steps

### Filer der ændres
- `src/Stribe/ViewModels/OnboardingViewModel.cs` - State management
- `src/Stribe/App.xaml.cs` - Initial routing logic
- `src/Stribe/AppShell.xaml.cs` - Route registrations

### Navigation Flow
```
Splash → Check onboarding_completed
  ├─ NO → Welcome → Habits → Reminder → Home
  └─ YES → Home
```

### State Management Requirements
- Selected habits skal persist ved back/forward navigation
- Custom habits skal persist i selection
- Reminder time skal persist

## Dependencies Check
✅ Command 010 (Welcome Page) - implementeret
✅ Command 011 (Habit Selection) - implementeret
✅ Command 012 (Custom Habit Dialog) - implementeret
✅ Command 013 (Reminder Setup) - implementeret
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Implementer Onboarding Flow Integration for Stribe:

1. **Verificer AppShell.xaml.cs route registrations**:

Sikre alle onboarding routes er registreret:
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
        // ... other routes
    }
}
```

2. **Opdater App.xaml.cs OnStart logic**:

Verificer korrekt initial routing:
```csharp
protected override async void OnStart()
{
    base.OnStart();

    // Small delay to ensure services are ready
    await Task.Delay(100);

    var db = Handler?.MauiContext?.Services.GetService<IDatabaseService>();

    if (db == null)
    {
        // Fallback if service not available
        MainPage = new AppShell();
        await Shell.Current.GoToAsync("//splash");
        return;
    }

    var onboardingCompleted = await db.GetSettingAsync("onboarding_completed");

    if (!string.IsNullOrEmpty(onboardingCompleted) && onboardingCompleted == "true")
    {
        // Returning user - go to home
        await Shell.Current.GoToAsync("//home");
    }
    else
    {
        // First time user - show splash then onboarding
        await Shell.Current.GoToAsync("//splash");
        // Splash will navigate to onboarding/welcome after delay
    }
}
```

3. **Opdater ViewModels/OnboardingViewModel.cs**:

Tilføj back navigation handling:
```csharp
// Commands
public ICommand GoBackCommand { get; }

// Constructor
GoBackCommand = new Command(OnGoBack);

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
            // Exit app or go to a safe state
            Application.Current.Quit();
        }
    }
}
```

4. **Opdater Views/SplashPage.xaml.cs**:

Sikre korrekt navigation til onboarding:
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

5. **Tilføj navigation transition animations**:

I AppShell.xaml:
```xaml
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:views="clr-namespace:Stribe.Views"
       x:Class="Stribe.AppShell"
       FlyoutBehavior="Disabled">

    <!-- Define shell content -->
    <TabBar>
        <ShellContent
            Title="Home"
            ContentTemplate="{DataTemplate views:HomePage}"
            Route="home" />
    </TabBar>

</Shell>
```

6. **Test helper for resetting onboarding**:

Tilføj debug method i OnboardingViewModel (kun til test):
```csharp
#if DEBUG
public async Task ResetOnboardingForTesting()
{
    await _database.SaveSettingAsync("onboarding_completed", "false");

    // Clear all habits
    var habits = await _habitService.GetAllHabitsAsync();
    foreach (var habit in habits)
    {
        await _habitService.DeleteHabitAsync(habit);
    }

    // Reset to splash
    await Shell.Current.GoToAsync("//splash");
}
#endif
```

Reference design: stribe-design/NAVIGATION.md
```

### Forventet resultat
- Smooth navigation mellem alle onboarding steps
- State persists ved back/forward navigation
- First time users ser: Splash → Welcome → Habits → Reminder → Home
- Returning users ser: Splash → Home
- Back button på første onboarding step viser exit confirm
- onboarding_completed flag sættes korrekt

### Verifikation

#### Build test
```bash
dotnet build src/Stribe/Stribe.csproj
```

#### Integration tests - KRITISKE!

**Test 1: First time user flow**
```
1. Uninstall app (eller clear data)
2. Install og start app
3. Se splash screen (1.5s)
4. Navigate til Welcome page
5. Tap "Kom i gang"
6. Navigate til Habit Selection
7. Vælg 2 habits
8. Tap "Fortsæt"
9. Navigate til Reminder Setup
10. Tap "Aktiver påmindelse"
11. Navigate til Home
12. Verificer: 2 habits vises i home
```

**Test 2: Back navigation**
```
1. På Welcome → tap back → confirm exit dialog
2. På Habits → tap back → går til Welcome
3. På Reminder → tap back → går til Habits
4. Verificer: Selected habits stadig valgt
```

**Test 3: Custom habit flow**
```
1. På Habits → tap "Egen"
2. Add custom habit "Test"
3. Verificer: Custom habit tilføjet til selection
4. Navigate frem til Reminder
5. Navigate tilbage til Habits
6. Verificer: Custom habit stadig i selection
```

**Test 4: Returning user**
```
1. Complete onboarding
2. Close app
3. Restart app
4. Verificer: Går direkte til Home (efter splash)
5. Verificer: Habits loaded from database
```

**Test 5: Skip reminder**
```
1. Navigate gennem onboarding
2. På Reminder → tap "Spring over"
3. Verificer: Går til Home
4. Verificer: Reminders disabled
5. Verificer: Habits saved correctly
```

#### Manual verifikation
- [ ] First time user ser hele onboarding flow
- [ ] Returning user går direkte til home
- [ ] Back navigation virker på alle steps
- [ ] State persists ved navigation
- [ ] Custom habits persists
- [ ] Exit confirm på første step
- [ ] onboarding_completed saved korrekt
- [ ] Smooth transitions mellem steps
- [ ] Habits saved to database
- [ ] No crashes eller navigation errors

### Acceptkriterier
- [ ] Alle onboarding routes registreret
- [ ] App.xaml.cs routing logic korrekt
- [ ] SplashPage navigation korrekt
- [ ] OnboardingViewModel state management robust
- [ ] Back navigation håndteret korrekt
- [ ] Exit confirm på første step
- [ ] onboarding_completed flag virker
- [ ] First time user flow komplet
- [ ] Returning user flow komplet
- [ ] Build succeeds
- [ ] Alle test scenarier passerer

## Status
- [ ] Analyse gennemført
- [ ] Dependencies verified
- [ ] Implementering gennemført
- [ ] Verifikation bestået (KRITISK!)
- [ ] Markeret færdig i _state.json
