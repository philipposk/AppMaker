# Email Setup for praiser.6x7.gr

This guide will help you set up email addresses like `info@praiser.6x7.gr` or `contact@praiser.6x7.gr`.

## Quick Options Overview

### ✅ **Free Options:**
1. **Zoho Mail** - Free for up to 5 users, 5GB storage per user
2. **Cloudflare Email Routing** - Free email forwarding (forwards to your existing email)
3. **papaki.com Email** - Check if your registrar offers email hosting

### 💰 **Paid Options:**
1. **Google Workspace** - $6/user/month, professional Gmail
2. **Microsoft 365** - $6/user/month, Outlook
3. **ProtonMail** - Privacy-focused, various plans

---

## Option 1: Zoho Mail (Recommended - Free!)

**Best for:** Most users, free tier available

### Setup Steps:

1. **Sign up for Zoho Mail**:
   - Go to [zoho.com/mail](https://www.zoho.com/mail/)
   - Click "Sign Up Now"
   - Choose "Free Plan" (5 users, 5GB each)
   - Enter your details

2. **Add your domain**:
   - After signing up, go to **Control Panel** → **Domains**
   - Click **"Add Domain"**
   - Enter: `praiser.6x7.gr`
   - Click **"Add"**

3. **Verify domain ownership**:
   - Zoho will show you DNS records to add
   - You'll need to add a **TXT record** in papaki.com:
     - **Type:** `TXT`
     - **Name/Host:** `@` (or leave blank for root domain)
     - **Value:** Zoho will provide a verification string (e.g., `zoho-verification=xxxxx`)
     - **TTL:** 3600
   - Add this in papaki.com DNS settings
   - Wait a few minutes, then click "Verify" in Zoho

4. **Configure MX records** (for receiving email):
   - Zoho will show you MX records to add
   - In papaki.com, add these MX records:
     - **Type:** `MX`
     - **Name/Host:** `@` (or leave blank)
     - **Priority:** `10` (Zoho will show the exact priority)
     - **Value/Target:** `mx.zoho.com` (Zoho will show exact value)
     - Add a second MX record with priority `20` (Zoho will show details)
   - **Important:** Remove any existing MX records first if they exist

5. **Configure SPF record** (for sending email):
   - Add a TXT record:
     - **Type:** `TXT`
     - **Name/Host:** `@`
     - **Value:** `v=spf1 include:zoho.com ~all` (Zoho will show exact value)
     - **TTL:** 3600

6. **Create email addresses**:
   - In Zoho Mail control panel, go to **Users**
   - Click **"Add User"**
   - Create addresses like:
     - `info@praiser.6x7.gr`
     - `contact@praiser.6x7.gr`
     - `hello@praiser.6x7.gr`
     - etc.

7. **Access your email**:
   - Go to [mail.zoho.com](https://mail.zoho.com)
   - Log in with your email address
   - Or use any email client (Outlook, Apple Mail, etc.)

**Cost:** FREE for up to 5 users! 🎉

---

## Option 2: Cloudflare Email Routing (Free Email Forwarding)

**Best for:** Simple forwarding to your existing email (Gmail, etc.)

### Setup Steps:

1. **Add domain to Cloudflare**:
   - Sign up at [cloudflare.com](https://cloudflare.com)
   - Add your domain `praiser.6x7.gr`
   - Change nameservers in papaki.com to Cloudflare's nameservers
   - (This moves DNS management to Cloudflare)

2. **Enable Email Routing**:
   - In Cloudflare dashboard, go to **Email** → **Email Routing**
   - Click **"Get Started"**
   - Add destination email (your Gmail, etc.)

3. **Create forwarding addresses**:
   - Create `info@praiser.6x7.gr` → forwards to `yourname@gmail.com`
   - Create `contact@praiser.6x7.gr` → forwards to `yourname@gmail.com`
   - etc.

**Note:** This only forwards emails. You can't send FROM these addresses (unless you use Cloudflare's send feature).

**Cost:** FREE! 🎉

---

## Option 3: Check papaki.com Email Hosting

**Best for:** If your registrar offers it (might be included or cheap)

### Steps:

1. **Log in to papaki.com**
2. **Look for email options**:
   - Check your control panel for "Email" or "Email Hosting"
   - Look in the services list (like in your screenshot)
   - Check if there's an "Email Plans" section

3. **If available**:
   - Purchase/activate email hosting
   - Follow papaki.com's setup instructions
   - Usually involves adding MX records (similar to Zoho)

**Cost:** Varies (check papaki.com pricing)

---

## Option 4: Google Workspace (Paid - Professional)

**Best for:** Professional use, need Gmail interface

### Setup Steps:

1. **Sign up**:
   - Go to [workspace.google.com](https://workspace.google.com)
   - Choose a plan (usually $6/user/month)
   - Enter your domain: `praiser.6x7.gr`

2. **Verify domain**:
   - Add TXT record in papaki.com (Google will show you)
   - Verify ownership

3. **Configure MX records**:
   - Google will provide MX records
   - Add them in papaki.com DNS settings

4. **Create users**:
   - Create email addresses in Google Workspace admin panel

**Cost:** $6/user/month (~€5.50/month)

---

## DNS Records You'll Need to Add

Regardless of which service you choose, you'll need to add these in **papaki.com DNS settings**:

### For Receiving Email (MX Records):
```
Type: MX
Name: @ (or leave blank)
Priority: 10
Value: (provided by email service)
```

### For Sending Email (SPF Record):
```
Type: TXT
Name: @
Value: v=spf1 include:service.com ~all
```

### For Verification (TXT Record):
```
Type: TXT
Name: @
Value: (verification string from email service)
```

---

## Finding DNS Settings in papaki.com

Based on your domain management panel:

1. **Log in to papaki.com**
2. **Go to your domain `6x7.gr`**
3. **Look for**:
   - "DNS Management" or "DNS Settings"
   - "Nameservers" section
   - "DNS Records" or "Manage DNS"
4. **Add the records** your email provider shows you

---

## Recommended Setup

**For most users:** Start with **Zoho Mail (Free)** - it's the easiest and gives you full email functionality for free!

**Steps:**
1. Sign up at zoho.com/mail
2. Add domain `praiser.6x7.gr`
3. Add DNS records in papaki.com (TXT for verification, MX for receiving)
4. Create your email addresses
5. Done! ✅

---

## Common Email Addresses to Create

- `info@praiser.6x7.gr` - General inquiries
- `contact@praiser.6x7.gr` - Contact form
- `hello@praiser.6x7.gr` - Friendly contact
- `support@praiser.6x7.gr` - Support requests
- `admin@praiser.6x7.gr` - Administrative

---

## Need Help?

- **Zoho Support:** https://help.zoho.com
- **papaki.com Support:** Contact them for DNS help
- **DNS Checker:** https://dnschecker.org (to verify MX records)

---

## Quick Start (Zoho Mail)

1. ✅ Sign up: zoho.com/mail
2. ✅ Add domain: `praiser.6x7.gr`
3. ✅ Add TXT record in papaki.com (for verification)
4. ✅ Add MX records in papaki.com (for receiving email)
5. ✅ Create email addresses in Zoho
6. ✅ Start using email! 📧

**Time:** About 15-30 minutes
**Cost:** FREE! 🎉

