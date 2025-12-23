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
