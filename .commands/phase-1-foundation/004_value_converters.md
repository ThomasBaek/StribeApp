# Command 004: Value Converters

## Metadata
- **Phase**: 1 - Foundation
- **Dependencies**: Ingen
- **Estimated Time**: 2 timer
- **Status**: Pending
- **Design Reference**: N/A (XAML utilities)
- **Frequency Impact**: NO

---

## Formål
Oprette XAML value converters til databinding. Converters gør det muligt at transformere data fra ViewModels til UI-værdier (f.eks. bool til color, int til visibility, etc.). Disse bruges gennem hele appen til clean XAML bindings.

---

## Risici

### Potentielle Problemer
1. **Resource registration missing**:
   - Edge case: Converter not registered in Styles.xaml
   - Impact: Runtime binding errors in XAML pages

2. **Type conversion failures**:
   - Edge case: Unexpected value types passed to Convert method
   - Impact: Binding fails silently or throws exceptions

### Mitigering
- Add all converters to Styles.xaml ResourceDictionary during implementation
- Include defensive type checking with safe fallbacks in all Convert methods
- Test converters with various input types including null values

---

## Analyse - Hvad Skal Implementeres

### Hvad skal implementeres
Value converters til XAML databinding:
- BoolToColorConverter: bool → Color (til completed status)
- InverseBoolConverter: bool → !bool
- IntToVisibilityConverter: int → bool (count > 0 = visible)
- DateToStringConverter: DateTime → formatted string
- StreakToColorConverter: int streak → Color (gradient baseret på streak)
- EmptyStringToVisibilityConverter: string → bool

### Filer der oprettes
- `src/Stribe/Converters/BoolToColorConverter.cs`
- `src/Stribe/Converters/InverseBoolConverter.cs`
- `src/Stribe/Converters/IntToVisibilityConverter.cs`
- `src/Stribe/Converters/DateToStringConverter.cs`
- `src/Stribe/Converters/StreakToColorConverter.cs`
- `src/Stribe/Converters/EmptyStringToVisibilityConverter.cs`

### Tekniske specifikationer

**BoolToColorConverter:**
- TrueColor (ConverterParameter): Farve når true
- FalseColor: Farve når false
- Bruges til checkbox, completion status

**StreakToColorConverter:**
- 0 days: Gray
- 1-6 days: Light green
- 7-20 days: Green
- 21+ days: Dark green (achievement color)

---

## Dependencies Check
✅ Ingen dependencies - kan implementeres med det samme

---

## Implementation Guide

### Prompt til Claude Code
```
Opret Value Converters for Stribe projektet:

1. **Opret Converters/BoolToColorConverter.cs**:
```csharp
using System.Globalization;

namespace Stribe.Converters;

public class BoolToColorConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is not bool boolValue)
            return Colors.Gray;

        if (parameter is Color color)
            return boolValue ? color : Colors.Gray;

        // Default: green if true, gray if false
        return boolValue ? Color.FromArgb("#4CAF50") : Color.FromArgb("#E5EBE8");
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
```

2. **Opret Converters/InverseBoolConverter.cs**:
```csharp
using System.Globalization;

namespace Stribe.Converters;

public class InverseBoolConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is bool boolValue)
            return !boolValue;

        return false;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is bool boolValue)
            return !boolValue;

        return false;
    }
}
```

3. **Opret Converters/IntToVisibilityConverter.cs**:
```csharp
using System.Globalization;

namespace Stribe.Converters;

public class IntToVisibilityConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is int intValue)
            return intValue > 0;

        return false;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
```

4. **Opret Converters/DateToStringConverter.cs**:
```csharp
using System.Globalization;
using Stribe.Helpers.Extensions;

namespace Stribe.Converters;

public class DateToStringConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is DateTime date)
        {
            var format = parameter as string ?? "relative";

            return format switch
            {
                "relative" => date.FormatRelative(),
                "short" => date.ToString("dd/MM"),
                "long" => date.ToString("d. MMMM yyyy"),
                _ => date.ToString()
            };
        }

        return string.Empty;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
```

5. **Opret Converters/StreakToColorConverter.cs**:
```csharp
using System.Globalization;

namespace Stribe.Converters;

public class StreakToColorConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is not int streak)
            return Color.FromArgb("#9E9E9E"); // Gray

        return streak switch
        {
            0 => Color.FromArgb("#9E9E9E"),           // Gray
            >= 1 and <= 6 => Color.FromArgb("#81C784"), // Light green
            >= 7 and <= 20 => Color.FromArgb("#4CAF50"), // Green
            >= 21 => Color.FromArgb("#2D5A4A")          // Dark green
        };
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
```

6. **Opret Converters/EmptyStringToVisibilityConverter.cs**:
```csharp
using System.Globalization;

namespace Stribe.Converters;

public class EmptyStringToVisibilityConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is string str)
            return !string.IsNullOrWhiteSpace(str);

        return false;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
