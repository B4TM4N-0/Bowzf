import { Message } from "discord.js";

export default function webhookCommand(message: Message) {
  message.channel.send("Webhook command executed!");
}
