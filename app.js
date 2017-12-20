const config = require( './config' );
const express = require('express');
const logger = require('./utils/logger');

//create express app
module.exports.express = express;
const app = express();
module.exports.app = app;
const routes = require('./routes');


app.listen(config.port, function () {
    logger.info(`server listening on port: ${config.port}`);
});

if (config.slack.token === '' && config.slack.botName === ''){
    logger.error('missing token and botname');
    return false;
}

//default values
const botData = require('./static/bot.json');
const groupName = config.slack.groupName;
const defaultParams = { "icon_emoji": ":robot_face:" };
let welcomeMessage = '';
let userDisplay = '';
let defaultMessage = '';

const SlackBot = require('slackbots');
// create a bot
const bot = new SlackBot({
   token: config.slack.token,
   name: config.slack.botName
});

// connect/start bot
bot.on('start', function() {
    logger.info('Bot has connected');
});

// listen for messages
bot.on('message', function(data) {
    if (typeof data.channel != 'undefined' && data.channel == config.slack.channel 
    && typeof data.type != 'undefined' && data.type == 'message'
    && typeof data.bot_id == 'undefined'){
        logger.debug(data);
        let message = (typeof data.text == 'string') ? data.text.toLowerCase() : 'help';
        if (typeof data.subtype != 'undefined' && data.subtype =='group_join') {
            if (typeof data.user != 'undefined'){
                bot.getUserById(data.user).then(function(user) {
                    userDisplay = (typeof user.profile.first_name != 'undefined') ? user.profile.first_name : user.profile.display_name;
                    welcomeMessage = getWelcomeMessage(userDisplay);
                    bot.postMessageToGroup(groupName, welcomeMessage, defaultParams);
                });
            }
            return;            
        }
        if (typeof data.user != 'undefined' && typeof data.text != 'undefined' && data.text.indexOf(config.slack.botId) >= 0) {
            allData: for (let i = 0; i < botData.length; i++) {
                keywordsData: for (let x = 0; x < botData[i].keywords.length; x++) {
                    if (message.indexOf(botData[i].keywords[x]) >= 0) {
                        bot.postMessageToGroup(groupName, botData[i].returnmessage, botData[i].params);
                        break allData;
                    }
                }
                if (i === botData.length - 1){
                    bot.getUserById(data.user).then(function(user) {
                        userDisplay = (typeof user.profile.first_name != 'undefined') ? user.profile.first_name : user.profile.display_name;
                        defaultMessage = getDefaultMessage(userDisplay);
                        bot.postMessageToGroup(groupName, defaultMessage, defaultParams);
                    });
                }
            }
        }
    }
});

function getDefaultMessage(userDisplay) {
    return `Hi ${userDisplay}, I am sorry I did not understand you. \n Please type \`\`\`\@erik_review help\`\`\``;
}

function getWelcomeMessage(userDisplay) {
    return `Hello ${userDisplay}, welcome to Erik Mangor's review! :100: \n  Erik is a lead developer for MSS who has been assigned to Cartoon Network. \n He develop's applications and gives guidance to junior developers. Ask \`@erik_review\` some question's about Erik's performance. Remember to tag \`@erik_review\` to get a response :computer:`;
}
