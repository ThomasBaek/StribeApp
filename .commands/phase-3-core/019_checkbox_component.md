# Command 019: Checkbox Component with Animation

## Metadata
- **ID:** 019
- **Fase:** 3 - Core Experience
- **Estimeret tid:** 3 timer
- **Afhængigheder:** None
- **Design reference:** stribe-design/components/HABIT_CARD.md (Checkbox section)

## Formål
Implementere animated checkbox component til habit completion med smooth scale og color transition animations.

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
- [ ] Animation smooth
- [ ] IsChecked binding virker
- [ ] Command executes on tap

## Status
- [ ] Implementering gennemført
