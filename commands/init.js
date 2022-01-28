const init = require('../init-list');

module.exports = {
    name: 'init',
    description: 'Een nieuwe Initiative rollen',
    execute(msg, args) {
        msg.channel.send(init.Roll(args, msg.author));
    },
  };