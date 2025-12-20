import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface BookingDetails {
  id: string;
  booking_reference: string;
  package_title?: string;
  travel_date?: string;
  passengers?: number;
  total_amount?: number;
}

export const sendBookingConfirmation = async (email: string, bookingDetails: BookingDetails) => {
  try {
    if (!process.env.RESEND_API_KEY || !resend) {
      console.warn('[Email Service] RESEND_API_KEY not configured. Skipping email.');
      return false;
    }

    const { data, error } = await resend.emails.send({
      from: 'Dream Voyager <onboarding@resend.dev>', // Change to your verified domain
      to: [email],
      subject: `Booking Confirmation - ${bookingDetails.booking_reference}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #0F172A; color: white; padding: 20px; text-align: center; }
                        .content { background: #f8f9fa; padding: 30px; }
                        .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
                        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                        .highlight { color: #D4AF37; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✈️ Dream Voyager</h1>
                            <p>Your Journey Begins Here</p>
                        </div>
                        <div class="content">
                            <h2>Booking Confirmed!</h2>
                            <p>Thank you for choosing Dream Voyager. Your booking has been confirmed.</p>
                            
                            <div class="booking-details">
                                <h3>Booking Details</h3>
                                <p><strong>Booking Reference:</strong> <span class="highlight">${bookingDetails.booking_reference}</span></p>
                                ${bookingDetails.package_title ? `<p><strong>Package:</strong> ${bookingDetails.package_title}</p>` : ''}
                                ${bookingDetails.travel_date ? `<p><strong>Travel Date:</strong> ${bookingDetails.travel_date}</p>` : ''}
                                ${bookingDetails.passengers ? `<p><strong>Passengers:</strong> ${bookingDetails.passengers}</p>` : ''}
                                ${bookingDetails.total_amount ? `<p><strong>Total Amount:</strong> ₦${bookingDetails.total_amount.toLocaleString()}</p>` : ''}
                            </div>
                            
                            <p>We'll send you more details about your trip soon. If you have any questions, please don't hesitate to contact us.</p>
                        </div>
                        <div class="footer">
                            <p>© 2024 Dream Voyager. All rights reserved.</p>
                            <p>Contact: hello@dreamvoyager.com | +234 800 DREAM VOY</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    if (error) {
      console.error('[Email Service] Error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Email Service] Exception:', error);
    return false;
  }
};
