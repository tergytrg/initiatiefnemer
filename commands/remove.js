const init = require('../init-list');

module.exports = {
    name: 'remove',
    description: '\`!remove <positie>\` : Verwijder een rol van initiative.',
    execute(msg, args) {
        if (args.length != 1) {
            msg.reply("dit herken ik niet. Stuur zoiets: \`!remove <positie>\`");
        } else {
            init.List.splice(parseInt(args[0]), 1);
            msg.reply("rol " + args[0] + " verwijderd!");
        }
        init.Update();
    },
  };