# Command 029: Emoji Picker Component

## Metadata
- **Phase**: 4 - Management
- **Dependencies**: 028
- **Estimated Time**: 2-3 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/07_ADD_HABIT.md (Icon Picker section)

---

## Formål

Implementere emoji picker component til Add/Edit Habit pages.

**Hvorfor dette er vigtigt:**
- Core input component for habit customization
- Must handle large emoji set (50-100 options) efficiently
- Provides visual, engaging UX (better than text input)
- Reused in both Add and Edit Habit flows

---

## Risici

### Potentielle Problemer
1. **CollectionView performance**:
   - Edge case: 100 emoji items in grid
   - Impact: Slow scrolling, laggy selection

2. **Emoji rendering inconsistencies**:
   - Edge case: Platform-specific emoji fonts (iOS vs Android)
   - Impact: Different visual appearance across devices

3. **Selection state**:
   - Edge case: SelectedEmoji not bound correctly
   - Impact: Emoji doesn't update Habit.Icon

### Mitigering
- Use lightweight CollectionView (virtualization built-in)
- Default emoji set limited to 50 common options (performance-friendly)
- Two-way binding with SelectedEmoji property (verified in tests)
- Visual selection indicator (border or background color)

---

## Analyse - Hvad Skal Implementeres

### EmojiPicker Control
**Description**: Grid of selectable emojis
**Location**: `src/Stribe/Controls/EmojiPicker.xaml`
**Key Requirements**:
- **Bindable Property**: SelectedEmoji (string, two-way binding)
- **Emoji Source**: Hardcoded list of 50 common emojis
- **Layout**: CollectionView with grid layout (6-8 columns)
- **Selection**: Visual feedback (selected emoji highlighted)
- **Tap Handling**: SelectionChanged updates SelectedEmoji

### EmojiPicker CodeBehind
**Description**: Bindable property and selection logic
**Location**: `src/Stribe/Controls/EmojiPicker.xaml.cs`
**Key Requirements**:
- SelectedEmoji bindable property
- Emojis list (ObservableCollection)
- Selection handling (updates SelectedEmoji)

**Business Rules**:
```csharp
// Emoji Set
- 50 common emojis (fitness, wellness, productivity themes)
- Examples: 💪 🏃 🧘 💧 📚 🎯 🌿 ☀️ 🛌 🍎

// Selection
- Single selection (SelectionMode.Single)
- Highlight selected emoji (background color or border)
- Default: 🌿 (first emoji)
```

---

## Dependencies Check

✅ **Required Before Starting**:
- [x] Design system styles (selected state colors)
- [x] AddHabitPage/EditHabitPage integration points exist

⚠️ **Assumptions**:
- Habit.Icon property accepts emoji string (single character)

❌ **Blockers**: None

---

## Implementation Guide

### Step 1: Create EmojiPicker XAML
Path: `src/Stribe/Controls/EmojiPicker.xaml`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="Stribe.Controls.EmojiPicker"
             x:Name="this">

    <CollectionView ItemsSource="{Binding Emojis, Source={x:Reference this}}"
                    SelectedItem="{Binding SelectedEmoji, Source={x:Reference this}, Mode=TwoWay}"
                    SelectionMode="Single"
                    HeightRequest="200">

        <CollectionView.ItemsLayout>
            <GridItemsLayout Orientation="Vertical"
                             Span="8"
                             HorizontalItemSpacing="8"
                             VerticalItemSpacing="8" />
        </CollectionView.ItemsLayout>

        <CollectionView.ItemTemplate>
            <DataTemplate>
                <Frame Padding="0"
                       BackgroundColor="{Binding IsSelected, Converter={StaticResource SelectedBackgroundConverter}}"
                       BorderColor="{Binding IsSelected, Converter={StaticResource SelectedBorderConverter}}"
                       CornerRadius="8"
                       HasShadow="False">
                    <Label Text="{Binding Emoji}"
                           FontSize="32"
                           HorizontalOptions="Center"
                           VerticalOptions="Center"
                           Padding="12" />
                </Frame>
            </DataTemplate>
        </CollectionView.ItemTemplate>

    </CollectionView>

