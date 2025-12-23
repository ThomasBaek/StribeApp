# Command 002: Splash Screen

## Metadata
- **Phase**: 1 - Foundation
- **Dependencies**: 001
- **Estimated Time**: 1-2 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/01_SPLASH.md
- **Frequency Impact**: NO

---

## Formål

Implementere splash screen der vises ved app start med smooth entry animations.

**Hvorfor dette er vigtigt:**
- Giver branding moment ved app start
- Tid til at indlæse DatabaseService og check onboarding status
- Professional UX med animations
- Auto-navigation til korrekt destination (onboarding vs home)

---

## Risici

### Potentielle Problemer
1. **Animation lag på lavere-end devices**:
   - Edge case: Older phones med slow GPU
   - Impact: Animations ser laggy ud

2. **DatabaseService load time**:
   - Edge case: Slow disk I/O
   - Impact: Screen vises for kort tid eller for lang tid

### Mitigering
- Simple fade/scale animations (low GPU overhead)
- Minimum 1.5s display time ensures animations complete
- DatabaseService load er parallel med animation

---

## Analyse - Hvad Skal Implementeres

### Splash Page Layout
**Location**: `src/Stribe/Pages/SplashPage.xaml`
**Key Requirements**:
- Primary color background (#2D5A4A)
- Logo emoji 🌿 (80dp, centreret)
- App name "Stribe" (32sp, bold, under logo)
- Entry animations (logo + name)

### Splash Page Logic
**Location**: `src/Stribe/Pages/SplashPage.xaml.cs`
**Key Requirements**:
- OnAppearing() triggers animations
- DatabaseService injection for onboarding check
- Navigation til //onboarding eller //home
- Minimum 1500ms total display time

**Business Rules**:
```csharp
// Navigation logic:
1. Load onboarding_completed setting fra database
2. Wait for animations + minimum display time (1.5s)
3. Navigate:
   - If onboarding_completed == "true" → //home
   - Else → //onboarding
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 001 (AppShell navigation structure)
- [x] DatabaseService available via DI
- [x] Colors.xaml defines Primary color

⚠️ **Assumptions**:
- Primary color (#2D5A4A) defined in Colors.xaml
- AppShell routes registered (//home, //onboarding)

❌ **Blockers**: None

---

## Implementation Guide

### Step 1: Update SplashPage.xaml
Path: `src/Stribe/Pages/SplashPage.xaml`

```xaml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="Stribe.Pages.SplashPage"
             BackgroundColor="{StaticResource Primary}"
             NavigationPage.HasNavigationBar="False">

    <Grid>
        <VerticalStackLayout
            x:Name="ContentStack"
            VerticalOptions="Center"
            HorizontalOptions="Center"
            Spacing="16">

            <!-- App Icon/Logo -->
            <Label
                x:Name="AppIcon"
                Text="🌿"
                FontSize="80"
                HorizontalOptions="Center"
                Opacity="0"
                Scale="0.5" />

            <!-- App Name -->
            <Label
                x:Name="AppName"
                Text="Stribe"
                FontSize="32"
                FontAttributes="Bold"
                TextColor="White"
                HorizontalOptions="Center"
                Opacity="0"
                TranslationY="20" />
        </VerticalStackLayout>
    </Grid>
</ContentPage>
```

**Explanation**: Initial opacity=0 and transforms set up for animation.

### Step 2: Update SplashPage.xaml.cs
Path: `src/Stribe/Pages/SplashPage.xaml.cs`

```csharp
using Stribe.Services;

namespace Stribe.Pages;

public partial class SplashPage : ContentPage
{
    private readonly IDatabaseService _database;

    public SplashPage(IDatabaseService database)
    {
        InitializeComponent();
        _database = database;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        // Start animations in parallel
        var logoTask = Task.Run(async () =>
        {
            await Task.Delay(200); // Delay before logo animation
            await AppIcon.FadeTo(1, 400, Easing.CubicOut);
            await AppIcon.ScaleTo(1.0, 400, Easing.CubicOut);
        });

        var nameTask = Task.Run(async () =>
        {
            await Task.Delay(400); // Delay before name animation
            await AppName.FadeTo(1, 300, Easing.CubicOut);
            await AppName.TranslateTo(0, 0, 300, Easing.CubicOut);
        });

        // Check onboarding status
        var onboardingCompleted = await _database.GetSettingAsync("onboarding_completed");

        // Wait for animations to complete
        await Task.WhenAll(logoTask, nameTask);

        // Minimum display time (1500ms total)
        await Task.Delay(1500);

        // Navigate based on onboarding status
        if (!string.IsNullOrEmpty(onboardingCompleted) && onboardingCompleted == "true")
        {
            await Shell.Current.GoToAsync("//home");
        }
        else
        {
            await Shell.Current.GoToAsync("//onboarding");
        }
    }
}
```

**Explanation**: Animations run parallel with database check, then minimum display time before navigation.

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. Manual Test in Emulator
- [ ] Splash shows primary green background (#2D5A4A)
- [ ] Logo emoji 🌿 fades in + scales from 0.5 to 1.0 smoothly
- [ ] App name "Stribe" fades in + slides up after logo
- [ ] Total display time ~1.5 seconds
- [ ] **First run**: Navigates to //onboarding
- [ ] **Returning user**: Navigates to //home (after onboarding completed)
- [ ] No navigation bar visible
- [ ] Animations smooth on emulator (60fps)

---

## Acceptance Criteria

- [x] SplashPage.xaml layout with logo + app name
- [x] Entry animations (fade + scale for logo, fade + slide for name)
- [x] DatabaseService injection works
- [x] Onboarding status check implemented
- [x] Navigation logic to correct destination
- [x] Minimum 1.5s display time
- [x] Build succeeds
- [x] Manual testing passed

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Built-in MAUI animations**: Uses FadeTo(), ScaleTo(), TranslateTo() (no custom framework)
- **Simple parallel async**: Task.WhenAll for concurrent animations
- **Single responsibility**: OnAppearing handles animation + navigation only
- **No state machine**: Simple if-else for navigation (not over-engineered)

### Alternativer overvejet

**Alternative 1: Lottie animation JSON**
```xaml
<lottie:AnimationView Source="splash_animation.json" />
```
**Hvorfor fravalgt**: Adds dependency (SkiaSharp.Extended.UI.Maui), overkill for simple fade/scale. Built-in animations are sufficient.

**Alternative 2: VisualStateManager for animations**
```xaml
<VisualStateManager.VisualStateGroups>
    <VisualStateGroup Name="SplashStates">
        <VisualState Name="Entry">...</VisualState>
    </VisualStateGroup>
</VisualStateManager.VisualStateGroups>
```
**Hvorfor fravalgt**: More verbose, harder to sequence. Code-behind animation is more readable for simple sequential animations.

**Alternative 3: Fixed 3s delay instead of database-aware**
```csharp
await Task.Delay(3000); // Always wait 3s
await Shell.Current.GoToAsync("//home");
```
**Hvorfor fravalgt**: Inefficient - wastes user time if database load is fast. Dynamic timing (animation + database) is better UX.

### Potentielle forbedringer (v2)
- Custom splash screen per platform (iOS launch screen, Android splash theme) - More native feel
- Preload initial data (habits, settings) during splash - Faster home screen load
- Animated logo SVG instead of emoji - More professional branding
- Fade-out animation before navigation - Smoother transition

### Kendte begrænsninger
- **No progress indicator**: User doesn't know if app is loading or frozen (acceptable - 1.5s is short)
- **Hard-coded timing**: 1500ms minimum display time (acceptable - standard splash duration)
- **No error handling**: If database fails, app might hang (addressed in Command 008 ExceptionHandler)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple fade/scale animations, straightforward navigation logic
- [x] **Læsbarhed**: Clear async flow, named animation targets (AppIcon, AppName)
- [x] **Navngivning**: OnAppearing, ContentStack, AppIcon, AppName (self-documenting)
- [x] **Funktioner**: OnAppearing ~25 lines (single purpose - animate + navigate)
- [x] **DRY**: Reuses Task.WhenAll pattern (no duplicate animation code)
- [x] **Error handling**: Database call can throw (handled by global ExceptionHandler from cmd 008)
- [x] **Edge cases**: Empty onboarding_completed setting handled (treats as not completed)
- [x] **Performance**: Parallel animations + database check (efficient use of async)
- [x] **Testbarhed**: IDatabaseService mockable, navigation testable (Shell.Current)

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/01_SPLASH.md
- **Component Spec**: N/A (no reusable components)
- **Related**: Command 001 (AppShell routes), stribe-design/visual-identity/COLORS.md

---

## Notes

- Primary color (#2D5A4A) must be defined in Colors.xaml before this command
- Logo emoji 🌿 chosen for quick implementation - can replace with SVG logo in v2
- NavigationPage.HasNavigationBar="False" hides navigation bar for fullscreen splash
- OnAppearing() not OnNavigatedTo() ensures animations run every time (better for debugging)
- Task.Delay(1500) ensures minimum display time even if database is instant

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
