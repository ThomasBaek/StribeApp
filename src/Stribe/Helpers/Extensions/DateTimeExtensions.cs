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
