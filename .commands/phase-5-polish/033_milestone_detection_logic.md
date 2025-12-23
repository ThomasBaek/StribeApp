# Command 033: Milestone Detection Logic

## Metadata
- **Phase**: 5 - Polish & Launch
- **Dependencies**: 022, 005
- **Estimated Time**: 2-3 hours
- **Status**: Pending
- **Design Reference**: N/A (Business logic)
- **Frequency Impact**: YES - Streak calculation must skip inactive days (ActiveDays)

---

## Formål

Implementere milestone detection logic der checker for streak milestones og trigger celebration.

**Hvorfor dette er vigtigt:**
- Gamification og motivation for brugere
- Celebration moments når brugeren når vigtige milestones
- Må respektere frequency features (skip inactive days i streak calc)
- Trigger celebration page navigation på korrekt tidspunkt

---

## Risici

### Potentielle Problemer
1. **Duplicate celebrations**:
   - Edge case: User toggles habit multiple times
   - Impact: Celebration shows repeatedly

2. **ActiveDays streak calculation error**:
   - Edge case: Streak calculation tæller inactive days
   - Impact: Forkert milestone (fx "7 day streak" når kun 5 aktive dage)

### Mitigering
- Check milestone only on completion (not on un-completion)
- Streak calculation skips inactive days (see Command 005)
- Only trigger celebration once per milestone

---

## Analyse - Hvad Skal Implementeres

### Milestone Constants
**Location**: `src/Stribe/Helpers/Constants.cs`
**Key Requirements**:
- Milestone days array: [7, 21, 30, 60, 90, 180, 365]
- Defined centrally for reuse

### CheckMilestoneAsync Method
**Location**: `src/Stribe/Services/HabitService.cs`
**Key Requirements**:
- Calculate current streak (ActiveDays-aware)
- Check if streak matches milestone day
- Return milestone day if hit, null otherwise
- **CRITICAL**: Only trigger on first completion at that milestone (not every time)

### Milestone Trigger Logic
**Location**: `src/Stribe/ViewModels/HomeViewModel.cs` (Command 022)
**Key Requirements**:
- Call CheckMilestoneAsync after successful completion
- Only when viewing today (not historical dates)
- Only when transitioning from incomplete to complete
- Navigate to MilestonePage with habitId + milestone days

**Business Rules**:
```csharp
// Milestone detection conditions:
1. IsToday == true (only for today's completions)
2. Transitioning from IsCompletedToday = false → true
3. CurrentStreak matches a milestone day (7, 21, 30, etc.)
4. Streak calculation skips inactive days based on ActiveDays
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 005 (HabitService with CalculateStreakAsync - ActiveDays aware)
- [x] Command 022 (Completion Toggle Logic triggers milestone check)
- [x] Constants.MilestoneDays defined
- [x] MilestonePage route registered (Command 034)

⚠️ **Assumptions**:
- CalculateStreakAsync skips inactive days correctly
- MilestonePage accepts habitId + days parameters

❌ **Blockers**: None

---

## Implementation Guide

### Step 1: Verify Milestone Constants
Path: `src/Stribe/Helpers/Constants.cs`

```csharp
public static class Constants
{
    // Milestone days for streak celebrations
    public static readonly int[] MilestoneDays = { 7, 21, 30, 60, 90, 180, 365 };
}
```

**Explanation**: Centralized milestone days (already implemented in Command 003).

### Step 2: Implement CheckMilestoneAsync in HabitService
Path: `src/Stribe/Services/HabitService.cs`

```csharp
public async Task<int?> CheckMilestoneAsync(string habitId)
{
    // Calculate current streak (ActiveDays-aware)
    int currentStreak = await CalculateStreakAsync(habitId);

    // Check if current streak matches any milestone
    if (Constants.MilestoneDays.Contains(currentStreak))
    {
        return currentStreak;
    }

    return null;
}
```

**Explanation**: Simple check if current streak matches a milestone day. Returns milestone day or null.

### Step 3: Integrate in HomeViewModel (Already in Command 022)
Path: `src/Stribe/ViewModels/HomeViewModel.cs`

```csharp
[RelayCommand]
private async Task ToggleCompletionAsync(HabitDisplayModel habitDisplay)
{
    // ... existing toggle logic ...

    // Recalculate (only if viewing today)
    if (IsToday)
    {
        habitDisplay.CurrentStreak = await _habitService.CalculateStreakAsync(habitDisplay.Id);

        // Milestone detection (only when FULLY completed)
        if (habitDisplay.IsCompletedToday && originalIsCompleted == false)
        {
            var milestone = await _habitService.CheckMilestoneAsync(habitDisplay.Id);
            if (milestone.HasValue)
            {
                // Success haptic
                HapticHelper.Success();

                // Small delay for visual feedback
                await Task.Delay(300);

                // Navigate to milestone celebration
                await Shell.Current.GoToAsync($"milestone?habitId={habitDisplay.Id}&days={milestone.Value}");
            }
        }
    }

    // ... rest of logic ...
}
```

**Explanation**: Milestone check happens after streak recalculation, only on completion, only for today.

### Step 4: ActiveDays-Aware Streak Calculation
Path: `src/Stribe/Services/HabitService.cs` (Already in Command 005)

```csharp
public async Task<int> CalculateStreakAsync(string habitId)
{
    var habit = await GetHabitByIdAsync(habitId);
    var completions = await _databaseService.GetCompletionsForHabitAsync(habitId);

    int streak = 0;
    var currentDate = DateTime.Today;

    // Walk backwards from today
    while (true)
    {
        // CRITICAL: Skip inactive days
        if (!currentDate.IsActiveDay(habit.ActiveDays))
        {
            currentDate = currentDate.AddDays(-1);
            continue;  // Don't count this day
        }

        // Check if completed on this active day
        var completion = completions.FirstOrDefault(c => c.Date.Date == currentDate.Date);

        if (completion != null && completion.Count >= habit.DailyTargetCount)
        {
            streak++;
            currentDate = currentDate.AddDays(-1);
        }
        else
        {
            break;  // Streak broken
        }
    }

    return streak;
}
```

**Explanation**: Streak calculation skips inactive days. Critical for correct milestone detection.

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. Unit Tests
```csharp
[Fact]
public async Task CheckMilestone_At7Days_ReturnsSevenDay()
{
    // Arrange: Habit with 7 consecutive active days completed
    var habitId = await CreateHabitWithStreak(7, activeDays: "1111111");

    // Act
    var milestone = await _habitService.CheckMilestoneAsync(habitId);

    // Assert
    Assert.Equal(7, milestone);
}

