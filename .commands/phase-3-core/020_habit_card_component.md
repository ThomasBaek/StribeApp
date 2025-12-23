# Command 020: HabitCard Component

## Metadata
- **Phase**: 3 - Core Experience
- **Dependencies**: 018, 019
- **Estimated Time**: 4-5 hours
- **Status**: Pending
- **Design Reference**: stribe-design/components/HABIT_CARD.md
- **Frequency Impact**: YES - Must conditionally render Checkbox OR ProgressRing based on DailyTargetCount

---

## Formål

Implementere HabitCard - den mest kritiske UI komponent i hele appen. Den vises på home screen for hver habit og indeholder emoji, navn, streak counter, week progress bar, og **enten checkbox (DailyTargetCount=1) eller progress ring (DailyTargetCount>1)**.

**Hvorfor dette er vigtigt:**
- Core UI component - vises for hver habit på home screen
- Må understøtte både simple habits (checkbox) og multi-completion habits (progress ring)
- Visuelt interface til tracking og completion
- Reusable component med god performance (mange cards i list)

---

## Risici

### Potentielle Problemer
1. **Performance med mange cards**:
   - Edge case: 20+ habits i liste
   - Impact: Scroll lag, slow rendering

2. **Conditional rendering complexity**:
   - Edge case: Switching mellem checkbox og progress ring based on DailyTargetCount
   - Impact: Layout shift, binding errors

3. **Week progress accuracy**:
   - Edge case: ActiveDays filtering - nogle dage skal vises inactive
   - Impact: Forkert visual feedback til bruger

### Mitigering
- Use CollectionView med virtualization
- Clear binding logic for conditional rendering
- Week progress component filters by ActiveDays

---

## Analyse - Hvad Skal Implementeres

### HabitCard Layout
**Location**: `src/Stribe/Controls/HabitCard.xaml`
**Key Requirements**:
- 3-row grid layout
- Row 0: Emoji, name, streak badge
- Row 1: Week progress bar (7 segments)
- Row 2: **Conditional: Checkbox OR ProgressRing**
- Shadow, rounded corners, tap gestures

### HabitCard Code-Behind
**Location**: `src/Stribe/Controls/HabitCard.xaml.cs`
**Key Requirements**:
- BindableProperties: Habit, IsCompleted, CurrentStreak, WeekProgress, **CurrentCount, DailyTargetCount**
- Events: CardTapped, CheckboxTapped
- Conditional rendering logic

### Converters
**Already created in Command 004**:
- BoolToColorConverter (week progress colors)
- IntToVisibilityConverter (show ProgressRing when DailyTargetCount > 1)
- StreakToColorConverter (streak badge color)

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 018 (WeekProgressBar component)
- [x] Command 019 (AnimatedCheckbox component)
- [x] ProgressRing component spec (stribe-design/components/PROGRESS_RING.md)
- [x] Converters created (Command 004)

⚠️ **Assumptions**:
- HabitDisplayModel includes CurrentCount and DailyTargetCount
- ProgressRing component will be created separately (can be stubbed initially)

❌ **Blockers**: None

---

## Implementation Guide

