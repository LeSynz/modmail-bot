const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { createResponseEmbed } = require('../../utils/embedBuilder');
const configDir = path.resolve(__dirname, '../../config');
const configPath = path.join(configDir, 'modmail-config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('modmail-config')
		.setDescription('Configure the ModMail system')
		.addChannelOption((option) =>
			option
				.setName('category')
				.setDescription('Select the category for modmail channels')
				.setRequired(true)
				.addChannelTypes(4)
		)
		.addRoleOption((option) =>
			option
				.setName('staff-role')
				.setDescription('Select the role for staff members')
				.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		const category = interaction.options.getChannel('category');
		const staffRole = interaction.options.getRole('staff-role');

		let config = { categoryId: '', staffRoleIds: [] };
		if (fs.existsSync(configPath)) {
			config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		}

		config.categoryId = category.id;
		if (!config.staffRoleIds.includes(staffRole.id)) {
			config.staffRoleIds.push(staffRole.id);
		}

		fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

		const embed = createResponseEmbed(
			'ModMail Configuration Updated',
			`Category set to <#${category.id}>\nStaff role set to ${staffRole.name}`,
			'#86f986ff',
			{
				footer: 'ModMail Configuration',
				footerIcon: interaction.guild.iconURL(),
				timestamp: true,
				thumbnail: interaction.guild.iconURL(),
			}
		);

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};
