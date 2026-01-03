//=============================================================================
// MFS_CircuitRouting.js
//=============================================================================

/*:
 * @plugindesc Mana circuit routing puzzle minigame with flow simulation
 * @author MikeFirestrike
 *
 * @param Puzzle Data File
 * @type text
 * @desc JSON file containing puzzle definitions (default: CircuitPuzzles)
 * @default CircuitPuzzles
 *
 * @param Cell Size
 * @type number
 * @desc Size of each cell in pixels (default: 80)
 * @default 80
 *
 * @param Energy Color
 * @type text
 * @desc Color for energy flow (default: #ff8800)
 * @default #ff8800
 *
 * @param Background Color
 * @type text
 * @desc Background color for the puzzle (default: #1a1a2e)
 * @default #1a1a2e
 *
 * @param Grid Line Color
 * @type text
 * @desc Color of grid lines (default: #8B7355)
 * @default #8B7355
 *
 * @param Flow Speed
 * @type number
 * @desc Speed of energy flow animation (default: 3)
 * @default 3
 *
 * @param Particle Count
 * @type number
 * @desc Number of particles per energy stream (default: 10)
 * @default 10
 *
 * @param Ambient Particles
 * @type number
 * @desc Number of ambient floating particles (default: 30)
 * @default 30
 *
 * @param Show Gears
 * @type boolean
 * @desc Show floating gear animations (default: true)
 * @default true
 *
 * @param Show Steam
 * @type boolean
 * @desc Show steam particle effects (default: true)
 * @default true
 *
 * @param Empty Tile Chance
 * @type number
 * @desc Percentage chance for non-path tiles to be empty (0-100, default: 20)
 * @default 20
 *
 * @param Success Switch
 * @type switch
 * @desc Switch to turn ON when puzzle is solved (default: 1)
 * @default 1
 *
 * @param Time Variable
 * @type variable
 * @desc Variable to store completion time in seconds (default: 1)
 * @default 1
 *
 * @param Moves Variable
 * @type variable
 * @desc Variable to store number of moves/rotations (default: 2)
 * @default 2
 *
 * @param Rotate SE
 * @type file
 * @dir audio/se
 * @desc Sound effect when rotating a pipe
 * @default Cursor1
 *
 * @param Solve SE
 * @type file
 * @dir audio/se
 * @desc Sound effect when puzzle is solved
 * @default Item3
 *
 * @param Show Instructions
 * @type boolean
 * @desc Show instructions screen before puzzle starts
 * @default true
 *
 * @param Instruction Timer
 * @type number
 * @desc Frames before auto-starting puzzle (60 = 1 second, default: 180)
 * @default 180
 *
 * @help
 * ============================================================================
 * MFS Circuit Routing Puzzle
 * ============================================================================
 * 
 * A mana circuit routing puzzle where players rotate conduits to connect
 * an energy source to its destination. Features magical steampunk aesthetic.
 * 
 * PLUGIN COMMANDS:
 * ----------------
 * CircuitPuzzle random gridSize timeLimit
 *   - Random puzzle with specified grid size and time limit
 *   - Example: CircuitPuzzle random 7 120
 * 
 * CircuitPuzzle load puzzleName
 *   - Load a predefined puzzle from CircuitPuzzles.json
 *   - Example: CircuitPuzzle load tutorial_1
 *   - Example: CircuitPuzzle load challenge_fire
 * 
 * CircuitPuzzle define name gridSize timeLimit sourceX sourceY destX destY
 *   - Define a custom puzzle at runtime
 *   - Example: CircuitPuzzle define tutorial 5 0 0 2 4 2
 * 
 * CircuitPuzzle light x y effectType
 *   - Add lighting effect to a cell (call before starting puzzle)
 *   - Example: CircuitPuzzle light 2 3 fire
 *   - Types: fire, ice, electric, poison, arcane
 * 
 * PUZZLE FILE FORMAT (data/CircuitPuzzles.json):
 * -----------------------------------------------
 * {
 *   "puzzle_id": {
 *     "name": "Display Name",
 *     "gridSize": 7,
 *     "timeLimit": 120,
 *     "source": {"x": 0, "y": 3},
 *     "destination": {"x": 6, "y": 3},
 *     "lighting": [
 *       {"x": 2, "y": 2, "type": "fire"},
 *       {"x": 4, "y": 4, "type": "ice"}
 *     ],
 *     "description": "Puzzle description for your reference"
 *   }
 * }
 * 
 * ============================================================================
 */

