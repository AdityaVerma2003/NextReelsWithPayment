import { sendVerificationEmailPayment } from "@/app/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const{paymentId, orderId, signature} = await req.json();
        if(!paymentId || !orderId || !signature){
            return NextResponse.json({error: "Missing paymentId, orderId or signature"}, {status: 400});
        }
        const emailResponse = await sendVerificationEmailPayment(
            paymentId,
            orderId,
            signature
        );
        if (emailResponse.status !== 200) {
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }
        return NextResponse.json({ message: "Payment successful" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}