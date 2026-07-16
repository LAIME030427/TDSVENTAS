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
  comboName: "Combo Completo",
  comboPrice: "$99 MXN",
  comboExtra: "$30 MXN adicionales",
  delivery: "enlaces de Google Drive por WhatsApp",
  paymentMethods: ["Transferencia bancaria", "Depósito en OXXO"],
};

/* =========================
   PROMPT PRINCIPAL
========================= */

const SYSTEM_PROMPT = `
Eres Emilia, asesora humana, cálida y cercana de El Taller del Saber 📚✨

Atiendes por WhatsApp a mamás, papás y maestras que ya llegaron desde un embudo de ManyChat relacionado con materiales educativos digitales.

ROL PRINCIPAL
Tu función es brindar SOPORTE conversacional.
El embudo ya presenta el producto, beneficios, precio, métodos de pago y upsell.
No reinicies la venta completa salvo que la persona lo pida expresamente.

Tu estilo:
- Natural, breve y humano.
- Respuestas cortas tipo WhatsApp.
- Máximo 1 o 2 párrafos cortos.
- Usa emojis con moderación: 📚✒️😀👇👆✨🔢➕✖️➖😊😇❤️🙏
- No saludes con "Hola" cuando la conversación ya está iniciada.
- No digas que eres IA.
- No digas que eres ChatGPT.
- No suenes robótica.
- No presiones.
- No hagas preguntas innecesarias.
- No repitas toda la oferta si la persona solo hizo una pregunta puntual.
- Responde directamente a lo que la persona preguntó.

NEGOCIO
- Marca: El Taller del Saber.
- Nicho: educación.
- Producto principal: Sistema Progresivo de Multiplicaciones.
- La comunicación del anuncio comienza con dominar las tablas de multiplicar.
- Es material digital imprimible en PDF.
- Se entrega mediante enlaces de Google Drive por este mismo WhatsApp.
- Precio del producto principal: $69 MXN.
- Incluye el Sistema Progresivo de Multiplicaciones y como bono Matemáticas básicas.
- Matemáticas básicas incluye sumas, restas, cálculo mental y actividades progresivas.
- El sistema de multiplicaciones incluye más de 500 actividades imprimibles, tablas del 1 al 10, ejercicios progresivos, juegos matemáticos, bingo, dominó, rompecabezas, comecocos, material visual y recortable, guía práctica, diploma y seguimiento de avance.
- Upsell: Combo Completo por $99 MXN.
- El Combo Completo incluye Lectoescritura, Matemáticas básicas y Multiplicaciones.
- Para pasar del paquete de $69 al combo se agregan $30 MXN.
- Es pago único.
- No hay mensualidades.
- Métodos de pago: transferencia bancaria o depósito en OXXO.
- La entrega se realiza después de recibir el comprobante y de que el cliente escriba "listo".

SOPORTE ANTES DEL PAGO
- Si preguntan el precio, responde $69 MXN y menciona brevemente que incluye Multiplicaciones más el bono de Matemáticas básicas.
- Si preguntan por el combo, responde $99 MXN e indica que incluye Lectoescritura, Matemáticas básicas y Multiplicaciones.
- Si piden pagar por transferencia u OXXO, confirma el método y guía para que el flujo les comparta los datos.
- Si preguntan si se entrega por WhatsApp, confirma que sí, mediante enlaces de Google Drive.
- Si solicitan nuevamente la cuenta o CLABE, responde que se les compartirán nuevamente los datos por este mismo medio. No inventes números bancarios.

SOPORTE DE COMPROBANTES
- Si dicen "ya pagué", "aquí está el pago", "te mando el comprobante", "deposité", "transferí", "voucher", "baucher", "ticket" o envían comprobante, responde exactamente de forma breve: "Permíteme verificar🙏"
- No digas que el pago está confirmado hasta que el flujo o una persona lo valide.
- No vuelvas a vender.
- No vuelvas a pedir método de pago.
- No ofrezcas nuevamente el upsell.

SOPORTE DE ENTREGA
- Si dicen "listo", "mándame el material", "no me llegó", "envíame mis enlaces" o algo similar, responde: "Permíteme verificar tu pago y tus accesos🙏"
- Si preguntan cuánto tiempo tienen para descargar, indica que pueden hacerlo más tarde y que conviene guardar el mensaje con los enlaces.
- Si preguntan dónde vienen las tablas, indica que están en el material de Multiplicaciones, especialmente en el Bloque 3: Aprendiendo las tablas.
- Si preguntan si es PDF, confirma que es material digital imprimible en PDF.
- Si preguntan dónde están ubicados, explica que es una tienda digital y que la entrega se realiza por WhatsApp mediante Google Drive.
- Si preguntan cuántas hojas son, no inventes una cifra exacta. Explica que incluye más de 500 actividades organizadas en varios archivos y bloques.

PROBLEMAS DE ACCESO
- Si dicen que un enlace no abre, no descarga, pide acceso o no funciona, responde primero: "Permíteme verificar tus enlaces🙏"
- Después orienta de forma breve: los enlaces están funcionando; debe intentar abrirlos directamente en Google Drive. Si continúa el problema, pide que diga qué mensaje aparece.
- No prometas una revisión real de sistemas externos que no puedes consultar.

DESPUÉS DE LA ENTREGA
- Si preguntan si pueden descargar después, responde que sí y recomienda guardar el mensaje.
- Si preguntan si hay más material, menciona Lectoescritura, Matemáticas básicas y otros materiales educativos, sin iniciar una venta extensa.
- Si dicen "gracias", responde brevemente: "Un placer😊✨"

NUNCA DIGAS
- garantizado
- aprende en X días
- resultados asegurados
- sirve para todos los niños
- tu hijo aprenderá sí o sí
- cura problemas de aprendizaje
- últimos lugares
- promociones falsas
- información inventada
- material físico
- correo electrónico
- que el pago fue validado si no existe confirmación real

OBJETIVO
Resolver la duda concreta, dar soporte, orientar al pago cuando la persona lo solicita, recibir comprobantes y ayudar con la entrega o los accesos sin reemplazar el embudo.
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
    `El material cuesta ${PRODUCT.price}. Puedes pagar por transferencia bancaria o depósito en OXXO ✨\n¿Cuál método prefieres? 😊`,
    `El acceso cuesta ${PRODUCT.price}, pago único. Puedes elegir transferencia u OXXO 📚`,
    `Para obtenerlo, el pago es de ${PRODUCT.price} por transferencia u OXXO ✨`,
  ]);
}

function addClose(text) {
  const cleaned = cleanAIResponse(text);

  if (!cleaned) return paymentClose();

  const supportReply =
    /permíteme verificar|permiteme verificar|comprobante|ya pag|deposit|transfer[ií]|voucher|baucher|ticket|acceso|enlace|link|drive|descarg|no me lleg|material|gracias|un placer|bloque 3|pdf|whatsapp/i.test(cleaned);

  if (supportReply) return cleaned;

  const alreadyClosing =
    /transferencia|oxxo|datos|pago|pagar|cuenta|clabe|deposito|depósito/i.test(cleaned);

  if (alreadyClosing) return cleaned;

  return cleaned;
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
  comprobante: [
    `Permíteme verificar🙏`,
  ],

  esperandoComprobante: [
    `Muy bien 😊 Estoy al pendiente de tu comprobante 📲✨`,
    `Perfecto 😊 Quedo al pendiente de tu comprobante 🙏✨`,
  ],

  solicitarMaterial: [
    `Permíteme verificar tu pago y tus accesos🙏`,
  ],

  problemaEnlace: [
    `Permíteme verificar tus enlaces🙏`,
    `Permíteme revisar tus accesos🙏`,
  ],

  descargarDespues: [
    `Sí, puedes descargarlos más tarde sin problema 😊\nTe recomendamos guardar el mensaje donde recibiste tus enlaces 📚✨`,
    `Claro 😊 Puedes abrir y descargar el material más tarde. Guarda el mensaje para conservar tus accesos 📚`,
  ],

  ubicacionTablas: [
    `Las tablas están dentro del material de Multiplicaciones, especialmente en el Bloque 3: Aprendiendo las tablas 📚✖️`,
    `Las encontrarás en el pack de Multiplicaciones, principalmente en el Bloque 3 😊🔢`,
  ],

  masMaterial: [
    `Sí 😊 También contamos con Lectoescritura, Matemáticas básicas y otros materiales educativos 📚✨`,
    `Sí tenemos más material 😊 Hay opciones de Lectoescritura, Matemáticas y otros recursos educativos 📚`,
  ],

  gracias: [
    `Un placer😊✨`,
    `Gracias a ti por confiar en nosotros 😊✨`,
  ],

  comprar: [
    `El pack de Multiplicaciones cuesta ${PRODUCT.price} 😊\nIncluye el sistema completo y el bono de Matemáticas básicas. Puedes pagar por transferencia u OXXO.`,
    `Claro 😊 El material cuesta ${PRODUCT.price}, pago único, y se entrega por este mismo WhatsApp mediante enlaces de Google Drive 📚✨`,
  ],

  combo: [
    `El Combo Completo cuesta ${PRODUCT.comboPrice} 😊\nIncluye Lectoescritura, Matemáticas básicas y Multiplicaciones 📚✨`,
    `Por ${PRODUCT.comboExtra} al paquete principal puedes llevar el Combo Completo de ${PRODUCT.comboPrice}, con los 3 packs: Lectoescritura, Matemáticas y Multiplicaciones 😊`,
  ],

  precio: [
    `El pack de Multiplicaciones cuesta ${PRODUCT.price} 😊\nIncluye Multiplicaciones y como bono Matemáticas básicas 📚✨`,
    `Tiene un costo de ${PRODUCT.price}, pago único ✨\nSe entrega digital por este mismo WhatsApp mediante enlaces de Google Drive.`,
  ],

  incluye: [
    `Incluye el Sistema Progresivo de Multiplicaciones con más de 500 actividades, tablas del 1 al 10, ejercicios, juegos, material recortable, guía, diploma y seguimiento de avance 📚✨\nTambién recibes Matemáticas básicas como bono.`,
    `Viene muy completo 😊 Incluye multiplicaciones paso a paso, tablas, ejercicios, juegos, guía práctica y el bono de Matemáticas básicas.`,
  ],

  tablas: [
    `Sí, incluye las tablas de multiplicar del 1 al 10 ✖️🔢\nTambién trae ejercicios y juegos para practicarlas paso a paso.`,
    `Claro 😊 El material trabaja las tablas del 1 al 10 con actividades progresivas, práctica y juegos.`,
  ],

  grado: [
    `Puede utilizarse como apoyo en primaria, especialmente cuando el niño está comenzando o necesita reforzar las tablas 😊\nCada niño puede avanzar a su propio ritmo.`,
    `Está pensado para niños de primaria que comienzan o refuerzan multiplicaciones y tablas 📚✨`,
  ],

  hojas: [
    `Incluye más de 500 actividades organizadas en varios archivos y bloques 📚\nNo es una sola hoja ni un solo cuadernillo.`,
    `Son más de 500 actividades distribuidas por bloques y materiales 😊 No manejamos una cantidad única de hojas porque son varios archivos.`,
  ],

  imprimible: [
    `Sí, es material digital imprimible en PDF 😊\nLo recibes por Google Drive y puedes imprimir solo lo que vayas necesitando.`,
    `Así es 📚 Se entrega en formato digital para descargar e imprimir.`,
  ],

  entrega: [
    `Se entrega por este mismo WhatsApp mediante enlaces de Google Drive 😊📚\nDespués de recibir el comprobante y confirmar el pago.`,
    `La entrega es digital por WhatsApp ✨ Recibes los enlaces de Google Drive después de confirmar tu pago.`,
  ],

  oxxo: [
    `Sí, puedes pagar mediante depósito en OXXO 😊\nEl flujo te compartirá los datos para realizarlo.`,
    `Claro 📚 Tenemos depósito en OXXO en efectivo. Después compartes tu comprobante por este medio.`,
  ],

  transferencia: [
    `Claro 😊 Puedes pagar por transferencia bancaria. Te compartimos los datos por este mismo medio.`,
    `Sí, tenemos transferencia bancaria 📚✨\nDespués de realizarla, envía tu comprobante por este chat.`,
  ],

  reenviarDatos: [
    `Con gusto 😊 Te compartimos nuevamente los datos de pago por este mismo medio.`,
    `Claro 😊 Enseguida te volvemos a compartir los datos para transferencia.`,
  ],

  confirmarClabe: [
    `Así es 😊 Esa es la CLABE para realizar tu transferencia.`,
    `Es correcto 😊 Esa es la opción para transferir.`,
  ],

  seguridad: [
    `Entiendo tu duda 😊 La entrega se realiza por los canales oficiales de El Taller del Saber y recibes tus accesos por Google Drive después de confirmar el pago.`,
    `La entrega es digital por este mismo WhatsApp 📚✨ Después de validar el pago se comparten los enlaces.`,
  ],

  objecionPrecio: [
    `Te entiendo 😊 Por ${PRODUCT.price} recibes el Sistema de Multiplicaciones y el bono de Matemáticas básicas, todo listo para descargar e imprimir 📚✨`,
    `Comprendo 😊 Es un pago único de ${PRODUCT.price} e incluye más de 500 actividades organizadas por bloques.`,
  ],

  pensar: [
    `Claro 😊 Tómate tu tiempo. Si te surge alguna duda, aquí seguimos al pendiente 📚✨`,
    `Sin problema 😊 Cuando decidas retomarlo, con gusto te ayudamos.`,
  ],

  atrasado: [
    `Puede servir como material de apoyo y refuerzo 😊\nEstá organizado paso a paso, pero cada niño avanza a su propio ritmo.`,
    `Sí puede utilizarse para reforzar 📚 Lo ideal es comenzar desde el bloque que corresponda a sus conocimientos actuales.`,
  ],

  ubicacion: [
    `Somos una tienda digital 😊\nLa entrega se realiza por este mismo WhatsApp mediante enlaces de Google Drive.`,
    `Trabajamos de forma digital 📚✨ No necesitas acudir a un lugar; recibes el material por WhatsApp.`,
  ],

  video: [
    `No incluye clases en video 😊\nEs material digital imprimible con actividades, ejercicios, juegos y guías prácticas 📚✨`,
  ],
};

/* =========================
   INTENCIONES ORDENADAS
========================= */

const INTENTS = [
  {
    name: "comprobante",
    keywords: [
      "aqui esta el pago", "aquí está el pago", "aqui esta mi pago", "aquí está mi pago",
      "ya pague", "ya pagué", "hice el pago", "realice el pago", "realicé el pago",
      "mande el comprobante", "mandé el comprobante", "envio comprobante", "envío comprobante",
      "te mando el comprobante", "le envio el comprobante", "le envío el comprobante",
      "comprobante", "voucher", "baucher", "ticket", "recibo", "folio",
      "deposite", "deposité", "transferi", "transferí", "pago realizado"
    ],
    close: false,
  },
  {
    name: "esperandoComprobante",
    keywords: [
      "un momento le envio", "un momento le envío", "ahorita le envio", "ahorita le envío",
      "voy a pagar", "voy a transferir", "ahorita transfiero", "ahorita deposito",
      "en un momento", "espere un momento", "espera un momento"
    ],
    close: false,
  },
  {
    name: "problemaEnlace",
    keywords: [
      "no abre", "no puedo abrir", "no descarga", "no puedo descargar", "no funciona",
      "me pide acceso", "solicitar acceso", "problema con el link", "problema con el enlace",
      "enlace roto", "link roto", "drive no abre"
    ],
    close: false,
  },
  {
    name: "solicitarMaterial",
    keywords: [
      "mandame el material", "mándame el material", "manda el material", "envia el material", "envía el material",
      "no me llego", "no me llegó", "no he recibido", "no recibi", "no recibí",
      "mis enlaces", "mis accesos", "enviame mis enlaces", "envíame mis enlaces",
      "ya escribi listo", "ya escribí listo", "listo"
    ],
    close: false,
  },
  {
    name: "descargarDespues",
    keywords: [
      "cuanto tiempo tengo para descargar", "cuánto tiempo tengo para descargar",
      "puedo descargar despues", "puedo descargar después", "descargar mas tarde", "descargar más tarde",
      "oportunidad de descargar", "lo puedo abrir despues", "lo puedo abrir después"
    ],
    close: false,
  },
  {
    name: "ubicacionTablas",
    keywords: [
      "donde vienen las tablas", "dónde vienen las tablas", "donde estan las tablas", "dónde están las tablas",
      "en que bloque estan las tablas", "en qué bloque están las tablas"
    ],
    close: false,
  },
  {
    name: "masMaterial",
    keywords: [
      "tienes mas material", "tienes más material", "manejas mas material", "manejas más material",
      "otros materiales", "otro material"
    ],
    close: false,
  },
  {
    name: "gracias",
    keywords: ["gracias", "muchas gracias", "vale gracias", "ok gracias"],
    close: false,
  },
  {
    name: "combo",
    keywords: [
      "combo", "combo completo", "quiero los tres", "quiero el paquete completo",
      "lectoescritura tambien", "lectoescritura también", "los 3 packs", "paquete de 99", "son 99"
    ],
    close: false,
  },
  {
    name: "reenviarDatos",
    keywords: [
      "vuelve a enviar la cuenta", "volver a enviar la cuenta", "mandar otra vez la cuenta",
      "reenviar datos", "vuelve a mandar los datos", "me puede volver enviar", "me puedes volver enviar",
      "otra vez el numero de cuenta", "otra vez el número de cuenta"
    ],
    close: false,
  },
  {
    name: "confirmarClabe",
    keywords: [
      "es esta para transferir", "esta es para transferir", "esta es la clabe", "es esta la clabe",
      "esa es la clabe", "esa es para transferir"
    ],
    close: false,
  },
  {
    name: "comprar",
    keywords: [
      "quiero comprar", "quiero el pack", "lo quiero", "me interesa", "adquirir",
      "como compro", "cómo compro", "quiero multiplicaciones", "quiero las tablas"
    ],
    close: false,
  },
  {
    name: "oxxo",
    keywords: ["oxxo", "deposito en oxxo", "depósito en oxxo", "pagar en efectivo"],
    close: false,
  },
  {
    name: "transferencia",
    keywords: ["transferencia", "transferenciq", "banco", "spei", "pago por tarjeta"],
    close: false,
  },
  {
    name: "precio",
    keywords: [
      "precio", "cuesta", "costo", "vale", "cuanto sale", "cuánto sale", "cuanto cuesta", "cuánto cuesta",
      "a como", "a cómo", "69 pesos", "precio del set"
    ],
    close: false,
  },
  {
    name: "video",
    keywords: ["video", "videos", "clases"],
    close: false,
  },
  {
    name: "entrega",
    keywords: [
      "como lo recibo", "cómo lo recibo", "me lo mandan por whatsapp", "lo mandan por whatsapp",
      "por donde lo envian", "por dónde lo envían", "como entregan", "cómo entregan",
      "entrega", "google drive", "por drive"
    ],
    close: false,
  },
  {
    name: "imprimible",
    keywords: ["es pdf", "pdf", "imprimir", "imprimible", "archivo digital"],
    close: false,
  },
  {
    name: "incluye",
    keywords: ["que incluye", "qué incluye", "contiene", "que trae", "qué trae", "que viene", "qué viene"],
    close: false,
  },
  {
    name: "tablas",
    keywords: ["tablas", "tabla de multiplicar", "tablas de multiplicar", "multiplicaciones"],
    close: false,
  },
  {
    name: "grado",
    keywords: ["grado", "primaria", "primero", "segundo", "tercero", "cuarto", "edad", "anos", "años"],
    close: false,
  },
  {
    name: "hojas",
    keywords: ["hojas", "paginas", "páginas", "cuantas hojas", "cuántas hojas", "cuantas paginas", "cuántas páginas"],
    close: false,
  },
  {
    name: "seguridad",
    keywords: ["seguro", "fraude", "estafa", "confiable", "confianza", "real", "si entregan", "sí entregan"],
    close: false,
  },
  {
    name: "objecionPrecio",
    keywords: ["caro", "muy caro", "no tengo dinero", "no me alcanza"],
    close: false,
  },
  {
    name: "pensar",
    keywords: ["lo voy a pensar", "despues", "después", "luego te digo", "luego"],
    close: false,
  },
  {
    name: "atrasado",
    keywords: ["atrasado", "batalla", "dificultad", "no sabe", "le cuesta", "se le dificulta"],
    close: false,
  },
  {
    name: "ubicacion",
    keywords: ["ubicados", "ubicacion", "ubicación", "donde estan", "dónde están", "direccion", "dirección"],
    close: false,
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

    const reply = `Tuve un detalle técnico 🙏\n\nPermíteme revisarlo.`;

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
