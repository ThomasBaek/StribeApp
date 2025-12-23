# Command 009: DI Registration (Foundation Services)

## Metadata
- **Phase**: 1 - Foundation
- **Dependencies**: 005, 006, 007, 008
- **Estimated Time**: 1 time
- **Status**: Pending
- **Design Reference**: N/A (configuration)
- **Frequency Impact**: NO

---

## Formål
Sikre at alle foundation services er korrekt registreret i Dependency Injection containeren og verificer at DI systemet virker end-to-end.

---

## Risici

### Potentielle Problemer
1. **Incorrect lifecycle scope**:
   - Edge case: Service registered as Transient when it should be Singleton
   - Impact: Multiple instances cause state inconsistency or memory issues

2. **Missing registration**:
   - Edge case: Service referenced but not registered in DI container
   - Impact: Runtime exceptions when resolving dependencies

3. **Circular dependencies**:
   - Edge case: Service A depends on B, B depends on A
   - Impact: DI container fails to resolve, app crashes on startup

### Mitigering
- Review each service's state requirements to determine correct scope
- Verify all interfaces are registered before building container
- Test app startup to catch DI resolution errors early

---

## Analyse - Hvad Skal Implementeres

### Hvad skal verificeres
- Alle services registreret i MauiProgram.cs
- Korrekt lifetime scope (Singleton for state-ful services)
- Pages registreret hvis de bruger dependency injection
- Verification test at DI virker

---

## Dependencies Check
✅ 005 - HabitService implementeret
✅ 006 - NotificationService stub implementeret
✅ 007 - SettingsService implementeret
✅ 008 - Logger implementeret

---

## Implementation Guide

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

---

## Verification Steps

### Build test
```bash
dotnet build src/Stribe/Stribe.csproj
```

### Runtime test i emulator
- [ ] Start app uden DI exceptions
- [ ] Verificer i logger at services blev injected
- [ ] Test navigation mellem pages
- [ ] Ingen "service not found" exceptions

---

## Acceptance Criteria

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

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Standard MAUI DI pattern**: Uses built-in IServiceCollection - no custom container
- **Clear lifecycle separation**: Singletons for stateful services, Transient for pages
- **Centralized registration**: All registrations in one place (MauiProgram.cs)
- **Verification through usage**: Simple constructor injection test in SplashPage

### Alternativer overvejet

**Alternative 1: Third-party DI container**
```csharp
// Using Autofac, DryIoc, or Ninject
var containerBuilder = new ContainerBuilder();
containerBuilder.RegisterType<HabitService>().As<IHabitService>();
```
**Hvorfor fravalgt**: MAUI's built-in DI is sufficient. Adding external container increases complexity without clear benefit.

**Alternative 2: Service locator pattern**
```csharp
var habitService = ServiceLocator.Get<IHabitService>();
```
**Hvorfor fravalgt**: Anti-pattern. Constructor injection is more testable and explicit about dependencies.

**Alternative 3: Manual factory methods**
```csharp
public static class ServiceFactory {
    public static IHabitService CreateHabitService() => new HabitService(...);
}
```
**Hvorfor fravalgt**: Doesn't manage lifecycles. DI container handles scoping and disposal automatically.

### Potentielle forbedringer (v2)
- **Validation on startup**: Check all registrations can be resolved - adds startup time
- **Scoped services**: Per-request scoping for web scenarios - not needed in mobile app
- **Conditional registration**: Different implementations per platform - YAGNI until platform-specific needs arise
- **DI metrics**: Track service instantiation for debugging - premature optimization

### Kendte begrænsninger
- **No registration validation**: Container doesn't verify all dependencies until first use (acceptable - caught during development)
- **Global container**: Single DI container for entire app (acceptable - standard for MAUI apps)
- **No factory scopes**: Can't create isolated scopes for testing (acceptable - use mocking instead)
- **Page registration required**: Pages must be explicitly registered to use DI (acceptable - makes dependencies explicit)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Standard MAUI DI registration - no custom abstractions or containers
- [x] **Læsbarhed**: Clear grouping (Services, Pages) with comments indicating lifecycle
- [x] **Navngivning**: Consistent interface/implementation pairs (IHabitService/HabitService)
- [x] **Funktioner**: Registration is configuration - each line registers one service
- [x] **DRY**: Services registered once, available throughout app via constructor injection
- [x] **Error handling**: DI exceptions caught at app startup, preventing silent failures
- [x] **Edge cases**: Handles missing registrations with clear error messages
- [x] **Performance**: Singletons created once, Transient created on demand - appropriate lifecycles
- [x] **Testbarhed**: Interface-based registration enables easy mocking for unit tests

---

## Design Files Reference

- **Screen Spec**: N/A
- **Component Spec**: N/A
- **Related**:
  - Command 005 (DatabaseService, HabitService)
  - Command 006 (NotificationService stub)
  - Command 007 (SettingsService)
  - Command 008 (Logger, ExceptionHandler)
  - All Pages (consume services via constructor injection)

---

## Notes

- Services are Singletons - maintain state across app lifetime
- Pages are Transient - new instance on each navigation
- ExceptionHandler initialized AFTER container build to get logger instance
- Constructor injection is preferred over property injection for clarity
- Test DI resolution by running app - constructor failures will throw immediately
- If adding new services, follow existing pattern: interface + implementation + registration

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
