import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Eres Emilia Salazar, Asesora Educativa de El Taller del Saber.

Tu objetivo principal es ayudar a mamás, papás y maestras a resolver sus dudas y guiarlos de forma natural hasta completar la compra del Sistema Progresivo de Multiplicaciones.

Nunca digas que eres una inteligencia artificial.
Nunca digas que eres ChatGPT.
Habla como una asesora humana, amable, profesional y cercana.

PRODUCTO:
Vendes exclusivamente el Sistema Progresivo de Multiplicaciones.

Incluye:
- Más de 500 ejercicios.
- Tablas de multiplicar del 1 al 10.
- Actividades progresivas.
- Juegos educativos.
- Memorama.
- Dominó.
- Rompecabezas.
- Material recortable.
- Guía para padres y maestros.
- Diploma.
- Seguimiento de avance.
- Bono de Matemáticas Básicas: sumas, restas y cálculo mental.

PRECIO:
$69 MXN.
Pago único.
Sin mensualidades.

FORMAS DE PAGO:
1. Transferencia bancaria.
2. Depósito en efectivo en OXXO.
Si el cliente tiene problema con su app bancaria, también puede pagar por transferencia a Mercado Pago.

ENTREGA:
Después de confirmar el pago se entrega acceso digital por link de Google Drive.
La entrega puede hacerse por WhatsApp o ManyChat.

TONO:
- Amable.
- Claro.
- Cercano.
- Paciente.
- Profesional.
- Conversacional.
- Como mensaje de WhatsApp.
- No uses respuestas enormes.
- Usa emojis con moderación.

REGLA DE CONVERSACIÓN:
Siempre responde en este orden:
1. Resuelve la duda del cliente.
2. Explica brevemente el beneficio relacionado.
3. Invita a comprar.
4. Pregunta qué método de pago prefiere.

CIERRE BASE:
"Hoy el Sistema Progresivo de Multiplicaciones tiene un costo de solo $69 MXN 😊

Puedes pagar por:

1️⃣ Transferencia bancaria
2️⃣ Depósito en OXXO

¿Cuál método prefieres?"

NUNCA DIGAS:
- Garantizado.
- Aprende en X días.
- Resultados asegurados.
- Sirve para todos los niños.
- Tu hijo aprenderá sí o sí.
- Cura problemas de aprendizaje.
- Últimos lugares.
- Promociones falsas.
- Información inventada.

PREGUNTAS FRECUENTES:

Si preguntan qué incluye:
Responde que incluye más de 500 ejercicios, tablas del 1 al 10, juegos, fichas recortables, guía, diploma, seguimiento de avance y bono de matemáticas básicas.

Si preguntan para qué grado sirve:
Explica que está organizado de forma progresiva y puede utilizarse para reforzar desde los primeros niveles donde se enseñan las tablas de multiplicar, en casa o escuela.

Si preguntan si trae las tablas:
Responde que sí, incluye las tablas del 1 al 10 con ejercicios para practicarlas.

Si preguntan si es imprimible:
Responde que sí, todo el material está listo para descargar, imprimir y usar.

Si preguntan cómo se entrega o cómo lo reciben:
Explica que se entrega por link de Google Drive después de confirmar el pago.

Si preguntan si es seguro o si no es fraude:
Responde con tranquilidad. Explica que la entrega se realiza después de confirmar el pago por los canales oficiales de El Taller del Saber.

Si preguntan cuántas hojas tiene:
No inventes una cantidad exacta si no está disponible. Responde que incluye más de 500 ejercicios organizados de forma progresiva.

Si preguntan si sirve para niños atrasados:
Responde con cuidado. Di que puede servir como material de apoyo y refuerzo, porque va paso a paso, pero evita prometer resultados.

Si preguntan si lo pueden usar varias veces:
Responde que sí, una vez adquirido pueden imprimirlo nuevamente cuando lo necesiten.

Si preguntan dónde están ubicados:
Explica que el material es digital, por eso se entrega por link y puede usarse desde cualquier lugar.

OBJECIONES:

Si dicen "está caro":
Responde con empatía. Explica que por $69 reciben un sistema completo con ejercicios, juegos, guía, diploma y bono, listo para imprimir, ahorrando tiempo de planeación.

Si dicen "lo voy a pensar":
Responde:
"Claro 😊 Tómate el tiempo que necesites. Si mientras tanto te surge cualquier duda sobre el material, con gusto puedo ayudarte."

Si dicen "no tengo dinero":
Responde con empatía y sin presionar. Di que el material seguirá disponible cuando decidan adquirirlo.

OBJETIVO FINAL:
Guiar al cliente al pago de forma natural, sin presión y con confianza.
`;

const DIRECT_RESPONSES = {
  hola: `¡Hola! 😊 Soy Emilia, de El Taller del Saber 📚

Te ayudo con gusto con el Sistema Progresivo de Multiplicaciones.

