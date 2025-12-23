# Command 024: Floating Action Button

## Metadata
- **ID:** 024
- **Fase:** 3 - Core Experience
- **Estimeret tid:** 1 time
- **Afhængigheder:** 021
- **Design reference:** stribe-design/screens/05_HOME.md (FAB section)

## Formål
Polish FAB (Floating Action Button) med shadow, animation, og korrekt positioning over scroll content.

## Risici
- **Lav risiko**: UI polish
- **Opmærksomhed**:
  - FAB skal float over scroll content
  - Shadow skal være synlig
  - Tap animation for feedback

## Analyse

### Hvad skal implementeres
- Polished FAB design
- Shadow effect
- Tap animation (scale down/up)
- Correct z-index positioning

### Filer der ændres
- `src/Stribe/Views/HomePage.xaml` - Polish FAB

## Dependencies Check
✅ Command 021 (Home Habit List) - implementeret
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Polish Floating Action Button i HomePage:

**Opdater FAB i Views/HomePage.xaml**:
```xaml
<!-- Replace existing FAB -->
<Border Grid.Row="2"
        x:Name="FAB"
        WidthRequest="56"
        HeightRequest="56"
        BackgroundColor="{StaticResource Primary}"
        HorizontalOptions="End"
        VerticalOptions="End"
        Margin="0,0,20,20"
        StrokeThickness="0">
    <Border.StrokeShape>
        <RoundRectangle CornerRadius="28" />
    </Border.StrokeShape>

    <Border.Shadow>
        <Shadow Brush="Black"
                Opacity="0.25"
                Radius="12"
                Offset="0,4" />
    </Border.Shadow>

    <Label Text="+"
           FontSize="32"
           FontAttributes="Bold"
           TextColor="White"
           HorizontalOptions="Center"
           VerticalOptions="Center">
        <Label.GestureRecognizers>
            <TapGestureRecognizer Tapped="OnFABTapped" />
        </Label.GestureRecognizers>
    </Label>
</Border>
```

**Add FAB animation i Views/HomePage.xaml.cs**:
```csharp
private async void OnFABTapped(object sender, EventArgs e)
{
    // Animate FAB
    await FAB.ScaleTo(0.9, 100, Easing.CubicOut);
    await FAB.ScaleTo(1.0, 100, Easing.CubicIn);

    // Execute command
    if (_viewModel.NavigateToAddHabitCommand.CanExecute(null))
    {
        _viewModel.NavigateToAddHabitCommand.Execute(null);
    }
}
```

Reference design: stribe-design/screens/05_HOME.md
```

### Forventet resultat
- FAB with shadow
- Tap animation (scale)
- Navigates to add habit page

### Verifikation
- [ ] Shadow visible
- [ ] Tap animation smooth
- [ ] Navigation works

## Status
- [ ] Implementering gennemført
