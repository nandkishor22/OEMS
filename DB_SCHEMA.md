# 🗄️ Database Schema & Collections

In MongoDB (MERN Stack), "tables" are called **Collections**.
These collections are created automatically when we insert the first document, but here are the definitions based on our Models:

## 1. Users Collection (`users`)
Stores all user accounts (Admins, Organizers, Users).

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique ID |
| `name` | String | Full Name |
| `email` | String | Unique Email Address |
| `password` | String | Hashed Password (bcrypt) |
| `role` | String | 'user', 'organizer', 'admin' |
| `createdAt` | Date | Timestamp |

## 2. Events Collection (`events`)
Stores all event details created by organizers.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique ID |
| `organizer` | ObjectId | Ref -> User (The creator) |
| `title` | String | Event Title |
| `description`| String | Detailed Description |
| `date` | Date | Date of Event |
| `time` | String | Time of Event |
| `location` | String | Venue Address |
| `category` | String | Music, Tech, Sports, etc. |
| `image` | String | URL to Event Banner |
| `price` | Number | Ticket Price (0 for free) |
| `ticketLimit`| Number | Total Seats Available |
| `soldTickets`| Number | Count of sold tickets |

## 3. Bookings Collection (`bookings`)
Track who booked which event.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique ID |
| `user` | ObjectId | Ref -> User (The attendee) |
| `event` | ObjectId | Ref -> Event |
| `tickets` | Number | Quantity of tickets |
| `totalAmount`| Number | Total Price Paid |
| `status` | String | 'pending', 'confirmed', 'cancelled' |
| `paymentId` | String | Payment Transaction Ref |

## 4. Payments Collection (`payments`)
Logs specific Razorpay transaction details for auditing.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique ID |
| `user` | ObjectId | Ref -> User |
| `booking` | ObjectId | Ref -> Booking |
| `razorpayOrderId` | String | Razorpay Order ID |
| `razorpayPaymentId`| String | Razorpay Payment ID |
| `amount` | Number | Amount Paid |
| `status` | String | 'success', 'failed' |
