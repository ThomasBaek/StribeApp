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
