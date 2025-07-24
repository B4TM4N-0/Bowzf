import { Client, GatewayIntentBits } from "discord.js";
import webhookCommand from "./commands/webhook";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // <-- This is required!
  ],
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", message => {
  if (message.content === "!webhook") {
    webhookCommand(message);
  }
});

client.login(process.env.DISCORD_TOKEN);
