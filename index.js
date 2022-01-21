require('dotenv').config(); // Voor tokentje
const {timeStamp} = require('console');
const {channel} = require('diagnostics_channel');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection(); // Commandos extern opslaan
const clientCommands = require('./commands');

Object.keys(clientCommands).map(key => {
    client.commands.set(clientCommands[key].name, clientCommands[key]);
});

const TOKEN = process.env.TOKEN;
const CHANNEL = process.env.CHANNEL;
client.login(TOKEN);

function Inititative(total, bonus, user) { // Init constructor
    this.total = total;
    this.bonus = bonus;
    this.user = user;
}

Inititative.prototype.toString = function() {
    return this.user + ": \`" + this.total + "\`";
}

let initList = []; // Het hart van deze bot: De lijst met initiatives

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
            roller += arg + " ";
        } else {
            bonus = parseInt(arg);
        }
    }
    if (roller === "") {
        roller = user; // Als er geen naam bij zit, wordt de stuurder genoemd.
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

// Zodra de bot opstart:
client.on('ready', () => {
    console.info(`Ingelogd als ${client.user.tag}!`);
});

// Zodra wij een berichtje krijgen: 
client.on('message', msg => {
    let content;
    if (msg.content.charAt(0) == '!') { // Even zorgen dat alles met een ! begint
        content = msg.content.substring(1); // En dan de ! weghalen
    } else {
        return; // Of hij begint niet met een ! :(
    }
    const args = content.split(/ +/);
    const command = args.shift().toLowerCase();
    console.info(`Bericht: ${command}`);

    /* De commands die bepaalde dingen nodig hebben, zoals de init-lijst, heb ik hier gewoon met if-else uitgeschreven
     * Zijn ook maar een paar als het goed is, en ik weet niet hoe ik het anders moet doen.
     * Ik heb wel wat andere bestandjes gemaakt voor simpele commando's, hier kan ik dan makkelijk aan toevoegen */


    // De meestgebruikte commando: Een initiative check.
    if (command === 'init') {
        msg.channel.send(roll(args, msg.author));
    }

    // De initiative starten:
    if (command === 'start') {
        let resString = "**__Initiative gestart:__**";
        if (initList.length == 0) {
            resString = "Geen initiatives";
        } else {
            for (let i = 0; i < initList.length; i++) {
                resString += "\n" + initList[i].toString();
            }
        }
        let channel;
        try {
            channel = client.channels.get(CHANNEL); // Specifiek initiative kanaaltje is wel handig.
            channel.send(resString);
        } catch (error) {
            msg.channel.send(resString); // Als hij het kanaal niet kan vinden, dan stuurt ie het gewoon in hetzelfde kanaal als waar commando verzonden is.
        }
        initList = [];
    }


    // De inititative lijst leegmaken:
    if (command === 'reset') {
        initList = [];
        msg.reply("initiative leegemaakt!")
    }

    // De initiative lijst bekijken:
    if (command === 'view') {
        if (initList.length == 0) {
            return msg.reply("geen initiatives");
        }
        let resString = "";
        for (let i = 0; i < initList.length; i++) {
            resString += i + ": " + initList[i].toString() + "\n";
        }
        msg.channel.send(resString);
    }

    // Iets verwijderen uit de initiative lijst
    if (command === 'remove') {
        if (args.length != 1) {
            msg.reply("dit herken ik niet. Stuur zoiets: \`!remove <positie>\`");
        } else {
            initList.splice(parseInt(args[0]), 1);
            msg.reply("rol " + args[0] + " verwijderd!");
        }
    }

    // Iets toevoegen aan de initiative lijst
    if (command === 'insert') {
        if (args.length != 3) {
            msg.reply("dit herken ik niet. Stuur zoiets:\`!insert <rol> <bonus> <naam>\`");
        } else {
            insertInit(new Inititative(args[0], args[1], args[2]));
            msg.reply("initiative toegevoegd: " + args.toString());
        }
    }

    // Alle commando's met uitleg
    if (command === 'help') {
        const init = "\`!init <bonus> <naam> <k1>\` : Maakt een initiative roll.\n"
        const start = "\`!start\` : Start de initiative.\n"
        const view = "\`!view\` : Stuurt de initiative lijst.\n"
        const insert = "\`!insert <rol> <bonus> <naam>\` : Voeg handmatig een rol toe aan initiative.\n"
        const remove = "\`!remove <positie>\` : Verwijder een rol van initiative.\n"
        const reset = "\`!reset\` : Reset de initiative lijst.\n"
        msg.channel.send("**__Speel commands:__**\n" + init + start + "\n**__Admin commands:__** \n" + view + insert + remove + reset)
    }

    // Alle andere simpele commandos (uit ander bestandje):
    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply("ik weet het ff niet meer");
    }
});