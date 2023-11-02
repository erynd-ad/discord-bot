const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js')
const config = require('../../config/config')
const functions = require('./functions')
const client = require('../../index')
const discordTranscripts = require('discord-html-transcripts');
const ticketdb = require('../../models/ticketdb')

async function openTicket (interaction, type) {
    if (!['Ranks', 'Applies', 'Reports', 'Head', 'General'].includes(type)) return interaction.reply({
        embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Tickets Error').setColor('RED')
                .setDescription(`The ${type} ticket type doesnt exist...`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
    , ephemeral: true})
    const ticket = await ticketdb.findOne({
        owner: interaction.user.id,
        status: true
    })
    if (ticket) return interaction.reply({
        embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Already Ticket').setColor('RED')
                .setDescription('You have already a open ticket...')
                .setFields({
                    name: '• Information',
                    value: `> Type: ${ticket.type}\n> Status: ${ticket.status ? 'Open' : 'Closed'}\n> Staff: ${client.users.cache.has(ticket.staff) ? client.users.cache.get(ticket.staff) : 'None'}\n> Owner: ${client.users.cache.has(ticket.owner) ? client.users.cache.get(ticket.owner) : ticket.owner}\n> Channel: <#${ticket.id}>`
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
    , ephemeral: true})
    const createChannel = await client.guilds.cache.get(config.bot.guild).channels.create(`open-${interaction.user.username}`.toLowerCase(), {
        type: 'text',
        topic: `${interaction.user} please have patient and do not tag`,
        parent: config.bot.channels.categories.tickets,
        permissionOverwrites: [
            {
                allow: 'VIEW_CHANNEL',
                id: interaction.user.id
            },
            {
                deny: 'VIEW_CHANNEL',
                id: config.bot.guild
            },
            {
                allow: 'VIEW_CHANNEL',
                id: ((type === 'Head') ? config.bot.roles.headstaff : config.bot.roles.staff)
            }
        ]
    })
    createChannel.send(
        { content: `<@&${(type === 'Head') ? config.bot.roles.headstaff : config.bot.roles.staff}>, ${interaction.user} was created a new ticket.`,
        embeds: [ new MessageEmbed()
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({dynamic: true})
            }).setTitle('`🎫` '+`${config.name}`+' Ticket (#New)').setColor(config.bot.design.color)
            .setDescription(`Please explain what's the problem so staffs can help you, also be patient and don't tag the staff. You can close the ticket reacting to the button...`)
            .addFields({
                name: '• Information',
                value: `> Ticket type: ${type}\n> Owner: ${interaction.user}`
            })
            .setFooter({
                text: config.name,
                iconURL: config.bot.icon
            })
            .setImage(config.bot.design['line-default']).setThumbnail(config.bot.icon)
            .setTimestamp()]
    , components: [ new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('close')
                .setLabel('Close Ticket')
				.setStyle('DANGER'),
		).addComponents(
			new MessageButton()
				.setCustomId('claim')
                .setLabel('Claim Ticket')
				.setStyle('PRIMARY'))]})
    interaction.reply({ embeds: [ new MessageEmbed()
        .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL({dynamic: true})
        }).setTitle('Created Ticket').setColor('GREEN')
        .setDescription(`I sussesfuly created ticket on ${createChannel}`)
        .setFooter({
            text: config.name,
            iconURL: config.bot.icon
        })
        .setImage(config.bot.design['line-green'])
        .setTimestamp()]
    , ephemeral: true})
    functions.log('New ticket', interaction.user, `New ticket was been created`, {
        name: '• Information',
        value: `> Owner: ${interaction.user}\n> Type: ${type}\n> Channel: ${createChannel}`
    })
    newticket = new ticketdb({
        id: createChannel.id,
        owner: interaction.user.id,
        type: type,
        status: true
    })
    await newticket.save()
}

