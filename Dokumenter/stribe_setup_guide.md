# Stribe - Komplet Udviklings Setup Guide
## .NET MAUI Habit Tracker App

Denne guide tager dig fra nul til klar-til-udvikling på Windows.

---

# DEL 1: INSTALLATION

## 1.1 Forudsætninger

### Minimum System Requirements
- Windows 10 version 1903 eller nyere (Windows 11 anbefalet)
- 8 GB RAM minimum (16 GB anbefalet)
- 20 GB ledig diskplads
- SSD anbefalet for bedre performance

### Software der skal installeres
1. Visual Studio 2022 (Community er gratis)
2. .NET 8 SDK
3. Android SDK (via Visual Studio)
4. Git
5. (Valgfrit) VS Code med C# extension

---

## 1.2 Installation Step-by-Step

### Trin 1: Installer Visual Studio 2022

1. Download Visual Studio 2022 Community fra:
   https://visualstudio.microsoft.com/downloads/

2. Kør installeren og vælg disse **Workloads**:
   - ✅ **.NET Multi-platform App UI development** (KRITISK)
   - ✅ **Mobile development with .NET** (inkluderer Android)
   
3. Under "Individual components" (valgfrit men anbefalet):
   - ✅ .NET 8.0 Runtime
   - ✅ Android SDK setup (API level 34)
   - ✅ Android Emulator
   - ✅ Intel Hardware Accelerated Execution Manager (HAXM)

4. Klik "Install" og vent (kan tage 30-60 minutter)

### Trin 2: Verificer Installation

Åbn **Developer Command Prompt for VS 2022** og kør:

```powershell
# Check .NET version
dotnet --version
# Skal vise 8.0.x eller højere

# Check MAUI workload
dotnet workload list
# Skal vise "maui" eller "maui-windows"

# Hvis MAUI mangler, installer den:
dotnet workload install maui
```

### Trin 3: Installer Git (hvis ikke allerede installeret)

1. Download fra: https://git-scm.com/download/win
2. Kør installer med default settings
3. Verificer:
   ```powershell
   git --version
   ```

### Trin 4: Android Emulator Setup

1. Åbn Visual Studio 2022
2. Gå til **Tools → Android → Android Device Manager**
3. Klik **+ New**
4. Opret en emulator:
   - Name: `Pixel_5_API_34`
   - Device: Pixel 5
   - OS: Android 14.0 (API 34)
   - Klik **Create**
5. Start emulatoren for at verificere den virker

### Trin 5: Windows Machine Setup for MAUI

For at køre MAUI apps på Windows skal Developer Mode være aktiveret:

1. Åbn **Settings → Privacy & Security → For developers**
2. Slå **Developer Mode** til
3. Genstart computeren

---

# DEL 2: PROJEKT OPRETTELSE

## 2.1 Opret Git Repository

```powershell
# Naviger til din udviklings-mappe
cd C:\Dev  # eller din foretrukne lokation

# Opret projekt-mappe
mkdir Stribe
cd Stribe

# Initialiser Git
git init

# Opret .gitignore
```

## 2.2 Opret MAUI Projekt

```powershell
# Opret MAUI projekt med .NET 8
dotnet new maui -n "Stribe" -o "src/Stribe"

# Naviger ind i solution
cd src/Stribe

# Verificer projektet bygger
dotnet build
```

## 2.3 Projekt Struktur

Efter oprettelse, reorganiser til denne struktur:

