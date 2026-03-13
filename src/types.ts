export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  payment_link: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface GalleryItem {
  id: number;
  image: string;
  caption: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: number;
  name: string;
  content: string;
  rating: number;
}

export interface BusinessInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  hours_mon: string;
  hours_tue: string;
  hours_wed: string;
  hours_thu: string;
  hours_fri: string;
  hours_sat: string;
  hours_sun: string;
}

export interface SiteContent {
  hero_headline: string;
  hero_subheadline: string;
  about_text: string;
}
