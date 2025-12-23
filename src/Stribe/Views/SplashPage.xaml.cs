using Stribe.Services;

namespace Stribe.Views;

public partial class SplashPage : ContentPage
{
	private readonly IDatabaseService _database;

	public SplashPage(IDatabaseService database)
	{
		InitializeComponent();
		_database = database;
	}

	protected override async void OnAppearing()
	{
		base.OnAppearing();

		// Start entry animations in parallel
		var iconAnimation = Task.Run(async () =>
		{
			await Task.Delay(200); // Initial delay
			await AppIcon.FadeTo(1, 400, Easing.CubicOut);
			await AppIcon.ScaleTo(1, 400, Easing.CubicOut);
		});

		var nameAnimation = Task.Run(async () =>
		{
			await Task.Delay(400); // Delay after icon starts
			await AppName.FadeTo(1, 300, Easing.CubicOut);
			await AppName.TranslateTo(0, 0, 300, Easing.CubicOut);
		});

		// Wait for animations to complete
		await Task.WhenAll(iconAnimation, nameAnimation);

		// Check onboarding status
		var onboardingCompleted = await _database.GetSettingAsync("onboarding_completed");

		// Ensure minimum display time of 1500ms total
		await Task.Delay(500);

		// Navigate based on onboarding status
		if (!string.IsNullOrEmpty(onboardingCompleted) && onboardingCompleted == "true")
		{
			await Shell.Current.GoToAsync("//home");
		}
		else
		{
			await Shell.Current.GoToAsync("//onboarding");
		}
	}
}