```
Stribe/
├── .git/
├── .gitignore
├── README.md
├── CLAUDE.md                    # Instructions til Claude Code
├── docs/
│   ├── MVP_PLAN.md             # Fra dit projekt
│   ├── UX_DESIGN.md            # Fra dit projekt
│   ├── ARCHITECTURE.md         # Teknisk arkitektur
│   └── CHANGELOG.md            # Versionshistorik
├── src/
│   └── Stribe/
│       ├── Stribe.csproj
│       ├── MauiProgram.cs
│       ├── App.xaml
│       ├── App.xaml.cs
│       ├── AppShell.xaml
│       ├── AppShell.xaml.cs
│       │
│       ├── Models/              # Data models
│       │   ├── Habit.cs
│       │   ├── Completion.cs
│       │   └── Settings.cs
│       │
│       ├── ViewModels/          # MVVM ViewModels
│       │   ├── BaseViewModel.cs
│       │   ├── HomeViewModel.cs
│       │   ├── HabitDetailViewModel.cs
│       │   └── SettingsViewModel.cs
│       │
│       ├── Views/               # XAML Pages
│       │   ├── Onboarding/
│       │   │   ├── WelcomePage.xaml
│       │   │   ├── HabitSelectPage.xaml
│       │   │   └── ReminderPage.xaml
│       │   ├── HomePage.xaml
│       │   ├── HabitDetailPage.xaml
│       │   ├── AddHabitPage.xaml
│       │   └── SettingsPage.xaml
│       │
│       ├── Services/            # Business logic
│       │   ├── IHabitService.cs
│       │   ├── HabitService.cs
│       │   ├── IDatabaseService.cs
│       │   ├── DatabaseService.cs
│       │   ├── INotificationService.cs
│       │   └── NotificationService.cs
│       │
│       ├── Controls/            # Custom controls
│       │   ├── HabitCard.xaml
│       │   ├── HabitCard.xaml.cs
│       │   ├── StreakCounter.xaml
│       │   └── ProgressBar7Day.xaml
│       │
│       ├── Converters/          # Value converters
│       │   ├── BoolToColorConverter.cs
│       │   └── DateToStringConverter.cs
│       │
│       ├── Helpers/             # Utility classes
│       │   ├── Constants.cs
│       │   └── Extensions.cs
│       │
│       ├── Resources/
│       │   ├── Styles/
│       │   │   ├── Colors.xaml
│       │   │   └── Styles.xaml
│       │   ├── Fonts/
│       │   ├── Images/
│       │   └── Raw/
│       │
│       └── Platforms/           # Platform-specific
│           ├── Android/
│           ├── iOS/
│           └── Windows/
│
├── tests/                       # Unit tests (v2)
│   └── Stribe.Tests/
│
└── .state/                      # Development state
    ├── CURRENT_TASK.md
    ├── COMPLETED_TASKS.md
    └── KNOWN_ISSUES.md
```

---

# DEL 3: CLAUDE.MD OPSÆTNING

Opret filen `CLAUDE.md` i roden af projektet. Denne fil instruerer Claude Code om projektet:

```markdown
# CLAUDE.md - Stribe Development Instructions

## Projekt Oversigt
Stribe er en habit tracker app bygget med .NET MAUI til iOS og Android (og Windows til test).
Målgruppe: Dansktalende brugere der vil tracke daglige vaner med fokus på streaks.

## Tech Stack
- .NET 8 MAUI
- SQLite (sqlite-net-pcl) for lokal data
- CommunityToolkit.Mvvm for MVVM
- CommunityToolkit.Maui for UI helpers

## Arkitektur
- MVVM pattern med CommunityToolkit
- Dependency Injection via MauiProgram.cs
- Offline-first med lokal SQLite database
- Services abstraheret via interfaces

## Fil Lokationer
- UX Design spec: `/docs/UX_DESIGN.md`
- MVP Plan: `/docs/MVP_PLAN.md`
- Nuværende task: `/.state/CURRENT_TASK.md`

## Kodestil
- Dansk i UI tekster og kommentarer
- Engelsk i kode (klasse/metode navne)
- PascalCase for public members
- _camelCase for private fields
- Async/await for alle I/O operationer

## VIGTIGE REGLER
1. Læs ALTID UX_DESIGN.md før du implementerer en skærm
2. Følg MVVM - ingen logik i code-behind
3. Brug DI - ingen `new Service()` i ViewModels
4. Test på Windows først, derefter Android emulator
5. Commit ofte med beskrivende danske beskeder

## Kommandoer
```bash
# Byg projekt
dotnet build src/Stribe/Stribe.csproj

# Kør på Windows
dotnet build src/Stribe/Stribe.csproj -t:Run -f net8.0-windows10.0.19041.0

# Kør på Android emulator
dotnet build src/Stribe/Stribe.csproj -t:Run -f net8.0-android

# Clean build
dotnet clean src/Stribe/Stribe.csproj && dotnet build src/Stribe/Stribe.csproj
```

## Nuværende Status
Se `/.state/CURRENT_TASK.md` for hvad der arbejdes på.
Se `/.state/COMPLETED_TASKS.md` for færdige opgaver.
```

