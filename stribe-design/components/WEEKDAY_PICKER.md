# Weekday Picker Component
## Ugedag-vælger til Vane Frekvens

**Component ID**: `WeekdayPicker`
**Version**: 1.1
**Used In**: Add Habit Page, Edit Habit Page, Onboarding
**Output**: ActiveDays string (bitmask "1111111")

---

## Purpose

Lad bruger vælge hvilke ugedage en vane gælder. Understøtter custom selection (individual days) og quick-select presets (hver dag, hverdage, weekend).

---

## Visual Design

```
┌─────────────────────────────────────┐
│ Hvilke dage?                        │
├─────────────────────────────────────┤
│                                     │
│  ┌───┬───┬───┬───┬───┬───┬───┐     │
│  │ M │ T │ O │ T │ F │ L │ S │     │
│  │ ● │ ● │ ○ │ ● │ ● │ ○ │ ○ │     │
│  └───┴───┴───┴───┴───┴───┴───┘     │
│                                     │
│  [Hver dag] [Hverdage] [Weekend]   │
│                                     │
└─────────────────────────────────────┘
```

---

## Specifications

### Day Toggle Buttons

**Layout**:
- Grid: 7 columns, equal width
- Spacing: 4dp gap between buttons
- Width: Each button = (Container width - 6*4dp) / 7
- Height: 60dp

**Individual Button**:
```
Size: 44-52dp width (auto), 60dp height
Padding: 8dp vertical, 4dp horizontal

Structure:
  ┌─────┐
  │  M  │  ← Label (top, 12sp, bold)
  │  ●  │  ← Indicator (bottom, 24sp)
  └─────┘
```

**States**:

