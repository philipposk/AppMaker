# Setting Up 6x7.gr for Your Website

Yes! `6x7.gr` will work directly - you don't need a subdomain. This is actually simpler!

## Quick Setup Steps

### Step 1: Add Domain in Vercel

1. **Go to your Vercel project**:
   - Open your project dashboard
   - Click **Settings** tab
   - Click **Domains** in the left sidebar
   - Click **"Add"** or **"Add Domain"** button

2. **Enter your domain**:
   - Type: `6x7.gr`
   - Click **"Add"**
   - Vercel will automatically also add `www.6x7.gr` for you

3. **Vercel will show you DNS records to add**:
   - You'll see something like:
     ```
     For 6x7.gr (root domain):
     Type: A
     Name: @
     Value: 76.76.21.21 (example IP - Vercel will show the actual IP)
     
     For www.6x7.gr:
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com (example - Vercel will show actual value)
     ```
   - **Copy these values** - you'll need them in the next step

### Step 2: Configure DNS in papaki.com

1. **Log in to papaki.com**:
   - Go to your control panel
   - Find your domain `6x7.gr`
   - Look for **"DNS Management"**, **"DNS Settings"**, or **"Nameservers"**

2. **Add the A record for root domain**:
   - Click **"Add Record"** or **"New Record"**
   - Fill in:
     - **Type:** `A` (or `A Record`)
     - **Name/Host:** `@` (or leave blank, or enter `6x7.gr` - depends on papaki.com interface)
     - **Value/Target:** The IP address Vercel provided (e.g., `76.76.21.21`)
     - **TTL:** 3600 (or leave default)
   - Click **"Save"**

3. **Add the CNAME record for www**:
   - Click **"Add Record"** again
   - Fill in:
     - **Type:** `CNAME` (or `CNAME Record`)
     - **Name/Host:** `www`
     - **Value/Target:** The CNAME value Vercel provided (e.g., `cname.vercel-dns.com`)
     - **TTL:** 3600 (or leave default)
   - Click **"Save"**

### Step 3: Wait for DNS Propagation

- DNS changes usually take **1-2 hours** to propagate
- Sometimes works within **15-30 minutes**
- Check propagation at: https://dnschecker.org
  - Enter `6x7.gr` and check if the A record is updated globally

### Step 4: Verify in Vercel

- Go back to Vercel → Settings → Domains
- Look for `6x7.gr` - it should show **"Valid Configuration"** ✅
- Vercel will automatically issue an SSL certificate (HTTPS)

### Step 5: Your Site is Live!

- Visit: `https://6x7.gr` ✅
- Also works at: `https://www.6x7.gr` (automatically redirects)

## Important Notes

**No activation needed!** Your domain `6x7.gr` is already active and registered. You just need to:
1. Point it to Vercel's servers (via DNS records)
2. Wait for DNS to propagate
3. That's it!

**The domain is already yours** - you just need to configure where it points to (Vercel's servers).

## Troubleshooting

### If you can't find DNS settings in papaki.com:
- Look for "Nameservers" section
- Check if there's a "DNS" or "DNS Records" tab
- Contact papaki.com support - they can guide you to the DNS management section

### If Vercel shows "Invalid Configuration":
- Double-check that the DNS records in papaki.com exactly match what Vercel shows
- Make sure there are no typos
- Wait a bit longer for DNS propagation

### If the site doesn't load:
- Wait 1-2 hours for DNS to fully propagate
- Clear browser cache
- Try incognito mode
- Check DNS propagation at dnschecker.org

## Summary

✅ **Yes, `6x7.gr` works directly!**
✅ **No activation needed** - it's already active
✅ **Just add DNS records** to point it to Vercel
✅ **Wait 1-2 hours** for DNS propagation
✅ **Your site will be live at `https://6x7.gr`**