---

# DEL 4: STATE MANAGEMENT & TASKS

## 4.1 Task Tracking System

Opret `.state/` mappen med disse filer:

### CURRENT_TASK.md
```markdown
# Nuværende Task

## Task: [TASK_NAME]
**Status:** 🔄 I gang / ⏸️ Pauset / ✅ Færdig
**Startet:** YYYY-MM-DD
**Estimat:** X timer

### Beskrivelse
[Hvad skal laves]

### Acceptance Criteria
- [ ] Kriterie 1
- [ ] Kriterie 2
- [ ] Kriterie 3

### Noter
[Løbende noter under udvikling]

### Blokkere
[Ting der forhindrer fremgang]
```

### COMPLETED_TASKS.md
```markdown
# Færdige Tasks

## Sprint 1: Setup & Core

### ✅ Task 1.1: Projekt Setup
**Færdig:** YYYY-MM-DD
**Tid brugt:** X timer

Beskrivelse: Initial projekt setup med MAUI, mappestruktur, Git.

---

### ✅ Task 1.2: [Næste task]
...
```

### KNOWN_ISSUES.md
```markdown
# Kendte Problemer

## 🔴 Kritiske
[Ingen pt.]

## 🟡 Medium
[Ingen pt.]

## 🟢 Lave prioritet
[Ingen pt.]

---

## Løste problemer

### [Problem titel]
**Løst:** YYYY-MM-DD
**Løsning:** [Beskrivelse]
```

## 4.2 Sprint Plan

Opret `docs/SPRINT_PLAN.md`:

```markdown
# Stribe Sprint Plan

## Sprint 1: Foundation (Uge 1-2)
- [ ] 1.1 Projekt setup & struktur
- [ ] 1.2 Database service (SQLite)
- [ ] 1.3 Base models (Habit, Completion, Settings)
- [ ] 1.4 Design tokens & styles i XAML
- [ ] 1.5 BaseViewModel & DI setup

## Sprint 2: Onboarding (Uge 2-3)
- [ ] 2.1 Welcome page
- [ ] 2.2 Habit selection page
- [ ] 2.3 Custom habit page
- [ ] 2.4 Reminder setup page
- [ ] 2.5 Onboarding flow navigation

## Sprint 3: Core Features (Uge 3-4)
- [ ] 3.1 Home screen layout
- [ ] 3.2 Habit card component
- [ ] 3.3 Checkbox animation
- [ ] 3.4 Streak calculation
- [ ] 3.5 Date navigation

## Sprint 4: Detail & Edit (Uge 4-5)
- [ ] 4.1 Habit detail page
- [ ] 4.2 Calendar heatmap
- [ ] 4.3 Add/Edit habit page
- [ ] 4.4 Delete/Archive functionality

## Sprint 5: Polish (Uge 5-6)
- [ ] 5.1 Settings page
- [ ] 5.2 Notifications
- [ ] 5.3 Milestone celebrations
- [ ] 5.4 Bug fixes & testing
- [ ] 5.5 App Store preparation
```

---

# DEL 5: BASIS KODE & KOMPONENTER

## 5.1 NuGet Packages

Tilføj disse packages til `Stribe.csproj`:

```xml
<ItemGroup>
    <!-- MVVM Toolkit -->
    <PackageReference Include="CommunityToolkit.Mvvm" Version="8.2.2" />
    
    <!-- MAUI Toolkit (behaviors, converters, etc.) -->
    <PackageReference Include="CommunityToolkit.Maui" Version="7.0.1" />
    
    <!-- SQLite -->
    <PackageReference Include="sqlite-net-pcl" Version="1.8.116" />
    <PackageReference Include="SQLitePCLRaw.bundle_green" Version="2.1.8" />
    
    <!-- Dependency Injection helpers -->
    <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="8.0.0" />
</ItemGroup>
```

Installer via terminal:
```powershell
cd src/Stribe
dotnet add package CommunityToolkit.Mvvm
dotnet add package CommunityToolkit.Maui
dotnet add package sqlite-net-pcl
dotnet add package SQLitePCLRaw.bundle_green
```

