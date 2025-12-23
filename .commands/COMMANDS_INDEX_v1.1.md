# Stribe Commands Index v1.1
## Complete Command List with Frequency Feature Impact

**Total Commands**: 42
**Completed**: 4 (001-004)
**Pending**: 38 (005-042)
**Frequency-Affected**: 15 commands

---

## Legend

- ✅ Completed
- ⏸️ Ready to implement
- 🔄 In progress
- ⚠️ Has dependencies
- 🔁 **FREQ** = Involves frequency features (Daily Target or Active Days)

---

## PHASE 1: FOUNDATION (001-009)

### 001 - App Shell & Navigation ✅
- **Status**: Completed
- **Time**: 2.5 hours
- **Frequency Impact**: NO
- **Files**: AppShell.xaml, AppShell.xaml.cs, App.xaml.cs, all stub pages

### 002 - Splash Screen ✅
- **Status**: Completed
- **Time**: 1.5 hours
- **Frequency Impact**: NO
- **Files**: SplashPage.xaml, SplashPage.xaml.cs

### 003 - Helpers & Extensions ✅
- **Status**: Completed
- **Time**: 2 hours
- **Frequency Impact**: NO
- **Files**: Constants.cs, DateTimeExtensions.cs, ColorExtensions.cs, StringExtensions.cs

### 004 - Value Converters ✅
- **Status**: Completed
- **Time**: 2 hours
- **Frequency Impact**: NO
- **Files**: 6 converter classes

### 005 - HabitService (Business Logic) ⏸️ **FREQ**
- **Status**: Ready (command file created)
- **Time**: 3-4 hours
- **Frequency Impact**: **YES - CRITICAL**
  - CalculateStreakAsync() must skip inactive days
  - GetHabitsForDateAsync() must filter by IsActiveOnDay()
  - ToggleCompletionAsync() handles Count increment
- **Dependencies**: None (but creates ISettingsService stub)
- **Files**: IHabitService.cs, HabitService.cs, ISettingsService.cs, SettingsService.cs
- **Key Methods**:
  ```csharp
  Task<List<Habit>> GetHabitsForDateAsync(DateTime date);  // Filters by ActiveDays
  Task ToggleCompletionAsync(string habitId, DateTime date);  // Increments Count
  Task<int> CalculateStreakAsync(string habitId);  // ActiveDays-aware
  Task<Dictionary<int, bool>> GetWeekProgressAsync(...);  // Only active days
  ```

### 006 - NotificationService (Stub) ⏸️
- **Status**: Ready
- **Time**: 2 hours
- **Frequency Impact**: NO (full implementation in 037)
- **Files**: INotificationService.cs, NotificationService.cs (stub)
- **Code Quality Focus**:
  - Simple interface, minimal stub implementation
  - No over-engineering (just method signatures)
  - Full implementation deferred to Command 037

### 007 - Settings Service ⏸️
- **Status**: Ready (partial exists in 005)
- **Time**: 2 hours
- **Frequency Impact**: NO
- **Files**: Expand ISettingsService, SettingsService
- **Note**: Basic version created in Command 005 for milestone tracking
- **This command**: Add remaining settings methods (DayStartTime, etc.)

### 008 - Error Handling & Logging ⏸️
- **Status**: Ready
- **Time**: 1-2 hours
- **Frequency Impact**: NO
- **Files**: ErrorLogger.cs, ExceptionHandler.cs
- **Code Quality Focus**:
  - Simple file-based logging (no frameworks)
  - Console output for debugging
  - No external dependencies (KISS)

### 009 - DI Registration (Foundation Services) ⏸️
- **Status**: Ready
- **Time**: 1 hour
- **Frequency Impact**: NO
- **Dependencies**: 005-008 must be completed first
- **Files**: MauiProgram.cs (update)
- **Registers**:
  ```csharp
  builder.Services.AddSingleton<IHabitService, HabitService>();
  builder.Services.AddSingleton<ISettingsService, SettingsService>();
  builder.Services.AddSingleton<INotificationService, NotificationService>();
  // ... error logger, etc.
  ```

---

## PHASE 2: ONBOARDING (010-014)

### 010 - Welcome Page ⏸️
- **Status**: Ready
- **Time**: 3-4 hours
- **Frequency Impact**: NO
- **Files**: WelcomePage.xaml, WelcomePage.xaml.cs, OnboardingViewModel.cs
- **Design**: stribe-design/screens/02_ONBOARDING_WELCOME.md

### 011 - Habit Selection Page ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 4-5 hours
- **Frequency Impact**: **YES**
  - Must set default DailyTargetCount = 1
  - Must set default ActiveDays = "1111111"
  - Predefined habits may have custom targets (water = 8)
