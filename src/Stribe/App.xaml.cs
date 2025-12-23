using Microsoft.Extensions.DependencyInjection;
using Stribe.Services;

namespace Stribe;

public partial class App : Application
{
	public App()
	{
		InitializeComponent();
	}

	protected override Window CreateWindow(IActivationState? activationState)
	{
		return new Window(new AppShell());
	}

	protected override async void OnStart()
	{
		base.OnStart();

		// Wait a moment for the window to be ready
		await Task.Delay(100);

		// Get DatabaseService to check onboarding status
		var dbService = Handler?.MauiContext?.Services.GetService<IDatabaseService>();

		if (dbService != null)
		{
			var onboardingCompleted = await dbService.GetSettingAsync("onboarding_completed");

			if (!string.IsNullOrEmpty(onboardingCompleted) && onboardingCompleted == "true")
			{
				// Returning user - go to home
				await Shell.Current.GoToAsync("//home");
			}
			else
			{
				// First time user - go to splash
				await Shell.Current.GoToAsync("//splash");
			}
		}
		else
		{
			// Fallback to splash if service is not available
			await Shell.Current.GoToAsync("//splash");
		}
	}
}