async function closeTicket (interaction) {
    const ticket = await ticketdb.findOne({
        id: interaction.message.channel.id
    })
    if (!ticket) return interaction.reply({
        embeds: [ new MessageEmbed()
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({dynamic: true})
            }).setTitle('Not a ticket').setColor('RED')
            .setDescription('I only can close a ticket channels...')
            .setFooter({
                text: config.name,
                iconURL: config.bot.icon
            })
            .setImage(config.bot.design['line-red'])
            .setTimestamp()]
    , ephemeral: true})
    if (!ticket.status) return interaction.reply({
        embeds: [ new MessageEmbed()
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({dynamic: true})
            }).setTitle('Already Closed').setColor('RED')
            .setDescription('This ticket is already closed...')
            .setFields({
                name: '• Information',
                value: `> Type: ${ticket.type}\n> Status: ${ticket.status ? 'Open' : 'Closed'}\n> Owner: ${client.users.cache.has(ticket.owner) ? client.users.cache.get(ticket.owner) : ticket.owner}\n> Channel: <#${ticket.id}>`
            })
            .setFooter({
                text: config.name,
                iconURL: config.bot.icon
            })
            .setImage(config.bot.design['line-red'])
            .setTimestamp()]
    , ephemeral: true})
    if ((interaction.user.id === ticket.owner)
    || client.guilds.cache.get(config.bot.guild).members.cache.get(interaction.user.id).roles.cache.has(((ticket.type === 'Head') ? config.bot.roles.headstaff : config.bot.roles.staff))) {
        interaction.message.channel.permissionOverwrites.set([
            {
                deny: 'VIEW_CHANNEL',
                id: interaction.message.guild.id
            },
            {
                allow: 'VIEW_CHANNEL',
                id: ((ticket.type === 'Head') ? config.bot.roles.headstaff : config.bot.roles.staff)
            }
        ])
        const attachment = await discordTranscripts.createTranscript(interaction.message.channel, {
            limit: -1,
            returnBuffer: false,
            fileName: 'transcript.html',
            minify: true,
            saveImages: true,
            useCDN: false
        })
		await ticket.updateOne({
            status: false
        })
        await ticket.save()
		await interaction.message.channel.setName(`closed-${client.users.cache.has(ticket.owner) ? client.users.cache.get(ticket.owner).username : ticket.owner}`)
		functions.log('Closed Ticket', interaction.user, `A ticket has been closed`, {
            name: '• Information',
            value: `> Type: ${ticket.type}\n> Status: ${ticket.status ? 'Open' : 'Closed'}\n> Staff: ${client.users.cache.has(ticket.staff) ? client.users.cache.get(ticket.staff) : 'None'}\n> Owner: ${client.users.cache.has(ticket.owner) ? client.users.cache.get(ticket.owner) : ticket.owner}\n> Closer: ${interaction.user}\n> Channel: <#${ticket.id}>`
        }, attachment)
        interaction.message.channel.send({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('`🎫` '+`${config.name}`+' Ticket (#Closed)').setColor(config.bot.design.color)
                .setDescription(`The ticket was closed by ${interaction.user}, here is the channel transcript. I send the transcript to the logs channel, respective staff and a ticket creator`)
                .addFields({
                    name: '• Information',
                    value: `> Type: ${ticket.type}\n> Status: ${ticket.status ? 'Open' : 'Closed'}\n> Staff: ${client.users.cache.has(ticket.staff) ? client.users.cache.get(ticket.staff) : 'None'}\n> Owner: ${client.users.cache.has(ticket.owner) ? client.users.cache.get(ticket.owner) : ticket.owner}\n> Closer: ${interaction.user}\n> Channel: <#${ticket.id}>`
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-default']).setThumbnail(config.bot.icon)
                .setTimestamp()], components: [ new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('delete')
                            .setLabel('Delete Ticket')
                            .setStyle('DANGER'))]})
        if (client.users.cache.has(ticket.owner)) {
            client.users.cache.get(ticket.owner).send({
                embeds: [ new MessageEmbed()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    }).setTitle('`🎫`'+`${config.name}`+' Ticket (#Closed)').setColor(config.bot.design.color)
                    .setDescription(`The ticket was closed by ${interaction.user}, here is the channel transcript. I send the transcript to the logs channel, respective staff and a ticket creator`)
                    .addFields({
                        name: '• Information',
                        value: `> Type: ${ticket.type}\n> Status: ${ticket.status ? 'Open' : 'Closed'}\n> Staff: ${client.users.cache.has(ticket.staff) ? client.users.cache.get(ticket.staff) : 'None'}\n> Owner: ${client.users.cache.has(ticket.owner) ? client.users.cache.get(ticket.owner) : ticket.owner}\n> Closer: ${interaction.user}\n> Channel: <#${ticket.id}>`
                    })
                    .setFooter({
                        text: config.name,
                        iconURL: config.bot.icon
                    })
                    .setImage(config.bot.design['line-default']).setThumbnail(config.bot.icon)
                    .setTimestamp()], files: [attachment]}).catch((err)=>{

                    })
        }
        if (client.users.cache.has(ticket.staff)) {
            client.users.cache.get(ticket.staff).send({
                embeds: [ new MessageEmbed()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    }).setTitle('`🎫` '+`${config.name}`+' Ticket (#Closed)').setColor(config.bot.design.color)
                    .setDescription(`The ticket was closed by ${interaction.user}, here is the channel transcript. I send the transcript to the logs channel, respective staff and a ticket creator`)
                    .addFields({
                        name: '• Information',
                        value: `> Type: ${ticket.type}\n> Status: ${ticket.status ? 'Open' : 'Closed'}\n> Staff: ${client.users.cache.has(ticket.staff) ? client.users.cache.get(ticket.staff) : 'None'}\n> Owner: ${client.users.cache.has(ticket.owner) ? client.users.cache.get(ticket.owner) : ticket.owner}\n> Closer: ${interaction.user}\n> Channel: <#${ticket.id}>`
                    })
                    .setFooter({
                        text: config.name,
                        iconURL: config.bot.icon
                    })
                    .setImage(config.bot.design['line-default']).setThumbnail(config.bot.icon)
                    .setTimestamp()], files: [attachment]}).catch((err)=>{

                    })
        }
        return await interaction.deferUpdate()
        } else return interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('No permissions').setColor('RED')
                .setDescription(`Only a owner of the ticket or a staff with the role <@&${(ticket.type === 'Head') ? config.bot.roles.headstaff : config.bot.roles.staff}> can close the ticket`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
        , ephemeral: true})
}

