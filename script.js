addEventListener('load', function() {

    console.log('Page loaded!');
    if (localStorage.saveSpringPoints) { // tavaszi pontok betöltése, ha van
        document.getElementById('spring').innerHTML = `Tavasz: <br>${localStorage.saveSpringPoints} pont`;
        document.getElementById('counter').innerHTML = `Összesen: ${localStorage.saveAllPoints} pont`;
    }

    if (localStorage.saveSummerPoints) { // nyári pontok betöltése, ha van
        document.getElementById('summer').innerHTML = `Nyár: <br>${localStorage.saveSummerPoints} pont`;
        document.getElementById('counter').innerHTML = `Összesen: ${localStorage.saveAllPoints} pont`;
    }

    if (localStorage.saveAutumnPoints) { // őszi pontok betöltése, ha van
        document.getElementById('autumn').innerHTML = `Ősz: <br>${localStorage.saveAutumnPoints} pont`;
        document.getElementById('counter').innerHTML = `Összesen: ${localStorage.saveAllPoints} pont`;
    }

    if (localStorage.saveWinterPoints) { // téli pontok betöltése, ha van
        document.getElementById('winter').innerHTML = `Tél: <br>${localStorage.saveWinterPoints} pont`;
        document.getElementById('counter').innerHTML = `Összesen: ${localStorage.saveAllPoints} pont`;
    }


    updatePlayArea(matrix);
    getMissions();
    console.log(givenMissions);
    getElementToBePut();
    playerArea.addEventListener('click', drawElement);
    playerArea.addEventListener('mousemove', drawDraft);
    rotate.addEventListener('click', rotateAndUpdate);
    mirror.addEventListener('click', mirrorAndUpdate);
    showSeason();
    localClear.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    }); // csak teszteléshez kellett, de benn hagyom a véglegesben is
})




// Egy olyan mátrix létrehozása, amely a táblázat adatait fogja tárolni: 11x11-es mx.
let matrix = Array.from({ length: 11 }, () =>
    Array.from({ length: 11 }, () => 0)
);

// Ha van mentett játék akkor a mátrixot a localStorage-ból töltjük be
const loadedMatrix = JSON.parse(localStorage.getItem('saveMatrix'));
if (loadedMatrix) matrix = loadedMatrix;

// A hegyek fixek, ezeket már el is tudjuk tárolni a tömbben

matrix[1][1] = 'mountain';
matrix[3][8] = 'mountain';
matrix[5][3] = 'mountain';
matrix[8][9] = 'mountain';
matrix[9][5] = 'mountain';



/**
 * A mátrix alapján megjeleníti a játékteret
 * @param {*} matrix ezen mátrix alapján updateli, két fajta mátrix lesz neki majd odaadva később (matrix és copyMatrix)
 * @param {*} isDraft ha a draft kirajzolásakor hívjuk meg akkor truet adunk ide, amúgy meg false
 */
function updatePlayArea(matrix, isDraft = false) {
    let out = "";
    for (const elem of matrix) {
        out += '<tr>';
        for (const elem2 of elem) {
            if (elem2 !== 0) out += `<td><img src="${elem2}.jpg"></img></td>`
            else out += `<td><img src="empty.jpg"></img></td>`;
        }
        out += '</tr>';
    }
    document.getElementById('playerArea').innerHTML = out;
    if (!isDraft) localStorage.setItem('saveMatrix', JSON.stringify(matrix)); // mátrix elmentése a localStorage-ba, ha nem a draft kirajzolása hívta meg a fv-t
}

let randomElement;
/**
 * A lehelyezendő elem kisorsolása
 * @param {*} event 
 */
function getElementToBePut(event) {
    const loadedRandomElement = JSON.parse(localStorage.getItem('saveRandomElement'));
    if (loadedRandomElement) {
        randomElement = loadedRandomElement; // ha már van mentett, akkor abból töltjük be
        updateElementToBePut();
    } else { // ha nincs akkor sorsolunk random
        randomElement = elements[(Math.floor(Math.random() * elements.length))];
        localStorage.setItem('saveRandomElement', JSON.stringify(randomElement)); // mentés
        updateElementToBePut();
    }

}
/**
 * A lehelyezendő elem kijelzése
 */
function updateElementToBePut() {
    let out = "";
    out += `${randomElement.time}🕑<br>`;
    out += '<table class="centerTable">';
    for (let i = 0; i < 3; i++) {
        out += '<tr>';
        for (let j = 0; j < 3; j++) {
            if (randomElement.shape[i][j] === 1) {
                out += `<td><img src="${randomElement.type}.jpg"></img></td>`
            } else {
                out += `<td></td>`
            }

        }
        out += '</tr>'


    }
    out += '</table>';
    document.getElementById('elemToBePut').innerHTML = out;
}

let hatarvidekPoints = 0;
let time = 28;

if (localStorage.saveTime) time = localStorage.saveTime;

/**
 * Kirajzolja zölden azokat a mezőket, ahova kerülne a lehelyezendő elem, ha az adott cellába kattintana a felhasználó
 * @param {*} event 
 * @returns early return only
 */
