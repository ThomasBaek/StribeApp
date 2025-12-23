using Stribe.Views;
using Stribe.Views.Onboarding;

namespace Stribe;

public partial class AppShell : Shell
{
	public AppShell()
	{
		InitializeComponent();

		// Register onboarding sub-routes
		Routing.RegisterRoute("onboarding/welcome", typeof(WelcomePage));
		Routing.RegisterRoute("onboarding/habits", typeof(HabitSelectionPage));
		Routing.RegisterRoute("onboarding/reminder", typeof(ReminderSetupPage));

		// Register modal routes
		Routing.RegisterRoute("habit-detail", typeof(HabitDetailPage));
		Routing.RegisterRoute("add-habit", typeof(AddHabitPage));
		Routing.RegisterRoute("edit-habit", typeof(EditHabitPage));
		Routing.RegisterRoute("settings", typeof(SettingsPage));
		Routing.RegisterRoute("milestone", typeof(MilestonePage));
	}
}
