function showSeason() {
    if (time <= 28 && time > 21) {
        document.getElementById('season').innerHTML = 'Tavasz (AB)';
        document.getElementById('remainingTime').innerHTML = time % 7 === 0 ? 7 : time % 7;
        // A megfelelő küldetések kiemelése (A és B) 
        document.getElementById('0').innerHTML = document.getElementById('0').innerHTML.replace(' A', ' 🟢A🟢');
        document.getElementById('1').innerHTML = document.getElementById('1').innerHTML.replace(' B', ' 🟢B🟢');
    }

    if (time <= 21 && time > 14) {
        if (time === 21) // azaz épp évszakváltás történt
        {
            document.getElementById('spring').innerHTML = `Tavasz: <br>${givenMissions[0]()+givenMissions[1]()} pont`;
            localStorage.saveSpringPoints = givenMissions[0]() + givenMissions[1]();
            allPoints += givenMissions[0]() + givenMissions[1]();
            document.getElementById('counter').innerHTML = `Összesen: ${allPoints} pont`;
            localStorage.saveAllPoints = allPoints;
        }
        document.getElementById('season').innerHTML = 'Nyár (BC)';
        document.getElementById('remainingTime').innerHTML = time % 7 === 0 ? 7 : time % 7;
        //Tavaszi küldetések már ne legyenek kiemelve, pontosabban csak az A-t hagyjuk el, cél: B és C
        document.getElementById('0').innerHTML = document.getElementById('0').innerHTML.replace(' 🟢A🟢', ' A');
        // És a C-t hozzuk be
        document.getElementById('1').innerHTML = document.getElementById('1').innerHTML.replace(' B', ' 🟢B🟢');

        document.getElementById('2').innerHTML = document.getElementById('2').innerHTML.replace(' C', ' 🟢C🟢');


    }

    if (time <= 14 && time > 7) {
        if (time === 14) // azaz épp évszakváltás történt
        {
            document.getElementById('summer').innerHTML = `Nyár: <br>${givenMissions[1]()+givenMissions[2]()} pont`;
            localStorage.saveSummerPoints = givenMissions[1]() + givenMissions[2]();
            allPoints += givenMissions[1]() + givenMissions[2]();
            document.getElementById('counter').innerHTML = `Összesen: ${allPoints} pont`;
            localStorage.saveAllPoints = allPoints;
        }
        document.getElementById('season').innerHTML = 'Ősz (CD)';
        document.getElementById('remainingTime').innerHTML = time % 7 === 0 ? 7 : time % 7;
        //Nyári küldetések már ne legyenek kiemelve, pontosabban csak az B-t hagyjuk el, cél: C és D
        document.getElementById('1').innerHTML = document.getElementById('1').innerHTML.replace(' 🟢B🟢', ' B');
        // És a D-t hozzuk be
        document.getElementById('2').innerHTML = document.getElementById('2').innerHTML.replace(' C', ' 🟢C🟢');

        document.getElementById('3').innerHTML = document.getElementById('3').innerHTML.replace(' D', ' 🟢D🟢');
    }

    if (time <= 7 && time > 0) {
        if (time === 7) // azaz épp évszakváltás történt
        {
            document.getElementById('autumn').innerHTML = `Ősz: <br>${givenMissions[2]()+givenMissions[3]()} pont`;
            localStorage.saveAutumnPoints = givenMissions[2]() + givenMissions[3]();
            allPoints += givenMissions[2]() + givenMissions[3]();
            document.getElementById('counter').innerHTML = `Összesen: ${allPoints} pont`;
            localStorage.saveAllPoints = allPoints;
        }
        document.getElementById('season').innerHTML = 'Tél (DA)';
        document.getElementById('remainingTime').innerHTML = time % 7 === 0 ? 7 : time % 7;
        //Őszi küldetések már ne legyenek kiemelve, pontosabban csak az C-t hagyjuk el, cél: D és A
        document.getElementById('2').innerHTML = document.getElementById('2').innerHTML.replace(' 🟢C🟢', ' C');
        // És az A-t hozzuk be (vissza)
        document.getElementById('3').innerHTML = document.getElementById('3').innerHTML.replace(' D', ' 🟢D🟢');

        document.getElementById('0').innerHTML = document.getElementById('0').innerHTML.replace(' A', ' 🟢A🟢');
    }
    if (time === 0) {
        document.getElementById('remainingTime').innerHTML = 0;
        document.getElementById('winter').innerHTML = `Tél: <br>${givenMissions[3]()+givenMissions[0]()} pont`;
        localStorage.saveWinterPoints = givenMissions[3]() + givenMissions[0]();
        allPoints += givenMissions[3]() + givenMissions[0]() + getHegyKorbeKeritesPoints();
        document.getElementById('counter').innerHTML = `Összesen: ${allPoints} pont`;
        localStorage.saveAllPoints = allPoints;
        localStorage.clear() // játék végén törlöm a mentett állapotokat
    }



}