# Command 017: Date Navigation Component

## Metadata
- **Phase**: 3 - Core Experience
- **Dependencies**: 016
- **Estimated Time**: 2 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/05_HOME.md (Date Header section)
- **Frequency Impact**: NO

---

## Formål

Polere date navigation component med swipe gestures, smooth animations, og Danish date formatting. Erstatte simple placeholder fra command 016.

**Hvorfor dette er vigtigt:**
- Intuitive date navigation (swipe = natural gesture)
- Danish UX (relative dates: "I dag", "I går")
- Quick return to today (single tap)
- Visual feedback for disabled states (opacity)

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

### Acceptkriterier
- [ ] SwipeView med left/right items added
- [ ] BoolToOpacityConverter oprettet og registreret
- [ ] Chevron buttons med opacity binding (disabled = 0.3)
- [ ] "Tryk for i dag" label med TapGestureRecognizer
- [ ] Danish date formatting ("I dag", "I går", "Tirsdag, 23. december")
- [ ] Smooth swipe experience
- [ ] Build succeeds
- [ ] All gestures functional

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Built-in SwipeView**: No custom gesture recognizers - uses .NET MAUI primitive
- **Simple converter**: BoolToOpacityConverter (1.0 : 0.3) - single-purpose, testable
- **ViewModel handles formatting**: UpdateDateDisplayText() in ViewModel - UI just binds
- **No animations**: Swipe transition built into SwipeView (no manual animation code)

### Alternativer overvejet

**Alternative 1: Custom SwipeGestureRecognizer**
```csharp
var swipeGesture = new SwipeGestureRecognizer { Direction = SwipeDirection.Left };
swipeGesture.Swiped += OnSwipedLeft;
```
**Hvorfor fravalgt**: SwipeView is higher-level and provides built-in swipe items (visual feedback). Custom recognizer requires manual threshold detection, animation. More code, worse UX.

**Alternative 2: DatePicker for date selection**
```xaml
<DatePicker Date="{Binding SelectedDate}" DateSelected="OnDateSelected" />
```
**Hvorfor fravalgt**: DatePicker is for arbitrary date selection. Our UX is sequential navigation (prev/next day). DatePicker adds modal dialog, keyboard input - unnecessary complexity. Reserve for future "jump to date" feature.

**Alternative 3: Carousel view for dates**
```xaml
<CarouselView ItemsSource="{Binding DateRange}" CurrentItem="{Binding SelectedDate}">
```
**Hvorfor fravalgt**: Over-engineering. CarouselView virtualizes infinite scrolling dates - complex data source management. Our simple prev/next commands are sufficient.

### Potentielle forbedringer (v2)
- Date picker on long-press (jump to arbitrary date)
- Animated date transitions (slide left/right on date change)
- Week view selector (show whole week, select day)
- Keyboard shortcuts (arrow keys for date navigation)

### Kendte begrænsninger
- **No date range limits**: User can swipe infinitely back in time. Could add "last 90 days" limit if database grows large.
- **No swipe threshold tuning**: SwipeView uses default threshold. Some users may want faster/slower swipe sensitivity.
- **Relative dates only for yesterday/today/tomorrow**: Other dates show full format. Could extend to "2 days ago", "last Monday", etc.

---

## Kode Kvalitet Checklist

- [x] **KISS**: SwipeView (built-in), simple converter, no custom animations
- [x] **Læsbarhed**: Clear SwipeView structure (LeftItems = Next, RightItems = Previous)
- [x] **Navngivning**: BoolToOpacityConverter (self-documenting)
- [x] **Converter**: Single-purpose (bool → opacity), testable, reusable
- [x] **Accessibility**: 44x44 touch targets, opacity visual feedback for disabled state
- [x] **Localization**: Danish CultureInfo for date formatting
- [x] **Bindings**: Proper use of IsEnabled (prevents command execution) + Opacity (visual feedback)
- [x] **UX**: "Tryk for i dag" hint only shown when not viewing today (conditional visibility)

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/05_HOME.md (Date Header section)
- **Related**: Command 015 (HomeViewModel date navigation logic)

---

## Notes

- **Swipe Direction**: SwipeView.LeftItems (swiping left reveals "Næste") vs SwipeView.RightItems (swiping right reveals "Forrige") - matches natural scrolling direction
- **Opacity Pattern**: Disabled buttons show at 30% opacity (0.3) - industry standard for disabled states
- **Danish Formatting**: Uses CultureInfo("da-DK") for proper Danish day/month names ("tirsdag", "december" - lowercase)
- **Relative Dates**: "I dag", "I går", "I morgen" - natural language reduces cognitive load

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
