import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, ShoppingBag, Users, Image as ImageIcon, Star, HelpCircle, MapPin, ChevronRight, Play, ChevronDown, Phone, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, SectionHeading } from '../components/Layout';

export const Hero = () => {
  const { siteContent } = useApp();
  const bookingUrl = siteContent?.booking_url || "https://booksy.com/en-us/782476_amigos-barbershop_barber-shop_103795_tustin#ba_s=rwg";
  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1920" 
          alt="Barbershop" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold uppercase tracking-[0.4em] text-sm font-bold mb-4 block">
              {siteContent?.established_text || 'ESTABLISHED 2020'}
            </span>
            <h1 className="text-6xl md:text-8xl font-serif mb-6 leading-tight">
              {siteContent?.hero_headline || 'Premium Haircuts & Grooming'}
            </h1>
            <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-xl">
              {siteContent?.hero_subheadline || 'Experience the art of grooming at Amigos Barbershop. Where tradition meets modern style.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" className="px-10 py-4 text-lg">BOOK APPOINTMENT</Button>
              </a>
              <a href="#services">
                <Button variant="outline" className="px-10 py-4 text-lg">VIEW SERVICES</Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/40">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
};

export const Services = () => {
  const { services, siteContent } = useApp();
  const bookingUrl = siteContent?.booking_url || "https://booksy.com/en-us/782476_amigos-barbershop_barber-shop_103795_tustin#ba_s=rwg";
  return (
    <section id="services" className="py-24 bg-charcoal">
      <div className="container mx-auto px-6">
        <SectionHeading title="Our Services" subtitle="Expert Grooming" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl group hover:border-gold/50 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gold/10 rounded-xl text-gold group-hover:bg-gold group-hover:text-black transition-all">
                  <Scissors size={24} />
                </div>
                <span className="text-2xl font-serif text-gold">{service.price}</span>
              </div>
              <h3 className="text-2xl font-serif mb-3">{service.name}</h3>
              <p className="text-white/60 mb-6 leading-relaxed">{service.description}</p>
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gold font-semibold group/link">
                BOOK NOW <ChevronRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">VIEW ALL SERVICES & PRICING</Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export const Products = () => {
  const { products } = useApp();
  return (
    <section id="products" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <SectionHeading title="Premium Products" subtitle="Shop Quality" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a href={product.payment_link || '#'} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" className="scale-90 group-hover:scale-100 transition-transform">ORDER NOW</Button>
                  </a>
                </div>
              </div>
              <h3 className="text-xl font-serif mb-1">{product.name}</h3>
              <p className="text-gold font-semibold mb-2">{product.price}</p>
              <p className="text-sm text-white/50 line-clamp-2">{product.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Team = () => {
  const { team } = useApp();
  return (
    <section id="team" className="py-24 bg-charcoal">
      <div className="container mx-auto px-6">
        <SectionHeading title="Meet Our Barbers" subtitle="Master Craftsmen" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {team.length > 0 ? team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="relative w-64 h-64 mx-auto mb-8">
                <div className="absolute inset-0 border-2 border-gold rounded-full -m-2 group-hover:m-0 transition-all duration-500" />
                <img 
                  src={member.image || `https://picsum.photos/seed/${member.name}/400/400`} 
                  alt={member.name} 
                  className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-2xl font-serif mb-1">{member.name}</h3>
              <p className="text-gold uppercase tracking-widest text-sm font-bold mb-4">{member.role}</p>
              <p className="text-white/60 max-w-xs mx-auto">{member.bio}</p>
            </motion.div>
          )) : (
            <div className="col-span-full text-center text-white/40 italic">Our team of master barbers is ready to serve you.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export const Gallery = () => {
  const { gallery } = useApp();
  const defaultImages = [
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1621605815841-aa33c5ee7b24?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1599351431247-f10b21ce45b3?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1512690196252-741d2fd3f305?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1593702295094-282582f978ad?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800"
  ];

  return (
    <section id="gallery" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <SectionHeading title="Our Gallery" subtitle="Visual Excellence" />
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {(gallery.length > 0 ? gallery.map(item => item.image) : defaultImages).map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-2xl group"
            >
              <img 
                src={img} 
                alt="Gallery" 
                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FAQ = () => {
  const { faq } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-charcoal">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionHeading title="Frequently Asked Questions" subtitle="Got Questions?" />
        <div className="space-y-4">
          {faq.map((item, index) => (
            <div key={item.id} className="glass-card rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-xl font-serif">{item.question}</span>
                <ChevronDown className={`text-gold transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-white/60 leading-relaxed"
                  >
                    {item.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Contact = () => {
  const { businessInfo } = useApp();
  if (!businessInfo) return null;

  return (
    <section id="contact" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <SectionHeading title="Get In Touch" subtitle="Visit Us" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-3xl font-serif mb-8">Contact Information</h3>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-2">Location</h4>
                  <p className="text-white/60">{businessInfo.address}<br />{businessInfo.city}, {businessInfo.state} {businessInfo.zip}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold shrink-0">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-2">Phone</h4>
                  <p className="text-white/60">{businessInfo.phone}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold shrink-0">
                  <Clock size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-2">Hours</h4>
                  <p className="text-white/60">Mon-Fri: {businessInfo.hours_mon}<br />Sat: {businessInfo.hours_sat}<br />Sun: {businessInfo.hours_sun}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 glass-card rounded-2xl">
              <img 
                src="https://i.postimg.cc/ZqJWjnmB/Chat_GPT_Image_Feb_25_2026_07_01_31_PM.png" 
                alt="Contact Us" 
                className="w-full h-48 object-cover rounded-xl mb-8"
                referrerPolicy="no-referrer"
              />
              <h4 className="text-xl font-serif mb-6">Send us a message</h4>
              <form 
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('name');
                  const email = formData.get('email');
                  const subject = formData.get('subject');
                  const message = formData.get('message');
                  const mailtoLink = `mailto:${businessInfo.email}?subject=${encodeURIComponent(subject as string || 'Contact from Website')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
                  window.location.href = mailtoLink;
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="name" type="text" placeholder="Name" className="admin-input" required />
                  <input name="email" type="email" placeholder="Email" className="admin-input" required />
                </div>
                <input name="subject" type="text" placeholder="Subject" className="admin-input" required />
                <textarea name="message" placeholder="Message" rows={4} className="admin-input resize-none" required></textarea>
                <Button type="submit" variant="primary" className="w-full">SEND MESSAGE</Button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="h-[600px] rounded-3xl overflow-hidden border border-white/10"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.172934447477!2d-117.8285517!3d33.7316712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcd95033c55555%3A0x80dcd95033c55555!2s15761%20Tustin%20Village%20Way%20%23103%2C%20Tustin%2C%20CA%2092780!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
