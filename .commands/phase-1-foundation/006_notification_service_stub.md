# Command 006: NotificationService (Stub)

## Metadata
- **ID:** 006
- **Fase:** 1 - Foundation
- **Estimeret tid:** 2 timer
- **Afhængigheder:** Ingen
- **Design reference:** N/A (infrastructure)

## Formål
Oprette stub implementation af NotificationService. Fuld implementation kommer i Command 037 (Phase 5), men vi opretter interface og basic structure nu så andre services kan reference den.

## Risici
- **Lav risiko**: Kun interface og stub - ingen reel funktionalitet endnu
- **Opmærksomhed**: Interfacet skal være komplet nok til fuld implementation senere

## Analyse

### Hvad skal implementeres
- INotificationService interface med alle metoder
- NotificationService stub class (metoder returnerer Task.CompletedTask)
- Platform-agnostic design (fuld platform implementation i cmd 037)

### Filer der oprettes
- `src/Stribe/Services/INotificationService.cs`
- `src/Stribe/Services/NotificationService.cs`

## Dependencies Check
✅ Ingen dependencies - kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Opret NotificationService stub:

**Services/INotificationService.cs**:
```csharp
namespace Stribe.Services;

public interface INotificationService
{
    Task<bool> RequestPermissionAsync();
    Task ScheduleHabitReminderAsync(string habitId, string habitName, TimeSpan time);
    Task CancelHabitReminderAsync(string habitId);
    Task CancelAllRemindersAsync();
    Task SendMilestoneNotificationAsync(string habitName, int streak);
}
```

**Services/NotificationService.cs**:
```csharp
namespace Stribe.Services;

public class NotificationService : INotificationService
{
    public Task<bool> RequestPermissionAsync()
    {
        // Stub - implementation in command 037
        return Task.FromResult(true);
    }

    public Task ScheduleHabitReminderAsync(string habitId, string habitName, TimeSpan time)
    {
        // Stub - implementation in command 037
        return Task.CompletedTask;
    }

    public Task CancelHabitReminderAsync(string habitId)
    {
        // Stub - implementation in command 037
        return Task.CompletedTask;
    }

    public Task CancelAllRemindersAsync()
    {
        // Stub - implementation in command 037
        return Task.CompletedTask;
    }

    public Task SendMilestoneNotificationAsync(string habitName, int streak)
    {
        // Stub - implementation in command 037
        return Task.CompletedTask;
    }
}
```

**MauiProgram.cs registration**:
```csharp
builder.Services.AddSingleton<INotificationService, NotificationService>();
```
```

## Verifikation
```bash
dotnet build src/Stribe/Stribe.csproj
```

## Acceptkriterier
- [ ] Interface med alle metoder
- [ ] Stub implementation returnerer completed tasks
- [ ] Registreret i DI
- [ ] Build succeeds

## Status
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
