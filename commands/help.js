module.exports = {
    name: 'help',
    description: 'Lijst met commando\'s',
    execute(msg) {
        const init = "\`!init <bonus> <naam> <k1>\` : Maakt een initiative roll.\n"
        const start = "\`!start\` : Start de initiative.\n"
        const view = "\`!view\` : Stuurt de initiative lijst.\n"
        const insert = "\`!insert <rol> <bonus> <naam>\` : Voeg handmatig een rol toe aan initiative.\n"
        const remove = "\`!remove <positie>\` : Verwijder een rol van initiative.\n"
        const reset = "\`!reset\` : Reset de initiative lijst.\n"
        msg.channel.send("**__Speel commands:__**\n" + init + start + "\n**__Admin commands:__** \n" + view + insert + remove + reset);
    },
  };