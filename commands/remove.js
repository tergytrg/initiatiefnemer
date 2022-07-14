const init = require('../init-list');

module.exports = {
    name: 'remove',
    description: '\`!remove <naam>\` : Verwijder een rol van initiative.',
    execute(msg, args) {
        if (args.length != 1) {
            msg.reply("dit herken ik niet. Stuur zoiets: \`!remove <naam>\`");
        } else {
            msg.reply(init.remove(args[0]));
        }
        init.update();
    },
  };