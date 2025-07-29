const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('example')
		.setDescription(
			'Example command that demonstrates button interactions'
		),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('🎮 Interactive Example')
			.setDescription(
				'Click the buttons below to test the button handler!'
			)
			.setColor('#00FF00')
			.setTimestamp();

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('example_primary')
				.setLabel('Primary Button')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('example_secondary')
				.setLabel('Secondary Button')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('example_success')
				.setLabel('Success Button')
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId('example_danger')
				.setLabel('Danger Button')
				.setStyle(ButtonStyle.Danger)
		);

		await interaction.reply({ embeds: [embed], components: [row] });
	},
};