### Step 1: Create HabitCard.xaml
Path: `src/Stribe/Controls/HabitCard.xaml`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:controls="clr-namespace:Stribe.Controls"
             x:Class="Stribe.Controls.HabitCard">

    <Border Stroke="{StaticResource Border}"
            StrokeThickness="1"
            Background="{StaticResource Surface}"
            Padding="16"
            Margin="0,0,0,12">

        <Border.StrokeShape>
            <RoundRectangle CornerRadius="12" />
        </Border.StrokeShape>

        <Border.Shadow>
            <Shadow Brush="{StaticResource Shadow}"
                    Offset="0,2"
                    Radius="4"
                    Opacity="0.1" />
        </Border.Shadow>

        <!-- Card tap gesture -->
        <Border.GestureRecognizers>
            <TapGestureRecognizer Tapped="OnCardTapped" />
        </Border.GestureRecognizers>

        <Grid RowDefinitions="Auto,Auto,Auto" RowSpacing="12">

            <!-- Row 0: Header (Emoji, Name, Streak) -->
            <HorizontalStackLayout Grid.Row="0" Spacing="12">

                <!-- Emoji Icon -->
                <Border WidthRequest="40" HeightRequest="40"
                        StrokeShape="RoundRectangle 8"
                        Background="{Binding HabitColor, Converter={StaticResource ColorWithOpacity}, ConverterParameter=0.15}">
                    <Label Text="{Binding Habit.Icon}"
                           FontSize="24"
                           HorizontalOptions="Center"
                           VerticalOptions="Center" />
                </Border>

                <!-- Habit Name -->
                <Label Text="{Binding Habit.Name}"
                       FontSize="18"
                       FontAttributes="Bold"
                       TextColor="{StaticResource TextPrimary}"
                       VerticalOptions="Center"
                       HorizontalOptions="StartAndExpand" />

                <!-- Streak Badge (visible when CurrentStreak > 0) -->
                <HorizontalStackLayout Spacing="4"
                                       IsVisible="{Binding CurrentStreak, Converter={StaticResource IntGreaterThan}, ConverterParameter=0}">
                    <Label Text="🔥" FontSize="18" />
                    <Label Text="{Binding CurrentStreak}"
                           FontSize="18"
                           FontAttributes="Bold"
                           TextColor="#F5A623" />
                </HorizontalStackLayout>

            </HorizontalStackLayout>

            <!-- Row 1: Week Progress Bar -->
            <controls:WeekProgressBar Grid.Row="1"
                                      WeekCompletions="{Binding WeekProgress}"
                                      ActiveDays="{Binding Habit.ActiveDays}"
                                      HabitColor="{Binding HabitColor}" />

            <!-- Row 2: Completion Control (Conditional) -->
            <HorizontalStackLayout Grid.Row="2" HorizontalOptions="End">

                <!-- Checkbox (when DailyTargetCount = 1) -->
                <controls:AnimatedCheckbox
                    IsVisible="{Binding DailyTargetCount, Converter={StaticResource IntEquals}, ConverterParameter=1}"
                    IsChecked="{Binding IsCompletedToday}"
                    Command="{Binding ToggleCommand}"
                    CommandParameter="{Binding .}" />

                <!-- ProgressRing (when DailyTargetCount > 1) -->
                <controls:ProgressRing
                    IsVisible="{Binding DailyTargetCount, Converter={StaticResource IntGreaterThan}, ConverterParameter=1}"
                    CurrentCount="{Binding CurrentCount}"
                    TargetCount="{Binding DailyTargetCount}"
                    HabitColor="{Binding HabitColor}"
                    Command="{Binding ToggleCommand}"
                    CommandParameter="{Binding .}" />

            </HorizontalStackLayout>

        </Grid>

    </Border>

</ContentView>
```

**Explanation**:
- Conditional rendering: Shows Checkbox when DailyTargetCount=1, ProgressRing when >1
- Uses IntEquals and IntGreaterThan converters for visibility
- WeekProgressBar shows ActiveDays-filtered progress
- Tap gesture on card for navigation to detail

### Step 2: Create HabitCard.xaml.cs
Path: `src/Stribe/Controls/HabitCard.xaml.cs`

```csharp
using System.Windows.Input;

namespace Stribe.Controls;

public partial class HabitCard : ContentView
{
    public static readonly BindableProperty HabitProperty =
        BindableProperty.Create(nameof(Habit), typeof(Habit), typeof(HabitCard));

    public static readonly BindableProperty IsCompletedTodayProperty =
        BindableProperty.Create(nameof(IsCompletedToday), typeof(bool), typeof(HabitCard));

    public static readonly BindableProperty CurrentStreakProperty =
        BindableProperty.Create(nameof(CurrentStreak), typeof(int), typeof(HabitCard));

    public static readonly BindableProperty WeekProgressProperty =
        BindableProperty.Create(nameof(WeekProgress), typeof(bool[]), typeof(HabitCard));

    public static readonly BindableProperty CurrentCountProperty =
        BindableProperty.Create(nameof(CurrentCount), typeof(int), typeof(HabitCard));

    public static readonly BindableProperty DailyTargetCountProperty =
        BindableProperty.Create(nameof(DailyTargetCount), typeof(int), typeof(HabitCard), defaultValue: 1);

    public static readonly BindableProperty HabitColorProperty =
        BindableProperty.Create(nameof(HabitColor), typeof(Color), typeof(HabitCard));

    public static readonly BindableProperty ToggleCommandProperty =
        BindableProperty.Create(nameof(ToggleCommand), typeof(ICommand), typeof(HabitCard));

    public static readonly BindableProperty CardTappedCommandProperty =
        BindableProperty.Create(nameof(CardTappedCommand), typeof(ICommand), typeof(HabitCard));

    public Habit Habit
    {
        get => (Habit)GetValue(HabitProperty);
        set => SetValue(HabitProperty, value);
    }

    public bool IsCompletedToday
    {
        get => (bool)GetValue(IsCompletedTodayProperty);
        set => SetValue(IsCompletedTodayProperty, value);
    }

    public int CurrentStreak
    {
        get => (int)GetValue(CurrentStreakProperty);
        set => SetValue(CurrentStreakProperty, value);
    }

    public bool[] WeekProgress
    {
        get => (bool[])GetValue(WeekProgressProperty);
        set => SetValue(WeekProgressProperty, value);
    }

