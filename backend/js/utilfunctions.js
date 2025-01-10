'use strict'

// funzioni ruoli
const sortObjectWithValuesAtEnd = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).sort(([keyA, valueA], [keyB, valueB]) => {
            const hasValueA = valueA != null && valueA !== false;
            const hasValueB = valueB != null && valueB !== false;

            // Sposta le chiavi con valori alla fine
            if (hasValueA && !hasValueB) return 1;
            if (!hasValueA && hasValueB) return -1;

            // Se entrambe o nessuna chiave hanno un valore, ordina alfabeticamente
            return keyA.localeCompare(keyB);
        })
    );
};

// conversione di ruoli e sottoruoli in una stringa del tipo
// Amministratore Studente Docente [Membro del Comitato]
// dove Membro del Comitato è un sottoruolo
function rolesToString(users, key) {
    let usersArray = Object.keys(users).map(key => {
        return users[key];
    })

    usersArray.sort(function (a, b) {
        return a[key] - b[key]
    })

    let firstRow = {}
    let rows = []
    let role = null
    let sub = ''
    let obj = {}
    let i = -1
    let roleObj = {}

    usersArray.forEach((user) => {
        // se firstRow è diverso da user, lo si aggiunge 
        // all'array da ritornare
        if (firstRow[key] != user[key]) {
            firstRow = structuredClone(user)
            rows.push(firstRow)

            // vengono spostate in fondo i ruoli con
            // sottoruoli
            obj = sortObjectWithValuesAtEnd(obj)

            // generazione della stringa contenente ruoli e sottoruoli
            let ruoloStringa = ''
            for (let item in obj) {
                ruoloStringa += ' - ' + item

                if (obj[item])
                    ruoloStringa += ' [' + obj[item] + ']'
            }

            // assegnazione stringa all'oggetto
            if (i >= 0) {
                rows[i].ruolo = ruoloStringa.trimStart()
            }
            i++

            // console.log('oggetto ruoli: ', obj)
            // console.log('ROWS: ', rows)
            // console.log('\n')
            // arrayObj.push(obj)
            obj = {}
        }

        // generazione dell'oggetto
        role = user.ruolo
        sub = user.subruolo

        if (obj[role] == undefined)
            obj[role] = sub
        else
            obj[role] += ', ' + sub
    })

    // aggiunta del ruolo all'ultimo elemento
    obj = sortObjectWithValuesAtEnd(obj)
    // arrayObj.push(obj)ù

    let ruoloStringa = ''
    for (let item in obj) {
        ruoloStringa += ' - ' + item

        if (obj[item])
            ruoloStringa += ' [' + obj[item] + ']'
    }

    if (i >= 0) {
        rows[i].ruolo = ruoloStringa
        // console.log('Stringa: ', ruoloStringa)

        rows[i].ruolo = rows[i].ruolo.slice(3, rows[i].ruolo.length)
    }

    return rows
}

// function processUserRolesString(users, campokey) {
//     console.log('utenti: ', users)

//     let prou = []
//     for (let u in users) {
//         // console.log('u: ', users[0])
//         let pu = users[0]
//         pu[campokey] = u
//         delete pu.ruolo
//         delete pu.subruolo
//         pu.ruolo = processRolesToString(users[u])

//         prou.push(pu)
//     }
//     console.log('prou: ', prou)
//     return prou
// }

// function processRolesToString(u) {
//     if (u.subruolo != '')
//         return u.ruolo + ' [' + u.subruolo + ']'
//     else
//         return u.ruolo
// }

module.exports = { rolesToString }