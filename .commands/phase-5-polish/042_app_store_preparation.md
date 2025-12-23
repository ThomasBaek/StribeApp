# Command 042: App Store Preparation

## Metadata
- **ID:** 042
- **Fase:** 5 - Polish & Launch
- **Estimeret tid:** 2-3 timer
- **Afhængigheder:** All
- **Design reference:** N/A (Publishing)

## Formål
Forberede app til submission til iOS App Store og Google Play Store.

## Analyse
App Store requirements:
- App icons (alle størrelser)
- Splash screen
- Screenshots (iPhone, iPad, Android)
- Store listing tekst (title, description, keywords)
- Privacy policy
- Support URL
- Version number og build number
- Bundle identifiers
- Signing certificates

## Implementering
Opret/saml:
- App icons i alle required sizes
  - iOS: 1024x1024 App Store icon, plus device icons
  - Android: Adaptive icons (foreground + background)
- Launch screen images
- Screenshots:
  - iPhone 6.7" (iPhone 15 Pro Max)
  - iPad 12.9" (iPad Pro)
  - Android Phone
- Store listing:
  - Title: "Stribe - Habit Tracker"
  - Subtitle/Short description
  - Full description (Danish + English)
  - Keywords
  - Category: Productivity
  - Age rating: 4+
- Privacy Policy dokument
- Support email/URL
- Update Info.plist (iOS) og AndroidManifest.xml
- Set version: 1.0.0 (build 1)
- Test builds (TestFlight for iOS, Internal Testing for Android)

## Status
- [ ] Implementering gennemført
