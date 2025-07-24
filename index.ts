import { Client, GatewayIntentBits } from "discord.js";


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



client.login(process.env.DISCORD_TOKEN);
