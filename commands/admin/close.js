const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
const {
	createResponseEmbed,
	createModmailEmbed,
} = require('../../utils/embedBuilder');
const fs = require('fs');
const path = require('path');
const sessionsDir = path.resolve(__dirname, '../../data');
const sessionsPath = path.join(sessionsDir, 'modmail-sessions.json');
const logger = require('../../utils/logger');
const modmailConfig = require('../../config/modmail-config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close')
		.setDescription('Close the current modmail session'),
	async execute(interaction) {
		// check staff role
		const staffRoleIds = modmailConfig.staffRoleIds;
		if (
			!interaction.member.roles.cache.some((role) =>
				staffRoleIds.includes(role.id)
			)
		) {
			return interaction.reply({
				embeds: [
					createResponseEmbed(
						'Permission Denied',
						'You do not have permission to use this command.',
						'#ff4a4a'
					),
				],
				ephemeral: true,
			});
		}

		// load sessions at the start
		let sessions = { users: {}, channels: {} };
		if (fs.existsSync(sessionsPath)) {
			try {
				const data = fs.readFileSync(sessionsPath, 'utf8');
				sessions = data
					? JSON.parse(data)
					: { users: {}, channels: {} };
			} catch (err) {
				logger.error(
					'Failed to parse modmail-sessions.json, resetting file.'
				);
				sessions = { users: {}, channels: {} };
			}
		}

		// check if modmail channel using session file
		if (!sessions.channels[interaction.channel.id]) {
			await interaction.reply({
				embeds: [
					createResponseEmbed(
						'Error',
						'This command can only be used in a modmail channel.',
						'#ff4a4a'
					),
				],
			});
			return;
		}
		// send close confirmation embed with the button
		const embed = createModmailEmbed(
			'Close ModMail Session',
			'Are you sure you want to close this modmail session? This action cannot be undone.',
			'#ff4a4a',
			{
				footer: 'ModMail System',
				footerIcon: interaction.guild.iconURL(),
				timestamp: true,
				thumbnail: interaction.guild.iconURL(),
			}
		);
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('modmail_close')
				.setLabel('Close Session')
				.setStyle(ButtonStyle.Danger)
		);
		await interaction.reply({
			embeds: [embed],
			components: [row],
		});
	},
};
