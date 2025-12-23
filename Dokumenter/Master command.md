# MASTER PROMPT: Opret Stribe Implementeringsplan med Commands

## Din Opgave
Du skal analysere hele Stribe-projektet og oprette en komplet, selvvedligeholdende implementeringsplan med individuelle commands der kan køres sekventielt eller enkeltvis.

## Trin 1: Analyse
Læs og analyser følgende projektfiler grundigt:
- `/mnt/project/habit_tracker_mvp_plan.md` - MVP plan med features og prioriteter
- `/mnt/project/stribe_ux_design.md` - Komplet UX specification (omdøb reference til stribe_design_manual.md)
- `/mnt/project/stribe_setup_guide.md` - Teknisk setup og arkitektur
- `/mnt/project/CHANGELOG.md` - Versionshistorik

Identificer:
1. Alle skærme der skal implementeres
2. Alle komponenter (models, services, viewmodels, views)
3. Afhængigheder mellem komponenter
4. Logisk rækkefølge for implementering
5. Testkriterier for hver del

## Trin 2: Opret Command-struktur
Opret mappen `/.commands/` med følgende struktur:
```
/.commands/
├── README.md                    # Oversigt og kørselsguide
├── _state.json                  # Tracking af gennemførte commands
├── phase-1-foundation/
│   ├── 001_project_setup.md
│   ├── 002_database_service.md
│   ├── 003_base_models.md
│   └── ...
├── phase-2-onboarding/
│   ├── 010_welcome_page.md
│   ├── 011_habit_select_page.md
│   └── ...
├── phase-3-core/
│   ├── 020_home_screen.md
│   ├── 021_habit_card.md
│   └── ...
├── phase-4-detail/
│   └── ...
└── phase-5-polish/
    └── ...
```

## Trin 3: Command Format
Hver command-fil skal følge dette format:
```markdown
# Command [XXX]: [Titel]

## Metadata
- **ID:** XXX
- **Fase:** [1-5]
- **Estimeret tid:** X timer
- **Afhængigheder:** [Liste af command IDs der skal være færdige først]
- **Design reference:** stribe_design_manual.md > [Sektion navn]

## Analyse

### Hvad skal implementeres
[Detaljeret beskrivelse af hvad dette step dækker]

### Filer der oprettes/ændres
- `path/to/file1.cs` - [Beskrivelse]
- `path/to/file2.xaml` - [Beskrivelse]

### Design specifikationer
[Uddrag af relevante design tokens, layouts, og specs fra stribe_design_manual.md]

### Tekniske overvejelser
[Særlige hensyn, edge cases, platform-specifikke ting]

## Implementering

### Prompt til Claude Code
```
[Den præcise prompt Claude Code skal bruge til at implementere dette step.
Skal være selvstændig og indeholde al nødvendig kontekst.]
Forventet resultat
[Beskrivelse af hvad der skal eksistere efter implementering]
Verifikation
Automatiske tests
bash# Commands der verificerer implementeringen
dotnet build src/Stribe/Stribe.csproj
# Yderligere test commands
```

### Manuelle tests
- [ ] Test 1: [Beskrivelse]
- [ ] Test 2: [Beskrivelse]

### Acceptkriterier
- [ ] Kriterie 1
- [ ] Kriterie 2

## Status
- [ ] Analyse gennemført
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
```

## Trin 4: Opdater CLAUDE.md
Opdater `/CLAUDE.md` (eller opret den) med:

1. Projektbeskrivelse
2. Reference til command-systemet
3. Kørselsguide for commands
4. Quick reference til design manual
5. Aktuel status (læses fra `/.commands/_state.json`)

Tilføj denne sektion:
```markdown
## Command System

### Kør enkelt command
```
Kør command [XXX]: [læs og udfør /.commands/phase-X/XXX_navn.md]
```

### Kør command range
```
Kør commands [XXX] til [YYY]: [udfør sekventielt, stop ved fejl]
```

### Kør næste command
```
Kør næste command: [find næste ikke-færdige command i _state.json og udfør]
```

### Status
```
Vis command status: [læs _state.json og vis oversigt]
```
```

## Trin 5: Opret _state.json
Opret `/.commands/_state.json`:
```json
{
  "project": "Stribe",
  "version": "0.1.0",
  "lastUpdated": "YYYY-MM-DD",
  "commands": {
    "001": { "status": "pending", "completedAt": null },
    "002": { "status": "pending", "completedAt": null }
    // ... alle commands
  },
  "currentPhase": 1,
  "nextCommand": "001"
}
```

## Trin 6: Opret Commands README
Opret `/.commands/README.md` med:

1. Komplet liste af alle commands med beskrivelser
2. Dependency graph (hvilke commands afhænger af hvilke)
3. Estimeret total tid per fase
4. Kørselsguide

## Krav til Commands

### Granularitet
- Hver command skal kunne gennemføres på 1-4 timer
- Én command = én logisk enhed (én skærm, én service, osv.)
- Split store opgaver i flere commands

### Afhængigheder
- Definer eksplicit hvad der skal være færdigt først
- Ingen cirkulære afhængigheder
- Foundation commands før feature commands

### Design Reference
- Hver command SKAL referere til specifik sektion i stribe_design_manual.md
- Inkluder relevante design tokens, spacing, colors i command-filen
- Kopiér ikke hele design spec, men referer og uddrag det nødvendige

### Verifikation
- Hver command SKAL have konkrete testkriterier
- Inkluder både automatiske (build, lint) og manuelle tests
- Definer præcist hvad "færdig" betyder

## Output
Når du er færdig, giv mig:
1. Oversigt over alle oprettede faser og commands
2. Total antal commands
3. Estimeret samlet udviklingstid
4. Næste skridt for at starte udvikling

## Start nu
Begynd med at læse alle projektfiler, analyser dem, og opret derefter hele command-strukturen. Arbejd systematisk og grundigt.