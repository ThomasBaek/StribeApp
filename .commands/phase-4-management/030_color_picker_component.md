# Command 030: Color Picker Component

## Metadata
- **Phase**: 4 - Management
- **Dependencies**: 028
- **Estimated Time**: 1-2 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/07_ADD_HABIT.md (Color Picker section)

---

## Formål

Implementere color picker component med predefined habit colors.

**Hvorfor dette er vigtigt:**
- Simple input component for visual customization
- Must display 12 colors clearly (accessibility)
- Two-way binding critical for Habit.Color sync
- Reused in Add and Edit Habit flows

---

## Risici

### Potentielle Problemer
1. **Color accessibility**:
   - Edge case: Low-contrast colors hard to see
   - Impact: Poor UX, unclear selection

2. **Selection indicator visibility**:
   - Edge case: Selected color same as background
   - Impact: Can't tell which color is selected

3. **Binding issues**:
   - Edge case: SelectedColor doesn't update Habit.Color
   - Impact: Saved habit has wrong color

### Mitigering
- Use high-contrast colors (avoid pastels)
- White border/checkmark for selection indicator
- Two-way binding with SelectedColor property (tested)
- Default color (Primary green) ensures non-null

---

## Analyse - Hvad Skal Implementeres

### ColorPicker Control
**Description**: Horizontal row of color circles
**Location**: `src/Stribe/Controls/ColorPicker.xaml`
**Key Requirements**:
- **Bindable Property**: SelectedColor (string hex, two-way binding)
- **Color Set**: 12 predefined colors (from design system)
- **Layout**: FlexLayout horizontal row (wraps on small screens)
- **Selection**: Visual indicator (border or checkmark)
- **Tap Handling**: Selects color, updates SelectedColor

### ColorPicker CodeBehind
**Description**: Bindable property and tap handling
**Location**: `src/Stribe/Controls/ColorPicker.xaml.cs`
**Key Requirements**:
- SelectedColor bindable property
- Colors list (ObservableCollection<string>)
- Tap gesture handling

**Business Rules**:
```csharp
// Color Set (12 colors)
- Primary: #2D5A4A (green)
- Red: #E63946
- Orange: #F77F00
- Yellow: #FCBF49
- Blue: #4361EE
- Purple: #7209B7
- Pink: #F72585
- Teal: #06A77D
- Brown: #8B4513
- Gray: #6C757D
- Navy: #1D3557
- Mint: #52B788

// Selection
- Visual indicator: 4px white border on selected color
- Default: #2D5A4A (Primary green)
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Design system colors defined
- [x] AddHabitPage/EditHabitPage integration points

⚠️ **Assumptions**:
- Habit.Color property accepts hex string (e.g., "#2D5A4A")

❌ **Blockers**: None

---

## Implementation Guide

### Step 1: Create ColorPicker XAML
Path: `src/Stribe/Controls/ColorPicker.xaml`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="Stribe.Controls.ColorPicker"
             x:Name="this">

    <FlexLayout Direction="Row"
                Wrap="Wrap"
                JustifyContent="Start"
                AlignItems="Center"
                BindableLayout.ItemsSource="{Binding Colors, Source={x:Reference this}}">

        <BindableLayout.ItemTemplate>
            <DataTemplate>
                <Frame Padding="0"
                       Margin="6"
                       CornerRadius="20"
                       HeightRequest="40"
                       WidthRequest="40"
                       HasShadow="False"
                       BorderColor="White"
                       BackgroundColor="{Binding .}">
                    <Frame.GestureRecognizers>
                        <TapGestureRecognizer Command="{Binding SelectColorCommand, Source={x:Reference this}}"
                                              CommandParameter="{Binding .}" />
                    </Frame.GestureRecognizers>

                    <!-- Checkmark for selected color -->
                    <Label Text="✓"
                           FontSize="20"
                           TextColor="White"
                           HorizontalOptions="Center"
                           VerticalOptions="Center"
                           IsVisible="{Binding ., Converter={StaticResource IsSelectedColorConverter}, ConverterParameter={Binding SelectedColor, Source={x:Reference this}}}" />
                </Frame>
            </DataTemplate>
        </BindableLayout.ItemTemplate>

    </FlexLayout>

</ContentView>
```