## 5.2 Colors.xaml (Design Tokens)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<?xaml-comp compile="true" ?>
<ResourceDictionary 
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <!-- Primary Colors (Scandinavian Forest Theme) -->
    <Color x:Key="Primary">#2D5A27</Color>
    <Color x:Key="PrimaryLight">#4A7C43</Color>
    <Color x:Key="PrimaryLighter">#E8F5E3</Color>
    <Color x:Key="PrimaryDark">#1E3D1A</Color>

    <!-- Neutrals -->
    <Color x:Key="Background">#FAFAF8</Color>
    <Color x:Key="Surface">#FFFFFF</Color>
    <Color x:Key="Border">#E8E8EC</Color>

    <!-- Text -->
    <Color x:Key="TextPrimary">#1A1A2E</Color>
    <Color x:Key="TextSecondary">#4A4A68</Color>
    <Color x:Key="TextTertiary">#8A8AA3</Color>

    <!-- Semantic -->
    <Color x:Key="Error">#D32F2F</Color>
    <Color x:Key="Warning">#F57C00</Color>
    <Color x:Key="Success">#388E3C</Color>

    <!-- Habit Colors -->
    <Color x:Key="HabitGreen">#4CAF50</Color>
    <Color x:Key="HabitBlue">#2196F3</Color>
    <Color x:Key="HabitPurple">#9C27B0</Color>
    <Color x:Key="HabitYellow">#FFC107</Color>
    <Color x:Key="HabitOrange">#FF9800</Color>
    <Color x:Key="HabitRed">#F44336</Color>

</ResourceDictionary>
```

## 5.3 Styles.xaml (Base Styles)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<?xaml-comp compile="true" ?>
<ResourceDictionary 
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <!-- Typography -->
    <Style x:Key="DisplayText" TargetType="Label">
        <Setter Property="FontSize" Value="32"/>
        <Setter Property="FontAttributes" Value="Bold"/>
        <Setter Property="TextColor" Value="{StaticResource TextPrimary}"/>
    </Style>

    <Style x:Key="HeadlineText" TargetType="Label">
        <Setter Property="FontSize" Value="24"/>
        <Setter Property="FontAttributes" Value="Bold"/>
        <Setter Property="TextColor" Value="{StaticResource TextPrimary}"/>
    </Style>

    <Style x:Key="TitleText" TargetType="Label">
        <Setter Property="FontSize" Value="20"/>
        <Setter Property="FontAttributes" Value="Bold"/>
        <Setter Property="TextColor" Value="{StaticResource TextPrimary}"/>
    </Style>

    <Style x:Key="BodyText" TargetType="Label">
        <Setter Property="FontSize" Value="16"/>
        <Setter Property="TextColor" Value="{StaticResource TextPrimary}"/>
    </Style>

    <Style x:Key="CaptionText" TargetType="Label">
        <Setter Property="FontSize" Value="14"/>
        <Setter Property="TextColor" Value="{StaticResource TextSecondary}"/>
    </Style>

    <Style x:Key="SmallText" TargetType="Label">
        <Setter Property="FontSize" Value="12"/>
        <Setter Property="TextColor" Value="{StaticResource TextTertiary}"/>
    </Style>

    <!-- Primary Button -->
    <Style x:Key="PrimaryButton" TargetType="Button">
        <Setter Property="BackgroundColor" Value="{StaticResource Primary}"/>
        <Setter Property="TextColor" Value="White"/>
        <Setter Property="FontAttributes" Value="Bold"/>
        <Setter Property="FontSize" Value="16"/>
        <Setter Property="HeightRequest" Value="56"/>
        <Setter Property="CornerRadius" Value="12"/>
        <Setter Property="Padding" Value="24,0"/>
    </Style>

    <!-- Secondary Button -->
    <Style x:Key="SecondaryButton" TargetType="Button">
        <Setter Property="BackgroundColor" Value="Transparent"/>
        <Setter Property="TextColor" Value="{StaticResource TextSecondary}"/>
        <Setter Property="BorderColor" Value="{StaticResource TextSecondary}"/>
        <Setter Property="BorderWidth" Value="1.5"/>
        <Setter Property="FontSize" Value="14"/>
        <Setter Property="HeightRequest" Value="48"/>
        <Setter Property="CornerRadius" Value="12"/>
        <Setter Property="Padding" Value="20,0"/>
    </Style>

    <!-- Card Style -->
    <Style x:Key="Card" TargetType="Frame">
        <Setter Property="BackgroundColor" Value="{StaticResource Surface}"/>
        <Setter Property="BorderColor" Value="Transparent"/>
        <Setter Property="CornerRadius" Value="16"/>
        <Setter Property="Padding" Value="16"/>
        <Setter Property="HasShadow" Value="True"/>
    </Style>

    <!-- Input Style -->
    <Style x:Key="InputEntry" TargetType="Entry">
        <Setter Property="BackgroundColor" Value="{StaticResource Surface}"/>
        <Setter Property="TextColor" Value="{StaticResource TextPrimary}"/>
        <Setter Property="PlaceholderColor" Value="{StaticResource TextTertiary}"/>
        <Setter Property="FontSize" Value="16"/>
        <Setter Property="HeightRequest" Value="56"/>
    </Style>

</ResourceDictionary>
```

