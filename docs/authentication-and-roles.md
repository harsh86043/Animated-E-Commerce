# Authentication, Authorization, and Multi-Role Specifications

This document defines the backend security architecture, multi-role matrix (Admin, Seller, Customer, Guest), secure OTP dispatch engine, and product/seller review moderation states.

---

## 1. Multi-Role Hierarchy Matrix

Our system features four primary user classifications with distinct operational scopes:

| Role | Database Type / Status | Description | Primary Operations |
| :--- | :--- | :--- | :--- |
| **Guest** | Stateless Session / Anonymous | Default unauthenticated browsing visitor. | Catalog browsing, single session cart, initiate checkout. |
| **Customer** | User / Active | Authenticated buyer. | Catalog browsing, permanent shopping cart, place orders, order history. |
| **Seller** | User + SellerProfile / Active | Registered storefront merchant. | Manage store profile, create products (as Drafts), submit for review, inventory management. |
| **Admin** | User / Active | Platform administrator. | Moderate product submissions, approve/reject/suspend sellers, global analytics dashboard. |

---

## 2. Secure OTP Authentication Engine

Our custom OTP implementation satisfies high-security guidelines to prevent common vulnerabilities (such as plain-text leaks, account enumeration, and brute forcing):

### Security Policies Implemented
1. **Cryptographic OTP Hashing (SHA256)**: OTP values are **never** stored in plain text in the database. When an OTP is generated, it is hashed with SHA256 before insertion. During verification, the input code is hashed and compared against the stored hash.
2. **Strict Expiry Policies**: All generated OTP challenges expire automatically in **5 minutes**.
3. **Attempt Limits (Rate Limiting)**:
   - Max verification attempts per challenge: **3 attempts**.
   - If exceeded, the challenge is immediately locked (`IsUsed = true`) to prevent further brute-force attempts.
4. **Resend and Request Limits**:
   - Limit of **5 OTP requests per 5 minutes** for any given destination (Email or Phone) to mitigate SMS/Email bombing and resource exhaustion attacks.

### Multi-Channel Dispatch
- **SMS Sender (Phone Numbers)**: Abstracted behind `ISmsSender`, implemented via `MockSmsSender` which outputs directly to application logs for developer simulation.
- **Email Sender (Email Addresses)**: Abstracted behind `IEmailSender`, implemented via `MockEmailSender` which outputs securely to console logs.

---

## 3. Product & Seller Moderation Lifecycles

Products and Sellers follow a strict transition of states before they can perform live operations on the platform.

### Seller Onboarding Lifecycle
```
[ Submit Store Registration ] -> (PendingApproval) --[ Admin Approves ]--> (Active / User upgraded to Seller)
                                                 --[ Admin Rejects ]--> (Rejected)
                                                 --[ Admin Suspends ]--> (Suspended)
```

- **Submission (`POST /api/seller/register`)**: Inserts a new `SellerProfile` in `PendingApproval` state.
- **Approval (`POST /api/admin/sellers/{id}/approve`)**: Transitions profile to `Active` and upgrades the associated `User`'s role to `Seller`.
- **Rejection (`POST /api/admin/sellers/{id}/reject`)**: Transitions profile to `Rejected` with a required audit reason.

### Product Submission & Moderation Lifecycle
```
[ Created by Seller ] -> (Draft) --[ Submit for Review ]--> (PendingReview) --[ Admin Approves ]--> (Approved / Active = true)
                                                                            --[ Admin Rejects ]--> (Rejected / Active = false)
                                                                            --[ Admin Suspends ]--> (Suspended / Active = false)
```

- **Draft State**: Newly created seller products start as `Draft` and are hidden from the public storefront catalog (`IsActive = false`).
- **Review Submission**: The seller submits the draft. The status transitions to `PendingReview`.
- **Moderation**: Admin can approve or reject. Upon approval, status becomes `Approved` and `IsActive` is set to `true`, instantly making it visible in the search catalog and 3D showroom.

---

## 4. Endpoints Authorization Map

The following maps access permissions for our newly introduced endpoints:

### Public / Anonymous
- `POST /api/auth/continue-guest` - Get guest session
- `POST /api/auth/register` - Create standard customer
- `POST /api/auth/login/password` - Email + Password login
- `POST /api/auth/otp/request` - Dispatch verification OTP (Returns `DevOtp` in response payload in development environments)
- `POST /api/auth/otp/verify` - Check OTP (Auto-onboards/registers guest if `Purpose = Login` and user doesn't exist)
- `POST /api/auth/forgot-password/request` - Trigger password reset OTP
- `POST /api/auth/forgot-password/reset` - Complete password reset using OTP
- `POST /api/auth/google` - Sign-in with Google Id Token
- `POST /api/checkout/start` - Initialize checkout totals for a cart
- `POST /api/cart/merge-guest-cart` - Seamlessly merges temporary items into customer's profile upon login

### Authenticated Customers
- `GET /api/auth/me` - Profile metadata

### Registered Sellers
- `GET /api/seller/profile` - Storefront info
- `PUT /api/seller/profile` - Update store profile
- `GET /api/seller/products` - List seller owned catalog
- `POST /api/seller/products` - Add product (Created as `Draft`)
- `PUT /api/seller/products/{id}` - Modify details (Reverts to `Draft` if previously rejected)
- `DELETE /api/seller/products/{id}` - Remove product
- `POST /api/seller/products/{id}/submit-for-review` - Request admin review

### System Administrators
- `GET /api/admin/sellers` - List all merchants
- `GET /api/admin/sellers/pending` - Fetch pending registrations
- `POST /api/admin/sellers/{id}/approve` - Approve merchant onboarding
- `POST /api/admin/sellers/{id}/reject` - Decline registration
- `POST /api/admin/sellers/{id}/suspend` - Terminate merchant access
- `GET /api/admin/products/pending-review` - Catalog waiting moderation
- `POST /api/admin/products/{id}/approve` - Publish product live
- `POST /api/admin/products/{id}/reject` - Decline product with feedback
- `POST /api/admin/products/{id}/suspend` - Delist product
- `GET /api/admin/dashboard/stats` - Multi-role system overview and analytics reporting
