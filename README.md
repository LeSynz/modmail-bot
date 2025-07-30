# Synz ModMail Bot

A modern, open-source Discord ModMail bot template built with [discord.js](https://discord.js.org/).

---

## Features

- Slash command support for configuration and session management
- Button and modal interactions
- Easy configuration via commands or JSON
- Staff role and category management
- Persistent modmail sessions
- Customizable embeds and logging
- **Planned:** Transcript saving for modmail sessions

---

## Setup

### 1. Clone the Repository

```sh
git clone https://github.com/lesynz/modmail-bot.git
cd modmail-bot
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your bot token, client ID, and guild ID:

```sh
cp .env.example .env
```

Edit `.env`:

```
DISCORD_TOKEN=your_token_here
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
```

- Get your bot token and client ID from the [Discord Developer Portal](https://discord.com/developers/applications).
- `GUILD_ID` is your server's ID.

### 4. Configure ModMail

You can configure the modmail category and staff roles using the `/modmail-config` slash command in Discord (requires Administrator permission):

- `/modmail-config category:<category> staff-role:<role>`

Alternatively, edit [`config/modmail-config.json`](config/modmail-config.json) manually:

```json
{
  "categoryId": "YOUR_CATEGORY_ID",
  "staffRoleIds": ["STAFF_ROLE_ID_1", "STAFF_ROLE_ID_2"]
}
```

### 5. Start the Bot

```sh
npm start
```

For development with auto-reload:

```sh
npm run dev
```

---

## Usage

### How ModMail Works

- **Users** DM the bot to start a modmail session.
- The bot creates a private channel in the configured category for staff to communicate with the user.
- **Staff** can reply in the modmail channel; messages are forwarded to the user's DM.
- Use `/close` in a modmail channel or the "Close Session" button to end the session.

### Commands

#### `/modmail-config`

- **Usage:** `/modmail-config category:<category> staff-role:<role>`
- **Description:** Sets the category for modmail channels and adds a staff role.
- **Permissions:** Administrator only.

#### `/close`

- **Usage:** `/close`
- **Description:** Initiates closing the current modmail session (staff only). Prompts for confirmation with a button.

### Buttons

- **Close Session:** Appears after `/close` is used. Clicking it will close the session, notify the user, and delete the channel after 5 seconds.

### Modals

- Example modal handlers are in [`interactions/modals/`](interactions/modals/). You can add your own for custom workflows.

---

## File Structure

- [`index.js`](index.js): Main entry point.
- [`commands/`](commands/): Slash commands (admin/general/util).
- [`config/modmail-config.json`](config/modmail-config.json): ModMail configuration.
- [`data/modmail-sessions.json`](data/modmail-sessions.json): Persistent session data.
- [`events/`](events/): Discord event handlers.
- [`handlers/`](handlers/): Loader and interaction handlers.
- [`interactions/buttons/`](interactions/buttons/): Button interaction handlers.
- [`interactions/modals/`](interactions/modals/): Modal interaction handlers.
- [`utils/embedBuilder.js`](utils/embedBuilder.js): Embed creation utilities.
- [`utils/logger.js`](utils/logger.js): Colorful logging utility.

---

## Customization

- **Embeds:** Customize embed appearance in [`utils/embedBuilder.js`](utils/embedBuilder.js).
- **Logging:** Adjust log output in [`utils/logger.js`](utils/logger.js).
- **Add More Commands:** Place new command files in [`commands/`](commands/).
- **Add More Buttons/Modals:** Place new handlers in [`interactions/buttons/`](interactions/buttons/) or [`interactions/modals/`](interactions/modals/).

---

## Troubleshooting

- Ensure your bot has the necessary permissions (Manage Channels, Send Messages, etc.).
- Make sure the category and staff roles are set correctly via `/modmail-config`.
- Check the logs in your terminal for errors (color-coded for clarity).

---

## Contributing

Pull requests and issues are welcome!

---

## License

MIT

---

**Author:** LeSynz (synz.xyz)