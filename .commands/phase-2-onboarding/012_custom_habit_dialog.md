# Command 012: Custom Habit Dialog

## Metadata
- **ID:** 012
- **Fase:** 2 - Onboarding
- **Estimeret tid:** 3 timer
- **Afhængigheder:** 011
- **Design reference:** stribe-design/screens/03_ONBOARDING_HABITS.md (Custom Dialog section)

## Formål
Implementere bottom sheet dialog hvor brugeren kan oprette en custom habit med navn og emoji. Dette åbnes når brugeren tapper på "Egen" chip i habit selection.

## Risici
- **Lav risiko**: Standard modal dialog pattern
- **Opmærksomhed**:
  - Input validation (navn minimum 1 karakter, max 30)
  - Emoji picker skal være brugervenlig
  - Dialog skal dismiss korrekt og tilføje habit til selection
- **Test**: Dialog lifecycle og data persistence

## Analyse

### Hvad skal implementeres
Custom habit bottom sheet med:
- Drag handle
- Title: "Tilføj egen vane"
- Text input for habit navn (max 30 tegn)
- Horizontal scroll emoji picker
- "Tilføj" button (enabled når navn udfyldt)
- Cancel ved swipe down eller tap udenfor

### Filer der oprettes/ændres
- `src/Stribe/Views/Onboarding/CustomHabitSheet.xaml` - Bottom sheet layout
- `src/Stribe/Views/Onboarding/CustomHabitSheet.xaml.cs` - Code-behind
- `src/Stribe/ViewModels/OnboardingViewModel.cs` - Updated med custom habit logic
- `src/Stribe/Helpers/Constants.cs` - Add common emoji list

### Design specifikationer
Fra 03_ONBOARDING_HABITS.md Custom Dialog section:

**Layout:**
```yaml
- Handle (40dp × 4dp, centered)
- Title: "Tilføj egen vane"
- Name input field
- Emoji picker (horizontal scroll)
- Confirm button
```

**Emoji palette:**
Common emojis: 🏃, 📚, 🧘, 💧, 📝, 🎯, 💪, 🌱, 🎨, 🎵, 🍎, 😊, 🔥, ⭐, 💡, 🌿, 🏆, 📱, ☕, 🚶

**Validation:**
- Name required (minimum 1 character)
- Max 30 characters
- Emoji optional (default 🌿 if none selected)

## Dependencies Check
✅ Command 011 (Habit Selection Page) - skal være implementeret
✅ OnboardingViewModel - eksisterer
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Implementer Custom Habit Dialog for Stribe onboarding:

1. **Opdater Helpers/Constants.cs**:

Tilføj emoji liste:
```csharp
public static class Constants
{
    // Existing constants...

    public static readonly string[] CommonEmojis = new[]
    {
        "🏃", "📚", "🧘", "💧", "📝", "🎯", "💪", "🌱",
        "🎨", "🎵", "🍎", "😊", "🔥", "⭐", "💡", "🌿",
        "🏆", "📱", "☕", "🚶", "🎮", "🧠", "❤️", "🌙"
    };
}
```

2. **Opdater ViewModels/OnboardingViewModel.cs**:

Tilføj properties og commands for custom habit:
```csharp
// Properties for custom habit dialog
public string CustomHabitName { get; set; } = string.Empty;
public string CustomHabitEmoji { get; set; } = "🌿";
public ObservableCollection<string> AvailableEmojis { get; set; }
public bool CanAddCustomHabit => !string.IsNullOrWhiteSpace(CustomHabitName) && CustomHabitName.Length <= 30;

// Commands
public ICommand SelectEmojiCommand { get; }
public ICommand AddCustomHabitCommand { get; }
public ICommand CancelCustomHabitCommand { get; }

// In constructor
AvailableEmojis = new ObservableCollection<string>(Constants.CommonEmojis);
SelectEmojiCommand = new Command<string>(OnSelectEmoji);
AddCustomHabitCommand = new Command(OnAddCustomHabit, () => CanAddCustomHabit);
CancelCustomHabitCommand = new Command(OnCancelCustomHabit);

// Methods
private void OnSelectEmoji(string emoji)
{
    CustomHabitEmoji = emoji;
    OnPropertyChanged(nameof(CustomHabitEmoji));
}

private async void OnAddCustomHabit()
{
    if (SelectedHabits.Count >= 3)
    {
        await Application.Current.MainPage.DisplayAlert("Max 3 vaner", "Du kan kun vælge op til 3 vaner for at starte", "OK");
        return;
    }

    var customHabit = new PresetHabit
    {
        Id = Guid.NewGuid().ToString(),
        Emoji = CustomHabitEmoji,
        Label = CustomHabitName,
        DefaultName = CustomHabitName,
        DefaultColor = "#2D5A4A", // Default green
        IsCustom = false, // Now it's a real habit
        IsSelected = true
    };

    // Add to preset habits (which is bound to UI)
    PresetHabits.Insert(PresetHabits.Count - 1, customHabit); // Insert before "Egen" chip

    // Reset dialog state
    CustomHabitName = string.Empty;
    CustomHabitEmoji = "🌿";
    OnPropertyChanged(nameof(CanContinue));
    OnPropertyChanged(nameof(ContinueButtonText));
    ((Command)ContinueToReminderCommand).ChangeCanExecute();

    // Close dialog
    await Shell.Current.Navigation.PopModalAsync();
}

private async void OnCancelCustomHabit()
{
    CustomHabitName = string.Empty;
    CustomHabitEmoji = "🌿";
    await Shell.Current.Navigation.PopModalAsync();
}

// Update OnShowCustomHabitDialog from command 011
private async void OnShowCustomHabitDialog()
{
    if (SelectedHabits.Count >= 3)
    {
        await Application.Current.MainPage.DisplayAlert("Max 3 vaner", "Fjern en vane først for at tilføje en egen", "OK");
        return;
    }

    var dialog = new CustomHabitSheet { BindingContext = this };
    await Shell.Current.Navigation.PushModalAsync(dialog);
}
```

3. **Opret Views/Onboarding/CustomHabitSheet.xaml**:
```xaml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewmodels="clr-namespace:Stribe.ViewModels"
             x:Class="Stribe.Views.Onboarding.CustomHabitSheet"
             x:DataType="viewmodels:OnboardingViewModel"
             BackgroundColor="Transparent">

    <!-- Semi-transparent background -->
    <Grid>
        <BoxView BackgroundColor="Black" Opacity="0.3">
            <BoxView.GestureRecognizers>
                <TapGestureRecognizer Command="{Binding CancelCustomHabitCommand}" />
            </BoxView.GestureRecognizers>
        </BoxView>

        <!-- Bottom sheet -->
        <Border VerticalOptions="End"
                BackgroundColor="{StaticResource Surface}"
                Padding="24"
                StrokeThickness="0">

            <Border.StrokeShape>
                <RoundRectangle CornerRadius="24,24,0,0" />
            </Border.StrokeShape>

            <VerticalStackLayout Spacing="16">

                <!-- Drag handle -->
                <BoxView WidthRequest="40"
                         HeightRequest="4"
                         CornerRadius="2"
                         BackgroundColor="{StaticResource Border}"
                         HorizontalOptions="Center"
                         Margin="0,0,0,8" />

                <!-- Title -->
                <Label Text="Tilføj egen vane"
                       Style="{StaticResource Headline}"
                       FontSize="20" />

                <!-- Name input -->
                <Entry Placeholder="Navn på vane"
                       Text="{Binding CustomHabitName}"
                       MaxLength="30"
                       ClearButtonVisibility="WhileEditing"
                       ReturnType="Done"
                       TextChanged="OnNameChanged" />

                <!-- Character count -->
                <Label Text="{Binding CustomHabitName.Length, StringFormat='{0}/30 tegn'}"
                       FontSize="12"
                       TextColor="{StaticResource TextSecondary}"
                       HorizontalOptions="End"
                       Margin="0,-8,0,0" />

                <!-- Emoji picker label -->
                <Label Text="Vælg ikon"
                       Style="{StaticResource BodyMedium}"
                       Margin="0,8,0,0" />

                <!-- Selected emoji display -->
                <Border Padding="16"
                        BackgroundColor="{StaticResource PrimaryLight}"
                        StrokeThickness="0"
                        HorizontalOptions="Start">
                    <Border.StrokeShape>
                        <RoundRectangle CornerRadius="12" />
                    </Border.StrokeShape>
                    <Label Text="{Binding CustomHabitEmoji}"
                           FontSize="40" />
                </Border>

                <!-- Emoji picker scroll -->
                <ScrollView Orientation="Horizontal" HeightRequest="60">
                    <FlexLayout BindableLayout.ItemsSource="{Binding AvailableEmojis}"
                                Direction="Row"
                                AlignItems="Center"
                                JustifyContent="Start">

                        <BindableLayout.ItemTemplate>
                            <DataTemplate x:DataType="x:String">
                                <Border Padding="8"
                                        Margin="4"
                                        StrokeThickness="0">
                                    <Border.StrokeShape>
                                        <RoundRectangle CornerRadius="8" />
                                    </Border.StrokeShape>

                                    <Label Text="{Binding .}"
                                           FontSize="32">
                                        <Label.GestureRecognizers>
                                            <TapGestureRecognizer
                                                Command="{Binding Source={RelativeSource AncestorType={x:Type viewmodels:OnboardingViewModel}}, Path=SelectEmojiCommand}"
                                                CommandParameter="{Binding .}" />
                                        </Label.GestureRecognizers>
                                    </Label>
                                </Border>
                            </DataTemplate>
                        </BindableLayout.ItemTemplate>
                    </FlexLayout>
                </ScrollView>

                <!-- Add button -->
                <Button Text="Tilføj"
                        Style="{StaticResource PrimaryButton}"
                        Command="{Binding AddCustomHabitCommand}"
                        Margin="0,16,0,0" />

            </VerticalStackLayout>
        </Border>
    </Grid>
</ContentPage>
```

