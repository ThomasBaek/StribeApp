# Stribe - UX Design Specifikation
## Til brug med Claude Code

---

## 📁 MAPPESTRUKTUR

```
stribe-design/
├── README.md                    ← DU ER HER
├── DESIGN_SYSTEM.md             ← Farver, fonts, spacing, animationer
├── NAVIGATION.md                ← App flow og navigation
├── screens/
│   ├── 01_SPLASH.md             ← Splash screen
│   ├── 02_ONBOARDING_WELCOME.md ← Onboarding step 1
│   ├── 03_ONBOARDING_HABITS.md  ← Onboarding step 2
│   ├── 04_ONBOARDING_REMINDER.md← Onboarding step 3
│   ├── 05_HOME.md               ← Hovedskærm (habit liste)
│   ├── 06_HABIT_DETAIL.md       ← Habit detaljer
│   ├── 07_ADD_HABIT.md          ← Tilføj ny habit
│   ├── 08_EDIT_HABIT.md         ← Rediger habit
│   ├── 09_SETTINGS.md           ← Indstillinger
│   └── 10_MILESTONE_CELEBRATION.md ← Fejrings-modal
└── components/
    └── HABIT_CARD.md            ← Genbrugelig habit card komponent
```

---

## 🚀 SÅDAN BRUGER DU DETTE MED CLAUDE CODE

### Metode 1: Fil-baseret (Anbefalet)
```bash
# Kopiér design-mappen til dit projekt
cp -r stribe-design/ /path/to/your/maui-project/design/

# Når du arbejder på en skærm, sig til Claude Code:
"Læs filen design/screens/05_HOME.md og implementer denne skærm i .NET MAUI"
```

### Metode 2: Prompt per skærm
```
Kopier indholdet af én skærm-fil og paste det til Claude Code med:
"Implementer denne skærm specifikation i .NET MAUI: [paste fil-indhold]"
```

### Metode 3: MCP Integration (Avanceret)
```yaml
# .claude/mcp.json
{
  "file_context": {
    "design_system": "./design/DESIGN_SYSTEM.md",
    "current_screen": "./design/screens/05_HOME.md"
  }
}
```

---

## 📋 IMPLEMENTERINGS-RÆKKEFØLGE

Start med disse filer i denne rækkefølge:

| # | Fil | Beskrivelse | Prioritet |
|---|-----|-------------|-----------|
| 1 | `DESIGN_SYSTEM.md` | Læs først - definerer alle styles | 🔴 Kritisk |
| 2 | `components/HABIT_CARD.md` | Genbrugelig komponent | 🔴 Kritisk |
| 3 | `screens/01_SPLASH.md` | Simpel start-skærm | 🟢 Let |
| 4 | `screens/05_HOME.md` | Hovedskærm - kerne af app | 🔴 Kritisk |
| 5 | `screens/07_ADD_HABIT.md` | Tilføj habit form | 🟡 Medium |
| 6 | `screens/06_HABIT_DETAIL.md` | Habit detaljer | 🟡 Medium |
| 7 | `screens/02-04_ONBOARDING*.md` | Onboarding flow | 🟡 Medium |
| 8 | `screens/09_SETTINGS.md` | Indstillinger | 🟢 Let |
| 9 | `screens/10_MILESTONE_CELEBRATION.md` | Fejring modal | 🟢 Let |

---

## 🎯 CORE FEATURES (MVP)

Disse 5 features er specificeret i design-filerne:

1. **✅ Streak Tracking** → `05_HOME.md`, `HABIT_CARD.md`
2. **🔔 Påmindelser** → `07_ADD_HABIT.md`, `09_SETTINGS.md`
3. **📊 Simpel Statistik** → `06_HABIT_DETAIL.md`
4. **🎨 Personalisering** → `07_ADD_HABIT.md`
5. **🏆 Milestones** → `10_MILESTONE_CELEBRATION.md`

---

## 🛠️ TECH STACK

Designet er optimeret til:
- **.NET MAUI** (iOS + Android)
- **SQLite** (lokal database)
- **RevenueCat** (betalinger)

---

## 📐 DESIGN TOKENS

Hurtig reference fra `DESIGN_SYSTEM.md`:

### Farver
```
primary:       #2D5A4A   (mørk grøn)
background:    #FAFBFA   (off-white)
text_primary:  #1A2421   (næsten sort)
success:       #4CAF7A   (grøn)
streak_fire:   #F5A623   (orange)
```

### Spacing
```
space_2:  8dp   (tight)
space_4:  16dp  (default)
space_6:  24dp  (relaxed)
```

### Animationer
```
duration_fast:   150ms
duration_normal: 250ms
ease_bounce:     cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## ✅ CHECKLISTE FOR HVER SKÆRM

Når du implementerer en skærm, verificer:

- [ ] Alle elementer fra specifikationen er med
- [ ] Farver matcher `DESIGN_SYSTEM.md`
- [ ] Spacing følger 4dp grid
- [ ] Touch targets er min. 44dp
- [ ] Animationer er implementeret
- [ ] Accessibility labels er sat
- [ ] Platform-specifikke tilpasninger (iOS/Android)

---

## 📱 SKÆRM-PREVIEW

### Home Screen (05_HOME.md)
```
┌─────────────────────────────────────┐
│ ☰                      Stribe   ⚙️  │
├─────────────────────────────────────┤
│   Tirsdag, 23. december             │
│   ─────────────────────────         │
│   ┌─────────────────────────────┐   │
│   │ 🏃 Motion            🔥 14  │   │
│   │                        [ ✓ ]│   │
│   └─────────────────────────────┘   │
│   ┌─────────────────────────────┐   │
│   │ 📚 Læse              🔥 7   │   │
│   │                        [   ]│   │
│   └─────────────────────────────┘   │
│              [ ➕ Ny habit ]        │
└─────────────────────────────────────┘
```

### Milestone Celebration (10_MILESTONE_CELEBRATION.md)
```
┌─────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓┌─────────────────────────────┐▓▓▓│
│▓▓▓│      🎉 ✨ 🎊              │▓▓▓│
│▓▓▓│          🏅                 │▓▓▓│
│▓▓▓│        21 DAGE              │▓▓▓│
│▓▓▓│        🧘 Motion            │▓▓▓│
│▓▓▓│   "Du har skabt en vane!"   │▓▓▓│
│▓▓▓│  [Del 📤]  [Fortsæt →]      │▓▓▓│
│▓▓▓└─────────────────────────────┘▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└─────────────────────────────────────┘
```

---

## 🔗 RELATEREDE DOKUMENTER

- `habit_tracker_mvp_plan.md` - Forretningsplan og konkurrentanalyse
- `app_markedsanalyse.md` - Markedsresearch

---

*Sidst opdateret: 23. december 2025*
*Version: 1.0*
