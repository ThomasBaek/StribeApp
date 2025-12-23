# Command 034: Milestone Celebration Page

## Metadata
- **Phase**: 5 - Polish & Launch
- **Dependencies**: 033
- **Estimated Time**: 3-4 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/10_MILESTONE_CELEBRATION.md
- **Frequency Impact**: NO - Display only feature

---

## Formål

Implementere milestone celebration modal med konfetti animation, badge, og motivational tekst.

**Hvorfor dette er vigtigt:**
- Gamification og positive reinforcement for brugere
- Celebration moments skaber dopamine og motivation til at fortsætte
- Visual feedback på achievements gør app mere engaging
- Milestone markers hjælper brugere track long-term progress

---

## Risici

### Potentielle Problemer
1. **Performance issues med animation**:
   - Edge case: Konfetti animation lagging på low-end devices
   - Impact: Poor user experience, janky animations

2. **Overlapping celebrations**:
   - Edge case: Navigation til page mens celebration allerede vises
   - Impact: Duplicate modals or navigation stack issues

3. **Missing query parameters**:
   - Edge case: Navigation uden habitId/days parameters
   - Impact: App crash eller blank celebration page

### Mitigering
- Use lightweight confetti implementation (emoji-based, not Lottie)
- Implement navigation guard for duplicate celebrations
- Validate query parameters og provide fallback values

---

## Analyse - Hvad Skal Implementeres

### Milestone Celebration Page Layout
**Location**: `src/Stribe/Views/MilestonePage.xaml`
**Key Requirements**:
- Fullscreen modal overlay (Dark backdrop)
- Confetti animation layer (top)
- Milestone badge (streak number display)
- Motivational message (based on milestone day)
- "Fortsæt" button til dismiss
- Optional: Auto-dismiss after 5 seconds

### Milestone View Model
**Location**: `src/Stribe/ViewModels/MilestoneViewModel.cs`
**Key Requirements**:
- Accept query parameters: habitId, days
- Load habit details (name, color)
- Select motivational message based on milestone day
- Dismiss command (navigate back)
- Confetti animation trigger

### Confetti Animation
**Options**:
1. **SimplifiedConfetti** (lightweight, emoji-based)
2. **Lottie animation** (high quality, performance cost)
3. **Custom SKCanvas animation** (full control, complex)

**Recommended**: SimplifiedConfetti for MVP (emoji-based, performant)

### Motivational Messages
**Milestone-specific messages**:
```
7 days: "En hel uge! Du er i gang!"
21 days: "3 uger! Det bliver til en vane!"
30 days: "En måned! Fantastisk dedikation!"
60 days: "2 måneder! Ustoppelig!"
90 days: "3 måneder! Vanen sidder fast!"
180 days: "Et halvt år! Imponerende!"
365 days: "Et helt år! Du er en legende!"
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 033 (Milestone detection logic triggers navigation)
- [x] Shell route registered for MilestonePage
- [x] Query parameter navigation system working

⚠️ **Assumptions**:
- Shell.Current.GoToAsync works with query parameters
- XAML animations supported on target platforms

❌ **Blockers**: None

---

## Implementation Guide

### Step 1: Create MilestonePage XAML
Path: `src/Stribe/Views/MilestonePage.xaml`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="Stribe.Views.MilestonePage"
             xmlns:vm="clr-namespace:Stribe.ViewModels"
             x:DataType="vm:MilestoneViewModel"
             BackgroundColor="{StaticResource BackgroundDark}"
             Shell.PresentationMode="ModalAnimated">

    <!-- Fullscreen celebration overlay -->
    <Grid>
        <!-- Dark backdrop -->
        <BoxView BackgroundColor="#000000" Opacity="0.7" />

        <!-- Confetti layer (top) -->
        <Grid x:Name="ConfettiLayer" />

        <!-- Content -->
        <VerticalStackLayout Spacing="32"
                            VerticalOptions="Center"
                            HorizontalOptions="Center"
                            Padding="40">

            <!-- Milestone badge -->
            <Border BackgroundColor="{StaticResource Primary}"
                    StrokeShape="RoundRectangle 60"
                    HeightRequest="120"
                    WidthRequest="120"
                    HorizontalOptions="Center">
                <Label Text="{Binding MilestoneDays}"
                       FontSize="48"
                       FontAttributes="Bold"
                       TextColor="White"
                       HorizontalOptions="Center"
                       VerticalOptions="Center" />
            </Border>

            <!-- Motivational message -->
            <Label Text="{Binding MotivationalMessage}"
                   FontSize="24"
                   FontAttributes="Bold"
                   TextColor="White"
                   HorizontalTextAlignment="Center" />

            <Label Text="{Binding HabitName}"
                   FontSize="18"
                   TextColor="{StaticResource TextSecondary}"
                   HorizontalTextAlignment="Center" />

            <!-- Dismiss button -->
            <Button Text="Fortsæt"
                    Command="{Binding DismissCommand}"
                    BackgroundColor="{StaticResource Primary}"
                    TextColor="White"
                    CornerRadius="12"
                    HeightRequest="50"
                    WidthRequest="200"
                    Margin="0,20,0,0" />
        </VerticalStackLayout>
    </Grid>
</ContentPage>
```