(function() {
    
    var parameters = PluginManager.parameters('MFS_CircuitRouting');
    var puzzleDataFile = String(parameters['Puzzle Data File'] || 'CircuitPuzzles');
    var cellSize = Number(parameters['Cell Size'] || 80);
    var energyColor = String(parameters['Energy Color'] || '#ff8800');
    var bgColor = String(parameters['Background Color'] || '#1a1a2e');
    var gridLineColor = String(parameters['Grid Line Color'] || '#8B7355');
    var flowSpeed = Number(parameters['Flow Speed'] || 3);
    var particleCount = Number(parameters['Particle Count'] || 10);
    var ambientParticleCount = Number(parameters['Ambient Particles'] || 30);
    var showGears = String(parameters['Show Gears'] || 'true') === 'true';
    var showSteam = String(parameters['Show Steam'] || 'true') === 'true';
    var emptyTileChance = Number(parameters['Empty Tile Chance'] || 20);
    var successSwitch = Number(parameters['Success Switch'] || 1);
    var timeVariable = Number(parameters['Time Variable'] || 1);
    var movesVariable = Number(parameters['Moves Variable'] || 2);
    var rotateSE = String(parameters['Rotate SE'] || 'Cursor1');
    var solveSE = String(parameters['Solve SE'] || 'Item3');
    var showInstructions = String(parameters['Show Instructions'] || 'true') === 'true';
    var instructionTimer = Number(parameters['Instruction Timer'] || 180);
    
    //=============================================================================
    // Data Manager - Load puzzle data
    //=============================================================================
    
    var _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        _DataManager_loadDatabase.call(this);
        this.loadCircuitPuzzles();
    };
    
    DataManager.loadCircuitPuzzles = function() {
        var xhr = new XMLHttpRequest();
        var url = 'data/' + puzzleDataFile + '.json';
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
            if (xhr.status < 400) {
                window.$circuitPuzzles = JSON.parse(xhr.responseText);
                console.log('Circuit puzzles loaded:', Object.keys(window.$circuitPuzzles).length, 'puzzles');
            }
        };
        xhr.onerror = function() {
            console.warn('CircuitPuzzles.json not found - using runtime definitions only');
            window.$circuitPuzzles = {};
        };
        xhr.send();
    };
    
    //=============================================================================
    // Plugin Commands
    //=============================================================================
    
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        if (command === 'CircuitPuzzle') {
            var action = args[0] ? args[0].toLowerCase() : '';
            
            if (action === 'random') {
                var gridSize = Number(args[1]) || 7;
                var timeLimit = Number(args[2]) || 0;
                var puzzle = MFS_CircuitPuzzle.generateRandomPuzzle(gridSize, timeLimit);
                puzzle.lightingEffects = MFS_CircuitPuzzle._tempLightingEffects || [];
                MFS_CircuitPuzzle._tempLightingEffects = [];
                
                if (showInstructions) {
                    SceneManager.push(Scene_CircuitInstructions);
                    SceneManager.prepareNextScene(puzzle);
                } else {
                    SceneManager.push(Scene_CircuitPuzzle);
                    SceneManager.prepareNextScene(puzzle);
                }
            } else if (action === 'load') {
                var puzzleName = args[1];
                var puzzle = MFS_CircuitPuzzle.loadFromFile(puzzleName);
                
                if (puzzle) {
                    // Add any runtime lighting effects
                    if (MFS_CircuitPuzzle._tempLightingEffects && MFS_CircuitPuzzle._tempLightingEffects.length > 0) {
                        puzzle.lightingEffects = puzzle.lightingEffects.concat(MFS_CircuitPuzzle._tempLightingEffects);
                    }
                    MFS_CircuitPuzzle._tempLightingEffects = [];
                    
                    if (showInstructions) {
                        SceneManager.push(Scene_CircuitInstructions);
                        SceneManager.prepareNextScene(puzzle);
                    } else {
                        SceneManager.push(Scene_CircuitPuzzle);
                        SceneManager.prepareNextScene(puzzle);
                    }
                } else {
                    console.error('Puzzle not found:', puzzleName);
                }
            } else if (action === 'define') {
                var name = args[1];
                var gridSize = Number(args[2]) || 5;
                var timeLimit = Number(args[3]) || 0;
                var sourceX = Number(args[4]) || 0;
                var sourceY = Number(args[5]) || Math.floor(gridSize / 2);
                var destX = Number(args[6]) || gridSize - 1;
                var destY = Number(args[7]) || Math.floor(gridSize / 2);
                
                MFS_CircuitPuzzle.definePreset(name, gridSize, timeLimit, sourceX, sourceY, destX, destY);
            } else if (action === 'light') {
                var x = Number(args[1]);
                var y = Number(args[2]);
                var effectType = args[3] || 'fire';
                
                if (!MFS_CircuitPuzzle._tempLightingEffects) {
                    MFS_CircuitPuzzle._tempLightingEffects = [];
                }
                MFS_CircuitPuzzle._tempLightingEffects.push({x: x, y: y, type: effectType});
            }
        }
    };
    
    //=============================================================================
    // MFS_CircuitPuzzle - Puzzle generation
    //=============================================================================
    
    window.MFS_CircuitPuzzle = {
        _presets: {},
        _tempLightingEffects: [],
        
        loadFromFile: function(puzzleName) {
            if (!window.$circuitPuzzles) {
                console.error('Circuit puzzles not loaded yet');
                return null;
            }
            
            var data = window.$circuitPuzzles[puzzleName];
            if (!data) {
                console.error('Puzzle "' + puzzleName + '" not found in CircuitPuzzles.json');
                return null;
            }
            
            console.log('Loading puzzle:', data.name || puzzleName);
            
            // Check if this is a manually-defined puzzle with a grid layout
            if (data.grid && Array.isArray(data.grid)) {
                return this.loadManualPuzzle(data);
            }
            
            // Otherwise generate puzzle from source/destination points
            var puzzle = this.generatePuzzleFromPoints(
                data.gridSize,
                data.timeLimit || 0,
                data.source.x,
                data.source.y,
                data.destination.x,
                data.destination.y,
                data.source.edge,
                data.destination.edge
            );
            
            // Add lighting effects from file
            puzzle.lightingEffects = data.lighting || [];
            puzzle.name = data.name || puzzleName;
            puzzle.description = data.description || '';
            
            return puzzle;
        },
        
        loadManualPuzzle: function(data) {
            var puzzle = {
                gridSize: data.gridSize,
                timeLimit: data.timeLimit || 0,
                sourceX: data.source.x,
                sourceY: data.source.y,
                destX: data.destination.x,
                destY: data.destination.y,
                obstacles: [],
                grid: [],
                lightingEffects: data.lighting || [],
                name: data.name || 'Manual Puzzle',
                description: data.description || ''
            };
            
            // Initialize grid
            for (var y = 0; y < data.gridSize; y++) {
                puzzle.grid[y] = [];
                for (var x = 0; x < data.gridSize; x++) {
                    puzzle.grid[y][x] = {
                        type: 'empty',
                        rotation: 0,
                        fixed: true
                    };
                }
            }
            
            // Load manual grid layout
            for (var y = 0; y < data.grid.length && y < data.gridSize; y++) {
                for (var x = 0; x < data.grid[y].length && x < data.gridSize; x++) {
                    var cellData = data.grid[y][x];
                    
                    if (typeof cellData === 'string') {
                        // Simple format: just cell type
                        puzzle.grid[y][x] = {
                            type: cellData,
                            rotation: 0,
                            fixed: cellData === 'empty' || cellData === 'obstacle'
                        };
                    } else if (typeof cellData === 'object' && cellData !== null) {
                        // Full format: {type, rotation, fixed}
                        puzzle.grid[y][x] = {
                            type: cellData.type || 'empty',
                            rotation: cellData.rotation || 0,
                            fixed: cellData.fixed !== undefined ? cellData.fixed : (cellData.type === 'empty' || cellData.type === 'obstacle')
                        };
                    }
                }
            }
            
            // Set source
            var sourceEdge = data.source.edge !== undefined ? data.source.edge : 0;
            puzzle.grid[data.source.y][data.source.x] = {
                type: 'source',
                rotation: 0,
                fixed: true,
                edge: sourceEdge
            };
            
            // Set destination
            var destEdge = data.destination.edge !== undefined ? data.destination.edge : 0;
            puzzle.grid[data.destination.y][data.destination.x] = {
                type: 'destination',
                rotation: 0,
                fixed: true,
                edge: destEdge
            };
            // Load visual settings from JSON (override defaults)
            if (data.visual) {
                puzzle.visual = {
                    energyColor: data.visual.energyColor || energyColor,
                    pipeColor: data.visual.pipeColor || '#8B7355',
                    bgColor: data.visual.bgColor || bgColor,
                    gridLineColor: data.visual.gridLineColor || gridLineColor,
                    flowSpeed: data.visual.flowSpeed !== undefined ? data.visual.flowSpeed : flowSpeed,
                    particleCount: data.visual.particleCount !== undefined ? data.visual.particleCount : particleCount,
                    ambientParticleCount: data.visual.ambientParticleCount !== undefined ? data.visual.ambientParticleCount : ambientParticleCount,
                    showGears: data.visual.showGears !== undefined ? data.visual.showGears : showGears,
                    showSteam: data.visual.showSteam !== undefined ? data.visual.showSteam : showSteam,
                    particles: data.visual.particles || []
                };
            } else {
                puzzle.visual = {
                    energyColor: energyColor,
                    pipeColor: '#8B7355',
                    bgColor: bgColor,
                    gridLineColor: gridLineColor,
                    flowSpeed: flowSpeed,
                    particleCount: particleCount,
                    ambientParticleCount: ambientParticleCount,
                    showGears: showGears,
                    showSteam: showSteam,
                    particles: []
                };
            }
            
            return puzzle;
            return puzzle;
        },
        definePreset: function(name, gridSize, timeLimit, sourceX, sourceY, destX, destY) {
            var puzzle = this.generatePuzzleFromPoints(gridSize, timeLimit, sourceX, sourceY, destX, destY);
            this._presets[name] = puzzle;
        },
        
        generateRandomPuzzle: function(gridSize, timeLimit) {
            var maxAttempts = 100;
            var puzzle = null;
            
            for (var attempt = 0; attempt < maxAttempts; attempt++) {
                var side1 = Math.floor(Math.random() * 4);
                var side2 = (side1 + 2) % 4;
                
                var pos1 = this.getPositionOnSide(gridSize, side1);
                var pos2 = this.getPositionOnSide(gridSize, side2);
                
                puzzle = this.generatePuzzleFromPoints(gridSize, timeLimit, pos1.x, pos1.y, pos2.x, pos2.y);
                
                if (this.isSolvable(puzzle) && !this.isSolved(puzzle)) {
                    return puzzle;
                }
            }
            
            return puzzle;
        },
        
        getPositionOnSide: function(gridSize, side) {
            var pos = Math.floor(Math.random() * gridSize);
            
            switch (side) {
                case 0: return {x: pos, y: 0};
                case 1: return {x: gridSize - 1, y: pos};
                case 2: return {x: pos, y: gridSize - 1};
                case 3: return {x: 0, y: pos};
            }
        },
        
        generatePuzzleFromPoints: function(gridSize, timeLimit, sourceX, sourceY, destX, destY, manualSourceEdge, manualDestEdge) {
            var puzzle = {
                gridSize: gridSize,
                timeLimit: timeLimit || 0,
                sourceX: sourceX,
                sourceY: sourceY,
                destX: destX,
                destY: destY,
                obstacles: [],
                grid: [],
                lightingEffects: []
            };
            
            for (var y = 0; y < gridSize; y++) {
                puzzle.grid[y] = [];
                for (var x = 0; x < gridSize; x++) {
                    puzzle.grid[y][x] = {
                        type: 'empty',
                        rotation: 0,
                        fixed: false
                    };
                }
            }
            
            // Use manual edge if provided, otherwise auto-detect
            var sourceEdge = (manualSourceEdge !== undefined && manualSourceEdge !== null) ? manualSourceEdge : this.getEdge(gridSize, sourceX, sourceY);
            var destEdge = (manualDestEdge !== undefined && manualDestEdge !== null) ? manualDestEdge : this.getEdge(gridSize, destX, destY);
            
            puzzle.grid[sourceY][sourceX] = {
                type: 'source',
                rotation: 0,
                fixed: true,
                edge: sourceEdge
            };
            
            puzzle.grid[destY][destX] = {
                type: 'destination',
                rotation: 0,
                fixed: true,
                edge: destEdge
            };
            
            var path = this.generatePath(gridSize, sourceX, sourceY, destX, destY);
            
            var pathMap = {};
            for (var i = 0; i < path.length; i++) {
                pathMap[path[i].x + '_' + path[i].y] = true;
            }
            
            for (var i = 1; i < path.length - 1; i++) {
                var curr = path[i];
                var prev = path[i - 1];
                var next = path[i + 1];
                
                var pipeInfo = this.getPipeForConnections(prev, curr, next);
                puzzle.grid[curr.y][curr.x] = {
                    type: pipeInfo.type,
                    rotation: pipeInfo.rotation,
                    fixed: false,
                    solutionRotation: pipeInfo.rotation,
                    onPath: true
                };
            }
            
            for (var y = 0; y < gridSize; y++) {
                for (var x = 0; x < gridSize; x++) {
                    var key = x + '_' + y;
                    
                    if (pathMap[key] || puzzle.grid[y][x].type === 'source' || 
                        puzzle.grid[y][x].type === 'destination') {
                        continue;
                    }
                    
                    if (Math.random() * 100 < emptyTileChance) {
                        puzzle.grid[y][x] = {
                            type: 'empty',
                            rotation: 0,
                            fixed: true
                        };
                    } else {
                        var pipeTypes = ['straight', 'corner'];
                        var type = pipeTypes[Math.floor(Math.random() * pipeTypes.length)];
                        
                        puzzle.grid[y][x] = {
                            type: type,
                            rotation: Math.floor(Math.random() * 4),
                            fixed: false
                        };
                    }
                }
            }
            
            for (var i = 1; i < path.length - 1; i++) {
                var curr = path[i];
                var cell = puzzle.grid[curr.y][curr.x];
                
                if (!cell.fixed && cell.solutionRotation !== undefined) {
                    var wrongRotations = [];
                    for (var r = 0; r < 4; r++) {
                        if (r !== cell.solutionRotation) {
                            wrongRotations.push(r);
                        }
                    }
                    cell.rotation = wrongRotations[Math.floor(Math.random() * wrongRotations.length)];
                }
            }
            
            return puzzle;
        },
        
        getEdge: function(gridSize, x, y) {
            if (y === 0) return 0;
            if (x === gridSize - 1) return 1;
            if (y === gridSize - 1) return 2;
            if (x === 0) return 3;
            return -1;
        },
        
        generatePath: function(gridSize, startX, startY, endX, endY) {
            var path = [{x: startX, y: startY}];
            var currentX = startX;
            var currentY = startY;
            var visited = {};
            visited[startX + '_' + startY] = true;
            
            var maxSteps = gridSize * gridSize * 2;
            var steps = 0;
            
            while ((currentX !== endX || currentY !== endY) && steps < maxSteps) {
                steps++;
                
                var possibleMoves = [];
                var dx = endX - currentX;
                var dy = endY - currentY;
                
                if (dx > 0 && currentX < gridSize - 1) {
                    var key = (currentX + 1) + '_' + currentY;
                    if (!visited[key]) possibleMoves.push({x: currentX + 1, y: currentY, priority: 3});
                }
                if (dx < 0 && currentX > 0) {
                    var key = (currentX - 1) + '_' + currentY;
                    if (!visited[key]) possibleMoves.push({x: currentX - 1, y: currentY, priority: 3});
                }
                if (dy > 0 && currentY < gridSize - 1) {
                    var key = currentX + '_' + (currentY + 1);
                    if (!visited[key]) possibleMoves.push({x: currentX, y: currentY + 1, priority: 3});
                }
                if (dy < 0 && currentY > 0) {
                    var key = currentX + '_' + (currentY - 1);
                    if (!visited[key]) possibleMoves.push({x: currentX, y: currentY - 1, priority: 3});
                }
                
                if (possibleMoves.length === 0) {
                    if (path.length > 1) {
                        path.pop();
                        var prev = path[path.length - 1];
                        currentX = prev.x;
                        currentY = prev.y;
                    } else {
                        break;
                    }
                    continue;
                }
                
                possibleMoves.sort(function(a, b) { return b.priority - a.priority; });
                var move = possibleMoves[Math.floor(Math.random() * Math.min(2, possibleMoves.length))];
                
                currentX = move.x;
                currentY = move.y;
                visited[currentX + '_' + currentY] = true;
                path.push({x: currentX, y: currentY});
            }
            
            if (currentX !== endX || currentY !== endY) {
                while (currentX !== endX) {
                    currentX += (endX > currentX) ? 1 : -1;
                    path.push({x: currentX, y: currentY});
                }
                while (currentY !== endY) {
                    currentY += (endY > currentY) ? 1 : -1;
                    path.push({x: currentX, y: currentY});
                }
            }
            
            return path;
        },
        
        getPipeForConnections: function(prev, curr, next) {
            var dx1 = curr.x - prev.x;
            var dy1 = curr.y - prev.y;
            var dx2 = next.x - curr.x;
            var dy2 = next.y - curr.y;
            
            if (dx1 !== 0 && dx2 !== 0 && dy1 === 0 && dy2 === 0) {
                return {type: 'straight', rotation: 0};
            }
            
            if (dy1 !== 0 && dy2 !== 0 && dx1 === 0 && dx2 === 0) {
                return {type: 'straight', rotation: 1};
            }
            
            if (dx1 > 0 && dy2 > 0) return {type: 'corner', rotation: 1};
            if (dx1 > 0 && dy2 < 0) return {type: 'corner', rotation: 0};
            if (dy1 > 0 && dx2 > 0) return {type: 'corner', rotation: 3};
            if (dy1 > 0 && dx2 < 0) return {type: 'corner', rotation: 2};
            if (dx1 < 0 && dy2 > 0) return {type: 'corner', rotation: 2};
            if (dx1 < 0 && dy2 < 0) return {type: 'corner', rotation: 3};
            if (dy1 < 0 && dx2 > 0) return {type: 'corner', rotation: 0};
            if (dy1 < 0 && dx2 < 0) return {type: 'corner', rotation: 1};
            
            return {type: 'straight', rotation: 0};
        },
        
        isSolvable: function(puzzle) {
            var testPuzzle = JSON.parse(JSON.stringify(puzzle));
            
            for (var y = 0; y < testPuzzle.gridSize; y++) {
                for (var x = 0; x < testPuzzle.gridSize; x++) {
                    var cell = testPuzzle.grid[y][x];
                    if (cell.solutionRotation !== undefined) {
                        cell.rotation = cell.solutionRotation;
                    }
                }
            }
            
            return this.isSolved(testPuzzle);
        },
        
        isSolved: function(puzzle) {
            var visited = {};
            var stack = [{x: puzzle.sourceX, y: puzzle.sourceY, from: null}];
            
            while (stack.length > 0) {
                var current = stack.pop();
                var key = current.x + '_' + current.y;
                
                if (visited[key]) continue;
                visited[key] = true;
                
                if (current.x === puzzle.destX && current.y === puzzle.destY) {
                    return true;
                }
                
                var cell = puzzle.grid[current.y][current.x];
                var connections = this.getConnections(cell);
                
                for (var i = 0; i < connections.length; i++) {
                    var dir = connections[i];
                    if (current.from !== null && dir === current.from) continue;
                    
                    var nx = current.x;
                    var ny = current.y;
                    
                    if (dir === 0) ny--;
                    else if (dir === 1) nx++;
                    else if (dir === 2) ny++;
                    else if (dir === 3) nx--;
                    
                    if (nx >= 0 && nx < puzzle.gridSize && ny >= 0 && ny < puzzle.gridSize) {
                        var nextCell = puzzle.grid[ny][nx];
                        var nextConnections = this.getConnections(nextCell);
                        var oppositeDir = (dir + 2) % 4;
                        
                        if (nextConnections.indexOf(oppositeDir) !== -1) {
                            stack.push({x: nx, y: ny, from: oppositeDir});
                        }
                    }
                }
            }
            
            return false;
        },
        
        getConnections: function(cell) {
            var connections = [];
            
            switch (cell.type) {
                case 'source':
                    if (cell.edge === 0) connections = [2];
                    else if (cell.edge === 1) connections = [3];
                    else if (cell.edge === 2) connections = [0];
                    else if (cell.edge === 3) connections = [1];
                    break;
                case 'destination':
                    if (cell.edge === 0) connections = [2];
                    else if (cell.edge === 1) connections = [3];
                    else if (cell.edge === 2) connections = [0];
                    else if (cell.edge === 3) connections = [1];
                    break;
                case 'obstacle':
                case 'empty':
                    connections = [];
                    break;
                case 'straight':
                    if (cell.rotation % 2 === 0) {
                        connections = [1, 3];
                    } else {
                        connections = [0, 2];
                    }
                    break;
                case 'corner':
                    switch (cell.rotation) {
                        case 0: connections = [0, 1]; break;
                        case 1: connections = [1, 2]; break;
                        case 2: connections = [2, 3]; break;
                        case 3: connections = [3, 0]; break;
                    }
                    break;
            }
            
            return connections;
        }
    };
    
    //=============================================================================
    // Scene_CircuitInstructions
    //=============================================================================
    
    function Scene_CircuitInstructions() {
        this.initialize.apply(this, arguments);
    }
    
    Scene_CircuitInstructions.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_CircuitInstructions.prototype.constructor = Scene_CircuitInstructions;
    
    Scene_CircuitInstructions.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._puzzleData = null;
        this._timer = instructionTimer;
        this._countdownSprite = null;
    };
    
    Scene_CircuitInstructions.prototype.prepare = function(puzzleData) {
        this._puzzleData = puzzleData;
    };
    
    Scene_CircuitInstructions.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createBackground();
        this.createInstructionsText();
        this.createCountdown();
    };
    
    Scene_CircuitInstructions.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this._backgroundSprite.bitmap.fillRect(0, 0, Graphics.width, Graphics.height, '#1a1a2e');
        this.addChild(this._backgroundSprite);
    };
    
    Scene_CircuitInstructions.prototype.createInstructionsText = function() {
        var sprite = new Sprite();
        sprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
        
        var y = 80;
        
        // Show puzzle name if available
        if (this._puzzleData.name) {
            sprite.bitmap.fontSize = 28;
            sprite.bitmap.textColor = '#D4AF37';
            sprite.bitmap.drawText(this._puzzleData.name, 0, y, Graphics.width, 40, 'center');
            y += 60;
        } else {
            y += 20;
        }
        
        sprite.bitmap.fontSize = 32;
        sprite.bitmap.textColor = '#D4AF37';
        sprite.bitmap.drawText('CIRCUIT ROUTING', 0, y, Graphics.width, 40, 'center');
        
        y += 60;
        sprite.bitmap.fontSize = 22;
        sprite.bitmap.textColor = '#ffffff';
        sprite.bitmap.drawText('Connect source to destination by rotating pipes', 0, y, Graphics.width, 30, 'center');
        
        y += 50;
        sprite.bitmap.textColor = '#ffaa00';
        sprite.bitmap.drawText('CONTROLS:', 0, y, Graphics.width, 30, 'center');
        
        y += 35;
        sprite.bitmap.fontSize = 18;
        sprite.bitmap.textColor = '#cccccc';
        sprite.bitmap.drawText('Arrow Keys - Move cursor', 0, y, Graphics.width, 30, 'center');
        
        y += 28;
        sprite.bitmap.drawText('Z / Enter - Rotate pipe clockwise', 0, y, Graphics.width, 30, 'center');
        
        y += 28;
        sprite.bitmap.drawText('Click/Tap - Select and rotate pipe', 0, y, Graphics.width, 30, 'center');
        
        y += 28;
        sprite.bitmap.drawText('X / Escape - Give up', 0, y, Graphics.width, 30, 'center');
        y += 50;
        if (this._puzzleData.timeLimit > 0) {
            sprite.bitmap.textColor = '#ff6666';
            sprite.bitmap.fontSize = 20;
            sprite.bitmap.drawText('Time Limit: ' + this._puzzleData.timeLimit + ' seconds', 0, y, Graphics.width, 30, 'center');
        }
        
        this.addChild(sprite);
    };
    
    Scene_CircuitInstructions.prototype.createCountdown = function() {
        this._countdownSprite = new Sprite();
        this._countdownSprite.bitmap = new Bitmap(Graphics.width, 100);
        this._countdownSprite.y = Graphics.height - 120;
        this.addChild(this._countdownSprite);
    };
    
    Scene_CircuitInstructions.prototype.updateCountdown = function() {
        this._countdownSprite.bitmap.clear();
        
        var secondsLeft = Math.ceil(this._timer / 60);
        
        this._countdownSprite.bitmap.fontSize = 18;
        this._countdownSprite.bitmap.textColor = '#88ff88';
        this._countdownSprite.bitmap.drawText('Starting in ' + secondsLeft + '...', 0, 0, Graphics.width, 30, 'center');
        
        this._countdownSprite.bitmap.fontSize = 14;
        this._countdownSprite.bitmap.textColor = '#aaaaaa';
        this._countdownSprite.bitmap.drawText('(Press Z or Enter to skip)', 0, 35, Graphics.width, 30, 'center');
    };
    
    Scene_CircuitInstructions.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        
        this._timer--;
        this.updateCountdown();
        
        if (this._timer <= 0) {
            this.startPuzzle();
        }
        
        if (Input.isTriggered('ok') || Input.isTriggered('cancel')) {
            SoundManager.playOk();
            this.startPuzzle();
        }
    };
    
    Scene_CircuitInstructions.prototype.startPuzzle = function() {
        SceneManager.goto(Scene_CircuitPuzzle);
        SceneManager.prepareNextScene(this._puzzleData);
    };
    
    //=============================================================================
    // Scene_CircuitPuzzle
    //=============================================================================
    
    function Scene_CircuitPuzzle() {
        this.initialize.apply(this, arguments);
    }
    
    Scene_CircuitPuzzle.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_CircuitPuzzle.prototype.constructor = Scene_CircuitPuzzle;
    
    Scene_CircuitPuzzle.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._puzzleData = null;
        this._cursorX = 0;
        this._cursorY = 0;
        this._startTime = Date.now();
        this._flowParticles = [];
        this._ambientParticles = [];
        this._gears = [];
        this._steamParticles = [];
        this._lightingEffects = [];
        this._solved = false;
        this._moveCount = 0;
        this._timeRemaining = 0;
        this._pulseTimer = 0;
        this._flowSEPlaying = false;
    };
    
    Scene_CircuitPuzzle.prototype.prepare = function(puzzleData) {
        this._puzzleData = puzzleData;
        
        // Store visual settings or use defaults
        this._visual = puzzleData.visual || {
            energyColor: energyColor,
            pipeColor: '#8B7355',
            bgColor: bgColor,
            gridLineColor: gridLineColor,
            flowSpeed: flowSpeed,
            particleCount: particleCount,
            ambientParticleCount: ambientParticleCount,
            showGears: showGears,
            showSteam: showSteam
        };

        this._cursorX = Math.floor(puzzleData.gridSize / 2);
        this._cursorY = Math.floor(puzzleData.gridSize / 2);
        this._timeRemaining = puzzleData.timeLimit;
    };
    
    Scene_CircuitPuzzle.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createBackground();
        this.createAmbientEffects();
        this.createGrid();
        this.createLightingEffects();
        this.createFlowLayer();
        this.createCursor();
        this.createStatsWindow();
    };
    
    Scene_CircuitPuzzle.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
        
        var context = this._backgroundSprite.bitmap._context;
        var gradient = context.createRadialGradient(
            Graphics.width / 2, Graphics.height / 2, 0,
            Graphics.width / 2, Graphics.height / 2, Graphics.height / 2
        );
        gradient.addColorStop(0, '#2a1a3a');
        gradient.addColorStop(1, this._visual.bgColor);
        context.fillStyle = gradient;
        context.fillRect(0, 0, Graphics.width, Graphics.height);
        this._backgroundSprite.bitmap._setDirty();
        
        this.addChild(this._backgroundSprite);
    };
    
    Scene_CircuitPuzzle.prototype.createAmbientEffects = function() {
        this._effectsContainer = new Sprite();
        this.addChild(this._effectsContainer);
        
        for (var i = 0; i < this._visual.ambientParticleCount; i++) {
            this._ambientParticles.push({
                x: Math.random() * Graphics.width,
                y: Math.random() * Graphics.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: this._visual.energyColor,
                alpha: Math.random() * 0.5 + 0.3,
                pulse: Math.random() * Math.PI * 2
            });
        }
        
        if (this._visual.showGears) {
            for (var i = 0; i < 5; i++) {
                this._gears.push({
                    x: Math.random() * Graphics.width,
                    y: Math.random() * Graphics.height,
                    size: Math.random() * 30 + 20,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.02,
                    alpha: 0.1 + Math.random() * 0.1,
                    teeth: 8 + Math.floor(Math.random() * 4)
                });
            }
        }
        
        if (this._visual.showSteam) {
            for (var i = 0; i < 15; i++) {
                this._steamParticles.push({
                    x: Math.random() * Graphics.width,
                    y: Graphics.height + Math.random() * 50,
                    vy: -(Math.random() * 1 + 0.5),
                    size: Math.random() * 20 + 10,
                    alpha: 0,
                    maxAlpha: Math.random() * 0.2 + 0.1,
                    life: 0
                });
            }
        }
        
        this._ambientLayer = new Sprite();
        this._ambientLayer.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this._effectsContainer.addChild(this._ambientLayer);
    };
    
    Scene_CircuitPuzzle.prototype.createLightingEffects = function() {
        if (!this._puzzleData.lightingEffects) return;
        
        this._puzzleData.lightingEffects.forEach(function(effect) {
            var sprite = this.createLightingEffect(effect.type);
            sprite.x = this._offsetX + effect.x * cellSize + cellSize / 2;
            sprite.y = this._offsetY + effect.y * cellSize + cellSize / 2;
            this._effectsContainer.addChild(sprite);
            this._lightingEffects.push(sprite);
        }.bind(this));
    };
    
    Scene_CircuitPuzzle.prototype.createLightingEffect = function(type) {
        var sprite = new Sprite();
        sprite.bitmap = new Bitmap(cellSize, cellSize);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.effectType = type;
        sprite.effectTimer = 0;
        sprite.particles = [];
        
        return sprite;
    };
    
    Scene_CircuitPuzzle.prototype.updateLightingEffect = function(sprite) {
        sprite.effectTimer += 0.05;
        sprite.bitmap.clear();
        
        var cx = cellSize / 2;
        var cy = cellSize / 2;
        
        switch (sprite.effectType) {
            case 'fire':
                var intensity = 0.5 + Math.sin(sprite.effectTimer * 3) * 0.3;
                sprite.bitmap.drawCircle(cx, cy, 30, 'rgba(255, 100, 0, ' + (intensity * 0.4) + ')');
                sprite.bitmap.drawCircle(cx, cy, 20, 'rgba(255, 150, 0, ' + (intensity * 0.6) + ')');
                break;
            case 'ice':
                var pulse = Math.abs(Math.sin(sprite.effectTimer));
                sprite.bitmap.drawCircle(cx, cy, 25, 'rgba(100, 200, 255, ' + (pulse * 0.3) + ')');
                sprite.bitmap.drawCircle(cx, cy, 15, 'rgba(150, 220, 255, ' + (pulse * 0.5) + ')');
                break;
            case 'electric':
                if (Math.random() < 0.1) {
                    sprite.bitmap.drawCircle(cx, cy, 30, 'rgba(200, 200, 255, 0.5)');
                }
                sprite.bitmap.drawCircle(cx, cy, 20, 'rgba(150, 150, 255, 0.3)');
                break;
            case 'poison':
                var sway = Math.sin(sprite.effectTimer * 2) * 5;
                sprite.bitmap.drawCircle(cx + sway, cy, 25, 'rgba(100, 255, 100, 0.3)');
                break;
            case 'arcane':
                var rotate = sprite.effectTimer;
                for (var i = 0; i < 6; i++) {
                    var angle = rotate + (i * Math.PI * 2 / 6);
                    var rx = cx + Math.cos(angle) * 15;
                    var ry = cy + Math.sin(angle) * 15;
                    sprite.bitmap.drawCircle(rx, ry, 5, 'rgba(200, 100, 255, 0.4)');
                }
                break;
        }
    };
    
    Scene_CircuitPuzzle.prototype.createGrid = function() {
        var gridSize = this._puzzleData.gridSize;
        var totalSize = gridSize * cellSize;
        var offsetX = (Graphics.width - totalSize) / 2;
        var offsetY = (Graphics.height - totalSize) / 2 + 40;
        
        this._gridSprite = new Sprite();
        this._gridSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this._gridSprite.x = 0;
        this._gridSprite.y = 0;
        
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        
        this.drawGridLines();
        this.drawCells();
        
        this.addChild(this._gridSprite);
    };
    
    Scene_CircuitPuzzle.prototype.drawGridLines = function() {
        var bitmap = this._gridSprite.bitmap;
        var gridSize = this._puzzleData.gridSize;
        
        for (var i = 0; i <= gridSize; i++) {
            var pos = i * cellSize;
            bitmap.fillRect(this._offsetX + pos, this._offsetY, 2, gridSize * cellSize, this._visual.gridLineColor);
            bitmap.fillRect(this._offsetX, this._offsetY + pos, gridSize * cellSize, 2, this._visual.gridLineColor);
            bitmap.fillRect(this._offsetX + pos - 1, this._offsetY, 4, gridSize * cellSize, 'rgba(139, 115, 85, 0.3)');
            bitmap.fillRect(this._offsetX, this._offsetY + pos - 1, gridSize * cellSize, 4, 'rgba(139, 115, 85, 0.3)');
        }
    };
    
    Scene_CircuitPuzzle.prototype.drawCells = function() {
        var gridSize = this._puzzleData.gridSize;
        for (var y = 0; y < gridSize; y++) {
            for (var x = 0; x < gridSize; x++) {
                this.drawCell(x, y);
            }
        }
    };
    
    Scene_CircuitPuzzle.prototype.drawCell = function(x, y) {
        var cell = this._puzzleData.grid[y][x];
        var bitmap = this._gridSprite.bitmap;
        var px = this._offsetX + x * cellSize;
        var py = this._offsetY + y * cellSize;
        var centerX = px + cellSize / 2;
        var centerY = py + cellSize / 2;
        
        bitmap.clearRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
        
        var color = '#8B7355';
        
        switch (cell.type) {
            case 'source':
                this.drawSource(bitmap, centerX, centerY, cell.edge);
                break;
            case 'destination':
                this.drawDestination(bitmap, centerX, centerY, cell.edge);
                break;
            case 'obstacle':
                this.drawObstacle(bitmap, centerX, centerY);
                break;
            case 'straight':
                this.drawStraightPipe(bitmap, centerX, centerY, cell.rotation, this._visual.pipeColor);
                break;
            case 'corner':
                this.drawCornerPipe(bitmap, centerX, centerY, cell.rotation, this._visual.pipeColor);
                break;
            case 'empty':
                break;
        }
    };
    
    Scene_CircuitPuzzle.prototype.drawSource = function(bitmap, x, y, edge) {
        bitmap.drawCircle(x, y, 28, 'rgba(255, 200, 100, 0.3)');
        bitmap.drawCircle(x, y, 25, this._visual.energyColor);
        
        var points;
        switch (edge) {
            case 0:
                bitmap.fillRect(x - 4, y + 18, 8, 12, this._visual.energyColor);
                points = [[x, y + 30], [x - 7, y + 25], [x + 7, y + 25]];
                break;
            case 1:
                bitmap.fillRect(x - 30, y - 4, 12, 8, this._visual.energyColor);
                points = [[x - 30, y], [x - 25, y - 7], [x - 25, y + 7]];
                break;
            case 2:
                bitmap.fillRect(x - 4, y - 30, 8, 12, this._visual.energyColor);
                points = [[x, y - 30], [x - 7, y - 25], [x + 7, y - 25]];
                break;
            case 3:
                bitmap.fillRect(x + 18, y - 4, 12, 8, this._visual.energyColor);
                points = [[x + 30, y], [x + 25, y - 7], [x + 25, y + 7]];
                break;
        }
        
        bitmap.fillPolygon(points, this._visual.energyColor);
        bitmap.drawRunicCircle(x, y, 22, this._visual.energyColor);
    };
    
    Scene_CircuitPuzzle.prototype.drawDestination = function(bitmap, x, y, edge) {
        bitmap.drawCircle(x, y, 28, 'rgba(255, 200, 100, 0.3)');
        bitmap.drawCircle(x, y, 25, this._visual.energyColor);
        
        var points;
        switch (edge) {
            case 0:
                bitmap.fillRect(x - 4, y + 18, 8, 12, this._visual.energyColor);
                points = [[x, y + 30], [x - 7, y + 25], [x + 7, y + 25]];
                break;
            case 1:
                bitmap.fillRect(x - 30, y - 4, 12, 8, this._visual.energyColor);
                points = [[x - 30, y], [x - 25, y - 7], [x - 25, y + 7]];
                break;
            case 2:
                bitmap.fillRect(x - 4, y - 30, 8, 12, this._visual.energyColor);
                points = [[x, y - 30], [x - 7, y - 25], [x + 7, y - 25]];
                break;
            case 3:
                bitmap.fillRect(x + 18, y - 4, 12, 8, this._visual.energyColor);
                points = [[x + 30, y], [x + 25, y - 7], [x + 25, y + 7]];
                break;
        }
        
        bitmap.fillPolygon(points, this._visual.energyColor);
        bitmap.drawRunicCircle(x, y, 22, this._visual.energyColor);
    };
    
    Scene_CircuitPuzzle.prototype.drawObstacle = function(bitmap, x, y) {
        bitmap.drawGear(x, y, 30, 6, '#8B4513', 0.8);
    };
    
    Scene_CircuitPuzzle.prototype.drawStraightPipe = function(bitmap, x, y, rotation, color) {
        if (rotation % 2 === 0) {
            bitmap.fillRect(x - 35, y - 6, 70, 12, this._visual.pipeColor);
            bitmap.fillRect(x - 35, y - 6, 70, 2, 'rgba(205, 173, 127, 0.5)');
        } else {
            bitmap.fillRect(x - 6, y - 35, 12, 70, this._visual.pipeColor);
            bitmap.fillRect(x - 6, y - 35, 2, 70, 'rgba(205, 173, 127, 0.5)');
        }
    };
    
    Scene_CircuitPuzzle.prototype.drawCornerPipe = function(bitmap, x, y, rotation, color) {
        switch (rotation) {
            case 0:
                bitmap.fillRect(x - 6, y - 35, 12, 41, this._visual.pipeColor);
                bitmap.fillRect(x, y - 6, 35, 12, this._visual.pipeColor);
                break;
            case 1:
                bitmap.fillRect(x - 6, y, 12, 35, this._visual.pipeColor);
                bitmap.fillRect(x, y - 6, 35, 12, this._visual.pipeColor);
                break;
            case 2:
                bitmap.fillRect(x - 6, y, 12, 35, this._visual.pipeColor);
                bitmap.fillRect(x - 35, y - 6, 41, 12, this._visual.pipeColor);
                break;
            case 3:
                bitmap.fillRect(x - 6, y - 35, 12, 41, this._visual.pipeColor);
                bitmap.fillRect(x - 35, y - 6, 41, 12, this._visual.pipeColor);
                break;
        }
    };
    
    Scene_CircuitPuzzle.prototype.createFlowLayer = function() {
        this._flowContainer = new Sprite();
        this._flowContainer.x = this._offsetX;
        this._flowContainer.y = this._offsetY;
        this.addChild(this._flowContainer);
        
        this._flowLayer = new Sprite();
        this._flowLayer.bitmap = new Bitmap(
            this._puzzleData.gridSize * cellSize,
            this._puzzleData.gridSize * cellSize
        );
        this._flowContainer.addChild(this._flowLayer);
    };
    
    Scene_CircuitPuzzle.prototype.createCursor = function() {
        this._cursorSprite = new Sprite();
        this._cursorSprite.bitmap = new Bitmap(cellSize, cellSize);
        this._cursorSprite.bitmap.strokeRect(0, 0, cellSize, cellSize, '#D4AF37', 4);
        this.updateCursorPosition();
        this.addChild(this._cursorSprite);
    };
    
    Scene_CircuitPuzzle.prototype.updateCursorPosition = function() {
        this._cursorSprite.x = this._offsetX + this._cursorX * cellSize;
        this._cursorSprite.y = this._offsetY + this._cursorY * cellSize;
    };
    
    
    Scene_CircuitPuzzle.prototype.createStatsWindow = function() {
        this._statsSprite = new Sprite();
        this._statsSprite.bitmap = new Bitmap(Graphics.width, 40);
        this._statsSprite.y = 0;
        
        this.updateStatsDisplay();
        
        this.addChild(this._statsSprite);
    };
    
    Scene_CircuitPuzzle.prototype.updateStatsDisplay = function() {
        this._statsSprite.bitmap.clear();
        this._statsSprite.bitmap.fontSize = 18;
        this._statsSprite.bitmap.textColor = '#D4AF37';
        
        var statsText = "Moves: " + this._moveCount;
        
        if (this._puzzleData.timeLimit > 0) {
            var timeColor = this._timeRemaining <= 10 ? '#ff0000' : '#D4AF37';
            this._statsSprite.bitmap.textColor = '#D4AF37';
            this._statsSprite.bitmap.drawText(statsText, 20, 10, 200, 30, 'left');
            this._statsSprite.bitmap.fontSize = 14;
            this._statsSprite.bitmap.textColor = '#aaaaaa';
            this._statsSprite.bitmap.drawText("Esc: Quit", Graphics.width / 2 - 50, 10, 100, 30, 'center');
            this._statsSprite.bitmap.textColor = timeColor;
            this._statsSprite.bitmap.drawText("Time: " + this._timeRemaining + "s", Graphics.width - 220, 10, 200, 30, 'right');
        } else {
            var elapsed = Math.floor((Date.now() - this._startTime) / 1000);
            this._statsSprite.bitmap.drawText(statsText + " | Time: " + elapsed + "s", 0, 10, Graphics.width, 30, 'center');
            this._statsSprite.bitmap.fontSize = 14;
            this._statsSprite.bitmap.textColor = '#aaaaaa';
            this._statsSprite.bitmap.drawText("(Esc: Quit)", Graphics.width - 120, 10, 100, 30, 'right');
        }
    };
    
    Scene_CircuitPuzzle.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        
        this._pulseTimer += 0.05;
        this.updateAmbientEffects();
        this.updateLightingEffects();
        
        if (!this._solved) {
            this.updateTimer();
            this.updateInput();
            this.updateFlowSimulation();
            this.updateParticles();
            this.checkSolution();
            this.updateStatsDisplay();
        }
    };
    
    
    Scene_CircuitPuzzle.prototype.updateLightingEffects = function() {
        this._lightingEffects.forEach(function(sprite) {
            this.updateLightingEffect(sprite);
        }.bind(this));
    };
    
    Scene_CircuitPuzzle.prototype.updateAmbientEffects = function() {
        this._ambientLayer.bitmap.clear();
        
        this._ambientParticles.forEach(function(p) {
            p.x += p.vx;
            p.y += p.vy;
            p.pulse += 0.05;
            
            if (p.x < 0) p.x = Graphics.width;
            if (p.x > Graphics.width) p.x = 0;
            if (p.y < 0) p.y = Graphics.height;
            if (p.y > Graphics.height) p.y = 0;
            
            var alpha = p.alpha + Math.sin(p.pulse) * 0.2;
            this._ambientLayer.bitmap.drawGlowParticle(p.x, p.y, p.size, p.color, alpha);
        }.bind(this));
        
        if (this._visual.showGears) {
            this._gears.forEach(function(gear) {
                gear.rotation += gear.rotationSpeed;
                this._ambientLayer.bitmap.drawGear(gear.x, gear.y, gear.size, gear.teeth, '#8B7355', gear.alpha, gear.rotation);
            }.bind(this));
        }
        
        if (this._visual.showSteam) {
            this._steamParticles.forEach(function(steam) {
                steam.y += steam.vy;
                steam.life += 1;
                
                if (steam.life < 30) {
                    steam.alpha = (steam.life / 30) * steam.maxAlpha;
                } else if (steam.life > 120) {
                    steam.alpha = (1 - (steam.life - 120) / 60) * steam.maxAlpha;
                }
                
                if (steam.y < -50 || steam.life > 180) {
                    steam.y = Graphics.height + Math.random() * 50;
                    steam.x = Math.random() * Graphics.width;
                    steam.life = 0;
                    steam.alpha = 0;
                }
                
                this._ambientLayer.bitmap.drawSteam(steam.x, steam.y, steam.size, steam.alpha);
            }.bind(this));
        }
    };
    
    Scene_CircuitPuzzle.prototype.updateTimer = function() {
        if (this._puzzleData.timeLimit > 0) {
            var elapsed = Math.floor((Date.now() - this._startTime) / 1000);
            this._timeRemaining = Math.max(0, this._puzzleData.timeLimit - elapsed);
            
            if (this._timeRemaining === 0) {
                this.onTimeUp();
            }
        }
    };
    
    Scene_CircuitPuzzle.prototype.onTimeUp = function() {
        this._solved = true;
        var elapsed = Math.floor((Date.now() - this._startTime) / 1000);
        
        $gameSwitches.setValue(successSwitch, false);
        $gameVariables.setValue(timeVariable, elapsed);
        $gameVariables.setValue(movesVariable, this._moveCount);
        
        SoundManager.playBuzzer();
        SceneManager.pop();
    };
    
    Scene_CircuitPuzzle.prototype.updateInput = function() {
        // Handle mouse/touch input
        this.handleMouseTouch();
        
        // Keyboard cancel
        if (Input.isTriggered('cancel')) {
            var elapsed = Math.floor((Date.now() - this._startTime) / 1000);
            $gameSwitches.setValue(successSwitch, false);
            $gameVariables.setValue(timeVariable, elapsed);
            $gameVariables.setValue(movesVariable, this._moveCount);
            SoundManager.playCancel();
            SceneManager.pop();
        }
        
        // Keyboard movement
        if (Input.isRepeated('left')) {
            this._cursorX = Math.max(0, this._cursorX - 1);
            this.updateCursorPosition();
            SoundManager.playCursor();
        }
        if (Input.isRepeated('right')) {
            this._cursorX = Math.min(this._puzzleData.gridSize - 1, this._cursorX + 1);
            this.updateCursorPosition();
            SoundManager.playCursor();
        }
        if (Input.isRepeated('up')) {
            this._cursorY = Math.max(0, this._cursorY - 1);
            this.updateCursorPosition();
            SoundManager.playCursor();
        }
        if (Input.isRepeated('down')) {
            this._cursorY = Math.min(this._puzzleData.gridSize - 1, this._cursorY + 1);
            this.updateCursorPosition();
            SoundManager.playCursor();
        }
        
        // Keyboard rotation
        if (Input.isTriggered('ok')) {
            var cell = this._puzzleData.grid[this._cursorY][this._cursorX];
            if (!cell.fixed) {
                cell.rotation = (cell.rotation + 1) % 4;
                this._moveCount++;
                this.refreshGrid();
                AudioManager.playSe({name: rotateSE, volume: 90, pitch: 100, pan: 0});
            } else {
                SoundManager.playBuzzer();
            }
        }
    };
    
    Scene_CircuitPuzzle.prototype.handleMouseTouch = function() {
        if (TouchInput.isTriggered() || TouchInput.isPressed()) {
            var x = TouchInput.x;
            var y = TouchInput.y;
            
            // Convert screen coordinates to grid coordinates
            var gridX = Math.floor((x - this._offsetX) / cellSize);
            var gridY = Math.floor((y - this._offsetY) / cellSize);
            
            // Check if click is within grid bounds
            if (gridX >= 0 && gridX < this._puzzleData.gridSize && 
                gridY >= 0 && gridY < this._puzzleData.gridSize) {
                
                if (TouchInput.isTriggered()) {
                    // First click - move cursor to cell
                    if (this._cursorX !== gridX || this._cursorY !== gridY) {
                        this._cursorX = gridX;
                        this._cursorY = gridY;
                        this.updateCursorPosition();
                        SoundManager.playCursor();
                    } else {
                        // Clicked same cell - rotate it
                        var cell = this._puzzleData.grid[gridY][gridX];
                        if (!cell.fixed) {
                            cell.rotation = (cell.rotation + 1) % 4;
                            this._moveCount++;
                            this.refreshGrid();
                            AudioManager.playSe({name: rotateSE, volume: 90, pitch: 100, pan: 0});
                        } else {
                            SoundManager.playBuzzer();
                        }
                    }
                }
            }
        }
    };
    Scene_CircuitPuzzle.prototype.refreshGrid = function() {
        this._gridSprite.bitmap.clear();
        this.drawGridLines();
        this.drawCells();
    };
    
    Scene_CircuitPuzzle.prototype.updateFlowSimulation = function() {
        if (Graphics.frameCount % 60 === 0 && this._flowParticles.length > 200) {
            this._flowParticles = [];
        }
        
        var visited = {};
        var stack = [{x: this._puzzleData.sourceX, y: this._puzzleData.sourceY, from: null}];
        
        while (stack.length > 0) {
            var current = stack.pop();
            var key = current.x + '_' + current.y;
            
            if (visited[key]) continue;
            visited[key] = true;
            
            var cell = this._puzzleData.grid[current.y][current.x];
            var connections = MFS_CircuitPuzzle.getConnections(cell);
            
            for (var i = 0; i < connections.length; i++) {
                var dir = connections[i];
                if (current.from !== null && dir === current.from) continue;
                
                var nx = current.x;
                var ny = current.y;
                
                if (dir === 0) ny--;
                else if (dir === 1) nx++;
                else if (dir === 2) ny++;
                else if (dir === 3) nx--;
                
                if (nx >= 0 && nx < this._puzzleData.gridSize && 
                    ny >= 0 && ny < this._puzzleData.gridSize) {
                    
                    var nextCell = this._puzzleData.grid[ny][nx];
                    var nextConnections = MFS_CircuitPuzzle.getConnections(nextCell);
                    var oppositeDir = (dir + 2) % 4;
                    
                    if (nextConnections.indexOf(oppositeDir) !== -1) {
                        this.spawnFlowParticles(current.x, current.y, nx, ny);
                        stack.push({x: nx, y: ny, from: oppositeDir});
                    }
                }
            }
        }
    };
    
    Scene_CircuitPuzzle.prototype.spawnFlowParticles = function(x1, y1, x2, y2) {
        if (Math.random() > 0.3) return;
        
        var startX = x1 * cellSize + cellSize / 2;
        var startY = y1 * cellSize + cellSize / 2;
        var endX = x2 * cellSize + cellSize / 2;
        var endY = y2 * cellSize + cellSize / 2;
        
        for (var i = 0; i < this._visual.particleCount; i++) {
            var progress = i / particleCount;
            var particle = {
                x: startX + (endX - startX) * progress,
                y: startY + (endY - startY) * progress,
                targetX: endX,
                targetY: endY,
                startX: startX,
                startY: startY,
                age: 0,
                maxAge: 60,
                size: 6
            };
            this._flowParticles.push(particle);
        }
    };
    
    Scene_CircuitPuzzle.prototype.updateParticles = function() {
        this._flowLayer.bitmap.clear();
        
        for (var i = this._flowParticles.length - 1; i >= 0; i--) {
            var p = this._flowParticles[i];
            
            var dx = p.targetX - p.x;
            var dy = p.targetY - p.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < flowSpeed) {
                p.x = p.startX;
                p.y = p.startY;
            } else {
                p.x += (dx / dist) * this._visual.flowSpeed;
                p.y += (dy / dist) * this._visual.flowSpeed;
            }
            
            this._flowLayer.bitmap.drawGlowParticle(p.x, p.y, p.size, energyColor, 0.8);
            
            p.age++;
            if (p.age > p.maxAge) {
                this._flowParticles.splice(i, 1);
            }
        }
    };
    
    Scene_CircuitPuzzle.prototype.checkSolution = function() {
        if (MFS_CircuitPuzzle.isSolved(this._puzzleData) && !this._solved) {
            this._solved = true;
            this.onPuzzleSolved();
        }
    };
    
    Scene_CircuitPuzzle.prototype.onPuzzleSolved = function() {
        var completionTime = Math.floor((Date.now() - this._startTime) / 1000);
        
        $gameSwitches.setValue(successSwitch, true);
        $gameVariables.setValue(timeVariable, completionTime);
        $gameVariables.setValue(movesVariable, this._moveCount);
        
        AudioManager.playSe({name: solveSE, volume: 90, pitch: 100, pan: 0});
        
        SceneManager.pop();
    };
    
    //=============================================================================
    // Helper bitmap functions
    //=============================================================================
    
    Bitmap.prototype.drawCircle = function(x, y, radius, color) {
        var context = this._context;
        context.save();
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
        this._setDirty();
    };
    
    Bitmap.prototype.strokeRect = function(x, y, width, height, color, lineWidth) {
        var context = this._context;
        context.save();
        context.strokeStyle = color;
        context.lineWidth = lineWidth || 1;
        context.strokeRect(x, y, width, height);
        context.restore();
        this._setDirty();
    };
    
    Bitmap.prototype.fillPolygon = function(points, color) {
        var context = this._context;
        context.save();
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) {
            context.lineTo(points[i][0], points[i][1]);
        }
        context.closePath();
        context.fill();
        context.restore();
        this._setDirty();
    };
    
    Bitmap.prototype.drawGlowParticle = function(x, y, size, color, alpha) {
        var context = this._context;
        context.save();
        
        var gradient = context.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, color.replace(')', ', ' + alpha + ')').replace('rgb', 'rgba'));
        gradient.addColorStop(0.5, color.replace(')', ', ' + (alpha * 0.5) + ')').replace('rgb', 'rgba'));
        gradient.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));
        
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, size * 2, 0, Math.PI * 2);
        context.fill();
        
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
        
        context.restore();
        this._setDirty();
    };
    
    Bitmap.prototype.drawGear = function(x, y, radius, teeth, color, alpha, rotation) {
        var context = this._context;
        context.save();
        context.globalAlpha = alpha || 1;
        context.fillStyle = color;
        context.translate(x, y);
        context.rotate(rotation || 0);
        
        context.beginPath();
        for (var i = 0; i < teeth * 2; i++) {
            var angle = (i * Math.PI) / teeth;
            var r = i % 2 === 0 ? radius : radius * 0.7;
            var px = Math.cos(angle) * r;
            var py = Math.sin(angle) * r;
            if (i === 0) {
                context.moveTo(px, py);
            } else {
                context.lineTo(px, py);
            }
        }
        context.closePath();
        context.fill();
        
        context.fillStyle = '#1a1a2e';
        context.beginPath();
        context.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
        context.fill();
        
        context.restore();
        this._setDirty();
    };
    
    Bitmap.prototype.drawRunicCircle = function(x, y, radius, color) {
        var context = this._context;
        context.save();
        context.strokeStyle = color;
        context.lineWidth = 1;
        context.globalAlpha = 0.5;
        
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.stroke();
        
        for (var i = 0; i < 6; i++) {
            var angle = (i * Math.PI * 2) / 6;
            var x1 = x + Math.cos(angle) * (radius - 3);
            var y1 = y + Math.sin(angle) * (radius - 3);
            var x2 = x + Math.cos(angle) * (radius + 3);
            var y2 = y + Math.sin(angle) * (radius + 3);
            
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
        }
        
        context.restore();
        this._setDirty();
    };
    
    Bitmap.prototype.drawSteam = function(x, y, size, alpha) {
        var context = this._context;
        context.save();
        context.globalAlpha = alpha;
        
        var gradient = context.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, 'rgba(200, 200, 220, 0.3)');
        gradient.addColorStop(1, 'rgba(200, 200, 220, 0)');
        
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
        
        context.restore();
        this._setDirty();
    };
    
})();