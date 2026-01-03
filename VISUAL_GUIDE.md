# Visual Customization System

## Overview

You can now customize every visual aspect of your puzzles! Colors, particles, effects - everything can be themed per-puzzle.

## JSON Format

Add a `"visual"` object to any puzzle definition:

```json
{
  "my_puzzle": {
    "name": "Custom Themed Puzzle",
    "gridSize": 7,
    "timeLimit": 120,
    "source": {"x": 0, "y": 3, "edge": 3},
    "destination": {"x": 6, "y": 3, "edge": 1},
    "lighting": [...],
    "visual": {
      "energyColor": "#ff8800",
      "pipeColor": "#8B7355",
      "bgColor": "#1a1a2e",
      "gridLineColor": "#8B7355",
      "flowSpeed": 3,
      "particleCount": 10,
      "ambientParticleCount": 30,
      "showGears": true,
      "showSteam": true,
      "particles": [...]
    }
  }
}
```

## Visual Properties

### Colors

**energyColor** - Color of energy flow particles
- Default: `"#ff8800"` (orange)
- Examples: `"#ff3300"` (red), `"#00ddff"` (cyan), `"#00ff66"` (green)

**pipeColor** - Color of pipe pieces
- Default: `"#8B7355"` (brown/copper)
- Examples: `"#aa4400"` (dark copper), `"#6699cc"` (blue metal), `"#338844"` (green)

**bgColor** - Background color (gradient center)
- Default: `"#1a1a2e"` (dark purple)
- Examples: `"#2a1410"` (dark red), `"#0a1a2a"` (dark blue), `"#0f1f0f"` (dark green)

**gridLineColor** - Color of grid lines
- Default: `"#8B7355"` (brown)
- Examples: `"#cc6633"` (copper), `"#4488bb"` (blue), `"#66aa66"` (green)

### Animation Settings

**flowSpeed** - Speed of energy particle movement
- Default: `3`
- Range: `1-10`
- Lower = slower, Higher = faster

**particleCount** - Number of particles per energy stream
- Default: `10`
- Range: `1-50`

**ambientParticleCount** - Number of floating ambient particles
- Default: `30`
- Range: `0-100`

**showGears** - Show floating gear animations
- Default: `true`
- Values: `true` or `false`

**showSteam** - Show steam particle effects
- Default: `true`
- Values: `true` or `false`

### Custom Particle Effects

**particles** - Array of custom particle systems

```json
"particles": [
  {
    "type": "embers",
    "count": 20,
    "color": "#ff6600",
    "speed": 2,
    "size": 3
  }
]
```

**Particle Types:**
- `"embers"` - Rising ember particles (fire theme)
- `"snowflakes"` - Falling snowflakes (ice theme)
- `"sparks"` - Fast electric sparks
- `"leaves"` - Falling leaves (nature theme)
- `"pollen"` - Slow floating pollen
- `"lightning"` - Quick lightning flashes
- `"static"` - Static electricity particles
- `"runes"` - Floating runic symbols (arcane theme)
- `"stardust"` - Twinkling stars
- `"frost"` - Frost crystals

**Particle Properties:**
- `type` - Type of particle (see list above)
- `count` - How many particles (1-100)
- `color` - Particle color (hex code)
- `speed` - Movement speed (0.1-10)
- `size` - Particle size in pixels (1-10)

## Theme Examples

### 🔥 Fire Theme
```json
"visual": {
  "energyColor": "#ff3300",
  "pipeColor": "#aa4400",
  "bgColor": "#2a1410",
  "gridLineColor": "#cc6633",
  "flowSpeed": 4,
  "particles": [
    {"type": "embers", "count": 20, "color": "#ff6600", "speed": 2, "size": 3},
    {"type": "sparks", "count": 10, "color": "#ffaa00", "speed": 5, "size": 2}
  ]
}
```

