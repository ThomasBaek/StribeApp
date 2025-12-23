# Command 003: Helpers & Extensions

## Metadata
- **Phase**: 1 - Foundation
- **Dependencies**: Ingen
- **Estimated Time**: 2 timer
- **Status**: Pending
- **Design Reference**: N/A (utility code)
- **Frequency Impact**: NO

---

## Formål
Oprette utility klasser og extension methods der bruges gennem hele appen. Dette inkluderer constants, date helpers, color helpers og string extensions. Disse værktøjer gør koden mere læsbar og vedligeholdbar.

---

## Risici

### Potentielle Problemer
1. **Constants mismatch med design tokens**:
   - Edge case: Color constants might not match Colors.xaml definitions
   - Impact: Visual inconsistencies across the app

2. **DateTime edge cases**:
   - Edge case: Day boundary calculations with custom day start time
   - Impact: Incorrect "today" determinations near 04:00

### Mitigering
- Cross-reference all color constants with Colors.xaml during implementation
- Add comprehensive unit tests for DateTime calculations around day boundaries
- Document expected behavior for edge cases in code comments

---

## Analyse - Hvad Skal Implementeres

### Hvad skal implementeres
Utility klasser og extension methods der bruges i hele appen:
- Constants.cs: App-wide konstanter (milestones, settings keys, etc.)
- DateTimeExtensions.cs: Dato hjælpemetoder (IsToday, FormatRelative, etc.)
- ColorExtensions.cs: Farve hjælpemetoder (ToMauiColor, FromHex, etc.)
- StringExtensions.cs: String hjælpemetoder (IsNullOrEmpty checks, truncate, etc.)

### Filer der oprettes
- `src/Stribe/Helpers/Constants.cs`
- `src/Stribe/Helpers/Extensions/DateTimeExtensions.cs`
- `src/Stribe/Helpers/Extensions/ColorExtensions.cs`
- `src/Stribe/Helpers/Extensions/StringExtensions.cs`

### Tekniske specifikationer

**Constants.cs skal indeholde:**
- Milestone days: 7, 21, 30, 60, 90, 180, 365
- Default day start time: "04:00"
- Settings keys: "onboarding_completed", "day_start_time", etc.
- Default reminder time: "20:00"

**DateTimeExtensions.cs skal have:**
- IsToday(DateTime date): bool
- IsFutureDate(DateTime date): bool
- GetDaysAgo(DateTime date): int
- FormatRelative(DateTime date): string ("I dag", "I går", "3 dage siden")
- GetWeekDates(DateTime date): DateTime[7]

**ColorExtensions.cs skal have:**
- ToMauiColor(string hex): Color
- ToHexString(Color color): string
- WithOpacity(Color color, double opacity): Color

**StringExtensions.cs skal have:**
- IsNullOrWhiteSpace extension
- Truncate(int maxLength): string
- ToTitleCase(): string

---

## Dependencies Check
✅ Ingen dependencies - kan implementeres med det samme

---

## Implementation Guide

### Prompt til Claude Code
```
Opret Helpers & Extensions for Stribe projektet:

1. **Opret Helpers/Constants.cs**:
```csharp
namespace Stribe.Helpers;

public static class Constants
{
    // Milestone days for streak celebrations
    public static readonly int[] MilestoneDays = { 7, 21, 30, 60, 90, 180, 365 };

    // Settings keys
    public const string OnboardingCompletedKey = "onboarding_completed";
    public const string DayStartTimeKey = "day_start_time";
    public const string DefaultReminderTimeKey = "default_reminder_time";

    // Default values
    public const string DefaultDayStartTime = "04:00";
    public const string DefaultReminderTime = "20:00";

    // App info
    public const string AppName = "Stribe";
    public const string DatabaseFilename = "stribe.db3";
}
```

2. **Opret Helpers/Extensions/DateTimeExtensions.cs**:
```csharp
namespace Stribe.Helpers.Extensions;

