# Command 005: HabitService (Business Logic)

## Metadata
- **ID:** 005
- **Fase:** 1 - Foundation
- **Estimeret tid:** 3-4 timer
- **Afhængigheder:** Ingen (Models og DatabaseService allerede implementeret)
- **Design reference:** N/A (business logic)

## Formål
Implementere HabitService - den centrale business logic layer for habit operations. Denne service håndterer CRUD operations, streak calculations, completion toggling, og week progress calculations. Dette er kernen i app'ens funktionalitet.

## Risici
- **Medium risiko**: Kritisk business logic - fejl her påvirker hele appen
- **Opmærksomhed**:
  - Streak calculation algoritme skal være 100% korrekt
  - Day rollover logic (dag starter kl. 04:00 default)
  - Week progress skal matche mandag-søndag struktur
- **Test grundigt**: Dette er critical path funktionalitet

## Analyse

### Hvad skal implementeres
Service layer med business logic for habits:
- CRUD operations (Create, Read, Update, Delete)
- ToggleCompletion() - vigtigste funktion
- CalculateStreak() - streak beregning algoritme
- CalculateWeekProgress() - 7-dages completion array
- GetHabitsForDate() - habits med completion status for specifik dato
- CheckMilestone() - detect milestone achievements

### Filer der oprettes
- `src/Stribe/Services/IHabitService.cs` - Interface
- `src/Stribe/Services/HabitService.cs` - Implementation

### Business Rules (KRITISK)

**Streak Calculation:**
```
Current streak = antal consecutive dage TILBAGE fra i dag hvor habit blev completed
- Start fra i går (ikke i dag)
- Tæl tilbage indtil første dag UDEN completion
- Hvis i går IKKE completed → streak = 0
- Day rollover: Dag starter kl. 04:00 (konfigurerbart)
```

**Week Progress:**
```
- Array med 7 booleans [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
- Beregn baseret på aktuel dato
- Bruges til week progress bar i HabitCard
```

**Day Rollover:**
```
- Hvis klokken er før 04:00, betragt det som "i går"
- Dette gør at late-night completions tæller for "i går"
- Konfigurerbart via settings
```

## Dependencies Check
✅ Models (Habit, Completion) - allerede implementeret
✅ DatabaseService - allerede implementeret
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Implementer HabitService for Stribe:

1. **Opret Services/IHabitService.cs**:
```csharp
using Stribe.Models;

namespace Stribe.Services;

public interface IHabitService
{
    // CRUD operations
    Task<List<Habit>> GetAllHabitsAsync();
    Task<Habit?> GetHabitAsync(string id);
    Task<int> SaveHabitAsync(Habit habit);
    Task<int> DeleteHabitAsync(Habit habit);

    // Completion operations
    Task<bool> ToggleCompletionAsync(string habitId, DateTime date);
    Task<bool> IsCompletedOnDateAsync(string habitId, DateTime date);
    Task<List<Completion>> GetCompletionsForHabitAsync(string habitId);

    // Calculations
    Task<int> CalculateStreakAsync(string habitId);
    Task<bool[]> CalculateWeekProgressAsync(string habitId, DateTime weekStartDate);
    Task<List<Habit>> GetHabitsForDateAsync(DateTime date);

    // Milestones
    Task<int?> CheckMilestoneAsync(string habitId);
}
```