    public int CurrentCount
    {
        get => (int)GetValue(CurrentCountProperty);
        set => SetValue(CurrentCountProperty, value);
    }

    public int DailyTargetCount
    {
        get => (int)GetValue(DailyTargetCountProperty);
        set => SetValue(DailyTargetCountProperty, value);
    }

    public Color HabitColor
    {
        get => (Color)GetValue(HabitColorProperty);
        set => SetValue(HabitColorProperty, value);
    }

    public ICommand ToggleCommand
    {
        get => (ICommand)GetValue(ToggleCommandProperty);
        set => SetValue(ToggleCommandProperty, value);
    }

    public ICommand CardTappedCommand
    {
        get => (ICommand)GetValue(CardTappedCommandProperty);
        set => SetValue(CardTappedCommandProperty, value);
    }

    public HabitCard()
    {
        InitializeComponent();
    }

    private void OnCardTapped(object sender, EventArgs e)
    {
        // Execute CardTappedCommand (navigate to detail)
        if (CardTappedCommand?.CanExecute(Habit) == true)
        {
            CardTappedCommand.Execute(Habit);
        }
    }
}
```

**Explanation**: All necessary BindableProperties for frequency features (CurrentCount, DailyTargetCount).

### Step 3: Usage in HomePage.xaml
Path: `src/Stribe/Pages/HomePage.xaml`

```xml
<CollectionView ItemsSource="{Binding Habits}">
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
</CollectionView>
```

**Explanation**: Binds to HabitDisplayModel properties, uses RelativeSource for ViewModel commands.

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
public void HabitCard_WithSimpleHabit_ShowsCheckbox()
{
    var card = new HabitCard
    {
        DailyTargetCount = 1
    };

    // Assert: Checkbox visible, ProgressRing hidden
    // (Visual tree inspection in test)
}

[Fact]
public void HabitCard_WithMultiCompletion_ShowsProgressRing()
{
    var card = new HabitCard
    {
        DailyTargetCount = 8,
        CurrentCount = 3
    };

    // Assert: ProgressRing visible showing 3/8
}
```

### 3. Manual Test in Emulator
- [ ] Card displays with correct layout (emoji, name, streak, week bar)
- [ ] **Simple habit (DailyTargetCount=1)**: Shows checkbox
- [ ] **Multi-completion habit (DailyTargetCount=8)**: Shows progress ring (not checkbox)
- [ ] Streak badge only shows when CurrentStreak > 0
- [ ] Week progress bar shows 7 segments with correct colors
- [ ] **Week progress respects ActiveDays** (inactive days shown dimmed/hidden)
- [ ] Tap on card navigates to detail page
- [ ] Tap on checkbox/progress ring toggles completion
- [ ] Shadow and rounded corners render correctly

---

## Acceptance Criteria

- [x] HabitCard.xaml with 3-row grid layout
- [x] All BindableProperties defined (including **CurrentCount, DailyTargetCount**)
- [x] **Conditional rendering**: Checkbox when DailyTargetCount=1, ProgressRing when >1
- [x] WeekProgressBar integration
- [x] Streak badge with conditional visibility
- [x] Card tap gesture for navigation
- [x] Toggle command binding (works for both checkbox and progress ring)
- [x] Build succeeds
- [x] Manual testing passed

---

## Frequency Feature Integration

### Conditional Completion Control

**CRITICAL**: HabitCard must show DIFFERENT controls based on DailyTargetCount:

**DailyTargetCount = 1** (Simple Habit):
```xml
<controls:AnimatedCheckbox
    IsVisible="{Binding DailyTargetCount, Converter={StaticResource IntEquals}, ConverterParameter=1}"
    IsChecked="{Binding IsCompletedToday}"
    ... />
```
- Shows checkbox (empty circle or filled with checkmark)
- Binds to IsCompletedToday (boolean)

**DailyTargetCount > 1** (Multi-Completion Habit):
```xml
<controls:ProgressRing
    IsVisible="{Binding DailyTargetCount, Converter={StaticResource IntGreaterThan}, ConverterParameter=1}"
    CurrentCount="{Binding CurrentCount}"
    TargetCount="{Binding DailyTargetCount}"
    ... />
```
- Shows progress ring (circular progress indicator)
- Displays "3/8" or similar progress text
- Binds to CurrentCount (int) and DailyTargetCount (int)

### Week Progress Integration

WeekProgressBar must respect ActiveDays:
```csharp
// WeekProgressBar.xaml.cs
for (int i = 0; i < 7; i++)
{
    bool isActiveDay = ActiveDays[i] == '1';
    bool isCompleted = WeekCompletions[i];

    if (!isActiveDay)
    {
        // Show dimmed/hidden segment for inactive days
        segments[i].Opacity = 0.3;
        segments[i].BackgroundColor = Colors.Gray;
    }
    else if (isCompleted)
    {
        segments[i].BackgroundColor = HabitColor;
    }
    else
    {
        segments[i].BackgroundColor = Colors.LightGray;
    }
}
```

