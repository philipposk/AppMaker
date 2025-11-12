# Setting Up Subdomain: praiser.6x7.gr

This guide will help you set up the subdomain `praiser.6x7.gr` to host your Praiser website.

## Prerequisites
- ✅ You own `6x7.gr` (already registered in papaki.com)
- ✅ Your website is deployed on Vercel (or will be deployed)

## Step-by-Step Instructions

### Part 1: Add Domain in Vercel

1. **Deploy your project to Vercel** (if not already done):
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables (`GROQ_API_KEY` and `BLOB_READ_WRITE_TOKEN`)
   - Click "Deploy"

2. **Add the subdomain in Vercel**:
   - Go to your Vercel project dashboard
   - Click on **Settings** tab
   - Click on **Domains** in the left sidebar
   - Click the **"Add"** or **"Add Domain"** button
   - Enter: `praiser.6x7.gr`
   - Click **"Add"**

3. **Get the DNS record from Vercel**:
   - After adding the domain, Vercel will show you DNS configuration
   - You'll see something like:
     ```
     Type: CNAME
     Name: praiser
     Value: cname.vercel-dns.com
     ```
   - **Copy the Value/Target** (it might be `cname.vercel-dns.com` or similar)
   - **Important:** Note down the exact value - you'll need it in the next step

### Part 2: Configure DNS in papaki.com

1. **Log in to papaki.com**:
   - Go to [papaki.com](https://papaki.com)
   - Log in to your account

2. **Navigate to DNS Management**:
   - In your control panel, find your domain `6x7.gr`
   - Look for:
     - **"DNS Management"** or **"DNS Settings"**
     - **"Nameservers"** section
     - **"DNS Records"** or **"Manage DNS"**
   - Click on it to open DNS management

3. **Add CNAME Record**:
   - Look for a button like **"Add Record"**, **"New Record"**, or **"Add DNS Record"**
   - Click it to add a new DNS record
   - Fill in the form:
     - **Type:** Select `CNAME` (or `CNAME Record`)
     - **Name/Host:** Enter `praiser` (just the subdomain part, not the full domain)
     - **Value/Target:** Paste the value from Vercel (e.g., `cname.vercel-dns.com`)
     - **TTL:** Leave as default (usually 3600) or set to 3600
   - Click **"Save"** or **"Add Record"**

4. **Verify the record was added**:
   - You should see a new entry in your DNS records list:
     ```
     Type: CNAME
     Name: praiser
     Value: cname.vercel-dns.com (or whatever Vercel provided)
     ```

### Part 3: Wait for DNS Propagation

1. **DNS propagation time**:
   - DNS changes can take 1-24 hours to propagate globally
   - Usually works within 1-2 hours
   - Sometimes works within minutes

2. **Check DNS propagation**:
   - Go to [dnschecker.org](https://dnschecker.org)
   - Enter `praiser.6x7.gr`
   - Select record type: `CNAME`
   - Click "Search"
   - Wait until you see the CNAME record pointing to Vercel's servers in most locations

### Part 4: Verify in Vercel

1. **Check domain status**:
   - Go back to Vercel → Your Project → Settings → Domains
   - Look for `praiser.6x7.gr` in the list
   - Status should change from "Invalid Configuration" to "Valid Configuration" ✅
   - This usually happens automatically once DNS propagates

2. **SSL Certificate**:
   - Vercel automatically provides SSL certificates (HTTPS)
   - Once the domain is verified, your site will be accessible at `https://praiser.6x7.gr`
   - This usually takes a few minutes after DNS verification

### Part 5: Test Your Site

1. **Visit your site**:
   - Open your browser
   - Go to: `https://praiser.6x7.gr`
   - Your Praiser website should load!

2. **If it doesn't work**:
   - Wait a bit longer (DNS can take time)
   - Check DNS propagation at dnschecker.org
   - Verify the CNAME record in papaki.com matches Vercel's instructions exactly
   - Make sure there are no typos in the DNS record

## Troubleshooting

### Problem: "Invalid Configuration" in Vercel
- **Solution:** Check that the CNAME record in papaki.com exactly matches what Vercel shows
- Make sure the Name is just `praiser` (not `praiser.6x7.gr`)
- Make sure the Value/Target is exactly what Vercel provided

### Problem: Site doesn't load after DNS propagation
- **Solution:** 
  - Clear your browser cache
  - Try incognito/private browsing mode
  - Wait a few more minutes for SSL certificate to be issued

### Problem: Can't find DNS settings in papaki.com
- **Solution:**
  - Look for "Nameservers" section in your domain management
  - Contact papaki.com support for help
  - Check papaki.com documentation for "DNS management" or "CNAME records"

### Problem: DNS record already exists
- **Solution:**
  - If you see an existing CNAME record for `praiser`, you can either:
    - Edit it to point to Vercel's target
    - Delete it and create a new one

## Quick Reference

**What you need:**
- Domain: `6x7.gr` (you own this ✅)
- Subdomain: `praiser.6x7.gr` (we're creating this)
- Vercel project: Your deployed Praiser app
- DNS Record Type: `CNAME`
- DNS Record Name: `praiser`
- DNS Record Value: (Get from Vercel after adding domain)

**Final URL:** `https://praiser.6x7.gr`

## Need Help?

If you get stuck:
1. Check Vercel's domain documentation: https://vercel.com/docs/concepts/projects/domains
2. Contact papaki.com support for DNS management help
3. Check DNS propagation status at dnschecker.org

