# Command 022: Completion Toggle Logic

## Metadata
- **ID:** 022
- **Fase:** 3 - Core Experience
- **Estimeret tid:** 2-3 timer
- **Afhængigheder:** 021
- **Design reference:** N/A (Business logic)

## Formål
Implementere og polere completion toggle logic med haptic feedback, optimistic UI updates, og milestone detection integration.

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
- [ ] Streak recalculation korrekt
- [ ] Milestone detection virker
- [ ] Error handling med rollback
- [ ] Progress summary opdateres

## Status
- [ ] Implementering gennemført
- [ ] Verifikation bestået
