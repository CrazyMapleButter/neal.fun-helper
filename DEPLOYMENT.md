# Deployment Guide

## Deploy to Vercel with Custom Domain

### Step 1: Initial Setup
1. Push your code to GitHub (if not already done)
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Import your repository

### Step 2: Environment Variables
1. In Vercel dashboard, go to your project settings
2. Add environment variable:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key (starts with sk-...)

### Step 3: Deploy
1. Vercel will automatically deploy from your main branch
2. You'll get a URL like: `https://your-project.vercel.app`

### Step 4: Connect Custom Domain
1. In Vercel project settings, go to "Domains"
2. Add your Namecheap domain (e.g., `yourdomain.com`)
3. Vercel will provide DNS records to add

### Step 5: Update Namecheap DNS
In your Namecheap dashboard:
1. Go to Domain List > Manage > Advanced DNS
2. Add these records (provided by Vercel):
   ```
   Type: CNAME
   Host: www
   Value: cname.vercel-dns.com
   
   Type: A
   Host: @
   Value: 76.76.19.61
   ```
3. Wait 24-48 hours for DNS propagation

### Alternative: Railway (Easier DNS)
1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub
3. Add environment variable: `OPENAI_API_KEY`
4. Connect custom domain in settings

Your site will be live at your custom domain!