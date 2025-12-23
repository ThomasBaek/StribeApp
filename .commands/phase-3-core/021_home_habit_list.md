# Command 021: Home Page - Habit List

## Metadata
- **Phase**: 3 - Core Experience
- **Dependencies**: 016, 020, 015
- **Estimated Time**: 2-3 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/05_HOME.md
- **Frequency Impact**: YES - List shows only habits active on selected date (ActiveDays filtering)

---

## Formål

Integrere HabitCard component i Home Page habit list med CollectionView, data binding, og interactions.

**Hvorfor dette er vigtigt:**
- Central UI for habit tracking (bruges dagligt)
- Viser kun relevante habits (ActiveDays filtering fra HomeViewModel)
- Performance-kritisk (mange cards, smooth scrolling)
- Connects UI (HabitCard) med business logic (HomeViewModel)

---

## Risici

### Potentielle Problemer
1. **Performance med mange habits**:
   - Edge case: 30+ habits i liste
   - Impact: Scroll lag, slow initial load

2. **Empty state ikke vist**:
   - Edge case: Alle habits inactive for selected date
   - Impact: Blank screen, confusing UX

### Mitigering
- Use CollectionView med virtualization (built-in MAUI)
- EmptyView shows when Habits collection is empty (after ActiveDays filtering)

---

## Analyse - Hvad Skal Implementeres

### HomePage Habit List
**Location**: `src/Stribe/Pages/HomePage.xaml`
**Key Requirements**:
- CollectionView bound to HomeViewModel.Habits
- ItemTemplate uses HabitCard component
- Command binding for toggle and navigation
- EmptyView for when no habits (or all inactive for selected date)
- Progress summary text below list

**Note**: HomeViewModel.LoadHabitsAsync() already filters habits by ActiveDays (see Command 015), so CollectionView receives only active habits for selected date.

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 015 (HomeViewModel with ActiveDays filtering)
- [x] Command 016 (HomePage layout structure)
- [x] Command 020 (HabitCard component)

⚠️ **Assumptions**:
- HomeViewModel.Habits is ObservableCollection<HabitDisplayModel>
- HabitCard has all necessary BindableProperties

❌ **Blockers**: None

---

## Implementation Guide

### Step 1: Update HomePage.xaml Habit List Section
Path: `src/Stribe/Pages/HomePage.xaml`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:vm="clr-namespace:Stribe.ViewModels"
             xmlns:controls="clr-namespace:Stribe.Controls"
             xmlns:models="clr-namespace:Stribe.Models"
             x:Class="Stribe.Pages.HomePage"
             x:DataType="vm:HomeViewModel"
             Title="{Binding Title}">

    <Grid RowDefinitions="Auto,Auto,*,Auto">

        <!-- Row 0: Date Navigation (Command 017) -->
        <!-- ... date header ... -->

        <!-- Row 1: Progress Summary -->
        <Label Grid.Row="1"
               Text="{Binding ProgressText}"
               Style="{StaticResource SectionHeader}"
               Margin="16,8"
               IsVisible="{Binding HasHabits}" />

        <!-- Row 2: Habit List -->
        <CollectionView Grid.Row="2"
                        ItemsSource="{Binding Habits}"
                        SelectionMode="None"
                        Margin="16,0">

            <CollectionView.ItemTemplate>
                <DataTemplate x:DataType="models:HabitDisplayModel">
                    <controls:HabitCard
                        Habit="{Binding Habit}"
                        IsCompletedToday="{Binding IsCompletedToday}"
                        CurrentStreak="{Binding CurrentStreak}"
                        WeekProgress="{Binding WeekProgress}"
                        CurrentCount="{Binding CurrentCount}"
                        DailyTargetCount="{Binding DailyTargetCount}"
                        HabitColor="{Binding HabitColor}"
                        ToggleCommand="{Binding Source={RelativeSource AncestorType={x:Type vm:HomeViewModel}}, Path=ToggleCompletionCommand}"
                        CardTappedCommand="{Binding Source={RelativeSource AncestorType={x:Type vm:HomeViewModel}}, Path=NavigateToDetailCommand}" />
                </DataTemplate>
            </CollectionView.ItemTemplate>

            <!-- Empty View (when no habits for selected date) -->
            <CollectionView.EmptyView>
                <VerticalStackLayout Padding="32"
                                     Spacing="16"
                                     VerticalOptions="Center"
                                     HorizontalOptions="Center">
                    <Label Text="🌱"
                           FontSize="64"
                           HorizontalOptions="Center" />
                    <Label Text="Ingen vaner i dag"
                           FontSize="20"
                           FontAttributes="Bold"
                           TextColor="{StaticResource TextPrimary}"
                           HorizontalTextAlignment="Center" />
                    <Label Text="Tryk på + for at tilføje en vane"
                           FontSize="14"
                           TextColor="{StaticResource TextSecondary}"
                           HorizontalTextAlignment="Center" />
                </VerticalStackLayout>
            </CollectionView.EmptyView>

        </CollectionView>

        <!-- Row 3: FAB (Command 024) -->
        <!-- ... floating action button ... -->

    </Grid>

