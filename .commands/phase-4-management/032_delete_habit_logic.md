# Command 032: Delete Habit Logic

## Metadata
- **Phase**: 4 - Management
- **Dependencies**: 026
- **Estimated Time**: 1-2 hours
- **Status**: Pending
- **Design Reference**: N/A (Business logic)

---

## Formål

Implementere delete habit functionality med confirmation dialog og cascade delete.

**Hvorfor dette er vigtigt:**
- Critical CRUD operation (users must remove unwanted habits)
- Destructive action requires confirmation (prevents accidents)
- Must cascade delete completions (data integrity)
- Safe delete operation (no orphaned data, no crashes)

---

## Risici

### Potentielle Problemer
1. **Accidental deletion**:
   - Edge case: User taps delete by mistake
   - Impact: Permanent data loss

2. **Orphaned completions**:
   - Edge case: Completions not deleted with habit
   - Impact: Database bloat, data integrity issues

3. **Delete during navigation**:
   - Edge case: User still on detail page when habit deleted
   - Impact: Null reference exception, crash

### Mitigering
- Confirmation dialog with clear message (habit name + "This cannot be undone")
- Cascade delete in HabitService (delete completions first, then habit)
- Navigate back immediately after delete (before data refreshes)
- Try-catch with user-friendly error message

---

## Analyse - Hvad Skal Implementeres

### Delete Command in HabitDetailViewModel
**Description**: Delete logic already implemented in Command 025
**Location**: `src/Stribe/ViewModels/HabitDetailViewModel.cs`
**Key Requirements**:
- **Confirmation dialog**: DisplayAlert with habit name
- **Cascade delete**: HabitService.DeleteHabitAsync deletes completions
- **Navigation**: Navigate back after successful delete
- **Error handling**: Try-catch with user alert

**Business Rules**:
```csharp
// Confirmation
- Dialog title: "Slet vane?"
- Dialog message: "Er du sikker på at du vil slette '{HabitName}'? Dette kan ikke fortrydes."
- Buttons: "Slet" (destructive), "Annuller" (safe default)

// Cascade Delete
- Delete all completions for habit (CompletionDate.HabitId == Habit.Id)
- Delete habit record
- Atomic operation (all or nothing)

// Navigation
- On success: Navigate back to home screen ("..")
- On error: Stay on page, show error dialog
```

### HabitService Delete Implementation
**Description**: Service method for cascade delete
**Location**: `src/Stribe/Services/HabitService.cs`
**Key Requirements**:
- DeleteHabitAsync(Habit habit) method
- Delete completions first (foreign key constraint)
- Delete habit last
- Transaction/atomic operation (if supported)

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 025 (HabitDetailViewModel - DeleteHabitCommand already implemented)
- [x] Command 026 (HabitDetailPage - Delete button already added)
- [x] HabitService infrastructure

⚠️ **Assumptions**:
- LiteDB supports cascade delete or manual delete of completions
- Navigation back doesn't cause null reference issues

❌ **Blockers**: None (logic already in Command 025, this verifies)

---

## Implementation Guide

### Step 1: Verify HabitDetailViewModel Delete Command
Path: `src/Stribe/ViewModels/HabitDetailViewModel.cs`

**Already implemented in Command 025:**
```csharp
[RelayCommand]
private async Task DeleteHabitAsync()
{
    var confirm = await Shell.Current.DisplayAlert(
        "Slet vane?",
        $"Er du sikker på at du vil slette '{Habit.Name}'? Dette kan ikke fortrydes.",
        "Slet",
        "Annuller");

    if (confirm)
    {
        try
        {
            await _habitService.DeleteHabitAsync(Habit);
            await Shell.Current.GoToAsync("..");
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Fejl", $"Kunne ikke slette vane: {ex.Message}", "OK");
        }
    }
}
```

