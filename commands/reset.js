const init = require('../init-list');

module.exports = {
    name: 'reset',
    description: 'Reset de initiative lijst.',
    execute(msg) {
        init.List.length = 0;
        msg.reply("initiative leegemaakt!")
    },
};