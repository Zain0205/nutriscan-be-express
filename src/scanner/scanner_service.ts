import { GoogleGenerativeAI } from "@google/generative-ai";
import { NutritionAnalysis } from "./scanner_interface";

const AI_PROMPT = `Saya ingin kamu bertindak sebagai ahli gizi berpengalaman. Tolong analisa makanan ini secara lengkap, dan tugasmu adalah menganalisis nutrisinya secara lengkap contoh 30gram protein dan lain lain. Identifikasi setiap komponen makanan yang terlihat (karbohidrat, protein, lemak, serat, vitamin, dan mineral) serta perkiraan kalorinya. Berikan penjelasan mengenai manfaat dan risiko makanan tersebut terhadap kesehatan, termasuk apakah makanan ini seimbang dan sesuai untuk diet tertentu (seperti diet rendah kalori, tinggi protein, atau lainnya). jangan menunjukan ketidak pasitan kamu harus yakin dengan jawaban mu dan jangan berikan response berupa range berikan angka yang paling valid. Akhiri dengan rekomendasi apakah makanan ini sehat atau perlu diimbangi dengan makanan lain agar lebih bernutrisi. Format JSON yang harus dikembalikan:
{
  "makanan": "nama makanan yang terdeteksi",
  "analisisNutrisi": {
    "kalori": "perkiraan kalori",
    "karbohidrat": "perkiraan jumlah karbohidrat",
    "protein": "perkiraan jumlah protein",
    "lemak": "perkiraan jumlah lemak",
    "serat": "perkiraan jumlah serat",
    "vitamin": ["vitamin A", "vitamin B", "..."],
    "mineral": ["kalsium", "zat besi", "..."]
  },
  "manfaat": ["manfaat 1", "manfaat 2", "..."],
  "risiko": ["risiko 1", "risiko 2", "..."],
  "cocokUntukDiet": ["diet 1", "diet 2", "..."],
  "rekomendasi": "rekomendasi kesehatan"
}

PENTING: Respons harus HANYA berisi objek JSON di atas, tanpa backticks atau penjelasan tambahan. Jangan gunakan frasa "Berikut adalah respons JSON:" atau sejenisnya.`;

export class ScannerService {
  private genAi: GoogleGenerativeAI;
  private model: any;

  constructor(apikey: any) {
    this.genAi = new GoogleGenerativeAI(apikey);
    this.model = this.genAi.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async fileRecognize(file: Express.Multer.File) {
    const mimtype = file.mimetype;
    const buffer = file.buffer;

    return {
      imageData: buffer.toString("base64"),
      mimetype: mimtype,
    };
  }

  async foodScanner(file: Express.Multer.File) {
    try {
      const imageBase64 = file.buffer.toString("base64");

      const parts = [
        { text: AI_PROMPT },
        {
          inlineData: {
            data: imageBase64,
            mimeType: file.mimetype,
          },
        },
      ];

      const foodAnalizeResult = await this.model.generateContent(parts);
      const response = await foodAnalizeResult.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        let jsonData;

        if (jsonMatch) {
          jsonData = JSON.parse(jsonMatch[0]);
        } else {
          jsonData = JSON.parse(text);
        }

        return this.validateAndFormatResponse(jsonData);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        console.log("Raw response:", text);

        return this.createDefaultResponse(text);
      }
    } catch (err) {
      throw err;
    }
  }

  private validateAndFormatResponse(data: any): NutritionAnalysis {
    const validatedData: NutritionAnalysis = {
      makanan: data.makanan || "Tidak teridentifikasi",
      analisisNutrisi: {
        kalori: data.analisisNutrisi?.kalori || "Tidak tersedia",
        karbohidrat: data.analisisNutrisi?.karbohidrat || "Tidak tersedia",
        protein: data.analisisNutrisi?.protein || "Tidak tersedia",
        lemak: data.analisisNutrisi?.lemak || "Tidak tersedia",
        serat: data.analisisNutrisi?.serat || "Tidak tersedia",
        vitamin: Array.isArray(data.analisisNutrisi?.vitamin) ? data.analisisNutrisi.vitamin : [],
        mineral: Array.isArray(data.analisisNutrisi?.mineral) ? data.analisisNutrisi.mineral : [],
      },
      manfaat: Array.isArray(data.manfaat) ? data.manfaat : [],
      risiko: Array.isArray(data.risiko) ? data.risiko : [],
      cocokUntukDiet: Array.isArray(data.cocokUntukDiet) ? data.cocokUntukDiet : [],
      rekomendasi: data.rekomendasi || "Tidak tersedia",
    };

    return validatedData;
  }

  private createDefaultResponse(rawText: string): NutritionAnalysis {
    return {
      makanan: "Tidak dapat mengidentifikasi",
      analisisNutrisi: {
        kalori: "Tidak tersedia",
        karbohidrat: "Tidak tersedia",
        protein: "Tidak tersedia",
        lemak: "Tidak tersedia",
        serat: "Tidak tersedia",
        vitamin: [],
        mineral: [],
      },
      manfaat: [],
      risiko: ["Analisis tidak lengkap"],
      cocokUntukDiet: [],
      rekomendasi: "Tidak dapat memberikan rekomendasi karena analisis tidak lengkap",
    };
  }
}
