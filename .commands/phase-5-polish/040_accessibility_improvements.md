# Command 040: Accessibility Improvements

## Metadata
- **ID:** 040
- **Fase:** 5 - Polish & Launch
- **Estimeret tid:** 2-3 timer
- **Afhængigheder:** All screens
- **Design reference:** N/A (Accessibility standards)

## Formål
Sikre app er accessible med screen readers og assistive technologies.

## Analyse
Accessibility areas:
- AutomationProperties.Name for alle interactive elements
- AutomationProperties.HelpText for context
- Semantisk hierarchy (headings)
- Focus order korrekt
- Minimum tap targets (44dp)
- Color contrast WCAG AA compliant
- Support for large text

## Implementering
For hver screen:
- Add AutomationProperties.Name
- Add AutomationProperties.HelpText hvor relevant
- Test med iOS VoiceOver
- Test med Android TalkBack
- Verificer tap target sizes
- Check color contrast ratios
- Test med large text size

## Status
- [ ] Implementering gennemført
