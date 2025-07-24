import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  Collection,
  Interaction,
} from 'discord.js';
import fs from 'fs';
import path from 'path';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const commandMap = new Collection<string, any>();
const commandsJson: any[] = [];

const load = async () => {
  const commandsPath = path.join(__dirname, 'commands');
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));

  for (const file of files) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if (command.data && command.execute) {
      commandMap.set(command.data.name, command);
      commandsJson.push(command.data.toJSON());
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: commandsJson });
};

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = commandMap.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (e) {
      console.error(e);
      if (!interaction.replied) {
        await interaction.reply({ content: '⚠️ Error.', ephemeral: true });
      }
    }
  }

  if (interaction.isButton() || interaction.isModalSubmit() || interaction.isStringSelectMenu?.()) {
    const handlerOwner = commandMap.get('i');
    if (handlerOwner && typeof handlerOwner.handleInteraction === 'function') {
      try {
        await handlerOwner.handleInteraction(interaction);
      } catch (e) {
        console.error(e);
        if (!interaction.replied) {
          await interaction.reply({ content: '⚠️ Error.', ephemeral: true });
        }
      }
    }
  }
});

(async () => {
  await load();
  await client.login(process.env.DISCORD_TOKEN);
})();
