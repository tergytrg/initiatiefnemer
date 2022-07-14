const Init = require('./init');
const New = require('./new');
const View = require('./view');
const Custom = require('./custom');
const Remove = require('./remove');

module.exports = {
    name: 'help',
    description: 'Lijst met commando\'s',
    execute(msg) {
        msg.channel.send(
            "**__Speel commands:__**\n" + 
            New.description + "\n" + Init.description + "\n" +
            "\n**__Admin commands:__** \n" +
            View.description + "\n" + Custom.description + "\n" + Remove.description);
    },
  };