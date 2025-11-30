export async function sendNotification(channel: string, contact: string | number, message: string, meta?: any) {
  if (channel === 'telegram') {
    const { sendTelegram } = await import('./telegramSender.js');
    return sendTelegram(contact, message);
  }

  // placeholder for other channels
  console.warn('sendNotification: unsupported channel', channel);
  return null;
}
