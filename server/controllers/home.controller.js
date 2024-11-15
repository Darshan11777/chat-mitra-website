// import db from "../database/db.js";

// import wbm from 'wbm';
// const { Client } = wbm;
// export const enquiry_add = (req, res) => {
//   const { name, email, phone, message } = req.body;
//   db.query(
//     "INSERT INTO chat_mitra_enquiry (name, email, phone, message) VALUES (?, ?, ?, ?)",
//     [name, email, phone, message],
//     (err, result) => {
//       if (err) {
//         console.error("Error inserting enquiry:", err);
//         res.status(500).json({ error: "Failed to submit enquiry" });
//       } else {
//         res.status(201).json({ message: "Enquiry submitted successfully" });
//       }
//     }
//   );
// };

// export const feedback_add = (req, res) => {
//   const { rating, name, feedback } = req.body;

//   db.query(
//     "INSERT INTO chat_mitra_feedback (rating, name, feedback) VALUES (?, ?, ?)",
//     [rating, name, feedback],
//     (err, result) => {
//       if (err) {
//         console.error("Error inserting feedback:", err);
//         res.status(500).json({ error: "Failed to submit feedback" });
//       } else {
//         wbm.start().then(async () => {
//             const contacts = [
//               { phone: "+91 8866019955", name: "Bruno", age: 21 },
//               { phone: "8460609083", name: "Will", age: 33 },
//             ];

//             // Hi Bruno, your age is 21
//             // Hi Will, your age is 33
//             const message = 'Hi {{name}}, your age is {{age}}';
//             await wbm.send(contacts, message);
//             await wbm.end();
//           })
//           .catch((err) => console.log(err));
//         res.status(201).json({ message: "Feedback submitted successfully" });
//       }
//     }
//   );
// };


// export const feedback_add = async (req, res) => { // Make the function async
//     const { rating, name, feedback } = req.body;

//     try {
//         const result = await new Promise((resolve, reject) => {
//             db.query(
//                 "INSERT INTO chat_mitra_feedback (rating, name, feedback) VALUES (?, ?, ?)",
//                 [rating, name, feedback],
//                 (err, result) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(result);
//                     }
//                 }
//             );
//         });

//         try {
//           // Start the WhatsApp Web client
//           await wbm.start();  // Start the client

//           const message = `New feedback received:\nName: ${name}\nRating: ${rating}\nFeedback: ${feedback}`;

//           const contacts = [
//               { phone: "919517789948", name: "Abhishek Sahu" }  // Replace with the actual contact
//           ];

//           // Send the message
//           await wbm.send(contacts, message);
//           await wbm.end();  // Close the client

//           console.log("WhatsApp message sent successfully.");
//       } catch (whatsappError) {
//           console.error("Error sending WhatsApp message:", whatsappError);
//           // Handle WhatsApp error, but don't block feedback submission
//       }



//         res.status(201).json({ message: "Feedback submitted successfully" });

//     } catch (error) {
//         console.error("Error inserting feedback:", error);
//         res.status(500).json({ error: "Failed to submit feedback" });
//     }
// };

import db from "../database/db.js";
import pkg from 'whatsapp-web.js';
import qrcodeTerminal from 'qrcode-terminal';  // For generating QR code in terminal


const { Client, LocalAuth } = pkg;


export const enquiry_add = (req, res) => {
  const { name, email, phone, message } = req.body;
  db.query(
    "INSERT INTO chat_mitra_enquiry (name, email, phone, message) VALUES (?, ?, ?, ?)",
    [name, email, phone, message],
    (err, result) => {
      if (err) {
        console.error("Error inserting enquiry:", err);
        res.status(500).json({ error: "Failed to submit enquiry" });
      } else {
        res.status(201).json({ message: "Enquiry submitted successfully" });
      }
    }
  );
};
const sendWhatsAppMessage = async (client, contact, message, retries = 3) => {
  while (retries > 0) {
      try {
          await client.sendMessage(contact, message);
          console.log('WhatsApp message sent successfully.');
          return true;
      } catch (error) {
          console.error("Error sending message, retries left:", retries, error);
          retries--;
          await new Promise(res => setTimeout(res, 2000));  // Wait 2 seconds before retry
      }
  }
  throw new Error("Failed to send WhatsApp message after multiple retries");
};


export const feedback_add = async (req, res) => {
  const { rating, name, feedback } = req.body;

  try {
      const result = await new Promise((resolve, reject) => {
          db.query(
              "INSERT INTO chat_mitra_feedback (rating, name, feedback) VALUES (?, ?, ?)",
              [rating, name, feedback],
              (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
              }
          );
      });

      const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',  // Reduces memory issues
                '--disable-extensions',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
            ],
        },
    });
    
      client.on('qr', (qr) => {
          qrcodeTerminal.generate(qr, { small: true });
          console.log('QR Code generated! Scan to connect.');
      });

      client.on('ready', async () => {
          try {
              const message = `New feedback received:\nName: ${name}\nRating: ${rating}\nFeedback: ${feedback}`;
              const contact = "919517789948";

              await sendWhatsAppMessage(client, contact, message);
              console.log('WhatsApp message sent successfully.');
              res.status(201).json({ message: "Feedback submitted successfully" });
          } catch (whatsappError) {
              console.error("Error sending WhatsApp message:", whatsappError);
              res.status(500).json({ error: "Failed to send WhatsApp message" });
          } finally {
              setTimeout(() => client.destroy(), 5000); // Delay destroy for message processing
          }
      });

      client.initialize();

  } catch (error) {
      console.error("Error inserting feedback:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
  }
};
