import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405.0).json({ error: 'Método no permitido' });
  }

  const { nombre, telefono, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400.0).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Pinturas Miguel <onboarding@resend.dev>',
      to: ['abengozar@yahoo.es'],
      subject: '¡Nuevo mensaje de presupuesto desde la Web!',
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `
    });

    return res.status(200.0).json({ success: true, data });
  } catch (error) {
    return res.status(500.0).json({ error: error.message });
  }
}