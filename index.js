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
    let channel;
    try { // Voor !start (initiative kanaal)
        channel = client.channels.get(CHANNEL); // Als hij het kanaal niet kan vinden, dan stuurt ie het gewoon in hetzelfde kanaal als waar commando verzonden is.
    } catch (error) {
        channel = msg.channel;
    }
    const args = content.split(/ +/);
    const command = args.shift().toLowerCase();
    console.info(`Commando: ${command}`);

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(msg, args, channel);
    } catch (error) {
        console.error(error);
        msg.reply("ik weet het ff niet meer");
    }
});