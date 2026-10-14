import express from "express";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json({ limit: "10kb" }));

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, service: "cafetorshi-relay" });
});

// Rate limit: 5 request / 5 min per IP
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { ok: false, error: "تعداد درخواست زیاد است" },
});

// Endpoint: ارسال OTP
app.post("/sms/verify", limiter, async (req, res) => {
  try {
    // چک secret
    if (req.get("x-relay-secret") !== process.env.RELAY_SECRET) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }

    const { mobile, code } = req.body || {};

    // اعتبارسنجی
    if (!mobile || !/^09\d{9}$/.test(mobile)) {
      return res.status(400).json({ ok: false, error: "شماره نامعتبر" });
    }
    if (!code || !/^\d{6}$/.test(String(code))) {
      return res.status(400).json({ ok: false, error: "کد نامعتبر" });
    }

    // ارسال به sms.ir
    const r = await fetch("https://api.sms.ir/v1/send/verify", {
      method: "POST",
      headers: {
        "x-api-key": process.env.SMSIR_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        mobile,
        templateId: Number(process.env.SMSIR_TEMPLATE_ID),
        parameters: [{ name: "CODE", value: String(code) }],
      }),
    });

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    console.error("relay error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`relay listening on port ${port}`);
});
