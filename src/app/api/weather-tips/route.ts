import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return Response.json({ error: "GEMINI_API_KEY belum dikonfigurasi." }, { status: 400 });
    }

    const { weatherData, location, bmkgData } = await request.json();

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Kamu adalah asisten cuaca Indonesia yang ramah dan helpful.
Berikan tips dan saran praktis berdasarkan data cuaca berikut.
Gunakan Bahasa Indonesia yang natural, santai tapi informatif.
Sertakan emoji yang relevan. Maksimal 4-5 poin tips ringkas.

Data Cuaca Saat Ini:
- Lokasi: ${location?.name || "Indonesia"}, Indonesia
- Suhu: ${weatherData?.temperature ?? "-"}°C (terasa seperti ${weatherData?.feelsLike ?? "-"}°C)
- Kondisi: ${weatherData?.description ?? "-"}
- Kelembaban: ${weatherData?.humidity ?? "-"}%
- Kecepatan Angin: ${weatherData?.windSpeed ?? "-"} km/h
- Probabilitas Hujan: ${weatherData?.rainProbability ?? "-"}%
- Indeks UV: ${weatherData?.uvIndex ?? "-"}

${
  bmkgData?.earthquake
    ? `Info Gempa Terbaru BMKG:
- Magnitudo: ${bmkgData.earthquake.Magnitude}
- Lokasi: ${bmkgData.earthquake.Wilayah}
- Potensi Tsunami: ${bmkgData.earthquake.Potensi}`
    : ""
}

${bmkgData?.earlyWarning ? `Peringatan Dini BMKG: ${bmkgData.earlyWarning}` : ""}

Berikan tips yang:
1. Relevan dengan kondisi cuaca saat ini
2. Praktis dan actionable untuk kehidupan sehari-hari
3. Konteks Indonesia (iklim tropis, budaya lokal)
4. Jika ada info gempa, sampaikan singkat dan menenangkan
5. Tone: friendly, seperti teman yang kasih saran`;

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    let messageContent = "";

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      messageContent = response.text || "";
    } catch {
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      messageContent = fallbackResponse.text || "";
    }

    return Response.json({ tips: messageContent });
  } catch (err: any) {
    return Response.json({ error: err.message || "Gagal memproses tips Gemini AI" }, { status: 500 });
  }
}
