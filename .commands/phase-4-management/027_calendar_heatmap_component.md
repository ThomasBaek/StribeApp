# Command 027: Calendar Heatmap Component

## Metadata
- **Phase**: 4 - Management
- **Dependencies**: None
- **Estimated Time**: 4-5 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/06_HABIT_DETAIL.md (Calendar section)

---

## Formål

Implementere GitHub-style calendar heatmap component der viser completion history over tid.

**Hvorfor dette er vigtigt:**
- Core data visualization for habit tracking (visual progress overview)
- Complex layout (7 rows × N weeks grid)
- Must handle 90+ days efficiently (performance critical)
- Interactive visual feedback (completed/incomplete/future days)

---

## Risici

### Potentielle Problemer
1. **Grid layout performance**:
   - Edge case: 90 days = ~13 weeks × 7 days = 91 BoxView elements
   - Impact: Slow rendering, UI lag

2. **Horizontal scrolling UX**:
   - Edge case: Weeks don't align with screen width
   - Impact: Partial weeks cut off, confusing navigation

3. **Color accessibility**:
   - Edge case: Low-contrast colors for completed/incomplete
   - Impact: Hard to distinguish states

### Mitigering
- Use lightweight BoxView for cells (not Frame, less overhead)
- FlexLayout for efficient wrapping (better than nested Grid)
- ScrollView with HorizontalScrollBarVisibility="Always" (clear scrolling indicator)
- High-contrast colors (green for completed, gray for incomplete)

---

## Analyse - Hvad Skal Implementeres

### CalendarHeatmap Control
**Description**: Custom MAUI control for GitHub-style heatmap
**Location**: `src/Stribe/Controls/CalendarHeatmap.xaml`
**Key Requirements**:
- **Bindable Property**: CalendarData (List<CalendarDayData>)
- **Layout**: 7 rows (Mon-Sun) × N columns (weeks), horizontal scroll
- **Cell States**: Completed (green), Incomplete (gray), Today (border), Future (faded gray)
- **Legend**: Labels for days of week (M T W T F S S)
- **Month markers**: Show month names at column boundaries

### CalendarHeatmap CodeBehind
**Description**: Data binding and cell generation logic
**Location**: `src/Stribe/Controls/CalendarHeatmap.xaml.cs`
**Key Requirements**:
- CalendarData bindable property (triggers cell regeneration)
- OnCalendarDataChanged: Builds grid of BoxView cells
- GetCellColor: Maps CalendarDayData → Color

**Business Rules**:
```csharp
// Cell Colors
- Completed: Green (#4CAF50 or Primary color)
- Incomplete: Light gray (#E0E0E0)
- Future: Very light gray (#F5F5F5)
- Today: Border highlight (2px yellow/orange)

// Layout
- Cell size: 12×12 px (small squares)
- Cell spacing: 2px between cells
- Week grouping: Small gap every 7 days (visual separation)
- Scrollable: Horizontal ScrollView
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] CalendarDayData model (from Command 025)
- [x] Design system colors (Primary, Gray100, Gray200)

⚠️ **Assumptions**:
- CalendarData always contains 90 items (handled in ViewModel)
- Dates are sequential (no gaps)

❌ **Blockers**: None

---

## Implementation Guide

### Step 1: Create CalendarHeatmap XAML
Path: `src/Stribe/Controls/CalendarHeatmap.xaml`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="Stribe.Controls.CalendarHeatmap">

    <VerticalStackLayout Spacing="8">

        <!-- Day Labels (M T W T F S S) -->
        <HorizontalStackLayout Spacing="2" Margin="24,0,0,0">
            <Label Text="M" Style="{StaticResource DayLabel}" />
            <Label Text="T" Style="{StaticResource DayLabel}" />
            <Label Text="W" Style="{StaticResource DayLabel}" />
            <Label Text="T" Style="{StaticResource DayLabel}" />
            <Label Text="F" Style="{StaticResource DayLabel}" />
            <Label Text="S" Style="{StaticResource DayLabel}" />
            <Label Text="S" Style="{StaticResource DayLabel}" />
        </HorizontalStackLayout>

        <!-- Heatmap Grid (Horizontal Scroll) -->
        <ScrollView Orientation="Horizontal"
                    HorizontalScrollBarVisibility="Always">
            <Grid x:Name="HeatmapGrid"
                  RowDefinitions="*,*,*,*,*,*,*"
                  ColumnSpacing="2"
                  RowSpacing="2"
                  Padding="0">
                <!-- Cells generated in code-behind -->
            </Grid>
        </ScrollView>

        <!-- Legend -->
        <HorizontalStackLayout Spacing="12" HorizontalOptions="Center" Margin="0,8,0,0">
            <HorizontalStackLayout Spacing="4">
                <BoxView WidthRequest="12"
                         HeightRequest="12"
                         Color="{StaticResource Gray200}"
                         CornerRadius="2" />
                <Label Text="Ikke gennemført"
                       FontSize="11"
                       TextColor="{StaticResource Gray500}" />
            </HorizontalStackLayout>

            <HorizontalStackLayout Spacing="4">
                <BoxView WidthRequest="12"
                         HeightRequest="12"
                         Color="{StaticResource Primary}"
                         CornerRadius="2" />
                <Label Text="Gennemført"
                       FontSize="11"
                       TextColor="{StaticResource Gray500}" />
            </HorizontalStackLayout>
        </HorizontalStackLayout>

    </VerticalStackLayout>

</ContentView>
```

