# ShortShield Features

Complete guide to all features in ShortShield.

---

## 🛡️ Core Blocking Features

### Multi-Platform Blocking

Block short-form videos across major platforms:

- **YouTube Shorts** - Removes Shorts shelf, blocks /shorts URLs
- **TikTok** - Blocks For You feed and video pages
- **Instagram Reels** - Hides Reels tab and blocks Reels content

**How to use:**
1. Click ShortShield icon in toolbar
2. Toggle platforms on/off individually
3. Changes apply instantly

---

### SNS Feed Blocking

Block addictive social media feeds while keeping useful features:

- **Twitter** - Blocks timeline but keeps search, profiles, and DMs
- **Facebook** - Blocks News Feed but keeps Groups, Events, and Messages
- **LinkedIn** - Blocks Feed but keeps Jobs, Messaging, and Network
- **Reddit** - Blocks r/popular and r/all feeds
- **Threads** - Blocks main feed
- **Snapchat Web** - Blocks Discover feed

**Why this matters:**
You can still use these platforms for their intended purpose (networking, communication) without getting sucked into endless scrolling.

---

### Custom Domain Blocking

Add any website to your block list:

- Enter domain name (e.g., `reddit.com`)
- Add description for why you're blocking it
- Enable/disable anytime

**Use cases:**
- Block news sites during work hours
- Block gaming sites when studying
- Block any distraction-prone website

---

### Whitelist System

Allow specific content while blocking everything else:

**Types:**
- **Channel** - Allow specific YouTube channels
- **URL** - Allow specific video/post URLs
- **Domain** - Allow entire domains

**Example:**
Block YouTube Shorts, but whitelist educational channels you trust.

---

### Custom Rules

Advanced users can add custom CSS selectors to block:

```
.shorts-shelf     # Block YouTube Shorts shelf
[data-testid="FeedItem"]  # Block Twitter feed items
```

**When to use:**
- Platform updates break default blocking
- You want to block specific UI elements
- You need more granular control

---

## ⏱️ Focus & Productivity Features

### Focus Mode

**One-click distraction blocking for deep work.**

**Durations:**
- 30 minutes - Quick focus session
- 60 minutes - Standard deep work block
- 120 minutes - Extended focus time

**Soft Lock:**
When enabled, you must wait 5 seconds before canceling Focus Mode. This prevents impulsive disabling.

**How it works:**
1. Click "Focus" in popup
2. Select duration
3. All enabled platforms are blocked
4. Timer counts down in popup
5. Notification when session ends

**Perfect for:**
- Writing/coding sessions
- Studying for exams
- Important meetings
- Creative work

---

### Pomodoro Timer

**Classic 25/5 work/break technique built-in.**

**Default settings:**
- 25 min work sessions
- 5 min short breaks
- 15 min long breaks (after 4 sessions)

**Features:**
- Auto-start work sessions after breaks
- Auto-start breaks after work sessions
- Sound notifications (optional)
- Pause/resume/skip controls
- Session counter

**How to use:**
1. Open popup → Pomodoro tab
2. Click "Start Pomodoro"
3. Work for 25 minutes
4. Take 5 minute break
5. Repeat!

**Customization:**
- Change work/break durations in Options
- Toggle auto-start features
- Enable/disable sound notifications

---

### Site Time Limits

**Set daily usage limits per platform.**

**How it works:**
1. Set max daily time for each platform (e.g., 30 minutes for YouTube)
2. ShortShield tracks your usage
3. When limit reached, platform is blocked
4. Resets at midnight

**Warning system:**
- 80% usage → Yellow warning
- 100% usage → Red warning + block

**Perfect for:**
- Controlling YouTube binge-watching
- Limiting social media to 15 min/day
- Gradually reducing screen time

**View usage:**
- See time spent per platform
- Track daily limits
- Reset manually if needed

---

### Time Tracking & Reports

**Understand your browsing habits with detailed analytics.**

**Data tracked:**
- Time spent per platform (daily)
- 90-day history
- Total usage statistics
- Platform breakdown

**Visualizations:**
- Daily usage chart
- Per-platform breakdown
- Trend analysis

**Privacy:**
- All data stored locally
- No external servers
- Export/delete anytime

**Use cases:**
- Identify your biggest time wasters
- Track improvement over weeks
- Set data-driven limits

---

### Streak Tracking

**Build consistency with streak counting.**

**How it works:**
- Focus day = day with 0 blocks triggered
- Streak increases each consecutive focus day
- Breaks if you trigger blocks

**Milestones:**
- 🔥 7 days - One week focus
- 🌟 30 days - One month focus
- 💎 100 days - Master focus

**Displays:**
- Current streak
- Longest streak
- Next milestone

**Motivation:**
- Visual progress tracking
- Gamification element
- Social proof (share your streak!)

---

### Challenge Mode

**Solve puzzles before bypassing blocks.**

Makes bypassing intentional, not impulsive.

**Challenge types:**

1. **Math** - Solve arithmetic problems
   - Easy: `12 + 8 = ?`
   - Medium: `23 × 4 = ?`
   - Hard: `156 ÷ 12 + 7 × 3 = ?`

2. **Typing** - Type a sentence correctly
   - Easy: Short sentence (20 chars)
   - Medium: Paragraph (50 chars)
   - Hard: Tongue twister (80 chars)

