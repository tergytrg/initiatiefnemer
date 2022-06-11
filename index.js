require('dotenv').config(); // Voor tokentje
const {timeStamp} = require('console');
const {channel} = require('diagnostics_channel');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection(); // Commandos extern opslaan
const clientCommands = require('./commands');
const init = require('./init-list');

Object.keys(clientCommands).map(key => {
    client.commands.set(clientCommands[key].name, clientCommands[key]);
});

const TOKEN = process.env.TOKEN;
const CHANNEL = process.env.CHANNEL;
client.login(TOKEN);

// Zodra de bot opstart:
client.on('ready', () => {
    console.info(`Ingelogd als ${client.user.tag}!`);

    client.user.setPresence({
        activities: [{ 
          name: "D&D",
          type: "PLAYING"
        }],
        status: "online"
    });

    try {
        init.setChannel(client.channels.get(CHANNEL));
    } catch (error) {
        console.log(error);
    }
});

// Zodra wij een berichtje krijgen: 
client.on('message', msg => {
    let content;
    if (!msg.content.charAt(0) == '!') {
        return;
    }
    content = msg.content.substring(1); // En dan de ! weghalen
    const args = content.split(/ +/);
    const command = args.shift().toLowerCase();
    console.info(`Commando: ${command}`);
    if (!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply("ik weet het ff niet meer");
    }
});