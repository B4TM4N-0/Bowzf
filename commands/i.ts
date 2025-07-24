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
  ComponentType,
  EmbedBuilder,
  Interaction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('i')
  .setDescription('Embed + dropdown + modal');

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('Choose an Option')
    .setDescription('Use the dropdown or buttons below');

  const select = new StringSelectMenuBuilder()
    .setCustomId('dropdown')
    .setPlaceholder('Select an option')
    .addOptions([
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
    ]);

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
      await interaction.update({ content: 'Cancelled.', components: [], embeds: [] });
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

    const responseEmbed = new EmbedBuilder().setTitle(title).setDescription(content);
    await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
  }
}
