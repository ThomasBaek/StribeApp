# Command 013: Reminder Setup Page

## Metadata
- **ID:** 013
- **Fase:** 2 - Onboarding
- **Estimeret tid:** 2-3 timer
- **Afhængigheder:** 011
- **Design reference:** stribe-design/screens/04_ONBOARDING_REMINDER.md

## Formål
Implementere reminder setup page hvor brugeren vælger tidspunkt for daglig påmindelse. Dette er det sidste onboarding step før brugeren kommer til home screen.

## Risici
- **Lav risiko**: Standard UI med time picker
- **Opmærksomhed**:
  - Time picker skal virke korrekt på både iOS og Android
  - "Skip" option skal også gemme at onboarding er completed
  - Reminder time skal gemmes i settings
- **Test**: Navigation flow og data persistence

## Analyse

### Hvad skal implementeres
Reminder setup page med:
- Headline og beskrivelse
- Large time picker (visual clock eller native picker)
- "Enable påmindelse" toggle/button
- "Spring over" option
- Page indicator (step 3 of 3)
- Navigation til home screen efter completion

### Filer der oprettes/ændres
- `src/Stribe/Views/Onboarding/ReminderSetupPage.xaml` - Layout
- `src/Stribe/Views/Onboarding/ReminderSetupPage.xaml.cs` - Code-behind
- `src/Stribe/ViewModels/OnboardingViewModel.cs` - Updated med reminder logic

### Design specifikationer
Fra 04_ONBOARDING_REMINDER.md:

**Layout:**
```yaml
- Back button
- Headline: "Hvornår vil du gerne mindes?"
- Subtitle: "Vi sender dig en daglig påmindelse"
- Time picker (stor, visual)
- "Enable påmindelse" button
- "Spring over" link
- Page indicator (3/3)
```

**Default time:** 09:00

**Behavior:**
- Enable → Save time + enable notifications → Navigate to home
- Skip → Don't enable notifications → Navigate to home
- Both options save "onboarding_completed" = true

## Dependencies Check
✅ Command 011 (Habit Selection) - skal være implementeret
✅ OnboardingViewModel - eksisterer
✅ SettingsService - allerede implementeret (command 007)
✅ NotificationService - stub eksisterer (command 006)
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Implementer Reminder Setup Page for Stribe onboarding:

1. **Opdater ViewModels/OnboardingViewModel.cs**:

Tilføj reminder properties og commands:
```csharp
// Properties
public TimeSpan ReminderTime { get; set; } = new TimeSpan(9, 0, 0); // Default 09:00
public bool EnableReminders { get; set; } = true;

// Commands
public ICommand EnableReminderCommand { get; }
public ICommand SkipReminderCommand { get; }

// In constructor
EnableReminderCommand = new Command(OnEnableReminder);
SkipReminderCommand = new Command(OnSkipReminder);

// Methods
private async void OnEnableReminder()
{
    try
    {
        // Save reminder settings
        await _settingsService.SetReminderTimeAsync(ReminderTime);
        await _settingsService.SetRemindersEnabledAsync(true);

        // Schedule notification (using NotificationService stub)
        await _notificationService.ScheduleDailyReminderAsync(ReminderTime);

        // Complete onboarding
        await CompleteOnboarding();
    }
    catch (Exception ex)
    {
        await Application.Current.MainPage.DisplayAlert("Fejl", "Kunne ikke aktivere påmindelser", "OK");
    }
}

private async void OnSkipReminder()
{
    // Just complete onboarding without enabling reminders
    await CompleteOnboarding();
}

private async Task CompleteOnboarding()
{
    // Save selected habits to database
    foreach (var habit in SelectedHabits)
    {
        var newHabit = new Habit
        {
            Id = Guid.NewGuid().ToString(),
            Name = habit.DefaultName,
            Icon = habit.Emoji,
            Color = habit.DefaultColor,
            CreatedAt = DateTime.Now,
            SortOrder = SelectedHabits.IndexOf(habit),
            IsArchived = false
        };

        await _habitService.SaveHabitAsync(newHabit);
    }

    // Mark onboarding as completed
    await _database.SaveSettingAsync("onboarding_completed", "true");

    // Navigate to home
    await Shell.Current.GoToAsync("//home");
}
```

