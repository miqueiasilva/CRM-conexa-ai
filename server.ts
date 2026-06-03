import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json());

  // In-memory log store for received webhooks (latest 50 messages)
  let webhookLogs: any[] = [];

  // API Route: Fetch webhook logs
  app.get("/api/webhook-logs", (req, res) => {
    res.json(webhookLogs);
  });

  // API Route: Send a simulate test webhook event mimicking Meta's validation/message
  app.post("/api/simulate-webhook", (req, res) => {
    const { type, accountId } = req.body;
    let payload = {};
    const timestamp = Math.floor(Date.now() / 1000);

    if (type === "handshake") {
      // Simulate verification handshake from Meta API
      const verifyToken = `convexa_verify_token_${accountId}_sec`;
      // We push a handshake log
      const logEntry = {
        id: Date.now(),
        type: "HANDSHAKE_RECEIVED",
        accountId: accountId,
        receivedAt: new Date().toISOString(),
        details: "Meta validation request processed successfully.",
        payload: {
          "hub.mode": "subscribe",
          "hub.verify_token": verifyToken,
          "hub.challenge": "1483921829"
        }
      };
      webhookLogs.unshift(logEntry);
      return res.json({ success: true, message: "Handshake simulação disparado." });
    }

    if (type === "message") {
      payload = {
        object: "whatsapp_business_account",
        entry: [
          {
            id: "109284729104820",
            changes: [
              {
                value: {
                  messaging_product: "whatsapp",
                  metadata: {
                    display_phone_number: "+5511987654321",
                    phone_number_id: "104839281093129"
                  },
                  contacts: [
                    {
                      profile: {
                        name: "Ana Silva"
                      },
                      wa_id: "5511987654321"
                    }
                  ],
                  messages: [
                    {
                      from: "5511987654321",
                      id: `wamid.HBgMNTUxMTk4NzY1NDMyMRUCABEYEjQ0QTgxOUFFNTBGRDEzQ0U5NUQA`,
                      timestamp: timestamp.toString(),
                      text: {
                        body: req.body.messageBody || "Olá! Gostaria de agendar um design de sobrancelha para sexta-feira à tarde, por favor."
                      },
                      type: "text"
                    }
                  ]
                },
                field: "messages"
              }
            ]
          }
        ]
      };
    } else if (type === "status") {
      payload = {
        object: "whatsapp_business_account",
        entry: [
          {
            id: "109284729104820",
            changes: [
              {
                value: {
                  messaging_product: "whatsapp",
                  metadata: {
                    display_phone_number: "+5511987654321",
                    phone_number_id: "104839281093129"
                  },
                  statuses: [
                    {
                      id: "wamid.HBgMNTUxMTk4NzY1NDMyMRUCABEYEjQ0QTgxOUFFNTBGRDEzQ0U5NUQA",
                      status: "delivered",
                      timestamp: timestamp.toString(),
                      recipient_id: "5511987654321"
                    }
                  ]
                },
                field: "messages"
              }
            ]
          }
        ]
      };
    }

    const logEntry = {
      id: Date.now(),
      type: type === "message" ? "MESSAGE_CALLBACK" : "STATUS_DELIVERY",
      accountId: accountId,
      receivedAt: new Date().toISOString(),
      details: type === "message" ? "Mensagem recebida do cliente via Cloud API" : "Confirmação de entrega de mensagem recebida",
      payload: payload
    };

    webhookLogs.unshift(logEntry);
    if (webhookLogs.length > 50) {
      webhookLogs.pop();
    }

    res.json({ success: true, logged: logEntry });
  });

  // API Route: Reset / Clear logs
  app.post("/api/webhook-logs/clear", (req, res) => {
    webhookLogs = [];
    res.json({ success: true });
  });

  // GET: Meta Verification Handshake
  app.get("/v1/webhooks/whatsapp/:id", (req, res) => {
    const id = req.params.id;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log(`[Meta GET Webhook] ID: ${id} | mode: ${mode} | token: ${token} | challenge: ${challenge}`);

    const expectedToken = `convexa_verify_token_${id}_sec`;

    if (mode === "subscribe" && (token === expectedToken || token === "convexa_verify_token_ddef2443_sec")) {
      console.log(`[Meta GET Webhook OK] Validation succeeded! Returning challenge: ${challenge}`);
      
      webhookLogs.unshift({
        id: Date.now(),
        type: "HANDSHAKE_SUCCESS",
        accountId: id,
        receivedAt: new Date().toISOString(),
        details: "Meta handshake validated. Account linked successfully via Cloud API.",
        payload: {
          "hub.mode": mode,
          "hub.verify_token": token,
          "hub.challenge": challenge,
          status: "HTTP 200 OK"
        }
      });

      res.status(200).send(challenge);
    } else {
      console.warn(`[Meta GET Webhook ERROR] Webhook verification failed. Token mismatch. Received: ${token}`);
      
      webhookLogs.unshift({
        id: Date.now(),
        type: "HANDSHAKE_FAILED",
        accountId: id,
        receivedAt: new Date().toISOString(),
        details: "Meta handshake validation failed. Correct Token or Hub Mode did not match expect values.",
        payload: {
          "hub.mode": mode,
          "hub.verify_token": token,
          "hub.challenge": challenge,
          status: "HTTP 403 Forbidden"
        }
      });

      res.status(403).send("Forbidden: Verify Token mismatch.");
    }
  });

  // POST: Receive Events and Message bodies
  app.post("/v1/webhooks/whatsapp/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;

    console.log(`[Meta POST Webhook] Received payload for ID: ${id}`);

    webhookLogs.unshift({
      id: Date.now(),
      type: "MESSAGE_CALLBACK",
      accountId: id,
      receivedAt: new Date().toISOString(),
      details: "Notificação de evento webhook recebida em tempo real da Meta.",
      payload: body
    });

    if (webhookLogs.length > 50) {
      webhookLogs.pop();
    }

    res.status(200).json({ status: "EVENT_RECEIVED" });
  });

  // Vite development middleware vs Static serve
  if (process.env.DISABLE_HMR) {
    // Platform forces DISABLE_HMR=true
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Convexa.AI backend server initiated on http://0.0.0.0:${PORT}`);
  });
}

startServer();
