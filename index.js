require('dotenv').config(); // Voor tokentje
const { timeStamp } = require('console');
const { channel } = require('diagnostics_channel');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection(); // Commandos extern opslaan
const clientCommands = require('./commands');
const rol = require('./commands/rol');

Object.keys(clientCommands).map(key => {
  client.commands.set(clientCommands[key].name, clientCommands[key]);
});

const TOKEN = process.env.TOKEN;
const CHANNEL = process.env.CHANNEL;
client.login(TOKEN);

let iRolls = [];
let index = 0;

function Inititative(total, bonus, user) { // Init constructor
  this.total = total;
  this.bonus = bonus;
  this.user = user;
}

Inititative.prototype.toString = function() {
  return this.user + ": \`" + this.total + "\`\n";
}

function iInsert(newRoll) {
  if (iRolls.length == 0) {
    iRolls[0] = newRoll;
  } else {
    let i = 0;
    while (
      i < iRolls.length 
      && newRoll.total <= iRolls[i].total
      && (newRoll.total < iRolls[i].total || newRoll.bonus < iRolls[i].bonus)) { // Als de total roll gelijk is, sorteert ie op bonus
      i++; // Insertion sort ftw!!!!
    }
    iRolls.splice(i, 0, newRoll); // Invoegen
    i = 0;
  }
}

// het meest gebruikte commando; de init roll:
function roll(args, user) {
  const roll1 = Math.ceil(Math.random() * 20);
  let bonus = 0;
  let roller = user // Als er geen naam bij zit, wordt de stuurder genoemd.
  let k1 = false;

  while (args.length > 0) {
    const arg = args.shift();
    if (arg == "k1") {
      k1 = true;
    } else if (isNaN(arg)) {
      roller = arg;
    } else {
      bonus = parseInt(arg);
    }
  }

  if (k1) {
    const roll2 = Math.ceil(Math.random() * 20);
    let total = roll2;
    if (roll1 > roll2) {
      total = roll1;
    }
    total += bonus;
    iInsert(new Inititative(total, bonus, roller)); // nieuw ding maken en toevoegen
    return roller + " heeft gerold: [" + roll1 + ",  " + roll2 + "], + " + bonus + " = " + total;
  }

  const total = roll1 + bonus;
  iInsert(new Inititative(total, bonus, roller)); // nieuw ding maken en toevoegen
  return roller + " heeft gerold: " + roll1 + " + " + bonus + " = " + total;
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
   * Ik heb wel wat andere bestandjes gemaakt voor simpele commando's, hier kunnen we dan makkelijk aan toevoegen */ 


  // De meestgebruikte commando: Een initiative check.
  if (command === 'init') {
    if (args.length > 3) {
      msg.reply("Dit herken ik niet. Stuur zoiets: \`!init <bonus> <naam> <k1>\`");
      return;
    }
    msg.channel.send(roll(args, msg.author));
  }

  // De initiative lijst opvragen:
  if (command === 'start') {
    let channel;
    try {
      channel = client.channels.get(CHANNEL); // Specifiek initiative kanaaltje is wel handig.
      channel.send("**__Initiative gestart:__**:\n" + iRolls.toString());
    } catch (error) {
      msg.channel.send("**__Initiative gestart:__**\n" + iRolls.toString()); // Als hij het kanaal niet kan vinden, dan stuurt ie het gewoon in hetzelfde kanaal als waar commando verzonden is.
    }
    iRolls = [];
    index = 0;
  }


  // De inititative lijst leegmaken:
  if (command === 'reset') {
    iRolls = [];
    index = 0;
    msg.reply("Initiative leegemaakt!")
  }

  if (command === 'view') {
    if (iRolls.length == 0) {
      return msg.reply("Geen initiatives");
    }
    let resString = "";
    for (let i = 0; i < iRolls.length; i++) {
      resString += i + ": " + iRolls[i].toString();
    }
    msg.channel.send(resString);
  }

  if (command === 'remove') {
    if (args.length != 1) {
      msg.reply("Dit herken ik niet. Stuur zoiets: \`!remove <positie>\`");
    } else {
      iRolls.splice(parseInt(args[0]), 1);
      msg.reply("Rol " + args[0] + " verwijderd!");
    }
  }

  if (command === 'insert') {
    if (args.length != 3) {
      msg.reply("Dit herken ik niet. Stuur zoiets:\`!insert <rol> <bonus> <naam>\`");
    } else {
      iInsert(new Inititative(args[0], args[1], args[2]));
      msg.reply("Initiative toegevoegd: " + args.toString());
    }
  }

  if (command === 'help') {
    const init = "\`!init <bonus> <naam> <k1>\` : maakt een initiative roll.\n"
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
    msg.reply("Ik weet het ff niet meer");
  }
});
