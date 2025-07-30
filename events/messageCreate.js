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

		// load sessions at the start - i lowkey fucked this up in the last commit <3
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

			let channel;
			if (sessions.users[message.author.id]) {
				const channelId = sessions.users[message.author.id];
				channel = guild.channels.cache.get(channelId);
				if (!channel) {
					delete sessions.users[message.author.id];
					delete sessions.channels[channelId];
				}
			}

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
							id: guild.roles.everyone,
							deny: ['ViewChannel'],
						},
					],
				});
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

				sessions.users[message.author.id] = channel.id;
				sessions.channels[channel.id] = message.author.id;
				fs.writeFileSync(
					sessionsPath,
					JSON.stringify(sessions, null, 2)
				);
			}

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

		// check if message is in a modmail channel, if so then dm it to the user associated to the channel.
		if (message.channel.parentId === modmailConfig.categoryId) {
			const userId = sessions.channels[message.channel.id];
			if (!userId) {
				logger.error(
					`No user found for modmail channel ${message.channel.id}`
				);

				await message.channel.send({
					embeds: [
						createResponseEmbed(
							'Error',
							'This modmail channel is not associated with any user.',
							'#ff4a4a',
							{
								footer: 'ModMail System',
								footerIcon: message.guild.iconURL(),
								timestamp: true,
							}
						),
					],
				});
			}
			const user = await message.client.users.fetch(userId);
			if (!user) {
				logger.error(`User not found for ID ${userId}`);

				await message.channel.send({
					embeds: [
						createResponseEmbed(
							'Error',
							'The user associated with this modmail channel could not be found.',
							'#ff4a4a',
							{
								footer: 'ModMail System',
								footerIcon: message.guild.iconURL(),
								timestamp: true,
							}
						),
					],
				});
			}
			await user.send({
				embeds: [
					createResponseEmbed(
						'New ModMail Message',
						`New message from \`${message.author.tag}\` (${message.author.id})\n${message.content}`,
						'#606cf4'
					),
				],
			});
			logger.success(
				`Forwarded message from modmail channel ${message.channel.id} to user ${user.tag}`
			);
			await message.channel.send({
				embeds: [
					createResponseEmbed(
						'Message Sent',
						`Your message has been sent to ${user.tag}.`,
						'#86f986',
						{
							footer: 'ModMail System',
							footerIcon: message.guild.iconURL(),
							timestamp: true,
						}
					),
				],
			});
		}
	},
};
