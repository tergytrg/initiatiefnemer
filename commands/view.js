const init = require('../init-list');

module.exports = {
    name: 'view',
    description: '\`!view\` : Stuurt de initiative lijst met nummertjes ervoor.',
    execute(msg) {
        if (init.List.length == 0) {
            return msg.reply("geen initiatives");
        }
        let resString = "";
        for (let i = 0; i < init.List.length; i++) {
            resString += i + ": " + init.List[i].toString() + "\n";
        }
        msg.channel.send(resString);
    },
};