## 5.4 Base ViewModel

Opret `ViewModels/BaseViewModel.cs`:

```csharp
using CommunityToolkit.Mvvm.ComponentModel;

namespace Stribe.ViewModels;

public partial class BaseViewModel : ObservableObject
{
    [ObservableProperty]
    private bool _isBusy;

    [ObservableProperty]
    private string _title = string.Empty;

    [ObservableProperty]
    private bool _isRefreshing;

    public bool IsNotBusy => !IsBusy;
}
```

## 5.5 Models

### Models/Habit.cs
```csharp
using SQLite;

namespace Stribe.Models;

public class Habit
{
    [PrimaryKey]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    public string Name { get; set; } = string.Empty;
    
    public string Emoji { get; set; } = "⭐";
    
    public string Color { get; set; } = "#4CAF50";
    
    public string? ReminderTime { get; set; } // Format: "HH:mm"
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsArchived { get; set; } = false;
    
    public int SortOrder { get; set; } = 0;
}
```

### Models/Completion.cs
```csharp
using SQLite;

namespace Stribe.Models;

public class Completion
{
    [PrimaryKey]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Indexed]
    public string HabitId { get; set; } = string.Empty;
    
    [Indexed]
    public string Date { get; set; } = string.Empty; // Format: "yyyy-MM-dd"
    
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
}
```

### Models/AppSettings.cs
```csharp
using SQLite;

namespace Stribe.Models;

public class AppSettings
{
    [PrimaryKey]
    public string Key { get; set; } = string.Empty;
    
    public string Value { get; set; } = string.Empty;
}
```

## 5.6 Database Service

### Services/IDatabaseService.cs
```csharp
using Stribe.Models;

namespace Stribe.Services;

public interface IDatabaseService
{
    // Habits
    Task<List<Habit>> GetHabitsAsync();
    Task<Habit?> GetHabitAsync(string id);
    Task<int> SaveHabitAsync(Habit habit);
    Task<int> DeleteHabitAsync(Habit habit);
    
    // Completions
    Task<List<Completion>> GetCompletionsAsync(string habitId);
    Task<Completion?> GetCompletionAsync(string habitId, string date);
    Task<int> SaveCompletionAsync(Completion completion);
    Task<int> DeleteCompletionAsync(Completion completion);
    
    // Settings
    Task<string?> GetSettingAsync(string key);
    Task SetSettingAsync(string key, string value);
}
```

