const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js')
const functions = require('../utils/functions')
const config = require('../../config/config')

module.exports = {
    permission: 'ADMINISTRATOR',
    data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Send a panel message to a channel! (Administrator Only)')
    .addSubcommand(o=>
        o.setName('verify')
        .setDescription('Send a verify message to a channel!')
        .addChannelOption(o => 
            o.setName('channel')
            .setDescription('Select a Channel')
            .setRequired(true)))
    .addSubcommand(o=>
        o.setName('autoroles')
        .setDescription('Send a autoroles message to a channel!')
        .addChannelOption(o => 
            o.setName('channel')
            .setDescription('Select a Channel')
            .setRequired(true)))
    .addSubcommand(o=>
        o.setName('tickets')
        .setDescription('Send a ticket message to a channel!')
        .addChannelOption(o => 
            o.setName('channel')
            .setDescription('Select a Channel')
            .setRequired(true))),

    async run(client, interaction) {
        const channel = interaction.options.getChannel('channel')
        if (interaction.options.getSubcommand() === 'verify') {
            channel.send({ embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Verification System').setColor(config.bot.design.color)
                .setDescription('`🔐` **Special Button'+` |** React to get the role <@&${config.bot.roles.user}>`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-default']).setThumbnail(config.bot.icon)
                .setTimestamp()], components: [ new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('verify')
                            .setLabel('Verify')
                            .setStyle('SUCCESS'),
                    )]})
            interaction.reply({
                    embeds: [ new MessageEmbed()
                        .setAuthor({
                            name: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL({dynamic: true})
                        }).setTitle('Verification message').setColor('GREEN')
                        .setDescription(`I sussesfuly send the verify message to ${channel}`)
                        .setFooter({
                            text: config.name,
                            iconURL: config.bot.icon
                        })
                        .setImage(config.bot.design['line-green'])
                        .setTimestamp()]
                , ephemeral: true})
            return functions.log('Verify', interaction.user, `New verify messages was sended`, {
                    name: '• Information',
                    value: `> Sender: ${interaction.user}\n> Channel: ${channel}`
            })
        } else if (interaction.options.getSubcommand() === 'autoroles') {
            channel.send({ embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Autorole System').setColor(config.bot.design.color)
                .setDescription('`🔔` **Ping Roles '+`|** Select your custom rol to get the nottifications, you can remove the rol later. If you not have a designed role you dont recieve the nottifications...\n\n**<@&${config.bot.roles.auto.spoilers}> Notification**\n> Get all spoilers in the server\n> Select to get the custom rol\n\n**<@&${config.bot.roles.auto.giveaways}> Notification**\n> Get the notifications for a special giveaway\n> Select to get the custom rol\n\n**<@&${config.bot.roles.auto.events}> Notification**\n> Get all notifications for special events in the server\n> Select to get the custom rol\n\nMore autoroles will be added in the future`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-default'])
                .setTimestamp()], components: [ new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('autoroles')
                            .setPlaceholder('Select to get a role !')
                            .setMaxValues(1)
                            .addOptions([
                                {
                                    label: 'Spoilers',
                                    value: 'spoilers',
                                    description: 'Get a spoiler role to recieve spoiler nottifications',
                                    emoji: '👀',
                                },
                                {
                                    label: 'Giveaways',
                                    value: 'giveaways',
                                    description: 'Get a giveaways role to recieve giveaways nottifications',
                                    emoji: '🎁'
                                },
                                {
                                    label: 'Events',
                                    value: 'events',
                                    description: 'Get a events role to recieve events nottifications',
                                    emoji: '📅'
                                }
                            ])
                        )
                    ]})
            interaction.reply({
                    embeds: [ new MessageEmbed()
                        .setAuthor({
                             name: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL({dynamic: true})
                        }).setTitle('Autoroles sussesfuly').setColor('GREEN')
                        .setDescription(`I sussesfuly send the autoroles message to ${channel}`)
                        .setFooter({
                            text: config.name,
                            iconURL: config.bot.icon
                        })
                        .setImage(config.bot.design['line-green'])
                        .setTimestamp()]
                , ephemeral: true})
            return functions.log('Autoroles', interaction.user, `New autorole messages was sended`, {
                name: '• Information',
                value: `> Sender: ${interaction.user}\n> Channel: ${channel}`
            })
        } else if (interaction.options.getSubcommand() === 'tickets') {
            channel.send({ embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Tickets System').setColor(config.bot.design.color)
                .setDescription('`🎫` **Select Category '+`|** Select your category to create a ticket and get support from our <@&${config.bot.roles.staff}> and <@&${config.bot.roles.headstaff}> team\n\n**(`+'`💳`'+`) Ranks Category**\n> Get special support from our staff team\n> for ranks problem reasons\n\n**(`+'`✨`'+`) Applies Category**\n> Get special support from our staff team\n> for staff applies reasons\n\n**(`+'`🚨`'+`) Reports Category**\n> Get special support from our staff team\n> for reports staff/user reasons\n\n**(`+'`👮`'+`) Head Category**\n> Get special support from our head staff team\n> for owners reasons or more attention\n\n**(`+'`💻`'+`) General Category**\n> Get normal support from our staff/head team\n> its for normal reasons and not have priority\n\nCreate innecesary tickets have a sanction!`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-default'])
                .setTimestamp()], components: [ new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('tickets')
                            .setPlaceholder('Select to create a ticket !')
                            .setMaxValues(1)
                            .addOptions([
                                {
                                    label: 'Ranks',
                                    value: 'ranks',
                                    description: 'Resolve your problems with ranks or create to buy one',
                                    emoji: '💳',
                                },
                                {
                                    label: 'Applies',
                                    value: 'applies',
                                    description: 'Information for all types of Applies, and results',
                                    emoji: '✨'
                                },
                                {
                                    label: 'Reports',
                                    value: 'reports',
                                    description: 'Report a staff, users and server problems / bugs',
                                    emoji: '🚨'
                                },
                                {
                                    label: 'Head',
                                    value: 'head',
                                    description: 'Get head support, Owners attentions for special sittuations',
                                    emoji: '👮'
                                },
                                {
                                    label: 'General',
                                    value: 'general',
                                    description: 'Get support for others sittuations',
                                    emoji: '💻'
                                }
                            ])
                        )
                    ]})
            interaction.reply({
                    embeds: [ new MessageEmbed()
                        .setAuthor({
                             name: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL({dynamic: true})
                        }).setTitle('Tickets sussesfuly').setColor('GREEN')
                        .setDescription(`I sussesfuly send the tickets message to ${channel}`)
                        .setFooter({
                            text: config.name,
                            iconURL: config.bot.icon
                        })
                        .setImage(config.bot.design['line-green'])
                        .setTimestamp()]
                , ephemeral: true})
            return functions.log('Tickets', interaction.user, `New tickets messages was sended`, {
                name: '• Information',
                value: `> Sender: ${interaction.user}\n> Channel: ${channel}`
            })
        }
    }
}