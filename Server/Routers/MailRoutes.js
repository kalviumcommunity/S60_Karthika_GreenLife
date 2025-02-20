const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const MailRouter = express.Router();

const transportMail = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL,
        pass: process.env.APP,
    },
});

MailRouter.post("/send-mail", async (req, res) => {
    const { mail, cartDetails, totalCost } = req.body;
    if (!mail || !cartDetails || totalCost == null) {
        return res.status(400).json({ error: "Mail, cartDetails, and totalCost are required" });
    }

    try {
        const cartItemsHtml = cartDetails.map(item => `
            <li>
                <strong>${item.Name}</strong> - Quantity: ${item.Number}, Cost: ₹${item.Cost}
            </li>
        `).join("");
        const emailDetails = {
            from: process.env.MAIL,
            to: mail,
            subject: "Thank You for Your Purchase at GreenLife!",
            html: `
                <p>Dear Customer,</p>
                <p>Your order has been successfully processed. Here are the details of your purchase:</p>
                <ul>${cartItemsHtml}</ul>
                <p><strong>Total Cost:</strong> ₹${totalCost}</p>
                <p>Thank you for shopping with GreenLife!</p>
                <p>Sincerely,<br>The GreenLife Team</p>
            `,
        };

        await transportMail.sendMail(emailDetails);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send email" });
    }
});

MailRouter.post("/single/send-mail", async (req, res) => {
    const { mail, SinglePurchase } = req.body;

    if (!mail || !SinglePurchase) {
        return res.status(400).json({ error: "Mail and SinglePurchase details are required" });
    }

    try {
        const purchaseHtml = `
            <li>
                <strong>Plant ID:</strong> ${SinglePurchase.id} <br>
                <strong>Quantity:</strong> ${SinglePurchase.quantity} <br>
                <strong>Cost:</strong> ₹${SinglePurchase.PlantCost}
            </li>
        `;

        const emailDetails = {
            from: process.env.MAIL,
            to: mail,
            subject: "Thank You for Your Purchase at GreenLife!",
            html: `
                <p>Dear Customer,</p>
                <p>Your order has been successfully processed. Here are the details of your purchase:</p>
                <ul>${purchaseHtml}</ul>
                <p><strong>Total Cost:</strong> ₹${SinglePurchase.PlantCost * SinglePurchase.quantity}</p>
                <p>Thank you for shopping with GreenLife!</p>
                <p>Sincerely,<br>The GreenLife Team</p>
            `,
        };

        await transportMail.sendMail(emailDetails);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send email" });
    }
});


module.exports=MailRouter