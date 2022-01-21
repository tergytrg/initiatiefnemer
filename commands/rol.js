module.exports = {
  name: 'rol',
  description: 'Simpele d20',
  execute(msg, args) {
    msg.channel.send('Je hebt gerold: ' + Math.ceil(Math.random() * 20));
  },
};