### Services/DatabaseService.cs
```csharp
using SQLite;
using Stribe.Models;

namespace Stribe.Services;

public class DatabaseService : IDatabaseService
{
    private SQLiteAsyncConnection? _database;
    
    private async Task<SQLiteAsyncConnection> GetDatabaseAsync()
    {
        if (_database != null)
            return _database;
            
        var dbPath = Path.Combine(
            FileSystem.AppDataDirectory, 
            "stribe.db3"
        );
        
        _database = new SQLiteAsyncConnection(dbPath);
        
        await _database.CreateTableAsync<Habit>();
        await _database.CreateTableAsync<Completion>();
        await _database.CreateTableAsync<AppSettings>();
        
        return _database;
    }
    
    // Habits
    public async Task<List<Habit>> GetHabitsAsync()
    {
        var db = await GetDatabaseAsync();
        return await db.Table<Habit>()
            .Where(h => !h.IsArchived)
            .OrderBy(h => h.SortOrder)
            .ToListAsync();
    }
    
    public async Task<Habit?> GetHabitAsync(string id)
    {
        var db = await GetDatabaseAsync();
        return await db.Table<Habit>()
            .Where(h => h.Id == id)
            .FirstOrDefaultAsync();
    }
    
    public async Task<int> SaveHabitAsync(Habit habit)
    {
        var db = await GetDatabaseAsync();
        var existing = await GetHabitAsync(habit.Id);
        
        if (existing != null)
            return await db.UpdateAsync(habit);
        else
            return await db.InsertAsync(habit);
    }
    
    public async Task<int> DeleteHabitAsync(Habit habit)
    {
        var db = await GetDatabaseAsync();
        // Also delete all completions
        await db.Table<Completion>()
            .Where(c => c.HabitId == habit.Id)
            .DeleteAsync();
        return await db.DeleteAsync(habit);
    }
    
    // Completions
    public async Task<List<Completion>> GetCompletionsAsync(string habitId)
    {
        var db = await GetDatabaseAsync();
        return await db.Table<Completion>()
            .Where(c => c.HabitId == habitId)
            .ToListAsync();
    }
    
    public async Task<Completion?> GetCompletionAsync(string habitId, string date)
    {
        var db = await GetDatabaseAsync();
        return await db.Table<Completion>()
            .Where(c => c.HabitId == habitId && c.Date == date)
            .FirstOrDefaultAsync();
    }
    
    public async Task<int> SaveCompletionAsync(Completion completion)
    {
        var db = await GetDatabaseAsync();
        return await db.InsertAsync(completion);
    }
    
    public async Task<int> DeleteCompletionAsync(Completion completion)
    {
        var db = await GetDatabaseAsync();
        return await db.DeleteAsync(completion);
    }
    
    // Settings
    public async Task<string?> GetSettingAsync(string key)
    {
        var db = await GetDatabaseAsync();
        var setting = await db.Table<AppSettings>()
            .Where(s => s.Key == key)
            .FirstOrDefaultAsync();
        return setting?.Value;
    }
    
    public async Task SetSettingAsync(string key, string value)
    {
        var db = await GetDatabaseAsync();
        var setting = new AppSettings { Key = key, Value = value };
        await db.InsertOrReplaceAsync(setting);
    }
}
```

## 5.7 MauiProgram.cs (Dependency Injection)

```csharp
using CommunityToolkit.Maui;
using Microsoft.Extensions.Logging;
using Stribe.Services;
using Stribe.ViewModels;
using Stribe.Views;

namespace Stribe;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseMauiCommunityToolkit()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        // Services
        builder.Services.AddSingleton<IDatabaseService, DatabaseService>();
        
        // ViewModels
        builder.Services.AddTransient<HomeViewModel>();
        builder.Services.AddTransient<HabitDetailViewModel>();
        builder.Services.AddTransient<SettingsViewModel>();
        
        // Pages
        builder.Services.AddTransient<HomePage>();
        builder.Services.AddTransient<HabitDetailPage>();
        builder.Services.AddTransient<SettingsPage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
```

---

# DEL 6: TEST & KØR APPEN

## 6.1 Kør på Windows (Hurtigste til udvikling)

### Via Visual Studio:
1. Åbn `Stribe.sln` i Visual Studio
2. Vælg **Windows Machine** som target (dropdown ved play-knap)
3. Tryk **F5** eller klik den grønne play-knap

### Via Terminal:
```powershell
cd src/Stribe

# Build og kør på Windows
dotnet build -f net8.0-windows10.0.19041.0 -t:Run

# Alternativt med hot reload
dotnet watch run -f net8.0-windows10.0.19041.0
```

## 6.2 Kør på Android Emulator

### Via Visual Studio:
1. Åbn Android Device Manager (Tools → Android → Android Device Manager)
2. Start din emulator
3. Vælg emulatoren i dropdown ved play-knap
4. Tryk **F5**

### Via Terminal:
```powershell
# List tilgængelige emulatorer
emulator -list-avds

# Start emulator (i baggrunden)
emulator -avd Pixel_5_API_34 &

# Build og deploy til emulator
dotnet build -f net8.0-android -t:Run
```

## 6.3 Hot Reload

MAUI understøtter Hot Reload for hurtigere udvikling:

1. Kør appen i debug mode
2. Lav ændringer i XAML eller C# kode
3. Gem filen (Ctrl+S)
4. Ændringerne vises automatisk i appen