4. **Opret Views/Onboarding/CustomHabitSheet.xaml.cs**:
```csharp
namespace Stribe.Views.Onboarding;

public partial class CustomHabitSheet : ContentPage
{
    public CustomHabitSheet()
    {
        InitializeComponent();
    }

    private void OnNameChanged(object sender, TextChangedEventArgs e)
    {
        if (BindingContext is OnboardingViewModel vm)
        {
            vm.OnPropertyChanged(nameof(vm.CanAddCustomHabit));
            ((Command)vm.AddCustomHabitCommand).ChangeCanExecute();
        }
    }
}
```

5. **Registrer i MauiProgram.cs**:
```csharp
builder.Services.AddTransient<CustomHabitSheet>();
```

Reference design: stribe-design/screens/03_ONBOARDING_HABITS.md
```

### Forventet resultat
- Bottom sheet dialog med rounded top corners
- Name input med character counter (max 30)
- Horizontal scrolling emoji picker
- Selected emoji vises i highlighted box
- Add button enables/disables baseret på navn
- Dialog closes ved tap udenfor eller cancel
- Custom habit tilføjes til selection i parent page

### Verifikation

#### Build test
```bash
dotnet build src/Stribe/Stribe.csproj
```

#### Unit tests
**Test custom habit logic:**
```
Scenario 1: Empty name → CanAddCustomHabit = false
Scenario 2: Valid name → CanAddCustomHabit = true
Scenario 3: Name > 30 chars → Entry blocks input
Scenario 4: Select emoji → CustomHabitEmoji updates
Scenario 5: Add habit → habit tilføjes til PresetHabits
```

#### Integration test i emulator
- [ ] Tap "Egen" chip → dialog åbnes
- [ ] Dialog har rounded top corners og semi-transparent backdrop
- [ ] Tap udenfor → dialog lukker
- [ ] Type habit navn → character counter opdateres
- [ ] Add button disabled når navn tomt
- [ ] Scroll horizontal i emoji picker
- [ ] Tap emoji → vises i highlighted box
- [ ] Tap "Tilføj" → habit tilføjes til selection
- [ ] Dialog lukker efter tilføjelse
- [ ] Custom habit vises i grid med selected state
- [ ] Tap "Egen" når 3 habits selected → viser alert

### Acceptkriterier
- [ ] CustomHabitSheet.xaml med bottom sheet layout
- [ ] OnboardingViewModel opdateret med custom habit logic
- [ ] Constants opdateret med emoji liste
- [ ] Name input validation (1-30 chars)
- [ ] Emoji picker med horizontal scroll
- [ ] Selected emoji highlight virker
- [ ] Add button validation korrekt
- [ ] Dialog lifecycle virker (åbn/luk)
- [ ] Custom habit tilføjes korrekt til selection
- [ ] Build succeeds
- [ ] Alle test scenarier passerer

## Status
- [ ] Analyse gennemført
- [ ] Dependencies verified
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