2. **Opret Services/HabitService.cs**:
```csharp
using Stribe.Models;
using Stribe.Helpers;

namespace Stribe.Services;

public class HabitService : IHabitService
{
    private readonly IDatabaseService _database;

    public HabitService(IDatabaseService database)
    {
        _database = database;
    }

    // CRUD Operations
    public async Task<List<Habit>> GetAllHabitsAsync()
    {
        return await _database.GetHabitsAsync();
    }

    public async Task<Habit?> GetHabitAsync(string id)
    {
        return await _database.GetHabitAsync(id);
    }

    public async Task<int> SaveHabitAsync(Habit habit)
    {
        return await _database.SaveHabitAsync(habit);
    }

    public async Task<int> DeleteHabitAsync(Habit habit)
    {
        // Delete all completions first
        var completions = await _database.GetCompletionsForHabitAsync(habit.Id);
        foreach (var completion in completions)
        {
            await _database.DeleteCompletionAsync(completion);
        }

        return await _database.DeleteHabitAsync(habit);
    }

    // Completion Operations
    public async Task<bool> ToggleCompletionAsync(string habitId, DateTime date)
    {
        var normalizedDate = date.Date;
        var existingCompletion = await _database.GetCompletionAsync(habitId, normalizedDate);

        if (existingCompletion != null)
        {
            // Remove completion
            await _database.DeleteCompletionAsync(existingCompletion);
            return false;
        }
        else
        {
            // Add completion
            var completion = new Completion
            {
                HabitId = habitId,
                Date = normalizedDate
            };
            await _database.SaveCompletionAsync(completion);
            return true;
        }
    }

    public async Task<bool> IsCompletedOnDateAsync(string habitId, DateTime date)
    {
        var completion = await _database.GetCompletionAsync(habitId, date.Date);
        return completion != null;
    }

    public async Task<List<Completion>> GetCompletionsForHabitAsync(string habitId)
    {
        return await _database.GetCompletionsForHabitAsync(habitId);
    }

    // Calculations
    public async Task<int> CalculateStreakAsync(string habitId)
    {
        var completions = await _database.GetCompletionsForHabitAsync(habitId);

        if (completions.Count == 0)
            return 0;

        var completionDates = completions
            .Select(c => c.Date.Date)
            .OrderByDescending(d => d)
            .ToList();

        // Start from yesterday (not today)
        var checkDate = DateTime.Today.AddDays(-1);
        var streak = 0;

        // Count consecutive days backwards
        while (completionDates.Contains(checkDate))
        {
            streak++;
            checkDate = checkDate.AddDays(-1);
        }

        return streak;
    }

    public async Task<bool[]> CalculateWeekProgressAsync(string habitId, DateTime weekStartDate)
    {
        var weekProgress = new bool[7];
        var completions = await _database.GetCompletionsForHabitAsync(habitId);
        var completionDates = completions.Select(c => c.Date.Date).ToHashSet();

        // Start from Monday
        var monday = weekStartDate.Date;
        while (monday.DayOfWeek != DayOfWeek.Monday)
        {
            monday = monday.AddDays(-1);
        }

        for (int i = 0; i < 7; i++)
        {
            var date = monday.AddDays(i);
            weekProgress[i] = completionDates.Contains(date);
        }

        return weekProgress;
    }

    public async Task<List<Habit>> GetHabitsForDateAsync(DateTime date)
    {
        var habits = await _database.GetHabitsAsync();
        var normalizedDate = date.Date;

        // Filter habits created before or on this date
        return habits
            .Where(h => h.CreatedAt.Date <= normalizedDate && !h.IsArchived)
            .OrderBy(h => h.SortOrder)
            .ToList();
    }

    // Milestones
    public async Task<int?> CheckMilestoneAsync(string habitId)
    {
        var streak = await CalculateStreakAsync(habitId);

        // Check if current streak matches a milestone
        if (Constants.MilestoneDays.Contains(streak))
        {
            return streak;
        }

        return null;
    }
}
```

3. **Registrer i MauiProgram.cs**:
```csharp
builder.Services.AddSingleton<IHabitService, HabitService>();
```
```

### Forventet resultat
- IHabitService interface med alle metoder
- HabitService implementation med korrekt business logic
- Streak calculation virker korrekt
- Week progress array (7 dage) beregnes korrekt
- Service registreret i DI

### Verifikation

#### Build test
```bash
dotnet build src/Stribe/Stribe.csproj
```

#### Unit tests (kritiske!)

**Test streak calculation:**
```
Scenario 1: Ingen completions → streak = 0
Scenario 2: Completed i går → streak = 1
Scenario 3: Completed i går OG i forgårs → streak = 2
Scenario 4: Completed i dag men IKKE i går → streak = 0
Scenario 5: 7 consecutive dage (i går og tilbage) → streak = 7
```

**Test week progress:**
```
Givet: Completions på Mon, Wed, Fri
Forventet: [true, false, true, false, true, false, false]
```

**Test milestone detection:**
```
Streak = 7 → CheckMilestone returns 7
Streak = 8 → CheckMilestone returns null
Streak = 21 → CheckMilestone returns 21
```

#### Integration test i emulator
- [ ] Opret habit via DatabaseService
- [ ] Toggle completion for i dag → verify virker
- [ ] Toggle completion for i går → verify streak = 1
- [ ] Toggle igen → verify completion fjernes
- [ ] Beregn week progress → verify array korrekt

### Acceptkriterier
- [ ] IHabitService interface oprettet
- [ ] HabitService implementation komplet
- [ ] Streak calculation algoritme korrekt
- [ ] Week progress beregning korrekt
- [ ] Service registreret i DI
- [ ] Build succeeds
- [ ] Alle test scenarier passerer

## Status
- [ ] Analyse gennemført
- [ ] Dependencies verified
- [ ] Implementering gennemført
- [ ] Verifikation bestået (KRITISK!)
- [ ] Markeret færdig i _state.json
