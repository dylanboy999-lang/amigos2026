import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Scissors, Calendar, Phone, MapPin, Clock, Instagram, Facebook, Twitter, ChevronDown, LogIn, LogOut, LayoutDashboard, Plus, Trash2, Edit2, Save, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

// --- Shared Components ---

export const Button = ({ children, className = '', variant = 'primary', ...props }: any) => {
  const variants: any = {
    primary: 'bg-gold text-black hover:bg-gold-light',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/10',
    outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-black',
    ghost: 'text-white hover:bg-white/10'
  };
  
  return (
    <button 
      className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const SectionHeading = ({ title, subtitle, centered = true }: any) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-2 block"
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-5xl font-serif"
    >
      {title}
    </motion.h2>
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 60 }}
      className={`h-1 bg-gold mt-4 ${centered ? 'mx-auto' : ''}`}
    />
  </div>
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin, logout, businessInfo, siteContent } = useApp();
  const bookingUrl = siteContent?.booking_url || "https://booksy.com/en-us/782476_amigos-barbershop_barber-shop_103795_tustin#ba_s=rwg";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Products', href: '#products' },
    { name: 'Team', href: '#team' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
            <img 
              src="https://i.postimg.cc/4xbNSYLg/logo_2026_03_11_07_58_57_438329.png" 
              alt="Amigos Barbershop Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-2xl font-serif font-bold tracking-tighter">
            {businessInfo?.name ? (
              <>
                {businessInfo.name.split(' ')[0]} <span className="text-gold">{businessInfo.name.split(' ').slice(1).join(' ')}</span>
              </>
            ) : (
              <>AMIGOS <span className="text-gold">BARBERSHOP</span></>
            )}
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-sm uppercase tracking-widest hover:text-gold transition-colors font-medium">
              {link.name}
            </a>
          ))}
          {isAdmin && (
            <a href="#admin" className="p-2 bg-gold/20 text-gold rounded-full hover:bg-gold/30 transition-colors">
              <LayoutDashboard size={20} />
            </a>
          )}
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" className="text-sm py-2">BOOK NOW</Button>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-charcoal border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-lg uppercase tracking-widest hover:text-gold transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                <Button variant="primary" className="w-full">BOOK APPOINTMENT</Button>
              </a>
              {isAdmin && (
                <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-2 text-red-400">
                  <LogOut size={20} /> Logout Admin
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer = () => {
  const { businessInfo, siteContent } = useApp();
  const bookingUrl = siteContent?.booking_url || "https://booksy.com/en-us/782476_amigos-barbershop_barber-shop_103795_tustin#ba_s=rwg";

  if (!businessInfo) return null;

  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="https://i.postimg.cc/4xbNSYLg/logo_2026_03_11_07_58_57_438329.png" 
                  alt="Amigos Barbershop Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xl font-serif font-bold">{businessInfo.name}</span>
            </div>
            <p className="text-white/60 mb-6 leading-relaxed">
              Premium grooming for the modern gentleman. Experience the best haircuts and shaves in Tustin.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-serif mb-6">Quick Links</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#home" className="hover:text-gold transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">Services</a></li>
              <li><a href="#products" className="hover:text-gold transition-colors">Products</a></li>
              <li><a href="#team" className="hover:text-gold transition-colors">Our Barbers</a></li>
              <li><a href="#gallery" className="hover:text-gold transition-colors">Gallery</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif mb-6">Hours</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li className="flex justify-between"><span>Mon - Fri:</span> <span>{businessInfo.hours_mon}</span></li>
              <li className="flex justify-between"><span>Saturday:</span> <span>{businessInfo.hours_sat}</span></li>
              <li className="flex justify-between"><span>Sunday:</span> <span>{businessInfo.hours_sun}</span></li>
            </ul>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block">
              <Button variant="outline" className="w-full text-sm">BOOK APPOINTMENT</Button>
            </a>
          </div>

          <div>
            <h4 className="text-lg font-serif mb-6">Contact Us</h4>
            <ul className="space-y-4 text-white/60">
              <li className="flex gap-3">
                <MapPin className="text-gold shrink-0" size={20} />
                <span>{businessInfo.address}, {businessInfo.city}, {businessInfo.state} {businessInfo.zip}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="text-gold shrink-0" size={20} />
                <span>{businessInfo.phone}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="text-gold shrink-0" size={20} />
                <span>Mon-Fri 10am-7pm, Sat 8am-5pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/40">
          <p>© {new Date().getFullYear()} Amigos Barbershop. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <a href="#" className="hover:text-gold">Terms of Use</a>
            <a href="#" className="hover:text-gold">Cookie Policy</a>
            <a href="#admin" className="hover:text-gold">Admin Login</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