3. **Pattern** - Memorize and reproduce pattern
   - Easy: 4-step sequence
   - Medium: 6-step sequence
   - Hard: 8-step sequence

**Cooldown system:**
- After solving, bypass lasts 5 minutes (default)
- Prevents repeated bypassing
- Configurable in settings

**Disable bypass:**
- Toggle to completely disable bypassing
- Ultimate focus mode

---

### Lockdown Mode

**PIN-protect your settings to prevent impulsive changes.**

**How it works:**
1. Set a 4-8 digit PIN
2. Activate Lockdown
3. All settings are locked
4. Must enter PIN to change anything

**Emergency bypass:**
- Forgot PIN? Request emergency bypass
- Wait 30 minutes (default, configurable)
- Lockdown automatically deactivates

**Perfect for:**
- Preventing late-night impulse setting changes
- Staying committed to focus goals
- Protecting settings from other users

**Security:**
- PIN is SHA-256 hashed
- Stored locally only
- Never transmitted

---

### Schedule Blocking

**Auto-block during specific times.**

**Examples:**
- Block 9 AM - 5 PM on weekdays (work hours)
- Block after 10 PM (sleep hygiene)
- Block weekends completely

**Schedule types:**
- Daily schedules
- Day-specific schedules
- Custom time ranges

**Override:**
- Temporarily disable schedule
- Permanent exceptions via whitelist

---

## 🎨 Customization Features

### Custom Block Page

**Personalize what users see when content is blocked.**

**Customizable elements:**
- Title text
- Message text
- Motivational quote
- Primary color
- Theme (dark/light/system)
- Show/hide bypass button

**Use cases:**
- Motivational messages to reinforce goals
- Reminders of why you're focusing
- Encouragement to stay on track

**Examples:**
```
Title: "Stay Focused"
Message: "You have work to do. Get back to it!"
Quote: "Discipline equals freedom" - Jocko Willink
```

---

### Multi-Language Support

**Use ShortShield in your preferred language.**

**Supported languages:**
- 🇬🇧 English
- 🇯🇵 Japanese (日本語)
- 🇩🇪 German (Deutsch)
- 🇪🇸 Spanish (Español)
- 🇫🇷 French (Français)
- 🇰🇷 Korean (한국어)
- 🇧🇷 Portuguese (Português)
- 🇨🇳 Chinese Simplified (简体中文)
- 🇹🇼 Chinese Traditional (繁體中文)

**Auto-detection:**
- Matches browser language by default
- Manual override in settings

---

## 🔒 Privacy & Security

### Privacy-First Design

**Zero data collection. Everything stays local.**

- No analytics
- No tracking
- No external requests
- No user accounts

**Data storage:**
- Settings: Browser local storage
- Statistics: Browser local storage
- Nothing leaves your device

### Security

**Built with security best practices:**

- Content Security Policy (CSP) enforced
- Minimal permissions requested
- PIN hashing (SHA-256)
- Regular security audits

**Open source:**
- Full code transparency
- Community reviewed
- Security researchers welcome

---

## 🌐 Cross-Browser Support

**Works on all major browsers.**

- ✅ Google Chrome
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- 🚧 Safari (planned)

**Same features everywhere:**
- Feature parity across browsers
- Manifest V3 for future-proofing
- Regular updates for all platforms

---

## 💡 Tips & Best Practices

### For Maximum Focus

1. **Start small** - Block one platform at a time
2. **Use Focus Mode** - Start with 30-minute sessions
3. **Enable Lockdown** - Make changes harder when willpower is low
4. **Track your progress** - Review weekly stats
5. **Build streaks** - Aim for 7-day streak first

### For Habit Change

1. **Set realistic limits** - Start with 60 min/day, reduce gradually
2. **Use Pomodoro** - Build structured work habits
3. **Enable Challenge Mode** - Make bypassing intentional
4. **Review analytics** - Understand your patterns
5. **Adjust gradually** - Don't go cold turkey

### For Team/Family

1. **Share your goals** - Accountability helps
2. **Use Lockdown Mode** - Prevent others from changing settings
3. **Custom block messages** - Family-friendly motivation
4. **Schedule blocking** - Coordinate focus times
5. **Track together** - Compare streaks and progress

---

## 🆘 Troubleshooting

### Block not working?

1. Check if platform is enabled in popup
2. Reload the page
3. Check whitelist for exceptions
4. Verify custom rules aren't conflicting

### Bypass not working?

1. Check if Challenge Mode is enabled
2. Verify cooldown hasn't expired
3. Check if Lockdown Mode is active
4. Try disabling and re-enabling

### Settings not saving?

1. Check browser permissions
2. Verify storage isn't full
3. Disable conflicting extensions
4. Try reinstalling extension

---

## 📞 Support

Need help? Found a bug?

- **GitHub Issues**: [Report bugs](https://github.com/adabana-saki/ShortShield/issues)
- **Discussions**: [Ask questions](https://github.com/adabana-saki/ShortShield/discussions)
- **Email**: support@adalab.pages.dev

---

**Enjoy ShortShield? Give us a ⭐ on [GitHub](https://github.com/adabana-saki/ShortShield)!**
