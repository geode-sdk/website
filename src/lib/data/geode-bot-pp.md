Last updated: 2026-09-08

### What data does the bot collect?

The Geode bot stores messages upon interactions with them or saved copies of them of another user (on the official Geode server, only staff and some trusted community members). The collected data includes:

- interaction user ID,
- interacted message ID, channel ID, author ID, contents (text, attachments, embeds, components),
- interacted message's message reference (reply) ID, author ID, text content.

### Why does the bot need this data?

- The bot needs to be able to save messages to display them later as "quotes".
- All of the saved data is displayed inside embeds using publicly accessible commands.
- Some of this data is aggregated and displayed in leaderboards.

### Does the bot share data with other third parties?

No, the Geode bot does not share data with any third parties.

### How can I contact the Developer if I have questions or concerns?

You can contact the Developer by joining the official Geode Discord server and mentioning or messaging [@cwonfig](https://discordapp.com/users/357517231854190592) (357517231854190592) on Discord.

### What if I want to remove my data from the bot?

- You can delete user data for a single quote using `/privacy redact` and for all current and future quotes using `/privacy opt-out`. These will remove any data that belongs to you, such as your user ID and message contents, and replace it with generic placeholder text.
- If you made a mistake or wish to allow other users to quote you again, you can use `/privacy unredact` and `/privacy opt-in` to restore as much of the deleted data as possible by fetching it from Discord again.
- If you have issues with deleting your user data, you can contact the Developer by following the instructions above.