```

7. **Registrer converters i Resources/Styles/Styles.xaml**:
Tilføj i <ResourceDictionary>:
```xaml
<!-- Value Converters -->
<converters:BoolToColorConverter x:Key="BoolToColor" />
<converters:InverseBoolConverter x:Key="InverseBool" />
<converters:IntToVisibilityConverter x:Key="IntToVisibility" />
<converters:DateToStringConverter x:Key="DateToString" />
<converters:StreakToColorConverter x:Key="StreakToColor" />
<converters:EmptyStringToVisibilityConverter x:Key="EmptyStringToVisibility" />
```

Tilføj namespace i top af Styles.xaml:
```xaml
xmlns:converters="clr-namespace:Stribe.Converters"
```
```

### Forventet resultat
- 6 nye converter filer
- Converters registreret i Styles.xaml
- Kan bruges i XAML med {StaticResource}

---

## Verification Steps

#### Build test
```bash
dotnet build src/Stribe/Stribe.csproj
```

#### Unit tests (manuelle)
- [ ] BoolToColorConverter(true) returnerer grøn
- [ ] InverseBoolConverter(true) returnerer false
- [ ] IntToVisibilityConverter(5) returnerer true
- [ ] IntToVisibilityConverter(0) returnerer false
- [ ] DateToStringConverter(DateTime.Today) returnerer "I dag"
- [ ] StreakToColorConverter(21) returnerer dark green
- [ ] EmptyStringToVisibilityConverter("") returnerer false

#### XAML test
Opret test binding i en page:
```xaml
<Label Text="Test"
       TextColor="{Binding IsCompleted, Converter={StaticResource BoolToColor}}" />
```

---

## Acceptance Criteria
- [ ] Alle 6 converter filer oprettes
- [ ] Alle converters implementerer IValueConverter
- [ ] Converters registreret i Styles.xaml
- [ ] Build succeeds uden fejl
- [ ] Kan bruges i XAML bindings

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **One converter, one purpose**: Each converter handles a single type conversion (bool→color, int→visibility)
- **Defensive type checking**: All converters validate input types and provide safe fallbacks
- **Standard IValueConverter pattern**: Uses familiar MAUI converter interface without custom abstractions
- **Declarative XAML usage**: Converters enable clean separation between UI and logic in XAML bindings

### Alternativer overvejet

**Alternative 1: Multi-value converters**
```csharp
public class MultiValueConverter : IMultiValueConverter { ... }
```
**Hvorfor fravalgt**: Not needed for current use cases. Single value conversions are simpler and sufficient for all current bindings.

**Alternative 2: Generic converter with configuration**
```csharp
public class GenericConverter<TInput, TOutput> : IValueConverter { ... }
```
**Hvorfor fravalgt**: Over-engineering. Specific converters are more discoverable and easier to understand.

**Alternative 3: Behavior-based approach**
```xaml
<Label.Behaviors>
  <behaviors:ColorFromBoolBehavior />
</Label.Behaviors>
```
**Hvorfor fravalgt**: Behaviors are more complex than converters for simple value transformations.

### Potentielle forbedringer (v2)
- **Converter parameter parsing**: More flexible parameter handling - not needed for current simple conversions
- **Bidirectional conversion**: Implement ConvertBack for all converters - YAGNI for one-way bindings
- **Cached color instances**: Reuse Color objects to reduce allocations - premature optimization
- **Theme-aware converters**: Dynamic colors based on light/dark theme - out of scope for v1

### Kendte begrænsninger
- **BoolToColorConverter parameter must be Color**: Doesn't parse hex strings from XAML (acceptable - use direct Color binding)
- **DateToStringConverter Danish-only**: No localization support (acceptable - MVP is Danish market)
- **StreakToColorConverter hardcoded thresholds**: Color breakpoints at 1, 7, 21 days not configurable (acceptable - matches design spec)
- **ConvertBack not implemented**: Most converters throw NotImplementedException (acceptable - only one-way binding needed)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Six focused converters, each handling one specific transformation type
- [x] **Læsbarhed**: Descriptive names (BoolToColor, IntToVisibility) clearly indicate input→output mapping
- [x] **Navngivning**: Follows MAUI conventions - Converter suffix, IValueConverter interface
- [x] **Funktioner**: Each Convert method is 3-10 lines, single responsibility
- [x] **DRY**: Converters registered once in Styles.xaml, reusable across all XAML pages
- [x] **Error handling**: Type validation with safe fallback values (Gray, false, empty string)
- [x] **Edge cases**: Handles null inputs, unexpected types, boundary values (0, negative numbers)
- [x] **Performance**: Lightweight transformations, no database calls or heavy computation
- [x] **Testbarhed**: Pure functions easy to unit test with predictable outputs

---

## Design Files Reference

- **Screen Spec**: N/A
- **Component Spec**: N/A
- **Related**:
  - Resources/Styles/Styles.xaml (converter registration)
  - Resources/Styles/Colors.xaml (color values referenced)
  - Command 003 (DateToStringConverter uses DateTimeExtensions)
  - All XAML pages (will use these converters in bindings)

---

## Notes

- All converters must be registered in Styles.xaml ResourceDictionary before use
- StreakToColorConverter color breakpoints (1, 7, 21) match milestone system design
- BoolToColorConverter defaults match app color scheme (green=#4CAF50, gray=#E5EBE8)
- DateToStringConverter supports multiple formats via ConverterParameter
- Converters enable two-way binding separation - ViewModels stay type-safe while XAML gets formatted values
- Test converters with null, DBNull, and unexpected types to verify defensive coding

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
