import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import fs from "fs";

const db = new Database("barbershop.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price TEXT,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price TEXT,
    image TEXT,
    payment_link TEXT
  );

  CREATE TABLE IF NOT EXISTS team (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    image TEXT,
    bio TEXT
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL,
    caption TEXT
  );

  CREATE TABLE IF NOT EXISTS faq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5
  );

  CREATE TABLE IF NOT EXISTS site_content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS business_info (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed initial data if empty
const seedData = () => {
  const serviceCount = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };
  if (serviceCount.count === 0) {
    const services = [
      ['Haircut', 'Classic haircut with precision styling.', '$35', 'Main'],
      ['Fade', 'Modern fade with seamless blending.', '$40', 'Main'],
      ['Beard Trim', 'Professional beard shaping and grooming.', '$20', 'Add-on'],
      ['Edge Up', 'Clean lines and sharp edges.', '$15', 'Add-on'],
      ['Kids Haircut', 'Gentle styling for the little ones.', '$25', 'Specialty'],
      ['Senior Haircut', 'Classic styles for our senior gentlemen.', '$30', 'Specialty'],
      ['Full Grooming', 'The ultimate package: Haircut, beard, and facial.', '$65', 'Premium']
    ];
    const insertService = db.prepare("INSERT INTO services (name, description, price, category) VALUES (?, ?, ?, ?)");
    services.forEach(s => insertService.run(...s));

    const products = [
      ['Premium Pomade', 'High hold, medium shine for all-day style.', '$25', 'https://picsum.photos/seed/pomade/400/400', '#'],
      ['Shampoo', 'Invigorating cleanse for healthy hair.', '$18', 'https://picsum.photos/seed/shampoo/400/400', '#'],
      ['Beard & Hair Coloring', 'Natural-looking gray coverage.', '$30', 'https://picsum.photos/seed/color/400/400', '#'],
      ['After Shave', 'Soothing relief after every shave.', '$15', 'https://picsum.photos/seed/aftershave/400/400', '#']
    ];
    const insertProduct = db.prepare("INSERT INTO products (name, description, price, image, payment_link) VALUES (?, ?, ?, ?, ?)");
    products.forEach(p => insertProduct.run(...p));

    const faqs = [
      ['Do I need an appointment, or do you accept walk-ins?', 'We gladly accept both appointments and walk-ins. Booking ahead is recommended to minimize wait times, especially during peak hours.'],
      ['How long does a typical haircut take?', 'Most haircuts take between 30–45 minutes depending on the style and service requested.'],
      ['What services do you offer?', 'We provide professional haircuts, fades, beard trims, edge-ups, grooming services, and styling for kids, adults, and seniors.'],
      ['How much do your haircuts cost?', 'Pricing varies by service. Please visit our Services page or click the book appointment button to see our current rates.'],
      ['What payment methods do you accept?', 'We accept cash and major credit card payments.'],
      ['Are there plenty of parking?', 'Yes, the plaza has plenty of parking.']
    ];
    const insertFaq = db.prepare("INSERT INTO faq (question, answer) VALUES (?, ?)");
    faqs.forEach(f => insertFaq.run(...f));

    const businessInfo = [
      ['name', 'Amigos Barbershop'],
      ['address', '15761 Tustin Village Way, Suite 103'],
      ['city', 'Tustin'],
      ['state', 'CA'],
      ['zip', '92780'],
      ['phone', '(714) 555-0123'],
      ['email', 'info@amigosbarbershop.com'],
      ['hours_mon', '10 AM – 7 PM'],
      ['hours_tue', '10 AM – 7 PM'],
      ['hours_wed', '10 AM – 7 PM'],
      ['hours_thu', '10 AM – 7 PM'],
      ['hours_fri', '10 AM – 7 PM'],
      ['hours_sat', '8 AM – 5 PM'],
      ['hours_sun', 'Closed']
    ];
    const insertInfo = db.prepare("INSERT INTO business_info (key, value) VALUES (?, ?)");
    businessInfo.forEach(i => insertInfo.run(...i));

    const siteContent = [
      ['hero_headline', 'Premium Haircuts & Grooming'],
      ['hero_subheadline', 'Experience the art of grooming at Amigos Barbershop. Where tradition meets modern style.'],
      ['about_text', 'Amigos Barbershop is Tustin\'s premier destination for high-end grooming. Our master barbers specialize in everything from classic cuts to modern fades, ensuring every client leaves looking and feeling their best.'],
      ['established_text', 'ESTABLISHED 2020'],
      ['booking_url', 'https://booksy.com/en-us/782476_amigos-barbershop_barber-shop_103795_tustin#ba_s=rwg']
    ];
    const insertContent = db.prepare("INSERT INTO site_content (key, value) VALUES (?, ?)");
    siteContent.forEach(c => insertContent.run(...c));
  }
};

seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/services", (req, res) => {
    const services = db.prepare("SELECT * FROM services").all();
    res.json(services);
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.get("/api/team", (req, res) => {
    const team = db.prepare("SELECT * FROM team").all();
    res.json(team);
  });

  app.get("/api/gallery", (req, res) => {
    const gallery = db.prepare("SELECT * FROM gallery").all();
    res.json(gallery);
  });

  app.get("/api/faq", (req, res) => {
    const faq = db.prepare("SELECT * FROM faq").all();
    res.json(faq);
  });

  app.get("/api/testimonials", (req, res) => {
    const testimonials = db.prepare("SELECT * FROM testimonials").all();
    res.json(testimonials);
  });

  app.get("/api/business-info", (req, res) => {
    const info = db.prepare("SELECT * FROM business_info").all();
    const infoMap = info.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(infoMap);
  });

  app.get("/api/site-content", (req, res) => {
    const content = db.prepare("SELECT * FROM site_content").all();
    const contentMap = content.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(contentMap);
  });

  // Admin Auth (Simple for this demo)
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === "admin123") {
      res.json({ success: true, token: "fake-jwt-token" });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  });

  // Admin CMS Routes (Protected by logic in frontend, but should be here)
  app.post("/api/admin/update-content", (req, res) => {
    const { key, value } = req.body;
    db.prepare("INSERT OR REPLACE INTO site_content (key, value) VALUES (?, ?)").run(key, value);
    res.json({ success: true });
  });

  app.post("/api/admin/update-info", (req, res) => {
    const { key, value } = req.body;
    db.prepare("INSERT OR REPLACE INTO business_info (key, value) VALUES (?, ?)").run(key, value);
    res.json({ success: true });
  });

  app.post("/api/admin/services", (req, res) => {
    const { name, description, price, category, id } = req.body;
    if (id) {
      db.prepare("UPDATE services SET name = ?, description = ?, price = ?, category = ? WHERE id = ?").run(name, description, price, category, id);
    } else {
      db.prepare("INSERT INTO services (name, description, price, category) VALUES (?, ?, ?, ?)").run(name, description, price, category);
    }
    res.json({ success: true });
  });

  app.delete("/api/admin/services/:id", (req, res) => {
    db.prepare("DELETE FROM services WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/products", (req, res) => {
    const { name, description, price, image, payment_link, id } = req.body;
    if (id) {
      db.prepare("UPDATE products SET name = ?, description = ?, price = ?, image = ?, payment_link = ? WHERE id = ?").run(name, description, price, image, payment_link, id);
    } else {
      db.prepare("INSERT INTO products (name, description, price, image, payment_link) VALUES (?, ?, ?, ?, ?)").run(name, description, price, image, payment_link);
    }
    res.json({ success: true });
  });

  app.delete("/api/admin/products/:id", (req, res) => {
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/team", (req, res) => {
    const { name, role, image, bio, id } = req.body;
    if (id) {
      db.prepare("UPDATE team SET name = ?, role = ?, image = ?, bio = ? WHERE id = ?").run(name, role, image, bio, id);
    } else {
      db.prepare("INSERT INTO team (name, role, image, bio) VALUES (?, ?, ?, ?)").run(name, role, image, bio);
    }
    res.json({ success: true });
  });

  app.delete("/api/admin/team/:id", (req, res) => {
    db.prepare("DELETE FROM team WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/gallery", (req, res) => {
    const { image, caption, id } = req.body;
    if (id) {
      db.prepare("UPDATE gallery SET image = ?, caption = ? WHERE id = ?").run(image, caption, id);
    } else {
      db.prepare("INSERT INTO gallery (image, caption) VALUES (?, ?)").run(image, caption);
    }
    res.json({ success: true });
  });

  app.delete("/api/admin/gallery/:id", (req, res) => {
    db.prepare("DELETE FROM gallery WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/faq", (req, res) => {
    const { question, answer, id } = req.body;
    if (id) {
      db.prepare("UPDATE faq SET question = ?, answer = ? WHERE id = ?").run(question, answer, id);
    } else {
      db.prepare("INSERT INTO faq (question, answer) VALUES (?, ?)").run(question, answer);
    }
    res.json({ success: true });
  });

  app.delete("/api/admin/faq/:id", (req, res) => {
    db.prepare("DELETE FROM faq WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/testimonials", (req, res) => {
    const { name, content, rating, id } = req.body;
    if (id) {
      db.prepare("UPDATE testimonials SET name = ?, content = ?, rating = ? WHERE id = ?").run(name, content, rating, id);
    } else {
      db.prepare("INSERT INTO testimonials (name, content, rating) VALUES (?, ?, ?)").run(name, content, rating);
    }
    res.json({ success: true });
  });

  app.delete("/api/admin/testimonials/:id", (req, res) => {
    db.prepare("DELETE FROM testimonials WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
