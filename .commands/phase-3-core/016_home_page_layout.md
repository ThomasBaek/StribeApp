# Command 016: Home Page Layout

## Metadata
- **Phase**: 3 - Core Experience
- **Dependencies**: 015
- **Estimated Time**: 3 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/05_HOME.md
- **Frequency Impact**: NO

---

## Formål

Implementere Home Page layout structure - skelet til home screen med header, date navigation placeholder, habit list, og FAB. Detaljerede components implementeres i senere commands.

**Hvorfor dette er vigtigt:**
- Foundation for hele app'ens primary screen
- Grid layout etablerer korrekt visual hierarchy
- FAB pattern giver intuitive add-habit flow
- Scalable struktur for future components

## Risici
- **Lav risiko**: Standard layout implementation
- **Opmærksomhed**:
  - CollectionView setup for habit cards
  - FAB positioning (floating over content)
  - Empty state placeholder
- **Test**: Layout på forskellige skærmstørrelser

## Analyse

### Hvad skal implementeres
Home Page skeleton med:
- Header med app title og settings button
- Date navigation placeholder (component i 017)
- ScrollView/CollectionView for habit list
- Progress summary placeholder
- Floating Action Button (FAB)
- Empty state (full impl i 023)

### Filer der oprettes
- `src/Stribe/Views/HomePage.xaml` - Layout
- `src/Stribe/Views/HomePage.xaml.cs` - Code-behind

### Design specifikationer
Fra 05_HOME.md:
- Header: "Stribe" title, settings button
- Date header med navigation
- Habit list (scrollable)
- Progress summary text
- FAB bottom right

## Dependencies Check
✅ Command 015 (HomeViewModel) - implementeret
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Implementer Home Page Layout for Stribe:

