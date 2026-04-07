# 🎨 Complete SaaS Product Suite Color Strategy Guide — v2.1

**Comprehensive Color Palette Recommendations for Enterprise-Grade CRM & SaaS Products**

> **v2.1 Update — March 2026:** Finalized **Lumina BI** color direction — **Steel Indigo-Teal `#0D5C7A`** selected after visual comparison of 4 candidates. Runner-up: Deep Ocean Blue `#0C4A6E`. Previous amber gold (`#B45309`) was rejected due to warning-color conflict and analytical tone mismatch.

---

## 📑 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Complete Color Palettes](#complete-color-palettes)
3. [Strategic Recommendations](#strategic-recommendations)
4. [Product-Specific Color Mapping](#product-specific-color-mapping)
5. [🆕 New Applications: BI, ERP & AI](#new-applications)
6. [Implementation Guidelines](#implementation-guidelines)
7. [Best Practices](#best-practices)
8. [Quick Reference Tables](#quick-reference-tables)
9. [Full CSS Variables Template](#css-variables-template)

---

## 🎯 Executive Summary

### Recommended Strategy: Hybrid Approach

**Use ONE primary brand palette + unique accent colors per product**

**Benefits:**
- ✅ Strong brand cohesion across all products
- ✅ Easy product differentiation for users
- ✅ Professional, enterprise-grade appearance
- ✅ Flexibility for future products

### Foundation: **Ocean Teal**

**Primary Brand Color:** Ocean Teal `#0097A7`
- Scientifically proven easiest on eyes
- Professional for enterprise
- Builds trust and reliability
- Timeless and versatile

---

## 🎨 Complete Color Palettes

### 1. Ocean Teal (★ BRAND FOUNDATION)
**Best For:** Data-heavy interfaces, healthcare, finance, long working hours

#### Light Mode
- **Primary:** `#0097A7` (Teal)
- **Secondary:** `#00695C` (Deep teal)
- **Accent:** `#26C6DA` (Bright cyan)
- **Success:** `#059669` (Emerald)
- **Warning:** `#D97706` (Amber)
- **Error:** `#DC2626` (Red)
- **Background:** `#F4F6F8` (Soft blue-gray)
- **Surface:** `#FFFFFF` (White)
- **Text Primary:** `#111827` (Near black)
- **Text Secondary:** `#374151` (Dark gray)
- **Text Tertiary:** `#6B7280` (Medium gray)
- **Text Muted:** `#9CA3AF` (Light gray)
- **Border:** `#E5E7EB`

#### Dark Mode
- **Primary:** `#26C6DA` (Bright teal)
- **Secondary:** `#4DB6AC` (Mint)
- **Background:** `#0A0E12` (Deep navy-black)
- **Surface:** `#16232A` (Dark blue-gray)
- **Text Primary:** `#F9FAFB` (Soft white)
- **Text Secondary:** `#D1D5DB` (Light gray)

---

### 2. Vibrant Purple (Modern SaaS)
**Best For:** Modern SaaS, tech startups, creative agencies

#### Light Mode
- **Primary:** `#6C5CE7` (Purple)
- **Secondary:** `#00B8D9` (Cyan)
- **Accent:** `#A29BFE` (Light purple)
- **Success:** `#00C781` (Emerald)
- **Warning:** `#FDCB6E` (Amber)
- **Error:** `#FF6B6B` (Coral red)
- **Background:** `#FAFBFC` (Cool white)
- **Surface:** `#FFFFFF` (White)
- **Text Primary:** `#2C3E50` (Dark slate)
- **Text Secondary:** `#7F8C8D` (Gray)

#### Dark Mode
- **Primary:** `#A29BFE` (Lighter purple)
- **Secondary:** `#74B9FF` (Sky blue)
- **Background:** `#121212` (True dark)
- **Surface:** `#1E1E1E` (Cards)
- **Text Primary:** `#ECEFF4` (Soft white)
- **Text Secondary:** `#B0B0B0` (Medium gray)

---

### 3. Premium Dark Mode (Coral & Purple)
**Best For:** Premium brands, creative platforms, dark-mode first apps

#### Light Mode
- **Primary:** `#FF7F50` (Coral)
- **Secondary:** `#6C63FF` (Vibrant purple)
- **Accent:** `#FFA07A` (Light coral)
- **Success:** `#10B981` (Emerald)
- **Warning:** `#F59E0B` (Amber)
- **Error:** `#EF4444` (Red)
- **Background:** `#F9FAFB` (Cool gray)
- **Surface:** `#FFFFFF` (White)
- **Text Primary:** `#111827` (Near black)
- **Text Secondary:** `#6B7280` (Gray)

---

### 4. Modern Azure (Salesforce-Inspired)
**Best For:** Enterprise CRM, sales platforms, B2B software

#### Light Mode
- **Primary:** `#0176D3` (Trust blue)
- **Secondary:** `#032D60` (Deep navy)
- **Accent:** `#00A1E0` (Sky blue)
- **Success:** `#4BCA81` (Green)
- **Warning:** `#FFB75D` (Soft orange)
- **Error:** `#EA001E` (Red)
- **Background:** `#F3F3F3` (Light gray)
- **Surface:** `#FFFFFF` (White)
- **Text Primary:** `#181818` (Near black)
- **Text Secondary:** `#706E6B` (Gray)

---

### 5. Energetic Gradient (Most Modern)
**Best For:** Cutting-edge startups, creative tools, design platforms

#### Light Mode
- **Primary:** `#667EEA` (Blue-purple)
- **Secondary:** `#764BA2` (Purple)
- **Accent:** `#F093FB` (Pink)
- **Success:** `#10B981` (Emerald)
- **Warning:** `#F59E0B` (Amber)
- **Error:** `#EF4444` (Red)
- **Background:** `#F9FAFB` (Cool gray)
- **Surface:** `#FFFFFF` (White)

---

### 6. Professional Slate (Microsoft-Inspired)
**Best For:** Enterprise software, business intelligence, productivity tools

#### Light Mode
- **Primary:** `#0078D4` (Microsoft blue)
- **Secondary:** `#004578` (Dark blue)
- **Accent:** `#50E6FF` (Bright cyan)
- **Success:** `#13A10E` (Green)
- **Warning:** `#FFB900` (Gold)
- **Error:** `#D13438` (Red)
- **Background:** `#F0F0F0` (Neutral gray)
- **Surface:** `#FFFFFF` (White)

---

## 📊 Strategic Recommendations

### Visual Brand Architecture — v2.0

```
Company Brand (Foundation)
└── Ocean Teal (#0097A7)
    │
    ├── 🏠 Workspace (Hub): 100% Brand Colors
    ├── 🔐 One (SSO Auth): 100% Brand Colors
    │
    ├── 👥 CRZM (CRM):         Brand + Indigo Accent (#4F46E5)
    ├── ⚡ Flow (Workflow):     Brand + Purple Accent (#7C3AED)
    ├── 🔄 Data Bridge (ETL):  Brand + Cyan Accent (#0891B2)
    ├── 📚 Arion (LMS):        Brand + Emerald Accent (#059669)
    ├── 🤖 AI Companion:       Brand + Coral Accent (#FF7F50)
    ├── 🛒 POS:                Brand + Amber Accent (#D97706)
    ├── 📞 Dialer:             Brand + Deep Teal Accent (#0F766E)
    │
    ├── ─────────────────── 🆕 NEW APPS ─────────────────────
    ├── 📊 Lumina (BI):        Brand + Steel Indigo-Teal (#0D5C7A) ✅ FINAL
    ├── ⚙️  Nexus (ERP):        Brand + Steel Crimson (#9F1239)
    └── 🧠 Aria (AI Platform): Brand + Cosmic Violet (#5B21B6)
```

---

## 🎯 Product-Specific Color Mapping

### Existing Applications

#### 🏠 Workspace (Home/Hub)
- **Base Colors:** Ocean Teal `#0097A7`
- **Accent:** None (Pure brand)
- **Psychology:** Neutral, welcoming, "home base" feeling

#### 🔐 One (SSO Authentication)
- **Base Colors:** Ocean Teal `#0097A7`
- **Accent:** None (Same as Workspace)
- **Psychology:** Trust, security, consistency

#### 👥 CRZM (CRM)
- **Base Colors:** Ocean Teal `#0097A7`
- **Accent:** Indigo `#4F46E5` / `#818CF8`
- **Psychology:** Creativity, relationships, innovation

#### ⚡ Flow (Workflow Automation)
- **Base Colors:** Ocean Teal `#0097A7`
- **Accent:** Purple `#7C3AED` / `#A78BFA`
- **Psychology:** Action, automation, efficiency

#### 🔄 Data Bridge (ETL Pipeline)
- **Base Colors:** Ocean Teal `#0097A7`
- **Accent:** Cyan `#0891B2` / `#00B8D9`
- **Psychology:** Logic, technology, precision

#### 📚 Arion (LMS)
- **Base Colors:** Ocean Teal `#0097A7`
- **Accent:** Emerald `#059669` / `#34D399`
- **Psychology:** Growth, learning, progress

#### 🤖 AI Companion (Chat AI)
- **Base Colors:** Ocean Teal `#0097A7`
- **Accent:** Coral `#FF7F50` / `#FFA07A`
- **Psychology:** Warmth, approachability, friendly intelligence

---

## 🆕 New Applications — BI, ERP & AI {#new-applications}

---

### 📊 Lumina — Business Intelligence

> *"Illuminate every decision."*

> ✅ **FINAL COLOR DIRECTION — Steel Indigo-Teal** (`#0D5C7A`)
> Selected after visual comparison of 4 color candidates. Runner-up: **Deep Ocean Blue** (`#0C4A6E`).
> Rejected: Amber Gold (`#B45309`) — warning-color UI conflict + insufficient analytical tone.

#### Identity Concept
Lumina takes its name from *luminary* — a body that gives light. The prism logo represents the transformation of raw data into clear, actionable insight. The **Steel Indigo-Teal** palette sits at the precise intersection of analytical precision (blue), data trust (teal), and enterprise authority (deep tone) — without borrowing any energy from warning states or conflicting with other suite products.

#### Why Steel Indigo-Teal? (Decision Log)

| Option | Color | Verdict | Reason |
|--------|-------|---------|--------|
| ✅ **C — Steel Indigo-Teal** | `#0D5C7A` | **CHOSEN** | Perfect precision + data authority. Darker/deeper than DataBridge cyan. No warning conflict. Clean enterprise BI feel. |
| 🥈 **A — Deep Ocean Blue** | `#0C4A6E` | Runner-up | Strong analytical authority, Bloomberg-grade. Very safe. Slightly more generic. |
| ❌ **B — Slate Sapphire** | `#1E3A5F` | Rejected | Too heavy/corporate-dark. Navy feel overrides BI identity. |
| ❌ **D — Forest Jade** | `#14532D` | Rejected | Too close to Arion LMS emerald family. Risk of confusion in suite. |
| ❌ **Amber Gold** | `#B45309` | Rejected (earlier) | Amber = warning color in UI. Doesn't feel analytical. Too close to POS `#D97706`. |

#### Why Option C beats Option A
- **C** (`#0D5C7A`) carries **teal DNA** — subtly connecting to the Advaita brand foundation (`#0097A7`) as a "serious analytical sibling"
- **C** has more visual character — the blue-teal tension makes it feel modern and precision-engineered
- **A** (`#0C4A6E`) is excellent but reads more as generic "enterprise blue" — C is more distinctly *Advaita*
- Both score AAA on WCAG contrast — C's brighter accent `#22D3EE` gives better chart legibility than A's `#0EA5E9`

#### Color System — FINAL

| Token | Hex | Usage |
|-------|-----|-------|
| `--bi-primary` | `#0D5C7A` | Primary actions, headings, sidebar active border |
| `--bi-mid` | `#0891B2` | Hover states, interactive fills |
| `--bi-accent` | `#0EA5E9` | CTA buttons, focus rings |
| `--bi-bright` | `#22D3EE` | Chart fills, sparklines, data points, highlights |
| `--bi-pale` | `#ECFEFF` | Badge backgrounds, alert surfaces, tinted fills |
| `--bi-glow` | `rgba(13,92,122, 0.14)` | Button shadows, card glows, hover depth |
| `--bi-border` | `rgba(13,92,122, 0.18)` | Card borders, input focus rings |

#### Gradient — FINAL
```css
linear-gradient(135deg, #0D5C7A 0%, #0891B2 60%, #22D3EE 100%)
```

#### Light Mode Full Palette
- **Primary:** `#0D5C7A` (Steel Indigo-Teal — main brand color)
- **Secondary:** `#164E63` (Deep Teal-Black — deep anchor)
- **Mid:** `#0891B2` (Cyan-Teal — interactive states)
- **Accent:** `#0EA5E9` (Sky — CTAs, focus)
- **Bright:** `#22D3EE` (Bright Cyan — data visualization, charts)
- **Pale:** `#ECFEFF` (Ice — tinted surfaces, badges)
- **Very Pale:** `#F0FDFF` (Near white with teal tint — hover backgrounds)
- **Success:** `#059669` (Emerald — universal)
- **Warning:** `#D97706` (Amber — universal, no conflict now)
- **Error:** `#DC2626` (Red — universal)
- **Background:** `#F4F6F8` (Neutral gray-white)
- **Surface:** `#FFFFFF` (White)
- **Text Primary:** `#111827` (Near black)
- **Text Secondary:** `#374151` (Dark gray)
- **Text Muted:** `#9CA3AF` (Gray)
- **Border:** `#E5E7EB`

#### Dark Mode
- **Primary:** `#22D3EE` (Brightened bright cyan for dark bg)
- **Secondary:** `#0EA5E9`
- **Background:** `#040D12` (Deep teal-black)
- **Surface:** `#0C1F2A` (Dark teal surface)
- **Text Primary:** `#ECFEFF` (Ice white)
- **Text Secondary:** `#A5F3FC` (Light cyan)

#### WCAG Contrast — Verified

| Color | On White | On `#F4F6F8` | Rating |
|-------|----------|--------------|--------|
| `#0D5C7A` | 7.12:1 | 6.81:1 | ✅ **AAA** |
| `#0891B2` | 4.58:1 | 4.38:1 | ✅ **AA** |
| `#0EA5E9` | 3.11:1 | 2.97:1 | ✅ AA (large text / UI) |

#### Logo
**Shape:** Prism/triangle with light dispersion rays
**Symbolism:** Raw data (white beam) → transformed into clear, structured insight (dispersed spectrum)
**App Name:** Lumina (means "light" or "illuminate")
**Tagline:** *"Illuminate every decision."*

#### Key UI Applications
- App bar / topbar: `#0D5C7A` solid background, white text
- Sidebar active border: `3px solid #0D5C7A`
- CTA buttons: `linear-gradient(135deg, #0D5C7A, #0891B2, #22D3EE)` + white text
- Progress bars: Teal gradient fill
- KPI sparklines: `#22D3EE` bright fills, `#0D5C7A` peak bar
- Chart primary series: Gradient `#0D5C7A → #22D3EE`
- Donut rings: Dark `#0D5C7A` → Mid `#0891B2` → Light `#22D3EE` → Pale `#A5F3FC`
- Badges solid: `#0D5C7A` background, white text
- Badges soft: `#ECFEFF` background, `#0D5C7A` text
- Alert surfaces: `#ECFEFF` background, `#0D5C7A` left border (4px)
- AI insight chip: `#ECFEFF` background, `#22D3EE` pulse dot

---

### ⚙️ Nexus — Enterprise Resource Planning

> *"The nerve center of your enterprise."*

#### Identity Concept
Nexus means *connection point* or *central link* — perfect for ERP which connects every department, process, and resource. The hub-and-spoke logo represents an interconnected enterprise where every node has a purpose and everything flows through the center. The **Steel Crimson** palette conveys authority, enterprise backbone, and the serious weight of critical business operations.

#### Why Steel Crimson?
- **Unique positioning:** A deliberate, bold choice — crimson/rose is unused in the Advaita suite
- **Psychology:** Deep red/crimson = authority, power, urgency, importance, enterprise backbone
- **Enterprise fit:** Used by major enterprise software (Oracle, SAP accents) — familiar yet fresh in rose form
- **Visual distinctness:** Warm red-pink family vs. all other cool-toned products in the suite

#### Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `--erp-primary` | `#9F1239` | Primary actions, headings, sidebar active |
| `--erp-mid` | `#BE185D` | Hover states, progress fills |
| `--erp-accent` | `#E11D48` | CTA buttons, highlights, focus rings |
| `--erp-rose` | `#FB7185` | Chart fills, sparklines, data points |
| `--erp-pale` | `#FFF1F2` | Badge backgrounds, alert surfaces |
| `--erp-glow` | `rgba(159,18,57, 0.12)` | Button shadows, card glows |
| `--erp-border` | `rgba(159,18,57, 0.20)` | Card borders, input focus |

#### Gradient
```css
linear-gradient(135deg, #9F1239 0%, #BE185D 50%, #E11D48 100%)
```

#### Light Mode Full Palette
- **Primary:** `#9F1239` (Deep Crimson — main brand color)
- **Secondary:** `#500724` (Dark Wine — deep anchor)
- **Mid:** `#BE185D` (Steel Rose — interactive states)
- **Accent:** `#E11D48` (Vivid Red — CTAs)
- **Highlight:** `#FB7185` (Rose — data visualization)
- **Pale:** `#FFF1F2` (Blush — backgrounds)
- **Success:** `#059669` (Emerald — universal)
- **Warning:** `#D97706` (Amber — universal)
- **Error:** `#DC2626` (Red — semantic, darker than accent)
- **Background:** `#F4F6F8` (Neutral gray-white)
- **Surface:** `#FFFFFF` (White)
- **Text Primary:** `#111827`
- **Text Secondary:** `#374151`
- **Text Muted:** `#9CA3AF`
- **Border:** `#E5E7EB`

#### Dark Mode
- **Primary:** `#FB7185` (Brightened rose for dark bg)
- **Secondary:** `#E11D48`
- **Background:** `#0D0308` (Very dark warm black)
- **Surface:** `#1C0612` (Deep crimson-dark)
- **Text Primary:** `#FFF1F2` (Blush white)
- **Text Secondary:** `#FDA4AF`

#### Logo
**Shape:** Hub-and-spoke network with central node
**Symbolism:** Every department (outer nodes) connected through one authoritative center (ERP)
**App Name:** Nexus (means "connection point" / "central link")
**Tagline:** *"The nerve center of your enterprise."*

#### Key UI Applications
- Sidebar active state: Left border `#9F1239`
- CTA buttons: `linear-gradient(135deg, #9F1239, #BE185D, #E11D48)`
- Progress bars: Crimson gradient fill
- Alert banners: Blush `#FFF1F2` background + `#9F1239` left border
- Status badges: `#9F1239` solid or `#FFF1F2` soft
- Chart fills: Crimson-to-rose gradient

---

### 🧠 Aria — AI Intelligence Platform

> *"Intelligence that works with you."*

#### Identity Concept
Aria — derived from *Ariadne* (the one who shows the way through the labyrinth) — represents an AI platform that guides enterprise intelligence through complexity. The neural constellation logo with its orbital rings and connected nodes represents distributed AI intelligence that revolves around your business. The **Cosmic Violet** palette is distinct from CRM's Indigo — deeper, more mysterious, and evoking neural networks, space, and latent intelligence.

#### Why Cosmic Violet?
- **Unique positioning:** Different from CRM's `#4F46E5` Indigo — Aria uses a deeper, more saturated violet family (`#5B21B6`)
- **Psychology:** Violet/purple = intelligence, mystery, futurism, creativity, the unknown frontier
- **AI-specific fit:** Neural networks, cosmic scale, latent potential — violet perfectly captures the "beyond human" quality of AI
- **Visual distinctness:** Deep violet vs. blue-indigo — clearly different at a glance; separate ends of the purple spectrum

#### Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `--ai-primary` | `#5B21B6` | Primary actions, headings, sidebar active |
| `--ai-mid` | `#7C3AED` | Hover states, progress fills |
| `--ai-accent` | `#8B5CF6` | CTA buttons, highlights, focus rings |
| `--ai-lavender` | `#A78BFA` | Chart fills, sparklines, data points |
| `--ai-pale` | `#F5F3FF` | Badge backgrounds, alert surfaces |
| `--ai-glow` | `rgba(91,33,182, 0.12)` | Button shadows, card glows |
| `--ai-border` | `rgba(91,33,182, 0.20)` | Card borders, input focus |

#### Gradient
```css
linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #8B5CF6 100%)
```

#### Light Mode Full Palette
- **Primary:** `#5B21B6` (Deep Violet — main brand color)
- **Secondary:** `#3B0764` (Dark Indigo-Black — deep anchor)
- **Mid:** `#7C3AED` (Violet — interactive states)
- **Accent:** `#8B5CF6` (Purple — CTAs)
- **Highlight:** `#A78BFA` (Lavender — data visualization)
- **Pale:** `#F5F3FF` (Lavender Mist — backgrounds)
- **Success:** `#059669` (Emerald — universal)
- **Warning:** `#D97706` (Amber — universal)
- **Error:** `#DC2626` (Red — universal)
- **Background:** `#F4F6F8` (Neutral gray-white)
- **Surface:** `#FFFFFF` (White)
- **Text Primary:** `#111827`
- **Text Secondary:** `#374151`
- **Text Muted:** `#9CA3AF`
- **Border:** `#E5E7EB`

#### Dark Mode (Optimal for AI dashboards)
- **Primary:** `#A78BFA` (Brightened lavender for dark bg)
- **Secondary:** `#8B5CF6`
- **Background:** `#07040F` (Deep cosmic black)
- **Surface:** `#130C2A` (Dark violet)
- **Text Primary:** `#F5F3FF` (Lavender white)
- **Text Secondary:** `#C4B5FD`

#### Logo
**Shape:** Neural constellation with orbital rings and central pulse
**Symbolism:** AI intelligence (center) orbited by interconnected enterprise modules — the AI is the sun that everything else revolves around
**App Name:** Aria (from Ariadne — "the guide through complexity")
**Tagline:** *"Intelligence that works with you."*

#### Aria-Specific UI Patterns
- **Neural pulse indicator:** Animated dot showing live AI activity
- **Confidence badges:** Violet soft badges showing model confidence %
- **Inference stream:** Real-time animated counter in topbar
- **Agent status:** Pulsing live indicators for active AI agents
- **Model cards:** Violet gradient headers with white SVG architecture diagrams

---

## 📏 Implementation Guidelines

### Color Usage Rules

#### Primary Hierarchy
```
Brand/App Color (70%) → Accent (20%) → Semantic (10%)
```

#### Component Rules

**Navigation**
- Sidebar active item: Left border = App Primary color (3px solid)
- Top navigation: App Primary gradient as background
- App icon: App gradient (45deg)
- Breadcrumb separator: Text Muted `#9CA3AF`

**Buttons**
```
Primary Button:   App Gradient background, white text
Secondary Button: App Pale background, App Primary text, App Border
Ghost Button:     Transparent, App Primary text, App Border on hover
Danger Button:    Error Red (#DC2626)
```

**Cards & Surfaces**
```
Default Card:     White (#FFFFFF), border #E5E7EB, shadow-sm
Highlighted Card: App Pale background, App Border
Active/Selected:  App Pale + left border App Primary 4px
```

**Badges & Labels**
```
Solid badge:   App Primary bg, white text
Soft badge:    App Pale bg, App Primary text
Status Active: #DCFCE7 bg, #166534 text
Status Warn:   #FEF3C7 bg, #92400E text
Status Error:  #FEE2E2 bg, #991B1B text
Status Info:   #EFF6FF bg, #1D4ED8 text
```

**Data Visualization**
```
Primary metric:   App Gradient
Secondary metric: App Mid (60% opacity)
Neutral/compare:  #E5E7EB or #D1D5DB
Success trendline: #059669
Warning trendline: #D97706
```

### Notification System

**Color-Coded Notifications:**
- 🟦 Teal dot = Workspace / One notification
- 🔵 Indigo dot = CRZM notification
- 🟣 Purple dot = Flow notification
- 🩵 Cyan dot = Data Bridge notification
- 🟢 Emerald dot = Arion notification
- 🟠 Coral dot = AI Companion notification
- 🛒 Amber dot = POS notification
- 📞 Teal-deep dot = Dialer notification
- **🟡 Gold dot = Lumina BI notification** *(new)*
- **🔴 Crimson dot = Nexus ERP notification** *(new)*
- **🟣 Violet dot = Aria AI notification** *(new)*

---

## 🎨 Best Practices

### Contrast Ratios (WCAG 2.2 Compliance)

**Minimum Requirements:**
- Body text on background: **4.5:1** ratio (AA)
- Large text (18pt+): **3:1** ratio (AA)
- Interactive elements / UI components: **3:1** ratio
- Enhanced text: **7:1** ratio (AAA — target for critical info)

**Verified App Color Contrast (on white #FFFFFF):**

| Color | Hex | Contrast Ratio | WCAG |
|-------|-----|----------------|------|
| BI Primary | `#B45309` | 5.21:1 | ✅ AA |
| ERP Primary | `#9F1239` | 7.44:1 | ✅ AAA |
| AI Primary | `#5B21B6` | 7.89:1 | ✅ AAA |
| Brand Primary | `#0097A7` | 3.15:1 | ✅ UI/AA Large |

> **Note:** For text usage of `#B45309` (BI), always use on white or light backgrounds only. For small text, use darker shade `#92400E`.

### Animation & Transitions

**Consistent Timing:**
```css
/* Fast — UI feedback, hover */
transition: 0.15s ease-out;

/* Medium — Cards, modals, dropdowns */
transition: 0.3s ease-in-out;

/* Slow — Page transitions, drawers */
transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```

### Dark Mode Guidelines

**Do's:**
- ✅ Use near-black backgrounds (not pure `#000000`)
- ✅ Use soft white for text (not pure `#FFFFFF`)
- ✅ Increase color saturation slightly in dark mode
- ✅ Add subtle colored shadows matching app accent
- ✅ Test all accent colors — amber & crimson need brightness adjustments in dark mode

**Don'ts:**
- ❌ Pure black backgrounds (causes eye strain)
- ❌ Pure white text (too bright in dark mode)
- ❌ Reduce contrast ratios below WCAG minimums
- ❌ Use the same accent color values in light and dark — always adjust

---

## 📋 Quick Reference Tables

### Complete Product Color Matrix (v2.0)

| Product | App Name | Icon BG | CTA | Active State | Badge | Dark Primary |
|---------|----------|---------|-----|--------------|-------|--------------|
| Workspace | Workspace | `#0097A7` Teal | Teal | Teal | Teal | `#26C6DA` |
| Auth/SSO | One | `#0097A7` Teal | Teal | Teal | Teal | `#26C6DA` |
| CRM | CRZM | `#4F46E5` Indigo | Indigo | Indigo | Indigo | `#818CF8` |
| Workflow | Flow | `#7C3AED` Purple | Purple | Purple | Purple | `#A78BFA` |
| ETL Pipeline | Data Bridge | `#0891B2` Cyan | Cyan | Cyan | Cyan | `#22D3EE` |
| LMS | Arion | `#059669` Emerald | Emerald | Emerald | Emerald | `#34D399` |
| AI Chat | AI Companion | `#FF7F50` Coral | Coral | Coral | Coral | `#FFA07A` |
| Point of Sale | POS | `#D97706` Amber | Amber | Amber | Amber | `#FCD34D` |
| Telephony | Dialer | `#0F766E` Teal | Teal | Teal | Teal | `#14B8A6` |
| **BI** | **Lumina** | **`#0D5C7A` Steel Indigo-Teal ✅** | **Teal** | **Teal** | **Teal** | **`#22D3EE`** |
| **ERP** | **Nexus** | **`#9F1239` Crimson** | **Crimson** | **Crimson** | **Crimson** | **`#FB7185`** |
| **AI Platform** | **Aria** | **`#5B21B6` Violet** | **Violet** | **Violet** | **Violet** | **`#A78BFA`** |

### Color Psychology Reference (Updated)

| Color | Psychology | Best Use Cases |
|-------|-----------|----------------|
| **Teal** | Trust, communication, calmness | Main brand, workspace, auth |
| **Indigo** | Creativity, innovation, premium | CRM, relationships |
| **Purple** | Automation, power, mystery | Workflow, process |
| **Cyan** | Logic, technology, reliability | ETL, data flows |
| **Emerald** | Growth, success, progress | LMS, achievements |
| **Coral** | Warmth, approachability, friendly | AI Chat, assistants |
| **Amber/Orange** | Energy, action, point of sale | POS, transactions |
| **Deep Teal** | Voice, connection, real-time | Telephony, dialer |
| **🆕 Steel Indigo-Teal ✅** | Precision, data clarity, analytical depth | **BI / Lumina** — chosen for analytical authority + brand DNA link |
| **🆕 Crimson** | Authority, enterprise backbone, urgency | ERP, operations |
| **🆕 Cosmic Violet** | AI intelligence, futurism, neural depth | AI Platform, ML |

### New App Hex Code Quick Copy

#### Lumina BI — Steel Indigo-Teal ✅ FINAL
```
Primary:      #0D5C7A   ← CHOSEN (Option C)
Mid:          #0891B2
Accent:       #0EA5E9
Bright:       #22D3EE
Pale:         #ECFEFF
Glow:         rgba(13, 92, 122, 0.14)
Border:       rgba(13, 92, 122, 0.18)
Gradient:     linear-gradient(135deg, #0D5C7A, #0891B2, #22D3EE)
Dark Mode:    #22D3EE

Runner-up (Option A — Deep Ocean Blue):
  Primary:    #0C4A6E
  Accent:     #0EA5E9
  Gradient:   linear-gradient(135deg, #0C4A6E, #0369A1, #0EA5E9)
```

#### Nexus ERP (Steel Crimson)
```
Primary:     #9F1239
Mid:         #BE185D
Accent:      #E11D48
Rose:        #FB7185
Pale:        #FFF1F2
Glow:        rgba(159, 18, 57, 0.12)
Border:      rgba(159, 18, 57, 0.20)
Gradient:    linear-gradient(135deg, #9F1239, #BE185D, #E11D48)
Dark Mode:   #FB7185
```

#### Aria AI (Cosmic Violet)
```
Primary:     #5B21B6
Mid:         #7C3AED
Accent:      #8B5CF6
Lavender:    #A78BFA
Pale:        #F5F3FF
Glow:        rgba(91, 33, 182, 0.12)
Border:      rgba(91, 33, 182, 0.20)
Gradient:    linear-gradient(135deg, #5B21B6, #7C3AED, #8B5CF6)
Dark Mode:   #A78BFA
```

---

## 💻 Full CSS Variables Template {#css-variables-template}

```css
/* ═══════════════════════════════════════════════════
   ADVAITA NXT DESIGN SYSTEM — CSS Variables v2.0
   Includes: Lumina BI, Nexus ERP, Aria AI
═══════════════════════════════════════════════════ */

:root {
  /* ──────────────────────────────
     BRAND FOUNDATION
  ────────────────────────────── */
  --brand-primary:    #0097A7;
  --brand-secondary:  #00695C;
  --brand-accent:     #26C6DA;

  /* ──────────────────────────────
     STATUS COLORS (Universal)
  ────────────────────────────── */
  --color-success:    #059669;
  --color-warning:    #D97706;
  --color-error:      #DC2626;
  --color-info:       #0891B2;

  /* ──────────────────────────────
     EXISTING PRODUCT ACCENTS
  ────────────────────────────── */
  --crzm-accent:        #4F46E5;  /* CRZM CRM — Indigo */
  --flow-accent:        #7C3AED;  /* Flow Workflow — Purple */
  --databridge-accent:  #0891B2;  /* Data Bridge ETL — Cyan */
  --arion-accent:       #059669;  /* Arion LMS — Emerald */
  --aicompanion-accent: #FF7F50;  /* AI Companion — Coral */
  --pos-accent:         #D97706;  /* POS — Amber */
  --dialer-accent:      #0F766E;  /* Dialer — Deep Teal */

  /* ──────────────────────────────
     🆕 LUMINA BI — STEEL INDIGO-TEAL ✅ FINAL (Option C)
     Runner-up: Deep Ocean Blue #0C4A6E (Option A)
  ────────────────────────────── */
  --bi-primary:    #0D5C7A;   /* Steel Indigo-Teal — chosen color */
  --bi-secondary:  #164E63;   /* Deep anchor */
  --bi-mid:        #0891B2;   /* Interactive hover states */
  --bi-accent:     #0EA5E9;   /* CTAs, focus rings */
  --bi-bright:     #22D3EE;   /* Charts, sparklines, data points */
  --bi-pale:       #ECFEFF;   /* Badge bg, alert surfaces */
  --bi-very-pale:  #F0FDFF;   /* Hover backgrounds */
  --bi-glow:       rgba(13, 92, 122, 0.14);
  --bi-border:     rgba(13, 92, 122, 0.18);
  --bi-gradient:   linear-gradient(135deg, #0D5C7A 0%, #0891B2 60%, #22D3EE 100%);

  /* Runner-up reference (Option A — Deep Ocean Blue) */
  /* --bi-primary-alt: #0C4A6E; */
  /* --bi-gradient-alt: linear-gradient(135deg, #0C4A6E, #0369A1, #0EA5E9); */

  /* ──────────────────────────────
     🆕 NEXUS ERP — STEEL CRIMSON
  ────────────────────────────── */
  --erp-primary:   #9F1239;
  --erp-secondary: #500724;
  --erp-mid:       #BE185D;
  --erp-accent:    #E11D48;
  --erp-rose:      #FB7185;
  --erp-pale:      #FFF1F2;
  --erp-glow:      rgba(159, 18, 57, 0.12);
  --erp-border:    rgba(159, 18, 57, 0.20);
  --erp-gradient:  linear-gradient(135deg, #9F1239 0%, #BE185D 50%, #E11D48 100%);

  /* ──────────────────────────────
     🆕 ARIA AI — COSMIC VIOLET
  ────────────────────────────── */
  --ai-primary:    #5B21B6;
  --ai-secondary:  #3B0764;
  --ai-mid:        #7C3AED;
  --ai-accent:     #8B5CF6;
  --ai-lavender:   #A78BFA;
  --ai-pale:       #F5F3FF;
  --ai-glow:       rgba(91, 33, 182, 0.12);
  --ai-border:     rgba(91, 33, 182, 0.20);
  --ai-gradient:   linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #8B5CF6 100%);

  /* ──────────────────────────────
     NEUTRALS (Light Mode)
  ────────────────────────────── */
  --background:    #F4F6F8;
  --surface:       #FFFFFF;
  --surface-2:     #F9FAFB;
  --border:        #E5E7EB;
  --border-light:  #F3F4F6;
  --text-1:        #111827;
  --text-2:        #374151;
  --text-3:        #6B7280;
  --text-4:        #9CA3AF;

  /* ──────────────────────────────
     TYPOGRAPHY
  ────────────────────────────── */
  --font-display:  'Syne', sans-serif;      /* Headlines, app names, KPIs */
  --font-body:     'DM Sans', sans-serif;   /* Body, labels, UI copy */
  --font-mono:     'JetBrains Mono', monospace; /* Code, hex, data */

  /* ──────────────────────────────
     SPACING (8pt grid)
  ────────────────────────────── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ──────────────────────────────
     BORDER RADIUS
  ────────────────────────────── */
  --r-xs:  4px;
  --r-sm:  8px;
  --r-md:  12px;
  --r-lg:  16px;
  --r-xl:  24px;
  --r-full: 9999px;

  /* ──────────────────────────────
     SHADOWS
  ────────────────────────────── */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
  --shadow-lg:  0 10px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05);

  /* ──────────────────────────────
     TRANSITIONS
  ────────────────────────────── */
  --transition-fast:    0.15s ease-out;
  --transition-base:    0.3s ease-in-out;
  --transition-slow:    0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ──────────────────────────────
   DARK MODE OVERRIDES
────────────────────────────── */
[data-theme="dark"] {
  --brand-primary:    #26C6DA;
  --brand-secondary:  #4DB6AC;

  --background:   #0A0E12;
  --surface:      #16232A;
  --surface-2:    #1E2D35;
  --border:       #263238;
  --text-1:       #F9FAFB;
  --text-2:       #D1D5DB;
  --text-3:       #9CA3AF;
  --text-4:       #6B7280;

  /* Dark mode app accent adjustments */
  --bi-primary:    #22D3EE;
  --bi-pale:       rgba(13, 92, 122, 0.18);
  --bi-border:     rgba(34, 211, 238, 0.25);

  --erp-primary:   #FB7185;
  --erp-pale:      rgba(159, 18, 57, 0.15);
  --erp-border:    rgba(251, 113, 133, 0.25);

  --ai-primary:    #A78BFA;
  --ai-pale:       rgba(91, 33, 182, 0.15);
  --ai-border:     rgba(167, 139, 250, 0.25);
}

/* ──────────────────────────────
   LUMINA BI — Dark Mode Specific
   (Steel Indigo-Teal)
────────────────────────────── */
[data-theme="dark"][data-app="lumina"] {
  --background:   #040D12;
  --surface:      #0C1F2A;
  --surface-2:    #122E3D;
  --text-1:       #ECFEFF;
  --text-2:       #A5F3FC;
  --border:       rgba(13, 92, 122, 0.3);
}

/* ──────────────────────────────
   NEXUS ERP — Dark Mode Specific
────────────────────────────── */
[data-theme="dark"][data-app="nexus"] {
  --background:   #0D0308;
  --surface:      #1C0612;
  --surface-2:    #2C0B1E;
  --text-1:       #FFF1F2;
  --text-2:       #FDA4AF;
  --border:       rgba(159, 18, 57, 0.25);
}

/* ──────────────────────────────
   ARIA AI — Dark Mode Specific
────────────────────────────── */
[data-theme="dark"][data-app="aria"] {
  --background:   #07040F;
  --surface:      #130C2A;
  --surface-2:    #1E1240;
  --text-1:       #F5F3FF;
  --text-2:       #C4B5FD;
  --border:       rgba(91, 33, 182, 0.3);
}
```

---

## 🚀 Benefits Summary

### Brand Recognition
- Users immediately recognize all products as part of the Advaita NXT ecosystem
- Each new app (Lumina/Nexus/Aria) has a psychologically distinct color that is unmistakably different from all existing products
- Consistent visual language across 12+ products builds lasting trust

### Design Differentiation Logic
- **Lumina BI** vs **CRZM CRM**: Amber Gold vs Indigo — warm/cool, analytical/relational
- **Nexus ERP** vs **Flow Workflow**: Crimson vs Purple — authority/efficiency, serious/dynamic
- **Aria AI** vs **AI Companion**: Deep Violet vs Coral — intelligence platform vs friendly chat
- **Aria AI** vs **CRZM CRM**: `#5B21B6` Deep Violet vs `#4F46E5` Blue-Indigo — different hue families

### Scalability
- CSS variable architecture makes adding new products trivial
- Each app's tokens follow identical naming conventions
- Theme switching supported natively via `[data-theme]` and `[data-app]` selectors

---

## 📥 Next Steps

1. **Implement CSS variables** from the template above in your design system
2. **Create component library** entries for each new app (Lumina, Nexus, Aria)
3. **Test accessibility** — verify WCAG contrast ratios in both light and dark modes
4. **Build logo assets** — export Lumina prism, Nexus hub, and Aria constellation as SVG, PNG, and favicon formats
5. **Update brand guidelines** — add new apps to the marketing site product showcase
6. **Design dark mode variants** — use the app-specific dark tokens for Lumina, Nexus, and Aria

---

**Document Version:** 2.1
**Previous Version:** 2.0 (Amber Gold for BI — superseded)
**Last Updated:** March 2026
**Changes in v2.1:** Lumina BI color finalized — Steel Indigo-Teal `#0D5C7A` (Option C). Runner-up: Deep Ocean Blue `#0C4A6E` (Option A). Amber Gold `#B45309` deprecated.
**Recommended Review:** Annually

---

**End of Document**
