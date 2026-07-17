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
El embudo ya presenta el producto, los beneficios, el precio, los métodos de pago y el upsell.
No reinicies la venta completa salvo que la persona lo pida expresamente.

TU ESTILO
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

INFORMACIÓN DEL NEGOCIO
- Marca: El Taller del Saber.
- Nicho: educación.
- Producto principal: Sistema Progresivo de Multiplicaciones.
- La oferta comienza con dominar las tablas de multiplicar.
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
- La entrega se realiza después de recibir el comprobante y confirmar el pago.

SOPORTE ANTES DEL PAGO
- Si preguntan el precio, responde $69 MXN y menciona brevemente que incluye Multiplicaciones más el bono de Matemáticas básicas.
- Si preguntan por el combo, responde $99 MXN e indica que incluye Lectoescritura, Matemáticas básicas y Multiplicaciones.
- Si piden pagar por transferencia u OXXO, confirma el método y guía para que el flujo les comparta los datos.
- Si preguntan si se entrega por WhatsApp, confirma que sí, mediante enlaces de Google Drive.
- Si solicitan nuevamente la cuenta o CLABE, responde que se les compartirán nuevamente los datos por este mismo medio. No inventes números bancarios.

SEGURIDAD Y CONFIANZA
- Si preguntan si es seguro, si sí llegará, si entregan, si tienen referencias o qué garantía tienen, responde con empatía.
- Explica que pueden revisar la página oficial de El Taller del Saber y los comentarios de otros clientes.
- Aclara que la entrega se realiza por este mismo WhatsApp mediante enlaces de Google Drive después de validar el pago.
- Nunca prometas algo falso ni utilices la palabra "garantizado".

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
- Si preguntan dónde están ubicados o dicen que enviarán su dirección, explica que no se necesita dirección porque es una tienda digital y la entrega se realiza por WhatsApp mediante Google Drive.
- Si preguntan cuántas hojas son, no inventes una cifra exacta. Explica que incluye más de 500 actividades organizadas en varios archivos y bloques.

PROBLEMAS DE ACCESO
- Si dicen que un enlace no abre, no descarga, pide acceso o no funciona, responde primero: "Permíteme verificar tus enlaces🙏"
- Después orienta de forma breve: los enlaces están funcionando; debe intentar abrirlos directamente desde Google Drive. Si continúa el problema, pide que diga qué mensaje aparece.
- No prometas una revisión real de sistemas externos que no puedes consultar.

