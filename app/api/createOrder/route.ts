
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    console.log("Request received to create order");
    const { amount } = await req.json();
    console.log("Amount:", amount); // should show up in terminal
    const order = await instance.orders.create({
      amount,
      currency: "INR",
    });
    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}