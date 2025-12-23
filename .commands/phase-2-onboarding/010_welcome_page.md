# Command 010: Welcome Page (Onboarding Step 1)

## Metadata
- **ID:** 010
- **Fase:** 2 - Onboarding
- **Estimeret tid:** 3-4 timer
- **Afhængigheder:** 001, 002, 003
- **Design reference:** stribe-design/screens/02_ONBOARDING_WELCOME.md

## Analyse

### Hvad skal implementeres
Første onboarding skærm med logo, tagline, og "Kom i gang" button. Skal være visuelt tiltalende og kommunikere app'ens værdi hurtigt.

### Filer der oprettes/ændres
- `src/Stribe/Views/Onboarding/WelcomePage.xaml` - XAML layout
- `src/Stribe/Views/Onboarding/WelcomePage.xaml.cs` - Code-behind
- `src/Stribe/ViewModels/OnboardingViewModel.cs` - ViewModel
- `src/Stribe/MauiProgram.cs` - Register page + viewmodel

### Design specifikationer
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

## Implementering

### Prompt til Claude Code
```
Implementer Welcome Page for Stribe onboarding baseret på denne spec:

1. **Opret ViewModels/OnboardingViewModel.cs**:
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

2. **Opret Views/Onboarding/WelcomePage.xaml**:
- ContentPage med BackgroundColor="{StaticResource Background}"
- VerticalStackLayout med spacing og padding:
  - Logo emoji/image (80x80)
  - Label "Stribe" (Style="{StaticResource HeadlineText}")
  - Label "Byg vaner der holder" (Style="{StaticResource BodyText}")
  - Button "Kom i gang →" (Style="{StaticResource PrimaryButton}", Command="{Binding GoToHabitSelectionCommand}")
  - Label "Ingen konto nødvendig" (små, grå)
  - Dot indicator (3 dots, første aktiv)

3. **Code-behind WelcomePage.xaml.cs**:
- Constructor med ViewModel injection
- BindingContext = viewModel
- Optional: Entry animations i OnAppearing()

4. **Registrer i MauiProgram.cs**:
```csharp
builder.Services.AddTransient<OnboardingViewModel>();
builder.Services.AddTransient<WelcomePage>();
```

Brug existing styles fra Resources/Styles/Styles.xaml og farver fra Colors.xaml.
Reference design: stribe-design/screens/02_ONBOARDING_WELCOME.md
```

### Forventet resultat
- WelcomePage vises korrekt med alle elementer
- Button navigerer til næste onboarding step
- Animations (hvis implementeret) kører smooth

### Verifikation

#### Automatiske tests
```bash
dotnet build src/Stribe/Stribe.csproj
```

#### Manuelle tests
- [ ] Logo vises centreret
- [ ] Tekster bruger korrekte styles og farver
- [ ] Button er fuld width med 24dp margin
- [ ] Button navigation til habits selection virker
- [ ] Looks good på både små og store skærme

### Acceptkriterier
- [ ] WelcomePage.xaml eksisterer med korrekt layout
- [ ] OnboardingViewModel har GoToHabitSelection command
- [ ] Page og ViewModel er registreret i DI
- [ ] Navigation til næste step virker
- [ ] Build succeeds

## Status
- [ ] Analyse gennemført
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
