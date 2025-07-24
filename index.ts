import { Client, GatewayIntentBits, Message } from "discord.js";
import embedCommand from "./commands/embed";

const OWNER_ID = process.env.OWNER_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;
  if (message.author.id !== OWNER_ID) return;
  if (!message.content.startsWith("/")) return;

  const [cmd] = message.content.slice(1).split(" ");

  if (cmd === "embed") {
    await embedCommand(message);
  }
});

client.login(process.env.DISCORD_TOKEN);
