# NUSCC Frontend

The frontend for the NUSCC Website.

## 💻 Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **Database**: Prisma, Supabase
- **Styling**: Tailwind CSS, Shadcn UI components

## 🚀 Getting Started

### Prerequisites

- Node.js (v22+)
- [pnpm](https://pnpm.io/installation)
- Any tool to expose localhost to https endpoints, such as [ngrok](https://ngrok.com/docs/getting-started) or [tunnl.gg](https://tunnl.gg/)
  - This guide will be assuming you are using ngrok

### Installation

1. Set up your Telegram dev bot
   1. Go to [@BotFather](https://t.me/BotFather) on Telegram
   1. Run `/newbot`
   1. Enter a username for the bot (e.g. nusc_web_dev_bot) -> BotFather will send with a BOT_TOKEN e.g. XXXXXXXX
   1. In your `.env` file, set the following variables:
      - Set `BOT_TOKEN` with the token given by [@BotFather](https://t.me/BotFather)
      - Set `NEXT_PUBLIC_TELEGRAM_LOGIN_BOT` with your bot username

1. Clone the repository:

   ```bash
   git clone https://github.com/usdevs/NUSCweb
   cd NUSCweb
   ```

1. Install dependencies:

   ```bash
   pnpm install
   ```

1. Setup your environment variables in `.env` file, with `.env.example` for reference

1. Expose your localhost port:

   ```bash
   ngrok http 3000
   ```

   - Retrieve your custom HTTPS URL (e.g. https://xxx.ngrok.io)
   - In [@BotFather](https://t.me/BotFather), run `/setdomain`, choose your nusc dev bot, and enter the ngrok URL

1. Run the development server:

   ```bash
   pnpm dev
   ```

1. Access our dev server via the ngrok HTTPS URL (e.g. https://xxx.ngrok.io)

## ❓ Common Errors

1. If you see "Bot domain invalid" on the top nav bar, ensure your accessing your dev environment via the ngrok HTTPS URL, not your localhost
