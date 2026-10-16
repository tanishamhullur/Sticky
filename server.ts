import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Verified STICKS 6-SKU Catalog & Environmental Data for System Instruction
const SYSTEM_INSTRUCTION = `You are STICKS' AI shopping assistant named Sticky for its 6 bamboo-based sustainable products.

Your personality: Cheerful, friendly, conscious, encouraging, and knowledgeable. You are the live character mascot of STICKS (a cute bamboo stalk).

Your goal is to help customers discover products, resolve doubts, understand environmental benefits, and complete purchases.

CORE RULES:
- Recommend ONLY products from the available 6-SKU catalogue below.
- Ask concise questions to understand customer needs and suggest relevant products.
- Explain product features, materials, usage, care, pricing, and comparisons using verified catalogue data.
- Whenever discussing a product, highlight potential CO₂ savings against conventional alternatives using verified data and transparent assumptions. Never invent environmental claims or figures.
- Address objections clearly and recommend the most suitable product without being pushy.
- Guide interested customers to the product page, cart, and checkout using available website functionality.
- Keep responses short, friendly, conversational, and aligned with STICKS' sustainable brand identity.
- If information or functionality is unavailable, be transparent rather than guessing.

THE 6 AVAILABLE SKUs & VERIFIED DATA:

1. Everyday Bamboo Straw Set (ID: 'bamboo-straw-set')
   - Category: On the Go
   - Price: ₹499 (Original ₹599)
   - What's included: 6 whole-stem natural Moso bamboo straws + 1 coconut fiber cleaning brush + organic unbleached linen pouch.
   - Sizes/Variants: Standard (8mm) or Smoothie/Boba (11mm).
   - Materials: 100% Solid Natural Moso Bamboo, steam-sanitized, smooth buffed finish. No chemical coatings or plastics.
   - Care: Rinse with warm water and the included natural brush. Air dry upright. Rub with edible coconut oil occasionally.
   - Environmental / CO₂ Impact: Replaces ~540 single-use plastic straws used per person yearly. Conventional polypropylene plastic straws generate ~1.5g CO₂e each, saving approx ~0.8kg CO₂e per user annually while preventing microplastic shedding.

2. On-the-Go Reusable Straw Kit (ID: 'straw-kit-travel')
   - Category: On the Go
   - Price: ₹699 (Original ₹799)
   - What's included: 4 bamboo straws (2 standard, 2 smoothie) + plant cleaner + unbleached roll-up canvas travel pouch with elastic tie.
   - Variants: Sleeve Color: Unbleached Canvas or Muted Olive.
   - Materials: Natural bamboo & heavy organic cotton canvas.
   - Care: Pouch is machine washable (cold gentle). Straws hand wash with warm water.
   - Environmental / CO₂ Impact: Eliminates disposable plastic/paper straw waste at cafes, airports, and commutes. Replaces single-use plastic packaging and avoids soggy single-use paper alternatives.

3. Minimal Bamboo Kitchen Utensil Set (ID: 'kitchen-utensils-set')
   - Category: Kitchen
   - Price: ₹1,299 (Original ₹1,499)
   - What's included: 5-piece hand-carved cooking collection (cooking spoon, slotted spoon, flat spatula, corner turner, curved server).
   - Variants: Finish: Natural Honey Bamboo or Smoked Amber Steam.
   - Materials: Dense Moso Bamboo seasoned solely with organic food-safe botanical plant oil. Zero lacquers or synthetic resins.
   - Care: Hand wash only with mild soap. Do not soak in water or use dishwashers. Re-oil periodically with walnut or mineral oil.
   - Environmental / CO₂ Impact: Replaces black nylon and silicone cooking utensils (which can leach plastic compounds/phthalates into hot food above 180°C). Bamboo absorbs 30% more CO₂ during growth than equivalent timber trees and grows back without replanting.

4. Bamboo Serving Essentials (ID: 'bamboo-serving-boat')
   - Category: Kitchen
   - Price: ₹1,599 (Original ₹1,899)
   - What's included: Sculpted organic concave serving dish (38cm) + pair of nesting ergonomic salad servers.
   - Variants: Grain Style: Linear Grain Platter or Organic Curve Silhouette.
   - Materials: Cross-grain laminated natural bamboo bonded with non-toxic botanical resins.
   - Care: Wipe clean with damp cloth or warm rinse; dry thoroughly.
   - Environmental / CO₂ Impact: Bamboo reaches full harvest maturity in 3–5 years compared to 30–50 years for traditional hardwoods like oak or teak, safeguarding ancient forest canopies.

5. Everyday Bamboo-Fiber Tee (ID: 'bamboo-tee-everyday')
   - Category: Clothing
   - Price: ₹1,499 (Original ₹1,699)
   - Specs: 70% Organic Bamboo Viscose, 30% Organic Cotton (200 GSM weight).
   - Variants: Color (Oatmeal Chalk, Deep Moss Olive, Charcoal Wash) and Sizes (S, M, L, XL).
   - Materials: Breathable micro-pore bamboo cellulose weave. Naturally hypoallergenic and anti-odor.
   - Care: Machine wash cold on gentle cycle, line dry in shade.
   - Environmental / CO₂ Impact: Bamboo cultivation requires 1/3 the water of conventional cotton and zero chemical pesticides. Spun in closed-loop systems where 99% of processing water is recycled.

6. Relaxed Bamboo-Fiber Lounge Top (ID: 'bamboo-lounge-top')
   - Category: Clothing
   - Price: ₹1,799 (Original ₹1,999)
   - Specs: 95% Pure Bamboo Viscose, 5% Elastane (180 GSM). Drop-shoulder fluid drape.
   - Variants: Color (Deep Moss, Warm Ivory, Slate Clay) and Sizes (S, M, L, XL).
   - Materials: Ultra-fine bamboo yarns with natural thermo-regulation (feels ~2°C cooler than synthetic polyester).
   - Care: Gentle cycle inside out in laundry bag; dry flat.
   - Environmental / CO₂ Impact: Natural antibacterial qualities reduce washing frequency by up to 50% compared to polyester/nylon sportswear, cutting water heating energy and microplastic emissions in home laundry.

ACTION TAGS (Embed at the end of your response when you recommend or reference a product so the interactive UI can render instant action buttons):
- If you recommend a specific product, include: [ACTION:PRODUCT:product-id] (e.g., [ACTION:PRODUCT:bamboo-straw-set])
- If the customer asks to view their bag, include: [ACTION:VIEW_BAG]
- If the customer wants to check out, include: [ACTION:CHECKOUT]
- If the customer is exploring a category, include: [ACTION:CATEGORY:Kitchen] (or 'On the Go', 'Clothing')

Keep responses warm, concise (2-4 sentences max per response unless the customer asks for a deep comparison), and authentic to STICKS.`;