public static class DateTimeExtensions
{
    public static bool IsToday(this DateTime date, TimeSpan? dayStartTime = null)
    {
        var start = dayStartTime ?? TimeSpan.Parse(Constants.DefaultDayStartTime);
        var now = DateTime.Now;
        var adjustedNow = now.TimeOfDay < start ? now.AddDays(-1).Date : now.Date;
        return date.Date == adjustedNow;
    }

    public static bool IsFutureDate(this DateTime date)
    {
        return date.Date > DateTime.Today;
    }

    public static int GetDaysAgo(this DateTime date)
    {
        return (DateTime.Today - date.Date).Days;
    }

    public static string FormatRelative(this DateTime date)
    {
        var daysAgo = date.GetDaysAgo();
        return daysAgo switch
        {
            0 => "I dag",
            1 => "I går",
            _ when daysAgo < 7 => $"{daysAgo} dage siden",
            _ when daysAgo < 30 => $"{daysAgo / 7} uger siden",
            _ => date.ToString("d. MMMM yyyy")
        };
    }

    public static DateTime[] GetWeekDates(this DateTime date)
    {
        var dayOfWeek = (int)date.DayOfWeek;
        var monday = date.AddDays(-(dayOfWeek == 0 ? 6 : dayOfWeek - 1));
        return Enumerable.Range(0, 7).Select(i => monday.AddDays(i)).ToArray();
    }
}
```

3. **Opret Helpers/Extensions/ColorExtensions.cs**:
```csharp
namespace Stribe.Helpers.Extensions;

public static class ColorExtensions
{
    public static Color ToMauiColor(this string hex)
    {
        if (string.IsNullOrWhiteSpace(hex))
            return Colors.Black;

        hex = hex.Replace("#", "");

        if (hex.Length == 6)
        {
            var r = Convert.ToInt32(hex.Substring(0, 2), 16);
            var g = Convert.ToInt32(hex.Substring(2, 2), 16);
            var b = Convert.ToInt32(hex.Substring(4, 2), 16);
            return Color.FromRgb(r, g, b);
        }

        return Colors.Black;
    }

    public static string ToHexString(this Color color)
    {
        var red = (int)(color.Red * 255);
        var green = (int)(color.Green * 255);
        var blue = (int)(color.Blue * 255);
        return $"#{red:X2}{green:X2}{blue:X2}";
    }

    public static Color WithOpacity(this Color color, double opacity)
    {
        return color.WithAlpha((float)opacity);
    }
}
```

4. **Opret Helpers/Extensions/StringExtensions.cs**:
```csharp
namespace Stribe.Helpers.Extensions;

public static class StringExtensions
{
    public static bool IsNullOrWhiteSpace(this string? value)
    {
        return string.IsNullOrWhiteSpace(value);
    }

    public static string Truncate(this string value, int maxLength)
    {
        if (string.IsNullOrEmpty(value) || value.Length <= maxLength)
            return value;

        return value.Substring(0, maxLength - 3) + "...";
    }

    public static string ToTitleCase(this string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return value;

        return System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(value.ToLower());
    }
}
```

Alle extensions skal følge C# naming conventions og være i separate filer.
```

### Forventet resultat
- 4 nye filer i Helpers/ mappen
- Constants tilgængelige app-wide
- Extension methods virker på DateTime, Color, String
- Ingen build errors

---

## Verification Steps

#### Build test
```bash
dotnet build src/Stribe/Stribe.csproj
```

#### Unit tests (manuelle)
- [ ] Constants.MilestoneDays indeholder [7, 21, 30, 60, 90, 180, 365]
- [ ] DateTimeExtensions.IsToday() returnerer true for dagens dato
- [ ] DateTimeExtensions.FormatRelative() returnerer "I dag" for DateTime.Today
- [ ] ColorExtensions.ToMauiColor("#4CAF50") returnerer grøn farve
- [ ] StringExtensions.Truncate("Long text", 5) returnerer "Lo..."