DUDAS SOBRE EL NIÑO
- Si preguntan por edad, grado o si sirve para tercero o cuarto de primaria, responde que puede utilizarse como apoyo en primaria para comenzar o reforzar tablas y multiplicaciones.
- Cada niño avanza a su propio ritmo.
- No prometas resultados.
- Si mencionan TDAH, dislexia, autismo o dificultades de aprendizaje, explica que puede utilizarse como material de apoyo, pero no sustituye una valoración o acompañamiento profesional.

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

  apoyoEspecial: [
    `Puede utilizarse como material de apoyo 😊\nSin embargo, no sustituye una valoración ni el acompañamiento de un profesional, especialmente si existen necesidades específicas de aprendizaje.`,
    `Sí puede servir como apoyo para practicar paso a paso 📚✨\nLo ideal es adaptarlo al ritmo del niño y acompañarlo con la orientación profesional que ya reciba.`,
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

  direccion: [
    `No es necesario enviar dirección 😊\nEl material es digital y se entrega por este mismo WhatsApp mediante enlaces de Google Drive 📚✨`,
    `No ocupamos tu dirección 😊 La entrega no es física; recibes tus accesos por WhatsApp.`,
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
    `Entiendo tu duda 😊 Puedes revisar nuestra página oficial de El Taller del Saber y los comentarios de personas que ya han adquirido el material 📚✨\nLa entrega se realiza por este mismo WhatsApp después de confirmar el pago.`,
    `Claro 😊 Contamos con nuestra página oficial y referencias de clientes que ya recibieron su material 📚✨\nDespués de confirmar el pago, los accesos se envían por este mismo WhatsApp.`,
    `Es normal querer verificar antes de comprar 😊 Puedes consultar nuestra página y los comentarios de otros clientes.\nLa entrega se realiza mediante enlaces de Google Drive después de confirmar el pago 📚✨`,
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

  diploma: [
    `Sí 😊 El material incluye diploma imprimible y seguimiento de avance 📚✨`,
    `Así es 😊 Incluye un diploma imprimible y recursos para llevar el seguimiento del niño.`,
  ],

  matematicasBasicas: [
    `Sí 😊 El bono de Matemáticas básicas incluye sumas, restas, cálculo mental y actividades progresivas ➕➖📚`,
    `El bono trabaja sumas, restas y cálculo mental con ejercicios organizados paso a paso 😊`,
  ],
};
/* =========================
   INTENCIONES ORDENADAS
========================= */

/*
IMPORTANTE:
El orden de las intenciones sí importa.

Las intenciones más específicas deben colocarse antes que las generales.
Por ejemplo, "me lo entregarás" contiene la palabra "entrega", por eso
SEGURIDAD debe evaluarse antes que ENTREGA.
*/

const INTENTS = [
  {
    name: "comprobante",
    keywords: [
      "ya pague",
      "ya pagué",
      "ya deposite",
      "ya deposité",
      "ya transferi",
      "ya transferí",
      "hice el pago",
      "realice el pago",
      "realicé el pago",
      "aqui esta el pago",
      "aquí está el pago",
      "te mando el comprobante",
      "envio comprobante",
      "envío comprobante",
      "mande comprobante",
      "mandé comprobante",
      "adjunto comprobante",
      "comprobante de pago",
      "comprobante",
      "voucher",
      "baucher",
      "boucher",
      "ticket de pago",
      "ficha de deposito",
      "ficha de depósito",
      "pago realizado",
      "deposito realizado",
      "depósito realizado",
      "transferencia realizada",
    ],
    close: false,
  },

  {
    name: "esperandoComprobante",
    keywords: [
      "ahorita pago",
      "en un rato pago",
      "voy a pagar",
      "voy a depositar",
      "voy a transferir",
      "te envio comprobante",
      "te envío comprobante",
      "te mando el comprobante al rato",
      "cuando pague",
      "cuando deposite",
      "cuando transfiera",
      "mañana pago",
      "mas tarde pago",
      "más tarde pago",
    ],
    close: false,
  },

  {
    name: "problemaEnlace",
    keywords: [
      "no abre",
      "no me abre",
      "no puedo abrir",
      "no funciona el enlace",
      "no funciona el link",
      "link no funciona",
      "enlace no funciona",
      "no puedo entrar",
      "no me deja entrar",
      "me pide acceso",
      "solicitar acceso",
      "necesito acceso",
      "acceso denegado",
      "permiso denegado",
      "no tengo permiso",
      "no puedo descargar",
      "no descarga",
      "no me deja descargar",
      "error de descarga",
      "error en drive",
      "problema con drive",
      "problema con el enlace",
      "problema con el link",
      "enlace vencido",
      "link vencido",
      "archivo no disponible",
      "archivo eliminado",
    ],
    close: false,
  },

  {
    name: "solicitarMaterial",
    keywords: [
      "mandame el material",
      "mándame el material",
      "enviame el material",
      "envíame el material",
      "quiero mi material",
      "mis archivos",
      "mis enlaces",
      "mis links",
      "mandame mis enlaces",
      "mándame mis enlaces",
      "enviame mis enlaces",
      "envíame mis enlaces",
      "no me llego",
      "no me llegó",
      "aun no me llega",
      "aún no me llega",
      "todavia no me llega",
      "todavía no me llega",
      "no recibi el material",
      "no recibí el material",
      "cuando me lo mandan",
      "cuándo me lo mandan",
      "cuando me llega",
      "cuándo me llega",
      "ya me lo pueden enviar",
      "ya pueden enviarlo",
      "ya quedo",
      "ya quedó",
    ],
    close: false,
  },

  {
    name: "descargarDespues",
    keywords: [
      "puedo descargar despues",
      "puedo descargar después",
      "lo puedo descargar despues",
      "lo puedo descargar después",
      "descargar mas tarde",
      "descargar más tarde",
      "cuanto tiempo tengo para descargar",
      "cuánto tiempo tengo para descargar",
      "se vence el enlace",
      "se vence el link",
      "caduca el enlace",
      "caduca el link",
      "puedo guardarlo",
      "puedo abrirlo despues",
      "puedo abrirlo después",
      "puedo descargar otro dia",
      "puedo descargar otro día",
    ],
    close: false,
  },

  {
    name: "ubicacionTablas",
    keywords: [
      "donde vienen las tablas",
      "dónde vienen las tablas",
      "donde estan las tablas",
      "dónde están las tablas",
      "en que bloque estan las tablas",
      "en qué bloque están las tablas",
      "no encuentro las tablas",
      "cual archivo tiene las tablas",
      "cuál archivo tiene las tablas",
      "donde encuentro las tablas",
      "dónde encuentro las tablas",
      "bloque de las tablas",
    ],
    close: false,
  },

  {
    name: "seguridad",
    keywords: [
      "seguro",
      "segura",
      "seguridad",
      "confiable",
      "confianza",
      "fraude",
      "estafa",
      "asegura",
      "que me asegura",
      "qué me asegura",
      "garantia",
      "garantía",
      "referencia",
      "referencias",
      "tienen referencias",
      "tiene referencias",
      "comentarios de clientes",
      "opiniones",
      "testimonios",
      "es real",
      "son reales",
      "si es real",
      "sí es real",
      "si entregan",
      "sí entregan",
      "entregan de verdad",
      "me va a llegar",
      "si me va a llegar",
      "sí me va a llegar",
      "me lo entregan",
      "me lo entregaras",
      "me lo entregarás",
      "como se que me lo entregan",
      "cómo sé que me lo entregan",
      "como se que no es fraude",
      "cómo sé que no es fraude",
      "no quiero que me estafen",
      "me da desconfianza",
      "puedo confiar",
      "pagina oficial",
      "página oficial",
    ],
    close: false,
  },

  {
    name: "apoyoEspecial",
    keywords: [
      "tdah",
      "deficit de atencion",
      "déficit de atención",
      "hiperactividad",
      "dislexia",
      "autismo",
      "tea",
      "asperger",
      "problema de aprendizaje",
      "problemas de aprendizaje",
      "dificultad de aprendizaje",
      "dificultades de aprendizaje",
      "necesidades especiales",
      "educacion especial",
      "educación especial",
      "no se concentra",
      "le cuesta concentrarse",
      "se distrae mucho",
      "tiene diagnostico",
      "tiene diagnóstico",
    ],
    close: false,
  },

  {
    name: "atrasado",
    keywords: [
      "va atrasado",
      "esta atrasado",
      "está atrasado",
      "tiene rezago",
      "rezago escolar",
      "no sabe multiplicar",
      "no se sabe las tablas",
      "se le dificultan las tablas",
      "se le complica multiplicar",
      "le cuesta multiplicar",
      "no entiende las multiplicaciones",
      "no aprende las tablas",
      "se le olvidan las tablas",
      "batalla con las tablas",
      "tiene dificultad con matematicas",
      "tiene dificultad con matemáticas",
    ],
    close: false,
  },

  {
    name: "grado",
    keywords: [
      "que edad",
      "qué edad",
      "para que edad",
      "para qué edad",
      "que grado",
      "qué grado",
      "para que grado",
      "para qué grado",
      "primero de primaria",
      "primer grado",
      "segundo de primaria",
      "segundo grado",
      "tercero de primaria",
      "tercer grado",
      "cuarto de primaria",
      "cuarto grado",
      "quinto de primaria",
      "quinto grado",
      "sexto de primaria",
      "sexto grado",
      "primaria",
      "para un niño de",
      "para una niña de",
      "años de edad",
      "le sirve a mi hijo",
      "le sirve a mi hija",
      "sirve para tercero",
      "sirve para cuarto",
    ],
    close: false,
  },

  {
    name: "direccion",
    keywords: [
      "direccion",
      "dirección",
      "mi domicilio",
      "domicilio",
      "te paso mi direccion",
      "te paso mi dirección",
      "donde lo envian",
      "dónde lo envían",
      "envio a domicilio",
      "envío a domicilio",
      "paqueteria",
      "paquetería",
      "costo de envio",
      "costo de envío",
      "hacen envios",
      "hacen envíos",
      "envian fisico",
      "envían físico",
      "llega a mi casa",
      "codigo postal",
      "código postal",
    ],
    close: false,
  },

  {
    name: "ubicacion",
    keywords: [
      "donde estan ubicados",
      "dónde están ubicados",
      "donde se ubican",
      "dónde se ubican",
      "ubicacion",
      "ubicación",
      "de donde son",
      "de dónde son",
      "tienen local",
      "tienen tienda fisica",
      "tienen tienda física",
      "puedo ir",
      "puedo recoger",
      "entrega personal",
      "en que ciudad estan",
      "en qué ciudad están",
    ],
    close: false,
  },

  {
    name: "confirmarClabe",
    keywords: [
      "esta es la clabe",
      "ésta es la clabe",
      "esa es la clabe",
      "es esta la clabe",
      "es ésta la clabe",
      "confirmame la clabe",
      "confírmame la clabe",
      "a esta clabe",
      "transfiero a esta",
      "deposito a esta cuenta",
    ],
    close: false,
  },

  {
    name: "reenviarDatos",
    keywords: [
      "mandame otra vez la cuenta",
      "mándame otra vez la cuenta",
      "reenviame la cuenta",
      "reenvíame la cuenta",
      "vuelve a mandar la cuenta",
      "no encuentro la cuenta",
      "no veo la cuenta",
      "mandame la clabe",
      "mándame la clabe",
      "reenviame la clabe",
      "reenvíame la clabe",
      "datos bancarios otra vez",
      "datos de pago otra vez",
      "me repites los datos",
      "me vuelves a compartir los datos",
    ],
    close: false,
  },

  {
    name: "oxxo",
    keywords: [
      "oxxo",
      "pagar en oxxo",
      "pago en oxxo",
      "deposito en oxxo",
      "depósito en oxxo",
      "puedo pagar en efectivo",
      "pago en efectivo",
      "depositar en efectivo",
      "ficha para oxxo",
      "referencia para oxxo",
      "numero para oxxo",
      "número para oxxo",
    ],
    close: false,
  },

  {
    name: "transferencia",
    keywords: [
      "transferencia",
      "transferir",
      "quiero transferir",
      "pagar por transferencia",
      "pago por transferencia",
      "datos para transferir",
      "datos bancarios",
      "cuenta bancaria",
      "numero de cuenta",
      "número de cuenta",
      "clabe",
      "spei",
      "banco",
      "a que cuenta",
      "a qué cuenta",
    ],
    close: false,
  },

  {
    name: "combo",
    keywords: [
      "combo",
      "combo completo",
      "paquete completo",
      "los tres materiales",
      "los 3 materiales",
      "los tres packs",
      "los 3 packs",
      "lectoescritura matematicas multiplicaciones",
      "lectoescritura matemáticas multiplicaciones",
      "todo el material",
      "quiero los tres",
      "quiero los 3",
      "paquete de 99",
      "combo de 99",
      "por 99",
      "agregar lectoescritura",
      "tambien lectoescritura",
      "también lectoescritura",
    ],
    close: false,
  },

  {
    name: "matematicasBasicas",
    keywords: [
      "matematicas basicas",
      "matemáticas básicas",
      "bono de matematicas",
      "bono de matemáticas",
      "sumas y restas",
      "sumas",
      "restas",
      "calculo mental",
      "cálculo mental",
      "que trae matematicas",
      "qué trae matemáticas",
      "contenido de matematicas",
      "contenido de matemáticas",
    ],
    close: false,
  },

  {
    name: "video",
    keywords: [
      "incluye videos",
      "incluye video",
      "trae videos",
      "trae video",
      "son clases",
      "clases en video",
      "videoclases",
      "tutoriales",
      "curso en video",
      "explicacion en video",
      "explicación en video",
    ],
    close: false,
  },

  {
    name: "diploma",
    keywords: [
      "incluye diploma",
      "trae diploma",
      "diploma",
      "certificado",
      "reconocimiento",
      "seguimiento de avance",
      "control de avance",
    ],
    close: false,
  },

  {
    name: "hojas",
    keywords: [
      "cuantas hojas",
      "cuántas hojas",
      "cantidad de hojas",
      "numero de hojas",
      "número de hojas",
      "cuantas paginas",
      "cuántas páginas",
      "cantidad de paginas",
      "cantidad de páginas",
      "cuantos archivos",
      "cuántos archivos",
      "cuanto material",
      "cuánto material",
      "mas de 500",
      "más de 500",
    ],
    close: false,
  },

  {
    name: "imprimible",
    keywords: [
      "pdf",
      "es pdf",
      "formato pdf",
      "imprimir",
      "imprimible",
      "se puede imprimir",
      "puedo imprimir",
      "lo puedo imprimir",
      "es digital",
      "material digital",
      "archivo digital",
      "fisico o digital",
      "físico o digital",
      "es fisico",
      "es físico",
      "viene impreso",
      "mandan cuadernillos",
    ],
    close: false,
  },

  {
    name: "ubicacionTablas",
    keywords: [
      "bloque 3",
      "aprendiendo las tablas",
      "archivo de tablas",
      "carpeta de tablas",
    ],
    close: false,
  },

  {
    name: "tablas",
    keywords: [
      "tablas",
      "tabla de multiplicar",
      "tablas de multiplicar",
      "del 1 al 10",
      "tabla del 2",
      "tabla del 3",
      "tabla del 4",
      "tabla del 5",
      "tabla del 6",
      "tabla del 7",
      "tabla del 8",
      "tabla del 9",
      "tabla del 10",
      "aprender las tablas",
      "practicar las tablas",
      "memorizar las tablas",
    ],
    close: false,
  },

  {
    name: "incluye",
    keywords: [
      "que incluye",
      "qué incluye",
      "que contiene",
      "qué contiene",
      "que trae",
      "qué trae",
      "contenido",
      "como viene",
      "cómo viene",
      "que recibo",
      "qué recibo",
      "que material trae",
      "qué material trae",
      "actividades",
      "juegos",
      "bonos",
      "viene completo",
    ],
    close: false,
  },

  {
    name: "entrega",
    keywords: [
      "entrega",
      "como entregan",
      "cómo entregan",
      "como me lo envian",
      "cómo me lo envían",
      "por donde llega",
      "por dónde llega",
      "entrega por whatsapp",
      "lo mandan por whatsapp",
      "envian por whatsapp",
      "envían por whatsapp",
      "google drive",
      "drive",
      "enlaces",
      "links",
      "como recibo",
      "cómo recibo",
      "cuando entregan",
      "cuándo entregan",
      "tiempo de entrega",
    ],
    close: false,
  },

  {
    name: "objecionPrecio",
    keywords: [
      "esta caro",
      "está caro",
      "muy caro",
      "se me hace caro",
      "no tengo dinero",
      "no me alcanza",
      "esta fuera de mi presupuesto",
      "está fuera de mi presupuesto",
      "no puedo pagarlo",
      "algo mas barato",
      "algo más barato",
      "descuento",
      "rebaja",
      "menos precio",
    ],
    close: false,
  },

  {
    name: "pensar",
    keywords: [
      "lo voy a pensar",
      "dejame pensarlo",
      "déjame pensarlo",
      "despues veo",
      "después veo",
      "luego te aviso",
      "mas tarde decido",
      "más tarde decido",
      "por ahora no",
      "todavia no",
      "todavía no",
      "lo consulto",
      "voy a consultarlo",
    ],
    close: false,
  },

  {
    name: "precio",
    keywords: [
      "precio",
      "costo",
      "cuanto cuesta",
      "cuánto cuesta",
      "cuanto vale",
      "cuánto vale",
      "que precio tiene",
      "qué precio tiene",
      "en cuanto esta",
      "en cuánto está",
      "valor",
      "69",
      "$69",
      "sesenta y nueve",
      "pago unico",
      "pago único",
      "mensualidad",
      "mensualidades",
    ],
    close: false,
  },

  {
    name: "comprar",
    keywords: [
      "quiero comprar",
      "quiero adquirirlo",
      "quiero el material",
      "quiero el pack",
      "me interesa",
      "estoy interesada",
      "estoy interesado",
      "como compro",
      "cómo compro",
      "como lo adquiero",
      "cómo lo adquiero",
      "donde pago",
      "dónde pago",
      "quiero pagar",
      "lo quiero",
      "quiero pedirlo",
      "quiero obtenerlo",
      "quiero adquirir",
    ],
    close: true,
  },

  {
    name: "masMaterial",
    keywords: [
      "tienen mas material",
      "tienen más material",
      "hay mas material",
      "hay más material",
      "otros materiales",
      "otro material",
      "que mas venden",
      "qué más venden",
      "tienen lectoescritura",
      "tienen matematicas",
      "tienen matemáticas",
      "material de lectura",
      "material de español",
      "otros packs",
      "otros cursos",
    ],
    close: false,
  },

  {
    name: "gracias",
    keywords: [
      "gracias",
      "muchas gracias",
      "mil gracias",
      "te agradezco",
      "muy amable",
      "excelente gracias",
      "perfecto gracias",
      "ok gracias",
    ],
    close: false,
  },
];

/* =========================
   DETECCIÓN DE INTENCIONES
========================= */

function detectIntent(message = "") {
  const normalizedMessage = normalize(message);

  if (!normalizedMessage) return null;

  for (const intent of INTENTS) {
    const matched = intent.keywords.some((keyword) => {
      const normalizedKeyword = normalize(keyword);
      return normalizedMessage.includes(normalizedKeyword);
    });

    if (matched) {
      return intent;
    }
  }

  return null;
}

function getDirectResponse(intentName) {
  const responses = DIRECT_RESPONSES[intentName];

  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    return null;
  }

  return pick(responses);
}

