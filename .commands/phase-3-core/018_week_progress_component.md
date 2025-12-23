# Command 018: Week Progress Component

## Metadata
- **Phase**: 3 - Core Experience
- **Dependencies**: None
- **Estimated Time**: 2 hours
- **Status**: Pending
- **Design Reference**: stribe-design/components/HABIT_CARD.md (Week Progress section)
- **Frequency Impact**: NO

---

## Formål

Implementere week progress bar component - 7-segment bar der viser completion status for hele ugen (mandag til søndag).

**Hvorfor dette er vigtigt:**
- Visual feedback for weekly consistency
- Gamification (seeing filled segments motivates streaks)
- Compact representation (7 days in minimal space)
- Reusable component across habit cards

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

### Acceptkriterier
- [ ] WeekProgressBar.xaml oprettet som ContentView
- [ ] 7 BoxView elements (Grid ColumnDefinitions: *,4,*,4,*,4,*,4,*,4,*,4,*)
- [ ] WeekDataProperty BindableProperty (bool[] array)
- [ ] CompletedColorProperty BindableProperty
- [ ] UpdateVisuals method updates segment colors
- [ ] Rounded corners på first/last segments
- [ ] 4px spacing between segments
- [ ] Build succeeds
- [ ] Binding functional

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Simple Grid layout**: 7 columns med 4px gaps - no custom rendering
- **BindableProperty pattern**: Standard .NET MAUI data binding - no custom logic
- **BoxView primitives**: Uses basic shape - no SVG, no custom drawing
- **Named elements (Day0-Day6)**: Direct reference in UpdateVisuals - no ItemsSource complexity

### Alternativer overvejet

**Alternative 1: ItemsControl/CollectionView for segments**
```xaml
<BindableLayout.ItemsSource>
    <Binding Path="WeekData" />
</BindableLayout.ItemsSource>
<BindableLayout.ItemTemplate>
    <DataTemplate>
        <BoxView BackgroundColor="{Binding Converter={StaticResource BoolToColorConverter}}" />
    </DataTemplate>
</BindableLayout.ItemTemplate>
```
**Hvorfor fravalgt**: Over-engineering for fixed 7-segment layout. ItemsControl adds converter, template complexity. Direct BoxView references are simpler for fixed-size control.

**Alternative 2: Custom SkiaSharp drawing**
```csharp
public class WeekProgressBarView : SKCanvasView
{
    protected override void OnPaintSurface(SKPaintSurfaceEventArgs e)
    {
        // Draw 7 rounded rectangles
    }
}
```
**Hvorfor fravalgt**: Massive overkill. SkiaSharp adds native dependency, custom drawing code. BoxView with Border/CornerRadius is sufficient and simpler.

**Alternative 3: Single BoxView with gradient mask**
```xaml
<BoxView HeightRequest="8">
    <BoxView.Background>
        <LinearGradientBrush>
            <!-- Segments as gradient stops -->
        </LinearGradientBrush>
    </BoxView.Background>
</BoxView>
```
**Hvorfor fravalgt**: Gradient can't create discrete segments with spacing. Would render as continuous bar. Doesn't match design.

### Potentielle forbedringer (v2)
- Animated fill on completion toggle (segment grows from left)
- Tooltip on tap (show day name + completion status)
- Different visual for "today" segment (border, pulse animation)
- Support for custom week start day (Sunday vs Monday)

### Kendte begrænsninger
- **Fixed week start (Monday)**: Assumes Monday = Day0. Could make configurable if users request Sunday-start weeks.
- **No accessibility labels**: Screen readers can't describe individual segments. Consider adding semantic descriptions.
- **No tap interaction**: Passive display only. Could add tap gesture to jump to specific day.

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple Grid + BoxView, no custom rendering
- [x] **Læsbarhed**: Clear column definitions, named elements (Day0-Day6)
- [x] **Navngivning**: WeekProgressBar (self-documenting), WeekData property
- [x] **BindableProperty**: Proper use of propertyChanged callback
- [x] **Null safety**: WeekData validation (length != 7 check)
- [x] **Spacing**: Consistent 4px gaps between segments
- [x] **Rounded corners**: First segment (4,0,0,4), last segment (0,4,4,0)
- [x] **Color binding**: Supports custom CompletedColor per habit
- [x] **Reusability**: ContentView can be used in any parent layout

---

## Design Files Reference

- **Component Spec**: stribe-design/components/HABIT_CARD.md (Week Progress section)
- **Usage**: Command 020 (HabitCard component uses WeekProgressBar)

---

## Notes

- **Week Structure**: Monday (index 0) → Sunday (index 6) - ISO 8601 standard
- **Color Logic**: WeekData[i] = true → CompletedColor, false → Border color (gray)
- **Corner Radius**: Only first/last segments have rounded outer corners for clean bar appearance
- **Height**: Fixed 8px HeightRequest - compact enough for habit card, visible at glance
- **Spacing**: 4px gaps between segments create discrete appearance (not continuous bar)

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