function drawDraft(event) {
    if (event.target.tagName == 'IMG' && time !== 0) { // ha time=0 akkor már ne fusson le a folyamat
        try { // azért kerül try-ba, mert ha lelógna a lehelyezendő elem a játéktérről akkor kivételt dob
            // Későbbi számításokhoz kelleni fog, hogy hanyadik sor hanyadik oszlopába kattintottunk
            let row = event.target.parentNode.parentNode.rowIndex;
            let col = event.target.parentNode.cellIndex;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {

                    if (randomElement.shape[i][j] === 1 && matrix[row + i][col + j] !== 0) {
                        console.log("Az elem nem tehető le!");
                        return;
                    }

                }
            }

            let copyMatrix = [];
            for (let i = 0; i < 11; i++) {
                copyMatrix[i] = [];
                for (let j = 0; j < 11; j++) {
                    copyMatrix[i][j] = matrix[i][j];
                }

            }
            updateMatrixWithElement(row, col, copyMatrix, true); // ezzel színezi ki zöldre jelezve, hogy ha az adott mezőre kattintana a felhasználó akkor hova kerülne
            updatePlayArea(copyMatrix, true);

        } catch {
            console.log("Az elem nem tehető le!");
        }




    }

}

/**
 * Kattintáskor elvégzendő művelet, lehelyezi az elemet.
 * @param {*} event 
 * @returns early return only
 */
function drawElement(event) {
    if (event.target.tagName == 'IMG' && time !== 0) { // ha time=0 akkor már ne fusson le a folyamat
        try { // hasonlóan mint az előzőnél
            // Későbbi számításokhoz kelleni fog, hogy hanyadik sor hanyadik oszlopába kattintottunk
            let row = event.target.parentNode.parentNode.rowIndex;
            let col = event.target.parentNode.cellIndex;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {

                    if (randomElement.shape[i][j] === 1 && matrix[row + i][col + j] !== 0) {
                        console.log("Az elem nem tehető le!");
                        return;
                    }

                }
            }
            updateMatrixWithElement(row, col, matrix);
            updatePlayArea(matrix); // ez értelemszerűen el fogja tűntetni az esetlegesen kirajzolt draftot, lásd előző függvény
        } catch {
            console.log("Az elem nem tehető le!");
        }

        localStorage.removeItem('saveRandomElement'); // törölni kell a tárhelyből, hiszen újat fogunk generálni ezután
        if (time - randomElement.time > 0) {
            if (time === 22) time = 21; // évszak végén mindegy milyen időértékű elem lett kihúzva az évszak végetér
            else if (time === 15) time = 14; // évszak végén mindegy milyen időértékű elem lett kihúzva az évszak végetér
            else if (time === 8) time = 7; // évszak végén mindegy milyen időértékű elem lett kihúzva az évszak végetér
            else {
                time -= randomElement.time;
                console.log('Az idő:' + time);
                getElementToBePut(); // következő elem kisorolsolása, hiszen az idő ellenőrzésével tudjuk, hogy van még
                elements = elements.filter(x => x !== randomElement);
                localStorage.setItem('saveElements', JSON.stringify(elements)); // sorsolható elemek elmentése
            }
            localStorage.saveTime = time;
        } else { // azaz a játék végén
            document.getElementById('results').innerHTML += `
            <br> ELÉRT PONT a Határvidék küldetéssel: ${getHatarvidekMissionPoints()} 
            <br> ELÉRT PONT az Erdő Széle küldetéssel:${getAzErdoSzeleMissionPoints()}
            <br> ELÉRT PONT az Álmos-völgy küldetéssel:${getAlmosVolgyPoints()}
            <br> ELÉRT PONT a Krumpliöntözés küldetéssel: ${getKrumpliOntozesPoints()}
            <br> ELÉRT PONT a hegyek körbekerítésével: ${getHegyKorbeKeritesPoints()}
            <br> ELÉRT PONT a Gazdag Város küldetéssel: ${getGazdagVarosPoints()}
            <br> ELÉRT PONT a Fasor küldetéssel: ${getFasorPoints()}
            <br> ELÉRT PONT az Öntözőcsatorna küldetéssel: ${getOntozocsatornaPoints()}
            <br> ELÉRT PONT a Mágusok völgye küldetéssel: ${getMagusokVolgyePoints()}
            <br> ELÉRT PONT az Üres telek küldetéssel: ${getUresTelekPoints()}
            <br> ELÉRT PONT a Sorház küldetéssel: ${getSorhazPoints()}
            <br> ELÉRT PONT a Páratlan silók küldetéssel: ${getParatlanSilokPoints()}
            <br> ELÉRT PONT a Gazdag vidék küldetéssel: ${getGazdagVidekPoints()}</b>`;
            time = 0;
            document.getElementById('buttonsForMirrorAndRotate').style.display = 'none'; // mivel nincs több elem -> gombokat elrejtem
            localStorage.clear() // játék végén törlöm a mentett állapotokat
        }
        showSeason();

    }
}
let allPoints = 0;
if (localStorage.saveAllPoints) allPoints = parseInt(localStorage.saveAllPoints);


/**
 * Egy mátrix transzponálására
 * @param {*} m transzponálandó mátrix
 * @returns transzponált mátrix
 */
const transpose = (m) => {
    let [row] = m
    return row.map((value, column) => m.map(row => row[column]))
}


/**
 * A lehelyezendő elemmel frissíti a mátrixot.
 * @param {*} row a kattintott cella sorszáma
 * @param {*} col a kattintott cella során belül az oszlop száma
 * @param {*} mx az frissítendő mátrix
 * @param {*} isDraft akkor true ha a draft kirajzolása hívta meg, egyébként false
 */
function updateMatrixWithElement(row, col, mx, isDraft = false) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {

            if (randomElement.shape[i][j] === 1 && mx[row + i][col + j] === 0) {
                if (isDraft) {
                    mx[row + i][col + j] = 'good';
                } else {
                    mx[row + i][col + j] = randomElement.type;
                }


            }

        }
    }
}

function rotateAndUpdate(event) {
    randomElement.shape = rotateMatrix(randomElement.shape);
    updateElementToBePut();
}

function mirrorAndUpdate(event) {
    randomElement.shape = mirrorMatrixVertical(randomElement.shape);
    updateElementToBePut();
}