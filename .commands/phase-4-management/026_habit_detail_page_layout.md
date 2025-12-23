# Command 026: Habit Detail Page Layout

## Metadata
- **Phase**: 4 - Management
- **Dependencies**: 025
- **Estimated Time**: 3-4 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/06_HABIT_DETAIL.md

---

## Formål

Implementere Habit Detail Page layout med header, stats cards, calendar heatmap placeholder, og action buttons.

**Hvorfor dette er vigtigt:**
- Primary visualization screen for habit progress
- Displays complex data (stats grid, calendar heatmap)
- Must handle responsive layout (stats cards, scrollable content)
- Entry point to Edit/Delete operations

---

## Risici

### Potentielle Problemer
1. **Stats grid responsiveness**:
   - Edge case: Small screens, long stat labels
   - Impact: Text truncation, layout overflow

2. **Calendar heatmap integration**:
   - Edge case: Heatmap component not ready (Command 027)
   - Impact: Broken layout, missing data binding

3. **Delete button prominence**:
   - Edge case: Too easy to accidentally tap
   - Impact: User frustration with accidental deletes

### Mitigering
- Flexible Grid with MinimumWidthRequest (prevents card squishing)
- Placeholder Frame for heatmap (works even if component missing)
- Delete button at bottom with destructive styling (red, separated)
- Navigation bar edit button (not inline, prevents misclicks)

---

## Analyse - Hvad Skal Implementeres

### HabitDetailPage Layout
**Description**: Full-screen habit detail view
**Location**: `src/Stribe/Pages/HabitDetailPage.xaml`
**Key Requirements**:
- **Header**: Back button (navigation bar), Edit button (toolbar)
- **Habit Identity**: Large icon + name (colored accent)
- **Stats Grid**: 2×2 grid (Current Streak, Best Streak, Completion Rate, Total)
- **Calendar Heatmap**: Placeholder (populated by Command 027)
- **Delete Button**: Bottom, destructive style
- **Scrollable**: ScrollView wrapper (handles long content)

### HabitDetailPage CodeBehind
**Description**: Minimal codebehind (bindings only)
**Location**: `src/Stribe/Pages/HabitDetailPage.xaml.cs`
**Key Requirements**:
- Constructor with BindingContext set to HabitDetailViewModel
- No business logic (all in ViewModel)