**Selected**:
- Background: Primary color (#2D5A4A)
- Border: None
- Label: White, Bold, 12sp
- Indicator: ● (filled circle), White, 24sp
- Border radius: 8dp

**Unselected**:
- Background: Transparent
- Border: 1.5dp, Border color (#E8E8EC)
- Label: TextSecondary (#4A4A68), Bold, 12sp
- Indicator: ○ (empty circle), TextTertiary, 24sp
- Border radius: 8dp

**Disabled** (when trying to deselect last day):
- Same as Selected but with Opacity: 0.5
- Tap has no effect

**Labels**:
- M = Mandag (Monday)
- T = Tirsdag (Tuesday)
- O = Onsdag (Wednesday)
- T = Torsdag (Thursday)
- F = Fredag (Friday)
- L = Lørdag (Saturday)
- S = Søndag (Sunday)

### Quick-Select Buttons

**Layout**:
- Horizontal row, 3 buttons
- Spacing: 8dp gap
- Margin top: 12dp from day buttons

**Button Style**:
- Type: Outlined chip / Secondary button
- Height: 36dp
- Padding: 12dp horizontal, 8dp vertical
- Border radius: 18dp (pill shape)
- Border: 1.5dp, TextSecondary color
- Font: Medium, 14sp

**Labels**:
1. "Hver dag" → Sets `"1111111"`
2. "Hverdage" → Sets `"1111100"`
3. "Weekend" → Sets `"0000011"`

**Behavior**:
- Tap overrides current selection
- All 7 day buttons update to match preset
- Animation: Day buttons scale + fade to new state (150ms)

---

## Data Binding

### Input/Output
```csharp
// ActiveDays string (bitmask)
public string ActiveDays { get; set; } = "1111111";

// Example values:
// "1111111" = Hver dag (Mon-Sun)
// "1111100" = Hverdage (Mon-Fri)
// "0000011" = Weekend (Sat-Sun)
// "1010100" = Mon, Wed, Fri
```

### Conversion Logic
```csharp
// Get day state
public bool IsDayActive(int dayIndex)
{
    return ActiveDays[dayIndex] == '1';
}

// Set day state
public void SetDayActive(int dayIndex, bool isActive)
{
    var chars = ActiveDays.ToCharArray();
    chars[dayIndex] = isActive ? '1' : '0';
    ActiveDays = new string(chars);
}

// Day index mapping
// 0 = Monday, 1 = Tuesday, ... 6 = Sunday
```

---

## Interaction

### Toggle Individual Day
```csharp
OnDayTapped(int dayIndex)
{
    // Count currently selected days
    int selectedCount = ActiveDays.Count(c => c == '1');

    // Don't allow deselecting if only 1 day left
    if (selectedCount == 1 && IsDayActive(dayIndex))
    {
        ShowToast("Mindst én dag skal være valgt");
        return;
    }

    // Toggle day
    bool newState = !IsDayActive(dayIndex);
    SetDayActive(dayIndex, newState);

    // Animate
    AnimateDayButton(dayIndex, newState);

    // Raise PropertyChanged
    OnPropertyChanged(nameof(ActiveDays));
}
```

### Quick-Select
```csharp
OnQuickSelectTapped(string preset)
{
    string newActiveDays = preset switch
    {
        "Hver dag" => "1111111",
        "Hverdage" => "1111100",
        "Weekend" => "0000011",
        _ => ActiveDays
    };

    // Animate all buttons
    for (int i = 0; i < 7; i++)
    {
        bool newState = newActiveDays[i] == '1';
        AnimateDayButton(i, newState, delay: i * 30);  // Stagger animation
    }

    ActiveDays = newActiveDays;
    OnPropertyChanged(nameof(ActiveDays));
}
```

### Validation
```csharp
public bool IsValid()
{
    // At least 1 day must be selected
    return ActiveDays.Contains('1');
}
```

---

## XAML Implementation

```xml
<!-- Controls/WeekdayPicker.xaml -->
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             x:Class="Stribe.Controls.WeekdayPicker">
    <VerticalStackLayout Spacing="12">

        <!-- Day Toggle Buttons -->
        <Grid ColumnDefinitions="*,*,*,*,*,*,*" ColumnSpacing="4">
            <Button Grid.Column="0" x:Name="BtnMonday" Text="M"
                    Clicked="OnDayTapped" StyleClass="WeekdayButton" />
            <Button Grid.Column="1" x:Name="BtnTuesday" Text="T"
                    Clicked="OnDayTapped" StyleClass="WeekdayButton" />
            <Button Grid.Column="2" x:Name="BtnWednesday" Text="O"
                    Clicked="OnDayTapped" StyleClass="WeekdayButton" />
            <Button Grid.Column="3" x:Name="BtnThursday" Text="T"
                    Clicked="OnDayTapped" StyleClass="WeekdayButton" />
            <Button Grid.Column="4" x:Name="BtnFriday" Text="F"
                    Clicked="OnDayTapped" StyleClass="WeekdayButton" />
            <Button Grid.Column="5" x:Name="BtnSaturday" Text="L"
                    Clicked="OnDayTapped" StyleClass="WeekdayButton" />
            <Button Grid.Column="6" x:Name="BtnSunday" Text="S"
                    Clicked="OnDayTapped" StyleClass="WeekdayButton" />
        </Grid>

        <!-- Quick-Select Buttons -->
        <HorizontalStackLayout Spacing="8" HorizontalOptions="Center">
            <Button Text="Hver dag" Clicked="OnQuickSelectEveryDay"
                    StyleClass="QuickSelectButton" />
            <Button Text="Hverdage" Clicked="OnQuickSelectWeekdays"
                    StyleClass="QuickSelectButton" />
            <Button Text="Weekend" Clicked="OnQuickSelectWeekend"
                    StyleClass="QuickSelectButton" />
        </HorizontalStackLayout>

    </VerticalStackLayout>
</ContentView>
```

### Styles
```xml
<!-- Styles.xaml -->
<Style x:Key="WeekdayButton" TargetType="Button">
    <Setter Property="HeightRequest" Value="60" />
    <Setter Property="FontAttributes" Value="Bold" />
    <Setter Property="FontSize" Value="12" />
    <Setter Property="CornerRadius" Value="8" />
    <Setter Property="BorderWidth" Value="1.5" />
    <!-- Dynamic background/border based on state -->
</Style>

<Style x:Key="QuickSelectButton" TargetType="Button">
    <Setter Property="HeightRequest" Value="36" />
    <Setter Property="FontSize" Value="14" />
    <Setter Property="CornerRadius" Value="18" />
    <Setter Property="BackgroundColor" Value="Transparent" />
    <Setter Property="BorderColor" Value="{StaticResource TextSecondary}" />
    <Setter Property="BorderWidth" Value="1.5" />
    <Setter Property="TextColor" Value="{StaticResource TextSecondary}" />
    <Setter Property="Padding" Value="12,8" />
</Style>
```

---

## Animations

### Day Toggle Animation
```csharp
async Task AnimateDayButton(Button button, bool toSelected, int delay = 0)
{
    await Task.Delay(delay);

    // Scale down
    await button.ScaleTo(0.9, 50);

    // Update visual state
    if (toSelected)
    {
        button.BackgroundColor = Colors.Primary;
        button.TextColor = Colors.White;
        button.BorderColor = Colors.Primary;
    }
    else
    {
        button.BackgroundColor = Colors.Transparent;
        button.TextColor = Colors.TextSecondary;
        button.BorderColor = Colors.Border;
    }

    // Scale up with bounce
    await button.ScaleTo(1.0, 100, Easing.SpringOut);
}
```

### Quick-Select Cascade
```csharp
async Task AnimateQuickSelect(string newActiveDays)
{
    var buttons = new[] { BtnMonday, BtnTuesday, BtnWednesday,
                          BtnThursday, BtnFriday, BtnSaturday, BtnSunday };

    for (int i = 0; i < 7; i++)
    {
        bool newState = newActiveDays[i] == '1';
        _ = AnimateDayButton(buttons[i], newState, delay: i * 30);
    }
}
```

---

## Accessibility

```xml
<Button AutomationProperties.Name="Mandag"
        AutomationProperties.Hint="Tryk for at vælge eller fravælge mandag"
        AutomationProperties.IsInAccessibleTree="True" />
```

**Screen Reader Announcements**:
- Selected: "Mandag, valgt"
- Unselected: "Mandag, ikke valgt"
- On toggle: "Mandag valgt" eller "Mandag fravalgt"
- Quick-select: "Hver dag valgt" / "Hverdage valgt"

---

## Integration Example

### In Add Habit Page
```xml
<VerticalStackLayout>
    <Label Text="Hvilke dage?" Style="{StaticResource SectionHeader}" />

    <controls:WeekdayPicker ActiveDays="{Binding Habit.ActiveDays, Mode=TwoWay}" />
</VerticalStackLayout>
```

### ViewModel
```csharp
public partial class AddHabitViewModel : BaseViewModel
{
    [ObservableProperty]
    private Habit habit = new();

    // ActiveDays automatically binds to Habit.ActiveDays
    // Default is "1111111" (every day)
}
```

---

## Validation & Error Handling

### Edge Cases
1. **All days deselected**: Prevent (keep last day selected)
2. **Invalid bitmask**: Fallback to "1111111"
3. **Null ActiveDays**: Initialize to "1111111"

```csharp
public string ActiveDays
{
    get => _activeDays ?? "1111111";
    set
    {
        // Validate
        if (string.IsNullOrEmpty(value) || value.Length != 7)
            value = "1111111";

        if (!value.Contains('1'))  // No days selected
            value = "1111111";  // Fallback to all days

        _activeDays = value;
        OnPropertyChanged();
    }
}
```

---

## Testing Checklist

- [ ] Tap toggles day correctly
- [ ] Cannot deselect last remaining day
- [ ] "Hver dag" selects all 7 days
- [ ] "Hverdage" selects Mon-Fri (1111100)
- [ ] "Weekend" selects Sat-Sun (0000011)
- [ ] Quick-select animates smoothly
- [ ] ActiveDays binding works two-way
- [ ] Default is all days selected
- [ ] Accessibility labels read correctly
- [ ] Screen reader announces changes
- [ ] Toast shown when trying to deselect last day

---

## Code Quality Notes

### KISS Compliance
- ✅ Simple string bitmask (no complex data structure)
- ✅ Direct button array (no over-abstraction)
- ✅ Clear toggle logic (boolean flip)

### Alternatives Rejected
- ❌ CheckBox instead of custom buttons (less visual appeal)
- ❌ Swipe to select range (too complex)
- ❌ Calendar-style picker (overkill)
- ❌ Separate component per day (code duplication)

### Future Enhancements (v2)
- Custom preset creation ("Mine vaner")
- Bi-weekly patterns (every other Monday)
- Exception dates (skip specific days)

---

**Component Status**: ⏸️ Ready for implementation
**Dependencies**: None
**Estimated Implementation**: 2-3 hours
