# Command 001: App Shell & Navigation Setup

## Metadata
- **ID:** 001
- **Fase:** 1 - Foundation
- **Estimeret tid:** 2-3 timer
- **Afhængigheder:** None (Foundation)
- **Design reference:** stribe-design/NAVIGATION.md

## Analyse

### Hvad skal implementeres
Opret App Shell strukturen med navigation support for alle hovedskærme. Dette er fundamentet for hele app'ens navigation flow.

### Filer der oprettes/ændres
- `src/Stribe/AppShell.xaml` - Shell definition med routes
- `src/Stribe/AppShell.xaml.cs` - Route registrering
- `src/Stribe/App.xaml.cs` - Initial routing logic

### Design specifikationer
Fra NAVIGATION.md:
- Single-screen app med modals (ingen tabs)
- Splash → Onboarding (first time) / Home (returning)
- Navigation patterns: slide_up for modals, slide_left for stacked screens

### Tekniske overvejelser
- Shell navigation simplificerer routing
- Implementer check for onboarding completion
- Support for både første gang og returnerende brugere

## Implementering

### Prompt til Claude Code
```
Implementer App Shell navigation for Stribe projektet baseret på følgende krav:

1. **AppShell.xaml** skal indeholde:
   - Shell.FlyoutBehavior="Disabled" (ingen flyout menu i v1)
   - Route registreringer for alle hovedskærme:
     * //splash
     * //onboarding/welcome
     * //onboarding/habits
     * //onboarding/reminder
     * //home (main)
     * habit-detail (modal)
     * add-habit (modal)
     * edit-habit (modal)
     * settings (modal)
     * milestone (modal)

2. **AppShell.xaml.cs** skal:
   - Registrere alle routes i constructor med Routing.RegisterRoute()
   - Modal routes skal have separate registreringer

3. **App.xaml.cs OnStart()** skal:
   - Tjekke om onboarding er completed (via DatabaseService.GetSettingAsync("onboarding_completed"))
   - Hvis JA → Navigate til //home
   - Hvis NEJ → Navigate til //splash

4. Reference implementation pattern:
```csharp
// I AppShell.xaml.cs constructor:
Routing.RegisterRoute("habit-detail", typeof(HabitDetailPage));
Routing.RegisterRoute("add-habit", typeof(AddHabitPage));
// etc.

// I App.xaml.cs:
protected override async void OnStart()
{
    var db = Handler?.MauiContext?.Services.GetService<IDatabaseService>();
    var hasCompletedOnboarding = await db?.GetSettingAsync("onboarding_completed") != null;

    if (hasCompletedOnboarding)
        await Shell.Current.GoToAsync("//home");
    else
        await Shell.Current.GoToAsync("//splash");
}
```

Brug design tokens fra Resources/Styles/ til styling.
```

### Forventet resultat
- AppShell.xaml med alle routes defineret
- Navigation fungerer mellem skærme
- Onboarding/Home routing beslutning virker

### Verifikation

#### Automatiske tests
```bash
# Build test
dotnet build src/Stribe/Stribe.csproj

# Verificer at routes er registreret
# (manuel test i app)
```

#### Manuelle tests
- [ ] App starter og viser splash/home baseret på onboarding status
- [ ] Navigation til hver route virker uden crashes
- [ ] Back navigation fungerer korrekt

### Acceptkriterier
- [ ] AppShell.xaml eksisterer med FlyoutBehavior disabled
- [ ] Alle 10 routes er registreret
- [ ] App routing logic i OnStart() fungerer
- [ ] Build succeeds uden fejl

## Status
- [ ] Analyse gennemført
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
