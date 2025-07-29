const { Events, ActivityType } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		logger.success(`Ready! Logged in as ${client.user.tag}`);
		logger.info(`Bot is running in ${client.guilds.cache.size} servers`);

		// Set bot activity
		client.user.setActivity('DMs for ModMail', {
			type: ActivityType.Listening,
		});
	},
};
