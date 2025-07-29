const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

async function loadButtons(client) {
	const buttonsPath = path.join(__dirname, '..', 'interactions', 'buttons');

	try {
		await fs.access(buttonsPath);

		const buttonFiles = await fs.readdir(buttonsPath);
		const jsFiles = buttonFiles.filter((file) => file.endsWith('.js'));

		logger.info(`Found ${jsFiles.length} button handler files`);

		for (const file of jsFiles) {
			const filePath = path.join(buttonsPath, file);

			try {
				delete require.cache[require.resolve(filePath)];

				const button = require(filePath);

				if (!button.customId || !button.execute) {
					logger.warn(
						`Button file ${file} is missing required properties (customId or execute)`
					);
					continue;
				}

				client.buttons.set(button.customId, button);

				logger.success(`Loaded button: ${button.customId} (${file})`);
			} catch (error) {
				logger.error(`Error loading button from ${file}:`, error);
			}
		}
	} catch (error) {
		if (error.code === 'ENOENT') {
			logger.warn('Buttons directory not found, creating it...');
			await fs.mkdir(buttonsPath, { recursive: true });
		} else {
			logger.error('Error loading buttons:', error);
		}
	}
}

async function handleButtonInteraction(interaction) {
	const button = interaction.client.buttons.get(interaction.customId);

	if (!button) {
		logger.warn(
			`No button handler found for customId: ${interaction.customId}`
		);
		return;
	}

	try {
		await button.execute(interaction);
		logger.info(
			`Button executed: ${interaction.customId} by ${interaction.user.tag}`
		);
	} catch (error) {
		logger.error(`Error executing button ${interaction.customId}:`, error);

		const errorMessage = 'There was an error while executing this button!';

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: errorMessage,
				ephemeral: true,
			});
		} else {
			await interaction.reply({ content: errorMessage, ephemeral: true });
		}
	}
}

async function reloadButton(client, customId) {
	const buttonsPath = path.join(__dirname, '..', 'interactions', 'buttons');

	try {
		const buttonFiles = await fs.readdir(buttonsPath);
		const jsFiles = buttonFiles.filter((file) => file.endsWith('.js'));

		for (const file of jsFiles) {
			const filePath = path.join(buttonsPath, file);

			try {
				delete require.cache[require.resolve(filePath)];
				const button = require(filePath);

				if (button.customId === customId) {
					client.buttons.set(button.customId, button);
					logger.success(`Reloaded button: ${customId}`);
					return true;
				}
			} catch (error) {
				logger.error(`Error reloading button ${customId}:`, error);
			}
		}

		return false;
	} catch (error) {
		logger.error(`Error reloading button ${customId}:`, error);
		return false;
	}
}

module.exports = {
	loadButtons,
	handleButtonInteraction,
	reloadButton,
};
