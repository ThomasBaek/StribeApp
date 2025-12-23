# Command 022: Completion Toggle Logic

## Metadata
- **Phase**: 3 - Core Experience
- **Dependencies**: 021, 005
- **Estimated Time**: 2-3 hours
- **Status**: Pending
- **Design Reference**: N/A (Business logic)
- **Frequency Impact**: YES - Must handle Count increment for DailyTargetCount > 1

---

## Formål

Implementere og polere completion toggle logic med haptic feedback, optimistic UI updates, og milestone detection integration.

**Hvorfor dette er vigtigt:**
- Central UX-kritisk funktionalitet (instant feedback)
- Håndterer multi-completion logic (DailyTargetCount)
- Milestone detection giver brugeren celebration moments
- Error handling sikrer data consistency

## Risici
- **Medium risiko**: User experience critical
- **Opmærksomhed**:
  - Optimistic UI updates (instant feedback)
  - Rollback ved database fejl
  - Haptic feedback platform specific
  - Milestone detection timing

## Analyse

### Hvad skal implementeres
- Optimistic UI update (instant visual feedback)
- Haptic feedback on toggle
- Error handling med rollback
- Milestone detection og navigation
- Animation trigger

### Filer der ændres
- `src/Stribe/ViewModels/HomeViewModel.cs` - Polish ToggleCompletionCommand
- `src/Stribe/Helpers/HapticHelper.cs` - Platform haptic feedback

## Dependencies Check
✅ Command 021 (Home Habit List) - implementeret
✅ HabitService - has milestone detection
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Polish Completion Toggle Logic i HomeViewModel:

**Opret Helpers/HapticHelper.cs**:
```csharp
namespace Stribe.Helpers;

public static class HapticHelper
{
    public static void Light()
    {
#if ANDROID || IOS
        HapticFeedback.Default.Perform(HapticFeedbackType.Click);
#endif
    }

    public static void Medium()
    {
#if ANDROID || IOS
        HapticFeedback.Default.Perform(HapticFeedbackType.LongPress);
#endif
    }

    public static void Success()
    {
#if ANDROID || IOS
        // Use light for success
        HapticFeedback.Default.Perform(HapticFeedbackType.Click);
#endif
    }
}
```

**Opdater ToggleCompletionAsync i ViewModels/HomeViewModel.cs**:
```csharp
[RelayCommand]
private async Task ToggleCompletionAsync(HabitDisplayModel habitDisplay)
{
    if (habitDisplay == null)
        return;

    var originalState = habitDisplay.IsCompletedToday;
    var originalStreak = habitDisplay.CurrentStreak;

    try
    {
        // Optimistic UI update (instant feedback)
        habitDisplay.IsCompletedToday = !originalState;

        // Haptic feedback
        HapticHelper.Light();

        // Update database
        var isNowCompleted = await _habitService.ToggleCompletionAsync(habitDisplay.Id, SelectedDate);

        // Verify optimistic update was correct
        if (isNowCompleted != habitDisplay.IsCompletedToday)
        {
            habitDisplay.IsCompletedToday = isNowCompleted;
        }

        // Recalculate streak (only if viewing today)
        if (IsToday)
        {
            habitDisplay.CurrentStreak = await _habitService.CalculateStreakAsync(habitDisplay.Id);

            // Check for milestone achievement
            if (isNowCompleted)
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

        // Recalculate week progress
        habitDisplay.WeekProgress = await _habitService.CalculateWeekProgressAsync(habitDisplay.Id, SelectedDate);

        // Update daily progress summary
        CalculateDailyProgress();
    }
    catch (Exception ex)
    {
        // Rollback optimistic update
        habitDisplay.IsCompletedToday = originalState;
        habitDisplay.CurrentStreak = originalStreak;

        // Show error
        await Shell.Current.DisplayAlert(
            "Fejl",
            "Kunne ikke opdatere vane. Prøv igen.",
            "OK");

        // Log error
        System.Diagnostics.Debug.WriteLine($"Toggle completion error: {ex.Message}");
    }
}
```

