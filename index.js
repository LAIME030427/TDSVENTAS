require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   PRODUCTO
========================= */

const PRODUCT = {
  brand: "El Taller del Saber",
  assistantName: "Emilia",
  productName: "Sistema Progresivo de Multiplicaciones",
  price: "$69 MXN",
  delivery: "link de Google Drive",
  paymentMethods: ["Transferencia bancaria", "Depósito en OXXO"],
};

/* =========================
   PROMPT PRINCIPAL
========================= */

const SYSTEM_PROMPT = `
Eres Emilia, asesora humana, cálida y cercana de El Taller del Saber 📚✨

Atiendes por WhatsApp a mamás, papás y maestras interesadas en el Sistema Progresivo de Multiplicaciones.

Tu estilo:
- Natural, breve y humano.
- Respuestas cortas tipo WhatsApp.
- Máximo 1 o 2 párrafos cortos.
- Usa emojis con moderación: 😊📚✖️🔢✨🧡🙏
- No saludes con "Hola".
- No digas que eres IA.
- No digas que eres ChatGPT.
- No suenes robótica.
- No presiones.

Información real del producto:
- Producto: Sistema Progresivo de Multiplicaciones.
- Es material digital imprimible.
- Se entrega por link de Google Drive.
- Se entrega después de confirmar pago.
- Puede recibirse por WhatsApp o ManyChat.
- Incluye más de 500 ejercicios.
- Incluye tablas del 1 al 10.
- Incluye juegos didácticos.
- Incluye memorama, dominó y rompecabezas.
- Incluye fichas recortables.
- Incluye guía práctica para casa o aula.
- Incluye diploma imprimible.
- Incluye seguimiento de avance.
- Incluye bono de matemáticas básicas: sumas, restas y cálculo mental.
- Precio: $69 MXN.
- Pago único.
- Sin mensualidades.
- Pago por transferencia bancaria o depósito en OXXO.
- Si la app bancaria no reconoce banco/tarjeta, se puede ofrecer Mercado Pago.

Nunca digas:
- garantizado
- aprende en X días
- resultados asegurados
- tu hijo aprenderá sí o sí
- sirve para todos los niños
- cura problemas de aprendizaje
- últimos lugares si no es real
- material físico
- correo electrónico

Objetivo:
Resolver la duda y guiar suavemente al pago por transferencia u OXXO.
`;

/* =========================
   UTILIDADES
========================= */

