import { Message, TextChannel } from "discord.js";

export default function webhookCommand(message: Message) {
  if (!message.guild || message.author.bot) return;

  if (message.channel.isTextBased() && "send" in message.channel) {
    (message.channel as TextChannel).send("✅ Webhook command executed!");
  }
}
