/**
 * Ebben a fájlban a küldetésekért járó pontokat kiszámoló függvények vannak és az a függvény, ami a küldetések kisorsolásáért felelős
 */

let givenMissions = []; // ebbe rakom a meghívandó get...MissionPoints függvény neveket
//, hogy az évszakváltásoknál csak a megfelelő függvényeket könnyedén meg lehessen hívni

/**
 * A négy küldetést sorsolja és jelzi ki
 */
function getMissions() {
    let output = "";
    const missionLabels = ['A', 'B', 'C', 'D'];

    const savedMissions = JSON.parse(localStorage.getItem('saveMissions'));
    if (savedMissions) { // mentésből betöltés (ha van)
        missions = savedMissions;
        missions.forEach((mission, index) => {
            givenMissions.push(getMissionPointsFunction(mission.title));
            output += formatMissionOutput(mission, index, missionLabels);
        });
    } else {
        for (let i = 0; i < 4; i++) {
            let randomMission = missions[Math.floor(Math.random() * missions.length)];
            missions.push(randomMission);
            console.log(missions);
            givenMissions.push(getMissionPointsFunction(randomMission.title));
            missions = missions.filter(mission => mission !== randomMission); // kitöröljük az eredeti mátrixból, 
            //hogy a következő sorsoláskor ezt már ne lehessen kisorsolni

            output += formatMissionOutput(randomMission, i, missionLabels);
        }
        localStorage.setItem('saveMissions', JSON.stringify(missions));
    }

    document.getElementById('missions').innerHTML = output;
}

function getMissionPointsFunction(title) {
    switch (title) {
        case "Az erdő széle":
            return getAzErdoSzeleMissionPoints;
        case "Álmos-völgy":
            return getAlmosVolgyPoints;
        case "Krumpliöntözés":
            return getKrumpliOntozesPoints;
        case "Határvidék":
            return getHatarvidekMissionPoints;
        case "Gazdag város":
            return getGazdagVarosPoints;
        case "Öntözőcsatorna":
            return getOntozocsatornaPoints;
        case "Fasor":
            return getFasorPoints;
        case "Mágusok völgye":
            return getMagusokVolgyePoints;
        case "Üres telek":
            return getUresTelekPoints;
        case "Sorház":
            return getSorhazPoints;
        case "Páratlan silók":
            return getParatlanSilokPoints;
        case "Gazdag vidék":
            return getGazdagVidekPoints;
        default:
            return null;
    }
}

function formatMissionOutput(mission, index, missionLabels) {
    let output = "";
    if (index === 0 || index === 2) output += '<tr>';
    output += `<td><div class="mission" id="${index}"><b>${mission.title} ${missionLabels[index]}</b><br>${mission.description}</div></td>`;
    if (index === 1 || index === 3) output += '</tr>';
    return output;
}


/**
 * Határvidék küldetést számolja ki
 * Határvidék: Minden teli sorért vagy oszlopért 6-6 pontot kapsz.
 * @param {*} row
 * @param {*} col 
 */
function getHatarvidekMissionPoints() {
    let pts = 0;
    for (const elem of matrix) {
        if (elem.every(x => x !== 0)) pts += 6;
    }
    let trans = transpose(matrix);
    for (const elem of trans) {
        if (elem.every(x => x !== 0)) pts += 6;
    }

    return pts;
}


/**
 * Erdő széle küldetés
 * Az erdő széle: A térképed szélével szomszédos erdőmezőidért egy-egy pontot kapsz.
 * @returns Az erdő széle mission pontszáma
 */
function getAzErdoSzeleMissionPoints() {
    let azErdoSzelePoints = 0;
    azErdoSzelePoints += matrix[0].filter(x => x === 'forest').length // az első sorban lévő foresteket számolom meg
    azErdoSzelePoints += matrix[10].filter(x => x === 'forest').length // az utolsó sorban lévő foresteket számolom meg

    azErdoSzelePoints += transpose(matrix)[0].filter(x => x === 'forest').length; // az első oszlopban lévő foresteket számolom meg
    azErdoSzelePoints += transpose(matrix)[10].filter(x => x === 'forest').length; // az utolsó oszlopban lévő foresteket számolom meg

    // duplán számolások miatt a táblázat négy csucsában le kell vonni egyet-egyet
    if (matrix[0][0] === 'forest') azErdoSzelePoints--;
    if (matrix[0][10] === 'forest') azErdoSzelePoints--;
    if (matrix[10][0] === 'forest') azErdoSzelePoints--;
    if (matrix[10][10] === 'forest') azErdoSzelePoints--;

    return azErdoSzelePoints;

}