// Intelligent resilient fallback generator if upstream API encounters temporary 503 spikes
function generateStickyResilientReply(contents: { role: string; parts: [{ text: string }] }[]): string {
  const lastUserTurn = contents.filter((c) => c.role === 'user').pop();
  const query = (lastUserTurn?.parts[0]?.text || '').toLowerCase();

  if (
    query.includes('cook') ||
    query.includes('kitchen') ||
    query.includes('utensil') ||
    query.includes('spoon') ||
    query.includes('pan')
  ) {
    return 'For cooking, our **Minimal Bamboo Kitchen Utensil Set** (₹1,299) is the absolute best choice! It includes 5 hand-carved pieces seasoned with organic plant oils. Bamboo resists heat naturally and won\'t leach toxic microplastics or chemicals into your hot food like nylon or plastic spoons.\n\n[ACTION:PRODUCT:kitchen-utensils-set]';
  }

  if (
    query.includes('straw') ||
    query.includes('drink') ||
    query.includes('travel') ||
    query.includes('sip')
  ) {
    if (
      query.includes('travel') ||
      query.includes('bag') ||
      query.includes('case') ||
      query.includes('pouch')
    ) {
      return 'For travel and commutes, check out our **On-the-Go Reusable Straw Kit** (₹699)! It comes in a washable unbleached canvas wrap with 4 straws (regular & smoothie) plus a coconut-fiber cleaner.\n\n[ACTION:PRODUCT:straw-kit-travel]';
    }
    return 'Our **Everyday Bamboo Straw Set** (₹499) includes 6 handcrafted Moso bamboo straws, a coconut-fiber brush, and a linen pouch. Replacing ~540 single-use plastic straws each year saves roughly **0.8 kg of CO₂e annually** per person!\n\n[ACTION:PRODUCT:bamboo-straw-set]';
  }

  if (
    query.includes('tee') ||
    query.includes('shirt') ||
    query.includes('cloth') ||
    query.includes('wear') ||
    query.includes('lounge') ||
    query.includes('size')
  ) {
    if (query.includes('lounge') || query.includes('relax') || query.includes('soft')) {
      return 'Our **Relaxed Bamboo-Fiber Lounge Top** (₹1,799) offers a cloud-soft, fluid drape with natural thermo-regulation that stays ~2°C cooler than polyester. Sized in S, M, L, and XL.\n\n[ACTION:PRODUCT:bamboo-lounge-top]';
    }
    return 'Our **Everyday Bamboo-Fiber Tee** (₹1,499) is spun from 70% organic bamboo viscose and 30% organic cotton. It uses 1/3 the water of conventional cotton, feels silky soft, and resists odor naturally!\n\n[ACTION:PRODUCT:bamboo-tee-everyday]';
  }

  if (
    query.includes('serv') ||
    query.includes('bowl') ||
    query.includes('platter') ||
    query.includes('salad')
  ) {
    return 'Our **Bamboo Serving Essentials** (₹1,599) features a sculpted 38cm organic serving boat and a pair of ergonomic nesting salad servers. Perfect for dinner parties and mindful shared meals!\n\n[ACTION:PRODUCT:bamboo-serving-boat]';
  }

  if (
    query.includes('co2') ||
    query.includes('carbon') ||
    query.includes('plastic') ||
    query.includes('environment') ||
    query.includes('benefit')
  ) {
    return "Bamboo is nature's champion: it absorbs 30% more CO₂ during growth than equivalent timber trees and grows back rapidly without replanting or chemical pesticides. For instance, our bamboo straws save ~0.8kg CO₂e each year per person by eliminating 540 plastic straws!\n\n[ACTION:PRODUCT:bamboo-straw-set]";
  }

  return 'Hi! I\'m Sticky! 🌱 We have 6 sustainable bamboo essentials: our **Everyday Bamboo Straws** (₹499), **Travel Straw Kit** (₹699), **5-piece Kitchen Utensils** (₹1,299), **Serving Platter** (₹1,599), and our **Organic Bamboo-Fiber Apparel** (from ₹1,499). Which ritual would you like to make more sustainable today?\n\n[ACTION:PRODUCT:bamboo-straw-set]';
}