**Opret Views/HomePage.xaml**:
```xaml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewmodels="clr-namespace:Stribe.ViewModels"
             xmlns:models="clr-namespace:Stribe.Models"
             x:Class="Stribe.Views.HomePage"
             x:DataType="viewmodels:HomeViewModel"
             BackgroundColor="{StaticResource Background}"
             NavigationPage.HasNavigationBar="False">

    <Grid RowDefinitions="Auto,Auto,*,Auto">

        <!-- Header -->
        <Border Grid.Row="0"
                BackgroundColor="{StaticResource Background}"
                Padding="16,8"
                StrokeThickness="0,0,0,1"
                Stroke="{StaticResource Border}">

            <Grid ColumnDefinitions="*,Auto">
                <Label Grid.Column="0"
                       Text="Stribe"
                       Style="{StaticResource Headline}"
                       FontSize="20"
                       TextColor="{StaticResource Primary}"
                       VerticalOptions="Center" />

                <ImageButton Grid.Column="1"
                             Source="settings.png"
                             HeightRequest="44"
                             WidthRequest="44"
                             Command="{Binding NavigateToSettingsCommand}" />
            </Grid>
        </Border>

        <!-- Date Navigation - placeholder for command 017 -->
        <Grid Grid.Row="1"
              Padding="16"
              ColumnDefinitions="Auto,*,Auto">

            <ImageButton Grid.Column="0"
                         Source="chevron_left.png"
                         HeightRequest="44"
                         WidthRequest="44"
                         Command="{Binding GoToPreviousDayCommand}" />

            <Label Grid.Column="1"
                   Text="{Binding DateDisplayText}"
                   Style="{StaticResource Headline}"
                   FontSize="18"
                   HorizontalOptions="Center"
                   VerticalOptions="Center" />

            <ImageButton Grid.Column="2"
                         Source="chevron_right.png"
                         HeightRequest="44"
                         WidthRequest="44"
                         Command="{Binding GoToNextDayCommand}"
                         IsEnabled="{Binding CanGoToNextDay}" />
        </Grid>

        <!-- Habit List -->
        <ScrollView Grid.Row="2">
            <VerticalStackLayout Padding="16,0,16,80" Spacing="12">

                <!-- Habit Cards Collection -->
                <BindableLayout.ItemsSource>
                    <Binding Path="Habits" />
                </BindableLayout.ItemsSource>

                <BindableLayout.ItemTemplate>
                    <DataTemplate x:DataType="models:HabitDisplayModel">
                        <!-- Placeholder for HabitCard component (command 020) -->
                        <Border Padding="16"
                                BackgroundColor="{StaticResource Surface}"
                                StrokeThickness="0"
                                Margin="0,0,0,12">
                            <Border.StrokeShape>
                                <RoundRectangle CornerRadius="12" />
                            </Border.StrokeShape>

                            <Grid RowDefinitions="Auto,Auto,Auto" ColumnDefinitions="Auto,*,Auto">
                                <!-- Row 0: Icon, Name, Streak -->
                                <Label Grid.Row="0" Grid.Column="0"
                                       Text="{Binding Icon}"
                                       FontSize="32"
                                       VerticalOptions="Center" />

                                <Label Grid.Row="0" Grid.Column="1"
                                       Text="{Binding Name}"
                                       Style="{StaticResource BodyBold}"
                                       FontSize="18"
                                       VerticalOptions="Center"
                                       Margin="12,0,0,0" />

                                <Label Grid.Row="0" Grid.Column="2"
                                       Text="{Binding StreakText}"
                                       Style="{StaticResource Caption}"
                                       VerticalOptions="Center"
                                       IsVisible="{Binding HasStreak}" />

                                <!-- Row 1: Week Progress Placeholder -->
                                <BoxView Grid.Row="1" Grid.ColumnSpan="3"
                                         HeightRequest="8"
                                         BackgroundColor="{StaticResource Border}"
                                         CornerRadius="4"
                                         Margin="0,12,0,0" />

                                <!-- Row 2: Completion Button -->
                                <Button Grid.Row="2" Grid.ColumnSpan="3"
                                        Text="{Binding CompletionText}"
                                        Style="{StaticResource OutlineButton}"
                                        Command="{Binding Source={RelativeSource AncestorType={x:Type viewmodels:HomeViewModel}}, Path=ToggleCompletionCommand}"
                                        CommandParameter="{Binding .}"
                                        Margin="0,12,0,0" />

                                <!-- Tap for detail -->
                                <Grid.GestureRecognizers>
                                    <TapGestureRecognizer
                                        Command="{Binding Source={RelativeSource AncestorType={x:Type viewmodels:HomeViewModel}}, Path=NavigateToDetailCommand}"
                                        CommandParameter="{Binding .}" />
                                </Grid.GestureRecognizers>
                            </Grid>
                        </Border>
                    </DataTemplate>
                </BindableLayout.ItemTemplate>

                <!-- Empty State Placeholder -->
                <VerticalStackLayout IsVisible="{Binding HasHabits, Converter={StaticResource InvertedBoolConverter}}"
                                     Padding="32"
                                     Spacing="16"
                                     VerticalOptions="Center">
                    <Label Text="🌱"
                           FontSize="64"
                           HorizontalOptions="Center" />
                    <Label Text="Ingen vaner endnu"
                           Style="{StaticResource Headline}"
                           HorizontalTextAlignment="Center" />
                    <Label Text="Tryk på + for at tilføje din første vane"
                           Style="{StaticResource Body}"
                           TextColor="{StaticResource TextSecondary}"
                           HorizontalTextAlignment="Center" />
                </VerticalStackLayout>

                <!-- Progress Summary -->
                <Label Text="{Binding ProgressText}"
                       Style="{StaticResource Caption}"
                       TextColor="{StaticResource TextSecondary}"
                       HorizontalTextAlignment="Center"
                       Margin="0,16,0,0"
                       IsVisible="{Binding HasHabits}" />

            </VerticalStackLayout>
        </ScrollView>

        <!-- FAB (Floating Action Button) -->
        <Border Grid.Row="2"
                WidthRequest="56"
                HeightRequest="56"
                BackgroundColor="{StaticResource Primary}"
                HorizontalOptions="End"
                VerticalOptions="End"
                Margin="0,0,16,16"
                StrokeThickness="0">
            <Border.StrokeShape>
                <RoundRectangle CornerRadius="28" />
            </Border.StrokeShape>

            <Border.Shadow>
                <Shadow Brush="Black" Opacity="0.3" Radius="8" Offset="0,4" />
            </Border.Shadow>

            <Label Text="+"
                   FontSize="32"
                   TextColor="White"
                   HorizontalOptions="Center"
                   VerticalOptions="Center">
                <Label.GestureRecognizers>
                    <TapGestureRecognizer Command="{Binding NavigateToAddHabitCommand}" />
                </Label.GestureRecognizers>
            </Label>
        </Border>

    </Grid>
</ContentPage>
```

**Opret Views/HomePage.xaml.cs**:
```csharp
namespace Stribe.Views;

public partial class HomePage : ContentPage
{
    private readonly HomeViewModel _viewModel;

    public HomePage(HomeViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = _viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _viewModel.LoadHabitsCommand.ExecuteAsync(null);
    }
}
```

**Registrer i MauiProgram.cs**:
```csharp
builder.Services.AddSingleton<HomePage>();
```