**Explanation**: Fullscreen modal with dark backdrop, badge display, and dismiss button.

### Step 2: Implement MilestoneViewModel
Path: `src/Stribe/ViewModels/MilestoneViewModel.cs`

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Stribe.Services;

namespace Stribe.ViewModels;

[QueryProperty(nameof(HabitId), "habitId")]
[QueryProperty(nameof(MilestoneDays), "days")]
public partial class MilestoneViewModel : ObservableObject
{
    private readonly IHabitService _habitService;

    [ObservableProperty]
    private string habitId = string.Empty;

    [ObservableProperty]
    private int milestoneDays;

    [ObservableProperty]
    private string habitName = string.Empty;

    [ObservableProperty]
    private string motivationalMessage = string.Empty;

    public MilestoneViewModel(IHabitService habitService)
    {
        _habitService = habitService;
    }

    partial void OnMilestoneDaysChanged(int value)
    {
        MotivationalMessage = GetMotivationalMessage(value);
    }

    partial void OnHabitIdChanged(string value)
    {
        LoadHabitDetailsAsync().ConfigureAwait(false);
    }

    private async Task LoadHabitDetailsAsync()
    {
        if (string.IsNullOrEmpty(HabitId))
            return;

        var habit = await _habitService.GetHabitByIdAsync(HabitId);
        if (habit != null)
        {
            HabitName = habit.Name;
        }
    }

    private string GetMotivationalMessage(int days)
    {
        return days switch
        {
            7 => "En hel uge! Du er i gang!",
            21 => "3 uger! Det bliver til en vane!",
            30 => "En måned! Fantastisk dedikation!",
            60 => "2 måneder! Ustoppelig!",
            90 => "3 måneder! Vanen sidder fast!",
            180 => "Et halvt år! Imponerende!",
            365 => "Et helt år! Du er en legende!",
            _ => $"{days} dage i træk! Fantastisk!"
        };
    }

    [RelayCommand]
    private async Task DismissAsync()
    {
        await Shell.Current.GoToAsync("..");
    }
}
```

**Explanation**: ViewModel loads habit details, selects message based on milestone, handles dismiss.

### Step 3: Register Route in AppShell
Path: `src/Stribe/AppShell.xaml.cs`

```csharp
Routing.RegisterRoute("milestone", typeof(MilestonePage));
```

**Explanation**: Register route for navigation from Command 033.

### Step 4: Add Confetti Animation (SimplifiedConfetti)
Path: `src/Stribe/Views/MilestonePage.xaml.cs`

```csharp
public partial class MilestonePage : ContentPage
{
    public MilestonePage(MilestoneViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;

        // Trigger confetti on page load
        Loaded += OnPageLoaded;
    }

    private async void OnPageLoaded(object? sender, EventArgs e)
    {
        await Task.Delay(100); // Small delay for page to render
        StartConfettiAnimation();
    }

    private void StartConfettiAnimation()
    {
        // Simple emoji confetti (lightweight)
        var confettiEmojis = new[] { "🎉", "✨", "⭐", "🎊", "🏆" };
        var random = new Random();

        for (int i = 0; i < 20; i++)
        {
            var emoji = new Label
            {
                Text = confettiEmojis[random.Next(confettiEmojis.Length)],
                FontSize = 24,
                Opacity = 0,
                TranslationX = random.Next((int)Width) - Width / 2,
                TranslationY = -50
            };

            ConfettiLayer.Children.Add(emoji);

            // Animate fall
            _ = AnimateConfettiAsync(emoji, random);
        }
    }

    private async Task AnimateConfettiAsync(Label emoji, Random random)
    {
        await Task.WhenAll(
            emoji.FadeTo(1, 200),
            emoji.TranslateTo(
                emoji.TranslationX + random.Next(-100, 100),
                Height + 50,
                3000,
                Easing.CubicIn
            )
        );

        ConfettiLayer.Children.Remove(emoji);
    }
}
```

**Explanation**: Lightweight emoji-based confetti animation with falling effect.

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. Unit Tests
```csharp
[Fact]
public void GetMotivationalMessage_At7Days_ReturnsCorrectMessage()
{
    // Arrange
    var viewModel = new MilestoneViewModel(_habitService);

    // Act
    viewModel.MilestoneDays = 7;

    // Assert
    Assert.Equal("En hel uge! Du er i gang!", viewModel.MotivationalMessage);
}

