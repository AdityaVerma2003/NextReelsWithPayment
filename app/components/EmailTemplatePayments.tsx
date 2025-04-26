import * as React from 'react';

interface EmailTemplateProps2 {
  paymentId: string;
  orderId: string;
  signature: string;
}

export const EmailTemplatePayments: React.FC<Readonly<EmailTemplateProps2>> = ({
  paymentId,
  orderId, 
    signature,
}) => (
  <div>
    <h1>Thank You for Your Support,
        Payment ID : {paymentId}!
        Order ID: {orderId}
        signature: {signature}</h1>
  </div>
);