require('dotenv').config();
const { Events, ChannelType } = require('discord.js');
const logger = require('../utils/logger');
const {
	createModmailEmbed,
	createResponseEmbed,
} = require('../utils/embedBuilder');
const modmailConfig = require('../config/modmail-config.json');
const fs = require('fs');
const path = require('path');
const sessionsDir = path.resolve(__dirname, '../data');
const sessionsPath = path.join(sessionsDir, 'modmail-sessions.json');

console.log('messageCreate event loaded');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) {
			console.log('Ignoring bot message');
			return;
		}

		if (message.channel.type === ChannelType.DM) {
			logger.info(
				`Received DM from ${message.author.tag}: ${message.content}`
			);
			const guildId = process.env.GUILD_ID;
			const guild = message.client.guilds.cache.get(guildId);
			if (!guild) return logger.error('Guild not found.');

			const modmailCategory = guild.channels.cache.get(
				modmailConfig.categoryId
			);
			if (!modmailCategory)
				return logger.error('Modmail category not found.');

			// Load sessions safely
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

			let channel;
			// Check if user already has a session
			if (sessions.users[message.author.id]) {
				const channelId = sessions.users[message.author.id];
				channel = guild.channels.cache.get(channelId);
				// If channel doesn't exist (maybe deleted), remove session and create new
				if (!channel) {
					delete sessions.users[message.author.id];
					delete sessions.channels[channelId];
				}
			}

			// If no channel found, create a new one
			if (!channel) {
				logger.info(
					`Creating new modmail channel for ${message.author.tag}`
				);
				channel = await guild.channels.create({
					name: `modmail-${message.author.tag}`,
					type: ChannelType.GuildText,
					parent: modmailCategory.id,
					topic: `Modmail channel for ${message.author.tag}`,
					permissionOverwrites: [
						{
							id: guild.roles.everyone, // Deny everyone
							deny: ['ViewChannel'],
						},
						// Staff roles will be added below
					],
				});
				// Allow staff roles
				for (const roleId of modmailConfig.staffRoleIds) {
					const role = guild.roles.cache.get(roleId);
					if (role) {
						await channel.permissionOverwrites.create(role, {
							ViewChannel: true,
							SendMessages: true,
							ReadMessageHistory: true,
						});
					}
				}
				await channel.send({
					embeds: [
						createModmailEmbed(
							'New ModMail Channel',
							`This channel has been created for modmail with \`${message.author.tag}\`.`,
							'#606cf4',
							{
								footer: 'ModMail System',
								footerIcon: guild.iconURL(),
								timestamp: true,
							}
						),
					],
				});

				message.author.send({
					embeds: [
						createResponseEmbed(
							'Modmail Session Started',
							`Your modmail session has been started. You can now send messages here.`,
							'#86f986',
							{
								footer: 'ModMail System',
								footerIcon: guild.iconURL(),
								timestamp: true,
							}
						),
					],
				});

				// Update sessions
				sessions.users[message.author.id] = channel.id;
				sessions.channels[channel.id] = message.author.id;
				fs.writeFileSync(
					sessionsPath,
					JSON.stringify(sessions, null, 2)
				);
			}

			// Send the user's message to the modmail channel
			await channel.send({
				embeds: [
					createModmailEmbed(
						'ModMail Message',
						`\`${message.author.tag}\` (${message.author.id}):\n${message.content}`,
						'#606cf4',
						{
							footer: 'ModMail System',
							footerIcon: guild.iconURL(),
							timestamp: true,
						}
					),
				],
			});

			logger.success(
				`Forwarded message from ${message.author.tag} to modmail channel`
			);
		}
	},
};