/**
 * Álmos völgy küldetés
 * Álmos-völgy: Minden olyan sorért, amelyben három erdőmező van, négy-négy pontot kapsz.
 * @returns Álmos-völgy mission pontszáma
 */
function getAlmosVolgyPoints() {
    let pts = 0;
    for (let i = 0; i < 11; i++) {
        if (matrix[i].filter(x => x === 'forest').length === 3) pts += 4;
    }
    return pts;
}

/**
 * Krumpliöntözés küldetés
 * Krumpliöntözés: A farmmezőiddel szomszédos vízmezőidért két-két pontot kapsz.
 * @returns Krumpliöntözés mission pontszáma
 */
function getKrumpliOntozesPoints() {
    let pts = 0;
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            if (matrix[i][j] === 'farm') {
                // felette lévő
                if (matrix[i - 1] && matrix[i - 1][j]) {
                    if (matrix[i - 1][j] === 'water') pts += 2;
                }
                //alatta lévő
                if (matrix[i + 1] && matrix[i + 1][j]) {
                    if (matrix[i + 1][j] === 'water') pts += 2;
                }
                // tőle balra
                if (matrix[i][j - 1]) {
                    if (matrix[i][j - 1] === 'water') pts += 2;
                }
                // tőle jobbra
                if (matrix[i][j + 1]) {
                    if (matrix[i][j + 1] === 'water') pts += 2;
                }
            }
        }

    }
    return pts;
}


/**
 * Hegyek körbekerítése küldetés
 * Ha a hegyeket 4 oldalról körbevesszük, körbevett hegyenként 1-1 pontot kapunk.
 * @returns 
 */