Incluye más de 500 ejercicios, tablas del 1 al 10, juegos, fichas recortables, guía, diploma y bono de matemáticas básicas.

Hoy tiene un costo de solo $69 MXN.

Puedes pagar por:

1️⃣ Transferencia bancaria
2️⃣ Depósito en OXXO

¿Cuál prefieres?`,

  precio: `El Sistema Progresivo de Multiplicaciones tiene un costo de solo $69 MXN 😊

Es pago único e incluye más de 500 ejercicios, tablas del 1 al 10, juegos, fichas recortables, guía, diploma y bono de matemáticas básicas.

Puedes pagar por:

1️⃣ Transferencia bancaria
2️⃣ Depósito en OXXO

¿Cuál método prefieres?`,

  entrega: `Se entrega de forma digital 😊

Después de confirmar el pago, te enviamos el acceso por link de Google Drive para que puedas descargarlo e imprimirlo.

Puedes pagar por:

1️⃣ Transferencia bancaria
2️⃣ Depósito en OXXO

¿Cuál prefieres?`,

  recibo: `Lo recibes de forma digital por link de Google Drive 😊

Después de confirmar tu pago, te compartimos el acceso por WhatsApp o ManyChat para que puedas descargarlo e imprimirlo.

Hoy cuesta $69 MXN.

¿Prefieres pagar por transferencia o por OXXO?`,

  imprimir: `Sí 😊 Todo el material es imprimible.

Lo descargas, lo imprimes y puedes usarlo en casa o en clase.

Incluye ejercicios, tablas, juegos, fichas recortables, guía, diploma y seguimiento de avance.

Hoy cuesta $69 MXN.

¿Te paso los datos para transferencia o prefieres OXXO?`,

  incluye: `Incluye más de 500 ejercicios organizados paso a paso 😊

También trae tablas del 1 al 10, juegos educativos, memorama, dominó, rompecabezas, fichas recortables, guía para padres y maestros, diploma, seguimiento de avance y bono de matemáticas básicas.

Hoy tiene un costo de $69 MXN.

¿Prefieres pagar por transferencia o depósito en OXXO?`,

  grado: `Sí puede servir como material de apoyo 😊

Está organizado de forma progresiva, por eso puede utilizarse para reforzar las tablas de multiplicar desde los primeros niveles donde comienzan a ver multiplicaciones.

También funciona para casa o escuela.

Hoy cuesta $69 MXN.

¿Deseas pagar por transferencia o por OXXO?`,

  hojas: `El material incluye más de 500 ejercicios organizados de forma progresiva 😊

Además trae tablas, juegos, fichas recortables, guía, diploma y seguimiento de avance.

Todo es digital e imprimible.

Hoy cuesta $69 MXN.

¿Te paso datos para transferencia o prefieres OXXO?`,

  seguro: `Sí, claro 😊

La entrega se realiza después de confirmar el pago por los canales oficiales de El Taller del Saber.

Te enviamos el acceso digital por link de Google Drive para que puedas descargar e imprimir el material.

Hoy cuesta $69 MXN.

¿Prefieres transferencia o depósito en OXXO?`,

  oxxo: `Sí, puedes pagar por depósito en OXXO en efectivo 😊

También tenemos opción de transferencia bancaria.

Después de confirmar el pago, te enviamos el acceso digital por link de Google Drive.

El costo es de $69 MXN.

¿Quieres pagar por OXXO?`,

  pago: `Puedes pagar de dos formas 😊

1️⃣ Transferencia bancaria
2️⃣ Depósito en OXXO en efectivo

Si tu app no reconoce la tarjeta o el banco, también podemos darte opción por transferencia a Mercado Pago.

Después de confirmar el pago, te enviamos el acceso digital por Google Drive.

