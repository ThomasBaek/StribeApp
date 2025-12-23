# Daily Target Picker Component
## Stepper til Daglige Gentagelser

**Component ID**: `DailyTargetPicker`
**Version**: 1.1
**Used In**: Add Habit Page, Edit Habit Page, Onboarding
**Output**: DailyTargetCount int (1-99)

---

## Purpose

Lad bruger vælge hvor mange gange per dag en vane skal gennemføres. Simple stepper interface med +/- buttons.

---

## Visual Design

```
┌─────────────────────────────────┐
│ Hvor mange gange om dagen?      │
├─────────────────────────────────┤
│                                 │
│      [ − ]    8    [ + ]        │
│                                 │
│   (Fx: 8 glas vand, 3 træninger)│
└─────────────────────────────────┘
```

---

## Specifications

### Layout
```
Horizontal Stack:
  [−]  <-- 48dp --> [Value] <-- 48dp --> [+]
      12dp spacing         12dp spacing

Total width: ~200dp (centered in container)
Height: 56dp
```

### Minus Button (Decrement)
```
Size: 48x48 dp (minimum touch target)
Shape: Circle
Background: Transparent → Primary on press
Border: 2dp, Primary color
Icon: "−" (minus sign)
  - Font: Bold, 24sp
  - Color: Primary

States:
  - Normal: Border visible, icon Primary color
  - Pressed: Scale 0.95, ripple effect
  - Disabled: Opacity 0.3 (when value = 1)
```

### Value Display
```
Width: 80dp
Height: 56dp
Font: Display (32sp, Bold)
Color: TextPrimary
Alignment: Center
Background: Surface with subtle border (1dp, Border color)
Border Radius: 8dp
```

### Plus Button (Increment)
```
Size: 48x48 dp
Shape: Circle
Background: Transparent → Primary on press
Border: 2dp, Primary color
Icon: "+" (plus sign)
  - Font: Bold, 24sp
  - Color: Primary

States:
  - Normal: Border visible, icon Primary color
  - Pressed: Scale 0.95, ripple effect
  - Disabled: Opacity 0.3 (when value = 99)
```

### Help Text (Optional)
```
Text: "(Fx: 8 glas vand, 3 træninger)"
Font: Caption (14sp, Regular)
Color: TextTertiary
Margin top: 8dp
Visibility: Only shown when value > 1
```

---

## Data Binding

```csharp
public int DailyTargetCount { get; set; } = 1;

// Range: 1-99
// Default: 1
```

---

## Interaction

### Decrement (Minus Button)
```csharp
OnDecrementTapped()
{
    if (DailyTargetCount > 1)
    {
        DailyTargetCount--;
        AnimateValueChange();
        UpdateButtonStates();
        OnPropertyChanged(nameof(DailyTargetCount));
    }
    else
    {
        // Visual feedback: shake animation
        ShakeAnimation();
    }
}
```

### Increment (Plus Button)
```csharp
OnIncrementTapped()
{
    if (DailyTargetCount < 99)
    {
        DailyTargetCount++;
        AnimateValueChange();
        UpdateButtonStates();
        OnPropertyChanged(nameof(DailyTargetCount));
    }
    else
    {
        // Visual feedback: shake animation
        ShakeAnimation();
    }
}
```

### Button State Management
```csharp
UpdateButtonStates()
{
    MinusButton.IsEnabled = (DailyTargetCount > 1);
    MinusButton.Opacity = MinusButton.IsEnabled ? 1.0 : 0.3;

    PlusButton.IsEnabled = (DailyTargetCount < 99);
    PlusButton.Opacity = PlusButton.IsEnabled ? 1.0 : 0.3;
}
```

---

## XAML Implementation

```xml
<!-- Controls/DailyTargetPicker.xaml -->
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             x:Class="Stribe.Controls.DailyTargetPicker">
    <VerticalStackLayout Spacing="8" HorizontalOptions="Center">

        <!-- Stepper -->
        <HorizontalStackLayout Spacing="12" HorizontalOptions="Center">

            <!-- Minus Button -->
            <Border x:Name="MinusButton"
                    WidthRequest="48" HeightRequest="48"
                    StrokeShape="RoundRectangle 24"
                    Stroke="{StaticResource Primary}"
                    StrokeThickness="2"
                    Background="Transparent">
                <Border.GestureRecognizers>
                    <TapGestureRecognizer Tapped="OnDecrementTapped" />
                </Border.GestureRecognizers>
                <Label Text="−"
                       FontSize="24"
                       FontAttributes="Bold"
                       TextColor="{StaticResource Primary}"
                       HorizontalOptions="Center"
                       VerticalOptions="Center" />
            </Border>

            <!-- Value Display -->
            <Border WidthRequest="80" HeightRequest="56"
                    StrokeShape="RoundRectangle 8"
                    Stroke="{StaticResource Border}"
                    StrokeThickness="1"
                    Background="{StaticResource Surface}">
                <Label x:Name="ValueLabel"
                       Text="{Binding DailyTargetCount}"
                       FontSize="32"
                       FontAttributes="Bold"
                       TextColor="{StaticResource TextPrimary}"
                       HorizontalOptions="Center"
                       VerticalOptions="Center" />
            </Border>

            <!-- Plus Button -->
            <Border x:Name="PlusButton"
                    WidthRequest="48" HeightRequest="48"
                    StrokeShape="RoundRectangle 24"
                    Stroke="{StaticResource Primary}"
                    StrokeThickness="2"
                    Background="Transparent">
                <Border.GestureRecognizers>
                    <TapGestureRecognizer Tapped="OnIncrementTapped" />
                </Border.GestureRecognizers>
                <Label Text="+"
                       FontSize="24"
                       FontAttributes="Bold"
                       TextColor="{StaticResource Primary}"
                       HorizontalOptions="Center"
                       VerticalOptions="Center" />
            </Border>

        </HorizontalStackLayout>

        <!-- Help Text -->
        <Label x:Name="HelpText"
               Text="(Fx: 8 glas vand, 3 træninger)"
               IsVisible="{Binding ShowHelpText}"
               FontSize="14"
               TextColor="{StaticResource TextTertiary}"
               HorizontalOptions="Center" />

    </VerticalStackLayout>
</ContentView>
```

