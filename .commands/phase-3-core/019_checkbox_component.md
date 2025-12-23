# Command 019: Checkbox Component with Animation

## Metadata
- **Phase**: 3 - Core Experience
- **Dependencies**: None
- **Estimated Time**: 3 hours
- **Status**: Pending
- **Design Reference**: stribe-design/components/HABIT_CARD.md (Checkbox section)
- **Frequency Impact**: YES - Used conditionally (only when DailyTargetCount = 1)

---

## Formål

Implementere animated checkbox component til habit completion med smooth scale og color transition animations.

**Hvorfor dette er vigtigt:**
- Core UI component for simple habits (DailyTargetCount = 1)
- Smooth animations give instant user feedback
- Reusable component across app
- **Note**: For habits med DailyTargetCount > 1, ProgressRing component bruges i stedet

## Risici
- **Lav risiko**: Standalone animated control
- **Opmærksomhed**:
  - Animation skal være smooth (ikke laggy)
  - Tap area skal være stort nok (min 44dp)
  - Visual feedback skal være tydelig

## Analyse

### Hvad skal implementeres
Animated checkbox med:
- Unchecked state: Empty circle with border
- Checked state: Filled circle with checkmark
- Scale animation on tap (bounce effect)
- Color transition animation
- Command binding for toggle

### Filer der oprettes
- `src/Stribe/Controls/AnimatedCheckbox.xaml` - Component
- `src/Stribe/Controls/AnimatedCheckbox.xaml.cs` - Animation logic

## Dependencies Check
✅ Ingen dependencies
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Implementer Animated Checkbox component:

**Opret Controls/AnimatedCheckbox.xaml**:
```xaml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="Stribe.Controls.AnimatedCheckbox"
             HeightRequest="44"
             WidthRequest="44">

    <Grid>
        <!-- Unchecked Circle -->
        <Border x:Name="UncheckedBorder"
                WidthRequest="32"
                HeightRequest="32"
                StrokeThickness="2"
                Stroke="{StaticResource Primary}"
                BackgroundColor="Transparent"
                HorizontalOptions="Center"
                VerticalOptions="Center">
            <Border.StrokeShape>
                <Ellipse />
            </Border.StrokeShape>
        </Border>

        <!-- Checked Circle with Checkmark -->
        <Border x:Name="CheckedBorder"
                WidthRequest="32"
                HeightRequest="32"
                StrokeThickness="0"
                BackgroundColor="{StaticResource Primary}"
                HorizontalOptions="Center"
                VerticalOptions="Center"
                Opacity="0"
                Scale="0.8">
            <Border.StrokeShape>
                <Ellipse />
            </Border.StrokeShape>

            <Label Text="✓"
                   TextColor="White"
                   FontSize="20"
                   FontAttributes="Bold"
                   HorizontalOptions="Center"
                   VerticalOptions="Center" />
        </Border>

        <!-- Tap area -->
        <Grid.GestureRecognizers>
            <TapGestureRecognizer Tapped="OnTapped" />
        </Grid.GestureRecognizers>
    </Grid>
</ContentView>
```

