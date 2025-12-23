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