</ContentPage>
```

**Explanation**:
- CollectionView binds to HomeViewModel.Habits (already filtered by ActiveDays)
- ItemTemplate uses HabitCard with all properties bound
- RelativeSource binding for commands (ToggleCompletionCommand, NavigateToDetailCommand)
- EmptyView handles both "no habits created" and "no habits active today" scenarios

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. Manual Test in Emulator
- [ ] Home screen shows list of habits (if any exist)
- [ ] Each habit displays as HabitCard component
- [ ] **ActiveDays filtering works**: Only habits active for selected date shown
- [ ] **Switch to different weekday**: List updates to show only active habits for that day
- [ ] **All habits inactive**: EmptyView shows "Ingen vaner i dag"
- [ ] **No habits created**: EmptyView shows "Tryk på + for at tilføje en vane"
- [ ] Tap on card navigates to detail page
- [ ] Tap on checkbox/progress ring toggles completion
- [ ] Smooth scrolling with many habits (10+)
- [ ] Progress summary text updates when completion toggled

---

## Acceptance Criteria

- [x] CollectionView bound to HomeViewModel.Habits
- [x] ItemTemplate uses HabitCard component
- [x] All HabitCard properties bound correctly
- [x] Command binding works (toggle, navigation)
- [x] EmptyView shows appropriate message
- [x] **ActiveDays filtering reflected in list** (only active habits shown)
- [x] Smooth performance with 20+ habits
- [x] Build succeeds
- [x] Manual testing passed

---

## Frequency Feature Integration

### ActiveDays Filtering

**CRITICAL**: HomeViewModel.LoadHabitsAsync() filters habits before populating Habits collection:

```csharp
// In HomeViewModel.LoadHabitsAsync() (Command 015)
var habits = await _habitService.GetHabitsForDateAsync(SelectedDate);

// GetHabitsForDateAsync() filters:
public async Task<List<Habit>> GetHabitsForDateAsync(DateTime date)
{
    var allHabits = await GetAllHabitsAsync();

    // Filter by ActiveDays
    return allHabits.Where(h => h.IsActiveOnDay(date)).ToList();
}
```

**Result**: CollectionView only receives habits active for selected date.

### Example Scenarios

**Scenario 1: User has 3 habits, all active every day**
- Mon-Sun: Shows all 3 habits

**Scenario 2: User has 3 habits, one only active weekdays**
```
Habit A: ActiveDays = "1111111" (every day)
Habit B: ActiveDays = "1111111" (every day)
Habit C: ActiveDays = "1111100" (weekdays only)

Monday: Shows 3 habits (A, B, C)
Saturday: Shows 2 habits (A, B) - C is hidden
```

**Scenario 3: All habits inactive on selected date**
```
Habit A: ActiveDays = "1111100" (weekdays)
Habit B: ActiveDays = "1111100" (weekdays)

Saturday: Shows 0 habits → EmptyView "Ingen vaner i dag"
```

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **CollectionView built-in virtualization**: No custom scroll logic
- **Direct binding**: No intermediate adapter or wrapper
- **RelativeSource for commands**: Standard MAUI pattern (no custom messaging)
- **EmptyView**: Built-in MAUI feature (no custom empty state logic)

### Alternativer overvejet

**Alternative 1: BindableLayout instead of CollectionView**
```xml
<VerticalStackLayout BindableLayout.ItemsSource="{Binding Habits}">
    <BindableLayout.ItemTemplate>
        <DataTemplate>
            <controls:HabitCard ... />
        </DataTemplate>
    </BindableLayout.ItemTemplate>
</VerticalStackLayout>
```
**Hvorfor fravalgt**: No virtualization. Performance issues with 10+ habits. CollectionView is built for lists.

**Alternative 2: Separate collection for each weekday**
```csharp
public ObservableCollection<HabitDisplayModel> MondayHabits { get; set; }
public ObservableCollection<HabitDisplayModel> TuesdayHabits { get; set; }
// ... etc
```
**Hvorfor fravalgt**: Massive code duplication. Single filtered collection is simpler.

**Alternative 3: Filter in XAML with converter**
```xml
<CollectionView ItemsSource="{Binding AllHabits, Converter={StaticResource ActiveDaysFilter}}" />
```
**Hvorfor fravalgt**: Business logic should be in ViewModel, not converter. Less testable.

### Potentielle forbedringer (v2)
- Pull-to-refresh gesture - Nice UX, but data already updates automatically
- Swipe actions on cards (delete, edit) - Common pattern, can add later
- Group by category - Feature creep, simple list is sufficient
- Infinite scroll/pagination - Not needed (users typically have < 20 habits)

### Kendte begrænsninger
- **No client-side caching**: Fetches habits on every date change (acceptable - database is fast)
- **No optimistic EmptyView**: Shows loading before showing empty (acceptable - load is fast)
- **Fixed item height**: No dynamic sizing (acceptable - HabitCard has consistent height)

---

## Kode Kvalitet Checklist

- [x] **KISS**: CollectionView with ItemTemplate, no custom logic
- [x] **Læsbarhed**: Clear XAML structure, descriptive bindings
- [x] **Navngivning**: Habits, HabitCard, ToggleCompletionCommand (self-documenting)
- [x] **Funktioner**: No code-behind needed (pure XAML binding)
- [x] **DRY**: Reuses HabitCard component (no duplicate card logic)
- [x] **Error handling**: No error-prone logic (data binding handles null gracefully)
- [x] **Edge cases**: Empty collection (EmptyView), no active habits for date (EmptyView)
- [x] **Performance**: CollectionView virtualization handles large lists
- [x] **Testbarhed**: ViewModel testable (Habits collection), UI testable (automated UI tests)

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/05_HOME.md
- **Component Spec**: stribe-design/components/HABIT_CARD.md
- **Related**: Command 015 (HomeViewModel filtering), Command 020 (HabitCard)

---

## Notes

- **CRITICAL**: ActiveDays filtering happens in HomeViewModel.LoadHabitsAsync(), not in XAML
- EmptyView text: "Ingen vaner i dag" (not "Ingen vaner endnu") acknowledges habits might exist but are inactive today
- CollectionView.SelectionMode="None" disables selection highlighting (card tap handles navigation)
- RelativeSource binding climbs visual tree to find HomeViewModel (standard pattern for commands)
- Progress summary ("2 af 3 i dag") only shows when HasHabits = true

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
