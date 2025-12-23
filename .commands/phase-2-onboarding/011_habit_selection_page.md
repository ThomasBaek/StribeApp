# Command 011: Habit Selection Page

## Metadata
- **ID:** 011
- **Fase:** 2 - Onboarding
- **Estimeret tid:** 4-5 timer
- **Afhængigheder:** 010
- **Design reference:** stribe-design/screens/03_ONBOARDING_HABITS.md

## Formål
Implementere habit selection screen hvor brugeren vælger 1-3 predefined habits eller tilføjer egen custom habit. Dette er det vigtigste onboarding step hvor brugeren definerer hvilke vaner de vil tracke.

## Risici
- **Medium risiko**: Selection state management skal være robust
- **Opmærksomhed**:
  - Max 3 habits constraint skal enforces korrekt
  - State skal persistes når brugeren går tilbage/frem
  - Custom habit option skal åbne dialog (command 012)
- **Test grundigt**: Multi-selection logic og validation

## Analyse

### Hvad skal implementeres
Habit selection page med:
- Grid af 6 predefined habit chips (2 columns)
- Multi-selection (1-3 habits)
- Visual feedback for selected/unselected state
- "Egen" chip der åbner custom habit dialog
- Continue button (enabled når min 1 habit valgt)
- Page indicator (step 2 of 3)

### Filer der oprettes
- `src/Stribe/Views/Onboarding/HabitSelectionPage.xaml` - Layout
- `src/Stribe/Views/Onboarding/HabitSelectionPage.xaml.cs` - Code-behind
- `src/Stribe/ViewModels/OnboardingViewModel.cs` - Updated med selection logic
- `src/Stribe/Models/PresetHabit.cs` - Model for predefined habits

### Predefined Habits Data
Fra design spec:
```
1. 🏃 Motion (habit_green)
2. 📚 Læse (habit_blue)
3. 🧘 Meditation (habit_purple)
4. 💧 Vand (habit_teal)
5. 📝 Journal (habit_yellow)
6. ➕ Egen (opens dialog)
```

### Design specifikationer
Fra 03_ONBOARDING_HABITS.md:

**Layout:**
- Back button
- Headline: "Hvad vil du gøre hver dag?"
- Subtitle: "Vælg 1-3 vaner for at starte"
- 2-column grid med habit chips
- Continue button

**Habit Chip States:**
```yaml
Unselected:
  background: #FFFFFF
  border: 1.5dp solid #E5EBE8

Selected:
  background: #2D5A4A (primary)
  border: none
  shadow: medium
  text_color: white
```

**Animations:**
- Entry: Staggered fade + scale in (50ms delay each)
- Selection: Scale bounce (1.0 → 1.05 → 1.0)
- Deselection: Scale (1.0 → 0.95 → 1.0)

## Dependencies Check
✅ Command 010 (Welcome Page) - skal være implementeret
✅ OnboardingViewModel - allerede oprettet i 010
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Implementer Habit Selection Page for Stribe onboarding:

1. **Opret Models/PresetHabit.cs**:
```csharp
namespace Stribe.Models;

public class PresetHabit
{
    public string Id { get; set; } = string.Empty;
    public string Emoji { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string DefaultName { get; set; } = string.Empty;
    public string DefaultColor { get; set; } = string.Empty;
    public bool IsCustom { get; set; }
    public bool IsSelected { get; set; }
}
```

2. **Opdater ViewModels/OnboardingViewModel.cs**:

Tilføj properties og commands:
```csharp
using System.Collections.ObjectModel;

// Properties
public ObservableCollection<PresetHabit> PresetHabits { get; set; }
public List<PresetHabit> SelectedHabits => PresetHabits.Where(h => h.IsSelected).ToList();
public bool CanContinue => SelectedHabits.Count >= 1 && SelectedHabits.Count <= 3;
public string ContinueButtonText => CanContinue ? "Fortsæt" : "Vælg mindst 1 vane";

// Commands
public ICommand ToggleHabitSelectionCommand { get; }
public ICommand ShowCustomHabitDialogCommand { get; }
public ICommand ContinueToReminderCommand { get; }

// Constructor - initialize preset habits
public OnboardingViewModel(...)
{
    PresetHabits = new ObservableCollection<PresetHabit>
    {
        new() { Id = "motion", Emoji = "🏃", Label = "Motion", DefaultName = "Motion", DefaultColor = "#4CAF50" },
        new() { Id = "reading", Emoji = "📚", Label = "Læse", DefaultName = "Læse", DefaultColor = "#2196F3" },
        new() { Id = "meditation", Emoji = "🧘", Label = "Meditation", DefaultName = "Meditation", DefaultColor = "#9C27B0" },
        new() { Id = "water", Emoji = "💧", Label = "Vand", DefaultName = "Drik vand", DefaultColor = "#00BCD4" },
        new() { Id = "journal", Emoji = "📝", Label = "Journal", DefaultName = "Skriv journal", DefaultColor = "#FFC107" },
        new() { Id = "custom", Emoji = "➕", Label = "Egen", IsCustom = true }
    };

    ToggleHabitSelectionCommand = new Command<PresetHabit>(OnToggleHabitSelection);
    ShowCustomHabitDialogCommand = new Command(OnShowCustomHabitDialog);
    ContinueToReminderCommand = new Command(OnContinueToReminder, () => CanContinue);
}

private void OnToggleHabitSelection(PresetHabit habit)
{
    if (habit.IsCustom)
    {
        ShowCustomHabitDialogCommand.Execute(null);
        return;
    }

    if (habit.IsSelected)
    {
        // Deselect
        habit.IsSelected = false;
    }
    else
    {
        // Check max 3 limit
        if (SelectedHabits.Count >= 3)
        {
            // Show toast or visual feedback
            return;
        }
        habit.IsSelected = true;
    }

    OnPropertyChanged(nameof(CanContinue));
    OnPropertyChanged(nameof(ContinueButtonText));
    ((Command)ContinueToReminderCommand).ChangeCanExecute();
}

private async void OnShowCustomHabitDialog()
{
    // Will be implemented in command 012
    // For now, just placeholder
    await Application.Current.MainPage.DisplayAlert("Info", "Custom habit dialog kommer i command 012", "OK");
}

private async void OnContinueToReminder()
{
    // Navigate to reminder setup page (command 013)
    await Shell.Current.GoToAsync("//onboarding/reminder");
}
```

3. **Opret Views/Onboarding/HabitSelectionPage.xaml**:
```xaml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewmodels="clr-namespace:Stribe.ViewModels"
             xmlns:models="clr-namespace:Stribe.Models"
             x:Class="Stribe.Views.Onboarding.HabitSelectionPage"
             x:DataType="viewmodels:OnboardingViewModel"
             BackgroundColor="{StaticResource Background}"
             NavigationPage.HasNavigationBar="False">

    <Grid RowDefinitions="Auto,*,Auto,Auto">

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
            <VerticalStackLayout Padding="24,16" Spacing="24">

                <!-- Title Section -->
                <VerticalStackLayout Spacing="8">
                    <Label Text="Hvad vil du gøre&#x0a;hver dag?"
                           Style="{StaticResource Headline}"
                           FontSize="24"
                           LineHeight="1.2" />

                    <Label Text="Vælg 1-3 vaner for at starte"
                           Style="{StaticResource Body}"
                           TextColor="{StaticResource TextSecondary}" />
                </VerticalStackLayout>

                <!-- Habit Grid -->
                <FlexLayout BindableLayout.ItemsSource="{Binding PresetHabits}"
                            Wrap="Wrap"
                            JustifyContent="SpaceBetween"
                            AlignContent="Start">

                    <BindableLayout.ItemTemplate>
                        <DataTemplate x:DataType="models:PresetHabit">
                            <Border StrokeThickness="1.5"
                                    Margin="0,0,0,12"
                                    WidthRequest="160"
                                    HeightRequest="100">

                                <Border.StrokeShape>
                                    <RoundRectangle CornerRadius="12" />
                                </Border.StrokeShape>

                                <!-- Triggers for selected/unselected state -->
                                <Border.Triggers>
                                    <DataTrigger TargetType="Border"
                                                 Binding="{Binding IsSelected}"
                                                 Value="True">
                                        <Setter Property="BackgroundColor" Value="{StaticResource Primary}" />
                                        <Setter Property="Stroke" Value="{StaticResource Primary}" />
                                    </DataTrigger>
                                    <DataTrigger TargetType="Border"
                                                 Binding="{Binding IsSelected}"
                                                 Value="False">
                                        <Setter Property="BackgroundColor" Value="{StaticResource Surface}" />
                                        <Setter Property="Stroke" Value="{StaticResource Border}" />
                                    </DataTrigger>
                                </Border.Triggers>

                                <Grid>
                                    <VerticalStackLayout HorizontalOptions="Center"
                                                         VerticalOptions="Center"
                                                         Spacing="8">
                                        <Label Text="{Binding Emoji}"
                                               FontSize="32"
                                               HorizontalOptions="Center" />

                                        <Label Text="{Binding Label}"
                                               FontSize="16"
                                               FontAttributes="Bold"
                                               HorizontalOptions="Center">
                                            <Label.Triggers>
                                                <DataTrigger TargetType="Label"
                                                             Binding="{Binding IsSelected}"
                                                             Value="True">
                                                    <Setter Property="TextColor" Value="White" />
                                                </DataTrigger>
                                                <DataTrigger TargetType="Label"
                                                             Binding="{Binding IsSelected}"
                                                             Value="False">
                                                    <Setter Property="TextColor" Value="{StaticResource TextPrimary}" />
                                                </DataTrigger>
                                            </Label.Triggers>
                                        </Label>
                                    </VerticalStackLayout>

                                    <!-- Tap gesture -->
                                    <Grid.GestureRecognizers>
                                        <TapGestureRecognizer
                                            Command="{Binding Source={RelativeSource AncestorType={x:Type viewmodels:OnboardingViewModel}}, Path=ToggleHabitSelectionCommand}"
                                            CommandParameter="{Binding .}" />
                                    </Grid.GestureRecognizers>
                                </Grid>
                            </Border>
                        </DataTemplate>
                    </BindableLayout.ItemTemplate>
                </FlexLayout>

            </VerticalStackLayout>
        </ScrollView>

        <!-- Continue Button -->
        <Button Grid.Row="2"
                Text="{Binding ContinueButtonText}"
                Style="{StaticResource PrimaryButton}"
                Command="{Binding ContinueToReminderCommand}"
                Margin="24,0,24,16" />

        <!-- Page Indicator -->
        <HorizontalStackLayout Grid.Row="3"
                               HorizontalOptions="Center"
                               Spacing="8"
                               Margin="0,0,0,24">
            <BoxView WidthRequest="8" HeightRequest="8" CornerRadius="4" Color="{StaticResource Border}" />
            <BoxView WidthRequest="8" HeightRequest="8" CornerRadius="4" Color="{StaticResource Primary}" />
            <BoxView WidthRequest="8" HeightRequest="8" CornerRadius="4" Color="{StaticResource Border}" />
        </HorizontalStackLayout>

    </Grid>
</ContentPage>
```

