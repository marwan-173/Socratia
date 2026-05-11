console.log("[AI] Gemini client loaded");

export async function askGemini({
  prompt,
  messages = [],

  // 🔹 single-file (Socratic)
  fileBuffer,
  mimeType,

  // 🔹 multi-file (Comparison)
  files,
}) {
  console.log("[AI] Sending request to Gemini");

  const safeMessages = messages.filter(
    (m) => m && typeof m.text === "string" && m.text.trim()
  );

  // =========================
  // BUILD PARTS
  // =========================
  const parts = [{ text: prompt }];

  // 🔹 MULTI-FILE MODE (comparison)
  if (Array.isArray(files) && files.length > 0) {
    for (const f of files) {
      parts.push({
        inlineData: {
          mimeType: f.mimeType,
          data: f.buffer.toString("base64"),
        },
      });
    }
  }
  // 🔹 SINGLE-FILE MODE (socratic)
  else if (fileBuffer && mimeType) {
    parts.push({
      inlineData: {
        mimeType,
        data: fileBuffer.toString("base64"),
      },
    });
  }

  const contents = [
    {
      role: "user",
      parts,
    },
    ...safeMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[AI] Gemini API error:", errorText);
    throw new Error(errorText);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}