¿Cuál método prefieres?`,
};

const KEYWORDS = {
  precio: ["precio", "cuesta", "costo", "vale", "cuánto", "cuanto"],
  entrega: ["entrega", "envían", "envian", "mandan", "llega", "acceso", "link", "drive"],
  recibo: ["recibo", "recibir", "recibe", "dónde lo recibo", "donde lo recibo"],
  imprimir: ["imprimir", "imprimible", "impreso", "pdf", "descargar", "descarga"],
  incluye: ["incluye", "contiene", "trae", "viene", "material", "video"],
  grado: ["grado", "primaria", "primero", "segundo", "tercero", "cuarto", "edad", "años"],
  hojas: ["hojas", "páginas", "paginas", "cuántas hojas", "cuantas hojas"],
  seguro: ["seguro", "fraude", "estafa", "confiable", "confianza"],
  oxxo: ["oxxo", "depósito", "deposito", "efectivo"],
  pago: ["pago", "pagar", "transferencia", "mercado pago", "tarjeta", "banco"],
  hola: ["hola", "buenos días", "buenas tardes", "buenas noches", "información", "info"],
};

function normalizeText(text = "") {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function detectKeyword(message = "") {
  const normalized = normalizeText(message);

  for (const [intent, words] of Object.entries(KEYWORDS)) {
    if (words.some((word) => normalized.includes(normalizeText(word)))) {
      return intent;
    }
  }

  return null;
}

function getDirectResponse(message = "") {
  const intent = detectKeyword(message);

  if (intent && DIRECT_RESPONSES[intent]) {
    return DIRECT_RESPONSES[intent];
  }

  return null;
}

function extractUserMessage(body) {
  return (
    body?.message ||
    body?.text ||
    body?.last_input_text ||
    body?.custom_data?.message ||
    body?.custom_data?.text ||
    body?.entry?.[0]?.messaging?.[0]?.message?.text ||
    ""
  );
}

function buildManyChatResponse(text) {
  return {
    version: "v2",
    content: {
      messages: [
        {
          type: "text",
          text,
        },
      ],
    },
  };
}

async function generateAIResponse(userMessage) {
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.6,
    max_tokens: 450,
  });

  return completion.choices?.[0]?.message?.content?.trim();
}

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Agente Emilia Salazar activo",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "El Taller del Saber - Sistema Progresivo de Multiplicaciones",
  });
});

app.post("/webhook", async (req, res) => {
  try {
    const userMessage = extractUserMessage(req.body);

    if (!userMessage) {
      return res.status(200).json(
        buildManyChatResponse(
          "¡Hola! 😊 Soy Emilia, de El Taller del Saber. ¿Te gustaría información del Sistema Progresivo de Multiplicaciones?"
        )
      );
    }

    const directResponse = getDirectResponse(userMessage);

    if (directResponse) {
      return res.status(200).json(buildManyChatResponse(directResponse));
    }

    const aiResponse = await generateAIResponse(userMessage);

    return res.status(200).json(
      buildManyChatResponse(
        aiResponse ||
          "Con gusto te ayudo 😊 El Sistema Progresivo de Multiplicaciones cuesta $69 MXN y se entrega por link de Google Drive después de confirmar el pago. ¿Prefieres transferencia o depósito en OXXO?"
      )
    );
  } catch (error) {
    console.error("Error en /webhook:", error);

    return res.status(200).json(
      buildManyChatResponse(
        "Perdón, tuve un detalle al responder 🙏 Puedes escribirme nuevamente tu duda y con gusto te ayudo."
      )
    );
  }
});

app.post("/manychat", async (req, res) => {
  try {
    const userMessage = extractUserMessage(req.body);

    if (!userMessage) {
      return res.status(200).json(
        buildManyChatResponse(
          "¡Hola! 😊 Soy Emilia, de El Taller del Saber. ¿Te gustaría conocer el Sistema Progresivo de Multiplicaciones?"
        )
      );
    }

    const directResponse = getDirectResponse(userMessage);

    if (directResponse) {
      return res.status(200).json(buildManyChatResponse(directResponse));
    }

    const aiResponse = await generateAIResponse(userMessage);

    return res.status(200).json(buildManyChatResponse(aiResponse));
  } catch (error) {
    console.error("Error en /manychat:", error);

    return res.status(200).json(
      buildManyChatResponse(
        "Disculpa, tuve un problema técnico 🙏 Escríbeme nuevamente tu duda para ayudarte."
      )
    );
  }
});

app.post("/n8n", async (req, res) => {
  try {
    const userMessage = extractUserMessage(req.body);

    if (!userMessage) {
      return res.status(200).json({
        success: true,
        reply:
          "¡Hola! 😊 Soy Emilia, de El Taller del Saber. ¿Te gustaría información del Sistema Progresivo de Multiplicaciones?",
      });
    }

    const directResponse = getDirectResponse(userMessage);

    if (directResponse) {
      return res.status(200).json({
        success: true,
        reply: directResponse,
      });
    }

    const aiResponse = await generateAIResponse(userMessage);

    return res.status(200).json({
      success: true,
      reply: aiResponse,
    });
  } catch (error) {
    console.error("Error en /n8n:", error);

    return res.status(200).json({
      success: false,
      reply:
        "Disculpa, tuve un problema técnico 🙏 Escríbeme nuevamente tu duda para ayudarte.",
    });
  }
});

app.post("/openai", async (req, res) => {
  try {
    const userMessage = extractUserMessage(req.body);

    if (!userMessage) {
      return res.status(400).json({
        success: false,
        error: "No se recibió mensaje del usuario.",
      });
    }

    const aiResponse = await generateAIResponse(userMessage);

    return res.status(200).json({
      success: true,
      reply: aiResponse,
    });
  } catch (error) {
    console.error("Error en /openai:", error);

    return res.status(500).json({
      success: false,
      error: "Error al generar respuesta con OpenAI.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
