# Command 004: Value Converters

## Metadata
- **ID:** 004
- **Fase:** 1 - Foundation
- **Estimeret tid:** 2 timer
- **Afhængigheder:** Ingen
- **Design reference:** N/A (XAML utilities)

## Formål
Oprette XAML value converters til databinding. Converters gør det muligt at transformere data fra ViewModels til UI-værdier (f.eks. bool til color, int til visibility, etc.). Disse bruges gennem hele appen til clean XAML bindings.

## Risici
- **Lav risiko**: Standard MAUI converters uden dependencies
- **Opmærksomhed**: Registrer converters korrekt i Resources så de er tilgængelige i XAML

## Analyse

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

## Dependencies Check
✅ Ingen dependencies - kan implementeres med det samme

## Implementering

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

### Verifikation

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

### Acceptkriterier
- [ ] Alle 6 converter filer oprettes
- [ ] Alle converters implementerer IValueConverter
- [ ] Converters registreret i Styles.xaml
- [ ] Build succeeds uden fejl
- [ ] Kan bruges i XAML bindings

## Status
- [ ] Analyse gennemført
- [ ] Dependencies verified
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
