export async function sendEmail(to: string, subject: string, html: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[dev-email] to=${to} subject=${subject}\n${html}`);
  }

  return { ok: true };
}

export async function sendInAppNotification(userId: string, message: string) {
  console.log(`[in-app] user=${userId} ${message}`);
}