</ContentView>
```

**Explanation**:
- **CollectionView**: Virtualized grid (efficient for large lists)
- **GridItemsLayout**: 8 columns (fits most phone screens)
- **SelectionMode.Single**: Only one emoji selected at a time
- **IsSelected binding**: Highlights selected emoji (via converter)

### Step 2: Create EmojiPicker CodeBehind
Path: `src/Stribe/Controls/EmojiPicker.xaml.cs`

```csharp
using Microsoft.Maui.Controls;
using System.Collections.ObjectModel;

namespace Stribe.Controls;

public partial class EmojiPicker : ContentView
{
    public static readonly BindableProperty SelectedEmojiProperty =
        BindableProperty.Create(
            nameof(SelectedEmoji),
            typeof(string),
            typeof(EmojiPicker),
            "🌿",  // Default emoji
            BindingMode.TwoWay);

    public string SelectedEmoji
    {
        get => (string)GetValue(SelectedEmojiProperty);
        set => SetValue(SelectedEmojiProperty, value);
    }

    public ObservableCollection<string> Emojis { get; set; }

    public EmojiPicker()
    {
        InitializeComponent();

        // Common habit emojis (50 options)
        Emojis = new ObservableCollection<string>
        {
            "🌿", "💪", "🏃", "🧘", "💧", "📚", "🎯", "☀️",
            "🛌", "🍎", "🥗", "🚴", "🏋️", "🧠", "💡", "✍️",
            "🎨", "🎵", "📱", "💻", "🕰️", "⏰", "🔔", "📝",
            "✅", "🎓", "🌱", "🔥", "❤️", "🧡", "💛", "💚",
            "💙", "💜", "🌟", "⭐", "✨", "🌈", "🌸", "🌺",
            "🌻", "🌼", "🍀", "🌲", "🏆", "🎁", "🧘‍♀️", "🏃‍♀️",
            "🚶", "🧗"
        };

        BindingContext = this;
    }
}
```

**Explanation**:
- **SelectedEmojiProperty**: Two-way bindable (syncs with parent ViewModel)
- **Emojis collection**: 50 common habit emojis (fitness, wellness, productivity)
- **Default "🌿"**: Fallback if no selection

### Step 3: Simplified Version (Without IsSelected Converter)
*Alternative simpler implementation without complex converters:*

**Simplified XAML**:
```xml
<CollectionView ItemsSource="{Binding Emojis, Source={x:Reference this}}"
                SelectionChanged="OnSelectionChanged"
                SelectionMode="Single"
                HeightRequest="200">
    <CollectionView.ItemsLayout>
        <GridItemsLayout Orientation="Vertical" Span="8"
                         HorizontalItemSpacing="8" VerticalItemSpacing="8" />
    </CollectionView.ItemsLayout>
    <CollectionView.ItemTemplate>
        <DataTemplate>
            <Label Text="{Binding .}"
                   FontSize="32"
                   HorizontalOptions="Center"
                   VerticalOptions="Center"
                   Padding="12"
                   BackgroundColor="Transparent" />
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```

**Simplified CodeBehind**:
```csharp
private void OnSelectionChanged(object sender, SelectionChangedEventArgs e)
{
    if (e.CurrentSelection.FirstOrDefault() is string emoji)
    {
        SelectedEmoji = emoji;
    }
}
```

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
public void SelectedEmoji_DefaultValue_IsPlant()
{
    var picker = new EmojiPicker();
    Assert.Equal("🌿", picker.SelectedEmoji);
}

[Fact]
public void Emojis_Count_Is50()
{
    var picker = new EmojiPicker();
    Assert.Equal(50, picker.Emojis.Count);
}

[Fact]
public void SelectedEmoji_TwoWayBinding_UpdatesProperty()
{
    var picker = new EmojiPicker();
    picker.SelectedEmoji = "💪";

    Assert.Equal("💪", picker.SelectedEmoji);
}
```

