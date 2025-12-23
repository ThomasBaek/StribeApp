# Command 017: Date Navigation Component

## Metadata
- **ID:** 017
- **Fase:** 3 - Core Experience
- **Estimeret tid:** 2 timer
- **Afhængigheder:** 016
- **Design reference:** stribe-design/screens/05_HOME.md (Date Header section)

## Formål
Polere date navigation component med swipe gestures, smooth animations, og Danish date formatting. Erstatte simple placeholder fra command 016.

## Risici
- **Lav risiko**: UI polish task
- **Opmærksomhed**:
  - Swipe gestures skal være smooth
  - Danish culture formatting
  - Relative dates ("I dag", "I går")

## Analyse

### Hvad skal implementeres
Date navigation med:
- Swipe left/right for date navigation
- Tap on date for date picker (optional v2)
- Smooth transition animations
- Danish date formatting
- "I dag" / "I går" relative dates

### Filer der ændres
- `src/Stribe/Views/HomePage.xaml` - Opdater date header
- `src/Stribe/Views/HomePage.xaml.cs` - Add swipe gestures

## Dependencies Check
✅ Command 016 (Home Page Layout) - implementeret
✅ HomeViewModel - har date navigation logic
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Opdater Date Navigation Component i HomePage:

**Opdater date header i Views/HomePage.xaml**:
```xaml
<!-- Replace existing date navigation Grid -->
<Grid Grid.Row="1"
      Padding="16"
      ColumnDefinitions="Auto,*,Auto">

    <SwipeView Grid.ColumnSpan="3">
        <SwipeView.LeftItems>
            <SwipeItems Mode="Execute">
                <SwipeItem Text="Næste"
                           BackgroundColor="{StaticResource Primary}"
                           Command="{Binding GoToNextDayCommand}" />
            </SwipeItems>
        </SwipeView.LeftItems>

        <SwipeView.RightItems>
            <SwipeItems Mode="Execute">
                <SwipeItem Text="Forrige"
                           BackgroundColor="{StaticResource Primary}"
                           Command="{Binding GoToPreviousDayCommand}" />
            </SwipeItems>
        </SwipeView.RightItems>

        <Grid ColumnDefinitions="Auto,*,Auto">
            <ImageButton Grid.Column="0"
                         Source="chevron_left.png"
                         HeightRequest="44"
                         WidthRequest="44"
                         Command="{Binding GoToPreviousDayCommand}"
                         Opacity="0.7" />

            <VerticalStackLayout Grid.Column="1"
                                 HorizontalOptions="Center"
                                 VerticalOptions="Center"
                                 Spacing="2">

                <Label Text="{Binding DateDisplayText}"
                       Style="{StaticResource Headline}"
                       FontSize="18"
                       HorizontalTextAlignment="Center" />

                <!-- "Gå til i dag" hvis ikke viewing today -->
                <Label Text="Tryk for i dag"
                       Style="{StaticResource Caption}"
                       FontSize="12"
                       TextColor="{StaticResource Primary}"
                       HorizontalTextAlignment="Center"
                       IsVisible="{Binding IsToday, Converter={StaticResource InvertedBoolConverter}}">
                    <Label.GestureRecognizers>
                        <TapGestureRecognizer Command="{Binding GoToTodayCommand}" />
                    </Label.GestureRecognizers>
                </Label>
            </VerticalStackLayout>

            <ImageButton Grid.Column="2"
                         Source="chevron_right.png"
                         HeightRequest="44"
                         WidthRequest="44"
                         Command="{Binding GoToNextDayCommand}"
                         IsEnabled="{Binding CanGoToNextDay}"
                         Opacity="{Binding CanGoToNextDay, Converter={StaticResource BoolToOpacityConverter}}" />
        </Grid>
    </SwipeView>
</Grid>
```

**Tilføj converters i App.xaml resources (hvis ikke findes)**:
```xaml
<Application.Resources>
    <ResourceDictionary>
        <!-- ... existing ... -->

        <converters:BoolToOpacityConverter x:Key="BoolToOpacityConverter" />
    </ResourceDictionary>
</Application.Resources>
```

**Opret Converters/BoolToOpacityConverter.cs**:
```csharp
using System.Globalization;

namespace Stribe.Converters;

public class BoolToOpacityConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is bool boolValue)
            return boolValue ? 1.0 : 0.3;
        return 0.3;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
```

Reference design: stribe-design/screens/05_HOME.md
```

### Forventet resultat
- Swipe left/right for date navigation
- Chevron buttons med opacity for disabled state
- "Tryk for i dag" link når ikke viewing today
- Danish formatted dates

### Verifikation
- [ ] Swipe gestures virker
- [ ] Date formatting korrekt
- [ ] "Gå til i dag" link vises korrekt

## Status
- [ ] Implementering gennemført
