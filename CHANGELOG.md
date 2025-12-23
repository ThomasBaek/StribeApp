# Changelog

All notable changes to Stribe will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added - v1.1 Features
- **Daglige gentagelser**: Vaner kan nu sættes til 1-99 daglige gentagelser (fx "Drik vand 8x dagligt")
- **Ugedag-planlægning**: Vaner kan konfigureres til specifikke ugedage (hver dag, hverdage, weekend, eller custom)
- **Progress tracking**: Multi-completion tracking med visuel progress ring
- **Habit model udvidelser**:
  - `DailyTargetCount` (int, 1-99, default: 1) - Antal gange per dag
  - `ActiveDays` (string bitmask, default: "1111111") - Hvilke ugedage vanen gælder
- **Completion model udvidelser**:
  - `Count` (int, default: 1) - Antal completions for en given dag

### Added - Development Standards
- **Kode kvalitets-checklist** i alle commands
- **KISS princippet**: Vælg altid den simpleste løsning
- **Clean Code standarder**: Selvdokumenterende kode, beskrivende navne
- **Kode evaluering** sektion i command templates
- Omfattende code quality dokumentation i CLAUDE.md

### Added - UI Components (Planned)
- Gentagelses-vælger (Daily Target Picker): Stepper til at vælge 1-99 gentagelser
- Ugedag-vælger (Weekday Picker): 7 toggle-knapper for Man-Søn
- Progress ring component til habits med flere gentagelser
- Quick-select buttons: "Hver dag", "Hverdage", "Weekend"

### Changed
- **Habit card**: Viser nu progress (x/y) for vaner med flere gentagelser
- **Onboarding flow**: Udvidet med frekvens-konfiguration
- **Statistik beregning**: Opdateret til at håndtere partial completions
- **Streak logik**: Tager nu højde for active days (kun tæller dage hvor vanen gælder)

### Technical
- Database schema opdateret med nye felter
- Prototype v1.1 implementeret med frequency features
- MVP Plan v1.1 opdateret
- Nye helper funktioner til weekday handling

---

## [0.1.0] - 2025-12-23

### Added - Foundation (Commands 001-004)
- AppShell med route registreringer
- Splash screen med animations
- Alle stub pages oprettet (10 pages)
- Helpers & Extensions (Constants, DateTimeExtensions, ColorExtensions, StringExtensions)
- Value Converters (6 converters):
  - BoolToColorConverter
  - InverseBoolConverter
  - IntToVisibilityConverter
  - DateToStringConverter
  - StreakToColorConverter
  - EmptyStringToVisibilityConverter
- DI registreringer i MauiProgram.cs

### Added - Models & Database
- Habit model (Id, Name, Emoji, Color, ReminderTime, CreatedAt, IsArchived, SortOrder)
- Completion model (Id, HabitId, Date, CompletedAt)
- AppSettings model (Key, Value)
- DatabaseService med SQLite integration
- IDatabaseService interface

### Added - Design System
- Colors.xaml med Scandinavian design tokens
- Styles.xaml med typography, buttons, cards, inputs
- Design specifications for alle screens
- Component specifications (HabitCard, etc.)

### Technical
- .NET 10 MAUI project setup
- SQLite-net-pcl integration
- CommunityToolkit.Mvvm
- CommunityToolkit.Maui
- MVVM architecture med dependency injection

---

## Development Notes

### MVP Features Status
- ✅ Streak tracking (enhanced med frequency support)
- ⏸️ Påmindelser (Command 006-037)
- ⏸️ Statistik (Command 015-024)
- ⏸️ Personalisering (Commands 028-030)
- ⏸️ Milestones (Commands 033-034)

### Next Steps
- Implement HabitService (Command 005) med frequency-aware streak calculation
- Build UI components for frequency selection
- Update onboarding flow med frequency configuration
- Test multi-completion workflows

---

*Version tracking started: 2025-12-23*