/* =========================
   INTENCIONES ORDENADAS
========================= */

/*
IMPORTANTE:
El orden de las intenciones sí importa.

Las intenciones específicas deben evaluarse antes que las generales.

Ejemplo:
"¿Qué me asegura que me lo entregarás?"

Contiene la palabra "entrega", pero la duda real es de seguridad.
Por eso "seguridad" aparece antes que "entrega".
*/

const INTENTS = [
  {
    name: "comprobante",
    keywords: [
      "ya pague",
      "ya pagué",
      "ya deposite",
      "ya deposité",
      "ya transferi",
      "ya transferí",
      "hice el pago",
      "realice el pago",
      "realicé el pago",
      "aqui esta el pago",
      "aquí está el pago",
      "te mando el comprobante",
      "te envio el comprobante",
      "te envío el comprobante",
      "envio comprobante",
      "envío comprobante",
      "mande comprobante",
      "mandé comprobante",
      "adjunto comprobante",
      "comprobante de pago",
      "comprobante",
      "voucher",
      "baucher",
      "boucher",
      "ticket de pago",
      "ficha de deposito",
      "ficha de depósito",
      "pago realizado",
      "deposito realizado",
      "depósito realizado",
      "transferencia realizada",
    ],
    close: false,
  },

  {
    name: "esperandoComprobante",
    keywords: [
      "ahorita pago",
      "en un rato pago",
      "voy a pagar",
      "voy a depositar",
      "voy a transferir",
      "te envio comprobante",
      "te envío comprobante",
      "te mando el comprobante al rato",
      "cuando pague",
      "cuando deposite",
      "cuando transfiera",
      "mañana pago",
      "mas tarde pago",
      "más tarde pago",
    ],
    close: false,
  },

  {
    name: "problemaEnlace",
    keywords: [
      "no abre",
      "no me abre",
      "no puedo abrir",
      "no funciona el enlace",
      "no funciona el link",
      "link no funciona",
      "enlace no funciona",
      "no puedo entrar",
      "no me deja entrar",
      "me pide acceso",
      "solicitar acceso",
      "necesito acceso",
      "acceso denegado",
      "permiso denegado",
      "no tengo permiso",
      "no puedo descargar",
      "no descarga",
      "no me deja descargar",
      "error de descarga",
      "error en drive",
      "problema con drive",
      "problema con el enlace",
      "problema con el link",
      "enlace vencido",
      "link vencido",
      "archivo no disponible",
      "archivo eliminado",
    ],
    close: false,
  },

  {
    name: "solicitarMaterial",
    keywords: [
      "mandame el material",
      "mándame el material",
      "enviame el material",
      "envíame el material",
      "quiero mi material",
      "mis archivos",
      "mis enlaces",
      "mis links",
      "mandame mis enlaces",
      "mándame mis enlaces",
      "enviame mis enlaces",
      "envíame mis enlaces",
      "no me llego",
      "no me llegó",
      "aun no me llega",
      "aún no me llega",
      "todavia no me llega",
      "todavía no me llega",
      "no recibi el material",
      "no recibí el material",
      "cuando me lo mandan",
      "cuándo me lo mandan",
      "cuando me llega",
      "cuándo me llega",
      "ya me lo pueden enviar",
      "ya pueden enviarlo",
      "ya quedo",
      "ya quedó",
    ],
    close: false,
  },

  {
    name: "descargarDespues",
    keywords: [
      "puedo descargar despues",
      "puedo descargar después",
      "lo puedo descargar despues",
      "lo puedo descargar después",
      "descargar mas tarde",
      "descargar más tarde",
      "cuanto tiempo tengo para descargar",
      "cuánto tiempo tengo para descargar",
      "se vence el enlace",
      "se vence el link",
      "caduca el enlace",
      "caduca el link",
      "puedo guardarlo",
      "puedo abrirlo despues",
      "puedo abrirlo después",
      "puedo descargar otro dia",
      "puedo descargar otro día",
    ],
    close: false,
  },

  {
    name: "ubicacionTablas",
    keywords: [
      "donde vienen las tablas",
      "dónde vienen las tablas",
      "donde estan las tablas",
      "dónde están las tablas",
      "en que bloque estan las tablas",
      "en qué bloque están las tablas",
      "no encuentro las tablas",
      "cual archivo tiene las tablas",
      "cuál archivo tiene las tablas",
      "donde encuentro las tablas",
      "dónde encuentro las tablas",
      "bloque de las tablas",
      "bloque 3",
      "aprendiendo las tablas",
      "archivo de tablas",
      "carpeta de tablas",
    ],
    close: false,
  },

  {
    name: "seguridad",
    keywords: [
      "es seguro",
      "es segura",
      "que tan seguro",
      "qué tan seguro",
      "seguridad",
      "confiable",
      "puedo confiar",
      "confianza",
      "fraude",
      "estafa",
      "asegura",
      "que me asegura",
      "qué me asegura",
      "garantia",
      "garantía",
      "referencia",
      "referencias",
      "tienen referencias",
      "tiene referencias",
      "comentarios de clientes",
      "opiniones",
      "testimonios",
      "es real",
      "son reales",
      "si es real",
      "sí es real",
      "si entregan",
      "sí entregan",
      "entregan de verdad",
      "me va a llegar",
      "si me va a llegar",
      "sí me va a llegar",
      "me lo entregan",
      "me lo entregaras",
      "me lo entregarás",
      "como se que me lo entregan",
      "cómo sé que me lo entregan",
      "como se que no es fraude",
      "cómo sé que no es fraude",
      "no quiero que me estafen",
      "me da desconfianza",
      "pagina oficial",
      "página oficial",
    ],
    close: false,
  },

  {
    name: "apoyoEspecial",
    keywords: [
      "tdah",
      "deficit de atencion",
      "déficit de atención",
      "hiperactividad",
      "dislexia",
      "autismo",
      "asperger",
      "problema de aprendizaje",
      "problemas de aprendizaje",
      "dificultad de aprendizaje",
      "dificultades de aprendizaje",
      "necesidades especiales",
      "educacion especial",
      "educación especial",
      "no se concentra",
      "le cuesta concentrarse",
      "se distrae mucho",
      "tiene diagnostico",
      "tiene diagnóstico",
    ],
    close: false,
  },

  {
    name: "atrasado",
    keywords: [
      "va atrasado",
      "esta atrasado",
      "está atrasado",
      "tiene rezago",
      "rezago escolar",
      "no sabe multiplicar",
      "no se sabe las tablas",
      "se le dificultan las tablas",
      "se le complica multiplicar",
      "le cuesta multiplicar",
      "no entiende las multiplicaciones",
      "no aprende las tablas",
      "se le olvidan las tablas",
      "batalla con las tablas",
      "tiene dificultad con matematicas",
      "tiene dificultad con matemáticas",
    ],
    close: false,
  },

  {
    name: "grado",
    keywords: [
      "que edad",
      "qué edad",
      "para que edad",
      "para qué edad",
      "que grado",
      "qué grado",
      "para que grado",
      "para qué grado",
      "primero de primaria",
      "primer grado",
      "segundo de primaria",
      "segundo grado",
      "tercero de primaria",
      "tercer grado",
      "cuarto de primaria",
      "cuarto grado",
      "quinto de primaria",
      "quinto grado",
      "sexto de primaria",
      "sexto grado",
      "para primaria",
      "para un niño de",
      "para una niña de",
      "años de edad",
      "le sirve a mi hijo",
      "le sirve a mi hija",
      "sirve para tercero",
      "sirve para cuarto",
    ],
    close: false,
  },

  {
    name: "direccion",
    keywords: [
      "te paso mi direccion",
      "te paso mi dirección",
      "mi domicilio",
      "donde lo envian",
      "dónde lo envían",
      "envio a domicilio",
      "envío a domicilio",
      "paqueteria",
      "paquetería",
      "costo de envio",
      "costo de envío",
      "hacen envios",
      "hacen envíos",
      "envian fisico",
      "envían físico",
      "llega a mi casa",
      "codigo postal",
      "código postal",
    ],
    close: false,
  },

  {
    name: "ubicacion",
    keywords: [
      "donde estan ubicados",
      "dónde están ubicados",
      "donde se ubican",
      "dónde se ubican",
      "ubicacion",
      "ubicación",
      "de donde son",
      "de dónde son",
      "tienen local",
      "tienen tienda fisica",
      "tienen tienda física",
      "puedo ir",
      "puedo recoger",
      "entrega personal",
      "en que ciudad estan",
      "en qué ciudad están",
    ],
    close: false,
  },

  {
    name: "confirmarClabe",
    keywords: [
      "esta es la clabe",
      "ésta es la clabe",
      "esa es la clabe",
      "es esta la clabe",
      "es ésta la clabe",
      "confirmame la clabe",
      "confírmame la clabe",
      "a esta clabe",
      "transfiero a esta",
      "deposito a esta cuenta",
    ],
    close: false,
  },

  {
    name: "reenviarDatos",
    keywords: [
      "mandame otra vez la cuenta",
      "mándame otra vez la cuenta",
      "reenviame la cuenta",
      "reenvíame la cuenta",
      "vuelve a mandar la cuenta",
      "no encuentro la cuenta",
      "no veo la cuenta",
      "mandame la clabe",
      "mándame la clabe",
      "reenviame la clabe",
      "reenvíame la clabe",
      "datos bancarios otra vez",
      "datos de pago otra vez",
      "me repites los datos",
      "me vuelves a compartir los datos",
    ],
    close: false,
  },

  {
    name: "oxxo",
    keywords: [
      "oxxo",
      "pagar en oxxo",
      "pago en oxxo",
      "deposito en oxxo",
      "depósito en oxxo",
      "puedo pagar en efectivo",
      "pago en efectivo",
      "depositar en efectivo",
      "ficha para oxxo",
      "referencia para oxxo",
      "numero para oxxo",
      "número para oxxo",
    ],
    close: false,
  },

  {
    name: "transferencia",
    keywords: [
      "transferencia",
      "transferir",
      "quiero transferir",
      "pagar por transferencia",
      "pago por transferencia",
      "datos para transferir",
      "datos bancarios",
      "cuenta bancaria",
      "numero de cuenta",
      "número de cuenta",
      "clabe",
      "spei",
      "banco",
      "a que cuenta",
      "a qué cuenta",
    ],
    close: false,
  },

  {
    name: "combo",
    keywords: [
      "combo",
      "combo completo",
      "paquete completo",
      "los tres materiales",
      "los 3 materiales",
      "los tres packs",
      "los 3 packs",
      "lectoescritura matematicas multiplicaciones",
      "lectoescritura matemáticas multiplicaciones",
      "todo el material",
      "quiero los tres",
      "quiero los 3",
      "paquete de 99",
      "combo de 99",
      "por 99",
      "agregar lectoescritura",
      "tambien lectoescritura",
      "también lectoescritura",
    ],
    close: false,
  },

  {
    name: "matematicasBasicas",
    keywords: [
      "matematicas basicas",
      "matemáticas básicas",
      "bono de matematicas",
      "bono de matemáticas",
      "sumas y restas",
      "calculo mental",
      "cálculo mental",
      "que trae matematicas",
      "qué trae matemáticas",
      "contenido de matematicas",
      "contenido de matemáticas",
    ],
    close: false,
  },

  {
    name: "video",
    keywords: [
      "incluye videos",
      "incluye video",
      "trae videos",
      "trae video",
      "son clases",
      "clases en video",
      "videoclases",
      "tutoriales",
      "curso en video",
      "explicacion en video",
      "explicación en video",
    ],
    close: false,
  },

  {
    name: "diploma",
    keywords: [
      "incluye diploma",
      "trae diploma",
      "diploma",
      "certificado",
      "reconocimiento",
      "seguimiento de avance",
      "control de avance",
    ],
    close: false,
  },

  {
    name: "hojas",
    keywords: [
      "cuantas hojas",
      "cuántas hojas",
      "cantidad de hojas",
      "numero de hojas",
      "número de hojas",
      "cuantas paginas",
      "cuántas páginas",
      "cantidad de paginas",
      "cantidad de páginas",
      "cuantos archivos",
      "cuántos archivos",
      "cuanto material",
      "cuánto material",
      "mas de 500",
      "más de 500",
    ],
    close: false,
  },

  {
    name: "imprimible",
    keywords: [
      "es pdf",
      "formato pdf",
      "imprimir",
      "imprimible",
      "se puede imprimir",
      "puedo imprimir",
      "lo puedo imprimir",
      "es digital",
      "material digital",
      "archivo digital",
      "fisico o digital",
      "físico o digital",
      "es fisico",
      "es físico",
      "viene impreso",
      "mandan cuadernillos",
    ],
    close: false,
  },

  {
    name: "tablas",
    keywords: [
      "tablas",
      "tabla de multiplicar",
      "tablas de multiplicar",
      "del 1 al 10",
      "tabla del 2",
      "tabla del 3",
      "tabla del 4",
      "tabla del 5",
      "tabla del 6",
      "tabla del 7",
      "tabla del 8",
      "tabla del 9",
      "tabla del 10",
      "aprender las tablas",
      "practicar las tablas",
      "memorizar las tablas",
    ],
    close: false,
  },

  {
    name: "incluye",
    keywords: [
      "que incluye",
      "qué incluye",
      "que contiene",
      "qué contiene",
      "que trae",
      "qué trae",
      "contenido",
      "como viene",
      "cómo viene",
      "que recibo",
      "qué recibo",
      "que material trae",
      "qué material trae",
      "viene completo",
    ],
    close: false,
  },

  {
    name: "entrega",
    keywords: [
      "como entregan",
      "cómo entregan",
      "como me lo envian",
      "cómo me lo envían",
      "por donde llega",
      "por dónde llega",
      "entrega por whatsapp",
      "lo mandan por whatsapp",
      "envian por whatsapp",
      "envían por whatsapp",
      "google drive",
      "por drive",
      "enlaces de drive",
      "links de drive",
      "como recibo",
      "cómo recibo",
      "cuando entregan",
      "cuándo entregan",
      "tiempo de entrega",
    ],
    close: false,
  },

  {
    name: "objecionPrecio",
    keywords: [
      "esta caro",
      "está caro",
      "muy caro",
      "se me hace caro",
      "no tengo dinero",
      "no me alcanza",
      "esta fuera de mi presupuesto",
      "está fuera de mi presupuesto",
      "no puedo pagarlo",
      "algo mas barato",
      "algo más barato",
      "descuento",
      "rebaja",
      "menos precio",
    ],
    close: false,
  },

  {
    name: "pensar",
    keywords: [
      "lo voy a pensar",
      "dejame pensarlo",
      "déjame pensarlo",
      "despues veo",
      "después veo",
      "luego te aviso",
      "mas tarde decido",
      "más tarde decido",
      "por ahora no",
      "todavia no",
      "todavía no",
      "lo consulto",
      "voy a consultarlo",
    ],
    close: false,
  },

  {
    name: "precio",
    keywords: [
      "precio",
      "costo",
      "cuanto cuesta",
      "cuánto cuesta",
      "cuanto vale",
      "cuánto vale",
      "que precio tiene",
      "qué precio tiene",
      "en cuanto esta",
      "en cuánto está",
      "valor",
      "$69",
      "sesenta y nueve",
      "pago unico",
      "pago único",
      "mensualidad",
      "mensualidades",
    ],
    close: false,
  },

  {
    name: "comprar",
    keywords: [
      "quiero comprar",
      "quiero adquirirlo",
      "quiero el material",
      "quiero el pack",
      "me interesa",
      "estoy interesada",
      "estoy interesado",
      "como compro",
      "cómo compro",
      "como lo adquiero",
      "cómo lo adquiero",
      "donde pago",
      "dónde pago",
      "quiero pagar",
      "lo quiero",
      "quiero pedirlo",
      "quiero obtenerlo",
      "quiero adquirir",
    ],
    close: true,
  },

  {
    name: "masMaterial",
    keywords: [
      "tienen mas material",
      "tienen más material",
      "hay mas material",
      "hay más material",
      "otros materiales",
      "otro material",
      "que mas venden",
      "qué más venden",
      "tienen lectoescritura",
      "tienen matematicas",
      "tienen matemáticas",
      "material de lectura",
      "material de español",
      "otros packs",
      "otros cursos",
    ],
    close: false,
  },

  {
    name: "gracias",
    keywords: [
      "gracias",
      "muchas gracias",
      "mil gracias",
      "te agradezco",
      "muy amable",
      "excelente gracias",
      "perfecto gracias",
      "ok gracias",
    ],
    close: false,
  },
];

