# Command 035: Settings Page Layout

## Metadata
- **ID:** 035
- **Fase:** 5 - Polish & Launch
- **Estimeret tid:** 2-3 timer
- **Afhængigheder:** 007
- **Design reference:** stribe-design/screens/09_SETTINGS.md

## Formål
Implementere Settings Page med app preferences og data management.

## Analyse
Settings page med:
- Header med back button
- Settings sections:
  - Notifications (enable/disable, time)
  - Day Start Time (command 036)
  - Data (Export CSV, Clear data)
  - About (Version, Credits, Privacy)

## Implementering
- Views/SettingsPage.xaml layout
- ViewModels/SettingsViewModel.cs
- Load settings fra SettingsService
- Toggle switches for notifications
- Navigation til day start time picker
- Export data button
- Clear data confirmation
- About info (version from assembly)

## Status
- [ ] Implementering gennemført
