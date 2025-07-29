const {
	Client,
	GatewayIntentBits,
	Collection,
	Partials,
} = require('discord.js');
const path = require('path');
require('dotenv').config();

// Import handlers
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const { loadButtons } = require('./handlers/buttonHandler');
const { loadModals } = require('./handlers/modalHandler');

// Import utilities
const logger = require('./utils/logger');

// Create client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages, // i forgot this ngl
	],
	partials: [Partials.Channel, Partials.Message],
});

// Create collections for commands and interactions
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

// Load all handlers
async function initializeBot() {
	try {
		logger.info('Loading commands...');
		await loadCommands(client);

		logger.info('Loading events...');
		await loadEvents(client);

		logger.info('Loading button handlers...');
		await loadButtons(client);

		logger.info('Loading modal handlers...');
		await loadModals(client);

		logger.info('Bot initialization complete!');
	} catch (error) {
		logger.error('Error during bot initialization:', error);
		process.exit(1);
	}
}

// Initialize and login
initializeBot().then(() => {
	client.login(process.env.DISCORD_TOKEN);
});

// Global error handling
process.on('unhandledRejection', (error) => {
	logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
	logger.error('Uncaught exception:', error);
	process.exit(1);
});

module.exports = client;