**Bemærk:** Ikke alle ændringer kan hot reloades. Strukturelle ændringer kræver genstart.

## 6.4 Debugging Tips

### Output Window
Se debug output i Visual Studio:
**View → Output** (vælg "Debug" i dropdown)

### Breakpoints
- Klik i venstre margin for at sætte breakpoint
- F9 = Toggle breakpoint
- F10 = Step over
- F11 = Step into
- Shift+F11 = Step out

### XAML Live Visual Tree
I Visual Studio under debug:
**Debug → Windows → Live Visual Tree**

Viser hele UI-træet og lader dig inspicere elementer.

---

# DEL 7: GIT WORKFLOW

## 7.1 Initial Commit

```powershell
# Tilføj alle filer
git add .

# Initial commit
git commit -m "Initial projekt setup med MAUI struktur"

# Opret main branch
git branch -M main
```

## 7.2 .gitignore

Opret `.gitignore` i roden:

```gitignore
# Build results
[Dd]ebug/
[Rr]elease/
x64/
x86/
[Ww][Ii][Nn]32/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/
[Ll]ogs/

# Visual Studio
.vs/
*.suo
*.user
*.userosscache
*.sln.docstates
*.userprefs

# Rider
.idea/

# VS Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# MAUI specific
*.apk
*.aab
*.ipa
*.app
*.msix
*.msixbundle
*.appxupload
*.appinstaller

# User-specific files
*.rsuser
*.suo
*.user
*.sln.docstates

# NuGet
*.nupkg
**/[Pp]ackages/*
!**/[Pp]ackages/build/

# Windows
Thumbs.db
ehthumbs.db
Desktop.ini

# Mac
.DS_Store
.AppleDouble
.LSOverride

# Secrets (NEVER commit these)
*.secrets.json
appsettings.*.json
!appsettings.json
```

## 7.3 Branch Strategi

```
main              # Stabil, release-ready
├── develop       # Løbende udvikling
│   ├── feature/onboarding
│   ├── feature/home-screen
│   └── feature/habit-detail
└── release/v1.0  # Release branches
```

### Opret feature branch:
```powershell
git checkout -b feature/onboarding
# ... lav ændringer ...
git add .
git commit -m "Implementer onboarding welcome screen"
git push -u origin feature/onboarding
```

## 7.4 GitHub Repository (Valgfrit)

```powershell
# Opret repo på GitHub først, så:
git remote add origin https://github.com/DIT_BRUGERNAVN/Stribe.git
git push -u origin main
```

---

# DEL 8: NÆSTE SKRIDT

## Checklist: Klar til udvikling

- [ ] Visual Studio 2022 installeret med MAUI workload
- [ ] .NET 8 SDK installeret og verificeret
- [ ] Android emulator opsat og testet
- [ ] Git installeret
- [ ] Projekt oprettet med `dotnet new maui`
- [ ] Mappestruktur reorganiseret
- [ ] NuGet packages installeret
- [ ] CLAUDE.md oprettet
- [ ] .state/ tracking filer oprettet
- [ ] Colors.xaml og Styles.xaml oprettet
- [ ] Base models oprettet
- [ ] DatabaseService implementeret
- [ ] MauiProgram.cs konfigureret med DI
- [ ] .gitignore oprettet
- [ ] Initial commit lavet

## Start udvikling

Når alt er sat op, start med Sprint 1, Task 1.1:

1. Åbn `/.state/CURRENT_TASK.md`
2. Udfyld med første task (Welcome Page)
3. Læs UX spec for skærmen
4. Implementer
5. Test på Windows
6. Commit

---

# APPENDIX: Troubleshooting

## Problem: "MAUI workload not installed"
```powershell
dotnet workload install maui
dotnet workload repair
```

## Problem: Android emulator starter ikke
1. Check at Hyper-V er slået til (Windows Features)
2. Check at Intel HAXM er installeret
3. Prøv at oprette ny emulator med lavere API level

## Problem: Build fejler med package errors
```powershell
dotnet restore
dotnet clean
dotnet build
```

## Problem: Hot Reload virker ikke
1. Check at du kører i Debug mode
2. Genstart Visual Studio
3. Check at "XAML Hot Reload" er enabled i Tools → Options

---

*Guide version: 1.0*
*Opdateret: December 2025*
