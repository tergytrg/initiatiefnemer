const init = require('../init-list');

module.exports = {
    name: 'custom',
    description: '\`!custom <rol zonder bonus> <bonus> <naam>\` : Voeg handmatig een custom rol toe aan initiative.',
    execute(msg, args) {
        if (args.length < 3) {
            msg.reply("dit herken ik niet. Stuur zoiets:\`!custom <rol zonder bonus> <bonus> <naam>\`");
        } else {
            msg.channel.send(init.custom(args));
        }
        init.update();
    },
};
  