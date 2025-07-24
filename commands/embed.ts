import { Message, EmbedBuilder } from "discord.js";

export default async function handleEmbedCommand(message: Message) {
  if (message.author.bot) return;

  const matches = message.content.match(/"([^"]+)"\s+"([^"]+)"/);
  if (!matches) {
    return message.reply('Dumbass u spelled it wrong nigga');
  }

  const title = matches[1];
  const description = matches[2];

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(0x00AEFF)
    .setFooter({ text: `Embed by ${message.author.username}` });

  if (message.channel.isTextBased()) {
  await message.channel.send({ embeds: [embed] });
  }
}
