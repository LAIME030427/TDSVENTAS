SISTEM PROMPT
require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY,
});
/* =========================
 CONFIGURACIÓN DEL PRODUCTO
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
Eres ${PRODUCT.assistantName}, asesora virtual de ${PRODUCT.brand}.
Tu función es ayudar por WhatsApp a mamás, papás y maestras interesadas en el
${PRODUCT.productName}.
Responde de forma amable, clara, cercana y profesional.
IMPORTANTE:
- No digas que eres ChatGPT.
- No inventes información.
- No prometas resultados garantizados.
- No digas que el material sirve para todos los niños.
- No hables de temas fuera del producto.
- Si no sabes algo, responde con honestidad.
PRODUCTO:
${PRODUCT.productName}
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
- Bono de Matemáticas Básicas.
PRECIO:
${PRODUCT.price}
Pago único.
ENTREGA:
Después de confirmar el pago, se entrega acceso digital por ${PRODUCT.delivery}.
TONO:
Mensajes cortos, naturales, como WhatsApp. Usa emojis con moderación.
OBJETIVO:
Resolver dudas, generar confianza y guiar naturalmente al pago.
`;
/* =========================
 RESPUESTAS DIRECTAS
========================= */
const RESPONSES = {
 saludo: `¡Hola! 😊 Soy Emilia, asesora virtual de ${PRODUCT.brand}.
Te ayudo con gusto con el ${PRODUCT.productName} 📚
Incluye más de 500 ejercicios, tablas del 1 al 10, juegos, material recortable, guía, diploma y bono de
matemáticas básicas.
Hoy tiene un costo de solo ${PRODUCT.price}.
Puedes pagar por:
1️⃣ Transferencia bancaria
2️⃣ Depósito en OXXO
¿Cuál prefieres?`,
 precio: `Claro 😊
El ${PRODUCT.productName} tiene un costo de solo ${PRODUCT.price}.
Es pago único e incluye más de 500 ejercicios, tablas, juegos, material recortable, guía, diploma y
bono de matemáticas básicas.
Puedes pagar por transferencia o depósito en OXXO.
¿Cuál método prefieres?`,
 comprar: `¡Perfecto! 😊
Te puedo compartir los datos para adquirir el ${PRODUCT.productName}.
El costo es de ${PRODUCT.price} y se entrega de forma digital después de confirmar el pago.
Puedes pagar por:
1️⃣ Transferencia bancaria
2️⃣ Depósito en OXXO
¿Cuál prefieres?`,
 incluye: `Incluye más de 500 ejercicios organizados paso a paso 😊
También trae:
✅ Tablas del 1 al 10
✅ Juegos educativos
✅ Memorama
✅ Dominó
✅ Rompecabezas
✅ Material recortable
✅ Guía para padres y maestros
✅ Diploma
✅ Seguimiento de avance
✅ Bono de Matemáticas Básicas
Hoy cuesta ${PRODUCT.price}. ¿Te paso los datos de pago?`,
 entrega: `Se entrega de forma digital 😊
Después de confirmar el pago, te enviamos un link de Google Drive para que puedas descargarlo e
imprimirlo.
El costo es de ${PRODUCT.price}.
¿Prefieres transferencia o depósito en OXXO?`,
 imprimible: `Sí 😊 Todo el material es imprimible.
Lo descargas, lo imprimes y puedes usarlo en casa o en clase las veces que necesites.
Hoy cuesta ${PRODUCT.price}.
¿Te paso datos para transferencia o prefieres OXXO?`,
 oxxo: `Sí, puedes pagar por depósito en OXXO en efectivo 😊
Después de confirmar el pago, te enviamos el acceso digital por Google Drive.
El costo es de ${PRODUCT.price}.
¿Quieres que te pase los datos para OXXO?`,
 transferencia: `Claro 😊
Puedes pagar por transferencia bancaria.
Después de confirmar el pago, te enviamos el acceso digital por Google Drive.
El costo es de ${PRODUCT.price}.
¿Te comparto los datos de transferencia?`,
 seguridad: `Claro, entiendo tu duda 😊
La entrega se realiza después de confirmar el pago por los canales oficiales de ${PRODUCT.brand}.
Te enviamos el acceso digital por Google Drive para que puedas descargar e imprimir el material.
¿Te gustaría pagar por transferencia o por OXXO?`,
 objecionPrecio: `Te entiendo 😊
La ventaja es que por ${PRODUCT.price} recibes un sistema completo con ejercicios, juegos, guía,
diploma y bono, listo para descargar e imprimir.
Está pensado para ahorrarte tiempo y ayudarte a reforzar las multiplicaciones paso a paso.
¿Te gustaría que te pase los datos de pago?`,
 pensar: `Claro 😊 Tómate el tiempo que necesites.
Si mientras tanto te surge cualquier duda sobre el material, con gusto puedo ayudarte.`,
};
/* =========================
 DETECTOR DE INTENCIONES
========================= */
const INTENTS = {
 saludo: ["hola", "buenos dias", "buenas tardes", "buenas noches", "info", "informacion"],
 precio: ["precio", "cuesta", "costo", "vale", "cuanto"],
 comprar: ["quiero comprar", "me interesa", "lo quiero", "pasame datos", "datos de pago", "quiero
adquirir"],
 incluye: ["incluye", "contiene", "trae", "viene", "que incluye"],
 entrega: ["entrega", "envian", "mandan", "recibo", "recibir", "drive", "link"],
 imprimible: ["imprimir", "imprimible", "pdf", "descargar"],
 oxxo: ["oxxo", "deposito", "efectivo"],
 transferencia: ["transferencia", "banco", "tarjeta"],
 seguridad: ["seguro", "fraude", "estafa", "confiable", "confianza"],
 objecionPrecio: ["caro", "muy caro", "no tengo dinero"],
 pensar: ["lo voy a pensar", "despues", "luego te digo"],
};
function normalize(text = "") {
 return text
 .toString()
 .toLowerCase()
 .normalize("NFD")
 .replace(/[\u0300-\u036f]/g, "")
 .trim();
}
function detectIntent(message = "") {
 const normalized = normalize(message);
 for (const [intent, keywords] of Object.entries(INTENTS)) {
 if (keywords.some((keyword) => normalized.includes(normalize(keyword)))) {
 return intent;
 }
 }
 return null;
}
/* =========================
 UTILIDADES
========================= */
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
/* =========================
 OPENAI FALLBACK
========================= */
async function generateAIResponse(userMessage) {
 const completion = await openai.chat.completions.create({
 model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
 messages: [
 { role: "system", content: SYSTEM_PROMPT },
 { role: "user", content: userMessage },
 ],
 temperature: 0.5,
 max_tokens: 350,
 });
 return completion.choices?.[0]?.message?.content?.trim();
}
/* =========================
 RESPONDER MENSAJE
========================= */
async function handleMessage(req, res, format = "manychat") {
 try {
 const userMessage = extractUserMessage(req.body);
 if (!userMessage) {
 const reply = RESPONSES.saludo;
 return res.status(200).json(
 format === "manychat" ? manyChatResponse(reply) : { success: true, reply }
 );
 }
 const intent = detectIntent(userMessage);
 if (intent && RESPONSES[intent]) {
 const reply = RESPONSES[intent];
 return res.status(200).json(
 format === "manychat" ? manyChatResponse(reply) : { success: true, reply }
 );
 }
 const aiReply = await generateAIResponse(userMessage);
 const reply =
 aiReply ||
 `Con gusto te ayudo 😊 El ${PRODUCT.productName} cuesta ${PRODUCT.price} y se entrega
por Google Drive después de confirmar el pago. ¿Prefieres transferencia o depósito en OXXO?`;
 return res.status(200).json(
 format === "manychat" ? manyChatResponse(reply) : { success: true, reply }
 );
 } catch (error) {
 console.error("Error:", error);
 const reply =
 "Disculpa, tuve un detalle técnico 🙏 Escríbeme nuevamente tu duda y con gusto te ayudo.";
 return res.status(200).json(
 format === "manychat" ? manyChatResponse(reply) : { success: false, reply }
 );
 }
}
/* =========================
 RUTAS
========================= */
app.get("/", (req, res) => {
 res.status(200).json({
 status: "ok",
 message: `Agente ${PRODUCT.assistantName} activo`,
 });
});
app.get("/health", (req, res) => {
 res.status(200).json({
 status: "healthy",
 product: PRODUCT.productName,
 });
});
app.post("/webhook", (req, res) => handleMessage(req, res, "manychat"));
app.post("/manychat", (req, res) => handleMessage(req, res, "manychat"));
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
 return res.status(200).json({
 success: true,
 reply,
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