async function deleteTicket(interaction) {
    const ticket = await ticketdb.findOne({
        id: interaction.message.channel.id
    })
    if (!ticket) return interaction.reply({
        embeds: [ new MessageEmbed()
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({dynamic: true})
            }).setTitle('Not a ticket').setColor('RED')
            .setDescription('I only can close a ticket channels...')
            .setFooter({
                text: config.name,
                iconURL: config.bot.icon
            })
            .setImage(config.bot.design['line-red'])
            .setTimestamp()]
    , ephemeral: true})
    if (ticket.status) return interaction.reply({
        embeds: [ new MessageEmbed()
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({dynamic: true})
            }).setTitle('Not Closed').setColor('RED')
            .setDescription('This ticket is not closed...')
            .setFields({
                name: '• Information',
                value: `> Type: ${ticket.type}\n> Status: ${ticket.status ? 'Open' : 'Closed'}\n> Channel: <#${ticket.id}>`
            })
            .setFooter({
                text: config.name,
                iconURL: config.bot.icon
            })
            .setImage(config.bot.design['line-red'])
            .setTimestamp()]
    , ephemeral: true})
    if (client.guilds.cache.get(config.bot.guild).members.cache.get(interaction.user.id).roles.cache.has(((ticket.type === 'Head') ? config.bot.roles.headstaff : config.bot.roles.staff))) {
        interaction.message.channel.delete()
        functions.log('Closed Ticket', interaction.user, `A ticket has been deleted`, {
            name: '• Information',
            value: `> Type: ${ticket.type}\n> Status: ${ticket.status ? 'Open' : 'Closed'}\n> Staff: ${client.users.cache.has(ticket.staff) ? client.users.cache.get(ticket.staff) : 'None'}\n> Owner: ${client.users.cache.has(ticket.owner) ? client.users.cache.get(ticket.owner) : ticket.owner}\n> Deleter: ${interaction.user}\n> Channel: <#${ticket.id}>`
        })
        await ticket.deleteOne()
    } else return interaction.reply({
        embeds: [ new MessageEmbed()
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({dynamic: true})
            }).setTitle('No permissions').setColor('RED')
            .setDescription(`Only staff with the role <@&${(ticket.type === 'Head') ? config.bot.roles.headstaff : config.bot.roles.staff}> can delete the ticket`)
            .setFooter({
                text: config.name,
                iconURL: config.bot.icon
            })
            .setImage(config.bot.design['line-red'])
            .setTimestamp()]
    , ephemeral: true})
}

