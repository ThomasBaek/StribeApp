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
            _ => Color.FromArgb("#2D5A4A")              // Dark green (21+)
        };
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
