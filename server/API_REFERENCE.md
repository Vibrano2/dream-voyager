# Dream Voyager API - Quick Reference

## Base URL
```
http://localhost:5000
```

## Available Endpoints

### Public Endpoints

#### Get All Packages
```http
GET /api/packages
```

Query Parameters:
- `category` (optional): dubai, europe, africa, asia, americas, honeymoon, corporate, education
- `featured` (optional): true/false

Example:
```bash
curl http://localhost:5000/api/packages?category=dubai&featured=true
```

#### Get Single Package
```http
GET /api/packages/:id
```

---

### Protected Endpoints (Require Authentication)

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "package_id": "uuid",
  "passengers": 2,
  "travel_date": "2024-12-25",
  "total_amount": 2500000,
  "passenger_details": []
}
```

#### Initialize Payment
```http
POST /api/payments/initialize
Authorization: Bearer {token}
Content-Type: application/json

{
  "booking_id": "uuid",
  "amount": 2500000
}
```

Response:
```json
{
  "message": "Payment initialized successfully",
  "payment_url": "https://checkout.paystack.com/...",
  "reference": "DV-PAY-1234567890-123456",
  "payment": {...}
}
```

#### Verify Payment
```http
GET /api/payments/verify/:reference
Authorization: Bearer {token}
```

#### Get User Payments
```http
GET /api/payments/user
Authorization: Bearer {token}
```

---

### Admin Endpoints (Require Admin Role)

#### Create Package
```http
POST /api/packages
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "New Package",
  "description": "Description",
  "location": "Location",
  "duration": "5 Days / 4 Nights",
  "price": 2500000,
  "category": "dubai",
  "image_url": "https://...",
  "featured": true
}
```

#### Update Package
```http
PUT /api/packages/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "price": 3000000,
  "available": true
}
```

#### Delete Package
```http
DELETE /api/packages/:id
Authorization: Bearer {admin_token}
```

---

## Testing with cURL

### Get Packages
```bash
curl http://localhost:5000/api/packages
```

### Test Server Health
```bash
curl http://localhost:5000
```

Expected Response:
```json
{
  "message": "Dream Voyager API is secure and running"
}
```

---

## Environment Variables

Make sure your `.env` file has:
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ RESEND_API_KEY
- ✅ PAYSTACK_SECRET_KEY
- ✅ PAYSTACK_PUBLIC_KEY

---

## Next Steps

1. **Run Database Schema**: Execute `server/database/schema.sql` in Supabase SQL Editor
2. **Test Packages Endpoint**: `curl http://localhost:5000/api/packages`
3. **Implement Frontend**: Connect React app to these endpoints
4. **Test Payment Flow**: Use Paystack test card `4084084084084081`
