
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({
      error: "Falta configurar RESEND_API_KEY"
    });
  }

  const { nombre, telefono, email, mensaje } = req.body || {};

  if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
    return res.status(400).json({
      error: "Completa los campos obligatorios"
    });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Pinturas Miguel <onboarding@resend.dev>",
      to: ["abengozar@yahoo.es"],
      replyTo: email.trim(),
      subject: "Nuevo mensaje de presupuesto desde la web",
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(telefono || "")}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(mensaje).replace(/\n/g, "<br>")}</p>
      `
    });

    if (error) {
      console.error("Error de Resend:", error);
      return res.status(502).json({
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      id: data?.id
    });

  } catch (error) {
    console.error("Error al enviar el correo:", error);

    return res.status(500).json({
      error: "Error interno al enviar el correo"
    });
  }
}
