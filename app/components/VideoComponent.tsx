import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import Script from "next/script";
import { useNotification } from "../components/Notification";

export default function VideoComponent({ video }: { video: IVideo }) {
  const { showNotification } = useNotification();
  const createOrder = async () => {
    const res = await fetch('/api/createOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // ✅ important header
      },
      body: JSON.stringify({
        amount: Number(video.price) * 100,
      }),
    });
  
    const data = await res.json();
    const paymentData = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: data.order.id,
      handler: function (response: any) {
        showNotification("Payment Successful", "success");
        showNotification("Payment ID: " + response.razorpay_payment_id, "success");

        // Async IIFE for await usage
        (async () => {
          try {
            const emailRes = await fetch("/api/successPayment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              }),
            });

            const emailData = await emailRes.json();
            if (emailRes.ok) {
              showNotification("Email sent successfully", "success");
            } else {
              showNotification("Email failed: " + emailData.error, "error");
            }
          } catch (error) {
            showNotification("Failed to notify server about payment", "error");
            console.error("Email error:", error);
          }
        })();
      },
      theme: {
        color: "#6366f1",
      },
    };
    const rzp = new (window as any).Razorpay(paymentData);
    rzp.open();
  };
  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <Script type="text/javascript" src="https://checkout.razorpay.com/v1/checkout.js"/>
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9/16" }}
          >
            <IKVideo
              path={video.videoUrl}
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
              controls={video.controls}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{video.title}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>
        <div className="flex items-center justify-between mt-2">
        <h2 className="card-title text-lg">Price:{video.price}</h2>
        <button className="btn btn-primary" onClick={createOrder}> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