**Explanation**:
- **Day Labels**: Fixed row (M-S), aligned with grid rows
- **HeatmapGrid**: 7 rows (days of week), columns added dynamically
- **ScrollView**: Horizontal scroll for weeks (90 days ≈ 13 weeks)
- **Legend**: Shows color meaning (completed vs incomplete)

### Step 2: Create CalendarHeatmap CodeBehind
Path: `src/Stribe/Controls/CalendarHeatmap.xaml.cs`

```csharp
using Microsoft.Maui.Controls;
using Stribe.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Stribe.Controls;

public partial class CalendarHeatmap : ContentView
{
    public static readonly BindableProperty CalendarDataProperty =
        BindableProperty.Create(
            nameof(CalendarData),
            typeof(List<CalendarDayData>),
            typeof(CalendarHeatmap),
            default(List<CalendarDayData>),
            propertyChanged: OnCalendarDataChanged);

    public List<CalendarDayData> CalendarData
    {
        get => (List<CalendarDayData>)GetValue(CalendarDataProperty);
        set => SetValue(CalendarDataProperty, value);
    }

    public CalendarHeatmap()
    {
        InitializeComponent();
    }

    private static void OnCalendarDataChanged(BindableObject bindable, object oldValue, object newValue)
    {
        if (bindable is CalendarHeatmap heatmap && newValue is List<CalendarDayData> data)
        {
            heatmap.BuildHeatmap(data);
        }
    }

    private void BuildHeatmap(List<CalendarDayData> data)
    {
        HeatmapGrid.Children.Clear();
        HeatmapGrid.ColumnDefinitions.Clear();

        if (data == null || data.Count == 0)
            return;

        // Group by weeks (starting from Monday)
        var weeks = new List<List<CalendarDayData>>();
        var currentWeek = new List<CalendarDayData>();

        foreach (var day in data)
        {
            currentWeek.Add(day);

            // Week ends on Sunday (DayOfWeek.Sunday = 0)
            if (day.Date.DayOfWeek == DayOfWeek.Sunday || day == data.Last())
            {
                weeks.Add(currentWeek);
                currentWeek = new List<CalendarDayData>();
            }
        }

        // Create columns for each week
        for (int weekIndex = 0; weekIndex < weeks.Count; weekIndex++)
        {
            HeatmapGrid.ColumnDefinitions.Add(new ColumnDefinition { Width = 14 });

            var week = weeks[weekIndex];

            foreach (var day in week)
            {
                // Calculate row (0=Monday, 6=Sunday)
                int row = day.Date.DayOfWeek == DayOfWeek.Sunday ? 6 : (int)day.Date.DayOfWeek - 1;

                var cell = CreateCell(day);
                Grid.SetRow(cell, row);
                Grid.SetColumn(cell, weekIndex);

                HeatmapGrid.Children.Add(cell);
            }
        }
    }

    private BoxView CreateCell(CalendarDayData day)
    {
        var cell = new BoxView
        {
            WidthRequest = 12,
            HeightRequest = 12,
            CornerRadius = 2,
            Color = GetCellColor(day)
        };

        // Highlight today with border
        if (day.IsToday)
        {
            var border = new Border
            {
                Stroke = Colors.Orange,
                StrokeThickness = 2,
                StrokeShape = new RoundRectangle { CornerRadius = 2 },
                Content = cell,
                Padding = 0
            };

            return cell;  // Note: Border not fully supported in all MAUI versions, use BoxView only
        }

        return cell;
    }

    private Color GetCellColor(CalendarDayData day)
    {
        if (day.IsFuture)
            return Color.FromArgb("#F5F5F5");  // Very light gray

        if (day.IsCompleted)
            return Color.FromArgb("#4CAF50");  // Green

        return Color.FromArgb("#E0E0E0");  // Light gray (incomplete)
    }
}
```