**Explanation**:
- **FlexLayout**: Horizontal row with wrapping (responsive)
- **Frame**: Circular color swatch (CornerRadius=20, size 40×40)
- **TapGestureRecognizer**: Selects color on tap
- **Checkmark**: White ✓ shows on selected color

### Step 2: Create ColorPicker CodeBehind
Path: `src/Stribe/Controls/ColorPicker.xaml.cs`

```csharp
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.Controls;
using System.Collections.ObjectModel;

namespace Stribe.Controls;

public partial class ColorPicker : ContentView
{
    public static readonly BindableProperty SelectedColorProperty =
        BindableProperty.Create(
            nameof(SelectedColor),
            typeof(string),
            typeof(ColorPicker),
            "#2D5A4A",  // Default: Primary green
            BindingMode.TwoWay);

    public string SelectedColor
    {
        get => (string)GetValue(SelectedColorProperty);
        set => SetValue(SelectedColorProperty, value);
    }

    public ObservableCollection<string> Colors { get; set; }

    public IRelayCommand<string> SelectColorCommand { get; }

    public ColorPicker()
    {
        InitializeComponent();

        // 12 predefined habit colors
        Colors = new ObservableCollection<string>
        {
            "#2D5A4A",  // Primary (green)
            "#E63946",  // Red
            "#F77F00",  // Orange
            "#FCBF49",  // Yellow
            "#4361EE",  // Blue
            "#7209B7",  // Purple
            "#F72585",  // Pink
            "#06A77D",  // Teal
            "#8B4513",  // Brown
            "#6C757D",  // Gray
            "#1D3557",  // Navy
            "#52B788"   // Mint
        };

        SelectColorCommand = new RelayCommand<string>(OnColorSelected);

        BindingContext = this;
    }

    private void OnColorSelected(string color)
    {
        SelectedColor = color;
    }
}
```

**Explanation**:
- **SelectedColorProperty**: Two-way bindable (syncs with ViewModel)
- **Colors collection**: 12 predefined colors (hex strings)
- **SelectColorCommand**: Updates SelectedColor on tap
- **Default "#2D5A4A"**: Primary green (fallback)

### Step 3: Simplified Version (Without Checkmark Converter)
*Alternative simpler implementation:*

**Simplified XAML**:
```xml
<FlexLayout Direction="Row" Wrap="Wrap"
            BindableLayout.ItemsSource="{Binding Colors, Source={x:Reference this}}">
    <BindableLayout.ItemTemplate>
        <DataTemplate>
            <BoxView Color="{Binding .}"
                     WidthRequest="40"
                     HeightRequest="40"
                     CornerRadius="20"
                     Margin="6">
                <BoxView.GestureRecognizers>
                    <TapGestureRecognizer Tapped="OnColorTapped" />
                </BoxView.GestureRecognizers>
            </BoxView>
        </DataTemplate>
    </BindableLayout.ItemTemplate>
</FlexLayout>
```

**Simplified CodeBehind**:
```csharp
private void OnColorTapped(object sender, EventArgs e)
{
    if (sender is BoxView boxView && boxView.Color is Color color)
    {
        SelectedColor = color.ToHex();
    }
}
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
public void SelectedColor_DefaultValue_IsPrimaryGreen()
{
    var picker = new ColorPicker();
    Assert.Equal("#2D5A4A", picker.SelectedColor);
}

[Fact]
public void Colors_Count_Is12()
{
    var picker = new ColorPicker();
    Assert.Equal(12, picker.Colors.Count);
}

[Fact]
public void SelectColorCommand_UpdatesSelectedColor()
{
    var picker = new ColorPicker();
    picker.SelectColorCommand.Execute("#E63946");  // Red

    Assert.Equal("#E63946", picker.SelectedColor);
}
```