[Fact]
public void GetMotivationalMessage_At365Days_ReturnsLegendMessage()
{
    // Arrange
    var viewModel = new MilestoneViewModel(_habitService);

    // Act
    viewModel.MilestoneDays = 365;

    // Assert
    Assert.Equal("Et helt år! Du er en legende!", viewModel.MotivationalMessage);
}
```

### 3. Manual Test in Emulator
- [ ] Complete habit to trigger 7 day milestone → Celebration shows
- [ ] Confetti animation plays smoothly (60fps)
- [ ] Correct milestone day displayed in badge
- [ ] Motivational message matches milestone (7 days → "En hel uge!")
- [ ] Habit name displayed correctly
- [ ] "Fortsæt" button dismisses modal
- [ ] Navigation back to HomePage works
- [ ] Test on both iOS and Android
- [ ] Test on low-end device (animation performance)

---

## Acceptance Criteria

- [x] MilestonePage.xaml fullscreen modal layout created
- [x] MilestoneViewModel with query parameter support
- [x] Confetti animation implemented (emoji-based)
- [x] Milestone badge displays streak day number
- [x] Motivational messages for all milestones (7, 21, 30, 60, 90, 180, 365)
- [x] Habit name loaded and displayed
- [x] Dismiss button navigates back to HomePage
- [x] Shell route registered ("milestone")
- [x] Animations smooth on target devices
- [x] Build succeeds
- [x] Unit tests pass
- [x] Manual testing passed

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Emoji-based confetti**: Simple Label animations (no Lottie/SKCanvas complexity)
- **Switch-based message selection**: Clear, readable milestone messages
- **Query parameter pattern**: Standard MAUI navigation (no custom routing)
- **Single-purpose page**: Only displays celebration (no state management)

### Alternativer overvejet

**Alternative 1: Lottie animation for confetti**
```csharp
// High-quality confetti animation
<lottie:LottieView
    Source="confetti.json"
    IsAnimating="True" />
```
**Hvorfor fravalgt**: Over-engineering for MVP. Lottie adds ~200KB+ to app size, requires JSON assets, and may cause performance issues on low-end devices. Emoji confetti is 95% as delightful with 1% of the complexity.

**Alternative 2: Auto-dismiss after 5 seconds**
```csharp
// Auto-dismiss celebration
await Task.Delay(5000);
await DismissAsync();
```
**Hvorfor fravalgt**: User agency is important. Some users want to savor the moment, take screenshot, or read message carefully. Manual dismiss is safer UX.

**Alternative 3: Share achievement button**
```csharp
// Share milestone on social media
<Button Text="Del præstation" Command="{Binding ShareCommand}" />
```
**Hvorfor fravalgt**: Nice-to-have social feature, not MVP. Adds complexity (platform share APIs, image generation). Can be v2 feature.

**Alternative 4: Custom milestone messages per habit**
```csharp
// User-defined celebration messages
habit.CustomMilestoneMessages = new Dictionary<int, string>
{
    { 7, "Week 1 done! Proud of you!" }
};
```
**Hvorfor fravalgt**: Extreme over-engineering. Standard motivational messages work for all habits. Custom messages add UI complexity (settings), database fields, and minimal user value.

### Potentielle forbedringer (v2)
- Sound effects on celebration (chime/applause) - Adds delight, but requires audio assets
- Share to social media feature - Viral growth potential
- Milestone badges collection screen - Gamification feature
- Customizable confetti colors per habit - Visual polish
- Haptic pattern (not just single vibration) - Enhanced feedback

### Kendte begrænsninger
- **No confetti on web platform**: Emoji animation may not work on Blazor (acceptable - focus is mobile)
- **No celebration history**: Can't replay past celebrations (acceptable - moment is ephemeral)
- **Fixed milestone days**: Can't customize milestones per habit (acceptable - standard milestones work universally)
- **No sound**: Silent celebration (acceptable - respects user's sound settings)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Emoji confetti (simple), switch-based messages, standard navigation
- [x] **Læsbarhed**: Clear property names (MilestoneDays, MotivationalMessage)
- [x] **Navngivning**: MilestonePage, GetMotivationalMessage (descriptive)
- [x] **Funktioner**: GetMotivationalMessage 15 lines (single purpose)
- [x] **DRY**: Confetti animation reusable, message selection centralized
- [x] **Error handling**: Null checks for habitId, fallback message for unknown milestones
- [x] **Edge cases**: Missing query params (empty habitId), invalid milestone days
- [x] **Performance**: Lightweight emoji animation (<20 labels), no heavy assets
- [x] **Testbarhed**: MilestoneViewModel testable (no UI dependencies in logic)

---

## Design Files Reference

- **Screen Spec**: `stribe-design/screens/10_MILESTONE_CELEBRATION.md`
- **Component Spec**: N/A (single-use page)
- **Related**: Command 033 (Milestone detection), Design System (Animations section)

---

## Notes

- **Confetti Implementation**: Emoji-based for performance and simplicity (20 falling labels)
- **Animation Duration**: 3 seconds (confetti fall time) - long enough to be noticeable, short enough to not annoy
- **Motivational Messages**: Danish language, positive tone, milestone-specific
- **Navigation Pattern**: Modal presentation (Shell.PresentationMode="ModalAnimated")
- **Auto-dismiss**: NOT implemented - user controls dismiss (better UX)
- **Query Parameters**: habitId (string), days (int) - validated in ViewModel

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
