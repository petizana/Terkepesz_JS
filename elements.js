/**
 * Lehetséges lehelyezendő elemek
 * Emellett a forgatásért és tükrözésért felelős függvény is ebben a fájlban található
 * Módosítottam és nem const a függvény a sorsolás miatt : a random sorsolás után eggyel csökkenteni kell, ki kell belőle venni a kisorsolt elemet,
 * hogy azt többé ne lehessen kisorsolni
 */

let elements;
const loadedElements = JSON.parse(localStorage.getItem('saveElements'));
if (loadedElements) elements = loadedElements; // ha van mentés, akkor abból töltjük be
else { // ha nincs akkor megy az összes értékkel
    elements = [{
            time: 2,
            type: 'water',
            shape: [
                [1, 1, 1],
                [0, 0, 0],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'town',
            shape: [
                [1, 1, 1],
                [0, 0, 0],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'forest',
            shape: [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'farm',
            shape: [
                [1, 1, 1],
                [0, 0, 1],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'forest',
            shape: [
                [1, 1, 1],
                [0, 0, 1],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'town',
            shape: [
                [1, 1, 1],
                [0, 1, 0],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'farm',
            shape: [
                [1, 1, 1],
                [0, 1, 0],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'town',
            shape: [
                [1, 1, 0],
                [1, 0, 0],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'town',
            shape: [
                [1, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'farm',
            shape: [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'farm',
            shape: [
                [0, 1, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'water',
            shape: [
                [1, 1, 1],
                [1, 0, 0],
                [1, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'water',
            shape: [
                [1, 0, 0],
                [1, 1, 1],
                [1, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'forest',
            shape: [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 1]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'forest',
            shape: [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'water',
            shape: [
                [1, 1, 0],
                [1, 1, 0],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },
        /* csak teszteléshez használtam, egy nagyságú elem
        {
            time: 2,
            type: 'water',
            shape: [
                [1, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            rotation: 0,
            mirrored: false
        },*/
    ]
}

/**
 * A mátrix forgatása. A fenti tömbben lévő rotationt nem állítja át, hiszen ennek tulajdonságát nem használnám fel sehol sem
 * @param {*} matrix a mátrix, amit el akarunk forgatni
 * @returns az elforgatott mx.
 */
function rotateMatrix(matrix) {
    const N = matrix.length;
    const rotatedMatrix = new Array(N).fill(0).map(() => new Array(N).fill(0));

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            rotatedMatrix[i][j] = matrix[N - j - 1][i];
        }
    }

    return rotatedMatrix;
}

/**
 * A mátrix tükrözése. A fenti tömbben lévő adattagot nem állítja át, hiszen ennek tulajdonságát nem használnám fel sehol sem
 * @param {*} matrix a mátrix, amit tükrözni akarunk
 * @returns a türközött mx.
 */
function mirrorMatrixVertical(matrix) {
    const M = matrix.length;
    const N = matrix[0].length;
    const mirroredMatrix = new Array(M).fill(0).map(() => new Array(N).fill(0));

    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            mirroredMatrix[i][j] = matrix[i][N - j - 1];
        }
    }

    return mirroredMatrix;
}