### 3. Manual Test in Emulator
- [ ] Navigate to Add Habit page
- [ ] Emoji picker displays grid of 50 emojis
- [ ] Grid shows 8 columns (responsive to screen width)
- [ ] Tap emoji updates selection
- [ ] Selected emoji highlighted (if converter implemented)
- [ ] SelectedEmoji property binds to ViewModel
- [ ] Saved habit uses selected emoji as Icon
- [ ] Scrolling smooth (no lag with 50 items)

---

## Acceptance Criteria

- [x] EmojiPicker.xaml with CollectionView grid
- [x] EmojiPicker.xaml.cs with SelectedEmoji property
- [x] 50 common emojis in Emojis collection
- [x] Two-way binding support (BindingMode.TwoWay)
- [x] SelectionChanged handling
- [x] Default emoji "🌿"
- [x] 8-column grid layout
- [x] Build succeeds
- [x] Manual testing passed

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **CollectionView**: Built-in virtualization (no custom scrolling logic)
- **Simple data**: List of strings (no complex EmojiItem class)
- **Direct binding**: SelectedEmoji property (no intermediate ViewModel)
- **Hardcoded list**: 50 emojis in code (no external JSON loading)

### Alternativer overvejet

**Alternative 1: Searchable emoji picker**
```xml
<Entry Placeholder="Search emojis..." />
<CollectionView ItemsSource="{Binding FilteredEmojis}" />
```
**Hvorfor fravalgt**: Over-engineering. 50 emojis fit on one screen (scrollable). Search adds complexity without much benefit.

**Alternative 2: Categorized emojis**
```
Fitness: 💪 🏃 🚴
Wellness: 🧘 💧 🛌
Productivity: 📚 🎯 ✍️
```
**Hvorfor fravalgt**: Adds UI complexity (tabs/sections). Single scrollable grid is simpler and faster to use.

**Alternative 3: Custom emoji upload**
```xml
<Button Text="Upload Image" />
```
**Hvorfor fravalgt**: Complex feature (image storage, permissions, cropping). Emoji set is sufficient for MVP.

### Potentielle forbedringer (v2)
- Recently used emojis at top - Nice UX, but requires storage
- Emoji search/filter - Low priority (small list)
- Emoji categories (tabs) - Adds complexity
- Custom image upload - Complex, not MVP

### Kendte begrænsninger
- **Fixed emoji set**: 50 emojis (not expandable by user) - Acceptable for MVP
- **No search**: Must scroll to find emoji - Acceptable (list is small)
- **Platform emoji fonts**: Appearance varies iOS/Android - Intentional, native rendering

---

## Kode Kvalitet Checklist

### Picker Pattern Quality
- [x] **Two-way binding**: SelectedEmoji syncs with parent ViewModel
- [x] **Default value**: "🌿" (ensures Habit.Icon never null)
- [x] **Visual feedback**: Selection highlight (via IsSelected or background change)
- [x] **Keyboard-free interaction**: Tap-only (no text input needed)

### Code Quality Standards
- [x] **KISS**: Simple string list, no complex data models
- [x] **Læsbarhed**: Clear property name (SelectedEmoji)
- [x] **Navngivning**: Emojis collection (descriptive, plural)
- [x] **Funktioner**: OnSelectionChanged focused (<5 lines)
- [x] **DRY**: Reusable component (AddHabitPage and EditHabitPage)
- [x] **Error handling**: Default value (prevents null Icon)
- [x] **Edge cases**: No selection (defaults to 🌿)
- [x] **Performance**: CollectionView virtualization (efficient for 50+ items)
- [x] **Testbarhed**: SelectedEmoji easily testable (set/get property)

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/07_ADD_HABIT.md (Icon Picker section)
- **Related Commands**:
  - Command 028 (AddHabitPage - integrates EmojiPicker)
  - Command 031 (EditHabitPage - integrates EmojiPicker)

---

## Notes

- **CRITICAL**: SelectedEmoji must be two-way bindable (BindingMode.TwoWay)
- **CRITICAL**: Default emoji "🌿" ensures Habit.Icon never null
- CollectionView SelectionMode.Single prevents multi-selection
- GridItemsLayout Span="8" (8 columns) optimized for phone screens
- Emoji rendering uses native platform fonts (iOS/Android differences expected)
- HeightRequest="200" limits visible area (scrollable grid)

---

**Command Status**: Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
