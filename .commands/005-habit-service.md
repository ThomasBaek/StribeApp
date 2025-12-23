# Command 005: HabitService (Business Logic)

## Metadata
- **Phase**: 1 - Foundation
- **Dependencies**: None (Models + DatabaseService already implemented)
- **Estimated Time**: 3-4 hours
- **Status**: Pending
- **Design Reference**: N/A (Business logic layer)

---

## Formål

Implementer service layer med business logic for habit operations. Dette er det kritiske lag mellem ViewModels og DatabaseService, som håndterer:
- Streak calculations (med support for frequency og active days)
- Week progress calculations
- Completion toggling (med multi-completion support)
- Milestone detection

**Hvorfor dette er vigtigt:**
- Centraliserer all forretningslogik ét sted
- Gør ViewModels enkle og testbare
- Sikrer konsistent streak/progress beregning overalt

---

## Risici

### Potentielle Problemer
1. **Streak calculation kompleksitet**:
   - Edge case: Habits der kun gælder visse ugedage (fx kun hverdage)
   - Edge case: Day rollover logic (kl. 04:00)
   - Edge case: Partial completions (3/8 glas vand tæller IKKE som streak)

2. **Performance ved store datasets**:
   - Streak calculation kræver potentielt mange database queries
   - Week progress for mange habits kan blive langsomt

