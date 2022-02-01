const init = require('../init-list');

module.exports = {
    name: 'insert',
    description: 'Een roll aan de lijst toevoegen.',
    execute(msg, args) {
        if (args.length != 3) {
            msg.reply("dit herken ik niet. Stuur zoiets:\`!insert <rol> <bonus> <naam>\`");
        } else {
            init.Insert(new init.Inititative(args[0], args[1], " " + args[2]));
            msg.reply("initiative toegevoegd: " + args.toString());
        }
    },
};
  