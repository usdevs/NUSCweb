# NUSCC Frontend

The frontend for the NUSCC Website.

## 💻 Technologies Used

- Frontend: Next.js, React, TypeScript
- Styling: Tailwind CSS, Shadcn UI components
- State Management: React Hooks (useState, useEffect)
- Icons: Lucide React
- Date Handling: date-fns

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- pnpm
- ngrok account

### Installation

1. Clone the repository:

git clone https://github.com/usdevs/NUSCweb
cd NUSCweb

2. Install dependencies
pnpm install

3. Setup your environment variables in .env file
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.jybpfrxduyftoqptiovt:Zj6gP6K5zAbpQDZQ@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.jybpfrxduyftoqptiovt:Zj6gP6K5zAbpQDZQ@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

BOT_TOKEN= 
SECRET_KEY=

NEXT_PUBLIC_TELEGRAM_LOGIN_BOT=
## leave blank
NEXT_PUBLIC_POSTHOG_KEY= 
NEXT_PUBLIC_POSTHOG_HOST=
If first time, For BOT_TOKEN; SECRET KEY; NEXT_PUBLIC_TELEGRAM_LOGIN_BOT 
1. Go to @BotFather on Telegram
2. /newbot
3. input username for bot e.g. nuscc_web -> BotFather will send with a BOT_TOKEN e.g. 8209225870:AAGdI4Adj7It0fVrUFx4j4NB5FwsAeROADo
4. BOT_TOKEN= "8209225870:AAGdI4Adj7It0fVrUFx4j4NB5FwsAeROADo"
5. NEXT_PUBLIC_TELEGRAM_LOGIN_BOT= "nuscc_web"
6. SECRET_KEY="your_super_secret_random_string_here_12345"

4. Go to https://dashboard.ngrok.com/get-started/your-authtoken and copy your authtoken 
In powershell, run: 
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
Then 
ngrok http 3000
You sould now see a HTTPS URL like https://nonfeatured-shawnna-skilled.ngrok-free.dev -> http://localhost:3000  
Then in @BotFather: 
1. /mybots 
2. Select nuscc_web (your username)
3. Click "Bot Settings"
4. Click "Domain"
5. Reply with: https://nonfeatured-shawnna-skilled.ngrok-free.dev (HTTPS URL given)
5. Run the development server:

pnpm dev

6. Open your ngrok HTTPS URL e.g. <https.//abc123.ngrok.io> in your browser to see the frontend.

### Common Errors
1. If you see "Bot domain invalid" on the top nav bar, make sure you are not on localhost:3000 and on the ngrok https url