function getHegyKorbeKeritesPoints() { // hasonlóan, mint a krumpliöntözésnél
    let pts = 0;
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            if (matrix[i][j] === 'mountain') {
                // felette lévő
                if (matrix[i - 1] && matrix[i - 1][j]) {
                    if (matrix[i - 1][j] !== 0) {
                        if (matrix[i + 1] && matrix[i + 1][j]) { //alatta lévő
                            if (matrix[i + 1][j] !== 0) {
                                // tőle balra
                                if (matrix[i][j - 1]) {
                                    if (matrix[i][j - 1] !== 0) {
                                        // tőle jobbra
                                        if (matrix[i][j + 1]) {
                                            if (matrix[i][j + 1] !== 0) pts += 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    }
    return pts;
}


/**
 * Gazdag város küldetés
 * Gazdag város: A legalább három különböző tereptípussal szomszédos falumezőidért három-három pontot kapsz.
 * @returns pont
 */
function getGazdagVarosPoints() {
    let neighbours = [];
    let pts = 0;
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            if (matrix[i][j] === 'town') {
                // felette lévő
                if (matrix[i - 1] && matrix[i - 1][j]) {
                    neighbours.push(matrix[i - 1][j]);
                }
                //alatta lévő
                if (matrix[i + 1] && matrix[i + 1][j]) {
                    neighbours.push(matrix[i + 1][j]);
                }
                // tőle balra
                if (matrix[i][j - 1]) {
                    neighbours.push(matrix[i][j - 1]);
                }
                // tőle jobbra
                if (matrix[i][j + 1]) {
                    neighbours.push(matrix[i][j + 1]);
                }
                if (neighbours.filter((v, i, a) => a.indexOf(v) == i).length >= 3) pts += 3;
                neighbours = [];

            }

        }

    }
    return pts;
}


/**
 * Öntözőcsatorna küldetés
 * Minden olyan oszlopodért, amelyben a farm illetve a vízmezők száma megegyezik, négy-négy pontot kapsz.
 * Mindkét tereptípusból legalább egy-egy mezőnek lennie kell az oszlopban ahhoz, hogy pontot kaphass érte.
 * @returns pont
 */
function getOntozocsatornaPoints() {
    let pts = 0;
    let trans = transpose(matrix);
    for (const elem of trans) {
        if (elem.includes('farm') && elem.includes('water')) // azaz az adott oszlopban van minimum egy víz és farm
        {
            if (elem.filter(x => x === 'farm').length === elem.filter(x => x === 'water').length) pts += 4;
        }
    }
    return pts;
}

/**
 * Mágusok völgye küldetés
 * Mágusok völgye: A hegymezőiddel szomszédos vízmezőidért három-három pontot kapsz.
 * @returns pont
 */
function getMagusokVolgyePoints() {
    let pts = 0;
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            if (matrix[i][j] === 'mountain') {
                // felette lévő
                if (matrix[i - 1] && matrix[i - 1][j]) {
                    if (matrix[i - 1][j] === 'water') pts += 3;
                }
                //alatta lévő
                if (matrix[i + 1] && matrix[i + 1][j]) {
                    if (matrix[i + 1][j] === 'water') pts += 3;
                }
                // tőle balra
                if (matrix[i][j - 1]) {
                    if (matrix[i][j - 1] === 'water') pts += 3;
                }
                // tőle jobbra
                if (matrix[i][j + 1]) {
                    if (matrix[i][j + 1] === 'water') pts += 3;
                }


            }

        }

    }
    return pts;
}


/**
 * Üres telek küldetés
 * Üres telek: A falumezőiddel szomszédos üres mezőkért 2-2 pontot kapsz.
 * @returns pont
 */
function getUresTelekPoints() {
    let pts = 0;
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            if (matrix[i][j] === 'town') {
                // felette lévő
                if (i > 0 && matrix[i - 1][j] === 0) {
                    pts += 2;
                }
                //alatta lévő
                if (i < 10 && matrix[i + 1][j] === 0) {
                    pts += 2;
                }
                // tőle balra
                if (j > 0 && matrix[i][j - 1] === 0) {
                    pts += 2;
                }
                // tőle jobbra
                if (j < 10 && matrix[i][j + 1] === 0) {
                    pts += 2;
                }


            }

        }
    }
    return pts;
}

/**
 * Fasor küldetés
 * Fasor: A leghosszabb, függőlegesen megszakítás nélkül egybefüggő erdőmezők mindegyikéért kettő-kettő pontot kapsz.
 * Két azonos hosszúságú esetén csak az egyikért.
 * MEGJEGYZÉS: mivel a feladat szövege nem tér ki arra, hogy 1 erdőre nem adható 2 pont, így én úgy csináltam, hogy arra kapható 2p
 * @returns pont
 */
function getFasorPoints() {
    let pts = 0;
    let trans = transpose(matrix); // transzponálom, hogy a sorok legyenek az oszlopok és fordítva
    let forestRowLength = 0;
    let a = Array.from({ length: 11 }, () => 0); // ebben tárolom az összefüggő erdők számát SORONKÉNT, azaz 11 elemű lesz
    for (let i = 0; i < 11; i++) {

        for (let j = 0; j < 11; j++) {
            if (trans[i][j] === 'forest') {
                forestRowLength++;

            } else { // azaz ha vége van a forest streaknek :(
                if (forestRowLength > a[i]) a[i] = forestRowLength;
                forestRowLength = 0;
            }

        }

    }

    a.map(x => { pts += x * 2; });
    return pts;
}

/**
 * Sorház küldetés
 * Sorház: A leghosszabb, vízszintesen megszakítás nélkül egybefüggő falumezők mindegyikéért kettő-kettő pontot kapsz.
 * MEGJEGYZÉS: mivel a feladat szövege nem tér ki arra, hogy 1 falura nem adható 2 pont, így én úgy csináltam, hogy arra kapható 2p
 * @returns pont
 */
function getSorhazPoints() {
    let townRowLength = 0;
    let a = Array.from({ length: 11 }, () => 0); // ebben tárolom az összefüggő faluk számát SORONKÉNT, azaz 11 elemű lesz
    for (let i = 0; i < 11; i++) {

        for (let j = 0; j < 11; j++) {
            if (matrix[i][j] === 'town') {
                townRowLength++;

            } else { // azaz ha vége van a town streaknek :(
                if (townRowLength > a[i]) a[i] = townRowLength;
                townRowLength = 0;
            }

        }

    }

    console.log(a);

    let pts = 0;
    a.map(x => { pts += x * 2; });
    return pts;
}


/**
 * Páratlan silók küldetés
 * Páratlan silók: Minden páratlan sorszámú teli oszlopodért 10-10 pontot kapsz.
 * MEGJEGYZÉS: az indexelés 0-tól indul, így nekem pont az kell nézni, hogy az i páros legyen
 * @returns pont
 */
function getParatlanSilokPoints() {
    let pts = 0;
    let trans = transpose(matrix);
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            if (j % 2 === 0 && trans[j].every(x => x !== 0)) pts += 10;

        }


    }

    return pts / 11;
}



/**
 * Gazdag vidék küldetés
 * Gazdag vidék: Minden legalább öt különböző tereptípust tartalmazó sorért négy-négy pontot kapsz.
 * MEGJEGYZÉS: az én értelmezésem szerint az üres is számít egynek, erről nem írt a feladat
 * @returns pont
 */
function getGazdagVidekPoints() {
    let pts = 0;
    for (let i = 0; i < 11; i++) {
        if (matrix[i].filter((v, i, a) => a.indexOf(v) == i).length >= 5) pts += 4;
    }
    return pts;

}