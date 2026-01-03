# Circuit Puzzle Complete Package - File Manifest

## Package Version: 2.0 - Visual Customization Edition
## Created: January 3, 2026
## Total Files: 7
## Total Size: ~113 KB

---

## FILES INCLUDED

### 1. MFS_CircuitRouting.js (69 KB)
**Type:** RPG Maker MV Plugin
**Purpose:** Main plugin file with visual customization support
**Install Location:** YourProject/js/plugins/
**Features:**
- Full visual customization per puzzle
- Manual puzzle loading from JSON
- Mouse/touch controls
- Lighting effects
- Theme support

### 2. CircuitPuzzleDesigner.html (20 KB)
**Type:** Standalone Web Tool
**Purpose:** Visual puzzle designer with theme editor
**Usage:** Open in web browser (Chrome, Firefox, Edge)
**Features:**
- Drag-and-drop grid editor
- Color pickers for all visual properties
- 5 theme presets (Fire, Ice, Nature, Electric, Arcane)
- One-click JSON generation
- Copy to clipboard

### 3. ExamplePuzzles.json (5 KB)
**Type:** JSON Data File
**Purpose:** 5 complete themed example puzzles
**Install Location:** YourProject/data/CircuitPuzzles.json
**Contents:**
- fire_theme_puzzle (Fire Temple)
- ice_theme_puzzle (Frozen Conduits)
- nature_theme_puzzle (Living Vines)
- electric_theme_puzzle (Power Grid)
- arcane_theme_puzzle (Mystical Circuit)

### 4. README.md (7.4 KB)
**Type:** Documentation
**Purpose:** Complete user manual
**Sections:**
- Installation instructions
- Usage guide
- Visual customization reference
- Troubleshooting
- Examples
- Tips & best practices

### 5. VISUAL_GUIDE.md (6.4 KB)
**Type:** Documentation
**Purpose:** Visual customization reference
**Sections:**
- All visual properties explained
- Color customization
- Animation settings
- Theme examples
- Particle systems
- Best practices

### 6. INSTALL.txt (854 bytes)
**Type:** Quick Start Guide
**Purpose:** Fast installation reference
**Contents:**
- 4-step installation process
- File locations
- Quick test instructions

### 7. CHANGELOG.md (3.7 KB)
**Type:** Documentation
**Purpose:** Version history and changes
**Sections:**
- New features in V2.0
- Removed features
- Migration guide
- Bug fixes
- Breaking changes

---

## INSTALLATION SUMMARY

1. Copy MFS_CircuitRouting.js → js/plugins/
2. Copy ExamplePuzzles.json → data/CircuitPuzzles.json
3. Enable plugin in Plugin Manager
4. Test with: `CircuitPuzzle load fire_theme_puzzle`
5. Design custom puzzles in CircuitPuzzleDesigner.html

---

## PLUGIN PARAMETERS

All parameters have sensible defaults. You can customize:
- Puzzle Data File (default: CircuitPuzzles)
- Cell Size (default: 80px)
- Success Switch (default: 1)
- Time Variable (default: 1)
- Moves Variable (default: 2)
- Sound Effects
- Instruction Timer (default: 180 frames = 3 seconds)

---

## PLUGIN COMMANDS

### Load Puzzle:
```
CircuitPuzzle load puzzle_name
```

Example:
```
CircuitPuzzle load fire_theme_puzzle
```

---

## JSON FORMAT SUMMARY

```json
{
  "puzzle_id": {
    "name": "Display Name",
    "gridSize": 7,
    "timeLimit": 120,
    "source": {"x": 0, "y": 3, "edge": 3},
    "destination": {"x": 6, "y": 3, "edge": 1},
    "lighting": [
      {"x": 2, "y": 2, "type": "fire"}
    ],
    "grid": [
      // Manual layout (optional)
    ],
    "visual": {
      "energyColor": "#ff8800",
      "pipeColor": "#8B7355",
      "bgColor": "#1a1a2e",
      "gridLineColor": "#8B7355",
      "flowSpeed": 3,
      "particleCount": 10,
      "ambientParticleCount": 30,
      "showGears": true,
      "showSteam": true
    },
    "description": "Optional description"
  }
}
```

---

## FEATURES OVERVIEW

### Visual Customization:
✅ Per-puzzle colors (4 customizable colors)
✅ Per-puzzle animation settings
✅ Per-puzzle effect toggles
✅ Theme preset system
✅ Backward compatible

### Puzzle Design:
✅ Manual grid layouts
✅ Source/destination control
✅ Rotation control
✅ Lock/unlock pipes
✅ Lighting effects
✅ Time limits

### Designer Tool:
✅ Visual grid editor
✅ Color pickers
✅ Theme presets
✅ JSON generation
✅ Copy to clipboard

### Gameplay:
✅ Keyboard controls
✅ Mouse controls
✅ Touch controls
✅ Move counter
✅ Timer
✅ Success detection

---

## VERSION HISTORY

**V2.0 (Jan 2026)** - Visual Customization Edition
- Added full visual customization
- Added theme presets
- Removed random generation
- Enhanced designer tool

**V1.0 (Dec 2025)** - Initial Release
- Basic circuit puzzle system
- Random generation
- Manual layouts
- Keyboard controls

---

## COMPATIBILITY

**Requires:**
- RPG Maker MV (1.6.0 or higher)
- Modern web browser for designer (Chrome, Firefox, Edge)

**Compatible With:**
- All RPG Maker MV projects
- Desktop and mobile deployment
- Steam and other platforms

**Not Compatible With:**
- RPG Maker VX Ace (different engine)
- RPG Maker MZ (different plugin format)

---

## SUPPORT & RESOURCES

**Included Documentation:**
- README.md - Complete manual
- VISUAL_GUIDE.md - Customization reference
- INSTALL.txt - Quick start
- CHANGELOG.md - Version history

**Example Files:**
- ExamplePuzzles.json - 5 themed puzzles
- Each demonstrates different features

**Tools:**
- CircuitPuzzleDesigner.html - Full designer

---

## CREDITS

**Created by:** MikeFirestrike
**Version:** 2.0
**License:** Free for commercial and non-commercial use
**Credit:** Appreciated but not required

---

**Package is complete and ready to use!**
**Open INSTALL.txt or README.md to get started.**

🔥❄️🌿⚡🔮
