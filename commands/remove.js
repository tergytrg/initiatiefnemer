const init = require('../init-list');

module.exports = {
    name: 'remove',
    description: '\`!remove <naam>\` : Verwijder een rol van initiative.',
    execute(msg, args) {
        msg.reply(init.remove(args));
        init.update();
    },
  };