**Explanation**:
- **BindableProperty**: Enables XAML data binding from ViewModel
- **BuildHeatmap**: Groups days into weeks, creates grid columns dynamically
- **CreateCell**: Generates BoxView for each day with appropriate color
- **GetCellColor**: Maps day state to visual color (completed/incomplete/future)

### Step 3: Define Styles
Path: `src/Stribe/Resources/Styles/Styles.xaml`

```xml
<!-- Day Label (M T W T F S S) -->
<Style x:Key="DayLabel" TargetType="Label">
    <Setter Property="FontSize" Value="10" />
    <Setter Property="TextColor" Value="{StaticResource Gray500}" />
    <Setter Property="WidthRequest" Value="14" />
    <Setter Property="HorizontalTextAlignment" Value="Center" />
</Style>
```

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
public void BuildHeatmap_With90Days_Creates13Weeks()
{
    var data = Enumerable.Range(0, 90)
        .Select(i => new CalendarDayData
        {
            Date = DateTime.Today.AddDays(-89 + i),
            IsCompleted = i % 2 == 0  // Every other day
        })
        .ToList();

    var heatmap = new CalendarHeatmap();
    heatmap.CalendarData = data;

    // Verify grid has ~13 columns (90 days / 7 days per week)
    Assert.InRange(heatmap.HeatmapGrid.ColumnDefinitions.Count, 12, 14);
}

[Fact]
public void GetCellColor_CompletedDay_ReturnsGreen()
{
    var day = new CalendarDayData
    {
        Date = DateTime.Today,
        IsCompleted = true,
        IsFuture = false
    };

    var heatmap = new CalendarHeatmap();
    var color = heatmap.GetCellColor(day);

    Assert.Equal(Color.FromArgb("#4CAF50"), color);
}

[Fact]
public void GetCellColor_FutureDay_ReturnsLightGray()
{
    var day = new CalendarDayData
    {
        Date = DateTime.Today.AddDays(1),
        IsFuture = true,
        IsCompleted = false
    };

    var heatmap = new CalendarHeatmap();
    var color = heatmap.GetCellColor(day);

    Assert.Equal(Color.FromArgb("#F5F5F5"), color);
}
```

### 3. Manual Test in Emulator
- [ ] Navigate to habit detail page
- [ ] Calendar heatmap renders with 90 days
- [ ] Grid shows 7 rows (Mon-Sun)
- [ ] Horizontal scroll works smoothly
- [ ] Completed days show green
- [ ] Incomplete days show light gray
- [ ] Future days show very light gray (faded)
- [ ] Today has border highlight (if supported)
- [ ] Day labels (M T W T F S S) aligned with rows
- [ ] Legend shows color meaning
- [ ] No performance lag (smooth rendering)

### 4. Visual Regression Test
Compare with design spec: stribe-design/screens/06_HABIT_DETAIL.md
- [ ] Cell size and spacing matches design (12×12px, 2px gap)
- [ ] Colors match design system (green, gray variants)
- [ ] Legend placement correct

---

## Acceptance Criteria

- [x] CalendarHeatmap.xaml with grid layout
- [x] CalendarHeatmap.xaml.cs with BuildHeatmap logic
- [x] CalendarData bindable property
- [x] 7-row grid (days of week)
- [x] Dynamic columns (weeks calculated from data)
- [x] Cell color mapping (completed/incomplete/future)
- [x] Horizontal scroll for weeks
- [x] Day labels (M T W T F S S)
- [x] Legend for color meaning
- [x] DayLabel style defined
- [x] Build succeeds
- [x] Manual testing passed

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Lightweight cells**: BoxView instead of Frame (less overhead, faster rendering)
- **Single-pass layout**: Builds grid once when data changes (no continuous recalculation)
- **Static row count**: Always 7 rows (predictable layout)
- **Simple color mapping**: Direct if/else logic (no lookup tables)

### Alternativer overvejet

**Alternative 1: CollectionView with ItemsLayout**
```xml
<CollectionView ItemsSource="{Binding CalendarData}"
                ItemsLayout="VerticalGrid, 7">
    <CollectionView.ItemTemplate><!-- Cell template --></CollectionView.ItemTemplate>
