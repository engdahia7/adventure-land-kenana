import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", game: "Secrets of the Nile" });
  });

  // Dynamic dialogue & discussion with characters in Egypt
  app.post("/api/dialogue", async (req, res) => {
    try {
      const {
        characterId,
        characterName,
        characterRole,
        location,
        playerMessage,
        conversationHistory = [],
        gameState = {},
      } = req.body;

      if (!playerMessage || typeof playerMessage !== "string") {
        return res.status(400).json({ error: "playerMessage is required" });
      }

      const ai = getGenAI();

      if (!ai) {
        // Fallback realistic atmospheric character response if Gemini key not set yet
        const fallbackAnswers: Record<string, string[]> = {
          radwan: [
            "يا بني، خان الخليلي دايماً شايل أسرار أجدادنا. المخطوطة اللي بتدور عليها مش مجرد حبر وبردي، دي خريطة لمقبرة حامي التاج الذهبي في الجيزة!",
            "اسمعني كويس، الخاتم النحاسي اللي لقيته عليه ختم كاهن آمون الأكبر.. لازم تروح للدكتورة ليلى في الكرنك بالأقصر، هي الوحيدة اللي قادرة تفك النقوش الدقيقة دي.",
            "يا ولدي، الفراعنة ما كانوش بيحطوا أسرارهم في مكان واحد. الجزء التاني من البردية مع ريّس فلوكة في أسوان بيحرس جزيرة الفنتين!",
          ],
          laila: [
            "أهلاً بك يا باحث المغامرة! أعمدة الكرنك هنا تحكي ملحمة عمرها آلاف السنين. الرمز الذي وجدته هو عين حورس مع رمز مفتاح الحياة (عنخ)، وهو يشير لممر سري تحت قاعدة تمثال رمسيس الثاني.",
            "المثير للدهشة أن النقوش هنا تطابق تماماً ما وجدته في خان الخليلي! هناك كنز معرفي هائل حُجب عن لصوص الآثار لقرون.",
            "انتبه! الرموز تقول: 'عندما تغرب الشمس وراء هرم خفرع، شعاع النور الأخير سيكشف حجر الباب السري'.",
          ],
          salama: [
            "يا هلا بيك في نيل أسوان الساحر! مية النيل دي شافت ملوك وأساطير.. الريح بتهمس بسر البردية الغارقة قرب صخور الفنتين!",
            "الجدود وصوني: اللي يدور على سر الكنانة لازم يكون قلبه نقي زي شلالات النيل الصافية. خد تميمة الجعران دي، هتحميك في سرداب الجيزة.",
            "اركب الفلوكة معايا يا بطل، هنعدي على معبد فيلة مع الغروب، وهناك هتشوف النقش اللي مش موجود في أي كتاب تاريخ!",
          ],
          mansour: [
            "احترس يا بني، سراديب الأهرامات هنا مش نزهة! الحجارة دي شهدت على أسرار ما يعلم بيها غير رب العزة. لو معاك المفتاح الفرعوني، الممر هيفتح بأمان.",
            "الصوت اللي سامعه في السرداب ده مش رياح.. ده صدى تراتيل كهنة الفراعنة لما قفلوا المقبرة سنة 1200 قبل الميلاد!",
            "وصلت لغرفة السر.. حط البردية فوق المذبح الحجري وشوف معجزة النور الفرعوني بنفسك!",
          ],
        };

        const list = fallbackAnswers[characterId] || [
          "مرحباً بك في رحاب مصر الخالدة.. واصل بحثك وحل الألغاز لتكشف سر المخطوطة الفرعونية!",
        ];
        const randomAnswer = list[Math.floor(Math.random() * list.length)];

        return res.json({
          reply: randomAnswer,
          clueUnlocked: "إشارة إلى ممر قديم",
          source: "fallback",
        });
      }

      const prompt = `أنت تمثل شخصية في لعبة مغامرات روائية وتاريخية تفاعلية تدور في جمهورية مصر العربية بعنوان "مغامرة أرض الكنانة: سر المخطوطة الفرعونية".
اسم الشخصية: ${characterName}
دورها وموقعها: ${characterRole} في ${location}
معلومات عن سياق اللعبة:
- اللاعب مغامر وباحث آثار يبحث عن أجزاء "بردية تحوت المفقودة" وحل لغز الجعران الذهبي الذي يقود إلى غرفة أسرار تحت أهرامات الجيزة.
- المواقع الرئيسية: خان الخليلي (القاهرة)، معبد الكرنك (الأقصر)، النيل والفلوكة (أسوان)، سراديب أهرامات الجيزة.
- حالة اللاعب الحالية: لديه عناصر في حقيبته مثل: ${JSON.stringify(gameState.inventory || ["مفكرة الآثار", "عدسة مكبرة"])}

تاريخ المحادثة السابقة:
${conversationHistory.map((msg: any) => `${msg.role === "user" ? "اللاعب" : characterName}: ${msg.content}`).join("\n")}

رسالة اللاعب أو سؤاله الجديد:
"${playerMessage}"

تعليمات الرد:
1. تحدث باللهجة المصرية الأصيلة والمهذبة أو الفصحى الأنيقة الممزوجة بنكهة مصرية دافئة تتناسب مع طبيعة الشخصية (أصالة، ترحيب، كرم، شغف تاريخي).
2. قدم معلومات ذكية، أدلة وتلميحات مشوقة للألغاز (clues)، مع الحفاظ على روح الغموض والإثارة.
3. اجعل الإجابة مركزة، سينمائية، وممتعة (من فقرة إلى فقرتين).
4. لا تخرج عن طابع الشخصية ولا تذكر أنك نموذج لغوي أو ذكاء اصطناعي إطلاقاً.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const replyText = response.text || "أهلاً بك يا صديقي في مصر، استمر في البحث وستجد الإجابة.";

      return res.json({
        reply: replyText.trim(),
        source: "gemini",
      });
    } catch (err: any) {
      console.error("Gemini dialogue error:", err);
      return res.status(500).json({
        error: "حدث خطأ أثناء المحادثة",
        fallbackReply: "يا بني، يبدو أن الصدى في هذا المكان عالي.. أعد سؤالك مرة أخرى وسأجيبك بكل سرور.",
      });
    }
  });

  // Decipher Hieroglyphs endpoint
  app.post("/api/decipher", async (req, res) => {
    try {
      const { hieroglyphText, symbol } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          translation: "عين حورس تحرس مفتاح الحياة؛ ضع الخاتم على نقش الشمس لتنفتح البوابة الحجرية.",
          significance: "نص جنائزي ملكي يشير لطريقة تفعيل ميكانيزم البوابة السرية.",
        });
      }

      const prompt = `قم بترجمة وتفسير هذا النقش الفرعوني في سياق لعبة مغامرات تاريخية مصرية:
الرمز: ${symbol}
النص الهيروغليفي/الوصف: ${hieroglyphText}
أعطني رداً باللغة العربية يشمل:
1- الترجمة الرمزية الجذابة (جملة بليغة)
2- السر أو اللغز الذي يكشفه هذا النقش لمساعدة اللاعب على التقدم.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return res.json({
        translation: response.text?.trim() || "النقش يكشف مسار النور عند الغروب.",
      });
    } catch (err) {
      return res.json({
        translation: "عين حورس تحرس مفتاح الحياة؛ ضع الخاتم على نقش الشمس لتنفتح البوابة الحجرية.",
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Egyptian Adventure Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
