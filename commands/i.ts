import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  Interaction,
  GuildTextBasedChannel,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('i')
  .setDescription('Embed + channel dropdown + modal');

export async function execute(interaction: ChatInputCommandInteraction) {
  const channels = interaction.guild?.channels.cache
    .filter(c => c.isTextBased() && c.viewable)
    .map(c => ({
      label: c.name,
      value: c.id,
    }))
    .slice(0, 25);

  if (!channels || channels.length === 0) {
    return interaction.reply({ content: '❌ No accessible text channels found.', ephemeral: true });
  }

  const embed = new EmbedBuilder()
    .setTitle('Select a Channel')
    .setDescription('Pick a text channel from the dropdown.');

  const select = new StringSelectMenuBuilder()
    .setCustomId('channelSelect')
    .setPlaceholder('Choose a channel')
    .addOptions(channels);

  const dropdownRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('confirm').setLabel('Confirm').setStyle(ButtonStyle.Success)
  );

  await interaction.reply({
    embeds: [embed],
    components: [dropdownRow, buttons],
    ephemeral: true,
  });
}

export async function handleInteraction(interaction: Interaction) {
  if (interaction.isButton()) {
    if (interaction.customId === 'cancel') {
      await interaction.update({ content: '❌ Cancelled.', components: [], embeds: [] });
    }

    if (interaction.customId === 'confirm') {
      const modal = new ModalBuilder()
        .setCustomId('inputModal')
        .setTitle('Enter Details')
        .addComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('modalTitle')
              .setLabel('Title')
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('modalContent')
              .setLabel('Content')
              .setStyle(TextInputStyle.Paragraph)
          )
        );

      await interaction.showModal(modal);
    }
  }

  if (interaction.isModalSubmit() && interaction.customId === 'inputModal') {
    const title = interaction.fields.getTextInputValue('modalTitle');
    const content = interaction.fields.getTextInputValue('modalContent');
    const selectedChannelId = interaction.message?.components?.[0]?.components?.[0]?.data?.options?.[0]?.value;

    const embed = new EmbedBuilder().setTitle(title).setDescription(content);

    await interaction.reply({ content: '✅ Message prepared!', ephemeral: true });

    const selectedChannel = await interaction.guild?.channels.fetch(selectedChannelId || '');

    if (selectedChannel?.isTextBased()) {
      await selectedChannel.send({ embeds: [embed] });
    }
  }
  }
