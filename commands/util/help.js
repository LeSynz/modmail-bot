const {
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows help information about the bot'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('🤖 Bot Help')
			.setDescription(
				'This is a Discord.js v14 bot template with comprehensive handlers!'
			)
			.addFields(
				{
					name: '📋 General Commands',
					value: '`/ping` - Check bot latency\n`/help` - Show this help message',
				},
				{
					name: '🔧 Utility Commands',
					value: '`/example` - Example command with button\n`/modal-example` - Example modal command',
				},
				{
					name: '🔗 Features',
					value: '• Recursive command loading\n• Button interactions\n• Modal interactions\n• Event handling\n• Error handling',
				}
			)
			.setColor('#0099FF')
			.setFooter({ text: 'Bot Template v1.0' })
			.setTimestamp();

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('help_refresh')
				.setLabel('🔄 Refresh')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('help_support')
				.setLabel('💬 Support')
				.setStyle(ButtonStyle.Secondary)
		);

		await interaction.reply({ embeds: [embed], components: [row] });
	},
};
