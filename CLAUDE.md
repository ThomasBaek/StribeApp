# CLAUDE.md - Stribe Development Instructions

## Projekt Oversigt
Stribe er en habit tracker app bygget med .NET MAUI til iOS og Android (og Windows til test).
Målgruppe: Dansktalende brugere der vil tracke daglige vaner med fokus på streaks.

**Version**: 1.1 - Med fleksibel frekvens og ugedage

## Tech Stack
- .NET 10 MAUI
- SQLite (sqlite-net-pcl) for lokal data
- CommunityToolkit.Mvvm for MVVM
- CommunityToolkit.Maui for UI helpers

## Arkitektur
- MVVM pattern med CommunityToolkit
- Dependency Injection via MauiProgram.cs
- Offline-first med lokal SQLite database
- Services abstraheret via interfaces

## Fil Lokationer
- **Design System**: `/stribe-design/DESIGN_SYSTEM.md`
- **Navigation**: `/stribe-design/NAVIGATION.md`
- **Screens**: `/stribe-design/screens/*.md`
- **Components**: `/stribe-design/components/*.md`
- **MVP Plan**: `/Dokumenter/stribe_mvp_plan.md`
- **Setup Guide**: `/Dokumenter/stribe_setup_guide.md`
- **Commands**: `/.commands/` (Implementation plan)

## Command System

Dette projekt bruger et command-baseret udviklingsflow. Hver command er en selvstændig implementation task.

### Kør enkelt command
```
Kør command 001: Læs og implementer .commands/phase-1-foundation/001_app_shell_navigation.md
```

### Kør command range
```
Kør commands 001-009: Implementer alle foundation commands sekventielt. Stop ved fejl.
```

### Kør næste command
```
Kør næste command: Find første pending command i .commands/_state.json og udfør den.
```

### Vis status
```
Vis command status: Læs .commands/_state.json og vis oversigt over progress.
```

### Command Oversigt
Se komplet liste og dependency graph i `/.commands/README.md`

**Progress:**
- Total commands: 42
- Completed: 0
- Current phase: 1 - Foundation
- Next command: 001 - App Shell & Navigation

## Kodestil
- Dansk i UI tekster og kommentarer
- Engelsk i kode (klasse/metode navne)
- PascalCase for public members
- _camelCase for private fields
- Async/await for alle I/O operationer

