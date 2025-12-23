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
