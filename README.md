# Circuit Puzzle Complete Package - Visual Customization Edition
AI was used to code this plugin.
## 📦 What's Included

This package contains everything you need for the complete Circuit Puzzle system with full visual customization:

### Files:
1. **MFS_CircuitRouting.js** - Updated plugin with visual customization support
2. **CircuitPuzzleDesigner.html** - Complete puzzle designer tool with visual theme editor
3. **ExamplePuzzles.json** - 5 themed example puzzles (Fire, Ice, Nature, Electric, Arcane)
4. **README.md** - This file
5. **VISUAL_GUIDE.md** - Complete visual customization reference

## 🚀 Installation

### Step 1: Install the Plugin

1. Copy `MFS_CircuitRouting.js` to your RPG Maker MV project:
   ```
   YourProject/js/plugins/MFS_CircuitRouting.js
   ```

2. Open RPG Maker MV and go to **Plugin Manager**

3. Add **MFS_CircuitRouting** to your plugin list

4. Configure plugin parameters (or leave as defaults)

### Step 2: Add Puzzle Data

1. Copy `ExamplePuzzles.json` to your project's data folder:
   ```
   YourProject/data/CircuitPuzzles.json
   ```
   
2. OR rename it to match your plugin parameter "Puzzle Data File" setting

### Step 3: Use the Designer Tool

1. Open `CircuitPuzzleDesigner.html` in any web browser (Chrome, Firefox, Edge, etc.)

2. Design your puzzles visually

3. Copy the generated JSON

4. Paste into your `CircuitPuzzles.json` file

## 🎮 How to Use in Your Game

### Plugin Command Format:

```
CircuitPuzzle load puzzle_name
```

### Example Event:

```
◆Plugin Command: CircuitPuzzle load fire_theme_puzzle
◆Wait: 1 frame
◆Conditional Branch: Switch [0001: Puzzle Success] == ON
  ◆Text: You solved it in \V[1] seconds with \V[2] moves!
  ◆Gold: +100
◆Else
  ◆Text: Better luck next time!
◆Branch End
```

### Variables Set by Plugin:

- **Switch 1** (default): Puzzle Success (ON = solved, OFF = gave up/timeout)
- **Variable 1** (default): Completion Time (in seconds)
- **Variable 2** (default): Move Count (number of rotations)

You can change these in Plugin Parameters.

## 🎨 Visual Customization Features

### Every puzzle can have:

✅ **Custom Colors**
- Energy/flow color
- Pipe color
- Background color  
- Grid line color

✅ **Animation Settings**
- Flow speed (1-10)
- Particle count (1-50)
- Ambient particle count (0-100)
- Show/hide gears
- Show/hide steam

✅ **Theme Presets**
- 🔥 Fire Theme
- ❄️ Ice Theme
- 🌿 Nature Theme
- ⚡ Electric Theme
- 🔮 Arcane Theme

### JSON Format:

```json
{
  "my_puzzle": {
    "name": "My Themed Puzzle",
    "gridSize": 7,
    "timeLimit": 120,
    "source": {"x": 0, "y": 3, "edge": 3},
    "destination": {"x": 6, "y": 3, "edge": 1},
    "lighting": [
      {"x": 2, "y": 2, "type": "fire"}
    ],
    "grid": [
      // Manual layout or omit for auto-generation
    ],
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
    },
    "description": "Optional description"
  }
}
```

## 🛠️ Using the Designer Tool

### Basic Workflow:

1. **Set Puzzle Info**
   - Puzzle ID (unique name)
   - Display name
   - Grid size (5x5, 7x7, 9x9)
   - Time limit

2. **Design Grid**
   - Click cells to select
   - Use tools to place pipes
   - Right-click to rotate
   - Toggle lock to prevent rotation

3. **Set Source & Destination**
   - Click a cell
   - Click "Set Source" or "Set Destination"
   - Set edge direction (0-3)

4. **Add Lighting** (optional)
   - Select cell
   - Choose effect type
   - Click "Add Lighting"