2. **Opret Views/Onboarding/ReminderSetupPage.xaml**:
```xaml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewmodels="clr-namespace:Stribe.ViewModels"
             x:Class="Stribe.Views.Onboarding.ReminderSetupPage"
             x:DataType="viewmodels:OnboardingViewModel"
             BackgroundColor="{StaticResource Background}"
             NavigationPage.HasNavigationBar="False">

    <Grid RowDefinitions="Auto,*,Auto,Auto,Auto">

        <!-- Header with back button -->
        <Grid Grid.Row="0"
              Padding="16,8"
              HeightRequest="56">
            <ImageButton Source="arrow_left.png"
                         HeightRequest="44"
                         WidthRequest="44"
                         HorizontalOptions="Start"
                         Command="{Binding GoBackCommand}" />
        </Grid>

        <!-- Content -->
        <ScrollView Grid.Row="1">
            <VerticalStackLayout Padding="24,16" Spacing="32">

                <!-- Title Section -->
                <VerticalStackLayout Spacing="8">
                    <Label Text="Hvornår vil du gerne&#x0a;mindes?"
                           Style="{StaticResource Headline}"
                           FontSize="24"
                           LineHeight="1.2" />

                    <Label Text="Vi sender dig en daglig påmindelse"
                           Style="{StaticResource Body}"
                           TextColor="{StaticResource TextSecondary}" />
                </VerticalStackLayout>

                <!-- Time Picker -->
                <Border Padding="32"
                        BackgroundColor="{StaticResource Surface}"
                        StrokeThickness="0"
                        HorizontalOptions="Center">
                    <Border.StrokeShape>
                        <RoundRectangle CornerRadius="16" />
                    </Border.StrokeShape>

                    <VerticalStackLayout Spacing="16">
                        <Label Text="⏰"
                               FontSize="48"
                               HorizontalOptions="Center" />

                        <TimePicker Time="{Binding ReminderTime}"
                                    Format="HH:mm"
                                    TextColor="{StaticResource Primary}"
                                    FontSize="32"
                                    FontAttributes="Bold"
                                    HorizontalOptions="Center" />

                        <Label Text="Dagligt"
                               Style="{StaticResource Caption}"
                               TextColor="{StaticResource TextSecondary}"
                               HorizontalOptions="Center" />
                    </VerticalStackLayout>
                </Border>

                <!-- Info text -->
                <Label Text="Du kan altid ændre dette senere i indstillinger"
                       Style="{StaticResource Caption}"
                       TextColor="{StaticResource TextSecondary}"
                       HorizontalTextAlignment="Center" />

            </VerticalStackLayout>
        </ScrollView>

        <!-- Enable Button -->
        <Button Grid.Row="2"
                Text="Aktiver påmindelse"
                Style="{StaticResource PrimaryButton}"
                Command="{Binding EnableReminderCommand}"
                Margin="24,0,24,8" />

        <!-- Skip Button -->
        <Button Grid.Row="3"
                Text="Spring over"
                Style="{StaticResource TextButton}"
                Command="{Binding SkipReminderCommand}"
                Margin="24,0,24,16" />

        <!-- Page Indicator -->
        <HorizontalStackLayout Grid.Row="4"
                               HorizontalOptions="Center"
                               Spacing="8"
                               Margin="0,0,0,24">
            <BoxView WidthRequest="8" HeightRequest="8" CornerRadius="4" Color="{StaticResource Border}" />
            <BoxView WidthRequest="8" HeightRequest="8" CornerRadius="4" Color="{StaticResource Border}" />
            <BoxView WidthRequest="8" HeightRequest="8" CornerRadius="4" Color="{StaticResource Primary}" />
        </HorizontalStackLayout>

    </Grid>
</ContentPage>
```