async function claimTicket (interaction) {
    const ticket = await ticketdb.findOne({
        id: interaction.message.channel.id
    })
    if (!ticket) return interaction.reply({
        embeds: [ new MessageEmbed()
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({dynamic: true})
            }).setTitle('Not a ticket').setColor('RED')
            .setDescription('I only can claim a ticket channels...')
            .setFooter({
                text: config.name,
                iconURL: config.bot.icon
            })
            .setImage(config.bot.design['line-red'])
            .setTimestamp()]
    , ephemeral: true})
    if (!ticket.status) return interaction.reply({
        embeds: [ new MessageEmbed()
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({dynamic: true})
            }).setTitle('Ticket Closed').setColor('RED')
            .setDescription('This ticket is closed, only can claim in open tickets...')
            .setFields({
                name: '• Information',
                value: `> Type: ${ticket.type}\n> Status: ${ticket.status ? 'Open' : 'Closed'}\n> Channel: <#${ticket.id}>`
            })
            .setFooter({
                text: config.name,
                iconURL: config.bot.icon
            })
            .setImage(config.bot.design['line-red'])
            .setTimestamp()]
    , ephemeral: true})
    if (client.guilds.cache.get(config.bot.guild).members.cache.get(interaction.user.id).roles.cache.has(((ticket.type === 'Head') ? config.bot.roles.headstaff : config.bot.roles.staff))) {
        if (ticket.staff) return interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Ticket already claimed').setColor('RED')
                .setDescription('This ticket was already claimed')
                .setFields({
                    name: '• Information',
                    value: `> Type: ${ticket.type}\n> Status: ${ticket.status ? 'Open' : 'Closed'}\n> Staff: ${client.users.cache.has(ticket.staff) ? client.users.cache.get(ticket.staff) : ticket.staff}\n> Owner: ${client.users.cache.has(ticket.owner) ? client.users.cache.get(ticket.owner) : ticket.owner}\n> Channel: <#${ticket.id}>`
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
        , ephemeral: true})
        await ticket.updateOne({
            staff: interaction.user.id
        })
        await ticket.save()
        interaction.message.channel.send({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Ticket Claimed').setColor(config.bot.design.color)
                .setDescription('This ticket was be claimed by a staff !')
                .setFields({
                    name: '• Information',
                    value: `> Staff: ${interaction.user}\n> Date: <t:${parseInt((new Date(new Date()).getTime() / 1000).toFixed(0))}:R>`
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-default'])
                .setTimestamp()]
        })
        functions.log('Claimed Ticket', interaction.user, `A ticket has been claimed`, {
            name: '• Information',
            value: `> Staff: ${interaction.user}\n> Date: <t:${parseInt((new Date(new Date()).getTime() / 1000).toFixed(0))}:R>\n> Owner: ${client.users.cache.has(ticket.owner) ? client.users.cache.get(ticket.owner) : ticket.owner}\n> Type: ${ticket.type}\n> Channel: <#${ticket.id}>`
        })
        return await interaction.deferUpdate()
    } else return interaction.reply({
        embeds: [ new MessageEmbed()
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({dynamic: true})
            }).setTitle('No permissions').setColor('RED')
            .setDescription(`Only staff with the role <@&${(ticket.type === 'Head') ? config.bot.roles.headstaff : config.bot.roles.staff}> can claim the ticket`)
            .setFooter({
                text: config.name,
                iconURL: config.bot.icon
            })
            .setImage(config.bot.design['line-red'])
            .setTimestamp()]
    , ephemeral: true})
}
module.exports = {
    openTicket: openTicket,
    closeTicket: closeTicket,
    deleteTicket: deleteTicket,
    claimTicket: claimTicket
}