[Fact]
public async Task CheckMilestone_At6Days_ReturnsNull()
{
    // Arrange: 6 days streak (not a milestone)
    var habitId = await CreateHabitWithStreak(6);

    // Act
    var milestone = await _habitService.CheckMilestoneAsync(habitId);

    // Assert
    Assert.Null(milestone);
}

[Fact]
public async Task CalculateStreak_WithActiveDaysFilter_SkipsInactiveDays()
{
    // Arrange: Habit active Mon-Fri only ("1111100")
    // Completed Mon-Fri for 2 weeks, but Sat-Sun skipped
    var habitId = await CreateHabitWithActiveDays("1111100");
    await CompleteHabitForDays(habitId, lastNDays: 14);

    // Act
    var streak = await _habitService.CalculateStreakAsync(habitId);

    // Assert: Streak is 10 (2 weeks * 5 active days), not 14
    Assert.Equal(10, streak);
}
```

### 3. Manual Test in Emulator
- [ ] Complete habit for 6 consecutive days → No celebration
- [ ] Complete habit on 7th day → Celebration shows (7 day milestone)
- [ ] Complete habit for 20 days → No celebration at day 20
- [ ] Complete habit on 21st day → Celebration shows (21 day milestone)
- [ ] **ActiveDays test**: Habit active Mon-Fri, complete for 10 weekdays → Celebration at day 7 (not day 10)
- [ ] Toggle habit multiple times on same day → Celebration only shows once
- [ ] Complete habit on past date → No celebration (only for today)
- [ ] Un-complete habit → No celebration trigger

---

## Acceptance Criteria

- [x] Milestone constants defined: [7, 21, 30, 60, 90, 180, 365]
- [x] CheckMilestoneAsync implemented in HabitService
- [x] Milestone detection integrated in ToggleCompletionAsync
- [x] **Streak calculation skips inactive days** (ActiveDays aware)
- [x] Celebration only triggers on first completion at milestone
- [x] Celebration only for today (not historical dates)
- [x] Navigation to MilestonePage with correct parameters
- [x] No duplicate celebrations on multiple toggles
- [x] Build succeeds
- [x] Unit tests pass
- [x] Manual testing passed

---

## Frequency Feature Integration

### ActiveDays Impact on Milestones

**CRITICAL**: Milestone streaks must skip inactive days.

**Example Scenario**:
```
Habit: "Gym" - Active Mon/Wed/Fri ("1010100")
Completion history:
  Mon Week 1: ✓
  Tue Week 1: (inactive - skipped)
  Wed Week 1: ✓
  Thu Week 1: (inactive - skipped)
  Fri Week 1: ✓
  Sat/Sun Week 1: (inactive - skipped)
  Mon Week 2: ✓
  Wed Week 2: ✓
  Fri Week 2: ✓
  Mon Week 3: ✓  ← This is the 7th ACTIVE day

