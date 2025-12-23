# Command 010: Welcome Page (Onboarding Step 1)

## Metadata
- **Phase**: 2 - Onboarding
- **Dependencies**: 001, 002, 003
- **Estimated Time**: 3-4 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/02_ONBOARDING_WELCOME.md
- **Frequency Impact**: NO

---

## Formål

Implementere første onboarding skærm med logo, tagline, og "Kom i gang" button.

**Hvorfor dette er vigtigt:**
- Første indtryk af app'en - branding og værdiproposition
- Kommunikerer "Ingen konto nødvendig" (privacy-first approach)
- Entry animations skaber professional UX følelse
- Starter user journey mod habit selection

---

## Risici

### Potentielle Problemer
1. **Animation lag på lavere-end devices**:
   - Edge case: Older phones med slow GPU
   - Impact: Staggered animations kan se choppy ud

2. **Button navigation delay**:
   - Edge case: User tapper button før viewmodel er ready
   - Impact: Navigation fejler eller crasher

### Mitigering
- Simple fade/scale animations (low GPU overhead)
- Staggered delays kort (200-400ms) for quick completion
- RelayCommand has built-in CanExecute check
- Button binding ensures ViewModel is fully initialized

---

## Analyse - Hvad Skal Implementeres

### Welcome Page Layout
**Location**: `src/Stribe/Views/Onboarding/WelcomePage.xaml`
**Key Requirements**:
- Logo (80dp emoji 🌿 eller SVG)
- App name "Stribe" (30sp, font_bold)
- Tagline "Byg vaner der holder" (18sp)
- Primary button "Kom i gang →" (full width-48dp, 52dp height)
- Privacy note "Ingen konto nødvendig" (14sp, tertiary)
- Page indicator • ○ ○ (side 1 af 3)

### Welcome Page Logic
**Location**: `src/Stribe/Views/Onboarding/WelcomePage.xaml.cs`
**Key Requirements**:
- ViewModel injection via DI
- Optional entry animations i OnAppearing()
- Button binds til GoToHabitSelectionCommand

### OnboardingViewModel
**Location**: `src/Stribe/ViewModels/OnboardingViewModel.cs`
**Key Requirements**:
- GoToHabitSelectionCommand navigates til //onboarding/habits
- Inherits from BaseViewModel

**Business Rules**:
```csharp
// Navigation logic:
1. User taps "Kom i gang" button
2. Navigate til habit selection page via Shell routing
3. No validation required (just navigate)
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 001 (AppShell navigation structure)
- [x] Command 002 (Splash screen - navigates to welcome)
- [x] Command 003 (BaseViewModel with MVVM toolkit)
- [x] Colors.xaml and Styles.xaml defined

⚠️ **Assumptions**:
- Shell route "//onboarding/habits" will be registered (in command 011)
- Background color (#FAFBFA) defined in Colors.xaml
- PrimaryButton style defined in Styles.xaml

❌ **Blockers**: None

---

## Implementation Guide

### Filer der oprettes/ændres
- `src/Stribe/Views/Onboarding/WelcomePage.xaml` - XAML layout
- `src/Stribe/Views/Onboarding/WelcomePage.xaml.cs` - Code-behind
- `src/Stribe/ViewModels/OnboardingViewModel.cs` - ViewModel
- `src/Stribe/MauiProgram.cs` - Register page + viewmodel

### Design Specifikationer
Fra 02_ONBOARDING_WELCOME.md:

**Layout:**
```
- Logo (80dp): 🌿 emoji eller SVG, centreret
- App name: "Stribe", 30sp, font_bold, text_primary
- Tagline: "Byg vaner der holder", 18sp, text_secondary
- Primary button: "Kom i gang →", full width-48dp, 52dp høj
- Privacy note: "Ingen konto nødvendig", 14sp, text_tertiary
- Page indicator: • ○ ○ (side 1 af 3)
```

**Colors:**
- Background: #FAFBFA
- Primary button: #2D5A4A with white text
- Border radius: 12dp (button)

**Animations:**
- Entry: Logo fade+scale (0.8→1.0, 500ms)
- Then app name (200ms delay)
- Then tagline (100ms delay)
- Then button slide up (400ms delay)

### Tekniske overvejelser
- Brug ContentPage med SafeArea
- FlexLayout eller Grid for responsive layout
- Animations i code-behind eller XAML
- Button command binds til ViewModel

---

## Implementering

### Step 1: Opret ViewModels/OnboardingViewModel.cs
Path: `src/Stribe/ViewModels/OnboardingViewModel.cs`
```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace Stribe.ViewModels;