Reference design: stribe-design/screens/05_HOME.md
```

### Forventet resultat
- HomePage med header, date nav, habit list, FAB
- Placeholder habit cards (uden animations)
- Empty state vises når ingen habits
- FAB floating bottom right
- Settings button navigerer

### Verifikation
- [ ] Build succeeds
- [ ] Layout vises korrekt
- [ ] Date navigation virker
- [ ] Empty state vises
- [ ] FAB klikbar

### Acceptkriterier
- [ ] HomePage.xaml oprettet med 4-row Grid layout
- [ ] Header med title og settings button
- [ ] Date navigation placeholder (refined in Command 017)
- [ ] Scrollable habit list med BindableLayout
- [ ] Placeholder HabitCard template
- [ ] Empty state placeholder (refined in Command 023)
- [ ] FAB positioned bottom-right with shadow
- [ ] Registreret i DI container
- [ ] Build succeeds
- [ ] Layout responsive på forskellige skærme

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Simple Grid layout**: 4-row structure (header, date nav, content, FAB) - clear hierarchy
- **BindableLayout over CollectionView**: Simpler for small lists (typical: 5-10 habits)
- **Placeholder components**: Postpone polish til dedicated commands (017, 018, 023, 024)
- **No custom controls yet**: Standard XAML elements (Border, Label, Button)

### Alternativer overvejet

**Alternative 1: CollectionView instead of BindableLayout**
```xaml
<CollectionView ItemsSource="{Binding Habits}">
    <CollectionView.ItemTemplate>
        <DataTemplate>
            <!-- HabitCard -->
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```
**Hvorfor fravalgt**: Over-engineering for MVP. CollectionView adds complexity (virtualization, item selection). BindableLayout is simpler for small lists and sufficient for typical usage (5-10 habits). Switch to CollectionView in v2 if users report 20+ habits.

**Alternative 2: Custom ContentPage base class**
```csharp
public class BaseContentPage : ContentPage
{
    protected Grid RootLayout { get; set; }
    // Shared header setup
}
```
**Hvorfor fravalgt**: YAGNI. HomePage er kun én page. No reuse benefit. Custom base adds indirection.

**Alternative 3: AbsoluteLayout for FAB positioning**
```xaml
<AbsoluteLayout>
    <!-- Content -->
    <Border AbsoluteLayout.LayoutBounds="1,1,56,56" />
</AbsoluteLayout>
```
**Hvorfor fravalgt**: Grid med overlapping rows (FAB in Grid.Row="2" over ScrollView) is simpler. AbsoluteLayout is harder to maintain (magic numbers).

### Potentielle forbedringer (v2)
- Switch to CollectionView hvis users have 20+ habits (virtualization benefit)
- Pull-to-refresh gesture (not needed - real-time via ViewModel)
- Skeleton loading state under habit cards (nice-to-have, not MVP)
- Swipe gestures på habit cards (delete, edit) - Later command

### Kendte begrænsninger
- **No virtualization**: BindableLayout renders all items. Acceptable for 5-10 habits. Monitor in production.
- **FAB overlaps scroll content**: Bottom padding (80px) on VerticalStackLayout prevents overlap. User must scroll to see habits under FAB.
- **Placeholder visuals**: Basic cards without animations, polish, custom rendering. Addressed in later commands.

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple Grid layout, standard XAML controls
- [x] **Læsbarhed**: Clear Grid row definitions, logical ordering (header → nav → content → FAB)
- [x] **Navngivning**: Semantic element naming (Header Border, Date Navigation Grid)
- [x] **Layout**: Proper use of Border StrokeShape (rounded corners), Shadow (FAB depth)
- [x] **Spacing**: Consistent padding (16px), margin (12px between cards)
- [x] **Bindings**: StaticResource for colors/styles, Binding for data
- [x] **Accessibility**: HeightRequest/WidthRequest on tap targets (44x44 ImageButton)
- [x] **Empty state**: Proper handling with IsVisible binding
- [x] **Responsiveness**: Grid auto-sizing, ScrollView adapts to content

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/05_HOME.md
- **Component Specs**:
  - HABIT_CARD.md (placeholder template)
  - DATE_NAVIGATION.md (placeholder, refined in 017)
- **Related Commands**:
  - Command 017 (Date Navigation polish)
  - Command 018 (Week Progress component)
  - Command 023 (Empty State polish)
  - Command 024 (FAB polish)

---

## Notes

- **Layout Strategy**: 4-row Grid provides clear separation: Fixed header (Auto) → Fixed nav (Auto) → Scrollable content (*) → Floating FAB (overlays row 2)
- **FAB Positioning**: FAB placed in Grid.Row="2" (overlays ScrollView) med HorizontalOptions="End" + VerticalOptions="End" + Margin for bottom-right positioning
- **Placeholder Philosophy**: This command creates skeleton. Components polished in dedicated commands for focused iteration.
- **XAML Best Practice**: Border with RoundRectangle StrokeShape for rounded corners (modern approach, better than legacy CornerRadius on Frame)

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
