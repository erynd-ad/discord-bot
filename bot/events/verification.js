const config = require('../../config/config')
const client = require('../../index')
const functions = require('../utils/functions')

client.on('interactionCreate', async(interaction) => {
     if (interaction.isButton() && interaction.customId === 'verify') {
        return functions.role(interaction, config.bot.roles.user)
     }
})