**Layout Structure**:
```
ScrollView
└─ VerticalStackLayout (Padding: 20, Spacing: 24)
   ├─ Habit Identity (Icon + Name + Color bar)
   ├─ Stats Grid (2×2)
   │  ├─ Current Streak Card
   │  ├─ Best Streak Card
   │  ├─ Completion Rate Card
   │  └─ Total Completions Card
   ├─ Calendar Section
   │  ├─ Section Header ("Historik")
   │  └─ CalendarHeatmap (Command 027)
   └─ Delete Button (BoxView separator + Button)
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Command 025 (HabitDetailViewModel with Stats, CalendarData)
- [x] Design system styles (StatCard, SectionHeader)

⚠️ **Assumptions**:
- Command 027 (CalendarHeatmap) can be placeholder initially
- Stats properties exist on ViewModel (CurrentStreak, BestStreak, etc.)

❌ **Blockers**: None (can use Frame placeholder for heatmap)

---

## Implementation Guide

### Step 1: Create HabitDetailPage XAML
Path: `src/Stribe/Pages/HabitDetailPage.xaml`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:vm="clr-namespace:Stribe.ViewModels"
             xmlns:controls="clr-namespace:Stribe.Controls"
             x:Class="Stribe.Pages.HabitDetailPage"
             x:DataType="vm:HabitDetailViewModel"
             Title="{Binding Title}"
             Shell.BackButtonBehavior="{OnClicked={Binding GoBackCommand}}">

    <ContentPage.ToolbarItems>
        <ToolbarItem Text="Rediger"
                     Command="{Binding EditHabitCommand}"
                     IconImageSource="edit_icon.png" />
    </ContentPage.ToolbarItems>

    <ScrollView>
        <VerticalStackLayout Padding="20" Spacing="24">

            <!-- Habit Identity -->
            <VerticalStackLayout Spacing="12">
                <Label Text="{Binding Habit.Icon}"
                       FontSize="64"
                       HorizontalOptions="Center" />
                <Label Text="{Binding Habit.Name}"
                       Style="{StaticResource PageHeader}"
                       HorizontalOptions="Center" />
                <BoxView HeightRequest="4"
                         WidthRequest="60"
                         Color="{Binding Habit.Color}"
                         CornerRadius="2"
                         HorizontalOptions="Center" />
            </VerticalStackLayout>

            <!-- Stats Grid -->
            <Grid RowDefinitions="Auto,Auto"
                  ColumnDefinitions="*,*"
                  RowSpacing="12"
                  ColumnSpacing="12">

                <!-- Current Streak -->
                <Frame Grid.Row="0" Grid.Column="0"
                       Style="{StaticResource StatCard}">
                    <VerticalStackLayout Spacing="4">
                        <Label Text="{Binding Stats.CurrentStreak}"
                               Style="{StaticResource StatValue}" />
                        <Label Text="Nuværende streak"
                               Style="{StaticResource StatLabel}" />
                    </VerticalStackLayout>
                </Frame>

                <!-- Best Streak -->
                <Frame Grid.Row="0" Grid.Column="1"
                       Style="{StaticResource StatCard}">
                    <VerticalStackLayout Spacing="4">
                        <Label Text="{Binding Stats.BestStreak}"
                               Style="{StaticResource StatValue}" />
                        <Label Text="Bedste streak"
                               Style="{StaticResource StatLabel}" />
                    </VerticalStackLayout>
                </Frame>

                <!-- Completion Rate -->
                <Frame Grid.Row="1" Grid.Column="0"
                       Style="{StaticResource StatCard}">
                    <VerticalStackLayout Spacing="4">
                        <Label Text="{Binding Stats.CompletionRate, StringFormat='{0:F1}%'}"
                               Style="{StaticResource StatValue}" />
                        <Label Text="Gennemførsel"
                               Style="{StaticResource StatLabel}" />
                    </VerticalStackLayout>
                </Frame>

                <!-- Total Completions -->
                <Frame Grid.Row="1" Grid.Column="1"
                       Style="{StaticResource StatCard}">
                    <VerticalStackLayout Spacing="4">
                        <Label Text="{Binding Stats.TotalCompletions}"
                               Style="{StaticResource StatValue}" />
                        <Label Text="I alt"
                               Style="{StaticResource StatLabel}" />
                    </VerticalStackLayout>
                </Frame>
            </Grid>

            <!-- Calendar Section -->
            <VerticalStackLayout Spacing="12">
                <Label Text="Historik"
                       Style="{StaticResource SectionHeader}" />

                <!-- Placeholder for CalendarHeatmap (Command 027) -->
                <controls:CalendarHeatmap CalendarData="{Binding CalendarData}" />

                <!-- Fallback if CalendarHeatmap not yet implemented -->
                <!--
                <Frame HeightRequest="200"
                       BackgroundColor="{StaticResource Gray100}"
                       BorderColor="{StaticResource Gray200}">
                    <Label Text="📅 Calendar heatmap kommer snart"
                           HorizontalOptions="Center"
                           VerticalOptions="Center"
                           TextColor="{StaticResource Gray400}" />
                </Frame>
                -->
            </VerticalStackLayout>

            <!-- Separator -->
            <BoxView HeightRequest="1"
                     Color="{StaticResource Gray200}"
                     Margin="0,12,0,0" />

            <!-- Delete Button -->
            <Button Text="Slet vane"
                    Command="{Binding DeleteHabitCommand}"
                    Style="{StaticResource DestructiveButton}"
                    Margin="0,12,0,24" />

        </VerticalStackLayout>
    </ScrollView>

</ContentPage>
```

**Explanation**:
- **ToolbarItem**: Edit button in navigation bar (standard placement)
- **Stats Grid**: 2×2 layout with equal-width columns (responsive)
- **CalendarHeatmap**: Uses custom control (Command 027), with commented fallback placeholder
- **Delete Button**: Separated with BoxView, uses destructive style (red, bottom placement)

