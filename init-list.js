const initList = []; // Het hart van deze bot: De lijst met initiatives
let initMsg;
let initChannel;
let lastUpdated = Date.now();

function Inititative(total, bonus, name) { // Init constructor
    this.total = total;
    this.bonus = bonus;
    this.name = name;
}

Inititative.prototype.toString = function() {
    return this.name + ": \`" + this.total + "\`";
}

function setChannel(channel) {
    initChannel = channel;
}

/*
Voegt de roll toe aan de lijst en maakt het bericht om terug te sturen.
*/
function init(args, user) {
    const rollList = initParser(args, user);
    let initiative = rollList[0];
    let stringOutput = initiative.name + " heeft gerold: \`[" + (initiative.total - initiative.bonus);
    if (rollList.length > 1) {
        stringOutput += ", " + (rollList[1].total - rollList[1].bonus);
        if (rollList[1].total > rollList[0].total) {
            initiative = rollList[1];
        }
    }
    insertInitiative(initiative);
    stringOutput += "]\` Resultaat: " + initiative.total;
    return stringOutput;
}

/*
Gebruikt insertion sort om een Initiative op de goede plek toe te voegen aan de lijst.
Als de roll een gelijke totale score heeft, wordt er op bonus gesorteerd.
*/
function insertInitiative(initiative) {
    if (initList.length == 0) {
        initList[0] = initiative;
        return;
    }
    let i = 0;
    while (
        i < initList.length &&
        initiative.total <= initList[i].total &&
        (initiative.total < initList[i].total || initiative.bonus < initList[i].bonus)) {
        i++;
    }
    initList.splice(i, 0, initiative);
}

/*
Gaat langs alle arguments nadat iemand '!init' heeft gebruikt. Dan checkt ie of er advantage
is, of er een naam is, en of er een bonus is. Als er geen naam is, wordt de discord-naam
van de gebruiker gebruikt.
*/
function initParser(args, user) {
    let bonus = 0;
    let name = "";
    let k1 = false;

    while (args.length > 0) {
        const arg = args.shift();
        if (arg == "k1") {
            k1 = true;
        } else if (isNaN(arg)) {
            name += " " + arg;
        } else {
            bonus = parseInt(arg);
        }
    }
    if (name === "") {
        name = " " + user;
    }
    return rollInit(bonus, k1, name);
}

/*
Genereert wilekeurig de uitkomst en geeft vervolgens een lijst van Initiative.
*/
function rollInit(bonus, advantage, name) {
    const roll = Math.ceil(Math.random() * 20) + bonus;
    const rollList = [];
    rollList.push(new Inititative(roll, bonus, name));
    if (advantage) {
        const secondRoll = Math.ceil(Math.random() * 20) + bonus;
        rollList.push(new Inititative(secondRoll, bonus, name));
    }
    return rollList;
}

/*
Updatet het bericht met de complete lijst.
*/
async function update() {
    lastUpdated = Date.now();
    let resString = "**__Initiative gestart:__**";
    for (let i = 0; i < initList.length; i++) {
        resString += "\n" + initList[i].toString();
    }
    try {
        initMsg.edit(resString);
    } catch (error) {
        initMsg = await initChannel.send(resString);
    }
}

/*
Maakt een nieuwe lijst.
*/
async function newInit() {
    initMsg = await initChannel.send("**__Nieuwe Initiative gestart!__**");
    initList.length = 0;
    lastUpdated = 0;
}

function isFresh() {
    if (Date.now() - lastUpdated < 1800000 || lastUpdated == 0) {
        return true;
    }
    return false;
}

module.exports = {
    isFresh: isFresh,
    setChannel: setChannel,
    roll: init,
    update: update,
    new: newInit
};