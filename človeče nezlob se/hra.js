        const PLAYER_COLORS = ['green', 'blue', 'yellow', 'red'];
        const PLAYER_NAMES = ['Zelený', 'Modrý', 'Žlutý', 'Červený'];
        
        const START_POSITIONS = [0, 10, 20, 30]; 
        const ENTRY_POSITIONS = [1, 11, 21, 31]; 
        
        let positionMap = {}; 
        let cellMap = {}; 
        
        let currentPlayer = 0;
        let diceValue = 0;
        let diceRolled = false;
        let extraTurn = false;
        let gameActive = true;
        let selectablePieces = [];
        

        let pieces = [
            [-1, -1, -1, -1], // Zelený
            [-1, -1, -1, -1], // Modrý
            [-1, -1, -1, -1], // Žlutý
            [-1, -1, -1, -1]  // Červený
        ];
        
        const gameBoard = document.getElementById('gameBoard');
        const diceElement = document.getElementById('dice');
        const rollBtn = document.getElementById('rollBtn');
        const gameStatus = document.getElementById('gameStatus');
        const logMessages = document.getElementById('logMessages');
        const playerElements = [
            document.getElementById('player1'),
            document.getElementById('player2'),
            document.getElementById('player3'),
            document.getElementById('player4')
        ];
        
        function initGame() {
            createBoard();
            updateGameStatus();
            rollBtn.addEventListener('click', rollDice);
            
            document.querySelectorAll('.piece').forEach(piece => {
                piece.addEventListener('click', handlePieceClick);
            });
            
            addLogMessage("Hra začíná! Začíná Zelený hráč.");
        }
        
        function createBoard() {
            gameBoard.innerHTML = '';
            
            for (let row = 0; row < 15; row++) {
                for (let col = 0; col < 15; col++) {
                    const cell = document.createElement('div');
                    const cellId = `${row}_${col}`;
                    cell.className = 'cell';
                    cellMap[cellId] = cell;
                    gameBoard.appendChild(cell);
                }
            }
            
            createHomeZones();
            
            createFinishZones();

            createGamePath();
            
            updatePiecesDisplay();
        }
        
        function createHomeZones() {
            // Zelený domeček (levý horní roh)
            const homeGreen = document.createElement('div');
            homeGreen.className = 'home-green';
            homeGreen.style.gridColumn = '1 / 5';
            homeGreen.style.gridRow = '1 / 5';
            
            for (let i = 0; i < 16; i++) {
                const homeCell = document.createElement('div');
                homeCell.className = 'home-cell';
                homeCell.dataset.homeFor = '0';
                homeGreen.appendChild(homeCell);
            }
            
            gameBoard.appendChild(homeGreen);
            
            // Modrý domeček (pravý horní roh)
            const homeBlue = document.createElement('div');
            homeBlue.className = 'home-blue';
            homeBlue.style.gridColumn = '12 / 16';
            homeBlue.style.gridRow = '1 / 5';
            
            for (let i = 0; i < 16; i++) {
                const homeCell = document.createElement('div');
                homeCell.className = 'home-cell';
                homeCell.dataset.homeFor = '1';
                homeBlue.appendChild(homeCell);
            }
            
            gameBoard.appendChild(homeBlue);
            
            // Žlutý domeček (levý dolní roh)
            const homeYellow = document.createElement('div');
            homeYellow.className = 'home-yellow';
            homeYellow.style.gridColumn = '1 / 5';
            homeYellow.style.gridRow = '12 / 16';
            
            for (let i = 0; i < 16; i++) {
                const homeCell = document.createElement('div');
                homeCell.className = 'home-cell';
                homeCell.dataset.homeFor = '2';
                homeYellow.appendChild(homeCell);
            }
            
            gameBoard.appendChild(homeYellow);
            
            // Červený domeček (pravý dolní roh)
            const homeRed = document.createElement('div');
            homeRed.className = 'home-red';
            homeRed.style.gridColumn = '12 / 16';
            homeRed.style.gridRow = '12 / 16';
            
            for (let i = 0; i < 16; i++) {
                const homeCell = document.createElement('div');
                homeCell.className = 'home-cell';
                homeCell.dataset.homeFor = '3';
                homeRed.appendChild(homeCell);
            }
            
            gameBoard.appendChild(homeRed);
        }
        
        function createFinishZones() {
            // Zelený cíl
            const finishGreen = document.createElement('div');
            finishGreen.className = 'finish-green';
            finishGreen.style.gridColumn = '5 / 6';
            finishGreen.style.gridRow = '2 / 8';
            
            for (let i = 0; i < 6; i++) {
                const finishCell = document.createElement('div');
                finishCell.className = 'finish-cell';
                finishCell.dataset.finishFor = '0';
                finishCell.dataset.finishIndex = i;
                finishGreen.appendChild(finishCell);
                
                // Uložíme mapování cílové pozice
                const finishPosition = 100 + 0 * 6 + i;
                positionMap[finishPosition] = { 
                    container: finishGreen, 
                    index: i, 
                    type: 'finish', 
                    playerIndex: 0 
                };
            }
            
            gameBoard.appendChild(finishGreen);
            
            // Modrý cíl
            const finishBlue = document.createElement('div');
            finishBlue.className = 'finish-blue';
            finishBlue.style.gridColumn = '11 / 12';
            finishBlue.style.gridRow = '2 / 8';
            
            for (let i = 0; i < 6; i++) {
                const finishCell = document.createElement('div');
                finishCell.className = 'finish-cell';
                finishCell.dataset.finishFor = '1';
                finishCell.dataset.finishIndex = i;
                finishBlue.appendChild(finishCell);
                
                const finishPosition = 100 + 1 * 6 + i;
                positionMap[finishPosition] = { 
                    container: finishBlue, 
                    index: i, 
                    type: 'finish', 
                    playerIndex: 1 
                };
            }
            
            gameBoard.appendChild(finishBlue);
            
            // Žlutý cíl
            const finishYellow = document.createElement('div');
            finishYellow.className = 'finish-yellow';
            finishYellow.style.gridColumn = '5 / 6';
            finishYellow.style.gridRow = '9 / 15';
            
            for (let i = 0; i < 6; i++) {
                const finishCell = document.createElement('div');
                finishCell.className = 'finish-cell';
                finishCell.dataset.finishFor = '2';
                finishCell.dataset.finishIndex = i;
                finishYellow.appendChild(finishCell);
                
                const finishPosition = 100 + 2 * 6 + i;
                positionMap[finishPosition] = { 
                    container: finishYellow, 
                    index: i, 
                    type: 'finish', 
                    playerIndex: 2 
                };
            }
            
            gameBoard.appendChild(finishYellow);
            
            // Červený cíl
            const finishRed = document.createElement('div');
            finishRed.className = 'finish-red';
            finishRed.style.gridColumn = '11 / 12';
            finishRed.style.gridRow = '9 / 15';
            
            for (let i = 0; i < 6; i++) {
                const finishCell = document.createElement('div');
                finishCell.className = 'finish-cell';
                finishCell.dataset.finishFor = '3';
                finishCell.dataset.finishIndex = i;
                finishRed.appendChild(finishCell);
                
                const finishPosition = 100 + 3 * 6 + i;
                positionMap[finishPosition] = { 
                    container: finishRed, 
                    index: i, 
                    type: 'finish', 
                    playerIndex: 3 
                };
            }
            
            gameBoard.appendChild(finishRed);
        }
        
        function createGamePath() {
            let position = 0;
            
            // Horní řada (zleva doprava) - pozice 0-7
            for (let col = 4; col <= 11; col++) {
                const cellId = `1_${col}`;
                const cell = cellMap[cellId];
                if (cell) {
                    cell.classList.add('path-cell');
                    
                    if (col === 4) {
                        // Start zeleného
                        cell.classList.add('start-cell');
                        positionMap[position] = { cell, type: 'start', playerIndex: 0 };
                    } else {
                        positionMap[position] = { cell, type: 'path' };
                    }
                    
                    addPositionNumber(cell, position);
                    position++;
                }
            }
            
            // Pravý sloupec (shora dolů) - pozice 8-13
            for (let row = 2; row <= 7; row++) {
                const cellId = `${row}_11`;
                const cell = cellMap[cellId];
                if (cell) {
                    cell.classList.add('path-cell');
                    
                    if (row === 2) {
                        // Start modrého
                        cell.classList.add('start-cell');
                        positionMap[position] = { cell, type: 'start', playerIndex: 1 };
                    } else {
                        positionMap[position] = { cell, type: 'path' };
                    }
                    
                    addPositionNumber(cell, position);
                    position++;
                }
            }
            
            // Dolní řada (zprava doleva) - pozice 14-21
            for (let col = 10; col >= 3; col--) {
                const cellId = `8_${col}`;
                const cell = cellMap[cellId];
                if (cell) {
                    cell.classList.add('path-cell');
                    
                    if (col === 10) {
                        // Start červeného
                        cell.classList.add('start-cell');
                        positionMap[position] = { cell, type: 'start', playerIndex: 3 };
                    } else {
                        positionMap[position] = { cell, type: 'path' };
                    }
                    
                    addPositionNumber(cell, position);
                    position++;
                }
            }
            
            // Levý sloupec (zdola nahoru) - pozice 22-29
            for (let row = 7; row >= 2; row--) {
                const cellId = `${row}_3`;
                const cell = cellMap[cellId];
                if (cell) {
                    cell.classList.add('path-cell');
                    
                    if (row === 7) {
                        // Start žlutého
                        cell.classList.add('start-cell');
                        positionMap[position] = { cell, type: 'start', playerIndex: 2 };
                    } else {
                        positionMap[position] = { cell, type: 'path' };
                    }
                    
                    addPositionNumber(cell, position);
                    position++;
                }
            }
            
            // Horní řada dokončení - pozice 30-39
            for (let col = 4; col <= 13; col++) {
                const cellId = `2_${col}`;
                const cell = cellMap[cellId];
                if (cell && !cell.classList.contains('finish-green') && !cell.classList.contains('finish-blue')) {
                    cell.classList.add('path-cell');
                    positionMap[position] = { cell, type: 'path' };
                    addPositionNumber(cell, position);
                    position++;
                }
            }
        }
        
        function addPositionNumber(cell, position) {
            const positionNumber = document.createElement('div');
            positionNumber.className = 'position-number';
            positionNumber.textContent = position;
            cell.appendChild(positionNumber);
        }
        
        function rollDice() {
            if (!gameActive) return;
            
            if (diceRolled && selectablePieces.length > 0) {
                addLogMessage("Nejprve vyber figurku k pohybu!");
                return;
            }
            
            diceValue = Math.floor(Math.random() * 6) + 1;
            diceElement.textContent = diceValue;
            diceRolled = true;
            
            addLogMessage(`${PLAYER_NAMES[currentPlayer]} hodil ${diceValue}.`);
            
            const hasPlayablePieces = checkPlayablePieces();
            
            if (diceValue === 6) {
                extraTurn = true;
                addLogMessage("Hodili jste 6, máte další tah!");
            } else {
                extraTurn = false;
            }
            
            if (!hasPlayablePieces) {
                addLogMessage(`${PLAYER_NAMES[currentPlayer]} nemůže táhnout, přechází na dalšího hráče.`);
                nextPlayer();
                return;
            }
            
            findSelectablePieces();
            updateGameStatus();
        }
        
        function checkPlayablePieces() {
            if (diceValue === 6) {
                for (let i = 0; i < 4; i++) {
                    if (pieces[currentPlayer][i] === -1) {
                        if (canMoveToPosition(currentPlayer, START_POSITIONS[currentPlayer])) {
                            return true;
                        }
                    }
                }
            }
            
            for (let i = 0; i < 4; i++) {
                const position = pieces[currentPlayer][i];
                
                if (position >= 0 && position < 100) {
                    let newPosition = position + diceValue;
                    
                    if (newPosition >= 40) {
                        newPosition = newPosition - 40;
                    }
                    
                    if (isBeforeFinish(currentPlayer, position, diceValue)) {
                        return true;
                    }
                    
                    if (canMoveToPosition(currentPlayer, newPosition)) {
                        return true;
                    }
                }
                
                if (position >= 100) {
                    const finishIndex = position - 100 - currentPlayer * 6;
                    
                    if (finishIndex >= 0 && finishIndex < 6) {
                        if (finishIndex + diceValue < 6) {
                            const targetFinishPos = 100 + currentPlayer * 6 + (finishIndex + diceValue);
                            if (!pieces[currentPlayer].includes(targetFinishPos)) {
                                return true;
                            }
                        }
                    }
                }
            }
            
            return false;
        }
        
        function isBeforeFinish(player, position, diceValue) {
            const playerStart = START_POSITIONS[player];
            let distanceFromStart;
            
            if (position >= playerStart) {
                distanceFromStart = position - playerStart;
            } else {
                distanceFromStart = (40 - playerStart) + position;
            }
            
            return distanceFromStart + diceValue >= 40;
        }
        
        function findSelectablePieces() {
            selectablePieces = [];
            
            if (diceValue === 6) {
                for (let i = 0; i < 4; i++) {
                    if (pieces[currentPlayer][i] === -1) {
                        if (canMoveToPosition(currentPlayer, START_POSITIONS[currentPlayer])) {
                            selectablePieces.push({player: currentPlayer, piece: i});
                        }
                    }
                }
            }
            
            for (let i = 0; i < 4; i++) {
                const position = pieces[currentPlayer][i];
                
                if (position >= 0 && position < 100) {
                    let newPosition = position + diceValue;
                    
                    if (newPosition >= 40) {
                        newPosition = newPosition - 40;
                    }
                    
                    if (isBeforeFinish(currentPlayer, position, diceValue)) {
                        selectablePieces.push({player: currentPlayer, piece: i});
                        continue;
                    }
                    
                    if (canMoveToPosition(currentPlayer, newPosition)) {
                        selectablePieces.push({player: currentPlayer, piece: i});
                    }
                }
                
                if (position >= 100) {
                    const finishIndex = position - 100 - currentPlayer * 6;
                    
                    if (finishIndex >= 0 && finishIndex < 6) {
                        if (finishIndex + diceValue < 6) {
                            const targetFinishPos = 100 + currentPlayer * 6 + (finishIndex + diceValue);
                            if (!pieces[currentPlayer].includes(targetFinishPos)) {
                                selectablePieces.push({player: currentPlayer, piece: i});
                            }
                        }
                    }
                }
            }
            
            highlightSelectablePieces();
        }
        
        function highlightSelectablePieces() {
            document.querySelectorAll('.piece').forEach(piece => {
                piece.classList.remove('piece-selectable');
            });
            
            selectablePieces.forEach(p => {
                const pieceElement = document.querySelector(`.piece[data-player="${p.player}"][data-piece="${p.piece}"]`);
                if (pieceElement) {
                    pieceElement.classList.add('piece-selectable');
                }
            });
        }
        
        function canMoveToPosition(player, position) {
            if (position >= 100) {
                return !pieces[player].includes(position);
            }
            
            for (let i = 0; i < 4; i++) {
                if (pieces[player][i] === position) {
                    return false;
                }
            }
            
            return true;
        }
        
        function handlePieceClick(event) {
            if (!gameActive || !diceRolled || selectablePieces.length === 0) return;
            
            const pieceElement = event.currentTarget;
            const player = parseInt(pieceElement.dataset.player);
            const piece = parseInt(pieceElement.dataset.piece);
            
            const isSelectable = selectablePieces.some(p => p.player === player && p.piece === piece);
            
            if (!isSelectable || player !== currentPlayer) {
                addLogMessage("Tuto figurku nyní nemůžete pohnout!");
                return;
            }
            
            movePiece(player, piece);
        }
        
        function movePiece(player, piece) {
            const oldPosition = pieces[player][piece];
            let newPosition;
            
            if (oldPosition === -1 && diceValue === 6) {
                newPosition = START_POSITIONS[player];
                pieces[player][piece] = newPosition;
                addLogMessage(`${PLAYER_NAMES[player]} vstupuje do hry s figurkou ${piece + 1} na startovní pozici ${newPosition}.`);
            } else if (oldPosition >= 0 && oldPosition < 100) {
                newPosition = oldPosition + diceValue;
                
                if (newPosition >= 40) {
                    newPosition = newPosition - 40;
                }
                
                if (isBeforeFinish(player, oldPosition, diceValue)) {
                    const distanceFromStart = (oldPosition >= START_POSITIONS[player]) ? 
                        (oldPosition - START_POSITIONS[player]) : 
                        (40 - START_POSITIONS[player] + oldPosition);
                    
                    const stepsIntoFinish = distanceFromStart + diceValue - 40;
                    
                    if (stepsIntoFinish < 6) {
                        newPosition = 100 + player * 6 + stepsIntoFinish;
                        pieces[player][piece] = newPosition;
                        addLogMessage(`${PLAYER_NAMES[player]} vstupuje do cílové zóny s figurkou ${piece + 1} (krok ${stepsIntoFinish + 1}/6).`);
                    } else {
                        addLogMessage("Nelze vstoupit do cílové zóny, hod byl příliš velký!");
                        return;
                    }
                } else {
                    pieces[player][piece] = newPosition;
                    addLogMessage(`${PLAYER_NAMES[player]} posunul figurkou ${piece + 1} na pozici ${newPosition}.`);
                }
            } else if (oldPosition >= 100) {
                const finishIndex = oldPosition - 100 - player * 6;
                
                if (finishIndex >= 0 && finishIndex < 6) {
                    if (finishIndex + diceValue < 6) {
                        newPosition = 100 + player * 6 + (finishIndex + diceValue);
                        pieces[player][piece] = newPosition;
                        addLogMessage(`${PLAYER_NAMES[player]} posunul figurkou ${piece + 1} v cílové zóně na pozici ${finishIndex + diceValue + 1}/6.`);
                    } else {
                        addLogMessage("Nelze posunout figurkou v cílové zóně, hod byl příliš velký!");
                        return;
                    }
                } else {
                    addLogMessage("Chyba: Figurka není ve vaší cílové zóně!");
                    return;
                }
            } else {
                addLogMessage("Nelze pohnout touto figurkou!");
                return;
            }
            
            checkForCapture(player, piece, oldPosition, newPosition);
            updatePiecesDisplay();
            updatePlayerInfo();
            
            selectablePieces = [];
            highlightSelectablePieces();
            
            if (checkWin(player)) {
                gameActive = false;
                addLogMessage(`🎉 ${PLAYER_NAMES[player]} vyhrál hru! 🎉`);
                gameStatus.textContent = `${PLAYER_NAMES[player]} vyhrál hru!`;
                rollBtn.disabled = true;
                return;
            }
            
            if (extraTurn) {
                diceRolled = false;
                addLogMessage(`${PLAYER_NAMES[currentPlayer]} má další tah.`);
                updateGameStatus();
            } else {
                nextPlayer();
            }
        }
        
        function checkForCapture(player, piece, oldPosition, newPosition) {
            if (newPosition < 100 && newPosition >= 0) {
                for (let p = 0; p < 4; p++) {
                    if (p === player) continue;
                    
                    for (let i = 0; i < 4; i++) {
                        if (pieces[p][i] === newPosition) {
                            const posData = positionMap[newPosition];
                            if (posData && !posData.type.includes('start')) {
                                pieces[p][i] = -1;
                                addLogMessage(`${PLAYER_NAMES[player]} vyhodil figurkou ${PLAYER_NAMES[p]}!`);
                            }
                            break;
                        }
                    }
                }
            }
        }
        
        function checkWin(player) {
            let finishedCount = 0;
            for (let i = 0; i < 4; i++) {
                const pos = pieces[player][i];
                if (pos >= 100) {
                    const finishIndex = pos - 100 - player * 6;
                    if (finishIndex === 5) {
                        finishedCount++;
                    }
                }
            }
            return finishedCount === 4;
        }
        
        function nextPlayer() {
            currentPlayer = (currentPlayer + 1) % 4;
            diceRolled = false;
            diceValue = 0;
            diceElement.textContent = '?';
            selectablePieces = [];
            highlightSelectablePieces();
            
            updateGameStatus();
            updatePlayerInfo();
        }
        
        function updateGameStatus() {
            let status = `Na řadě je: ${PLAYER_NAMES[currentPlayer]}`;
            
            if (diceRolled) {
                status += ` | Hod: ${diceValue}`;
                
                if (selectablePieces.length > 0) {
                    status += " | Vyberte figurku";
                }
            } else {
                status += " | Hoďte kostkou";
            }
            
            gameStatus.textContent = status;
            
            playerElements.forEach((element, index) => {
                if (index === currentPlayer) {
                    element.classList.add('player-active');
                } else {
                    element.classList.remove('player-active');
                }
            });
        }
        
        function updatePlayerInfo() {
            for (let player = 0; player < 4; player++) {
                let homeCount = 0;
                let finishCount = 0;
                
                for (let i = 0; i < 4; i++) {
                    if (pieces[player][i] === -1) homeCount++;
                    if (pieces[player][i] >= 100) finishCount++;
                }
                
                const pieceCountElement = playerElements[player].querySelector('.piece-count');
                pieceCountElement.textContent = `${homeCount}/4 doma, ${finishCount}/4 v cíli`;
            }
        }
        
        function updatePiecesDisplay() {
            document.querySelectorAll('.piece-on-board').forEach(piece => {
                piece.remove();
            });
            
            for (let player = 0; player < 4; player++) {
                for (let piece = 0; piece < 4; piece++) {
                    const position = pieces[player][piece];
                    
                    if (position >= 0) {
                        const posData = positionMap[position];
                        if (posData) {
                            if (position >= 100) {
                                const { container, index } = posData;
                                const finishCells = container.querySelectorAll('.finish-cell');
                                
                                if (finishCells[index]) {
                                    const pieceElement = document.createElement('div');
                                    pieceElement.className = `piece piece-${PLAYER_COLORS[player]} piece-on-board`;
                                    pieceElement.textContent = piece + 1;
                                    pieceElement.dataset.player = player;
                                    pieceElement.dataset.piece = piece;
                                    pieceElement.addEventListener('click', handlePieceClick);
                                    finishCells[index].appendChild(pieceElement);
                                }
                            } else {
                                const { cell } = posData;
                                if (cell) {
                                    const pieceElement = document.createElement('div');
                                    pieceElement.className = `piece piece-${PLAYER_COLORS[player]} piece-on-board`;
                                    pieceElement.textContent = piece + 1;
                                    pieceElement.dataset.player = player;
                                    pieceElement.dataset.piece = piece;
                                    pieceElement.addEventListener('click', handlePieceClick);
                                    cell.appendChild(pieceElement);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        function addLogMessage(message) {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-message';
            logEntry.textContent = message;
            logMessages.appendChild(logEntry);
            
            logMessages.scrollTop = logMessages.scrollHeight;
        }
        
        window.onload = initGame;
