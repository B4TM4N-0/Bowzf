import { Message } from "discord.js";

export default function webhookCommand(message: Message) {
  if (!message.guild || message.author.bot) return;

  if (message.channel && message.channel.isTextBased()) {
    message.channel.send("✅ Webhook command executed!");
  }
}
