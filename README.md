# 🕸️ ScrapeFlow

**ScrapeFlow** is a fully functional **no-code web scraping tool** designed to extract data from **dynamically loaded websites** with ease. Users can create custom scraping workflows using a **drag-and-drop UI**, enabling them to visually design interactions with web pages to reach and extract their desired content.

---

## 🚀 Features

* 🔧 **No-Code Interface** – Build custom scraping flows without writing a single line of code.
* 🧠 **Drag-and-Drop UI** – Create flows by visually arranging steps like clicking, waiting, typing, and extracting.
* 🌐 **Supports Dynamic Websites** – Built on top of a headless browser (Puppeteer), allowing interaction with modern JS-heavy sites.
* 📦 **Export Data** – Download scraped data as CSV, JSON, or send it to an API.
* 🗂️ **Project Management** – Save, edit, and run multiple scraping flows with ease.
* 🔐 **Privacy Friendly** – Everything runs locally or within your own cloud environment.

---

## 🖼️ UI Overview

* **Canvas**: Design your flow by adding nodes like `Navigate`, `Click`, `Wait`, `Extract`, etc.
* **Node Config Panel**: Customize each step's behavior, CSS selectors, delay timings, and more.
* **Flow Runner**: Preview and run your scraping process in real-time.

---

## 🏗️ How It Works

1. **Start a New Flow** – Name your project and start adding steps.
2. **Define Steps** – Use blocks like:

   * `Navigate` to URL
   * `Wait for Element`
   * `Click Element`
   * `Extract Text` or `Attribute`
3. **Run and Preview** – Execute the flow in a sandboxed browser session.
4. **Export Results** – Download or push the data where you need it.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js with React Flow
* **Backend**: Next.js API routes (server functions)
* **Headless Browser**: Puppeteer for flow execution
* **Database**: Supabase (PostgreSQL + Auth + Storage)

---

## 📦 Installation (Local Development)

```bash
# Clone the repository
git clone https://github.com/atharvaraksahk/ScrapeFlow.git
cd ScrapeFlow

# Install dependencies
npm install

# Run development server
npm run dev
```

Make sure you have Puppeteer dependencies and a Supabase project set up. Configure your environment variables in a `.env.local` file.

---

## 📄 Use Cases

ScrapeFlow is versatile and can be used in many scenarios:

* 🔍 **Market Research** – Extract product data, pricing, and availability.
* 💼 **Job Listings** – Collect job postings across multiple platforms.
* 🗞️ **News Aggregation** – Scrape headlines or full articles from dynamic news sites.
* 📊 **Competitive Analysis** – Track competitors’ offerings and updates.
* 📚 **Academic Research** – Gather structured data for analysis from online databases.
* 🏠 **Real Estate** – Aggregate listings and filter by location, price, or features.

---

## 🤝 Contributing

We welcome contributions from developers, designers, and testers. Here's how you can get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Create a Pull Request

Feel free to open issues for bugs, ideas, or feature requests.

