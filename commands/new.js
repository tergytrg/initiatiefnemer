const init = require('../init-list');

module.exports = {
    name: 'new',
    description: '\`!new\` : Maakt een nieuwe initiative.',
    execute(msg) {
        msg.reply("Initiative gestart!");
        init.new();
    },
  };