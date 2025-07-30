const logger = require('../../utils/logger');
const {
	createModmailEmbed,
	createResponseEmbed,
} = require('../../utils/embedBuilder');
const modmailConfig = require('../../config/modmail-config.json');
const fs = require('fs');
const path = require('path');
const sessionsDir = path.resolve(__dirname, '../../data');
const sessionsPath = path.join(sessionsDir, 'modmail-sessions.json');

module.exports = {
	customId: 'modmail_close',
	async execute(interaction) {
		const sessions = { users: {}, channels: {} };
		if (fs.existsSync(sessionsPath)) {
			try {
				const data = fs.readFileSync(sessionsPath, 'utf8');
				Object.assign(sessions, JSON.parse(data));
			} catch (err) {
				logger.error(
					'Failed to parse modmail-sessions.json, resetting file.'
				);
				sessions.users = {};
				sessions.channels = {};
			}
		}
		const userId = sessions.channels[interaction.channel.id];
		if (!userId) {
			await interaction.reply({
				embeds: [
					createResponseEmbed(
						'Error',
						'This channel is not associated with any user.\nClosing the channel in 5 seconds.',
						'#ff4a4a'
					),
				],
				ephemeral: true,
			});
			// close the channel pls
			setTimeout(() => {
				interaction.channel
					.delete()
					.catch((err) =>
						logger.error('Failed to delete channel:', err)
					);
			}, 5000);
		}

		const user = await interaction.client.users.fetch(userId);
		if (!user) {
			await interaction.reply({
				embeds: [
					createResponseEmbed(
						'Error',
						'The user associated with this modmail channel could not be found.',
						'#ff4a4a'
					),
				],
				ephemeral: true,
			});
		}

		await interaction.reply({
			embeds: [
				createResponseEmbed(
					'Closing ModMail Session',
					`Channel will be deleted in 5 seconds. Notifying \`${user.tag}\`...\``,
					'#ff4a4a'
				),
			],
			ephemeral: true,
		});

		await user.send({
			embeds: [
				createResponseEmbed(
					'ModMail Session Closed',
					`The modmail session has been closed.`,
					'#ff4a4a',
					{
						footer: 'ModMail System',
						footerIcon: interaction.guild.iconURL(),
						timestamp: true,
					}
				),
			],
		});

		// remove the session from the sessions file
		delete sessions.users[userId];
		delete sessions.channels[interaction.channel.id];
		fs.writeFileSync(
			sessionsPath,
			JSON.stringify(sessions, null, 2),
			'utf8'
		);
		logger.info(`Closed modmail session for user ${user.tag} (${userId})`);

		// delete the channel after 5 seconds
		setTimeout(() => {
			interaction.channel
				.delete()
				.catch((err) => logger.error('Failed to delete channel:', err));
		}, 5000);
	},
};