5. **Customize Visuals**
   - Choose theme preset OR
   - Customize individual colors/settings
   - Use color pickers
   - Adjust sliders

6. **Generate & Copy**
   - Click "Generate JSON"
   - Click "Copy" button
   - Paste into CircuitPuzzles.json

### Theme Presets:

Click any theme button to instantly apply colors and settings:
- **Fire** - Red/orange with high speed
- **Ice** - Blue/cyan with slow, smooth flow
- **Nature** - Green with organic feel
- **Electric** - Cyan/yellow with fast, chaotic energy
- **Arcane** - Purple/pink with mystical ambiance

## 📖 Edge Values Reference

Source and destination "edge" controls which direction they face:

- **0** = Top edge → Points DOWN ↓
- **1** = Right edge → Points LEFT ←
- **2** = Bottom edge → Points UP ↑
- **3** = Left edge → Points RIGHT →

## 🎯 Pipe Rotations

### Straight Pipe:
- **0 or 2** = Horizontal `━━━`
- **1 or 3** = Vertical `┃`

### Corner Pipe:
- **0** = `┗` (up + right)
- **1** = `┏` (down + right)
- **2** = `┓` (down + left)
- **3** = `┛` (up + left)

## 💡 Tips & Best Practices

### Performance:
- Keep total ambient particles under 100
- Use 1-3 lighting effects per puzzle
- Test on target devices

### Design:
- Use theme presets as starting points
- Match lighting type to visual theme
- Ensure good contrast between energy and background
- Test puzzle solvability before publishing

### Organization:
- Use descriptive puzzle IDs (`fire_temple_1`, not `puzzle1`)
- Add descriptions for your reference
- Group related puzzles in JSON

## 🐛 Troubleshooting

### Puzzle won't load:
- Check puzzle ID spelling in plugin command
- Verify JSON syntax (use JSONLint.com)
- Check CircuitPuzzles.json is in data/ folder
- Check file name matches plugin parameter

### Visual settings not showing:
- Ensure "visual" object is in your puzzle JSON
- Check color format is `"#rrggbb"`
- Verify numbers are not in quotes

### Puzzle unsolvable:
- Check source/destination edges match first/last pipe
- Verify path exists from source to destination
- Test in designer before exporting

### Designer not working:
- Use modern browser (Chrome, Firefox, Edge)
- Check JavaScript console for errors
- Try different browser if issues persist

## 📝 Example Puzzles Included

The ExamplePuzzles.json file contains:

1. **fire_theme_puzzle** - Fire Temple Challenge (7x7, 120s)
2. **ice_theme_puzzle** - Frozen Conduits (7x7, 150s)
3. **nature_theme_puzzle** - Living Vines (7x7, 120s)
4. **electric_theme_puzzle** - Power Grid (7x7, 90s)
5. **arcane_theme_puzzle** - Mystical Circuit (9x9, 180s)

Each demonstrates different visual theming and difficulty levels.

## 🔄 Updates & Changes from Previous Version

### New Features:
✅ Full visual customization per-puzzle
✅ Theme preset system
✅ Color pickers in designer
✅ Visual settings in JSON
✅ Removed random generation (manual only)
✅ Cleaner UI with better organization

### Breaking Changes:
⚠️ Random puzzle generation removed
⚠️ Plugin commands changed (only "load" supported)

### Migration from Old Version:
If you have old puzzles, wrap them in the new format and optionally add visual settings.

## 📚 Additional Documentation

See **VISUAL_GUIDE.md** for:
- Complete visual property reference
- Advanced customization techniques
- Theme creation guide
- Particle system details

## 🆘 Support

For issues or questions:
1. Check this README
2. Review VISUAL_GUIDE.md
3. Examine example puzzles
4. Test with included examples first

## 📜 License

Free to use in commercial and non-commercial projects.
Credit appreciated but not required.

## 🎉 Credits

Created by Mike Firestrike with AI assitance

---

**Enjoy creating beautiful, themed circuit puzzles!** 🔥❄️🌿⚡🔮