Reference: Best practices for optimistic UI updates
```

### Forventet resultat
- Instant UI feedback on toggle
- Haptic feedback on tap
- Streak recalculates in real-time
- Milestone detection works
- Error handling med rollback

### Verifikation

#### Test scenarios
**Test 1: Normal toggle**
```
1. Tap checkbox
2. Verify: Instant visual change
3. Verify: Haptic feedback felt
4. Verify: Streak updates
5. Verify: Week progress updates
```

**Test 2: Milestone achievement**
```
1. Complete habit on 7th consecutive day
2. Verify: Checkbox toggles
3. Verify: Short delay (300ms)
4. Verify: Navigate to milestone page
```

**Test 3: Error handling**
```
1. Simulate database error
2. Verify: UI rolls back to previous state
3. Verify: Error alert shown
```

**Test 4: Toggle on past date**
```
1. Navigate to yesterday
2. Toggle completion
3. Verify: Streak NOT recalculated (only for today)
4. Verify: Week progress updates
```

### Acceptkriterier
- [ ] Optimistic UI update virker
- [ ] Haptic feedback implementeret
- [ ] **Multi-completion logic implemented** (Count increment for DailyTargetCount > 1)
- [ ] Streak recalculation korrekt (skips inactive days based on ActiveDays)
- [ ] Milestone detection virker
- [ ] Error handling med rollback
- [ ] Progress summary opdateres
- [ ] **Progress Ring updates correctly** (for habits with DailyTargetCount > 1)

---

## Frequency Feature Integration

### Multi-Completion Toggle Logic

**CRITICAL**: For habits med DailyTargetCount > 1, toggle skal incrementere Count i stedet for boolean flip.

**Behavior**:
```
DailyTargetCount = 1 (default):
  - Tap 1: Count = 1 (completed) ✓
  - Tap 2: Count = 0 (uncompleted) ○

DailyTargetCount = 3:
  - Tap 1: Count = 1 (progress: 1/3) ◔
  - Tap 2: Count = 2 (progress: 2/3) ◑
  - Tap 3: Count = 3 (completed: 3/3) ● ✓
  - Tap 4: Count = 0 (reset) ○
```

**Implementation in HabitService.ToggleCompletionAsync()**:
```csharp
public async Task<Completion?> ToggleCompletionAsync(string habitId, DateTime date)
{
    var habit = await GetHabitByIdAsync(habitId);
    var existing = await _databaseService.GetCompletionAsync(habitId, date);

    if (existing == null)
    {
        // First tap: Create with Count = 1
        var newCompletion = new Completion
        {
            Id = Guid.NewGuid().ToString(),
            HabitId = habitId,
            Date = date.Date,
            Count = 1
        };
        await _databaseService.AddCompletionAsync(newCompletion);
        return newCompletion;
    }
    else
    {
        // Subsequent taps: Increment or reset
        if (existing.Count >= habit.DailyTargetCount)
        {
            // Already complete → Reset to 0 (delete)
            await _databaseService.DeleteCompletionAsync(existing.Id);
            return null;
        }
        else
        {
            // Not yet complete → Increment
            existing.Count++;
            await _databaseService.UpdateCompletionAsync(existing);
            return existing;
        }
    }
}
```

### ViewModel Update Logic

**Update ToggleCompletionAsync i HomeViewModel**:
```csharp
[RelayCommand]
private async Task ToggleCompletionAsync(HabitDisplayModel habitDisplay)
{
    if (habitDisplay == null) return;

    // Save original state for rollback
    var originalCount = habitDisplay.CurrentCount;
    var originalIsCompleted = habitDisplay.IsCompletedToday;

    try
    {
        // Optimistic UI update (predict next state)
        int newCount;
        if (habitDisplay.CurrentCount >= habitDisplay.DailyTargetCount)
        {
            newCount = 0;  // Reset
        }
        else if (habitDisplay.CurrentCount == 0)
        {
            newCount = 1;  // First completion
        }
        else
        {
            newCount = habitDisplay.CurrentCount + 1;  // Increment
        }

        habitDisplay.CurrentCount = newCount;
        habitDisplay.IsCompletedToday = newCount >= habitDisplay.DailyTargetCount;

        // Haptic feedback
        HapticHelper.Light();

        // Database update
        var completion = await _habitService.ToggleCompletionAsync(habitDisplay.Id, SelectedDate);

        // Verify and correct optimistic update
        habitDisplay.CurrentCount = completion?.Count ?? 0;
        habitDisplay.IsCompletedToday = completion != null && completion.Count >= habitDisplay.DailyTargetCount;

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
                    HapticHelper.Success();
                    await Task.Delay(300);
                    await Shell.Current.GoToAsync($"milestone?habitId={habitDisplay.Id}&days={milestone.Value}");
                }
            }
        }

        // Refresh week progress
        habitDisplay.WeekProgress = await _habitService.CalculateWeekProgressAsync(habitDisplay.Id, SelectedDate);

        // Update progress summary
        CalculateDailyProgress();
    }
    catch (Exception ex)
    {
        // Rollback
        habitDisplay.CurrentCount = originalCount;
        habitDisplay.IsCompletedToday = originalIsCompleted;

        await Shell.Current.DisplayAlert("Fejl", "Kunne ikke opdatere vane. Prøv igen.", "OK");
        System.Diagnostics.Debug.WriteLine($"Toggle error: {ex.Message}");
    }
}
```

### UI Binding

**HabitCard skal vise enten Checkbox eller ProgressRing**:
```xml
<!-- Checkbox (when DailyTargetCount = 1) -->
<Border IsVisible="{Binding DailyTargetCount, Converter={StaticResource IntEquals}, ConverterParameter=1}">
    <CheckBox IsChecked="{Binding IsCompletedToday}" />
