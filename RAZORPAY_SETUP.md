# Razorpay Sandbox Integration

This project includes Razorpay payment gateway integration for handling payments securely.

## Setup Instructions

### 1. Create a Razorpay Account

1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/signup) and sign up for an account
2. Complete the signup process and verify your email

### 2. Get Your Razorpay Credentials

#### For Testing (Sandbox Mode):

1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **API Keys**
3. Under **Test Mode**, click "Generate Test Key"
4. Copy your **Test Key ID** (starts with `rzp_test_`)
5. Copy your **Test Key Secret**

**Important**: Keep these credentials secure and never commit them to version control.

### 3. Configure Environment Variables

Update your `.env` file with your Razorpay credentials:

```bash
# Razorpay Configuration (Sandbox)
VITE_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
```

**Note**:
- `VITE_RAZORPAY_KEY_ID` is exposed to the frontend (public key)
- `RAZORPAY_KEY_SECRET` is used only in backend/edge functions (private key)

### 4. Configure Supabase Edge Function Secrets

Once your Supabase database is connected, you need to add the Razorpay credentials as secrets for the edge functions:

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** → **Secrets**
3. Add the following secrets:
   - `RAZORPAY_KEY_ID`: Your Razorpay Test Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Test Key Secret

### 5. Deploy Edge Functions

The following edge functions need to be deployed to Supabase:

1. **create-razorpay-order**: Creates a payment order on Razorpay
2. **verify-razorpay-payment**: Verifies payment signature for security

These functions are located in:
- `supabase/functions/create-razorpay-order/index.ts`
- `supabase/functions/verify-razorpay-payment/index.ts`

They will be automatically deployed when Supabase is properly configured.

## Testing Payments

### Test Card Details

Use these test credentials in Razorpay sandbox mode:

#### Test Cards:

**Success**:
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure** (to test failed payments):
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

#### Test UPI:
- UPI ID: `success@razorpay`

#### Test Netbanking:
- Select any bank
- Use the test credentials provided on the payment page

### Testing the Payment Flow

1. Browse to a product on your application
2. Select rental dates and proceed to payment
3. Choose "Razorpay (UPI, Cards, Netbanking)" as payment method
4. Click "Complete Payment"
5. The Razorpay checkout modal will appear
6. Use the test credentials above to complete the payment
7. Payment will be verified and you'll be redirected to your rentals page

## Payment Flow Architecture

1. **Frontend**: User initiates payment
2. **Edge Function** (`create-razorpay-order`): Creates an order on Razorpay
3. **Frontend**: Opens Razorpay checkout modal with order details
4. **User**: Completes payment in Razorpay modal
5. **Razorpay**: Processes payment and returns response
6. **Edge Function** (`verify-razorpay-payment`): Verifies payment signature
7. **Frontend**: Confirms successful payment and updates UI

## Security Features

- Payment signatures are verified server-side for security
- Razorpay secret key is never exposed to the frontend
- All payment transactions are logged in the database
- Row Level Security (RLS) ensures users can only see their own transactions

## Database Schema

Payment transactions are stored in the `payment_transactions` table with:
- Order and payment IDs from Razorpay
- Payment amount and currency
- Payment status (pending, success, failed, refunded)
- Payment method used
- Additional metadata

## Going Live

When ready to accept real payments:

1. Complete KYC verification on Razorpay
2. Switch to **Live Mode** in Razorpay Dashboard
3. Generate **Live API Keys**
4. Update environment variables with live credentials
5. Update Supabase edge function secrets with live credentials
6. Test thoroughly in production before announcing

## Support

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
