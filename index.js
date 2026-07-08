require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PORT = process.env.PORT || 8080;

const SYSTEM_PROMPT = `
Eres Emilia Salazar 💛, una asistente humana, cálida y cercana que responde dudas por WhatsApp sobre El Taller del Saber y el Sistema Progresivo de Multiplicaciones.

Tu trabajo es responder dudas de forma NATURAL, BREVE y HUMANA, como si fueras una persona real atendiendo con cariño a mamás, papás y maestras.

IMPORTANTE:
- Nunca suenes robótica.
- Nunca respondas exactamente igual cada vez.
- Varía ligeramente las palabras y estructura.
- Mantén respuestas cálidas y naturales.
- No escribas demasiado.
- Responde máximo en 1 o 2 párrafos cortos.
- Usa emoticones de forma natural: 😊📚✖️🔢✨🧡

REGLAS:
- NO saludes.
- NO uses "Hola".
- NO hagas múltiples preguntas.
- NO hagas preguntas abiertas innecesarias.
- NO digas:
  "¿Quieres saber más?"
  "¿Te interesa?"
  "¿Te gustaría?"
  "¿Te ayudo en algo más?"
  "¿Quieres que te cuente?"
- NO seas agresiva vendiendo.
- NO presiones.
- NO inventes información.
- NO menciones correo electrónico.
- NO digas que el material es físico.
- NO prometas resultados garantizados.

INFORMACIÓN REAL:
- El producto es el Sistema Progresivo de Multiplicaciones.
- Es material DIGITAL.
- Se entrega por link de Google Drive.
- Se entrega después de confirmar el pago.
- Puede recibirse por WhatsApp o ManyChat.
- Es imprimible.
- Incluye ejercicios para dominar y practicar las tablas de multiplicar.
- Incluye más de 500 ejercicios.
- Incluye tablas del 1 al 10.
- Incluye juegos didácticos.
- Incluye memorama, dominó y rompecabezas.
- Incluye fichas recortables.
- Incluye guía práctica para casa o aula.
- Incluye diploma imprimible.
- Incluye seguimiento de avance.
- Incluye bono de matemáticas básicas: sumas, restas y cálculo mental.
- El precio es $69 MXN.
- Es pago único.
- No hay mensualidades.
- Se puede pagar por transferencia bancaria.
- Se puede pagar por depósito en OXXO en efectivo.
- Si la app bancaria no reconoce la tarjeta o banco, se puede ofrecer transferencia a Mercado Pago.

COSAS QUE NUNCA DEBES DECIR:
- "Garantizado".
- "Aprende en X días".
- "Resultados asegurados".
- "Tu hijo va a aprender sí o sí".
- "Sirve para todos los niños".
- "Cura problemas de aprendizaje".
- "Últimos lugares", si no es real.

OBJETIVO:
Después de resolver la duda de forma amable y humana, dirige suavemente a la persona al pago del material mediante:
- transferencia bancaria
- depósito en OXXO

Haz que el cierre se sienta natural, amable y claro, nunca como presión de venta.
`;

function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function elegirAleatoria(opciones) {
  return opciones[Math.floor(Math.random() * opciones.length)];
}

