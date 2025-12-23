# Progress Ring Component
## Multi-Completion Progress Indicator

**Component ID**: `ProgressRing`
**Version**: 1.1
**Used In**: Habit Cards, Habit Detail Page
**Replaces**: Simple checkbox (when DailyTargetCount > 1)

---

## Purpose

Visual indicator for habits that require multiple completions per day. Shows current progress toward daily target with an interactive ring that fills as user completes the habit multiple times.

**Example Use Cases**:
- "Drik 8 glas vand" → Shows 3/8
- "Træn 3 gange" → Shows 1/3
- "Mediter 2 gange" → Shows 0/2

---

## Visual Design

### Default State (Incomplete)
```
     ╭─────────╮
    ╱           ╲
   │   3  /  8   │   ← Current / Target
   │             │
   │  ████▒▒▒▒   │   ← Colored arc (3/8 = 37.5%)
   │             │
    ╲           ╱
     ╰─────────╯
```

### Complete State
```
     ╭─────────╮
    ╱  ███████  ╲
   │ ║         ║ │   ← Filled circle background
   │ ║    ✓    ║ │   ← Checkmark icon
   │ ║         ║ │
    ╲  ███████  ╱
     ╰─────────╯
```

---

## Specifications

### Dimensions

**Default Size**: 56x56 dp
```yaml
ring_diameter: 56dp
ring_stroke_width: 4dp
center_circle_diameter: 48dp  # (56 - 2*4)
```

**Size Variants**:
- **Small**: 44x44 dp (stroke: 3dp) - Compact views
- **Medium**: 56x56 dp (stroke: 4dp) - Default, Habit Cards
- **Large**: 72x72 dp (stroke: 5dp) - Habit Detail Page

### Colors

```csharp
// Ring background (unfilled portion)
BackgroundRing: Border (#E8E8EC)

// Ring foreground (filled portion)
ProgressRing: Habit.Color (dynamic, from model)

// Center circle (when complete)
CompletedBackground: Habit.Color (same as ring)

// Text
IncompleteText: TextSecondary (#4A4A68)
CompleteText: White (#FFFFFF)
```

### Typography

**Count Text** (Incomplete state):
- Format: "{current}/{target}"
- Font: Bold, 14sp
- Color: TextSecondary
- Alignment: Center

**Checkmark** (Complete state):
- Icon: ✓ (Unicode U+2713)
- Font Size: 24sp
- Color: White
- Alternative: Use icon asset for crisp rendering

---

## States

### 1. Empty (count = 0)
```xml
<ProgressRing
    Current="0"
    Target="8"
    Color="#4CAF50" />
```
- Ring: 0% filled (only background ring visible)
- Text: "0/8"
- Color: Gray ring, TextSecondary text

### 2. Partial (0 < count < target)
```xml
<ProgressRing
    Current="3"
    Target="8"
    Color="#4CAF50" />
```
- Ring: 37.5% filled (3/8)
- Text: "3/8"
- Color: Habit color ring, TextSecondary text

### 3. Complete (count >= target)
```xml
<ProgressRing
    Current="8"
    Target="8"
    Color="#4CAF50" />
```
- Ring: 100% filled
- Center: Filled circle with habit color
- Text: Checkmark icon (✓)
- Color: Habit color background, White icon