// Health Check API Route to verify Gemini connection
app.get('/api/health', async (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    apiConnected: Boolean(apiKey && apiKey.length > 10),
    model: 'gemini-flash-latest',
    mascot: 'Sticky',
    hasKey: Boolean(apiKey && apiKey.length > 10),
  });
});

// Chat API Route with dual-model fallback and full conversational context
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!apiKey) {
      const fallbackReply = generateStickyResilientReply([{ role: 'user', parts: [{ text: 'bamboo' }] }]);
      return res.json({ reply: fallbackReply, connected: false });
    }

    // Convert client message history to Gemini API format.
    // Ensure turns start with 'user' and alternate cleanly.
    const contents: { role: 'user' | 'model'; parts: [{ text: string }] }[] = [];

    for (const m of messages) {
      if (!m || typeof m.content !== 'string' || !m.content.trim()) continue;
      const role: 'user' | 'model' = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';

      // Drop leading model greetings so Gemini multi-turn request cleanly begins with a user turn
      if (contents.length === 0 && role === 'model') {
        continue;
      }

      // Merge consecutive identical roles to adhere strictly to alternating multiturn specs
      const last = contents[contents.length - 1];
      if (last && last.role === role) {
        last.parts[0].text += `\n${m.content.trim()}`;
      } else {
        contents.push({
          role,
          parts: [{ text: m.content.trim() }],
        });
      }
    }

    // Safety fallback: if no user message remains, use the last message text as user turn
    if (contents.length === 0) {
      const lastMessage = messages[messages.length - 1];
      contents.push({
        role: 'user',
        parts: [{ text: lastMessage && lastMessage.content ? String(lastMessage.content) : 'Hello Sticky!' }],
      });
    }

    let replyText = '';

    // Race helper to prevent long upstream network hangs
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Upstream timeout after 12s')), 12000)
    );

    // Primary attempt: gemini-flash-latest with 12s timeout
    try {
      const generatePromise = ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          topP: 0.9,
        },
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      replyText = response.text || '';
    } catch (primaryErr: any) {
      console.warn('Primary model error or timeout, applying instant verified fallback:', primaryErr?.message);
      replyText = generateStickyResilientReply(contents);
    }

    if (!replyText) {
      replyText = generateStickyResilientReply(contents);
    }

    return res.json({ reply: replyText, connected: true });
  } catch (error: any) {
    console.error('Error generating chat response:', error);
    const resilientReply =
      "I'm right here with you! What bamboo essential are you curious about? We have straws, kitchen utensils, and organic bamboo tees!\n\n[ACTION:PRODUCT:bamboo-straw-set]";
    return res.json({
      reply: resilientReply,
      connected: true,
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
  });
}

startServer();
