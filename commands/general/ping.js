const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const start = Date.now();
		await interaction.reply({ content: 'Pinging...' });
		const latency = Date.now() - start;
		const apiLatency = Math.round(interaction.client.ws.ping);

		await interaction.editReply(
			`🏓 Pong!\n📡 **API Latency:** ${apiLatency}ms\n⏱️ **Bot Latency:** ${latency}ms`
		);
	},
};
