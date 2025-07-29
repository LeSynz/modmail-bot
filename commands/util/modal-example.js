const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('modal-example')
		.setDescription('Example command that demonstrates modal interactions'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('example_modal')
			.setTitle('Example Modal');

		const nameInput = new TextInputBuilder()
			.setCustomId('name_input')
			.setLabel('What is your name?')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Enter your name here')
			.setRequired(true)
			.setMaxLength(50);

		const feedbackInput = new TextInputBuilder()
			.setCustomId('feedback_input')
			.setLabel('Feedback')
			.setStyle(TextInputStyle.Paragraph)
			.setPlaceholder('Tell us what you think about this bot!')
			.setRequired(false)
			.setMaxLength(1000);

		const firstRow = new ActionRowBuilder().addComponents(nameInput);
		const secondRow = new ActionRowBuilder().addComponents(feedbackInput);

		modal.addComponents(firstRow, secondRow);

		await interaction.showModal(modal);
	},
};