function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanAIResponse(text = "") {
  let output = String(text).trim();

  output = output
    .replace(/^¡?\s*hola\s*[😊🙏❤✨🌿💛📚✖️🔢🧡,\.\!]*\s*/gi, "")
    .replace(/^buenos días\s*/gi, "")
    .replace(/^buenos dias\s*/gi, "")
    .replace(/^buenas tardes\s*/gi, "")
    .replace(/^buenas noches\s*/gi, "")
    .replace(/^gracias por preguntar\s*/gi, "");

  output = output
    .replace(/¿[^?]*(quieres saber más|quieres saber mas|te interesa|te gustaría|te gustaria|te cuento|te explico|te ayudo|puedo ayudarte|hay algo más|hay algo mas)[^?]*\?/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return output;
}

function paymentClose() {
  return pick([
    `El material cuesta ${PRODUCT.price} y puedes pagarlo por transferencia bancaria o depósito en OXXO ✨\n¿Cuál método prefieres? 😊`,
    `Para obtenerlo, el pago es de ${PRODUCT.price}. Puedes elegir transferencia bancaria o depósito en OXXO 📚\n¿Cuál opción te queda mejor?`,
    `El acceso tiene costo de ${PRODUCT.price}, pago único. Se puede pagar por transferencia u OXXO ✨\n¿Te paso datos?`,
  ]);
}

function addClose(text) {
  const cleaned = cleanAIResponse(text);

  if (!cleaned) return paymentClose();

  const alreadyClosing =
    /transferencia|oxxo|datos|pago|pagar|cuenta|clabe|deposito|depósito/i.test(cleaned);

  if (alreadyClosing) return cleaned;

  return `${cleaned}\n\n${paymentClose()}`;
}

function manyChatResponse(text) {
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

function plainResponse(reply, success = true) {
  return {
    success,
    reply,
    respuesta: reply,
  };
}

function extractUserMessage(body = {}) {
  return (
    body.message ||
    body.text ||
    body.texto ||
    body.mensaje ||
    body.last_input_text ||
    body.custom_data?.message ||
    body.custom_data?.text ||
    body.entry?.[0]?.messaging?.[0]?.message?.text ||
    ""
  );
}

/* =========================
   RESPUESTAS HUMANAS
========================= */

const DIRECT_RESPONSES = {
  comprar: [
    `Perfecto 😊\n\nEl Sistema Progresivo de Multiplicaciones cuesta ${PRODUCT.price} y se entrega digital después de confirmar el pago 📚✨\n\nPuedes pagar por transferencia bancaria o depósito en OXXO.\n¿Cuál método prefieres?`,
    `Claro 😊\n\nTe paso la información. El material cuesta ${PRODUCT.price}, es pago único y se entrega por Google Drive después de confirmar el pago 📚\n\nPuedes hacerlo por transferencia u OXXO.`,
    `Sí, con gusto 😊\n\nEl acceso cuesta ${PRODUCT.price}. Se entrega digital por Google Drive después de confirmar el pago.\n\n¿Prefieres transferencia o depósito en OXXO?`,
  ],

  precio: [
    `El Sistema Progresivo de Multiplicaciones cuesta ${PRODUCT.price} 😊\n\nEs pago único e incluye el material digital listo para descargar e imprimir.`,
    `Tiene un costo de ${PRODUCT.price} 📚\n\nIncluye más de 500 ejercicios, tablas, juegos, fichas, guía, diploma y bono de matemáticas básicas.`,
    `El precio es de ${PRODUCT.price} ✨\n\nNo hay mensualidades. Se entrega digital después de confirmar el pago.`,
  ],

  incluye: [
    `Incluye más de 500 ejercicios, tablas del 1 al 10, juegos didácticos, memorama, dominó, rompecabezas, fichas recortables, guía práctica, diploma, seguimiento de avance y bono de matemáticas básicas 📚✨`,
    `Viene muy completo 😊\n\nTrae ejercicios progresivos, tablas de multiplicar, juegos, fichas para recortar, guía para casa o aula, diploma y seguimiento de avance.`,
    `Incluye material para reforzar multiplicaciones y tablas ✖️🔢\n\nAdemás trae juegos, fichas recortables, guía, diploma y bono de matemáticas básicas.`,
  ],

  tablas: [
    `Sí, incluye las tablas de multiplicar del 1 al 10 ✖️🔢\n\nTambién trae ejercicios y juegos para practicarlas de forma más dinámica.`,
    `Claro 😊\n\nEl sistema está enfocado en multiplicaciones y tablas, con actividades progresivas para practicar paso a paso.`,
    `Vienen las tablas del 1 al 10 y ejercicios para reforzarlas 📚\n\nTambién incluye juegos y fichas recortables.`,
  ],

  grado: [
    `Puede usarse como apoyo para niños que están comenzando o reforzando las tablas de multiplicar 😊\n\nEstá organizado de forma progresiva para trabajar paso a paso en casa o en clase.`,
    `Está pensado para reforzar multiplicaciones en primaria 📚\n\nEspecialmente cuando el niño empieza a trabajar tablas o necesita repasarlas.`,
    `Sí puede servir como material de apoyo ✖️🔢\n\nVa paso a paso, desde actividades sencillas hasta práctica con tablas.`,
  ],

  hojas: [
    `El sistema incluye más de 500 ejercicios organizados de forma progresiva 📚\n\nNo es una hoja suelta, es material completo para trabajar multiplicaciones.`,
    `Viene con más de 500 ejercicios ✨\n\nAdemás incluye tablas, juegos, fichas recortables, guía, diploma y seguimiento de avance.`,
    `Incluye más de 500 ejercicios listos para imprimir 😊\n\nEstá organizado para aplicarlo poco a poco en casa o en clase.`,
  ],

  imprimible: [
    `Sí, todo el material es digital e imprimible 😊\n\nLo descargas, lo imprimes y puedes usarlo en casa o en clase.`,
    `Así es 📚\n\nEl material se entrega digital para que puedas descargarlo e imprimirlo cuando lo necesites.`,
    `Sí, viene listo para imprimir ✨\n\nPuedes usarlo varias veces según lo necesites para practicar.`,
  ],

  entrega: [
    `La entrega es digital 😊\n\nDespués de confirmar el pago, se envía el acceso por link de Google Drive para descargar e imprimir el material.`,
    `Lo recibes por WhatsApp o ManyChat mediante un link de Google Drive 📚\n\nUna vez confirmado el pago, se comparte el acceso.`,
    `Se entrega de forma digital ✨\n\nNo es físico. Recibes el link de descarga después de confirmar tu pago.`,
  ],

  oxxo: [
    `Sí, puedes pagar por depósito en OXXO en efectivo 😊\n\nDespués de confirmar el pago, se envía el acceso digital por Google Drive.`,
    `Claro 📚\n\nTenemos opción de depósito en OXXO. Una vez confirmado, recibes el link para descargar el material.`,
    `Sí se puede por OXXO ✨\n\nEl material cuesta ${PRODUCT.price} y se entrega digital después de validar el pago.`,
  ],

  transferencia: [
    `Claro 😊\n\nPuedes pagar por transferencia bancaria. Después de confirmar el pago, se envía el acceso digital por Google Drive 📚✨\n\n¿Te comparto los datos?`,
    `Sí, tenemos transferencia bancaria 📚\n\nEl material cuesta ${PRODUCT.price} y se entrega digital después de confirmar el pago.`,
    `Puedes pagar por transferencia ✨\n\nDespués de validar el comprobante, te enviamos el acceso por Google Drive.`,
  ],

  comprobante: [
    `Perfecto 😊\n\nEnvíame por aquí tu comprobante de pago y revisamos la confirmación.\n\nDespués te compartimos el acceso digital por Google Drive 📚✨`,
    `Muy bien 📚\n\nMándame tu comprobante por aquí para validarlo y enseguida se te comparte el acceso al material.`,
    `Gracias 😊\n\nPuedes enviarme el comprobante en este chat y revisamos la confirmación para entregarte el acceso.`,
  ],

  seguridad: [
    `Entiendo tu duda 😊\n\nLa entrega se realiza por los canales oficiales de El Taller del Saber y el acceso se envía después de confirmar el pago.`,
    `Sí, es seguro 📚\n\nEl material se entrega digital por Google Drive una vez confirmado el pago.`,
    `Claro 🧡\n\nLa entrega se hace por WhatsApp o ManyChat mediante un link de Google Drive después de validar el pago.`,
  ],

  objecionPrecio: [
    `Te entiendo 😊\n\nLa ventaja es que por ${PRODUCT.price} recibes un sistema completo con ejercicios, tablas, juegos, guía, diploma y bono, listo para imprimir 📚✨`,
    `Sí te entiendo 🧡\n\nEstá pensado para ahorrar tiempo y tener el material organizado, sin estar buscando hojas sueltas en internet.`,
    `Comprendo 😊\n\nPor ${PRODUCT.price} recibes más de 500 ejercicios, juegos y guía práctica para trabajar multiplicaciones paso a paso.`,
  ],

  pensar: [
    `Claro 😊\n\nTómate tu tiempo. Si más adelante te surge alguna duda sobre el material, con gusto te ayudo 📚✨`,
    `Está bien 😊\n\nCuando quieras retomarlo, aquí te puedo pasar la información o los datos de pago.`,
    `Sin problema 🧡\n\nSi decides aprovecharlo, me escribes y te comparto los datos.`,
  ],

  atrasado: [
    `Puede servir como material de apoyo y refuerzo 😊\n\nEstá organizado paso a paso para practicar multiplicaciones y tablas sin brincar directo a ejercicios complicados.`,
    `Sí puede ayudar como refuerzo 📚\n\nVa de forma progresiva, con ejercicios y juegos para practicar las tablas poco a poco.`,
    `Es buena opción para reforzar ✖️🔢\n\nSolo es importante trabajarlo con calma y constancia, porque cada niño avanza a su ritmo.`,
  ],

  ubicacion: [
    `El material es digital 😊\n\nNo necesitas acudir a ningún lugar. Se entrega por link de Google Drive después de confirmar el pago.`,
    `Trabajamos con entrega digital 📚\n\nRecibes el acceso por WhatsApp o ManyChat, sin envío físico.`,
    `No manejamos entrega física ✨\n\nEl acceso se comparte digitalmente para descargar e imprimir desde donde estés.`,
  ],

  video: [
    `No incluye video 😊\n\nEs material digital imprimible con ejercicios, tablas, juegos, fichas, guía, diploma y bono de matemáticas básicas 📚✨`,
  ],
};

/* =========================
   INTENCIONES ORDENADAS
========================= */

const INTENTS = [
  {
    name: "comprobante",
    keywords: [
      "comprobante", "ticket", "recibo", "folio",
      "ya pague", "ya pagué", "pague", "pagué",
      "hice el pago", "mande pago", "mandé pago",
      "deposite", "deposité", "transferi", "transferí"
    ],
    close: false,
  },
  {
    name: "comprar",
    keywords: [
      "quiero", "lo quiero", "me interesa", "quiero comprar",
      "comprar", "adquirir", "pasame datos", "pásame datos",
      "datos", "datos de pago", "cuenta", "clabe",
      "numero de cuenta", "número de cuenta", "como pago",
      "cómo pago", "donde pago", "ya", "va", "sale"
    ],
    close: false,
  },
  {
    name: "oxxo",
    keywords: ["oxxo", "deposito", "depósito", "efectivo"],
    close: true,
  },
  {
    name: "transferencia",
    keywords: ["transferencia", "banco", "tarjeta", "mercado pago", "spei"],
    close: true,
  },
  {
    name: "precio",
    keywords: ["precio", "cuesta", "costo", "vale", "cuanto", "cuánto", "a como", "a cómo", "69", "79"],
    close: true,
  },
  {
    name: "video",
    keywords: ["video", "videos", "clases"],
    close: true,
  },
  {
    name: "entrega",
    keywords: ["entrega", "envian", "envían", "mandan", "llega", "link", "enlace", "drive", "google drive", "acceso", "recibo", "recibir"],
    close: true,
  },
  {
    name: "imprimible",
    keywords: ["imprimir", "imprimible", "pdf", "descargar", "descarga", "archivo"],
    close: true,
  },
  {
    name: "incluye",
    keywords: ["incluye", "contiene", "trae", "viene", "que incluye", "qué incluye", "material"],
    close: true,
  },
  {
    name: "tablas",
    keywords: ["tablas", "tabla", "multiplicaciones", "multiplicacion", "multiplicación"],
    close: true,
  },
  {
    name: "grado",
    keywords: ["grado", "primaria", "primero", "segundo", "tercero", "cuarto", "edad", "anos", "años"],
    close: true,
  },
  {
    name: "hojas",
    keywords: ["hojas", "paginas", "páginas", "cuantas hojas", "cuántas hojas", "cuantas paginas", "cuántas páginas"],
    close: true,
  },
  {
    name: "seguridad",
    keywords: ["seguro", "fraude", "estafa", "confiable", "confianza", "real", "si entregan", "sí entregan"],
    close: true,
  },
  {
    name: "objecionPrecio",
    keywords: ["caro", "muy caro", "no tengo dinero", "no me alcanza"],
    close: true,
  },
  {
    name: "pensar",
    keywords: ["lo voy a pensar", "despues", "después", "luego te digo", "luego"],
    close: false,
  },
  {
    name: "atrasado",
    keywords: ["atrasado", "batalla", "dificultad", "no sabe", "le cuesta", "se le dificulta"],
    close: true,
  },
  {
    name: "ubicacion",
    keywords: ["ubicados", "ubicacion", "ubicación", "donde estan", "dónde están", "direccion", "dirección"],
    close: true,
  },
];

function detectIntent(message = "") {
  const text = normalize(message);

  for (const intent of INTENTS) {
    if (intent.keywords.some((kw) => text.includes(normalize(kw)))) {
      return intent;
    }
  }

  return null;
}

/* =========================
   OPENAI FALLBACK
========================= */

async function generateAIResponse(userMessage) {
  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    temperature: 0.4,
    max_output_tokens: 220,
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  return cleanAIResponse(response.output_text || "");
}

/* =========================
   HANDLE MESSAGE
========================= */

async function handleMessage(req, res, format = "manychat") {
  try {
    const userMessage = extractUserMessage(req.body);

    if (!userMessage) {
      const reply = pick(DIRECT_RESPONSES.precio);
      return res.status(200).json(
        format === "manychat" ? manyChatResponse(reply) : plainResponse(reply)
      );
    }

    const intent = detectIntent(userMessage);

    if (intent && DIRECT_RESPONSES[intent.name]) {
      const baseReply = pick(DIRECT_RESPONSES[intent.name]);
      const reply = intent.close ? addClose(baseReply) : baseReply;

      return res.status(200).json(
        format === "manychat" ? manyChatResponse(reply) : plainResponse(reply)
      );
    }

    const aiReply = await generateAIResponse(userMessage);
    const reply = addClose(aiReply);

    return res.status(200).json(
      format === "manychat" ? manyChatResponse(reply) : plainResponse(reply)
    );
  } catch (error) {
    console.error("Error:", error);

    const reply = `Tuve un detalle técnico 🙏\n\n${paymentClose()}`;

    return res.status(200).json(
      format === "manychat"
        ? manyChatResponse(reply)
        : plainResponse(reply, false)
    );
  }
}

/* =========================
   RUTAS
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: `Agente ${PRODUCT.assistantName} activo 📚✨`,
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    product: PRODUCT.productName,
    assistant: PRODUCT.assistantName,
  });
});

app.post("/webhook", (req, res) => handleMessage(req, res, "manychat"));
app.post("/manychat", (req, res) => handleMessage(req, res, "manychat"));
app.post("/mensaje", (req, res) => handleMessage(req, res, "n8n"));
app.post("/n8n", (req, res) => handleMessage(req, res, "n8n"));

app.post("/openai", async (req, res) => {
  try {
    const userMessage = extractUserMessage(req.body);

    if (!userMessage) {
      return res.status(400).json({
        success: false,
        error: "No se recibió mensaje del usuario.",
      });
    }

    const reply = await generateAIResponse(userMessage);

    return res.status(200).json(plainResponse(reply));
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
