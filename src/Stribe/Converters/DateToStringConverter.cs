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
