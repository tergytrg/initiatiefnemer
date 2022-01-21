require('dotenv').config(); // Voor tokentje
const { timeStamp } = require('console');
const { channel } = require('diagnostics_channel');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection(); // Commandos extern opslaan
const clientCommands = require('./commands');

Object.keys(clientCommands).map(key => {
  client.commands.set(clientCommands[key].name, clientCommands[key]);
});

const TOKEN = process.env.TOKEN;
client.login(TOKEN);

let iRolls = [];
let index = 0;

function Inititative(total, bonus, user) { // Init constructor
  this.total = total;
  this.bonus = bonus;
  this.user = user;
}

Inititative.prototype.toString = function() {
  return "\n" + this.user + ": " + this.total + " (waarvan bonus: " + this.bonus + ")";
}

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
  if (command === 'init') {
    const roll = Math.ceil(Math.random() * 20);
    const bonus = parseInt(args[0]);
    const total = roll + bonus;
    msg.channel.send(msg.author + " heeft gerold: " + roll + " + " + bonus + " = " + total);
    iRolls[index++] = new Inititative(total, bonus, msg.author); // nieuw ding maken en toevoegen
  }

  if (command === 'igen') {
    let channel;
    try {
      channel = client.channels.get("933891892117143593"); // Specifiek initiative kanaaltje is wel handig.
      channel.send("Totale initiatives: " + iRolls.toString());
    } catch (error) {
      msg.channel.send("Totale initiatives: " + iRolls.toString()); // Als hij het kanaal niet kan vinden, dan stuurt ie het gewoon in hetzelfde kanaal als waar commando verzonden is.
    }
    iRolls = [];
    index = 0;
  }

  if (command === 'iclear') {
    iRolls = [];
    index = 0;
  }

  if (!client.commands.has(command)) return; // Dit is voor alle "simpele" commands

  try {
    client.commands.get(command).execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply("Ik weet het ff niet meer");
  }
});
