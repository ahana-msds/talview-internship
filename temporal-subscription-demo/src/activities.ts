import { Context } from '@temporalio/activity';
import { ChargeInput, EmailInput } from './types';
import { getEmailTransporter } from './email-config';
import { eventStore } from './event-store';

export async function chargeCustomer(input: ChargeInput): Promise<void> {
    const { log } = Context.current();
    const { workflowExecution } = Context.current().info;

    log.info(`Charging customer ${input.customerId} amount ${input.amount}`);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Log event
    eventStore.addEvent({
        workflowId: workflowExecution.workflowId,
        timestamp: new Date().toISOString(),
        type: 'charge',
        action: 'Customer Charged',
        details: {
            customerId: input.customerId,
            amount: input.amount,
            currency: 'USD'
        }
    });

    console.log(`💳 Charged customer ${input.customerId} amount $${input.amount}`);
}

export async function sendEmail(input: EmailInput): Promise<void> {
    const { log } = Context.current();
    const { workflowExecution } = Context.current().info;

    log.info(`Sending email to ${input.email} with subject "${input.subject}"`);

    try {
        const transporter = await getEmailTransporter();

        const info = await transporter.sendMail({
            from: '"Temporal Subscription Demo" <demo@temporal.io>',
            to: input.email,
            subject: input.subject,
            text: input.body,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #333;">${input.subject}</h2>
          <p style="color: #666; line-height: 1.6;">${input.body}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            This is a demo email from Temporal Subscription Management System
          </p>
        </div>
      `
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);

        // Log event
        eventStore.addEvent({
            workflowId: workflowExecution.workflowId,
            timestamp: new Date().toISOString(),
            type: 'email',
            action: 'Email Sent',
            details: {
                to: input.email,
                subject: input.subject,
                messageId: info.messageId
            },
            emailPreviewUrl: previewUrl || undefined
        });

        console.log(`📧 Email sent to ${input.email}: ${input.subject}`);
        if (previewUrl) {
            console.log(`   Preview: ${previewUrl}`);
        }
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}

// Import nodemailer for getTestMessageUrl
import nodemailer from 'nodemailer';