4. **Opret Views/Onboarding/HabitSelectionPage.xaml.cs**:
```csharp
namespace Stribe.Views.Onboarding;

public partial class HabitSelectionPage : ContentPage
{
    public HabitSelectionPage(OnboardingViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

5. **Registrer i MauiProgram.cs**:
```csharp
builder.Services.AddTransient<HabitSelectionPage>();
```

6. **Registrer route i AppShell.xaml.cs**:
```csharp
Routing.RegisterRoute("onboarding/habits", typeof(HabitSelectionPage));
```

Reference design: stribe-design/screens/03_ONBOARDING_HABITS.md
```

### Forventet resultat
- HabitSelectionPage med 2-column grid af preset habits
- Multi-selection virker (1-3 habits)
- Selected state vises visuelt (grøn baggrund, hvid tekst)
- Continue button enables/disables baseret på selection
- "Egen" chip åbner placeholder dialog (fuld impl i 012)
- Page indicator viser step 2 af 3

### Verifikation

#### Build test
```bash
dotnet build src/Stribe/Stribe.csproj
```

#### Unit tests
**Test selection logic:**
```
Scenario 1: Ingen selection → CanContinue = false
Scenario 2: 1 habit selected → CanContinue = true
Scenario 3: 3 habits selected → CanContinue = true
Scenario 4: Forsøg at select 4. habit → Skal blockes
Scenario 5: Deselect habit → State opdateres korrekt
```

#### Integration test i emulator
- [ ] Navigate fra Welcome Page til Habit Selection
- [ ] Tap på habit chip → bliver grøn med hvid tekst
- [ ] Tap igen → deselect virker
- [ ] Vælg 3 habits → 4. tap skal blockes
- [ ] Continue button text opdateres: "Vælg mindst 1 vane" → "Fortsæt"
- [ ] Tap Continue → navigate til reminder page
- [ ] Back button navigerer til Welcome Page
- [ ] Page indicator viser korrekt step (2/3)

### Acceptkriterier
- [ ] HabitSelectionPage.xaml med grid layout
- [ ] PresetHabit model oprettet
- [ ] OnboardingViewModel opdateret med selection logic
- [ ] 6 predefined habits vises korrekt
- [ ] Multi-selection (1-3) virker
- [ ] Visual feedback for selected/unselected state
- [ ] Continue button validation korrekt
- [ ] Page registered i routing
- [ ] Build succeeds
- [ ] Alle test scenarier passerer

## Status
- [ ] Analyse gennemført
- [ ] Dependencies verified
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
