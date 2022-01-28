const init = require('../init-list');

module.exports = {
    name: 'start',
    description: 'Initiative starten',
    execute(msg, args, channel) {
        let resString = "**__Initiative gestart:__**";
        if (init.List.length == 0) {
            resString = "Geen initiatives";
        } else {
            for (let i = 0; i < init.List.length; i++) {
                resString += "\n" + init.List[i].toString();
            }
        }
        msg.reply("Initiative gestart!")
        channel.send(resString);
    },
  };