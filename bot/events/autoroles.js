const config = require('../../config/config')
const client = require('../../index')
const ticket = require('../')
const functions = require('../utils/functions')

client.on('interactionCreate', async(interaction) => {
     if (interaction.isSelectMenu() && interaction.customId === 'autoroles') {
        if (interaction.values[0] === 'spoilers') return functions.role(interaction, config.bot.roles.auto.spoilers)
        if (interaction.values[0] === 'giveaways') return functions.role(interaction, config.bot.roles.auto.giveaways)
        if (interaction.values[0] === 'events') return functions.role(interaction, config.bot.roles.auto.events)
     }
})