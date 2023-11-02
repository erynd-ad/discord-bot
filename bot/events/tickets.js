const config = require('../../config/config')
const client = require('../../index')
const ticketdb = require('../utils/ticket')

client.on('interactionCreate', async(interaction) => {
    if (interaction.isSelectMenu() && interaction.customId === 'tickets') {
        if (interaction.values[0] === 'ranks') return ticketdb.openTicket(interaction, 'Ranks')
        if (interaction.values[0] === 'applies') return ticketdb.openTicket(interaction, 'Applies')
        if (interaction.values[0] === 'reports') return ticketdb.openTicket(interaction, 'Reports')
        if (interaction.values[0] === 'head') return ticketdb.openTicket(interaction, 'Head')
        if (interaction.values[0] === 'general') return ticketdb.openTicket(interaction, 'General')
    } else if (interaction.isButton()) {
        if (interaction.customId === 'close') {
            await ticketdb.closeTicket(interaction)
        }
        else if (interaction.customId === 'delete'){
            await ticketdb.deleteTicket(interaction)
        }
        else if (interaction.customId === 'claim'){
            await ticketdb.claimTicket(interaction)
        }
    }
})