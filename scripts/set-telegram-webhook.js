import 'dotenv/config';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('Por favor, configura TELEGRAM_BOT_TOKEN en el archivo .env');
  process.exit(1);
}

const args = process.argv.slice(2);
const webhookUrl = args[0];

if (!webhookUrl) {
  console.error('Debes proveer la URL del webhook.');
  console.log('Uso: node scripts/set-telegram-webhook.js https://tu-url-ngrok.ngrok.app/api/telegram/webhook');
  process.exit(1);
}

async function setWebhook() {
  try {
    const url = `https://api.telegram.org/bot${token}/setWebhook`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl })
    });
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Webhook configurado exitosamente:');
      console.log(result.description);
    } else {
      console.error('❌ Error configurando webhook:');
      console.error(result);
    }
  } catch (err) {
    console.error('❌ Excepción al conectar con Telegram:', err);
  }
}

setWebhook();