function limpiarRespuesta(texto) {
  texto = String(texto || "").trim();

  texto = texto
    .replace(/^¡?\s*hola\s*[😊🙏❤✨🌿💛📚✖️🔢🧡,\.\!]*\s*/gi, "")
    .replace(/^gracias por preguntar\s*[😊🙏❤✨🌿💛📚✖️🔢🧡,\.\!]*\s*/gi, "")
    .replace(/^buenos días\s*[😊🙏❤✨🌿💛📚✖️🔢🧡,\.\!]*\s*/gi, "")
    .replace(/^buenos dias\s*[😊🙏❤✨🌿💛📚✖️🔢🧡,\.\!]*\s*/gi, "")
    .replace(/^buenas tardes\s*[😊🙏❤✨🌿💛📚✖️🔢🧡,\.\!]*\s*/gi, "")
    .replace(/^buenas noches\s*[😊🙏❤✨🌿💛📚✖️🔢🧡,\.\!]*\s*/gi, "");

  texto = texto
    .replace(/¿[^?]*(quieres|te interesa|te gustaría|te gustaria|te cuento|te explico|te ayudo|puedo ayudarte|hay algo más|hay algo mas|te parece|te comparto|te paso)[^?]*\?/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return texto;
}

function cierrePago() {
  const cierres = [
    `💛 El material tiene un costo de $69 MXN y puedes pagarlo por transferencia bancaria o depósito en OXXO ✨\n¿Cuál método prefieres? 😊`,
    `📚 El acceso cuesta $69 MXN. Puedes elegir transferencia bancaria o depósito en OXXO ✨\n¿Cuál opción prefieres?`,
    `🧡 Para obtener el Sistema Progresivo de Multiplicaciones, el pago es de $69 MXN por transferencia o depósito en OXXO.\n¿Cuál método te queda mejor? 😊`,
  ];

  return elegirAleatoria(cierres);
}

function agregarCierre(texto) {
  const limpio = limpiarRespuesta(texto);

  if (!limpio) {
    return cierrePago();
  }

  return `${limpio}\n\n${cierrePago()}`;
}

function respuestaDirecta(textoNormalizado) {
  if (
    textoNormalizado.includes("cuanto") ||
    textoNormalizado.includes("cuesta") ||
    textoNormalizado.includes("precio") ||
    textoNormalizado.includes("costo") ||
    textoNormalizado.includes("vale")
  ) {
    const respuestasPrecio = [
      `El Sistema Progresivo de Multiplicaciones cuesta $69 MXN 😊 Es pago único e incluye el material digital listo para descargar e imprimir.`,
      `El precio es de $69 MXN 📚 Es un solo pago y recibes el acceso digital al material después de confirmar el pago.`,
      `Tiene un costo de $69 MXN ✨ Incluye más de 500 ejercicios, tablas, juegos, fichas, guía, diploma y bono de matemáticas básicas.`,
    ];

    return agregarCierre(elegirAleatoria(respuestasPrecio));
  }

  if (
    textoNormalizado.includes("incluye") ||
    textoNormalizado.includes("trae") ||
    textoNormalizado.includes("viene") ||
    textoNormalizado.includes("contiene") ||
    textoNormalizado.includes("material") ||
    textoNormalizado.includes("video")
  ) {
    const respuestasIncluye = [
      `Incluye más de 500 ejercicios, tablas del 1 al 10, juegos didácticos, fichas recortables, guía práctica, diploma, seguimiento de avance y bono de matemáticas básicas 📚✨`,
      `Viene muy completo 😊 Trae ejercicios progresivos, tablas de multiplicar, memorama, dominó, rompecabezas, fichas para recortar y material listo para imprimir.`,
      `Sí, incluye el material que se trabaja para reforzar las multiplicaciones y tablas ✖️🔢 Además viene con juegos, guía, diploma y actividades listas para usar.`,
    ];

    return agregarCierre(elegirAleatoria(respuestasIncluye));
  }

  if (
    textoNormalizado.includes("grado") ||
    textoNormalizado.includes("primaria") ||
    textoNormalizado.includes("primero") ||
    textoNormalizado.includes("segundo") ||
    textoNormalizado.includes("tercero") ||
    textoNormalizado.includes("cuarto") ||
    textoNormalizado.includes("edad") ||
    textoNormalizado.includes("anos")
  ) {
    const respuestasGrado = [
      `Puede usarse como apoyo para niños que están comenzando o reforzando las tablas de multiplicar 😊 Está organizado de forma progresiva, por eso sirve para practicar paso a paso en casa o en escuela.`,
      `El material está pensado para reforzar multiplicaciones de forma progresiva 📚 Puede utilizarse en primaria, especialmente cuando el niño empieza a trabajar tablas o necesita repasarlas.`,
      `Sí puede servir como material de apoyo ✖️🔢 Va paso a paso, desde actividades sencillas hasta práctica con tablas, por eso ayuda mucho para reforzar.`,
    ];

    return agregarCierre(elegirAleatoria(respuestasGrado));
  }

  if (
    textoNormalizado.includes("tabla") ||
    textoNormalizado.includes("tablas") ||
    textoNormalizado.includes("multiplicacion") ||
    textoNormalizado.includes("multiplicaciones")
  ) {
    const respuestasTablas = [
      `Sí, incluye las tablas de multiplicar del 1 al 10 ✖️🔢 Además trae ejercicios y juegos para practicarlas de forma más dinámica.`,
      `Claro 😊 El sistema está enfocado en multiplicaciones y tablas, con actividades progresivas para que el niño practique paso a paso.`,
      `Vienen las tablas del 1 al 10 y ejercicios para reforzarlas 📚 También incluye juegos y fichas para hacerlo más práctico.`,
    ];

    return agregarCierre(elegirAleatoria(respuestasTablas));
  }

  if (
    textoNormalizado.includes("hojas") ||
    textoNormalizado.includes("paginas") ||
    textoNormalizado.includes("cuantas hojas") ||
    textoNormalizado.includes("cuantas paginas")
  ) {
    const respuestasHojas = [
      `El sistema incluye más de 500 ejercicios organizados de forma progresiva 📚 No es solo una hoja suelta, es material completo para trabajar las multiplicaciones.`,
      `Viene con más de 500 ejercicios ✨ Además incluye tablas, juegos, fichas recortables, guía, diploma y seguimiento de avance.`,
      `Incluye más de 500 ejercicios listos para imprimir 😊 Está organizado para que puedas aplicarlo poco a poco, en casa o en clase.`,
    ];

    return agregarCierre(elegirAleatoria(respuestasHojas));
  }

  if (
    textoNormalizado.includes("imprimir") ||
    textoNormalizado.includes("imprimible") ||
    textoNormalizado.includes("pdf") ||
    textoNormalizado.includes("descargar") ||
    textoNormalizado.includes("descarga")
  ) {
    const respuestasImprimir = [
      `Sí, todo el material es digital e imprimible 😊 Lo descargas, lo imprimes y lo puedes usar en casa o en clase.`,
      `Así es 📚 El material se entrega en formato digital para que puedas descargarlo e imprimirlo cuando lo necesites.`,
      `Sí, es listo para imprimir ✨ Puedes usarlo varias veces, según lo necesites para practicar.`,
    ];

    return agregarCierre(elegirAleatoria(respuestasImprimir));
  }

  if (
    textoNormalizado.includes("entrega") ||
    textoNormalizado.includes("envio") ||
    textoNormalizado.includes("enviar") ||
    textoNormalizado.includes("mandan") ||
    textoNormalizado.includes("recibo") ||
    textoNormalizado.includes("recibir") ||
    textoNormalizado.includes("llega") ||
    textoNormalizado.includes("link") ||
    textoNormalizado.includes("drive")
  ) {
    const respuestasEntrega = [
      `La entrega es digital 😊 Después de confirmar el pago, se envía el acceso por link de Google Drive para que puedas descargarlo e imprimirlo.`,
      `Lo recibes por WhatsApp o ManyChat mediante un link de Google Drive 📚 Una vez confirmado el pago, se comparte el acceso al material.`,
      `Se entrega de forma digital ✨ No es físico. Recibes el link de descarga después de confirmar tu pago.`,
    ];

    return agregarCierre(elegirAleatoria(respuestasEntrega));
  }

  if (
    textoNormalizado.includes("oxxo") ||
    textoNormalizado.includes("deposito") ||
    textoNormalizado.includes("efectivo")
  ) {
    const respuestasOxxo = [
      `Sí, puedes pagar por depósito en OXXO en efectivo 😊 Después de confirmar el pago, se envía el acceso digital por Google Drive.`,
      `Claro 📚 Tenemos opción de depósito en OXXO. Una vez confirmado, recibes el link para descargar el material.`,
      `Sí se puede por OXXO ✨ El material cuesta $69 MXN y se entrega digital después de validar el pago.`,
    ];

    return agregarCierre(elegirAleatoria(respuestasOxxo));
  }

  if (
    textoNormalizado.includes("transferencia") ||
    textoNormalizado.includes("pago") ||
    textoNormalizado.includes("pagar") ||
    textoNormalizado.includes("mercado pago") ||
    textoNormalizado.includes("tarjeta") ||
    textoNormalizado.includes("banco")
  ) {
    const respuestasPago = [
      `Puedes pagar por transferencia bancaria o depósito en OXXO 😊 Si tu app no reconoce el banco, también podemos darte opción por Mercado Pago.`,
      `Tenemos dos formas principales de pago 📚 Transferencia bancaria o depósito en OXXO. En algunos casos también se puede usar Mercado Pago.`,
      `El pago puede hacerse por transferencia o por OXXO ✨ Después de confirmarlo, se envía el acceso digital al material.`,
    ];

    return agregarCierre(elegirAleatoria(respuestasPago));
  }

  if (
    textoNormalizado.includes("seguro") ||
    textoNormalizado.includes("fraude") ||
    textoNormalizado.includes("estafa") ||
    textoNormalizado.includes("confiable") ||
    textoNormalizado.includes("confianza")
  ) {
    const respuestasSeguro = [
      `Sí, es seguro 😊 La entrega se realiza por los canales oficiales de El Taller del Saber y el acceso se envía después de confirmar el pago.`,
      `Entiendo la duda 🧡 El material se entrega de forma digital por link de Google Drive una vez confirmado el pago.`,
      `Claro, la entrega se hace por WhatsApp o ManyChat mediante un link de Google Drive 📚 No es material físico, es acceso digital.`,
    ];

    return agregarCierre(elegirAleatoria(respuestasSeguro));
  }

  if (
    textoNormalizado.includes("atrasado") ||
    textoNormalizado.includes("batalla") ||
    textoNormalizado.includes("dificultad") ||
    textoNormalizado.includes("no sabe") ||
    textoNormalizado.includes("le cuesta")
  ) {
    const respuestasAtrasado = [
      `Puede servir como material de apoyo y refuerzo 😊 Está organizado paso a paso para practicar multiplicaciones y tablas sin brincar directo a ejercicios complicados.`,
      `Sí puede ayudar como refuerzo 📚 Va de forma progresiva, con ejercicios y juegos para practicar las tablas poco a poco.`,
      `Es buena opción para reforzar ✖️🔢 Solo es importante trabajarlo con calma y constancia, porque cada niño avanza a su ritmo.`,
    ];

    return agregarCierre(elegirAleatoria(respuestasAtrasado));
  }

  if (
    textoNormalizado.includes("ubicados") ||
    textoNormalizado.includes("ubicacion") ||
    textoNormalizado.includes("donde estan") ||
    textoNormalizado.includes("direccion")
  ) {
    const respuestasUbicacion = [
      `El material es digital 😊 Por eso no necesitas acudir a ningún lugar; se entrega por link de Google Drive después de confirmar el pago.`,
      `Trabajamos con entrega digital 📚 Recibes el acceso por WhatsApp o ManyChat, sin necesidad de envío físico.`,
      `No manejamos entrega física ✨ El acceso se comparte de forma digital para que puedas descargarlo e imprimirlo desde donde estés.`,
    ];

    return agregarCierre(elegirAleatoria(respuestasUbicacion));
  }

  return null;
}

app.get("/", (req, res) => {
  res.send("Bot ventas El Taller del Saber activo ✅");
});

app.post("/mensaje", async (req, res) => {
  try {
    const texto = req.body.texto || req.body.mensaje || req.body.message || "";

    console.log("Texto recibido:", texto);

    if (!texto) {
      return res.json({ respuesta: cierrePago() });
    }

    const textoNormalizado = normalizarTexto(texto);

    const directa = respuestaDirecta(textoNormalizado);

    if (directa) {
      console.log("Respuesta directa:", directa);
      return res.json({ respuesta: directa });
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature: 0.4,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: texto },
      ],
    });

    const respuestaIA = response.output_text || "";
    const respuestaFinal = agregarCierre(respuestaIA);

    console.log("Respuesta enviada:", respuestaFinal);

    return res.json({ respuesta: respuestaFinal });
  } catch (error) {
    console.error("Error en /mensaje:", error);
    return res.json({ respuesta: cierrePago() });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
