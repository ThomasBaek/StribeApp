# Command 002: Splash Screen

## Metadata
- **ID:** 002
- **Fase:** 1 - Foundation
- **Estimeret tid:** 1-2 timer
- **Afhængigheder:** 001
- **Design reference:** stribe-design/screens/01_SPLASH.md

## Analyse

### Hvad skal implementeres
Splash screen der vises ved app start. Giver branding moment og tid til at indlæse data fra SQLite. Viser logo/emoji og app navn med fade-in animation, derefter automatisk navigation til enten onboarding eller home.

### Filer der oprettes/ændres
- `src/Stribe/Views/SplashPage.xaml` - Layout (allerede oprettet som stub)
- `src/Stribe/Views/SplashPage.xaml.cs` - Animation og navigation logic
- Eventuelt `src/Stribe/Resources/Images/icon_splash.png` (eller brug emoji 🌿)

### Design specifikationer
Fra 01_SPLASH.md:

**Layout:**
```
- Background: #2D5A4A (primary color)
- Logo/Icon: 80dp, hvid, centreret (lidt over center)
- App Name: "Stribe", 32sp, bold, hvid, under logo
```

**Animations:**
```yaml
Entry:
  - Logo: scale + fade in (0.5→1.0, 400ms, delay 200ms)
  - Name: fade in + slide up (300ms, delay 400ms)

Exit:
  - Fade out hele skærm (300ms)
```

**Behavior:**
```
1. Vis splash med animations
2. Load settings fra DatabaseService
3. Check "onboarding_completed"
4. Efter 1500ms total:
   - Hvis completed → Navigate til //home
   - Hvis ikke → Navigate til //onboarding/welcome
```

### Tekniske overvejelser
- Brug OnAppearing() til at starte animations og timer
- DatabaseService injection via constructor
- Navigation via Shell.Current.GoToAsync()
- Animation med MAUI Animation API eller CommunityToolkit.Maui animations
- Total display tid: minimum 1500ms

## Implementering

### Prompt til Claude Code
```
Implementer Splash Screen for Stribe baseret på denne spec:

1. **Opdater Views/SplashPage.xaml**:
```xaml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="Stribe.Views.SplashPage"
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
                Opacity="0" />

            <!-- App Name -->
            <Label
                x:Name="AppName"
                Text="Stribe"
                FontSize="32"
                FontAttributes="Bold"
                TextColor="White"
                HorizontalOptions="Center"
                Opacity="0" />
        </VerticalStackLayout>
    </Grid>
</ContentPage>
```

2. **Opdater Views/SplashPage.xaml.cs**:
```csharp
using Stribe.Services;

namespace Stribe.Views;

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

        // Start entry animations
        await Task.WhenAll(
            AppIcon.FadeTo(1, 400, Easing.CubicOut).ContinueWith(_ =>
                AppIcon.ScaleTo(1, 400, Easing.CubicOut)),
            AppName.FadeTo(1, 300, Easing.CubicOut).ContinueWith(_ =>
                AppName.TranslateTo(0, 0, 300, Easing.CubicOut))
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
}
```

3. **Registrer SplashPage i MauiProgram.cs** (hvis ikke allerede):
```csharp
builder.Services.AddTransient<SplashPage>();
```

Brug existing design tokens fra Colors.xaml.
Reference design: stribe-design/screens/01_SPLASH.md
```

### Forventet resultat
- SplashPage vises med grøn baggrund (#2D5A4A)
- Logo emoji 🌿 fade in + scale animation
- "Stribe" tekst fade in animation
- Efter 1.5s → automatisk navigation til onboarding eller home
- Smooth transitions

### Verifikation

#### Automatiske tests
```bash
dotnet build src/Stribe/Stribe.csproj
```

#### Manuelle tests
- [ ] Splash vises ved app start med primary color baggrund
- [ ] Logo animation kører smooth (fade + scale)
- [ ] App name animation kører efter logo
- [ ] Total display tid er ca. 1.5 sekunder
- [ ] Navigation til onboarding virker (første gang)
- [ ] Navigation til home virker (returnerende bruger)
- [ ] Ingen navigationbar vises på splash

### Acceptkriterier
- [ ] SplashPage.xaml har korrekt layout med animations
- [ ] SplashPage.xaml.cs har OnAppearing logic
- [ ] DatabaseService injection virker
- [ ] Navigation til korrekt destination efter delay
- [ ] Animations kører smooth
- [ ] Build succeeds

## Status
- [ ] Analyse gennemført
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