- **Files**: HabitSelectionPage.xaml, update OnboardingViewModel
- **Design**: stribe-design/screens/03_ONBOARDING_HABITS.md (needs update)

### 012 - Custom Habit Dialog ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 3 hours
- **Frequency Impact**: **YES**
  - Add DailyTargetPicker component
  - Add WeekdayPicker component
  - Validate inputs
- **Files**: CustomHabitDialog.xaml, CustomHabitViewModel.cs
- **New UI**: Daily Target Picker + Weekday Picker

### 013 - Reminder Setup Page ⏸️
- **Status**: Ready
- **Time**: 2-3 hours
- **Frequency Impact**: NO
- **Files**: ReminderSetupPage.xaml
- **Note**: Simple time picker, applies to all habits

### 014 - Onboarding Flow Integration ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 2 hours
- **Frequency Impact**: **YES**
  - Optional frequency configuration step
  - Save all habits with frequency data
  - Set onboarding_completed flag
- **Files**: Update navigation flow, OnboardingViewModel
- **New Flow**:
  ```
  Welcome → Habit Selection → (Frequency Config - OPTIONAL) → Reminder → Home
  ```

---

## PHASE 3: CORE EXPERIENCE (015-024)

### 015 - HomeViewModel (Core Logic) ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 4-5 hours
- **Frequency Impact**: **YES - CRITICAL**
  - Load habits using GetHabitsForDateAsync() (filters by active days)
  - Toggle uses ToggleCompletionAsync() (handles count)
  - Enrich habits with completion count
  - Calculate streaks (active days aware)
- **Files**: HomeViewModel.cs
- **Key Properties**:
  ```csharp
  ObservableCollection<HabitViewModel> Habits;  // Each has CompletionCount
  DateTime SelectedDate;
  RelayCommand<HabitViewModel> ToggleCommand;
  ```

### 016 - Home Page Layout ⏸️
- **Status**: Ready
- **Time**: 3 hours
- **Frequency Impact**: NO (layout only)
- **Files**: HomePage.xaml
- **Design**: stribe-design/screens/05_HOME.md

### 017 - Date Navigation Component ⏸️
- **Status**: Ready
- **Time**: 2 hours
- **Frequency Impact**: NO
- **Files**: DateSelector.xaml
- **Features**: Swipe left/right, date display

### 018 - Week Progress Component ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 2 hours
- **Frequency Impact**: **YES**
  - Only show segments for active days
  - Example: Weekday-only habit shows 5 segments (not 7)
- **Files**: WeekProgressBar.xaml
- **Logic**:
  ```csharp
  // Only render segments where habit.IsActiveOnDay(date) == true
  ```

### 019 - Checkbox Component with Animation ⏸️
- **Status**: Ready
- **Time**: 3 hours
- **Frequency Impact**: NO (used when DailyTargetCount = 1)
- **Files**: AnimatedCheckbox.xaml
- **Features**: Scale animation, color transition

### 020 - HabitCard Component ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 4-5 hours
- **Frequency Impact**: **YES - CRITICAL**
  - **Two variants**: Checkbox (DailyTargetCount=1) OR ProgressRing (>1)
  - Show active days indicator if not "1111111"
  - Week progress bar with active days filtering
- **Files**: HabitCard.xaml, HabitCard.xaml.cs
- **Conditional Rendering**:
  ```xml
  <CheckBox IsVisible="{Binding IsSimpleHabit}" />
  <ProgressRing IsVisible="{Binding IsMultiCompletion}" Current="{Binding Count}" Target="{Binding Habit.DailyTargetCount}" />
  ```

### 021 - Home Page - Habit List ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 3 hours
- **Frequency Impact**: **YES**
  - CollectionView with HabitCard (which has frequency features)
  - Empty state when no active habits for today
- **Files**: Update HomePage.xaml with CollectionView

### 022 - Completion Toggle Logic ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 2-3 hours
- **Frequency Impact**: **YES - CRITICAL**
  - Call HabitService.ToggleCompletionAsync()
  - Refresh UI after toggle
  - Check for milestone
  - Update streak display
- **Files**: Update HomeViewModel
- **Flow**:
  ```csharp
  Toggle → ToggleCompletionAsync() → Refresh Habit → Check Milestone → Update UI
  ```

### 023 - Empty State ⏸️
- **Status**: Ready
- **Time**: 1-2 hours
- **Frequency Impact**: NO
- **Files**: EmptyState.xaml
- **Message**: "Ingen vaner i dag" (if ActiveDays filters all habits)

### 024 - Floating Action Button ⏸️
- **Status**: Ready
- **Time**: 1 hour
- **Frequency Impact**: NO
- **Files**: Update HomePage.xaml with FAB
- **Action**: Navigate to Add Habit

