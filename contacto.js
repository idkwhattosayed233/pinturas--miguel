export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, telefono, email, mensaje } = req.body;

  try {
    // Conexión con Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Pinturas Miguel <onboarding@resend.dev>',
        to: ['e00554044@gmail.com'], // El correo donde se recibirán los presupuestos
        subject: `Nuevo presupuesto de: ${nombre}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #dc2626;">¡Nuevo mensaje desde la web de Pinturas Miguel!</h2>
            <p>Has recibido una nueva solicitud de presupuesto:</p>
            <ul>
              <li><strong>Nombre:</strong> ${nombre}</li>
              <li><strong>Teléfono / WhatsApp:</strong> ${telefono}</li>
              <li><strong>Mensaje:</strong> ${mensaje}</li>
            </ul>
            <hr>
            <p style="font-size: 12px; color: #666;">Este mensaje fue enviado desde el formulario de tu página web.</p>
          </div>
        `
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true, message: 'Correo enviado con éxito' });
    } else {
      return res.status(500).json({ error: 'Error al enviar el correo' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