## VIGTIGE REGLER
1. Læs ALTID design spec før du implementerer en skærm (stribe-design/screens/*.md)
2. Følg MVVM - ingen logik i code-behind
3. Brug DI - ingen `new Service()` i ViewModels
4. Brug design tokens fra Resources/Styles/Colors.xaml og Styles.xaml
5. Test på Windows først, derefter Android emulator
6. Build efter hver command for at verificere

## Kode Kvalitetsstandarder

Al kode i dette projekt SKAL overholde følgende principper:

### 1. KISS Princippet (Keep It Simple, Stupid)
- **Vælg altid den simpleste løsning der virker**
- Undgå over-engineering og unødvendig kompleksitet
- Én funktion = én opgave
- Hvis en løsning kræver lang forklaring, er den for kompleks
- Spørg: "Kan dette gøres enklere?"

### 2. Clean Code Principper
**Navngivning:**
- Beskrivende, selvforklarende navne
- Dårligt: `var d; // days`
- Godt: `var daysSinceLastCompletion;`

**Funktioner:**
- Korte (max 20-30 linjer)
- Gør én ting
- Ét abstraktionsniveau

**Kommentarer:**
- Koden skal være selvdokumenterende
- Undgå kommentarer der forklarer HVAD
- Brug kun kommentarer til HVORFOR (når nødvendigt)

### 3. Best Practices
- **DRY (Don't Repeat Yourself)**: Ingen duplikeret kode
- **SOLID principper** hvor relevant
- **Defensive programming**: Valider input, håndter edge cases
- **Error handling**: Meningsfulde fejlbeskeder
- **Testbarhed**: Kode skal være let at teste

### 4. Kode Evaluerings-checklist
Før en command markeres færdig:
- [ ] **KISS**: Er dette den simpleste løsning?
- [ ] **Læsbarhed**: Kan en anden udvikler forstå koden uden forklaring?
- [ ] **Navngivning**: Er alle navne beskrivende og konsistente?
- [ ] **Funktioner**: Er alle funktioner korte og fokuserede?
- [ ] **DRY**: Er der nogen duplikeret kode?
- [ ] **Error handling**: Er fejl håndteret korrekt?
- [ ] **Edge cases**: Er edge cases identificeret og håndteret?
- [ ] **Performance**: Er der åbenlyse performance problemer?
- [ ] **Testbarhed**: Kan koden nemt testes?

## Build Kommandoer
```bash
# Byg projekt
dotnet build src/Stribe/Stribe.csproj

# Kør på Windows
dotnet build src/Stribe/Stribe.csproj -t:Run -f net10.0-windows10.0.19041.0

# Kør på Android emulator
dotnet build src/Stribe/Stribe.csproj -t:Run -f net10.0-android

# Clean build
dotnet clean src/Stribe/Stribe.csproj && dotnet build src/Stribe/Stribe.csproj
```

## Allerede Implementeret (Del 5)
✅ NuGet packages (CommunityToolkit.Mvvm, CommunityToolkit.Maui, sqlite-net-pcl)
✅ Colors.xaml (Scandinavian design tokens)
✅ Styles.xaml (Typography, buttons, cards, inputs)
✅ BaseViewModel
✅ Models (Habit, Completion, AppSettings) - **Med frekvens felter (v1.1)**
✅ DatabaseService + IDatabaseService
✅ MauiProgram.cs DI setup

## Nye Funktioner (v1.1)
✅ **Daglige gentagelser**: Vaner kan sættes til 1-99 gange per dag
✅ **Ugedag-planlægning**: Vaner kan konfigureres til specifikke ugedage
✅ **Progress tracking**: Multi-completion tracking i Completion model

## Nuværende Status
- **Phase**: 1 - Foundation
- **Next command**: 001 - App Shell & Navigation
- **Progress**: Se `.commands/_state.json`

---

## Design System Quick Reference

### Farver (fra Colors.xaml)
```
Primary:          #2D5A4A (Skov grøn)
PrimaryLight:     #4A8B73
Background:       #FAFBFA
Surface:          #FFFFFF
TextPrimary:      #1A1A2E
TextSecondary:    #5A6B65
Success:          #4CAF7A
Error:            #D4736A
StreakFire:       #F5A623 (orange-guld til 🔥)

Habit Colors (12):
- HabitBlue:   #5B8FB9
- HabitGreen:  #7CB97B
- HabitYellow: #E8C547
- HabitOrange: #E89B47
- HabitRed:    #D4736A
- HabitPurple: #9B7BB9
- HabitPink:   #D4A5B9
- HabitTeal:   #5BB9A7
- HabitIndigo: #6B7BB9
- HabitBrown:  #A68B6B
- HabitGray:   #8B9A9A
- HabitMint:   #7BC9B9
```

### Spacing (base 4dp)
```
space_1:  4dp    space_6:  24dp
space_2:  8dp    space_8:  32dp
space_3:  12dp   space_10: 40dp
space_4:  16dp   space_12: 48dp
space_5:  20dp   space_16: 64dp

Common usage:
- Card padding: 16dp
- Screen padding: 16dp
- Button padding: 24dp horizontal
- List item gap: 12dp
```

### Typography
```
text_xs:   12sp  (Små labels)
text_sm:   14sp  (Sekundær tekst)
text_base: 16sp  (Body - default)
text_lg:   18sp  (Habit names)
text_xl:   20sp  (Skærm titler)
text_2xl:  24sp  (Store titler)
text_3xl:  30sp  (Streak counter)

Weights:
- font_normal:    400
- font_medium:    500
- font_semibold:  600
- font_bold:      700
```

### Border Radius
```
radius_sm:  4dp  (Små elementer)
radius_md:  8dp  (Buttons, inputs)
radius_lg:  12dp (Cards - STANDARD)
radius_xl:  16dp (Modals)
radius_full: 9999dp (Cirkler)
```

---

## Kritiske Business Rules

### 1. Streak Calculation
```csharp
// Streak = antal consecutive dage med completion, fra i dag og tilbage
// Algoritme:
streak = 0
date = today
while has_completion(habit_id, date):
    streak++
    date = date - 1 day
```

### 2. Day Rollover Logic
```csharp
// "Dagens" data vises baseret på konfigurerbar dag-start tid
// Default: Dagen starter kl. 04:00
day_start_hour = settings["day_start_hour"] ?? 4

if (current_time.Hour < day_start_hour):
    effective_date = today - 1 day
else:
    effective_date = today
```

### 3. Milestone Thresholds
```
Streaks der trigger celebration: 7, 21, 30, 60, 90, 180, 365 dage
- Vis kun én gang per milestone per habit
- Gem i settings: "milestone_shown_{habit_id}_{streak}"
```

### 4. Week Progress Bar
```
Shows: Sidste 7 dage (Mon-Sun af nuværende uge)
- 7 segments, hver 4dp høj, gap 4dp
- Filled = habit color, Empty = border color (#E5EBE8)
- Today segment har border highlight
```

---

## Projekt Struktur

```
src/Stribe/
├── Models/                    ✅ Færdig (v1.1 med frekvens)
│   ├── Habit.cs              (Id, Name, Emoji, Color, ReminderTime, DailyTargetCount, ActiveDays)
│   ├── Completion.cs         (Id, HabitId, Date, Count, CompletedAt)
│   └── AppSettings.cs        (Key-Value settings)
│
├── Services/                  ✅ DatabaseService færdig
│   ├── IDatabaseService.cs
│   ├── DatabaseService.cs
│   ├── IHabitService.cs      ⏸️ Mangler (Command 005)
│   ├── HabitService.cs       ⏸️ Mangler (streak logic, etc.)
│   ├── INotificationService  ⏸️ Mangler (Command 006)
│   └── ISettingsService      ⏸️ Mangler (Command 007)
│
├── ViewModels/                ✅ BaseViewModel færdig
│   ├── BaseViewModel.cs
│   ├── OnboardingViewModel   ⏸️ Command 010
│   ├── HomeViewModel         ⏸️ Command 015 (KRITISK)
│   ├── HabitDetailViewModel  ⏸️ Command 025
│   └── ...
│
├── Views/
│   ├── Onboarding/           ⏸️ Commands 010-014
│   │   ├── WelcomePage
│   │   ├── HabitSelectPage
│   │   └── ReminderPage
│   ├── HomePage              ⏸️ Command 016-021 (KRITISK)
│   ├── HabitDetailPage       ⏸️ Command 026
│   ├── AddHabitPage          ⏸️ Command 028
│   └── ...
│
├── Controls/                  ⏸️ Custom components
│   ├── HabitCard.xaml        ⏸️ Command 020 (KRITISK)
│   ├── WeekProgressBar       ⏸️ Command 018
│   ├── AnimatedCheckbox      ⏸️ Command 019
│   └── ...
│
├── Converters/                ⏸️ Command 004
│   ├── BoolToColorConverter
│   ├── DateToStringConverter
│   └── ...
│
├── Helpers/                   ⏸️ Command 003
│   ├── Constants.cs
│   └── Extensions.cs
│
└── Resources/
    └── Styles/               ✅ Færdig
        ├── Colors.xaml       (Design tokens)
        └── Styles.xaml       (Typography, buttons, etc.)
```

---

## Common Patterns & Examples

### MVVM Pattern med CommunityToolkit
```csharp
// ViewModel
public partial class HomeViewModel : BaseViewModel
{
    private readonly IHabitService _habitService;

    public HomeViewModel(IHabitService habitService)
    {
        _habitService = habitService;
    }

    [ObservableProperty]
    private ObservableCollection<Habit> _habits = new();

    [RelayCommand]
    private async Task LoadHabits()
    {
        IsBusy = true;
        Habits = new(await _habitService.GetHabitsForDateAsync(DateTime.Today));
        IsBusy = false;
    }

    [RelayCommand]
    private async Task ToggleCompletion(Habit habit)
    {
        await _habitService.ToggleCompletionAsync(habit.Id, DateTime.Today);
        await LoadHabits(); // Refresh
    }
}
```

### XAML Binding
```xaml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             x:Class="Stribe.Views.HomePage"
             BackgroundColor="{StaticResource Background}">

    <CollectionView ItemsSource="{Binding Habits}">
        <CollectionView.ItemTemplate>
            <DataTemplate>
                <controls:HabitCard
                    Habit="{Binding .}"
                    CardTapped="OnHabitTapped"
                    CheckboxTapped="OnCheckboxTapped" />
            </DataTemplate>
        </CollectionView.ItemTemplate>
    </CollectionView>

</ContentPage>
```

### Navigation
```csharp
// Navigate til route
await Shell.Current.GoToAsync("//home");

// Navigate med parameter
await Shell.Current.GoToAsync($"habit-detail?id={habitId}");

// Navigate modal
await Shell.Current.GoToAsync("add-habit");

// Go back
await Shell.Current.GoToAsync("..");
```

### Database Queries
```csharp
// Get habits
var habits = await _databaseService.GetHabitsAsync();

// Save habit
await _databaseService.SaveHabitAsync(newHabit);

// Get completion
var completion = await _databaseService.GetCompletionAsync(habitId, "2025-12-23");

// Toggle completion
if (completion != null)
    await _databaseService.DeleteCompletionAsync(completion);
else
    await _databaseService.SaveCompletionAsync(new Completion {
        HabitId = habitId,
        Date = DateTime.Today.ToString("yyyy-MM-dd")
    });
```

---

## Vigtige Conventions

### Dato Format
```csharp
// ALTID brug: yyyy-MM-dd format for dates i database
date_string = DateTime.Today.ToString("yyyy-MM-dd");

// Parse:
date = DateTime.ParseExact(date_string, "yyyy-MM-dd", null);
```

### Emoji Handling
```csharp
// Emojis gemmes som strings i database
habit.Emoji = "🏃";  // Valid

// I XAML:
<Label Text="{Binding Emoji}" FontSize="24" />
```

### Color Handling
```csharp
// Farver gemmes som hex string keys
habit.Color = "HabitGreen";  // NOT "#7CB97B"

// Converter til Color:
Color.FromArgb(Application.Current.Resources["HabitGreen"].ToString());
```

### Habit Frequency (v1.1)
```csharp
// Daglige gentagelser (1-99)
habit.DailyTargetCount = 8;  // fx "Drik vand 8x dagligt"

// Ugedage bitmask (Mon-Sun: "1111111")
habit.ActiveDays = "1111111";  // Hver dag
habit.ActiveDays = "1111100";  // Kun hverdage (Man-Fre)
habit.ActiveDays = "0000011";  // Kun weekend (Lør-Søn)
habit.ActiveDays = "1010100";  // Man, Ons, Fre

// Tjek om habit er aktiv for en bestemt dag
public bool IsActiveOnDay(DateTime date)
{
    int dayIndex = (int)date.DayOfWeek;
    dayIndex = dayIndex == 0 ? 6 : dayIndex - 1; // Convert Sunday=0 to Monday=0
    return ActiveDays[dayIndex] == '1';
}

// Completion med count
var completion = new Completion
{
    HabitId = habitId,
    Date = DateTime.Today.ToString("yyyy-MM-dd"),
    Count = 3  // 3 ud af 8 completions
};
```

### Dependency Injection Registration
```csharp
// I MauiProgram.cs:
builder.Services.AddSingleton<IHabitService, HabitService>();
builder.Services.AddTransient<HomeViewModel>();
builder.Services.AddTransient<HomePage>();
```

---

## Før Du Starter En Command

1. ✅ Læs command filen grundigt (.commands/phase-X/XXX_*.md)
2. ✅ Tjek dependencies er opfyldt
3. ✅ Læs design reference (stribe-design/screens/*.md)
4. ✅ Verificer design tokens i Colors.xaml og Styles.xaml
5. ✅ Implementer præcist som beskrevet
6. ✅ Build og test
7. ✅ Opdater _state.json status til "completed"

---

## Quick Commands Reference

```bash
# Build
dotnet build src/Stribe/Stribe.csproj

# Clean + build
dotnet clean src/Stribe/Stribe.csproj && dotnet build src/Stribe/Stribe.csproj

# Run Windows
dotnet build src/Stribe/Stribe.csproj -t:Run -f net10.0-windows10.0.19041.0

# Run Android
dotnet build src/Stribe/Stribe.csproj -t:Run -f net10.0-android

# Restore packages
dotnet restore src/Stribe/Stribe.csproj
```
