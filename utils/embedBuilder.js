const { EmbedBuilder } = require('discord.js');

/**
 * Creates a reusable embed for modmail messages.
 * @param {string} title - The title of the embed.
 * @param {string} description - The description or content of the embed.
 * @param {string} [color='#5865F2'] - The color of the embed (default is Discord's blurple).
 * @param {Object} [options] - Additional options for the embed.
 * @param {string} [options.footer] - Footer text for the embed.
 * @param {string} [options.footerIcon] - Footer icon URL for the embed.
 * @param {boolean} [options.timestamp=true] - Whether to include a timestamp.
 * @param {string} [options.thumbnail] - Thumbnail URL for the embed.
 * @param {string} [options.author] - Author name for the embed.
 * @param {string} [options.authorIcon] - Author icon URL for the embed.
 * @returns {EmbedBuilder} - The constructed embed.
 */
function createModmailEmbed(
	title,
	description,
	color = '#5865F2',
	options = {}
) {
	const embed = new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
		.setColor(color);

	if (options.footer) {
		embed.setFooter({
			text: options.footer,
			iconURL: options.footerIcon,
		});
	}

	if (options.timestamp !== false) {
		embed.setTimestamp();
	}

	if (options.thumbnail) {
		embed.setThumbnail(options.thumbnail);
	}

	if (options.author) {
		embed.setAuthor({
			name: options.author,
			iconURL: options.authorIcon,
		});
	}

	return embed;
}

/**
 * Creates a normal response embed for general bot responses.
 * @param {string} title - The title of the embed.
 * @param {string} description - The description or content of the embed.
 * @param {string} [color='#00FF00'] - The color of the embed (default is green).
 * @param {Object} [options] - Additional options for the embed.
 * @param {Array} [options.fields] - Array of field objects with name, value, and inline properties.
 * @param {string} [options.footer] - Footer text for the embed.
 * @param {boolean} [options.timestamp=true] - Whether to include a timestamp.
 * @returns {EmbedBuilder} - The constructed embed.
 */
function createResponseEmbed(
	title,
	description,
	color = '#00FF00',
	options = {}
) {
	const embed = new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
		.setColor(color);

	if (options.fields && Array.isArray(options.fields)) {
		embed.addFields(options.fields);
	}

	if (options.footer) {
		embed.setFooter({ text: options.footer });
	}

	if (options.timestamp !== false) {
		embed.setTimestamp();
	}

	return embed;
}

module.exports = {
	createModmailEmbed,
	createResponseEmbed,
};
