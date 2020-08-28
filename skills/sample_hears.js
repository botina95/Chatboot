module.exports = function(controller) {
  controller.hears("Hola", "message_received", function(bot, message) {
    bot.reply(message, {
      text: "Hola, ¿Como te encuentras el dia de hoy?",
      typingDelay: 3000
    });
  });

  controller.hears("covid", "message_received", function(bot, message) {
    bot.reply(message, {
      text:
        "Actualmente no manejamos covid en este chat, para ello usar claraboot",
      typingDelay: 3000
    });
  });

  controller.hears("Gracias", "message_received", function(bot, message) {
    bot.reply(message, {
      text: "De nada, estoy para servirte",
      typingDelay: 3000
    });
    bot.reply(message, {
      text: "¿Te puedo ayudar en algo mas?",
      typingDelay: 5000
    });
  });

  controller.hears("emssanar", "message_received", function(bot, message) {
    bot.reply(message, {
      text: "Soy un robot programado para emssanar",
      typingDelay: 3000
    });
  });

  controller.hears("no", "message_received", function(bot, message) {
    bot.reply(message, {
      text: "Perfecto, fue un gusto atenderte.",
      typingDelay: 3000
    });
  });

  controller.hears("bien", "message_received", function(bot, message) {
    bot.reply(message, {
      text: "Me agrada saberlo.",
      typingDelay: 3000
    });
  });
};
