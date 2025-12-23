# Command 009: DI Registration (Foundation Services)

## Metadata
- **ID:** 009
- **Fase:** 1 - Foundation
- **Estimeret tid:** 1 time
- **Afhængigheder:** 005, 006, 007, 008
- **Design reference:** N/A (configuration)

## Formål
Sikre at alle foundation services er korrekt registreret i Dependency Injection containeren og verificer at DI systemet virker end-to-end.

## Risici
- **Lav risiko**: Configuration task
- **Opmærksomhed**: Verify correct lifecycle (Singleton vs Transient)

## Analyse

### Hvad skal verificeres
- Alle services registreret i MauiProgram.cs
- Korrekt lifetime scope (Singleton for state-ful services)
- Pages registreret hvis de bruger dependency injection
- Verification test at DI virker

### Dependencies Check
✅ 005 - HabitService implementeret
✅ 006 - NotificationService stub implementeret
✅ 007 - SettingsService implementeret
✅ 008 - Logger implementeret

## Implementering

### Prompt til Claude Code
```
Verificer og opdater DI registrations i MauiProgram.cs:

**MauiProgram.cs skal indeholde**:
```csharp
// Services (Singletons - maintain state)
builder.Services.AddSingleton<IDatabaseService, DatabaseService>();
builder.Services.AddSingleton<IHabitService, HabitService>();
builder.Services.AddSingleton<INotificationService, NotificationService>();
builder.Services.AddSingleton<ISettingsService, SettingsService>();
builder.Services.AddSingleton<ILogger, Logger>();

// Pages (Transient - new instance each time)
builder.Services.AddTransient<SplashPage>();
builder.Services.AddTransient<HomePage>();
builder.Services.AddTransient<WelcomePage>();
builder.Services.AddTransient<HabitSelectionPage>();
builder.Services.AddTransient<ReminderSetupPage>();
builder.Services.AddTransient<HabitDetailPage>();
builder.Services.AddTransient<AddHabitPage>();
builder.Services.AddTransient<EditHabitPage>();
builder.Services.AddTransient<SettingsPage>();
builder.Services.AddTransient<MilestonePage>();

// Initialize error handling
var app = builder.Build();
var logger = app.Services.GetRequiredService<ILogger>();
ExceptionHandler.Initialize(logger);

return app;
```

**Opret test page for DI verification** (midlertidig):
```csharp
// I SplashPage.xaml.cs for at teste DI
public SplashPage(
    IDatabaseService database,
    IHabitService habitService,
    ISettingsService settingsService,
    ILogger logger)
{
    InitializeComponent();

    // Log at alle services er injected korrekt
    logger.LogInfoAsync("SplashPage initialized with all services").Wait();
}
```
```

## Verifikation

### Build test
```bash
dotnet build src/Stribe/Stribe.csproj
```

### Runtime test i emulator
- [ ] Start app uden DI exceptions
- [ ] Verificer i logger at services blev injected
- [ ] Test navigation mellem pages
- [ ] Ingen "service not found" exceptions

### Checklist
- [ ] DatabaseService registreret som Singleton
- [ ] HabitService registreret som Singleton
- [ ] NotificationService registreret som Singleton
- [ ] SettingsService registreret som Singleton
- [ ] Logger registreret som Singleton
- [ ] Alle Pages registreret som Transient
- [ ] ExceptionHandler initialiseret efter build
- [ ] Build succeeds
- [ ] App starter uden DI errors

## Acceptkriterier
- [ ] Alle services fra cmd 005-008 registreret
- [ ] Alle pages registreret
- [ ] Korrekt lifecycle scopes
- [ ] Build succeeds
- [ ] Runtime test i emulator viser ingen DI fejl

## Status
- [ ] Dependencies verified (005, 006, 007, 008 done)
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