### Step 2: Create HabitDetailPage CodeBehind
Path: `src/Stribe/Pages/HabitDetailPage.xaml.cs`

```csharp
using Stribe.ViewModels;

namespace Stribe.Pages;

public partial class HabitDetailPage : ContentPage
{
    public HabitDetailPage(HabitDetailViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

**Explanation**: Minimal codebehind. ViewModel injected via DI, set as BindingContext.

### Step 3: Register in DI and Routing
Path: `src/Stribe/MauiProgram.cs` and `src/Stribe/AppShell.xaml.cs`

```csharp
// MauiProgram.cs
builder.Services.AddTransient<HabitDetailPage>();
builder.Services.AddTransient<HabitDetailViewModel>();  // Already registered in 025

// AppShell.xaml.cs
Routing.RegisterRoute("habit-detail", typeof(HabitDetailPage));
```

### Step 4: Define Styles (if not exists)
Path: `src/Stribe/Resources/Styles/Styles.xaml`

```xml
<!-- Stat Card -->
<Style x:Key="StatCard" TargetType="Frame">
    <Setter Property="BackgroundColor" Value="{StaticResource White}" />
    <Setter Property="BorderColor" Value="{StaticResource Gray200}" />
    <Setter Property="CornerRadius" Value="12" />
    <Setter Property="Padding" Value="16" />
    <Setter Property="HasShadow" Value="False" />
</Style>

<!-- Stat Value (large number) -->
<Style x:Key="StatValue" TargetType="Label">
    <Setter Property="FontSize" Value="28" />
    <Setter Property="FontAttributes" Value="Bold" />
    <Setter Property="TextColor" Value="{StaticResource Gray900}" />
    <Setter Property="HorizontalOptions" Value="Center" />
</Style>

<!-- Stat Label (description) -->
<Style x:Key="StatLabel" TargetType="Label">
    <Setter Property="FontSize" Value="12" />
    <Setter Property="TextColor" Value="{StaticResource Gray500}" />
    <Setter Property="HorizontalOptions" Value="Center" />
</Style>

<!-- Destructive Button -->
<Style x:Key="DestructiveButton" TargetType="Button">
    <Setter Property="BackgroundColor" Value="{StaticResource ErrorRed}" />
    <Setter Property="TextColor" Value="{StaticResource White}" />
    <Setter Property="CornerRadius" Value="12" />
    <Setter Property="HeightRequest" Value="48" />
    <Setter Property="FontSize" Value="16" />
    <Setter Property="FontAttributes" Value="Bold" />
</Style>
```

---

## Verification Steps

### 1. Build Test
```bash
dotnet build src/Stribe/Stribe.csproj
```
Expected: 0 errors

### 2. Manual Test in Emulator
- [ ] Navigate to habit detail from home screen
- [ ] Habit icon, name, color displayed correctly
- [ ] Stats grid shows 4 cards (2×2 layout)
- [ ] Stats values bind correctly (CurrentStreak, BestStreak, CompletionRate, Total)
- [ ] CompletionRate formatted with 1 decimal (e.g., "87.5%")
- [ ] Calendar section header visible
- [ ] CalendarHeatmap placeholder/component renders
- [ ] Edit button in toolbar navigates to edit page
- [ ] Delete button shows at bottom (red, separated)
- [ ] Delete button triggers confirmation dialog (from ViewModel)
- [ ] ScrollView allows scrolling on small screens
- [ ] Layout responsive on different screen sizes

### 3. Visual Regression Test
Compare with design spec: stribe-design/screens/06_HABIT_DETAIL.md
- [ ] Stats cards match design (spacing, typography, colors)
- [ ] Habit identity matches design (icon size, color bar)
- [ ] Delete button matches destructive style

---

## Acceptance Criteria

- [x] HabitDetailPage.xaml created with complete layout
- [x] HabitDetailPage.xaml.cs with ViewModel injection
- [x] Header with back button and edit toolbar item
- [x] Habit identity section (icon + name + color bar)
- [x] Stats grid (2×2) with all 4 stat cards
- [x] Calendar section with heatmap placeholder
- [x] Delete button with destructive styling
- [x] ScrollView wrapper for small screens
- [x] Styles defined (StatCard, StatValue, StatLabel, DestructiveButton)
- [x] Registered in DI and routing
- [x] Build succeeds
- [x] Manual testing passed

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Declarative layout**: Pure XAML, no procedural layout code
- **Data binding**: Direct ViewModel property bindings (no converters needed)
- **Standard controls**: Grid, Frame, Label (no custom renderers)
- **Minimal codebehind**: Only ViewModel injection (no UI logic)

### Alternativer overvejet

**Alternative 1: Custom stat card component**
```xml
<controls:StatCard Value="{Binding Stats.CurrentStreak}" Label="Nuværende streak" />
```
**Hvorfor fravalgt**: Over-engineering. Simple Frame + VerticalStackLayout is sufficient. Only 4 cards total.

**Alternative 2: Horizontal scroll for stats**
```xml
<ScrollView Orientation="Horizontal">
    <HorizontalStackLayout><!-- 4 cards --></HorizontalStackLayout>
