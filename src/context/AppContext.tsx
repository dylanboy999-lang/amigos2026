import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Product, TeamMember, GalleryItem, FAQItem, Testimonial, BusinessInfo, SiteContent } from '../types';

interface AppContextType {
  services: Service[];
  products: Product[];
  team: TeamMember[];
  gallery: GalleryItem[];
  faq: FAQItem[];
  testimonials: Testimonial[];
  businessInfo: BusinessInfo | null;
  siteContent: SiteContent | null;
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('admin_token') === 'fake-jwt-token');

  const fetchData = async () => {
    try {
      const [s, p, t, g, f, test, info, content] = await Promise.all([
        fetch('/api/services').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/team').then(r => r.json()),
        fetch('/api/gallery').then(r => r.json()),
        fetch('/api/faq').then(r => r.json()),
        fetch('/api/testimonials').then(r => r.json()),
        fetch('/api/business-info').then(r => r.json()),
        fetch('/api/site-content').then(r => r.json()),
      ]);
      setServices(s);
      setProducts(p);
      setTeam(t);
      setGallery(g);
      setFaq(f);
      setTestimonials(test);
      setBusinessInfo(info);
      setSiteContent(content);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const login = async (password: string) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('admin_token', data.token);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
  };

  const refreshData = async () => {
    await fetchData();
  };

  return (
    <AppContext.Provider value={{
      services, products, team, gallery, faq, testimonials, businessInfo, siteContent,
      isAdmin, login, logout, refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
