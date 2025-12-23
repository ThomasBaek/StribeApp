# Command 024: Floating Action Button

## Metadata
- **Phase**: 3 - Core Experience
- **Dependencies**: 021
- **Estimated Time**: 1 hour
- **Status**: Pending
- **Design Reference**: stribe-design/screens/05_HOME.md (FAB section)
- **Frequency Impact**: NO

---

## Formål

Polish FAB (Floating Action Button) med shadow, animation, og korrekt positioning over scroll content.

**Hvorfor dette er vigtigt:**
- Primary action affordance (most important button)
- Material Design pattern (recognizable interaction)
- Tactile feedback (animation confirms tap)
- Depth perception (shadow creates hierarchy)

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

### Acceptkriterier
- [ ] FAB Border opdateret med x:Name="FAB"
- [ ] Shadow added (Opacity=0.25, Radius=12, Offset="0,4")
- [ ] OnFABTapped event handler in code-behind
- [ ] Scale animation (0.9 → 1.0, 100ms easing)
- [ ] NavigateToAddHabitCommand executes after animation
- [ ] 56x56 size (standard FAB)
- [ ] 28px corner radius (perfect circle)
- [ ] Build succeeds
- [ ] Tap feedback smooth

---

## Kode Evaluering

### Simplifikations-tjek
Denna implementation følger KISS princippet ved at:
- **Simple scale animation**: ScaleTo (0.9 → 1.0) - no complex keyframe animations
- **Built-in Shadow**: .NET MAUI Shadow primitive - no custom rendering
- **Event handler over Behavior**: OnFABTapped code-behind method - simpler than custom Behavior class
- **Await animation before command**: Sequential async (await ScaleTo → Execute command) - clear flow

### Alternativer overvejet

**Alternative 1: EventToCommandBehavior with animation**
```xaml
<Border.Behaviors>
    <behaviors:EventToCommandBehavior
        EventName="Tapped"
        Command="{Binding NavigateToAddHabitCommand}"
        PreCommandAction="{Binding AnimateFAB}" />
</Border.Behaviors>
```
**Hvorfor fravalgt**: Over-engineering. Custom Behavior adds complexity (PreCommandAction pattern, binding setup). Simple event handler in code-behind is clearer for single-use case.

**Alternative 2: VisualStateManager for pressed state**
```xaml
<VisualStateManager.VisualStateGroups>
    <VisualStateGroup Name="CommonStates">
        <VisualState Name="Pressed">
            <VisualState.Setters>
                <Setter Property="Scale" Value="0.9" />
            </VisualState.Setters>
        </VisualState>
    </VisualStateGroup>
</VisualStateManager.VisualStateGroups>
```
**Hvorfor fravalgt**: VSM is for state-driven UI (hover, focus, pressed). We want tap feedback animation (scale down → up on single tap), not persistent pressed state. Animation API is simpler.

**Alternative 3: Lottie animation on FAB**
```xaml
<lottie:LottieAnimationView Source="fab_ripple.json" />
```
**Hvorfor fravalgt**: Massive overkill. Lottie adds dependency, asset file. Simple scale animation is sufficient feedback and follows Material Design guidelines.

### Potentielle forbedringer (v2)
- Ripple effect on tap (circular expansion from tap point)
- Hide FAB on scroll down, show on scroll up (contextual visibility)
- Badge indicator (show "3 pending habits" count)
- Long-press menu (quick actions: add habit type 1, 2, 3)

### Kendte begrænsninger
- **No ripple effect**: Only scale animation. Material Design includes ripple. Could add in v2 with SkiaSharp or platform-specific renderers.
- **Shadow rendering varies by platform**: iOS shadow looks different from Android. May need platform-specific tuning (Shadow.Radius, Offset).
- **No scroll-based visibility**: FAB always visible. Could overlap content on small screens with many habits.

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple ScaleTo animation, built-in Shadow
- [x] **Læsbarhed**: Clear OnFABTapped method with await animation flow
- [x] **Animation**: Smooth easing (CubicOut/CubicIn), appropriate duration (100ms)
- [x] **Size**: Standard FAB (56x56) - thumb-friendly touch target
- [x] **Shadow**: Proper depth (12px radius, 4px Y offset) - floats above content
- [x] **Positioning**: Grid.Row overlay, End/End alignment, 20px margin
- [x] **Accessibility**: Large touch target, clear visual affordance (+ icon)
- [x] **Feedback**: Immediate animation on tap (no delay)

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/05_HOME.md (FAB section)
- **Pattern Reference**: Material Design FAB guidelines (56dp size, 6dp elevation)

---

## Notes

- **Animation Timing**: 100ms is Material Design standard for tap feedback - fast enough to feel responsive, slow enough to perceive
- **Easing Functions**: CubicOut (deceleration on scale down), CubicIn (acceleration on scale up) - creates bouncy feel
- **Shadow Values**: Opacity=0.25 (subtle), Radius=12 (soft edge), Offset Y=4 (below FAB) - simulates 6dp elevation
- **Z-Index Strategy**: FAB in Grid.Row="2" overlays ScrollView in same row - no AbsoluteLayout needed
- **Icon Choice**: "+" symbol (universal add affordance) - no localization needed

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
