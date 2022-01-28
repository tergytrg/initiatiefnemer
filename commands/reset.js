const init = require('../init-list');

module.exports = {
    name: 'reset',
    description: 'De lijst leegmaken',
    execute(msg) {
        init.List.length = 0;
        msg.reply("initiative leegemaakt!")
    },
};