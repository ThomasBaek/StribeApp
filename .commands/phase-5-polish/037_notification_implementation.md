# Command 037: Notification Implementation

## Metadata
- **ID:** 037
- **Fase:** 5 - Polish & Launch
- **Estimeret tid:** 4-5 timer
- **Afhængigheder:** 006
- **Design reference:** N/A (Platform specific)

## Formål
Implementere fuld notification functionality - erstatte NotificationService stub med real implementation.

## Analyse
Notification implementation med:
- Request notification permissions (iOS/Android)
- Schedule daily reminder på bruger-valgt tid
- Reschedule når tid ændres
- Cancel notifications når disabled
- Notification content (title, body, icon)
- Deep link til app når tapped

## Implementering
- Update Services/NotificationService.cs
- Platform-specific code (iOS/Android)
- Use .NET MAUI Local Notifications API
- Permission requests
- Schedule/Cancel logic
- Test på både iOS og Android

## Status
- [ ] Implementering gennemført
