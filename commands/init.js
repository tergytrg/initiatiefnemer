const init = require('../init-list');

module.exports = {
    name: 'init',
    description: '\`!init <bonus> <naam> <k1>\` : Maakt een initiative roll.',
    execute(msg, args) {
        if (!init.isFresh()) {
            msg.channel.send("**Pas op!**\nJe bent nu rolls aan een oude initiative aan het toevoegen. Je kunt een nieuwe initiative maken met !new");
        }
        msg.channel.send(init.Roll(args, msg.author));
        init.Update();
    },
  };