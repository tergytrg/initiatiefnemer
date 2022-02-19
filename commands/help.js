module.exports = {
    name: 'help',
    description: 'Lijst met commando\'s',
    execute(msg) {
        const newInit = "\`!new\` : Maakt een nieuwe initiative.\n";
        const init = "\`!init <bonus> <naam> <k1>\` : Maakt een initiative roll.\n";
        const view = "\`!view\` : Stuurt de initiative lijst met nummertjes ervoor.\n";
        const custom = "\`!custom <rol zonder bonus> <bonus> <naam>\` : Voeg handmatig een custom rol toe aan initiative.\n";
        const remove = "\`!remove <positie>\` : Verwijder een rol van initiative.\n";
        msg.channel.send(
            "**__Speel commands:__**\n" + 
            newInit + init + 
            "\n**__Admin commands:__** \n" +
            view + custom + remove);
    },
  };