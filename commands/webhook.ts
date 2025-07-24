export default function webhookCommand(message: Message) {
  if ("send" in message.channel) {
    message.channel.send("Webhook command executed!");
  }
}