**Opret Controls/AnimatedCheckbox.xaml.cs**:
```csharp
namespace Stribe.Controls;

public partial class AnimatedCheckbox : ContentView
{
    public static readonly BindableProperty IsCheckedProperty =
        BindableProperty.Create(
            nameof(IsChecked),
            typeof(bool),
            typeof(AnimatedCheckbox),
            false,
            BindingMode.TwoWay,
            propertyChanged: OnIsCheckedChanged);

    public static readonly BindableProperty CommandProperty =
        BindableProperty.Create(
            nameof(Command),
            typeof(ICommand),
            typeof(AnimatedCheckbox));

    public static readonly BindableProperty CommandParameterProperty =
        BindableProperty.Create(
            nameof(CommandParameter),
            typeof(object),
            typeof(AnimatedCheckbox));

    public bool IsChecked
    {
        get => (bool)GetValue(IsCheckedProperty);
        set => SetValue(IsCheckedProperty, value);
    }

    public ICommand Command
    {
        get => (ICommand)GetValue(CommandProperty);
        set => SetValue(CommandProperty, value);
    }

    public object CommandParameter
    {
        get => GetValue(CommandParameterProperty);
        set => SetValue(CommandParameterProperty, value);
    }

    public AnimatedCheckbox()
    {
        InitializeComponent();
    }

    private static void OnIsCheckedChanged(BindableObject bindable, object oldValue, object newValue)
    {
        if (bindable is AnimatedCheckbox checkbox)
        {
            checkbox.UpdateVisualState((bool)newValue, animate: false);
        }
    }

    private async void OnTapped(object sender, EventArgs e)
    {
        // Toggle state
        IsChecked = !IsChecked;

        // Animate
        await UpdateVisualState(IsChecked, animate: true);

        // Execute command
        if (Command?.CanExecute(CommandParameter) == true)
        {
            Command.Execute(CommandParameter);
        }
    }

    private async Task UpdateVisualState(bool isChecked, bool animate)
    {
        if (animate)
        {
            if (isChecked)
            {
                // Animate to checked state
                await Task.WhenAll(
                    UncheckedBorder.FadeTo(0, 150, Easing.CubicOut),
                    CheckedBorder.FadeTo(1, 200, Easing.CubicOut),
                    CheckedBorder.ScaleTo(1.1, 150, Easing.CubicOut)
                );

                await CheckedBorder.ScaleTo(1, 100, Easing.CubicIn);
            }
            else
            {
                // Animate to unchecked state
                await Task.WhenAll(
                    CheckedBorder.FadeTo(0, 150, Easing.CubicOut),
                    CheckedBorder.ScaleTo(0.8, 150, Easing.CubicOut),
                    UncheckedBorder.FadeTo(1, 200, Easing.CubicOut)
                );
            }
        }
        else
        {
            // No animation - set immediate
            if (isChecked)
            {
                UncheckedBorder.Opacity = 0;
                CheckedBorder.Opacity = 1;
                CheckedBorder.Scale = 1;
            }
            else
            {
                UncheckedBorder.Opacity = 1;
                CheckedBorder.Opacity = 0;
                CheckedBorder.Scale = 0.8;
            }
        }
    }
}
```

**Usage example**:
```xaml
<controls:AnimatedCheckbox IsChecked="{Binding IsCompletedToday}"
                           Command="{Binding ToggleCompletionCommand}"
                           CommandParameter="{Binding .}" />
```

Reference design: stribe-design/components/HABIT_CARD.md
```

### Forventet resultat
- Checkbox with smooth animations
- Scale bounce effect on toggle
- Fade transition between states
- Tap area 44dp (accessible)

### Verifikation
- [ ] Build succeeds
- [ ] Animation smooth (60fps, no lag)
- [ ] IsChecked binding virker (two-way)
- [ ] Command executes on tap
- [ ] Tap area minimum 44dp (accessibility)
- [ ] **Used only when DailyTargetCount = 1** (HabitCard conditional rendering)

---

## Frequency Feature Integration

### Conditional Usage
AnimatedCheckbox is used **only for simple habits** (DailyTargetCount = 1).

**HabitCard conditional rendering**:
```xml
<!-- Show Checkbox when DailyTargetCount = 1 -->
<controls:AnimatedCheckbox
    IsVisible="{Binding DailyTargetCount, Converter={StaticResource IntEquals}, ConverterParameter=1}"
    IsChecked="{Binding IsCompletedToday}"
    Command="{Binding ToggleCompletionCommand}"
    CommandParameter="{Binding .}" />

<!-- Show ProgressRing when DailyTargetCount > 1 -->
<controls:ProgressRing
    IsVisible="{Binding DailyTargetCount, Converter={StaticResource IntGreaterThan}, ConverterParameter=1}"
    CurrentCount="{Binding CurrentCount}"
    TargetCount="{Binding DailyTargetCount}"
    Command="{Binding ToggleCompletionCommand}"
    CommandParameter="{Binding .}" />
