# Command 007: Settings Service

## Metadata
- **Phase**: 1 - Foundation
- **Dependencies**: DatabaseService (Command 005), Constants (Command 003)
- **Estimated Time**: 2 timer
- **Status**: Pending
- **Design Reference**: N/A (data access)
- **Frequency Impact**: NO

---

## Formål
Wrapper omkring DatabaseService specifikt til app settings. Dette simplificerer settings management og giver type-safe adgang til konfigurations værdier.

---

## Risici

### Potentielle Problemer
1. **Default value mismatch**:
   - Edge case: Hardcoded defaults don't match Constants class
   - Impact: Inconsistent behavior across app

2. **TimeSpan parsing failures**:
   - Edge case: Corrupted database values that can't parse to TimeSpan
   - Impact: App crashes or returns incorrect defaults

### Mitigering
- Always use Constants for default values - no hardcoded strings
- Wrap TimeSpan.Parse in TryParse with fallback to Constants
- Add validation for time values to ensure they're reasonable (00:00 to 23:59)

---

## Analyse - Hvad Skal Implementeres

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

---

## Dependencies Check
✅ DatabaseService - allerede implementeret
✅ Constants - vil være klar efter cmd 003

---

## Implementation Guide

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

---

## Verification Steps

```bash
dotnet build src/Stribe/Stribe.csproj
```

**Test:**
- [ ] GetDayStartTimeAsync() returnerer 04:00 som default
- [ ] SetDayStartTimeAsync() gemmer korrekt
- [ ] IsOnboardingCompletedAsync() returnerer false initially

---

## Acceptance Criteria
- [ ] Interface og implementation oprettet
- [ ] Type-safe metoder for alle settings
- [ ] Default values fra Constants
- [ ] Registreret i DI
- [ ] Build succeeds

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Thin wrapper pattern**: Simple delegation to DatabaseService without adding unnecessary logic
- **Type-safe API**: Methods return TimeSpan and bool instead of raw strings
- **Centralized defaults**: All default values from Constants class - single source of truth
- **Clear method names**: Self-documenting API (GetDayStartTime, SetOnboardingCompleted)

### Alternativer overvejet

**Alternative 1: Generic Get/Set methods**
```csharp
public Task<T> GetSettingAsync<T>(string key);
public Task SetSettingAsync<T>(string key, T value);
```
**Hvorfor fravalgt**: Less discoverable, no IntelliSense support, loses type safety benefits. Explicit methods are clearer.

**Alternative 2: Properties with lazy loading**
```csharp
public TimeSpan DayStartTime => _cached ?? LoadFromDb();
```
**Hvorfor fravalgt**: Adds caching complexity. Async database access doesn't work well with properties. Service layer should be explicit.

**Alternative 3: MAUI Preferences API**
```csharp
Preferences.Set("day_start_time", "04:00");
```
**Hvorfor fravalgt**: Preferences are key-value only. Using database allows complex queries and maintains consistency with other app data.

### Potentielle forbedringer (v2)
- **Caching layer**: Cache settings in memory to reduce database hits - premature optimization for low-frequency reads
- **Setting change events**: Notify subscribers when settings change - YAGNI until multiple components need sync
- **Validation framework**: Fluent validation for time ranges - overkill for simple time string validation
- **Migration support**: Handle settings schema changes - not needed until we have version updates

### Kendte begrænsninger
- **No caching**: Every call hits database (acceptable - settings read infrequently)
- **No validation**: SetDayStartTimeAsync accepts any TimeSpan (acceptable - UI controls input)
- **String-based storage**: Settings stored as strings in DB (acceptable - simple and flexible)
- **No transaction support**: Each setting saved independently (acceptable - settings are independent values)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple wrapper with no business logic - just type conversion and default handling
- [x] **Læsbarhed**: Method names clearly indicate what setting they manage
- [x] **Navngivning**: Follows C# async conventions - Async suffix, descriptive parameter names
- [x] **Funktioner**: Each method does one thing - get or set a specific setting
- [x] **DRY**: Constants reused for keys and defaults - no duplication
- [x] **Error handling**: TryParse with fallback to defaults prevents crashes
- [x] **Edge cases**: Handles null, empty, and invalid values gracefully
- [x] **Performance**: Minimal overhead - direct database delegation
- [x] **Testbarhed**: Interface enables mocking, pure functions easy to test

---

## Design Files Reference

- **Screen Spec**: N/A
- **Component Spec**: N/A
- **Related**:
  - Command 003 (Constants - provides default values)
  - Command 005 (DatabaseService - underlying data access)
  - SettingsPage (will use this service)
  - Onboarding flow (checks IsOnboardingCompleted)

---

## Notes

- SettingsService is a facade over DatabaseService for app configuration
- All settings keys defined in Constants class - prevents typos and ensures consistency
- TimeSpan format "hh:mm" used for time values (matches UI TimePicker)
- Boolean values stored as "true"/"false" lowercase strings
- Service registered as Singleton - safe because it's stateless
- Consider adding logging for settings changes in production for debugging

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