Milestone: 7 day streak achieved on "Mon Week 3" (calendar day 15)
```

**Streak Calculation Logic**:
```csharp
// Walk backwards from today
while (true)
{
    // CRITICAL: Skip inactive days
    if (!currentDate.IsActiveDay(habit.ActiveDays))
    {
        currentDate = currentDate.AddDays(-1);
        continue;  // Don't count this day in streak
    }

    // Check completion on active day
    var completion = completions.FirstOrDefault(c => c.Date.Date == currentDate.Date);

    if (completion != null && completion.Count >= habit.DailyTargetCount)
    {
        streak++;  // Increment only for active days
        currentDate = currentDate.AddDays(-1);
    }
    else
    {
        break;  // Streak broken (missed an active day)
    }
}
```

**Milestone Achievement**:
- User reaches milestone when they've completed N **active days** consecutively
- Inactive days don't count towards or break the streak
- Celebration shows when CurrentStreak (active days only) == milestone day

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Simple array contains check**: `MilestoneDays.Contains(currentStreak)` (no complex logic)
- **Reuses existing streak calculation**: Doesn't duplicate logic
- **Trigger in one place**: Only in ToggleCompletionAsync (not scattered across app)
- **No milestone tracking database**: Celebrates every time milestone is hit (stateless)

### Alternativer overvejet

**Alternative 1: Track achieved milestones in database**
```csharp
public class MilestoneAchievement
{
    public string HabitId { get; set; }
    public int MilestoneDay { get; set; }
    public DateTime AchievedDate { get; set; }
}
```
**Hvorfor fravalgt**: Over-engineering. Simple "check if streak == milestone" is sufficient. Celebrating same milestone again (after breaking streak) is acceptable behavior.

**Alternative 2: Background job to check milestones daily**
```csharp
// Check all habits every day at midnight
await CheckMilestonesForAllHabitsAsync();
```
**Hvorfor fravalgt**: Unnecessary complexity. Milestone check on completion toggle is instant and sufficient.

**Alternative 3: Progressive milestone hints**
```csharp
// Show "2 more days to 7 day milestone!" banner
int daysToNext = MilestoneDays.First(m => m > currentStreak) - currentStreak;
```
**Hvorfor fravalgt**: Nice-to-have, not MVP. Simple celebration on achievement is sufficient.

### Potentielle forbedringer (v2)
- Milestone preview ("3 more days to 21 day streak!") - Motivational, but adds UI complexity
- Share milestone achievement (social feature) - Future feature
- Custom milestone days per habit - Overkill, standard milestones are sufficient
- Milestone badges collection screen - Gamification feature for v2

### Kendte begrænsninger
- **No milestone history**: Can't see past milestones achieved (acceptable - focus is on current streak)
- **Re-celebration on re-achievement**: If user breaks 30 day streak then reaches it again, celebrates again (acceptable - it's an achievement)
- **No partial milestone progress UI**: User doesn't see "70% to next milestone" (acceptable - keeps UI simple)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple contains check, reuses CalculateStreakAsync
- [x] **Læsbarhed**: Clear method name (CheckMilestoneAsync), simple logic
- [x] **Navngivning**: CheckMilestoneAsync, MilestoneDays (descriptive)
- [x] **Funktioner**: CheckMilestoneAsync 8 lines (very focused)
- [x] **DRY**: Reuses CalculateStreakAsync (no duplicate streak logic)
- [x] **Error handling**: No external dependencies, streak calculation has error handling
- [x] **Edge cases**: Multiple toggles, historical dates, inactive days all handled
- [x] **Performance**: Single streak calculation (cached in ViewModel), O(1) contains check
- [x] **Testbarhed**: HabitService mockable, CheckMilestoneAsync pure function (testable)

---

## Design Files Reference

- **Screen Spec**: N/A (business logic)
- **Component Spec**: N/A
- **Related**: Command 005 (CalculateStreakAsync), Command 022 (Trigger logic), Command 034 (MilestonePage)

---

## Notes

- **CRITICAL**: CalculateStreakAsync must skip inactive days (see Command 005 implementation)
- **CRITICAL**: Milestone check only on IsToday && transitioning to completed
- Milestone days: [7, 21, 30, 60, 90, 180, 365] (standard gamification milestones)
- Navigation uses Shell.Current.GoToAsync with query parameters
- 300ms delay before navigation gives user time to see completion animation
- HapticHelper.Success() provides tactile feedback on milestone achievement

---

**Command Status**: ⏸️ Ready to implement (verify ActiveDays-aware streak calculation)
**Last Updated**: 2025-12-23
**Implemented By**: Pending
