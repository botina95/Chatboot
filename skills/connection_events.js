module.exports = function(controller) {

  controller.on('hello', function(bot, message) {

    // a new session with an unknown user has begun
    bot.reply(message, 'Hola, bienvenido a FabiBoot, en que te puedo ayudar?');

  });

  controller.on('welcome_back', function(bot, message) {

    // a known user has started a new, fresh session
   bot.reply(message, 'Bienvenido de nuevo a FabiBoot, en que te puedo ayudar?');

  });

  controller.on('reconnect', function(bot, message) {

    // the connection between the client and server experienced a disconnect/reconnect
    bot.reply(message, 'Some sub-space interference just caused our connection to be interrupted. But I am back now.');

  });


}