---

## PHASE 4: MANAGEMENT (025-032)

### 025 - Habit Detail ViewModel ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 3 hours
- **Frequency Impact**: **YES**
  - Load completion data (with counts)
  - Calculate stats (active days aware)
  - Prepare calendar heatmap data
- **Files**: HabitDetailViewModel.cs

### 026 - Habit Detail Page Layout ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 3-4 hours
- **Frequency Impact**: **YES**
  - Show DailyTargetCount if > 1
  - Show active days pattern
  - Heatmap only shows active days
- **Files**: HabitDetailPage.xaml
- **Design**: stribe-design/screens/06_HABIT_DETAIL.md (needs update)

### 027 - Calendar Heatmap Component ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 4-5 hours
- **Frequency Impact**: **YES**
  - Inactive days show as blank (not gray, not X)
  - Only active days can be completed
- **Files**: CalendarHeatmap.xaml
- **Rendering**:
  ```csharp
  foreach (var date in GetDates())
  {
      if (!habit.IsActiveOnDay(date))
          RenderBlank(date);  // Empty, no visual
      else if (IsCompleted(date))
          RenderCompleted(date, habit.Color);
      else
          RenderIncomplete(date);
  }
  ```

### 028 - Add Habit Page ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 3-4 hours
- **Frequency Impact**: **YES - CRITICAL**
  - Include DailyTargetPicker
  - Include WeekdayPicker
  - Validate inputs
  - Save with frequency data
- **Files**: AddHabitPage.xaml, AddHabitViewModel.cs
- **Design**: stribe-design/screens/07_ADD_HABIT.md (needs update)
- **New Sections**:
  - "Hvor ofte?" (DailyTargetPicker)
  - "Hvilke dage?" (WeekdayPicker)

### 029 - Emoji Picker Component ⏸️
- **Status**: Ready
- **Time**: 2-3 hours
- **Frequency Impact**: NO
- **Files**: EmojiPicker.xaml
- **Grid**: 6 columns, scrollable

### 030 - Color Picker Component ⏸️
- **Status**: Ready
- **Time**: 1-2 hours
- **Frequency Impact**: NO
- **Files**: ColorPicker.xaml
- **Grid**: 12 color options

### 031 - Edit Habit Page ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 2 hours
- **Frequency Impact**: **YES**
  - Same as Add Habit but pre-populated
  - Can change DailyTargetCount and ActiveDays
  - Note: Existing completions preserved
- **Files**: EditHabitPage.xaml (shares components with AddHabitPage)

### 032 - Delete Habit Logic ⏸️
- **Status**: Ready
- **Time**: 1-2 hours
- **Frequency Impact**: NO
- **Files**: Update HabitDetailViewModel
- **Features**: Confirmation dialog, cascade delete completions

---

## PHASE 5: POLISH & LAUNCH (033-042)

### 033 - Milestone Detection Logic ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 2-3 hours
- **Frequency Impact**: **YES**
  - Milestone calculation uses streak (which is active days aware)
  - 7, 21, 30, 60, 90, 180, 365 day thresholds
- **Files**: Already in HabitService (CheckMilestoneAsync)
- **This command**: Polish and test milestone logic

### 034 - Milestone Celebration Page ⏸️
- **Status**: Ready
- **Time**: 3-4 hours
- **Frequency Impact**: NO (displays milestone from 033)
- **Files**: MilestonePage.xaml, MilestoneViewModel.cs
- **Design**: stribe-design/screens/10_MILESTONE_CELEBRATION.md

### 035 - Settings Page Layout ⏸️
- **Status**: Ready
- **Time**: 2-3 hours
- **Frequency Impact**: NO
- **Files**: SettingsPage.xaml, SettingsViewModel.cs
- **Design**: stribe-design/screens/09_SETTINGS.md

### 036 - Day Start Time Setting ⏸️
- **Status**: Ready
- **Time**: 2 hours
- **Frequency Impact**: NO (but affects effective date)
- **Files**: Update SettingsPage, SettingsService
- **Feature**: TimePicker for day rollover time (default 04:00)

### 037 - Notification Implementation ⏸️
- **Status**: Ready
- **Time**: 4-5 hours
- **Frequency Impact**: NO
- **Dependencies**: 006 (NotificationService stub)
- **Files**: NotificationService.cs (full implementation), platform-specific code
- **Platforms**: iOS, Android, Windows (optional)

### 038 - CSV Export Feature ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 2-3 hours
- **Frequency Impact**: **YES**
  - Export includes DailyTargetCount and ActiveDays columns