### 4. Over-Complete (count > target)
```xml
<ProgressRing
    Current="10"
    Target="8"
    Color="#4CAF50" />
```
- **Display**: Same as Complete state
- **Logic**: Treat as complete (don't show "10/8")
- **Behavior**: Next tap resets to 0

---

## Interaction

### Tap Behavior
```csharp
OnTapped()
{
    if (Current < Target)
        Current++;  // Increment
    else
        Current = 0;  // Reset (via ToggleCompletionAsync)

    AnimateProgressChange();
    TriggerHapticFeedback();
}
```

**Visual Feedback**:
1. **Tap Down**: Scale to 0.95 (50ms)
2. **Tap Up**: Scale to 1.0 (50ms) with bounce easing
3. **Progress Change**: Arc animates smoothly (200ms ease-out)
4. **Complete Transition**:
   - Ring completes fill (100ms)
   - Center circle fades in (100ms, delay 50ms)
   - Checkmark fades in (100ms, delay 100ms)

**Haptic Feedback** (Platform-specific):
- iOS: Light Impact
- Android: Perform Haptic Feedback (VIRTUAL_KEY)
- Trigger on every tap

### Accessibility
```xml
<ProgressRing
    AutomationProperties.Name="Drik vand, 3 af 8 gennemført"
    AutomationProperties.Hint="Tryk for at øge antal" />
```

**Screen Reader Announcements**:
- Incomplete: "{Habit name}, {current} af {target} gennemført"
- Complete: "{Habit name}, mål nået"
- On tap: "{new count} af {target}"

---

## XAML Implementation

### Component Structure
```xml
<!-- Controls/ProgressRing.xaml -->
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             x:Class="Stribe.Controls.ProgressRing"
             x:Name="Root">
    <Grid WidthRequest="{Binding Size}"
          HeightRequest="{Binding Size}">

        <!-- Background Ring (always visible) -->
        <GraphicsView x:Name="BackgroundRing" />

        <!-- Progress Ring (fills based on progress) -->
        <GraphicsView x:Name="ProgressArc" />

        <!-- Center Content -->
        <Grid x:Name="CenterContent">
            <!-- Text (when incomplete) -->
            <Label x:Name="CountText"
                   Text="{Binding CountDisplay}"
                   IsVisible="{Binding IsIncomplete}"
                   Style="{StaticResource ProgressRingText}" />

            <!-- Complete Circle + Checkmark (when complete) -->
            <Ellipse x:Name="CompleteCircle"
                     IsVisible="{Binding IsComplete}"
                     Fill="{Binding HabitColor}" />

            <Label x:Name="Checkmark"
                   Text="✓"
                   IsVisible="{Binding IsComplete}"
                   Style="{StaticResource ProgressRingCheckmark}" />
        </Grid>

        <!-- Tap Gesture -->
        <Grid.GestureRecognizers>
            <TapGestureRecognizer Tapped="OnTapped" />
        </Grid.GestureRecognizers>
    </Grid>
</ContentView>
```

### Code-Behind
```csharp
// Controls/ProgressRing.xaml.cs
public partial class ProgressRing : ContentView
{
    public static readonly BindableProperty CurrentProperty =
        BindableProperty.Create(nameof(Current), typeof(int), typeof(ProgressRing), 0,
            propertyChanged: OnProgressChanged);

    public static readonly BindableProperty TargetProperty =
        BindableProperty.Create(nameof(Target), typeof(int), typeof(ProgressRing), 1);

    public static readonly BindableProperty ColorProperty =
        BindableProperty.Create(nameof(Color), typeof(Color), typeof(ProgressRing),
            Colors.Green);

    public int Current
    {
        get => (int)GetValue(CurrentProperty);
        set => SetValue(CurrentProperty, value);
    }

    public int Target
    {
        get => (int)GetValue(TargetProperty);
        set => SetValue(TargetProperty, value);
    }

    public Color Color
    {
        get => (Color)GetValue(ColorProperty);
        set => SetValue(ColorProperty, value);
    }

    // Computed Properties
    public bool IsComplete => Current >= Target;
    public bool IsIncomplete => !IsComplete;
    public string CountDisplay => $"{Current}/{Target}";
    public double Progress => Target > 0 ? (double)Current / Target : 0;

    private async void OnTapped(object sender, EventArgs e)
    {
        // Scale animation
        await this.ScaleTo(0.95, 50);
        await this.ScaleTo(1.0, 50, Easing.BounceOut);

        // Trigger command (bound from parent)
        TapCommand?.Execute(null);

        // Haptic feedback
        HapticFeedback.Perform(HapticFeedbackType.Click);
    }

    private static void OnProgressChanged(BindableObject bindable, object oldValue, object newValue)
    {
        var control = (ProgressRing)bindable;
        control.AnimateProgress((int)oldValue, (int)newValue);
    }

    private void AnimateProgress(int from, int to)
    {
        var animation = new Animation(v => {
            DrawProgressRing(v);
        }, from / (double)Target, to / (double)Target);

        animation.Commit(this, "ProgressAnimation", length: 200, easing: Easing.CubicOut);
    }

    private void DrawProgressRing(double progress)
    {
        // Use GraphicsView.Drawable to draw arc
        // StartAngle: -90 (top)
        // SweepAngle: progress * 360
    }
}
```

---

## Integration Example

### In Habit Card
```xml
<!-- HabitCard.xaml -->
<Grid>
    <!-- ... other content ... -->

    <!-- Conditional rendering -->
    <CheckBox IsVisible="{Binding IsSimpleHabit}"
              IsChecked="{Binding IsCompleted}" />

    <controls:ProgressRing IsVisible="{Binding IsMultiCompletion}"
                           Current="{Binding CompletionCount}"
                           Target="{Binding Habit.DailyTargetCount}"
                           Color="{Binding Habit.Color}"
                           TapCommand="{Binding ToggleCommand}" />
</Grid>
```

### ViewModel Binding
```csharp
public bool IsSimpleHabit => Habit.DailyTargetCount == 1;
public bool IsMultiCompletion => Habit.DailyTargetCount > 1;

public int CompletionCount { get; set; }  // From Completion.Count

[RelayCommand]
private async Task Toggle()
{
    await _habitService.ToggleCompletionAsync(Habit.Id, SelectedDate);
    // Refresh CompletionCount
}
```

---

## Animation Specs

### Progress Change Animation
```yaml
Duration: 200ms
Easing: CubicOut
Property: SweepAngle (0-360 degrees)
Trigger: When Current value changes
```

### Complete State Transition
```yaml
Sequence:
  1. Ring fills to 100% (100ms, CubicOut)
  2. Center circle fades in (100ms, delay 50ms)
  3. Checkmark scales in (150ms, delay 100ms, BounceOut)
```

### Tap Feedback
```yaml
Scale Down: 1.0 → 0.95 (50ms, Linear)
Scale Up: 0.95 → 1.0 (50ms, BounceOut)
```

---

## Platform Considerations

### iOS
- Use CAShapeLayer for smooth ring rendering
- Core Haptics for feedback
- Accessibility via UIAccessibility

### Android
- Use Canvas.drawArc() for ring
- VibrationEffect for haptics
- TalkBack support via contentDescription

### Windows
- Use SkiaSharp for consistent rendering
- No haptic feedback (desktop)
- Narrator support

---

## Performance Optimization

**Keep It Simple**:
- Use GraphicsView (built-in .NET MAUI)
- Avoid complex gradient fills (solid colors only)
- Cache color conversions
- Limit animation complexity

**If Performance Issues**:
- Consider SkiaSharp for better control
- Reduce animation duration to 150ms
- Disable animations on low-end devices

---

## Testing Checklist

- [ ] Tap increments count correctly (1 → 2 → 3 → ...)
- [ ] Reaching target shows complete state
- [ ] Tapping when complete resets to 0
- [ ] Progress ring fills smoothly
- [ ] Colors match habit color
- [ ] Haptic feedback works (iOS/Android)
- [ ] Accessibility labels are correct
- [ ] Screen reader announces changes
- [ ] Works with different sizes (Small, Medium, Large)
- [ ] Edge case: Target = 1 (should use checkbox instead)
- [ ] Edge case: Target = 99 (maximum value)

---

## Code Quality Notes

### KISS Compliance
- ✅ Simple increment/reset logic (no complex state machine)
- ✅ Direct rendering (no over-abstraction)
- ✅ Minimal animation (just progress arc)

### Alternatives Rejected
- ❌ Swipe gestures for decrement (too complex)
- ❌ Long-press for bulk increment (unnecessary)
- ❌ Percentage display instead of fraction (less clear)

### Future Enhancements (v2)
- Confetti animation on reaching target
- Different ring styles (dashed, dotted)
- Custom icons instead of checkmark

---

**Component Status**: ⏸️ Ready for implementation
**Dependencies**: None (standalone component)
**Estimated Implementation**: 2-3 hours
