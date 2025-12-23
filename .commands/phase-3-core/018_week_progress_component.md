# Command 018: Week Progress Component

## Metadata
- **ID:** 018
- **Fase:** 3 - Core Experience
- **Estimeret tid:** 2 timer
- **Afhængigheder:** None
- **Design reference:** stribe-design/components/HABIT_CARD.md (Week Progress section)

## Formål
Implementere week progress bar component - 7-segment bar der viser completion status for hele ugen (mandag til søndag).

## Risici
- **Lav risiko**: Standalone UI component
- **Opmærksomhed**:
  - Correct day-of-week mapping (Mon-Sun)
  - Visual differentiation for completed/incomplete days

## Analyse

### Hvad skal implementeres
Week progress bar med:
- 7 segments (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
- Filled segments for completed days
- Empty segments for incomplete days
- Rounded corners
- Responsive sizing

### Filer der oprettes
- `src/Stribe/Controls/WeekProgressBar.xaml` - Component layout
- `src/Stribe/Controls/WeekProgressBar.xaml.cs` - Code-behind with bindable property

## Dependencies Check
✅ Ingen dependencies
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Implementer Week Progress Bar component:

**Opret Controls/WeekProgressBar.xaml**:
```xaml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="Stribe.Controls.WeekProgressBar">

    <Grid ColumnDefinitions="*,4,*,4,*,4,*,4,*,4,*,4,*"
          HeightRequest="8">

        <!-- Monday -->
        <BoxView Grid.Column="0"
                 x:Name="Day0"
                 CornerRadius="4,0,0,4"
                 BackgroundColor="{StaticResource Border}" />

        <!-- Tuesday -->
        <BoxView Grid.Column="2"
                 x:Name="Day1"
                 BackgroundColor="{StaticResource Border}" />

        <!-- Wednesday -->
        <BoxView Grid.Column="4"
                 x:Name="Day2"
                 BackgroundColor="{StaticResource Border}" />

        <!-- Thursday -->
        <BoxView Grid.Column="6"
                 x:Name="Day3"
                 BackgroundColor="{StaticResource Border}" />

        <!-- Friday -->
        <BoxView Grid.Column="8"
                 x:Name="Day4"
                 BackgroundColor="{StaticResource Border}" />

        <!-- Saturday -->
        <BoxView Grid.Column="10"
                 x:Name="Day5"
                 BackgroundColor="{StaticResource Border}" />

        <!-- Sunday -->
        <BoxView Grid.Column="12"
                 x:Name="Day6"
                 CornerRadius="0,4,4,0"
                 BackgroundColor="{StaticResource Border}" />
    </Grid>
</ContentView>
```

**Opret Controls/WeekProgressBar.xaml.cs**:
```csharp
namespace Stribe.Controls;

public partial class WeekProgressBar : ContentView
{
    public static readonly BindableProperty WeekDataProperty =
        BindableProperty.Create(
            nameof(WeekData),
            typeof(bool[]),
            typeof(WeekProgressBar),
            default(bool[]),
            propertyChanged: OnWeekDataChanged);

    public static readonly BindableProperty CompletedColorProperty =
        BindableProperty.Create(
            nameof(CompletedColor),
            typeof(Color),
            typeof(WeekProgressBar),
            Colors.Green);

    public bool[] WeekData
    {
        get => (bool[])GetValue(WeekDataProperty);
        set => SetValue(WeekDataProperty, value);
    }

    public Color CompletedColor
    {
        get => (Color)GetValue(CompletedColorProperty);
        set => SetValue(CompletedColorProperty, value);
    }

    public WeekProgressBar()
    {
        InitializeComponent();
    }

    private static void OnWeekDataChanged(BindableObject bindable, object oldValue, object newValue)
    {
        if (bindable is WeekProgressBar control && newValue is bool[] weekData)
        {
            control.UpdateVisuals(weekData);
        }
    }

    private void UpdateVisuals(bool[] weekData)
    {
        if (weekData == null || weekData.Length != 7)
            return;

        var dayBoxes = new[] { Day0, Day1, Day2, Day3, Day4, Day5, Day6 };

        for (int i = 0; i < 7; i++)
        {
            if (weekData[i])
            {
                dayBoxes[i].BackgroundColor = CompletedColor;
            }
            else
            {
                dayBoxes[i].BackgroundColor = Application.Current.Resources["Border"] as Color ?? Colors.LightGray;
            }
        }
    }
}
```

**Usage in HabitCard** (for command 020):
```xaml
<controls:WeekProgressBar WeekData="{Binding WeekProgress}"
                          CompletedColor="{Binding Color}"
                          Margin="0,12,0,0" />
```

Reference design: stribe-design/components/HABIT_CARD.md
```

### Forventet resultat
- 7-segment progress bar
- Completed days show in accent color
- Incomplete days show in gray
- Rounded corners on edges

### Verifikation
- [ ] Build succeeds
- [ ] 7 segments vises
- [ ] WeekData binding virker
- [ ] Color differentiation korrekt

## Status
- [ ] Implementering gennemført