### ❄️ Ice Theme
```json
"visual": {
  "energyColor": "#00ddff",
  "pipeColor": "#6699cc",
  "bgColor": "#0a1a2a",
  "gridLineColor": "#4488bb",
  "flowSpeed": 2,
  "showGears": false,
  "showSteam": false,
  "particles": [
    {"type": "snowflakes", "count": 30, "color": "#ffffff", "speed": 1, "size": 4},
    {"type": "frost", "count": 15, "color": "#aaddff", "speed": 0.5, "size": 2}
  ]
}
```

### 🌿 Nature Theme
```json
"visual": {
  "energyColor": "#00ff66",
  "pipeColor": "#338844",
  "bgColor": "#0f1f0f",
  "gridLineColor": "#66aa66",
  "flowSpeed": 3,
  "showGears": false,
  "particles": [
    {"type": "leaves", "count": 25, "color": "#44ff88", "speed": 1.5, "size": 5},
    {"type": "pollen", "count": 40, "color": "#ffff66", "speed": 0.8, "size": 1}
  ]
}
```

### ⚡ Electric Theme
```json
"visual": {
  "energyColor": "#00ffff",
  "pipeColor": "#4466aa",
  "bgColor": "#0a0a1a",
  "gridLineColor": "#6688cc",
  "flowSpeed": 6,
  "particles": [
    {"type": "lightning", "count": 15, "color": "#ffff00", "speed": 8, "size": 2},
    {"type": "static", "count": 50, "color": "#aaffff", "speed": 4, "size": 1}
  ]
}
```

### 🔮 Arcane/Magic Theme
```json
"visual": {
  "energyColor": "#cc66ff",
  "pipeColor": "#664488",
  "bgColor": "#1a0a2a",
  "gridLineColor": "#8855aa",
  "flowSpeed": 3,
  "particles": [
    {"type": "runes", "count": 12, "color": "#ff66ff", "speed": 2, "size": 6},
    {"type": "stardust", "count": 60, "color": "#ffffff", "speed": 1, "size": 1}
  ]
}
```

## Combining with Manual Layouts

You can combine visual customization with manual puzzle layouts:

```json
{
  "custom_fire_puzzle": {
    "name": "Fire Temple - Custom Layout",
    "gridSize": 5,
    "timeLimit": 60,
    "source": {"x": 0, "y": 2, "edge": 3},
    "destination": {"x": 4, "y": 2, "edge": 1},
    "grid": [
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "corner", "straight", "corner", "empty"],
      ["SOURCE", "straight", "corner", "straight", "DEST"],
      ["empty", "corner", "straight", "corner", "empty"],
      ["empty", "empty", "empty", "empty", "empty"]
    ],
    "lighting": [
      {"x": 2, "y": 2, "type": "fire"}
    ],
    "visual": {
      "energyColor": "#ff3300",
      "pipeColor": "#aa4400",
      "bgColor": "#2a1410",
      "flowSpeed": 4,
      "particles": [
        {"type": "embers", "count": 20, "color": "#ff6600", "speed": 2, "size": 3}
      ]
    }
  }
}
```

## If No Visual Settings Provided

If you don't include a `"visual"` object, the puzzle uses the default plugin parameters:
- Orange energy (#ff8800)
- Brown/copper pipes (#8B7355)
- Dark purple background (#1a1a2e)
- 30 ambient particles
- Gears and steam enabled

## Tips

1. **Color Harmony** - Keep colors in the same family for best results
2. **Contrast** - Make sure energy color contrasts with background
3. **Performance** - Keep total particle count under 150 for smooth performance
4. **Theme Consistency** - Match lighting effects to your visual theme
5. **Test** - Try different speeds to find what feels right for your puzzle

## Future Enhancements

Coming soon to the HTML Designer Tool:
- Visual theme presets (one-click themes)
- Live preview of colors and particles
- Color picker for easy selection
- Particle effect preview
- Save/load theme presets
