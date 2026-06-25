import 'dotenv/config';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('Por favor, configura TELEGRAM_BOT_TOKEN en el archivo .env');
  process.exit(1);
}

// Lista de comandos que queremos que aparezcan en el menú del bot
const commands = [
  { command: 'start', description: 'Reiniciar el bot y ver las instrucciones' },
  { command: 'ayuda', description: '¿Cómo funciona la búsqueda?' }
];

async function setBotCommands() {
  try {
    const url = `https://api.telegram.org/bot${token}/setMyCommands`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commands })
    });
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Menú de comandos configurado exitosamente:');
      console.log('Ahora en Telegram verás un pequeño botón "Menú" o un botón "/" con la lista.');
    } else {
      console.error('❌ Error configurando el menú:');
      console.error(result);
    }
  } catch (err) {
    console.error('❌ Excepción al conectar con Telegram:', err);
  }
}

setBotCommands();
