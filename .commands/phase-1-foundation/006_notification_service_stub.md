# Command 006: NotificationService (Stub)

## Metadata
- **Phase**: 1 - Foundation
- **Dependencies**: Ingen
- **Estimated Time**: 2 timer
- **Status**: Pending
- **Design Reference**: N/A (infrastructure)
- **Frequency Impact**: NO

---

## Formål
Oprette stub implementation af NotificationService. Fuld implementation kommer i Command 037 (Phase 5), men vi opretter interface og basic structure nu så andre services kan reference den.

---

## Risici

### Potentielle Problemer
1. **Incomplete interface design**:
   - Edge case: Interface missing methods needed for full implementation
   - Impact: Breaking changes required in Phase 5

2. **Misleading stub behavior**:
   - Edge case: Stub returns success but does nothing
   - Impact: Other services assume notifications work when they don't

### Mitigering
- Design interface based on full feature requirements from Command 037
- Add clear comments in stub methods indicating they're not implemented
- Return true/success values to enable development flow without blocking

---

## Analyse - Hvad Skal Implementeres

### Hvad skal implementeres
- INotificationService interface med alle metoder
- NotificationService stub class (metoder returnerer Task.CompletedTask)
- Platform-agnostic design (fuld platform implementation i cmd 037)

### Filer der oprettes
- `src/Stribe/Services/INotificationService.cs`
- `src/Stribe/Services/NotificationService.cs`

---

## Dependencies Check
✅ Ingen dependencies - kan implementeres nu

---

## Implementation Guide

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

---

## Verification Steps

```bash
dotnet build src/Stribe/Stribe.csproj
```

---

## Acceptance Criteria
- [ ] Interface med alle metoder
- [ ] Stub implementation returnerer completed tasks
- [ ] Registreret i DI
- [ ] Build succeeds

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Minimal stub implementation**: Only interface and empty method bodies - no unnecessary complexity
- **Clear interface contract**: Method signatures define what will be implemented in Phase 5
- **Non-blocking returns**: Task.CompletedTask and Task.FromResult(true) enable development to continue
- **Single responsibility**: Service only handles notifications - no mixed concerns

### Alternativer overvejet

**Alternative 1: Mock library dependency**
```csharp
// Using Moq or NSubstitute
builder.Services.AddSingleton<INotificationService>(Mock.Of<INotificationService>());
```
**Hvorfor fravalgt**: Adds test framework dependency to production code. Simple stub is cleaner for temporary implementation.

**Alternative 2: Throw NotImplementedException**
```csharp
public Task ScheduleHabitReminderAsync(...) {
    throw new NotImplementedException("Will be implemented in Command 037");
}
```
**Hvorfor fravalgt**: Would crash app during development. Returning completed tasks allows testing other features.

**Alternative 3: Abstract base class instead of interface**
```csharp
public abstract class NotificationServiceBase { ... }
```
**Hvorfor fravalgt**: Interface is more flexible. No need for shared implementation logic in stub phase.

### Potentielle forbedringer (v2)
- **Logging stub calls**: Log when methods are called for debugging - not needed for simple stub
- **In-memory notification queue**: Simulate notifications locally - unnecessary complexity for stub
- **Configuration for stub behavior**: Enable/disable stub responses - YAGNI until testing needs arise

### Kendte begrænsninger
- **No actual notifications**: Methods do nothing (acceptable - full implementation in Command 037)
- **Always returns success**: RequestPermissionAsync returns true regardless (acceptable - enables development flow)
- **No parameter validation**: Stub doesn't validate habitId, time, etc. (acceptable - validation will be in full implementation)
- **Not thread-safe**: No locking or async coordination (acceptable - stub has no state to protect)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Minimal stub with only interface and empty method bodies
- [x] **Læsbarhed**: Clear method names describe intent (ScheduleHabitReminder, RequestPermission)
- [x] **Navngivning**: Follows C# async conventions - Async suffix, Task return types
- [x] **Funktioner**: Each method is 1-3 lines, does exactly what stub needs
- [x] **DRY**: Interface prevents code duplication when full implementation arrives
- [x] **Error handling**: No exceptions thrown - safe stub behavior
- [x] **Edge cases**: Handles all calls gracefully by returning completed tasks
- [x] **Performance**: Zero overhead - immediate task completion
- [x] **Testbarhed**: Interface enables easy mocking for unit tests

---

## Design Files Reference

- **Screen Spec**: N/A
- **Component Spec**: N/A
- **Related**:
  - Command 037 (Phase 5 - Full notification implementation)
  - HabitService (will call notification scheduling)
  - Settings pages (will request notification permissions)

---

## Notes

- This is intentionally a stub - full implementation deferred to Command 037
- Interface design must be complete enough to avoid breaking changes later
- Stub returns success values to unblock development of dependent features
- All stub methods include comments indicating implementation command
- DI registration as Singleton matches lifecycle of full implementation
- When implementing Command 037, replace NotificationService class but keep interface unchanged

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