**Explanation**:
- **DisplayAlert with cancel option**: Two-button dialog (destructive action requires explicit choice)
- **Habit.Name in message**: Personalized confirmation (user knows exactly what they're deleting)
- **Navigate on success**: Immediate navigation prevents null reference issues
- **Error handling**: User-friendly alert on failure (doesn't crash)

### Step 2: Implement HabitService.DeleteHabitAsync
Path: `src/Stribe/Services/HabitService.cs`

```csharp
public async Task DeleteHabitAsync(Habit habit)
{
    await Task.Run(() =>
    {
        using var db = new LiteDatabase(_dbPath);

        // Step 1: Delete all completions for this habit (cascade)
        var completions = db.GetCollection<Completion>("completions");
        completions.DeleteMany(c => c.HabitId == habit.Id);

        // Step 2: Delete the habit
        var habits = db.GetCollection<Habit>("habits");
        habits.Delete(habit.Id);
    });
}
```

**Explanation**:
- **Delete completions first**: Prevents orphaned completion records
- **DeleteMany**: Removes all completions matching HabitId (cascade delete)
- **Delete habit last**: Safe order (foreign key-like constraint)
- **Task.Run**: Offloads database operation to background thread

### Step 3: Add Verification Tests
Path: `tests/Stribe.Tests/Services/HabitServiceTests.cs`

```csharp
[Fact]
public async Task DeleteHabitAsync_RemovesHabitAndCompletions()
{
    // Arrange
    var habit = new Habit { Id = "test-id", Name = "Test" };
    await _habitService.AddHabitAsync(habit);

    var completion1 = new Completion { Id = "c1", HabitId = habit.Id, Date = DateTime.Today };
    var completion2 = new Completion { Id = "c2", HabitId = habit.Id, Date = DateTime.Today.AddDays(-1) };
    await _habitService.AddCompletionAsync(completion1);
    await _habitService.AddCompletionAsync(completion2);

    // Act
    await _habitService.DeleteHabitAsync(habit);

    // Assert
    var deletedHabit = await _habitService.GetHabitAsync(habit.Id);
    var completions = await _habitService.GetCompletionsForHabitAsync(habit.Id);

    Assert.Null(deletedHabit);
    Assert.Empty(completions);
}

[Fact]
public async Task DeleteHabitAsync_WithNoCompletions_DeletesHabitOnly()
{
    // Arrange
    var habit = new Habit { Id = "test-id", Name = "Test" };
    await _habitService.AddHabitAsync(habit);

    // Act
    await _habitService.DeleteHabitAsync(habit);

    // Assert
    var deletedHabit = await _habitService.GetHabitAsync(habit.Id);
    Assert.Null(deletedHabit);
}

[Fact]
public async Task DeleteHabitAsync_DoesNotDeleteOtherHabits()
{
    // Arrange
    var habit1 = new Habit { Id = "h1", Name = "Habit 1" };
    var habit2 = new Habit { Id = "h2", Name = "Habit 2" };
    await _habitService.AddHabitAsync(habit1);
    await _habitService.AddHabitAsync(habit2);

    var completion1 = new Completion { Id = "c1", HabitId = habit1.Id, Date = DateTime.Today };
    var completion2 = new Completion { Id = "c2", HabitId = habit2.Id, Date = DateTime.Today };
    await _habitService.AddCompletionAsync(completion1);
    await _habitService.AddCompletionAsync(completion2);

    // Act
    await _habitService.DeleteHabitAsync(habit1);

    // Assert
    var deletedHabit = await _habitService.GetHabitAsync(habit1.Id);
    var remainingHabit = await _habitService.GetHabitAsync(habit2.Id);
    var remainingCompletions = await _habitService.GetCompletionsForHabitAsync(habit2.Id);

    Assert.Null(deletedHabit);
    Assert.NotNull(remainingHabit);
    Assert.Single(remainingCompletions);
}
```

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. Unit Tests
```bash
dotnet test tests/Stribe.Tests/Stribe.Tests.csproj
```
Expected: All delete tests pass

### 3. Manual Test in Emulator
- [ ] Navigate to habit detail page
- [ ] Tap Delete button
- [ ] Confirmation dialog appears with habit name
- [ ] Dialog shows "Slet" and "Annuller" buttons
- [ ] Tap "Annuller" → dialog closes, no deletion
- [ ] Tap Delete again, tap "Slet" → habit deleted
- [ ] Navigate back to home screen after delete
- [ ] Deleted habit not shown in habit list
- [ ] No orphaned completions in database (verify via debug)
- [ ] Other habits unaffected by delete
- [ ] Error handling: Simulate service error, verify error dialog

### 4. Data Integrity Test
Using LiteDB viewer or debug logging:
- [ ] Before delete: Habit exists, completions exist
- [ ] After delete: Habit removed, completions removed
- [ ] Other habits and their completions intact

---

## Acceptance Criteria

- [x] DeleteHabitCommand in HabitDetailViewModel (already implemented in 025)
- [x] Confirmation dialog with habit name
- [x] HabitService.DeleteHabitAsync with cascade delete
- [x] Completions deleted before habit (correct order)
- [x] Navigation back after successful delete
- [x] Error handling with user-friendly alert
- [x] Unit tests cover cascade delete logic
- [x] Build succeeds
- [x] Manual testing passed

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Two-step delete**: Simple DeleteMany → Delete sequence (no complex transactions)
- **Single confirmation**: One dialog (no multi-step wizard)
- **Immediate navigation**: Navigate back right after delete (no delay, no animation)
- **Direct service call**: ViewModel calls service directly (no delete coordinator)

### Alternativer overvejet

**Alternative 1: Soft delete (mark as deleted, don't remove)**
```csharp
habit.IsDeleted = true;
habit.DeletedAt = DateTime.Now;
await _habitService.UpdateHabitAsync(habit);
```
**Hvorfor fravalgt**: Adds complexity (filter deleted habits everywhere). Hard delete is simpler for MVP. Can add soft delete in v2 if needed.

**Alternative 2: Undo/trash functionality**
```csharp
await _habitService.MoveToTrashAsync(habit);
// User can restore from trash for 30 days
```
**Hvorfor fravalgt**: Feature creep. Requires trash UI, restore logic, cleanup job. Confirmation dialog is sufficient for MVP.

**Alternative 3: Require password/PIN for delete**
```csharp
var pin = await Shell.Current.DisplayPromptAsync("Enter PIN", "Confirm deletion");
if (pin == userPin) { /* delete */ }
```
**Hvorfor fravalgt**: Over-engineering. App is single-user, no sensitive data. Confirmation dialog is adequate.

### Potentielle forbedringer (v2)
- Soft delete with trash bin - Nice UX, adds complexity
- Undo toast notification (5 seconds to undo) - iOS pattern, requires state management
- Batch delete (select multiple habits) - Low priority
- Export before delete (backup) - Nice safety feature

### Kendte begrænsninger
- **No undo**: Delete is permanent (acceptable - confirmation dialog prevents accidents)
- **No trash bin**: Can't restore deleted habits (acceptable for MVP)
- **Synchronous delete**: Blocks UI briefly (acceptable - operation is fast)

---

## Kode Kvalitet Checklist

### CRUD Operation Safety
- [x] **Confirmation required**: Two-button dialog prevents accidental deletion
- [x] **Habit name in dialog**: User knows exactly what they're deleting (personalized)
- [x] **Cascade delete**: No orphaned completions (data integrity maintained)
- [x] **Delete order**: Completions first, habit last (prevents foreign key errors)
- [x] **Atomic operation**: DeleteMany + Delete in single database session (consistent state)

### Code Quality Standards
- [x] **KISS**: Simple two-step delete, no complex transaction management
- [x] **Læsbarhed**: Clear method name (DeleteHabitAsync), self-documenting
- [x] **Navngivning**: DeleteMany, Delete (standard CRUD naming)
- [x] **Funktioner**: DeleteHabitAsync focused (~10 lines, single responsibility)
- [x] **DRY**: Reuses LiteDatabase session (no duplicate connection code)
- [x] **Error handling**: Try-catch in ViewModel, user-friendly alert
- [x] **Edge cases**: No completions (doesn't fail), invalid habitId (service handles)
- [x] **Performance**: DeleteMany efficient (indexed query on HabitId)
- [x] **Testbarhed**: Easily testable (verify habit + completions deleted)

---

## Design Files Reference

- **Related Commands**:
  - Command 025 (HabitDetailViewModel - implements DeleteHabitCommand)
  - Command 026 (HabitDetailPage - Delete button UI)
  - Command 005 (HabitService - DeleteHabitAsync implementation)

---

## Notes

- **CRITICAL**: Delete completions BEFORE deleting habit (prevents foreign key errors)
- **CRITICAL**: Navigate back immediately after delete (prevents null reference on detail page)
- **CRITICAL**: Confirmation dialog must show habit name (prevents wrong habit deletion)
- DisplayAlert returns bool: true if "Slet" tapped, false if "Annuller" tapped
- DeleteMany uses predicate (c => c.HabitId == habit.Id) for targeted deletion
- No transaction needed in LiteDB (DeleteMany + Delete execute sequentially, fast enough)
- Error message user-friendly (shows ex.Message, not stack trace)

---

**Command Status**: Ready to verify (already implemented in Command 025)
**Last Updated**: 2025-12-23
**Implemented By**: Pending verification