3. **Multi-completion logic**:
   - Toggle logic skal være intuitiv (hvad sker der ved tap #9 når target er 8?)
   - Count kan ikke være negativ

### Mitigering
- Grundig testing af edge cases
- Caching af streak calculations hvor muligt
- Simple, veldefinerede regler for toggle behavior

---

## Analyse - Hvad Skal Implementeres

### 1. IHabitService Interface
```csharp
public interface IHabitService
{
    // Habit CRUD
    Task<List<Habit>> GetHabitsForDateAsync(DateTime date);
    Task<Habit?> GetHabitAsync(string id);
    Task SaveHabitAsync(Habit habit);
    Task DeleteHabitAsync(string habitId);

    // Completion Operations
    Task ToggleCompletionAsync(string habitId, DateTime date);
    Task<int> GetCompletionCountAsync(string habitId, DateTime date);

    // Statistics
    Task<int> CalculateStreakAsync(string habitId);
    Task<Dictionary<int, bool>> GetWeekProgressAsync(string habitId, DateTime weekStart);
    Task<double> GetCompletionRateAsync(string habitId, int days = 30);

    // Milestone
    Task<int?> CheckMilestoneAsync(string habitId);
}
```

### 2. HabitService Implementation

**Key Methods:**

#### GetHabitsForDateAsync(DateTime date)
- Hent alle habits fra database
- Filter: Kun habits hvor `IsActiveOnDay(date) == true`
- Berig hver habit med current completion count
- Return sorteret liste (SortOrder)

#### ToggleCompletionAsync(string habitId, DateTime date)
**Business Rules (KISS approach):**
- Hvis habit IKKE er aktiv på denne dag → ignore (eller throw exception?)
- Hent current completion for (habitId, date)
- Hvis completion IKKE eksisterer → Create med Count=1
- Hvis completion eksisterer:
  - Hvis Count < DailyTargetCount → Increment Count
  - Hvis Count >= DailyTargetCount → Delete completion (reset til 0)

**Alternative approach (simplere):**
- Hver tap bare incrementer Count
- Når Count > DailyTargetCount → wrap around til 0 (delete)

#### CalculateStreakAsync(string habitId)
**Algorithm (KISS):**
```
streak = 0
currentDate = Today
while (true):
    if NOT IsActiveDay(habit, currentDate):
        currentDate = currentDate - 1 day
        continue  // Skip inactive days

    completion = GetCompletion(habitId, currentDate)
    if completion == null OR completion.Count < habit.DailyTargetCount:
        break  // Streak broken

    streak++
    currentDate = currentDate - 1 day

    if currentDate < habit.CreatedAt:
        break  // Can't go before habit was created

return streak
```

**Edge cases:**
- Habits oprettet i dag har streak = 0 (eller 1 hvis completed?)
- Habits der kun gælder weekends: tæl kun weekend dage
- Day rollover: Brug effektiv dato baseret på day start time setting

#### GetWeekProgressAsync(string habitId, DateTime weekStart)
```csharp
// Return Dictionary<dayIndex, isCompleted>
// dayIndex: 0=Monday, 6=Sunday
// isCompleted: true hvis Count >= DailyTargetCount
var progress = new Dictionary<int, bool>();
for (int i = 0; i < 7; i++)
{
    var date = weekStart.AddDays(i);
    if (!habit.IsActiveOnDay(date))
    {
        progress[i] = false; // Or should we mark inactive days specially?
        continue;
    }

    var completion = await GetCompletionCountAsync(habitId, date);
    progress[i] = completion >= habit.DailyTargetCount;
}
return progress;
```

#### CheckMilestoneAsync(string habitId)
```csharp
var streak = await CalculateStreakAsync(habitId);
var milestones = new[] { 7, 21, 30, 60, 90, 180, 365 };

foreach (var milestone in milestones.OrderByDescending(m => m))
{
    if (streak == milestone)
    {
        // Check if already shown
        var key = $"milestone_shown_{habitId}_{milestone}";
        var shown = await _settingsService.GetBoolAsync(key);
        if (!shown)
        {
            await _settingsService.SetBoolAsync(key, true);
            return milestone;
        }
    }
}
return null;
```

---

## Dependencies Check

✅ **Models**:
- [x] Habit model with DailyTargetCount, ActiveDays
- [x] Completion model with Count

✅ **Services**:
- [x] IDatabaseService
- [x] DatabaseService
- [ ] ISettingsService (for milestone tracking) - Command 007 dependency!

**Action**: Either implement minimal ISettingsService stub NOW, or remove milestone logic til Command 033.

**Decision**: Implement minimal settings interface in this command for milestone support.

---

## Implementation Guide

### Step 1: Create ISettingsService (Minimal)
```csharp
// Services/ISettingsService.cs
public interface ISettingsService
{
    Task<bool> GetBoolAsync(string key, bool defaultValue = false);
    Task SetBoolAsync(string key, bool value);
}

// Services/SettingsService.cs
public class SettingsService : ISettingsService
{
    private readonly IDatabaseService _database;

    public SettingsService(IDatabaseService database)
        => _database = database;

    public async Task<bool> GetBoolAsync(string key, bool defaultValue = false)
    {
        var value = await _database.GetSettingAsync(key);
        return value == null ? defaultValue : bool.Parse(value);
    }

    public async Task SetBoolAsync(string key, bool value)
        => await _database.SetSettingAsync(key, value.ToString());
}
```

### Step 2: Create IHabitService.cs
Path: `src/Stribe/Services/IHabitService.cs`

```csharp
namespace Stribe.Services;

public interface IHabitService
{
    Task<List<Habit>> GetHabitsForDateAsync(DateTime date);
    Task<Habit?> GetHabitAsync(string id);
    Task SaveHabitAsync(Habit habit);
    Task DeleteHabitAsync(string habitId);

    Task ToggleCompletionAsync(string habitId, DateTime date);
    Task<int> GetCompletionCountAsync(string habitId, DateTime date);

    Task<int> CalculateStreakAsync(string habitId);
    Task<Dictionary<int, bool>> GetWeekProgressAsync(string habitId, DateTime weekStart);
    Task<double> GetCompletionRateAsync(string habitId, int days = 30);

    Task<int?> CheckMilestoneAsync(string habitId);
}
```

### Step 3: Create HabitService.cs
Path: `src/Stribe/Services/HabitService.cs`

```csharp
using Stribe.Models;
using Stribe.Helpers;

namespace Stribe.Services;

public class HabitService : IHabitService
{
    private readonly IDatabaseService _database;
    private readonly ISettingsService _settings;

    public HabitService(IDatabaseService database, ISettingsService settings)
    {
        _database = database;
        _settings = settings;
    }

    public async Task<List<Habit>> GetHabitsForDateAsync(DateTime date)
    {
        var allHabits = await _database.GetHabitsAsync();
        return allHabits
            .Where(h => IsActiveOnDay(h, date))
            .OrderBy(h => h.SortOrder)
            .ToList();
    }

    public async Task<Habit?> GetHabitAsync(string id)
        => await _database.GetHabitAsync(id);

    public async Task SaveHabitAsync(Habit habit)
        => await _database.SaveHabitAsync(habit);

    public async Task DeleteHabitAsync(string habitId)
    {
        var habit = await _database.GetHabitAsync(habitId);
        if (habit != null)
            await _database.DeleteHabitAsync(habit);
    }

    public async Task ToggleCompletionAsync(string habitId, DateTime date)
    {
        var habit = await GetHabitAsync(habitId);
        if (habit == null) return;

        var dateString = date.ToString("yyyy-MM-dd");
        var completion = await _database.GetCompletionAsync(habitId, dateString);

        if (completion == null)
        {
            // First completion
            await _database.SaveCompletionAsync(new Completion
            {
                HabitId = habitId,
                Date = dateString,
                Count = 1
            });
        }
        else if (completion.Count < habit.DailyTargetCount)
        {
            // Increment
            completion.Count++;
            completion.CompletedAt = DateTime.UtcNow;
            await _database.SaveCompletionAsync(completion);
        }
        else
        {
            // Reset (delete)
            await _database.DeleteCompletionAsync(completion);
        }
    }

    public async Task<int> GetCompletionCountAsync(string habitId, DateTime date)
    {
        var dateString = date.ToString("yyyy-MM-dd");
        var completion = await _database.GetCompletionAsync(habitId, dateString);
        return completion?.Count ?? 0;
    }

    public async Task<int> CalculateStreakAsync(string habitId)
    {
        var habit = await GetHabitAsync(habitId);
        if (habit == null) return 0;

        var streak = 0;
        var currentDate = DateTime.Today;

        while (currentDate >= habit.CreatedAt.Date)
        {
            if (!IsActiveOnDay(habit, currentDate))
            {
                currentDate = currentDate.AddDays(-1);
                continue;
            }

            var count = await GetCompletionCountAsync(habitId, currentDate);
            if (count < habit.DailyTargetCount)
                break;

            streak++;
            currentDate = currentDate.AddDays(-1);
        }

        return streak;
    }

    public async Task<Dictionary<int, bool>> GetWeekProgressAsync(string habitId, DateTime weekStart)
    {
        var habit = await GetHabitAsync(habitId);
        if (habit == null) return new Dictionary<int, bool>();

        var progress = new Dictionary<int, bool>();
        for (int i = 0; i < 7; i++)
        {
            var date = weekStart.AddDays(i);
            if (!IsActiveOnDay(habit, date))
            {
                progress[i] = false;
                continue;
            }

            var count = await GetCompletionCountAsync(habitId, date);
            progress[i] = count >= habit.DailyTargetCount;
        }

        return progress;
    }

    public async Task<double> GetCompletionRateAsync(string habitId, int days = 30)
    {
        var habit = await GetHabitAsync(habitId);
        if (habit == null) return 0;

        var startDate = DateTime.Today.AddDays(-days);
        var activeDaysCount = 0;
        var completedDaysCount = 0;

        for (var date = startDate; date <= DateTime.Today; date = date.AddDays(1))
        {
            if (!IsActiveOnDay(habit, date)) continue;

            activeDaysCount++;
            var count = await GetCompletionCountAsync(habitId, date);
            if (count >= habit.DailyTargetCount)
                completedDaysCount++;
        }

        return activeDaysCount == 0 ? 0 : (double)completedDaysCount / activeDaysCount;
    }

    public async Task<int?> CheckMilestoneAsync(string habitId)
    {
        var streak = await CalculateStreakAsync(habitId);
        var milestones = new[] { 7, 21, 30, 60, 90, 180, 365 };

        foreach (var milestone in milestones.OrderByDescending(m => m))
        {
            if (streak == milestone)
            {
                var key = $"milestone_shown_{habitId}_{milestone}";
                var shown = await _settings.GetBoolAsync(key);
                if (!shown)
                {
                    await _settings.SetBoolAsync(key, true);
                    return milestone;
                }
            }
        }

        return null;
    }

    // Helper Methods
    private bool IsActiveOnDay(Habit habit, DateTime date)
    {
        var dayIndex = (int)date.DayOfWeek;
        dayIndex = dayIndex == 0 ? 6 : dayIndex - 1; // Convert Sunday=0 to Monday=0
        return habit.ActiveDays[dayIndex] == '1';
    }
}
```

### Step 4: Register Services in DI
Update `src/Stribe/MauiProgram.cs`:

```csharp
builder.Services.AddSingleton<ISettingsService, SettingsService>();
builder.Services.AddSingleton<IHabitService, HabitService>();
```

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. Unit Tests (Optional but Recommended)
Create `tests/Stribe.Tests/Services/HabitServiceTests.cs`:

```csharp
[Fact]
public async Task CalculateStreak_SimpleCase_ReturnsCorrectStreak()
{
    // Arrange
    var habit = new Habit { Id = "1", DailyTargetCount = 1, ActiveDays = "1111111" };
    // Mock completions for last 3 days

    // Act
    var streak = await _habitService.CalculateStreakAsync("1");

    // Assert
    Assert.Equal(3, streak);
}

[Fact]
public async Task CalculateStreak_WeekdaysOnly_SkipsWeekends()
{
    // Test weekend skipping logic
}

[Fact]
public async Task ToggleCompletion_IncrementsThenResets()
{
    // Test: 0 -> 1 -> 2 -> ... -> target -> 0
}
```

### 3. Manual Test in Emulator
- Create habit with DailyTargetCount = 3
- Toggle 3 times → should show complete
- Toggle 4th time → should reset to 0
- Check streak calculation works

---

## Acceptance Criteria

- [ ] IHabitService og ISettingsService interfaces er oprettet
- [ ] HabitService implementerer alle interface metoder
- [ ] Streak calculation håndterer active days korrekt
- [ ] Toggle logic virker for multi-completion habits
- [ ] Week progress viser korrekt status for alle 7 dage
- [ ] Milestone detection virker og vises kun én gang
- [ ] Services er registreret i DI
- [ ] Build succeeds med 0 errors
- [ ] (Optional) Unit tests passerer

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Ingen caching complexity**: Beregn streak on-demand (kan optimeres senere hvis nødvendigt)
- **Simpel toggle logic**: Increment → Reset når target nået
- **Clear separation**: Business logic i service, ikke spredt i ViewModels
- **Direkte database calls**: Ingen unødvendige abstraction layers

### Alternativer overvejet

**Alternative: Mere kompleks toggle logic**
```csharp
// REJECTED: Too complex
if (count == target && wasCompletedToday && tapCount > target)
    showWarning("Already completed!")
```
**Hvorfor fravalgt**: Over-engineering. Simpel wrap-around behavior er intuitivt nok.

**Alternative: Cache streak values**
```csharp
private Dictionary<string, (int streak, DateTime calculated)> _streakCache;
```
**Hvorfor fravalgt**: Premature optimization. Implement først, optimer kun hvis performance problem.

**Alternative: Event-based milestone notifications**
```csharp
public event EventHandler<MilestoneReachedEventArgs> MilestoneReached;
```
**Hvorfor fravalgt**: Unødvendig complexity. ViewModels kan selv call CheckMilestoneAsync efter toggle.

### Potentielle forbedringer (v2)
- Streak caching med invalidation strategy
- Batch operations for GetWeekProgressAsync
- Support for "pause" functionality (vacation mode)
- Streak "safety net" (1 missed day forgiveness)

### Kendte begrænsninger
- **Performance**: Streak calculation kan blive langsomt for habits med 100+ dage streak (acceptabelt for MVP)
- **Day rollover**: Bruger altid DateTime.Today (custom day start time kommer i Command 036)
- **Timezone**: Ingen timezone handling (altid lokal tid)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simplest løsning - direkte streak calculation, ingen caching
- [x] **Læsbarhed**: Klare metodnavne, selvforklarende logic
- [x] **Navngivning**: `CalculateStreakAsync`, `ToggleCompletionAsync` - beskrivende
- [x] **Funktioner**: Alle metoder under 30 linjer, én opgave hver
- [x] **DRY**: `IsActiveOnDay` helper undgår duplikeret dayIndex logic
- [x] **Error handling**: Null checks for habit, graceful degradation
- [x] **Edge cases**: Weekday filtering, target count boundary, milestone deduplication
- [x] **Performance**: Acceptabel for MVP (kan optimeres senere)
- [x] **Testbarhed**: Interface-based, nem at mocke database

---

## Design Files Reference
- N/A (business logic, ingen UI)

---

## Notes
- Dette er den vigtigste service i hele appen - streak calculation er core value proposition
- Bruger minimal SettingsService implementation (fuld version i Command 007)
- Kan udvides med caching senere hvis performance bliver problem
- Milestone logic kan flyttes til separat service i Command 033 hvis ønsket

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