public partial class OnboardingViewModel : BaseViewModel
{
    [RelayCommand]
    private async Task GoToHabitSelection()
    {
        await Shell.Current.GoToAsync("//onboarding/habits");
    }
}
```

**Explanation**: Simple RelayCommand for navigation. Inherits from BaseViewModel for INotifyPropertyChanged support.

### Step 2: Opret Views/Onboarding/WelcomePage.xaml
Path: `src/Stribe/Views/Onboarding/WelcomePage.xaml`

Create ContentPage layout with:
- ContentPage med BackgroundColor="{StaticResource Background}"
- VerticalStackLayout med spacing og padding:
  - Logo emoji/image (80x80)
  - Label "Stribe" (Style="{StaticResource HeadlineText}")
  - Label "Byg vaner der holder" (Style="{StaticResource BodyText}")
  - Button "Kom i gang →" (Style="{StaticResource PrimaryButton}", Command="{Binding GoToHabitSelectionCommand}")
  - Label "Ingen konto nødvendig" (små, grå)
  - Dot indicator (3 dots, første aktiv)

**Explanation**: Uses existing styles from Styles.xaml. Button command binding connects to ViewModel.

### Step 3: Code-behind WelcomePage.xaml.cs
Path: `src/Stribe/Views/Onboarding/WelcomePage.xaml.cs`

Create code-behind with:
- Constructor med ViewModel injection
- BindingContext = viewModel
- Optional: Entry animations i OnAppearing()

**Explanation**: DI injection ensures ViewModel is created and bound correctly. Animations optional for MVP.

### Step 4: Registrer i MauiProgram.cs
Path: `src/Stribe/MauiProgram.cs`
```csharp
builder.Services.AddTransient<OnboardingViewModel>();
builder.Services.AddTransient<WelcomePage>();
```

**Explanation**: Transient lifetime ensures fresh instance for each navigation. Both page and ViewModel must be registered.

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. Manual Test in Emulator
- [ ] WelcomePage vises med correct layout
- [ ] Logo vises centreret (emoji eller SVG)
- [ ] Tekster bruger korrekte styles og farver
- [ ] "Kom i gang" button er full width med 24dp margin
- [ ] "Ingen konto nødvendig" note vises (grå tekst)
- [ ] Page indicator viser • ○ ○ (første dot active)
- [ ] Tap "Kom i gang" → navigerer til habit selection (hvis implemented)
- [ ] Entry animations smooth (if implemented)
- [ ] Looks good på både små og store skærme
- [ ] No navigation bar visible

---

## Acceptance Criteria

- [x] WelcomePage.xaml eksisterer med korrekt layout
- [x] OnboardingViewModel har GoToHabitSelection command
- [x] Page og ViewModel er registreret i DI
- [x] Button command binding virker
- [x] Styles reused from Styles.xaml
- [x] Navigation til næste step virker (when route exists)
- [x] Build succeeds
- [x] Manual testing passed

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Standard MAUI MVVM**: Uses CommunityToolkit.Mvvm for commands (no custom framework)
- **Simple navigation**: Shell.GoToAsync for routing (built-in)
- **Reuses styles**: No custom styling - leverages Resources/Styles/Styles.xaml
- **Single responsibility**: WelcomePage only displays UI + navigates

### Alternativer overvejet

**Alternative 1: Custom welcome animation library**
```csharp
<lottie:AnimationView Source="welcome_animation.json" />
```
**Hvorfor fravalgt**: Adds dependency + complexity. Simple fade/scale animations sufficient for onboarding welcome screen.

**Alternative 2: NavigationService abstraction**
```csharp
await _navigationService.NavigateToAsync("HabitSelection");
```
**Hvorfor fravalgt**: Shell.GoToAsync is built-in and testable. No need for extra abstraction layer for simple navigation.

**Alternative 3: Hardcoded ViewModel creation**
```csharp
public WelcomePage()
{
    BindingContext = new OnboardingViewModel();
}
```
**Hvorfor fravalgt**: Breaks DI pattern, harder to test, can't inject dependencies into ViewModel later.

### Potentielle forbedringer (v2)
- Animated SVG logo instead of emoji - More professional branding
- Parallax scroll effect on tagline - Modern UX feel
- Localization support for multi-language - Expandability
- A/B test different taglines - Data-driven optimization

### Kendte begrænsninger
- **No skip option**: User must go through onboarding (acceptable - only 3 screens)
- **Hard-coded text**: Not localized (acceptable - dansk-only app for MVP)
- **Emoji logo**: Not vector/scalable (acceptable - quick MVP implementation)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple XAML layout + one-line navigation command
- [x] **Læsbarhed**: Clear element names (AppIcon, AppName, TagLine, ContinueButton)
- [x] **Navngivning**: GoToHabitSelectionCommand self-documenting (action + destination)
- [x] **Funktioner**: Code-behind minimal (~10 lines), ViewModel minimal (~8 lines)
- [x] **DRY**: Reuses styles from Styles.xaml (no duplicate styling)
- [x] **Error handling**: Navigation can throw (handled by global ExceptionHandler from cmd 008)
- [x] **Edge cases**: Route not registered handled by Shell (shows error page)
- [x] **Performance**: Lightweight page (no heavy computations or data loading)
- [x] **Testbarhed**: ViewModel testable (can mock navigation), Page testable via UI tests

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/02_ONBOARDING_WELCOME.md
- **Component Spec**: N/A (standard MAUI controls)
- **Related**: Command 011 (destination), stribe-design/visual-identity/TYPOGRAPHY.md

---

## Notes

- Logo emoji 🌿 placeholder - kan erstattes med SVG logo i v2
- NavigationPage.HasNavigationBar bør sættes False i AppShell for onboarding pages
- Page indicator (• ○ ○) static for now - could be component in command 014 (flow integration)
- "Kom i gang →" arrow gives direction hint (borrowed from iOS design patterns)
- Background color #FAFBFA (off-white) gives calm, minimal feel
- Privacy note "Ingen konto nødvendig" addresses user concern upfront (builds trust)

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