```

### Behavior
- **IsChecked = true**: Habit completed (Count >= DailyTargetCount)
- **IsChecked = false**: Habit not completed
- **OnTapped**: Executes ToggleCompletionCommand (handled by ViewModel)

AnimatedCheckbox doesn't need to know about Count or DailyTargetCount - it's a simple boolean toggle.

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Simple boolean state**: IsChecked property (no complex multi-state logic)
- **Built-in MAUI animations**: Uses FadeTo(), ScaleTo() (no custom animation framework)
- **Standard BindableProperty**: No custom binding logic
- **Self-contained**: All animation logic in component (no external dependencies)

### Alternativer overvejet

**Alternative 1: VisualStateManager**
```xaml
<VisualStateManager.VisualStateGroups>
    <VisualStateGroup Name="CheckedStates">
        <VisualState Name="Checked">
            <!-- Visual state definitions -->
        </VisualState>
    </VisualStateGroup>
</VisualStateManager.VisualStateGroups>
```
**Hvorfor fravalgt**: More verbose, harder to customize animations. Direct animation code is simpler and more readable.

**Alternative 2: Lottie animation**
```xml
<lottie:AnimationView Source="checkbox_animation.json" />
```
**Hvorfor fravalgt**: Adds dependency (SkiaSharp.Extended.UI.Maui). Simple fade/scale animations don't need Lottie.

**Alternative 3: Built-in CheckBox control**
```xml
<CheckBox IsChecked="{Binding IsCompletedToday}" />
```
**Hvorfor fravalgt**: No control over animation, platform-specific styling issues. Custom control ensures consistent UX.

### Potentielle forbedringer (v2)
- Haptic feedback on toggle (nice-to-have, but handled in ViewModel)
- Custom easing curves per brand guidelines - Can add later if design team requests
- Accessibility announcements (VoiceOver/TalkBack) - Should add in Command 040
- Ripple effect on tap (Material Design style) - Too complex, bounce is sufficient

### Kendte begrænsninger
- **Animation can't be interrupted**: If user taps rapidly, animations queue (acceptable - animation is fast 250ms total)
- **No indeterminate state**: Boolean only, no partial completion (by design - partial handled by ProgressRing)
- **Hard-coded timing**: 150ms/200ms animation durations (acceptable - standard iOS/Android timing)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple boolean toggle, built-in animations, no complex state
- [x] **Læsbarhed**: Clear method names (OnTapped, UpdateVisualState)
- [x] **Navngivning**: IsChecked, UncheckedBorder, CheckedBorder (descriptive)
- [x] **Funktioner**: UpdateVisualState ~40 lines (single purpose - handle animation)
- [x] **DRY**: UpdateVisualState handles both animated and instant state changes
- [x] **Error handling**: No external dependencies to fail, animations can't crash
- [x] **Edge cases**: animate=false for instant updates (initial load), rapid tapping handled
- [x] **Performance**: Async animations don't block UI, Task.WhenAll parallelizes fade/scale
- [x] **Testbarhed**: BindableProperties testable, visual states verifiable

---

## Design Files Reference

- **Screen Spec**: N/A (reusable component)
- **Component Spec**: stribe-design/components/HABIT_CARD.md (usage context)
- **Related**: Command 020 (HabitCard uses this component), stribe-design/components/PROGRESS_RING.md (alternative for DailyTargetCount > 1)

---

## Notes

- **CRITICAL**: HabitCard must conditionally render Checkbox OR ProgressRing based on DailyTargetCount
- Animation timing: 150ms scale out, 200ms fade in, 100ms bounce back (total ~250ms)
- Tap area 44dp ensures accessibility (Apple HIG / Material Design minimum)
- Command executes AFTER visual update (user sees instant feedback before database call)
- IsChecked two-way binding ensures external changes (from ViewModel) update visual state

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
