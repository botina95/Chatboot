/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var env = require('node-env-file');
env(__dirname + '/.env');


if (!process.env.PORT) {
  console.log('Error: Specify studio_token and PORT in environment');
  usage_tip();
  process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri,
    replyWithTyping: false,
};

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
if (process.env.MONGO_URI) {
    var mongoStorage = require('botkit-storage-mongo')({mongoUri: process.env.MONGO_URI});
    bot_options.storage = mongoStorage;
} else {
    bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.socketbot(bot_options);

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Open the web socket server
controller.openSocketServer(controller.httpserver);

// Start the bot brain in motion!!
controller.startTicking();


var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});

console.log('I AM ONLINE! COME TALK TO ME: http://localhost:' + process.env.PORT)

// This captures and evaluates any message sent to the bot as a DM
// or sent to the bot in the form "@bot message" and passes it to
// Botkit Studio to evaluate for trigger words and patterns.
// If a trigger is matched, the conversation will automatically fire!
// You can tie into the execution of the script using the functions
// controller.studio.before, controller.studio.after and controller.studio.validate
if (process.env.studio_token) {
    controller.on('message_received', function(bot, message) {
        controller.studio.runTrigger(bot, message.text, message.user, message.channel, message).then(function(convo) {
            if (!convo) {
              // web bot requires a response of some kind!
              bot.reply(message,'OK');

                // no trigger was matched
                // If you want your bot to respond to every message,
                // define a 'fallback' script in Botkit Studio
                // and uncomment the line below.
                // controller.studio.run(bot, 'fallback', message.user, message.channel, message);
            } else {
                // set variables here that are needed for EVERY script
                // use controller.studio.before('script') to set variables specific to a script
                convo.setVar('current_time', new Date());
            }
        }).catch(function(err) {
            bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
            debug('Botkit Studio: ', err);
        });
    });
} else {

    //controller.on('message_received', function(bot, message) {
    //  bot.reply(message, 'I need an API token from Botkit Studio to do more stuff. Get one here: https://studio.botkit.ai')
    //});

    //console.log('~~~~~~~~~~');
    //console.log('NOTE: Botkit Studio functionality has not been enabled');
    //console.log('To enable, pass in a studio_token parameter with a token from https://studio.botkit.ai/');
}




function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Botkit Starter Kit');
    console.log('Execute your bot application like this:');
    console.log('PORT=3000 studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js');
    console.log('Get a Botkit Studio token here: https://studio.botkit.ai/')
    console.log('~~~~~~~~~~');
}