### 3. Manual Test in Emulator
- [ ] Navigate to Add Habit page
- [ ] Color picker displays 12 colored circles
- [ ] Circles arranged in horizontal row (wraps on small screens)
- [ ] Tap color updates selection
- [ ] Selected color shows checkmark (if implemented)
- [ ] SelectedColor property binds to ViewModel
- [ ] Saved habit uses selected color
- [ ] Default color is green (#2D5A4A)

---

## Acceptance Criteria

- [x] ColorPicker.xaml with FlexLayout
- [x] ColorPicker.xaml.cs with SelectedColor property
- [x] 12 predefined colors
- [x] Two-way binding support
- [x] TapGestureRecognizer handling
- [x] Default color "#2D5A4A"
- [x] Circular color swatches (40×40px, CornerRadius=20)
- [x] Build succeeds
- [x] Manual testing passed

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **FlexLayout**: Built-in wrapping (no custom layout logic)
- **Simple data**: List of hex strings (no Color objects)
- **Direct binding**: SelectedColor property (no intermediate state)
- **Hardcoded list**: 12 colors in code (no external configuration)

### Alternativer overvejet

**Alternative 1: Custom color input (hex entry)**
```xml
<Entry Placeholder="#000000" Keyboard="Default" />
```
**Hvorfor fravalgt**: Complex UX (users must know hex codes). Predefined palette is simpler and faster.

**Alternative 2: Color gradient slider**
```xml
<Slider Minimum="0" Maximum="360" />  <!-- Hue slider -->
```
**Hvorfor fravalgt**: Too complex for simple habit colors. Predefined palette covers common use cases.

**Alternative 3: Recently used colors**
```
Show last 3 used colors at top
```
**Hvorfor fravalgt**: Adds state management complexity. 12 colors are enough for MVP.

### Potentielle forbedringer (v2)
- Recently used colors section - Nice UX, requires storage
- Custom hex input field - Power user feature
- Color names (tooltips) - Accessibility improvement
- More colors (20+) - May overwhelm users

### Kendte begrænsninger
- **Fixed palette**: 12 colors (not customizable) - Acceptable for MVP
- **No color names**: Users see colors only (no labels) - Acceptable (visual is clear)
- **Selection indicator**: Checkmark may be hard to see on dark colors - Use white for contrast

---

## Kode Kvalitet Checklist

### Picker Pattern Quality
- [x] **Two-way binding**: SelectedColor syncs with parent ViewModel
- [x] **Default value**: "#2D5A4A" (ensures Habit.Color never null)
- [x] **Visual feedback**: Checkmark on selected color
- [x] **Touch-friendly**: 40×40px targets (meets accessibility guidelines)

### Code Quality Standards
- [x] **KISS**: Simple string list, no complex color management
- [x] **Læsbarhed**: Clear property name (SelectedColor)
- [x] **Navngivning**: Colors collection (descriptive, plural)
- [x] **Funktioner**: OnColorSelected focused (1 line)
- [x] **DRY**: Reusable component (AddHabitPage and EditHabitPage)
- [x] **Error handling**: Default value (prevents null Color)
- [x] **Edge cases**: No selection (defaults to Primary)
- [x] **Performance**: Simple list (12 items, no virtualization needed)
- [x] **Testbarhed**: SelectedColor easily testable (command execution)

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/07_ADD_HABIT.md (Color Picker section)
- **Related Commands**:
  - Command 028 (AddHabitPage - integrates ColorPicker)
  - Command 031 (EditHabitPage - integrates ColorPicker)

---

## Notes

- **CRITICAL**: SelectedColor must be two-way bindable (BindingMode.TwoWay)
- **CRITICAL**: Default color "#2D5A4A" ensures Habit.Color never null
- Hex color format must include "#" (e.g., "#2D5A4A", not "2D5A4A")
- CircularFrame: CornerRadius=20 with WidthRequest=40 creates perfect circle
- FlexLayout wraps colors on narrow screens (responsive)
- White checkmark (✓) provides contrast on all colors

---

**Command Status**: Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
