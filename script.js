let field = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = 'circle'; // Startspieler ist 'circle'

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Reihen
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Spalten
    [0, 4, 8], [2, 4, 6],           // Diagonalen
];

function init() {
    render();
}

function render() {
    const contentDiv = document.getElementById('content');

    // HTML-Tabelle als String erstellen
    let tableHTML = '<table>';
    for (let i = 0; i < 3; i++) { // 3x3 Tabelle
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            const value = field[index];

            // Feldinhalt bestimmen: leer, Kreis oder Kreuz
            let cellContent = '';
            let onclick = '';

            if (value === 'circle') {
                cellContent = generateCircleSVG(); // Kreis
            } else if (value === 'cross') {
                cellContent = generateCrossSVG(); // Kreuz
            } else {
                onclick = `onclick="handleClick(${index}, this)"`;
            }
            tableHTML += `<td ${onclick}>${cellContent}</td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';

    contentDiv.innerHTML = tableHTML;
}

function resetGame(){
   field = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];

    const lines = document.querySelectorAll('div');
    lines.forEach(line => {
        if (line.style.position === 'absolute') {
            line.remove();
        }
    });

    render();
}


function handleClick(index, element) {      
    if (field[index] !== null) return;      // prüft ob Feld leer, wenn nicht beendet das return weitere Ausführung

    field[index] = currentPlayer;
    const svgContent =
        currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();

    element.innerHTML = svgContent;
    element.onclick = null;         //verhindert nicht erneutes klicken auf belegtes Feld -> hat nichts mt field array zutun 

    if (checkGameOver()) return; // Spiel beenden, wenn vorbei

    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';  //Spielerwechsel
}

function checkGameOver() {                  
    for (const combination of winningCombinations) {            //Speichert Gewinnkombination
        const [a, b, c] = combination;                          // Speichert Gewinnkombination in Buchstaben

        if (field[a] && field[a] === field[b] && field[a] === field[c]) { 
            drawWinningLine(combination); // Linie zeichnen
            setTimeout(() => alert(`${field[a]} gewinnt!`), 1000); // Sieg-Nachricht
            return true;
        }
    }

    if (field.every(cell => cell !== null)) {           //prüft ob Element nicht null ist und ob Spielfeld komplett gefüllt ist
        setTimeout(() => alert('Unentschieden!'), 1000);
        return true;
    }

    return false;                                   // Wenn weder Sieg noch Unentschieden vorliegt geht Spiel weiter 
}

function drawWinningLine(combination) {                 //Funktion erklären lassen 
    const contentDiv = document.getElementById('content');
    const table = contentDiv.querySelector('table');
    const [a, b, c] = combination;

    const cells = table.querySelectorAll('td');
    const rectA = cells[a].getBoundingClientRect();     //getBoundingClientRect() liefert die Position und Größe dieses Elements im Browserfenster.
    const rectB = cells[b].getBoundingClientRect();
    const rectC = cells[c].getBoundingClientRect();

    const line = document.createElement('div');         //Linie wird im div erstellt 
    line.style.position = 'absolute';
    line.style.width = `${Math.sqrt(Math.pow(rectC.x - rectA.x, 2) + Math.pow(rectC.y - rectA.y, 2))}px`;
    line.style.height = '5px';
    line.style.backgroundColor = 'white';
    line.style.transformOrigin = '0 0';                                             //Transformationsachse der Linie wird auf den oberen linken Punkt (0, 0) der Linie gesetzt -> rotation
    line.style.transform = `rotate(${Math.atan2(rectC.y - rectA.y, rectC.x - rectA.x)}rad)`;        //Linie wird so gedreht, dass sie die Felder a, b, und c verbindet.
    line.style.top = `${rectA.y + rectA.height / 2}px`;
    line.style.left = `${rectA.x + rectA.width / 2}px`;

    line.style.transition = 'width 0.4s ease'; // 0.4 Sekunden für die Animation
    line.style.width = '0'; // Startwert: unsichtbare Linie

    document.body.appendChild(line);

    setTimeout(() => {
        line.style.width = `${Math.sqrt(Math.pow(rectC.x - rectA.x, 2) + Math.pow(rectC.y - rectA.y, 2))}px`;
    }, 10); // Starten der Animation leicht verzögert
}

function generateCircleSVG() {
    return `
<svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
    <circle 
        cx="35" 
        cy="35" 
        r="30" 
        fill="none" 
        stroke="#00B0EF" 
        stroke-width="5" 
        stroke-dasharray="188.4" 
        stroke-dashoffset="188.4"
    >
        <animate 
            attributeName="stroke-dashoffset" 
            from="188.4" 
            to="0" 
            dur="0.4s" 
            fill="freeze" 
        />
    </circle>
</svg>`;
}

function generateCrossSVG() {
    return `
<svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
    <line 
        x1="15" 
        y1="15" 
        x2="55" 
        y2="55" 
        stroke="#FFC000" 
        stroke-width="5" 
        stroke-linecap="round"
        stroke-dasharray="56.6" 
        stroke-dashoffset="56.6"
    >
        <animate 
            attributeName="stroke-dashoffset" 
            from="56.6" 
            to="0" 
            dur="0.2s" 
            fill="freeze" 
        />
    </line>
    <line 
        x1="55" 
        y1="15" 
        x2="15" 
        y2="55" 
        stroke="#FFC000" 
        stroke-width="5" 
        stroke-linecap="round"
        stroke-dasharray="56.6" 
        stroke-dashoffset="56.6"
    >
        <animate 
            attributeName="stroke-dashoffset" 
            from="56.6" 
            to="0" 
            dur="0.2s" 
            fill="freeze" 
            begin="0.2s"
        />
    </line>
</svg>`;
}