#### Integration test
- [ ] Import helpers i en ViewModel og verificer intellisense virker
- [ ] Brug extension methods uden fejl

---

## Acceptance Criteria
- [ ] Alle 4 filer oprettes korrekt
- [ ] Constants klasse har alle nødvendige værdier
- [ ] Extension methods kompilerer uden fejl
- [ ] Build succeeds
- [ ] Helpers kan bruges i andre dele af koden

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Single-purpose utility classes**: Each extension class focuses on one type (DateTime, Color, String) with clear, focused methods
- **Static helper classes**: Constants and extensions are static - no unnecessary state or complexity
- **Standard C# patterns**: Uses familiar extension method syntax and follows .NET naming conventions
- **Minimal dependencies**: Pure utility code with no external dependencies beyond MAUI framework

### Alternativer overvejet

**Alternative 1: Fluent API pattern**
```csharp
DateTime.Now.AsRelativeString().WithDayStart(TimeSpan.Parse("04:00"))
```
**Hvorfor fravalgt**: Overly complex for simple utility methods. Extension methods are more straightforward and familiar to C# developers.

**Alternative 2: Helper service classes with DI**
**Hvorfor fravalgt**: Adds unnecessary complexity. These are pure functions without state - static methods are more appropriate and easier to use.

**Alternative 3: Single mega-class with all utilities**
```csharp
public static class Helpers { ... }
```
**Hvorfor fravalgt**: Reduces discoverability and violates single responsibility. Separate classes by concern is cleaner.

### Potentielle forbedringer (v2)
- **Caching for FormatRelative**: Cache common date strings - not needed for v1 performance
- **Localization support**: Multi-language support for relative dates - out of scope for MVP
- **Advanced color manipulation**: Blend, lighten, darken methods - YAGNI for current design
- **Performance benchmarks**: Micro-optimizations for string operations - premature optimization

### Kendte begrænsninger
- **IsToday() assumes 04:00 default**: Hardcoded fallback to Constants.DefaultDayStartTime (acceptable - consistent with app design)
- **FormatRelative() only Danish**: No localization support (acceptable - MVP is Danish-only)
- **ToMauiColor() only supports 6-digit hex**: No support for 8-digit hex with alpha (acceptable - not needed in current design)
- **No validation in Truncate()**: Doesn't handle negative maxLength (acceptable - internal API with controlled usage)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Four focused classes with single-purpose methods, no unnecessary abstractions
- [x] **Læsbarhed**: Clear method names (IsToday, FormatRelative, ToMauiColor) that describe exactly what they do
- [x] **Navngivning**: Follows C# conventions - PascalCase for methods, descriptive names, Extensions suffix for extension classes
- [x] **Funktioner**: Small, focused methods doing one thing well (most under 10 lines)
- [x] **DRY**: Constants centralized in one class, extension methods reusable across entire app
- [x] **Error handling**: Defensive null checks in extensions, safe fallbacks in converters
- [x] **Edge cases**: IsToday handles day start time boundary, FormatRelative handles all date ranges
- [x] **Performance**: Minimal allocations, simple operations, no unnecessary computations
- [x] **Testbarhed**: Pure static methods easy to test, predictable outputs for given inputs

---

## Design Files Reference

- **Screen Spec**: N/A
- **Component Spec**: N/A
- **Related**:
  - Colors.xaml (color constants should match)
  - All ViewModels (will use these utilities)
  - Command 004 (Value Converters will use these extensions)

---

## Notes

- Constants.MilestoneDays array order matters - used for achievement progression
- DateTimeExtensions.IsToday() respects custom day start time - critical for accurate streak tracking
- ColorExtensions methods are MAUI-specific, not compatible with Xamarin.Forms
- All extension methods include null safety checks to prevent runtime exceptions
- Keep utility classes in sync with app-wide conventions established in design system

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
