const init = require('../init-list');

module.exports = {
    name: 'custom',
    description: '\`!custom <rol zonder bonus> <bonus> <naam>\` : Voeg handmatig een custom rol toe aan initiative.',
    execute(msg, args) {
        if (args.length != 3) {
            msg.reply("dit herken ik niet. Stuur zoiets:\`!insert <rol zonder bonus> <bonus> <naam>\`");
        } else {
            total = parseInt(args[0]) + parseInt(args[1]);
            init.Insert(new init.Inititative(total, parseInt(args[1]), " " + args[2]));
            msg.reply("custom toegevoegd: " + args[0] + " + " + args[1] + " = " + total + ", voor: " + args[2]);
        }
        init.Update();
    },
};
  