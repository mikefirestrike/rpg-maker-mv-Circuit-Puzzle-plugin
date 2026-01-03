# Circuit Puzzle - Version 2.0 Changelog

## Version 2.0 - Visual Customization Edition (January 2026)

### 🎨 NEW FEATURES

**Visual Customization System**
- Per-puzzle color customization (energy, pipes, background, grid lines)
- Per-puzzle animation settings (flow speed, particle counts)
- Per-puzzle effect toggles (gears, steam)
- Theme preset system (Fire, Ice, Nature, Electric, Arcane)
- JSON-driven visual configuration

**Designer Tool Enhancements**
- Color picker inputs for all visual properties
- Slider controls for animation settings
- One-click theme preset buttons
- Live value displays for sliders
- Visual settings included in JSON output
- Improved layout with 4-column workspace

**Plugin Improvements**
- Visual settings loader with fallback to defaults
- All rendering functions now use puzzle-specific colors
- Backward compatible (puzzles without visual settings work fine)
- Cleaner code organization

### 🗑️ REMOVED FEATURES

**Random Puzzle Generation**
- Removed `generateRandomPuzzle` function
- Removed `random` plugin command
- Focus shifted to hand-crafted, themed puzzles
- All puzzles now manually designed via JSON

**Rationale:** Random generation created unsolvable or bland puzzles. Manual design with visual themes produces much better results.

### 🔧 CHANGES

**Plugin Commands**
- OLD: `CircuitPuzzle random 7 120`
- NEW: Only `CircuitPuzzle load puzzle_name` supported

**JSON Format**
- Added optional `visual` object with 9 properties
- Backward compatible - puzzles without visual settings work fine
- See VISUAL_GUIDE.md for complete format

**UI/UX**
- Removed in-game help text (cleaner gameplay)
- Compact instruction screen
- Better visual hierarchy

### 📋 MIGRATION GUIDE

**From Version 1.x to 2.0:**

1. **Plugin File:** Replace with new MFS_CircuitRouting.js
2. **Puzzles:** Keep existing puzzles, they'll use default visuals
3. **Commands:** Change any `CircuitPuzzle random` commands to use `load` instead
4. **Optional:** Add visual settings to existing puzzles for custom themes

**Example Migration:**

OLD JSON:
```json
{
  "my_puzzle": {
    "gridSize": 7,
    "timeLimit": 120,
    "source": {"x": 0, "y": 3},
    "destination": {"x": 6, "y": 3}
  }
}
```

NEW JSON (optional visual addition):
```json
{
  "my_puzzle": {
    "gridSize": 7,
    "timeLimit": 120,
    "source": {"x": 0, "y": 3, "edge": 3},
    "destination": {"x": 6, "y": 3, "edge": 1},
    "visual": {
      "energyColor": "#ff3300",
      "pipeColor": "#aa4400",
      "bgColor": "#2a1410",
      "gridLineColor": "#cc6633",
      "flowSpeed": 4,
      "particleCount": 15,
      "ambientParticleCount": 40,
      "showGears": true,
      "showSteam": true
    }
  }
}
```

### 🐛 BUG FIXES

- Fixed overlapping instruction text
- Fixed missing fontSize on help window
- Fixed duplicate prepare function lines
- Fixed edge detection for corner positions
- Removed flow sound effect (was annoying)

### ⚡ PERFORMANCE

- Slightly better performance (removed random generation overhead)
- Visual settings loaded once per puzzle
- No runtime changes to performance

### 📦 PACKAGE CONTENTS

1. MFS_CircuitRouting.js - Updated plugin
2. CircuitPuzzleDesigner.html - Enhanced designer tool
3. ExamplePuzzles.json - 5 themed example puzzles
4. README.md - Complete documentation
5. VISUAL_GUIDE.md - Visual customization reference
6. INSTALL.txt - Quick install guide
7. CHANGELOG.md - This file

### 🙏 CREDITS

Created by MikeFirestrike
Special thanks to the RPG Maker MV community

### 📜 LICENSE

Free to use in commercial and non-commercial projects.
Credit appreciated but not required.

---

**Ready to create beautiful themed circuit puzzles!** 🔥❄️🌿⚡🔮