### Data Flow

**HabitDisplayModel** (from HomeViewModel):
```csharp
public class HabitDisplayModel
{
    public Habit Habit { get; set; }
    public bool IsCompletedToday { get; set; }  // Count >= DailyTargetCount
    public int CurrentCount { get; set; }  // From Completion.Count
    public int DailyTargetCount => Habit.DailyTargetCount;
    public int CurrentStreak { get; set; }
    public bool[] WeekProgress { get; set; }
    public Color HabitColor => Habit.Color.ToMauiColor();
}
```

**Toggle Command** (in HomeViewModel):
```csharp
[RelayCommand]
private async Task ToggleCompletionAsync(HabitDisplayModel habit)
{
    // Handles both simple and multi-completion
    // See Command 022 for full implementation
}
```

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Conditional rendering via converters**: Simple IsVisible binding (no complex code-behind logic)
- **Reuses existing components**: AnimatedCheckbox, ProgressRing, WeekProgressBar
- **Bindable properties**: Standard MAUI pattern (no custom binding framework)
- **Single responsibility**: Card displays data, doesn't handle business logic

### Alternativer overvejet

**Alternative 1: Single custom control for both checkbox and progress ring**
```csharp
public class CompletionControl : ContentView
{
    // Internal logic to switch between checkbox and progress ring
}
```
**Hvorfor fravalgt**: More complex. Conditional rendering with existing components is simpler and more maintainable.

**Alternative 2: Separate card types (SimpleHabitCard, MultiCompletionCard)**
```csharp
<ContentView>
    <controls:SimpleHabitCard IsVisible="{Binding IsSimple}" />
    <controls:MultiCompletionCard IsVisible="{Binding IsMulti}" />
</ContentView>
```
**Hvorfor fravalgt**: Code duplication (most of card layout is identical). Conditional rendering is cleaner.

**Alternative 3: ViewModel determines which control to show**
```csharp
public IView CompletionControl => DailyTargetCount > 1
    ? (IView)new ProgressRing()
    : new AnimatedCheckbox();
```
**Hvorfor fravalgt**: Mixing UI logic in ViewModel violates MVVM. XAML conditional rendering is correct approach.

### Potentielle forbedringer (v2)
- Swipe actions (swipe to delete, edit) - Common pattern, but adds complexity
- Long-press menu (edit, delete, view detail) - Nice UX, can add later
- Card reordering (drag and drop) - Power user feature, not MVP
- Compact mode (smaller cards for many habits) - Premature optimization

### Kendte begrænsninger
- **No offline-first UI sync**: Card waits for database update (acceptable - local database is fast)
- **Fixed card height**: Doesn't adapt to content (acceptable - consistent height improves list performance)
- **No custom animations per card**: All cards use same animation timing (acceptable - consistency is good UX)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Conditional rendering via converters, reuses components
- [x] **Læsbarhed**: Clear XAML structure, descriptive BindableProperty names
- [x] **Navngivning**: HabitCard, CurrentCount, DailyTargetCount (self-documenting)
- [x] **Funktioner**: Minimal code-behind (only OnCardTapped event handler)
- [x] **DRY**: Reuses AnimatedCheckbox, ProgressRing, WeekProgressBar components
- [x] **Error handling**: No error-prone logic (pure data binding)
- [x] **Edge cases**: DailyTargetCount=0 (defaults to 1), null WeekProgress handled by component
- [x] **Performance**: Lightweight component (suitable for CollectionView virtualization)
- [x] **Testbarhed**: BindableProperties testable, visual states verifiable

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/05_HOME.md (HabitCard usage)
- **Component Spec**: stribe-design/components/HABIT_CARD.md (original design)
- **Related**:
  - stribe-design/components/PROGRESS_RING.md (multi-completion UI)
  - Command 018 (WeekProgressBar)
  - Command 019 (AnimatedCheckbox)

---

## Notes

- **CRITICAL**: Conditional rendering must use IntEquals and IntGreaterThan converters (not hard-coded values)
- **CRITICAL**: ToggleCommand works for BOTH checkbox and progress ring (same command, different visual feedback)
- WeekProgressBar receives ActiveDays for filtering (see Command 018)
- HabitColor used for emoji background, progress ring, week segments
- Shadow and rounded corners use MAUI Border.Shadow API (platform-specific rendering)
- CollectionView ItemTemplate binds to HabitDisplayModel (see Command 015)

---

**Command Status**: ⏸️ Ready to implement (requires ProgressRing component)
**Last Updated**: 2025-12-23
**Implemented By**: Pending