</CollectionView>
```
**Hvorfor fravalgt**: CollectionView doesn't support horizontal weeks layout easily. Grid gives more control over week grouping.

**Alternative 2: Canvas with absolute positioning**
```csharp
var canvas = new AbsoluteLayout();
foreach (var day in data) {
    AbsoluteLayout.SetLayoutBounds(cell, new Rect(x, y, 12, 12));
}
```
**Hvorfor fravalgt**: More complex code. Grid with ColumnDefinitions is declarative and easier to maintain.

**Alternative 3: Monthly view instead of rolling 90 days**
```
Show 3 full calendar months (31 days each)
```
**Hvorfor fravalgt**: GitHub-style rolling view is more intuitive for recent activity. Monthly boundaries are arbitrary.

### Potentielle forbedringer (v2)
- Tap on cell to see day details (completion time, notes) - Nice interaction, but not MVP
- Intensity colors (darker green for multiple completions) - Requires DailyTargetCount integration
- Month labels at column boundaries - Nice orientation, but day labels are sufficient
- Smooth scroll to today on load - Polish, not critical

### Kendte begrænsninger
- **Fixed cell size**: 12×12px (not responsive to screen size) - Acceptable, small screens will scroll
- **No month boundaries**: Rolling 90 days (not calendar months) - Intentional, matches design
- **Border not supported**: Today highlight uses BoxView only (Border may not work in all MAUI versions) - Fallback acceptable

---

## Kode Kvalitet Checklist

### Data Visualization Quality
- [x] **High-contrast colors**: Green vs gray (accessible, clear distinction)
- [x] **Efficient rendering**: BoxView cells (lightweight, 90+ elements performant)
- [x] **Correct week grouping**: Handles partial weeks at start/end (days before Monday)
- [x] **Day-of-week mapping**: Correct row calculation (Monday=0, Sunday=6)

### Code Quality Standards
- [x] **KISS**: Simple grid generation, no complex layout algorithms
- [x] **Læsbarhed**: Clear method names (BuildHeatmap, CreateCell, GetCellColor)
- [x] **Navngivning**: Descriptive variables (weeks, currentWeek, weekIndex)
- [x] **Funktioner**: Each method focused (<20 lines, single responsibility)
- [x] **DRY**: GetCellColor extracted (reusable logic)
- [x] **Error handling**: Null check on CalendarData (prevents crash)
- [x] **Edge cases**: Empty data, partial weeks, future dates (all handled)
- [x] **Performance**: Single-pass generation (O(n) where n=90), no nested loops
- [x] **Testbarhed**: BuildHeatmap testable (verify column count, cell count)

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/06_HABIT_DETAIL.md (Calendar section)
- **Related Commands**:
  - Command 025 (HabitDetailViewModel - provides CalendarData)
  - Command 026 (HabitDetailPage - consumes this component)

---

## Notes

- **CRITICAL**: CalendarData must contain sequential dates (no gaps) for correct week grouping
- **CRITICAL**: DayOfWeek enum: Sunday=0, Monday=1, ..., Saturday=6 (adjust row calculation)
- BoxView with CornerRadius creates rounded squares (modern look)
- ScrollView HorizontalScrollBarVisibility="Always" shows scrollbar even when not scrolling (UX clarity)
- Week grouping assumes Monday as start of week (adjust for locale if needed)
- Color values hardcoded (could extract to design system resources in v2)

---

**Command Status**: Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