3. **Opret Views/Onboarding/ReminderSetupPage.xaml.cs**:
```csharp
namespace Stribe.Views.Onboarding;

public partial class ReminderSetupPage : ContentPage
{
    public ReminderSetupPage(OnboardingViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

4. **Registrer i MauiProgram.cs**:
```csharp
builder.Services.AddTransient<ReminderSetupPage>();
```

5. **Registrer route i AppShell.xaml.cs**:
```csharp
Routing.RegisterRoute("onboarding/reminder", typeof(ReminderSetupPage));
```

6. **Opdater SettingsService interface (hvis ikke allerede)**:
```csharp
// In ISettingsService
Task SetReminderTimeAsync(TimeSpan time);
Task<TimeSpan> GetReminderTimeAsync();
Task SetRemindersEnabledAsync(bool enabled);
Task<bool> GetRemindersEnabledAsync();

// In SettingsService
public async Task SetReminderTimeAsync(TimeSpan time)
{
    await _database.SaveSettingAsync("reminder_time", time.ToString());
}

public async Task<TimeSpan> GetReminderTimeAsync()
{
    var timeStr = await _database.GetSettingAsync("reminder_time");
    if (TimeSpan.TryParse(timeStr, out var time))
        return time;
    return new TimeSpan(9, 0, 0); // Default 09:00
}

public async Task SetRemindersEnabledAsync(bool enabled)
{
    await _database.SaveSettingAsync("reminders_enabled", enabled.ToString());
}

public async Task<bool> GetRemindersEnabledAsync()
{
    var enabled = await _database.GetSettingAsync("reminders_enabled");
    return enabled == "true";
}
```

Reference design: stribe-design/screens/04_ONBOARDING_REMINDER.md
```

### Forventet resultat
- ReminderSetupPage med time picker
- Default time 09:00
- "Aktiver påmindelse" button gemmer tid og enabled state
- "Spring over" button skipper reminders men completer onboarding
- Både options gemmer selected habits til database
- Navigation til home screen efter completion
- Page indicator viser step 3 af 3

### Verifikation

#### Build test
```bash
dotnet build src/Stribe/Stribe.csproj
```

#### Unit tests
**Test reminder logic:**
```
Scenario 1: Enable reminder → tid gemmes i settings
Scenario 2: Enable reminder → reminders_enabled = true
Scenario 3: Skip reminder → reminders_enabled = false (eller ikke sat)
Scenario 4: Both paths → onboarding_completed = true
Scenario 5: Both paths → selected habits saved to DB
```

#### Integration test i emulator
- [ ] Navigate fra Habit Selection til Reminder Setup
- [ ] Time picker viser 09:00 default
- [ ] Ændre tid → ReminderTime property opdateres
- [ ] Tap "Aktiver påmindelse" → navigerer til home
- [ ] Verificer: Reminder tid gemt i settings
- [ ] Verificer: Reminders enabled = true
- [ ] Verificer: Selected habits saved to database
- [ ] Verificer: onboarding_completed = true
- [ ] Tap "Spring over" → navigerer til home uden reminder
- [ ] Back button navigerer til Habit Selection
- [ ] Page indicator viser korrekt step (3/3)

### Acceptkriterier
- [ ] ReminderSetupPage.xaml med time picker layout
- [ ] OnboardingViewModel opdateret med reminder logic
- [ ] SettingsService opdateret med reminder methods
- [ ] Default time 09:00
- [ ] Enable button gemmer tid og enabled state
- [ ] Skip button completer onboarding uden reminder
- [ ] Selected habits gemmes til database
- [ ] onboarding_completed flag sættes
- [ ] Navigation til home virker
- [ ] Page registered i routing
- [ ] Build succeeds
- [ ] Alle test scenarier passerer

## Status
- [ ] Analyse gennemført
- [ ] Dependencies verified
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