</Border>

<!-- Progress Ring (when DailyTargetCount > 1) -->
<controls:ProgressRing
    IsVisible="{Binding DailyTargetCount, Converter={StaticResource IntGreaterThan}, ConverterParameter=1}"
    CurrentCount="{Binding CurrentCount}"
    TargetCount="{Binding DailyTargetCount}"
    TappedCommand="{Binding ToggleCommand}" />
```

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Simple increment logic**: Count++, no complex state machine
- **Optimistic UI**: Direct property update (no debouncing, no complex async coordination)
- **Haptic feedback**: Uses built-in MAUI HapticFeedback API
- **Error handling**: Simple try-catch with rollback

### Alternativer overvejet

**Alternative 1: Pessimistic UI (wait for database)**
```csharp
// Update database first, then UI
var isCompleted = await _habitService.ToggleCompletionAsync(...);
habitDisplay.IsCompletedToday = isCompleted;  // Slow feedback
```
**Hvorfor fravalgt**: Poor UX. User expects instant visual feedback on tap. Database is fast (~10ms), but perceived delay is noticeable.

**Alternative 2: Queue-based toggle**
```csharp
private Queue<ToggleOperation> _pendingToggles = new();
// Process queue in background
```
**Hvorfor fravalgt**: Over-engineering. Single-user app, no concurrent toggle conflicts. Simple optimistic update is sufficient.

**Alternative 3: Animation before database update**
```csharp
await AnimateCheckbox();  // Animate first
await _habitService.ToggleCompletionAsync(...);  // Then save
```
**Hvorfor fravalgt**: Delays data persistence. If app crashes during animation, data is lost. Update database first, then animate.

### Potentielle forbedringer (v2)
- Undo toast (2 second window to undo completion) - Nice UX, but adds complexity
- Batch toggle (long-press to toggle all habits) - Power user feature, not MVP
- Custom haptic patterns per milestone tier - Fun detail, not MVP
- Offline queue with sync - Not needed (local database always available)

### Kendte begrænsninger
- **Optimistic update can be wrong**: If database constraint fails (rare edge case - acceptable, UI corrects itself)
- **No animation during rollback**: Instant revert (acceptable - error case is rare)
- **Milestone navigation interrupts flow**: User navigates away from home screen (by design - celebration moment)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple increment logic, optimistic update, no complex state management
- [x] **Læsbarhed**: Clear variable names (originalCount, newCount, isCompleted)
- [x] **Navngivning**: ToggleCompletionAsync describes action clearly
- [x] **Funktioner**: ToggleCompletionAsync ~40 lines (acceptable for critical path logic)
- [x] **DRY**: Rollback logic isolated, CalculateDailyProgress reused
- [x] **Error handling**: Try-catch with rollback, user-friendly error message
- [x] **Edge cases**: Database errors, milestone detection, past dates (no streak update)
- [x] **Performance**: Optimistic UI (instant), async database calls
- [x] **Testbarhed**: HabitService mockable, optimistic logic testable

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/05_HOME.md (toggle behavior)
- **Component Spec**: stribe-design/components/PROGRESS_RING.md (multi-completion UI)
- **Related**: Command 005 (HabitService toggle logic), Command 015 (HomeViewModel)

---

## Notes

- **CRITICAL**: ToggleCompletionAsync must call HabitService.ToggleCompletionAsync() which handles Count increment
- **CRITICAL**: Milestone detection only triggers when transitioning from not-complete to fully-complete
- **CRITICAL**: Optimistic UI must match ToggleCompletionAsync behavior (same logic for predicting new state)
- Haptic feedback timing: Immediate on tap (before database update)
- Rollback includes both CurrentCount AND IsCompletedToday (both properties must revert)
- CalculateDailyProgress uses completion threshold: Count >= DailyTargetCount

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