---

## Animations

### Value Change Animation
```csharp
async Task AnimateValueChange()
{
    // Scale up briefly
    await ValueLabel.ScaleTo(1.2, 100, Easing.CubicOut);
    await ValueLabel.ScaleTo(1.0, 100, Easing.CubicIn);
}
```

### Button Press Animation
```csharp
async Task AnimateButtonPress(Border button)
{
    await button.ScaleTo(0.95, 50);
    await button.ScaleTo(1.0, 50, Easing.SpringOut);
}
```

### Boundary Shake Animation
```csharp
async Task ShakeAnimation(Border button)
{
    await button.TranslateTo(-8, 0, 50);
    await button.TranslateTo(8, 0, 50);
    await button.TranslateTo(-4, 0, 50);
    await button.TranslateTo(0, 0, 50);
}
```

---

## Accessibility

```xml
<Border AutomationProperties.Name="Reducer dagligt mål"
        AutomationProperties.Hint="Tryk for at reducere antal daglige gentagelser"
        AutomationProperties.IsInAccessibleTree="True" />

<Label AutomationProperties.Name="{Binding DailyTargetCount, StringFormat='{0} gange per dag'}"
       AutomationProperties.IsInAccessibleTree="True" />

<Border AutomationProperties.Name="Forøg dagligt mål"
        AutomationProperties.Hint="Tryk for at øge antal daglige gentagelser"
        AutomationProperties.IsInAccessibleTree="True" />
```

**Screen Reader Announcements**:
- Value changed: "{number} gange per dag"
- At minimum: "Minimum nået, 1 gang per dag"
- At maximum: "Maximum nået, 99 gange per dag"

---

## Integration Example

### In Add Habit Page
```xml
<VerticalStackLayout>
    <Label Text="Hvor ofte?" Style="{StaticResource SectionHeader}" />

    <controls:DailyTargetPicker DailyTargetCount="{Binding Habit.DailyTargetCount, Mode=TwoWay}" />
</VerticalStackLayout>
```

### ViewModel
```csharp
public partial class AddHabitViewModel : BaseViewModel
{
    [ObservableProperty]
    private Habit habit = new();

    // DailyTargetCount automatically binds to Habit.DailyTargetCount
    // Default is 1
}
```

---

## Validation

```csharp
public int DailyTargetCount
{
    get => _dailyTargetCount;
    set
    {
        // Clamp to valid range
        if (value < 1) value = 1;
        if (value > 99) value = 99;

        SetProperty(ref _dailyTargetCount, value);
    }
}
```

---

## Alternative Input (Future Enhancement)

### Direct Number Input
```xml
<!-- Optional: Allow direct text input -->
<Entry Keyboard="Numeric"
       Text="{Binding DailyTargetCount}"
       MaxLength="2"
       Placeholder="1-99" />
```

**Note**: Keep stepper as primary interface (simpler UX), but could add direct input for power users in v2.

---

## Testing Checklist

- [ ] Minus decrements from 2 to 1
- [ ] Minus disabled at 1 (cannot go to 0)
- [ ] Plus increments from 1 to 2
- [ ] Plus disabled at 99 (cannot go to 100)
- [ ] Value displays correctly (1-99)
- [ ] Buttons animate on tap
- [ ] Shake animation at boundaries
- [ ] Help text shows when value > 1
- [ ] Help text hides when value = 1
- [ ] Binding works two-way
- [ ] Default value is 1
- [ ] Accessibility labels read correctly
- [ ] Screen reader announces value changes

---

## Code Quality Notes

### KISS Compliance
- ✅ Simple increment/decrement logic
- ✅ No complex input validation (just range clamp)
- ✅ Clear visual feedback (scale + shake)

### Alternatives Rejected
- ❌ Slider (less precise, harder to hit exact values)
- ❌ Number keyboard input (more steps, validation complexity)
- ❌ Gesture-based (swipe up/down) - less discoverable
- ❌ Picker wheel - overkill for 1-99 range

### Future Enhancements (v2)
- Long-press for rapid increment/decrement
- Suggested values (1, 3, 5, 8) as quick-tap chips
- Voice input: "8 gange"

---

**Component Status**: ⏸️ Ready for implementation
**Dependencies**: None
**Estimated Implementation**: 1-2 hours