- **Files**: ExportService.cs
- **Format**:
  ```csv
  HabitName,Date,Count,Target,ActiveDays,Completed
  Drik vand,2025-12-23,8,8,1111111,true
  ```

### 039 - App Animations (Polish) ⏸️
- **Status**: Ready
- **Time**: 3-4 hours
- **Frequency Impact**: NO
- **Files**: Update all pages with transitions
- **Features**: Page transitions, micro-interactions

### 040 - Accessibility Improvements ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 2-3 hours
- **Frequency Impact**: **YES**
  - Screen reader labels for progress ring
  - Announce "3 af 8 gennemført"
  - Weekday picker accessibility
- **Files**: Update AutomationProperties across all components

### 041 - Error Handling & Edge Cases ⏸️ **FREQ**
- **Status**: Ready
- **Time**: 2-3 hours
- **Frequency Impact**: **YES**
  - Handle invalid ActiveDays strings
  - Handle Count > DailyTargetCount (can happen if target changed)
  - Handle habits with no active days
- **Files**: Add validation across services and ViewModels

### 042 - App Store Preparation ⏸️
- **Status**: Ready
- **Time**: 2-3 hours
- **Frequency Impact**: NO
- **Files**: Icons, screenshots, metadata
- **Deliverables**: App icons, store listings, privacy policy

---

## Frequency Features Summary

### Commands with Frequency Impact: 15 total

**Critical (Must implement carefully)**:
- 005 - HabitService (core business logic)
- 015 - HomeViewModel (loads filtered habits)
- 020 - HabitCard (progress ring variant)
- 022 - Completion Toggle (count increment)
- 028 - Add Habit (frequency pickers)

**Important (Affects UX)**:
- 011 - Habit Selection (defaults)
- 012 - Custom Habit Dialog (pickers)
- 014 - Onboarding Flow (frequency step)
- 018 - Week Progress (active days filtering)
- 025 - Habit Detail ViewModel (stats calculation)
- 026 - Habit Detail Page (display frequency info)
- 027 - Calendar Heatmap (inactive day rendering)
- 031 - Edit Habit (change frequency)

**Minor (Data export/polish)**:
- 033 - Milestone (uses streak calculation)
- 038 - CSV Export (include frequency columns)
- 040 - Accessibility (labels for new components)
- 041 - Error Handling (validate frequency data)

---

## Implementation Priority

### High Priority (Blocks Other Commands)
1. **005 - HabitService** - Needed by all ViewModels
2. **009 - DI Registration** - Needed to use services
3. **015 - HomeViewModel** - Core app functionality
4. **020 - HabitCard** - Visual display of habits
5. **028 - Add Habit** - Create habits with frequency

### Medium Priority (Core Features)
6-14: Onboarding flow (010-014)
15-24: Home screen completion (016-024)
25-32: Management features (025-032)

### Low Priority (Polish)
33-42: Phase 5 features (can be added later)

---

## Testing Strategy

### Unit Tests Focus
- HabitService methods (especially streak calculation)
- ActiveDays filtering logic
- Count increment/reset logic
- Week progress calculation

### Integration Tests
- Full onboarding flow with frequency
- Create habit → Complete multiple times → Check streak
- Edit habit frequency → Verify UI updates

### Manual Testing Scenarios
1. **Weekday-only habit**:
   - Create habit, ActiveDays = "1111100"
   - Verify: Hidden on weekend, visible on weekday
   - Complete Mon-Fri → Streak = 5

2. **Multi-completion habit**:
   - Create "Drik vand", DailyTargetCount = 8
   - Tap 8 times → Complete
   - Tap 9th time → Reset to 0

3. **Combined frequency**:
   - Create "Træning", Target = 2, ActiveDays = "1010100" (Mon/Wed/Fri)
   - Complete 2x on Monday → Day completed
   - Tuesday → Habit not shown
   - Wednesday → Habit shown, progress 0/2

---

## Code Quality Standards Applied

Every command must pass this checklist:

### KISS Verification
- [ ] Simplest solution chosen (no over-engineering)
- [ ] No unnecessary abstractions
- [ ] Direct, readable code

### Clean Code Verification
- [ ] Self-documenting code (minimal comments)
- [ ] Descriptive variable/method names
- [ ] Functions under 30 lines
- [ ] Single responsibility

### Implementation Verification
- [ ] Build succeeds (0 errors)
- [ ] No new warnings (or justified)
- [ ] Manual testing passed
- [ ] Edge cases handled

---

**Document Version**: 1.1
**Last Updated**: 2025-12-23
**Total Estimated Time**: 88-111 hours (all 42 commands)
**Completed So Far**: ~8 hours (Commands 001-004)
**Remaining**: ~100 hours
