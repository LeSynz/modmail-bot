const { Events } = require('discord.js');
const { handleButtonInteraction } = require('../handlers/buttonHandler');
const { handleModalInteraction } = require('../handlers/modalHandler');
const logger = require('../utils/logger');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Handle slash commands
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(
				interaction.commandName
			);

			if (!command) {
				logger.warn(
					`No command matching ${interaction.commandName} was found.`
				);
				return;
			}

			try {
				await command.execute(interaction);
				logger.info(
					`Command executed: ${interaction.commandName} by ${interaction.user.tag}`
				);
			} catch (error) {
				logger.error(
					`Error executing command ${interaction.commandName}:`,
					error
				);

				const errorMessage =
					'There was an error while executing this command!';

				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: errorMessage,
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content: errorMessage,
						ephemeral: true,
					});
				}
			}
		}
		// Handle button interactions
		else if (interaction.isButton()) {
			await handleButtonInteraction(interaction);
		}
		// Handle modal interactions
		else if (interaction.isModalSubmit()) {
			await handleModalInteraction(interaction);
		}
		// Handle autocomplete interactions
		else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(
				interaction.commandName
			);

			if (!command || !command.autocomplete) {
				return;
			}

			try {
				await command.autocomplete(interaction);
			} catch (error) {
				logger.error(
					`Error executing autocomplete for ${interaction.commandName}:`,
					error
				);
			}
		}
	},
};
