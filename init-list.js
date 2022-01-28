function Inititative(total, bonus, user) { // Init constructor
    this.total = total;
    this.bonus = bonus;
    this.user = user;
}

Inititative.prototype.toString = function() {
    return this.user + ": \`" + this.total + "\`";
}

const initList = []; // Het hart van deze bot: De lijst met initiatives

function insertInit(newInit) { // Een nieuwe Initiative invoegen
    if (initList.length == 0) {
        initList[0] = newInit;
    } else {
        let i = 0;
        while (
            i < initList.length &&
            newInit.total <= initList[i].total &&
            (newInit.total < initList[i].total || newInit.bonus < initList[i].bonus)) { // Als de total roll gelijk is, sorteert ie op bonus
            i++; // Insertion sort ftw!!!!
        }
        initList.splice(i, 0, newInit); // Invoegen
    }
}

// het meest gebruikte commando; de init roll:
function roll(args, user) {
    const roll1 = Math.ceil(Math.random() * 20);
    let bonus = 0;
    let roller = "";
    let k1 = false;

    while (args.length > 0) { // Alle args bijlangs gaan en kijken wat ze doen
        const arg = args.shift();
        if (arg == "k1") {
            k1 = true;
        } else if (isNaN(arg)) {
            roller += " " + arg;
        } else {
            bonus = parseInt(arg);
        }
    }
    if (roller === "") {
        roller = " " + user; // Als er geen naam bij zit, wordt de stuurder genoemd.
    }
    // Met advantage:
    if (k1) {
        const roll2 = Math.ceil(Math.random() * 20); // Dus nog een dobbelsteen gooien
        let total = roll2;
        if (roll1 > roll2) {
            total = roll1;
        }
        total += bonus;
        insertInit(new Inititative(total, bonus, roller)); // nieuw ding maken en toevoegen
        return roller + " heeft gerold: [" + roll1 + ",  " + roll2 + "] + " + bonus + " = \`" + total + "\`";
    }
    // Zonder advantage:
    const total = roll1 + bonus;
    insertInit(new Inititative(total, bonus, roller)); // nieuw ding maken en toevoegen
    return roller + " heeft gerold: " + roll1 + " + " + bonus + " = \`" + total + "\`";
}

module.exports = {
    List: initList,
    Insert: insertInit,
    Roll: roll,
    Inititative: Inititative,
};