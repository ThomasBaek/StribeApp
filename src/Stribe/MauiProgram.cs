using CommunityToolkit.Maui;
using Microsoft.Extensions.Logging;
using Stribe.Services;
using Stribe.ViewModels;
using Stribe.Views;
using Stribe.Views.Onboarding;

namespace Stribe;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.UseMauiCommunityToolkit()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

		// Services
		builder.Services.AddSingleton<IDatabaseService, DatabaseService>();
		builder.Services.AddSingleton<IHabitService, HabitService>();

		// Pages (Transient - new instance each navigation)
		builder.Services.AddTransient<SplashPage>();
		builder.Services.AddTransient<HomePage>();
		builder.Services.AddTransient<WelcomePage>();
		builder.Services.AddTransient<HabitSelectionPage>();
		builder.Services.AddTransient<ReminderSetupPage>();
		builder.Services.AddTransient<HabitDetailPage>();
		builder.Services.AddTransient<AddHabitPage>();
		builder.Services.AddTransient<EditHabitPage>();
		builder.Services.AddTransient<SettingsPage>();
		builder.Services.AddTransient<MilestonePage>();

#if DEBUG
		builder.Logging.AddDebug();
#endif

		return builder.Build();
	}
}
