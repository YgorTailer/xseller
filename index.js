import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';

// Configuração inicial
config();

// Criar cliente
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Sistema básico de vendas
const vendas = new Map();

client.on('ready', () => {
    console.log(`Bot ${client.user.tag} está online!`);
    console.log('Sistema de vendas iniciado com sucesso!');
});

// Comandos de venda
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // Comando de vender
    if (message.content.startsWith('!vender')) {
        const args = message.content.split(' ');
        const produto = args[1];
        const valor = parseFloat(args[2]);
        
        if (!produto || !valor) {
            return message.reply('Use: !vender <produto> <valor>');
        }

        const venda = {
            produto,
            valor,
            vendedor: message.author.id,
            data: new Date()
        };

        vendas.set(Date.now(), venda);
        message.reply(`✅ Produto "${produto}" cadastrado para venda por R$ ${valor}`);
    }

    // Comando de listar vendas
    if (message.content === '!vendas') {
        let listaVendas = '📊 **Lista de Vendas:**\n\n';
        
        vendas.forEach((venda, id) => {
            listaVendas += `**ID:** ${id}\n`;
            listaVendas += `**Produto:** ${venda.produto}\n`;
            listaVendas += `**Valor:** R$ ${venda.valor}\n`;
            listaVendas += `**Vendedor:** <@${venda.vendedor}>\n\n`;
        });

        message.reply(listaVendas || 'Nenhuma venda cadastrada.');
    }
});

// Login
client.login(process.env.BOT_TOKEN); 