import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;
let etherealAccount: { user: string; pass: string; web: string } | null = null;

export async function getEmailTransporter() {
    if (!transporter) {
        // Create test account with Ethereal
        const testAccount = await nodemailer.createTestAccount();
        etherealAccount = {
            user: testAccount.user,
            pass: testAccount.pass,
            web: `https://ethereal.email/messages`
        };

        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        console.log('📧 Ethereal Email Account Created:');
        console.log(`   User: ${testAccount.user}`);
        console.log(`   Pass: ${testAccount.pass}`);
        console.log(`   View emails at: https://ethereal.email/messages`);
    }

    return transporter;
}

export function getEtherealInfo() {
    return etherealAccount;
}
