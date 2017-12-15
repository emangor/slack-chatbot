config = {
    serviceName: process.env.SERVICENAME || 'Slack Chatbot Review',
    port: process.env.PORT || 3000,
    loggerLevel: 'info',
    slack: {
        token: process.env.SLACK_BOT_TOKEN || '',
        userid: process.env.SLACK_USER_ID || '',
        channel: process.env.SLACK_CHANNEL_ID || '',
        botName: process.env.SLACK_BOT_NAME || '',
        botId: process.env.SLACK_BOT_ID || '',
        groupName: process.env.SLACK_GROUP_NAME || ''
    }
}

module.exports = config;