/* =========================
   DETECCIÓN DE INTENCIONES
========================= */

function detectIntent(message = "") {
  const normalizedMessage = normalize(message);

  if (!normalizedMessage) return null;

  for (const intent of INTENTS) {
    const matched = intent.keywords.some((keyword) => {
      const normalizedKeyword = normalize(keyword);

      return normalizedMessage.includes(normalizedKeyword);
    });

    if (matched) {
      return intent;
    }
  }

  return null;
}

function getDirectResponse(intentName) {
  const responses = DIRECT_RESPONSES[intentName];

  if (
    !responses ||
    !Array.isArray(responses) ||
    responses.length === 0
  ) {
    return null;
  }

  return pick(responses);
}

/* =========================
   RESPUESTA CON OPENAI
========================= */

async function generateAIResponse(userMessage) {
  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature: 0.4,
      max_output_tokens: 220,
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    return cleanAIResponse(response.output_text || "");
  } catch (error) {
    console.error("Error al generar respuesta con OpenAI:", error);

    return "";
  }
}

/* =========================
   MANEJO DEL MENSAJE
========================= */

async function handleMessage(req, res, format = "manychat") {
  try {
    const userMessage = extractUserMessage(req.body);

    console.log("Mensaje recibido:", userMessage || "(vacío)");

    if (!userMessage) {
      const reply = pick(DIRECT_RESPONSES.precio);

      return res.status(200).json(
        format === "manychat"
          ? manyChatResponse(reply)
          : plainResponse(reply)
      );
    }

    const intent = detectIntent(userMessage);

    if (intent) {
      console.log("Intención detectada:", intent.name);

      const directReply = getDirectResponse(intent.name);

      if (directReply) {
        const reply = intent.close
          ? addClose(directReply)
          : directReply;

        return res.status(200).json(
          format === "manychat"
            ? manyChatResponse(reply)
            : plainResponse(reply)
        );
      }
    }

    console.log("Sin respuesta directa. Enviando a OpenAI.");

    const aiReply = await generateAIResponse(userMessage);

    const reply = aiReply
      ? addClose(aiReply)
      : `Permíteme revisar tu mensaje para ayudarte correctamente🙏`;

    return res.status(200).json(
      format === "manychat"
        ? manyChatResponse(reply)
        : plainResponse(reply)
    );
  } catch (error) {
    console.error("Error general al procesar el mensaje:", error);

    const reply = `Tuve un detalle técnico 🙏\nPermíteme revisarlo.`;

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

app.post("/webhook", (req, res) => {
  return handleMessage(req, res, "manychat");
});

app.post("/manychat", (req, res) => {
  return handleMessage(req, res, "manychat");
});

app.post("/mensaje", (req, res) => {
  return handleMessage(req, res, "n8n");
});

app.post("/n8n", (req, res) => {
  return handleMessage(req, res, "n8n");
});

/* =========================
   RUTA DIRECTA DE OPENAI
========================= */

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

    if (!reply) {
      return res.status(200).json(
        plainResponse(
          `Permíteme revisar tu mensaje para ayudarte correctamente🙏`,
          false
        )
      );
    }

    return res.status(200).json(
      plainResponse(reply)
    );
  } catch (error) {
    console.error("Error en /openai:", error);

    return res.status(500).json({
      success: false,
      error: "Error al generar respuesta con OpenAI.",
    });
  }
});

/* =========================
   MANEJO DE RUTAS INVÁLIDAS
========================= */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: "Ruta no encontrada.",
  });
});

/* =========================
   INICIAR SERVIDOR
========================= */

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
  console.log(`Agente ${PRODUCT.assistantName} listo 📚✨`);
});
