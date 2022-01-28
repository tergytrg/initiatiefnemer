const init = require('../init-list');

module.exports = {
    name: 'remove',
    description: 'Een roll uit de lijst verwijderen.',
    execute(msg, args) {
        if (args.length != 1) {
            msg.reply("dit herken ik niet. Stuur zoiets: \`!remove <positie>\`");
        } else {
            init.List.splice(parseInt(args[0]), 1);
            msg.reply("rol " + args[0] + " verwijderd!");
        }
    },
  };