# Command 038: CSV Export Feature

## Metadata
- **ID:** 038
- **Fase:** 5 - Polish & Launch
- **Estimeret tid:** 2-3 timer
- **Afhængigheder:** 035
- **Design reference:** N/A (Feature)

## Formål
Implementere CSV export functionality - export alle habits og completions til CSV fil.

## Analyse
CSV Export med:
- Generate CSV fra database data
- Format: Habit Name, Date, Completed (Yes/No)
- Save til device storage
- Share via platform share sheet
- Confirmation toast

## Implementering
- Services/ExportService.cs
- Generate CSV string fra habits + completions
- Use File.WriteAllText eller CsvHelper library
- Platform share sheet (IShare)
- Add command i SettingsViewModel
- Loading indicator under export

## Status
- [ ] Implementering gennemført
