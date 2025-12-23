# Command 007: Settings Service

## Metadata
- **ID:** 007
- **Fase:** 1 - Foundation
- **Estimeret tid:** 2 timer
- **Afhængigheder:** Ingen
- **Design reference:** N/A (data access)

## Formål
Wrapper omkring DatabaseService specifikt til app settings. Dette simplificerer settings management og giver type-safe adgang til konfigurations værdier.

## Risici
- **Lav risiko**: Simple wrapper around database
- **Opmærksomhed**: Default værdier skal matche Constants

## Analyse

### Hvad skal implementeres
Settings service med type-safe metoder:
- GetDayStartTime() → TimeSpan
- SetDayStartTime(TimeSpan)
- GetDefaultReminderTime() → TimeSpan
- SetDefaultReminderTime(TimeSpan)
- IsOnboardingCompleted() → bool
- SetOnboardingCompleted(bool)

### Filer der oprettes
- `src/Stribe/Services/ISettingsService.cs`
- `src/Stribe/Services/SettingsService.cs`

## Dependencies Check
✅ DatabaseService - allerede implementeret
✅ Constants - vil være klar efter cmd 003

## Implementering

### Prompt til Claude Code
```
Opret SettingsService:

**Services/ISettingsService.cs**:
```csharp
namespace Stribe.Services;

public interface ISettingsService
{
    Task<TimeSpan> GetDayStartTimeAsync();
    Task SetDayStartTimeAsync(TimeSpan time);

    Task<TimeSpan> GetDefaultReminderTimeAsync();
    Task SetDefaultReminderTimeAsync(TimeSpan time);

    Task<bool> IsOnboardingCompletedAsync();
    Task SetOnboardingCompletedAsync(bool completed);
}
```

**Services/SettingsService.cs**:
```csharp
using Stribe.Helpers;

namespace Stribe.Services;

public class SettingsService : ISettingsService
{
    private readonly IDatabaseService _database;

    public SettingsService(IDatabaseService database)
    {
        _database = database;
    }

    public async Task<TimeSpan> GetDayStartTimeAsync()
    {
        var setting = await _database.GetSettingAsync(Constants.DayStartTimeKey);
        if (!string.IsNullOrEmpty(setting) && TimeSpan.TryParse(setting, out var time))
            return time;

        return TimeSpan.Parse(Constants.DefaultDayStartTime);
    }

    public async Task SetDayStartTimeAsync(TimeSpan time)
    {
        var setting = new Models.AppSettings
        {
            Key = Constants.DayStartTimeKey,
            Value = time.ToString(@"hh\:mm")
        };
        await _database.SaveSettingAsync(setting);
    }

    public async Task<TimeSpan> GetDefaultReminderTimeAsync()
    {
        var setting = await _database.GetSettingAsync(Constants.DefaultReminderTimeKey);
        if (!string.IsNullOrEmpty(setting) && TimeSpan.TryParse(setting, out var time))
            return time;

        return TimeSpan.Parse(Constants.DefaultReminderTime);
    }

    public async Task SetDefaultReminderTimeAsync(TimeSpan time)
    {
        var setting = new Models.AppSettings
        {
            Key = Constants.DefaultReminderTimeKey,
            Value = time.ToString(@"hh\:mm")
        };
        await _database.SaveSettingAsync(setting);
    }

    public async Task<bool> IsOnboardingCompletedAsync()
    {
        var setting = await _database.GetSettingAsync(Constants.OnboardingCompletedKey);
        return !string.IsNullOrEmpty(setting) && setting == "true";
    }

    public async Task SetOnboardingCompletedAsync(bool completed)
    {
        var setting = new Models.AppSettings
        {
            Key = Constants.OnboardingCompletedKey,
            Value = completed.ToString().ToLower()
        };
        await _database.SaveSettingAsync(setting);
    }
}
```

**MauiProgram.cs**:
```csharp
builder.Services.AddSingleton<ISettingsService, SettingsService>();
```
```

## Verifikation
```bash
dotnet build src/Stribe/Stribe.csproj
```

**Test:**
- [ ] GetDayStartTimeAsync() returnerer 04:00 som default
- [ ] SetDayStartTimeAsync() gemmer korrekt
- [ ] IsOnboardingCompletedAsync() returnerer false initially

## Acceptkriterier
- [ ] Interface og implementation oprettet
- [ ] Type-safe metoder for alle settings
- [ ] Default values fra Constants
- [ ] Registreret i DI
- [ ] Build succeeds

## Status
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