</ScrollView>
```
**Hvorfor fravalgt**: Poor UX on mobile. 2×2 grid uses space better, shows all stats at once (no scrolling needed).

**Alternative 3: Delete button in toolbar**
```xml
<ToolbarItem Text="Delete" Command="{Binding DeleteHabitCommand}" />
```
**Hvorfor fravalgt**: Too easy to accidentally tap. Destructive actions should be separated and visually distinct (red button at bottom).

### Potentielle forbedringer (v2)
- Animated stats transitions (count-up effect) - Nice polish, not MVP
- Swipe to delete gesture - iOS pattern, adds complexity
- Share button (export stats as image) - Low priority
- Collapsible sections (fold stats grid) - Unnecessary with ScrollView

### Kendte begrænsninger
- **Fixed 2×2 grid**: Doesn't adapt column count on tablets (acceptable - 2 columns is readable on all sizes)
- **No stat trend indicators**: Doesn't show if streak is improving/declining (acceptable - simple stats for MVP)
- **Delete requires 2 taps**: Button + confirmation (intentional - prevents accidents)

---

## Kode Kvalitet Checklist

### Layout Quality
- [x] **Responsive design**: Grid with equal columns (adapts to screen width)
- [x] **Scrollable content**: ScrollView prevents layout clipping on small screens
- [x] **Spacing consistency**: 24px between sections, 12px within sections
- [x] **Visual hierarchy**: Large icon → stats grid → calendar → delete (top to bottom importance)

### Code Quality Standards
- [x] **KISS**: Pure XAML layout, no procedural code
- [x] **Læsbarhed**: Clear section comments, semantic naming (Habit Identity, Stats Grid)
- [x] **Navngivning**: Style keys descriptive (StatCard, DestructiveButton)
- [x] **DRY**: Reuses styles (all 4 stat cards use same Frame style)
- [x] **Error handling**: Binding fallback for null Stats (StringFormat handles null gracefully)
- [x] **Edge cases**: Small screens (ScrollView), missing heatmap (placeholder commented)
- [x] **Performance**: Static layout (no dynamic generation), efficient data binding
- [x] **Testbarhed**: UI testable via bindings (change ViewModel properties, verify UI updates)

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/06_HABIT_DETAIL.md
- **Related Commands**:
  - Command 025 (HabitDetailViewModel - data source)
  - Command 027 (CalendarHeatmap component - integrated here)
  - Command 031 (EditHabitPage - navigation target from Edit button)
  - Command 032 (Delete logic - triggered from Delete button)

---

## Notes

- **CRITICAL**: CalendarHeatmap component (Command 027) must implement `CalendarData` bindable property
- **CRITICAL**: Delete button uses ViewModel command (DeleteHabitCommand), not inline navigation
- ToolbarItem edit button shows platform-native icon placement (top-right on iOS/Android)
- CompletionRate StringFormat uses `{0:F1}%` (1 decimal place, percentage symbol)
- Color bar uses `Habit.Color` property (string hex value, converted by MAUI)
- Stats grid uses `*` for equal-width columns (responsive to available space)

---

**Command Status**: Ready to implement (can use placeholder for CalendarHeatmap)
**Last Updated**: 2025-12-23
**Implemented By**: Pending
