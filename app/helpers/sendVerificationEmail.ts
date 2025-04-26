import { EmailTemplate } from "@/app/components/EmailTemplate";
import { EmailTemplatePayments } from "@/app/components/EmailTemplatePayments";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email:string) {
    try {
       const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['delivered@resend.dev'],
        subject: 'Hello world',
        react: EmailTemplate({ firstName: email }),
      });
  
      if (error) {
        console.error("Resend API error:", error);
        return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
      }
      
  
      return NextResponse.json({ data }, { status: 200 });
  
    } catch (error) {
      console.error("Unexpected error sending email:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  }

export async function sendVerificationEmailPayment(paymentId:string , orderId:string, signature:string) {
    try {
       const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['delivered@resend.dev'],
        subject: 'Payment Successful',
        react: EmailTemplatePayments({ paymentId: paymentId, orderId: orderId, signature: signature }),
      });
  
      if (error) {
        console.error("Resend API error:", error);
        return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
      }
      
  
      return NextResponse.json({ data }, { status: 200 });
  
    } catch (error) {
      console.error("Unexpected error sending email:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  }  