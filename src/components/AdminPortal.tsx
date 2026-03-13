import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Button, SectionHeading } from '../components/Layout';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, LayoutDashboard, Scissors, ShoppingBag, Users, HelpCircle, Info, Clock, Star, LogOut } from 'lucide-react';

export const AdminPortal = () => {
  const { isAdmin, login, logout, services, products, team, gallery, faq, testimonials, businessInfo, siteContent, refreshData } = useApp();
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!isAdmin) {
    return (
      <section id="admin" className="min-h-screen flex items-center justify-center bg-black px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 rounded-3xl w-full max-w-md text-center"
        >
          <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mx-auto mb-8">
            <LayoutDashboard size={40} />
          </div>
          <h2 className="text-3xl font-serif mb-2">Admin Portal</h2>
          <p className="text-white/50 mb-8">Please enter your password to continue.</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const success = await login(password);
            if (!success) alert('Invalid password');
          }}>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              className="admin-input mb-4 text-center"
            />
            <Button variant="primary" className="w-full">LOGIN</Button>
          </form>
        </motion.div>
      </section>
    );
  }

  const handleUpdateContent = async (key: string, value: string) => {
    setLoading(true);
    await fetch('/api/admin/update-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    await refreshData();
    setLoading(false);
  };

  const handleUpdateInfo = async (key: string, value: string) => {
    setLoading(true);
    await fetch('/api/admin/update-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    await refreshData();
    setLoading(false);
  };

  const handleSaveItem = async (endpoint: string, item: any) => {
    setLoading(true);
    await fetch(`/api/admin/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    await refreshData();
    setEditingItem(null);
    setLoading(false);
  };

  const handleDeleteItem = async (endpoint: string, id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    await fetch(`/api/admin/${endpoint}/${id}`, { method: 'DELETE' });
    await refreshData();
    setLoading(false);
  };

  const tabs = [
    { id: 'content', label: 'Site Content', icon: Info },
    { id: 'info', label: 'Business Info', icon: Clock },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'testimonials', label: 'Reviews', icon: Star },
  ];

  return (
    <section id="admin" className="min-h-screen bg-black-matte pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="glass-card rounded-3xl p-4 sticky top-32">
              <div className="flex items-center gap-3 px-4 py-6 border-b border-white/10 mb-4">
                <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center text-black">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold">Admin CMS</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Management</p>
                </div>
              </div>
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-gold text-black' : 'hover:bg-white/5 text-white/60'}`}
                  >
                    <tab.icon size={18} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all mt-8"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="glass-card rounded-3xl p-8 min-h-[600px]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif">{tabs.find(t => t.id === activeTab)?.label}</h2>
                {['services', 'products', 'team', 'gallery', 'faq', 'testimonials'].includes(activeTab) && (
                  <Button variant="primary" className="flex items-center gap-2 py-2" onClick={() => setEditingItem({})}>
                    <Plus size={18} /> Add New
                  </Button>
                )}
              </div>

              {loading && <div className="text-gold animate-pulse mb-4">Saving changes...</div>}

              {/* Site Content Tab */}
              {activeTab === 'content' && siteContent && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-white/40 uppercase tracking-widest mb-2">Hero Headline</label>
                    <input 
                      className="admin-input" 
                      defaultValue={siteContent.hero_headline} 
                      onBlur={(e) => handleUpdateContent('hero_headline', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/40 uppercase tracking-widest mb-2">Hero Subheadline</label>
                    <textarea 
                      className="admin-input" 
                      rows={3}
                      defaultValue={siteContent.hero_subheadline} 
                      onBlur={(e) => handleUpdateContent('hero_subheadline', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/40 uppercase tracking-widest mb-2">Established Text</label>
                    <input 
                      className="admin-input" 
                      defaultValue={siteContent.established_text} 
                      onBlur={(e) => handleUpdateContent('established_text', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/40 uppercase tracking-widest mb-2">Booking URL (Booksy, etc.)</label>
                    <input 
                      className="admin-input" 
                      defaultValue={siteContent.booking_url} 
                      onBlur={(e) => handleUpdateContent('booking_url', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/40 uppercase tracking-widest mb-2">About Text</label>
                    <textarea 
                      className="admin-input" 
                      rows={5}
                      defaultValue={siteContent.about_text} 
                      onBlur={(e) => handleUpdateContent('about_text', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Business Info Tab */}
              {activeTab === 'info' && businessInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(businessInfo).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm text-white/40 uppercase tracking-widest mb-2">
                        {key === 'email' ? 'Forwarding Email (Contact Form)' : key.replace(/_/g, ' ')}
                      </label>
                      <input 
                        className="admin-input" 
                        defaultValue={value} 
                        onBlur={(e) => handleUpdateInfo(key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* List Views (Services, Products, etc.) */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  {services.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div>
                        <h4 className="font-serif text-lg">{item.name}</h4>
                        <p className="text-sm text-white/40">{item.category} • {item.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingItem(item)} className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteItem('services', item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'products' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <img src={item.image} className="w-20 h-20 object-cover rounded-xl" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h4 className="font-serif text-lg">{item.name}</h4>
                        <p className="text-sm text-gold">{item.price}</p>
                        {item.payment_link && item.payment_link !== '#' && (
                          <p className="text-[10px] text-white/30 truncate max-w-[150px] mt-1">{item.payment_link}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => setEditingItem(item)} className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                          <button onClick={() => handleDeleteItem('products', item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'team' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <img src={item.image || `https://picsum.photos/seed/${item.name}/400/400`} className="w-20 h-20 object-cover rounded-full" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h4 className="font-serif text-lg">{item.name}</h4>
                        <p className="text-sm text-gold uppercase tracking-widest">{item.role}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => setEditingItem(item)} className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                          <button onClick={() => handleDeleteItem('team', item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map(item => (
                    <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-square">
                      <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => setEditingItem(item)} className="p-2 bg-gold text-black rounded-lg"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteItem('gallery', item.id)} className="p-2 bg-red-400 text-white rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="space-y-4">
                  {faq.map(item => (
                    <div key={item.id} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-serif text-lg pr-8">{item.question}</h4>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingItem(item)} className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                          <button onClick={() => handleDeleteItem('faq', item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <p className="text-sm text-white/40">{item.answer}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div className="space-y-4">
                  {testimonials.map(item => (
                    <div key={item.id} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-serif text-lg">{item.name}</h4>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingItem(item)} className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                          <button onClick={() => handleDeleteItem('testimonials', item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <div className="flex text-gold mb-2">
                        {[...Array(item.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                      <p className="text-sm text-white/40 italic">"{item.content}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-2xl rounded-3xl p-8 relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif">{editingItem.id ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}</h3>
                <button onClick={() => setEditingItem(null)} className="text-white/40 hover:text-white"><X size={24} /></button>
              </div>

              <div className="space-y-4">
                {activeTab === 'services' && (
                  <>
                    <input className="admin-input" placeholder="Name" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                    <input className="admin-input" placeholder="Price" value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: e.target.value})} />
                    <input className="admin-input" placeholder="Category" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} />
                    <textarea className="admin-input" placeholder="Description" rows={3} value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  </>
                )}
                {activeTab === 'products' && (
                  <>
                    <input className="admin-input" placeholder="Name" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                    <input className="admin-input" placeholder="Price" value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: e.target.value})} />
                    <input className="admin-input" placeholder="Image URL" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                    <input className="admin-input" placeholder="Payment URL (e.g., Stripe, PayPal, Square)" value={editingItem.payment_link || ''} onChange={e => setEditingItem({...editingItem, payment_link: e.target.value})} />
                    <textarea className="admin-input" placeholder="Description" rows={3} value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  </>
                )}
                {activeTab === 'team' && (
                  <>
                    <input className="admin-input" placeholder="Name" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                    <input className="admin-input" placeholder="Role" value={editingItem.role || ''} onChange={e => setEditingItem({...editingItem, role: e.target.value})} />
                    <input className="admin-input" placeholder="Image URL" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                    <textarea className="admin-input" placeholder="Bio" rows={3} value={editingItem.bio || ''} onChange={e => setEditingItem({...editingItem, bio: e.target.value})} />
                  </>
                )}
                {activeTab === 'gallery' && (
                  <>
                    <input className="admin-input" placeholder="Image URL" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                    <input className="admin-input" placeholder="Caption" value={editingItem.caption || ''} onChange={e => setEditingItem({...editingItem, caption: e.target.value})} />
                  </>
                )}
                {activeTab === 'faq' && (
                  <>
                    <input className="admin-input" placeholder="Question" value={editingItem.question || ''} onChange={e => setEditingItem({...editingItem, question: e.target.value})} />
                    <textarea className="admin-input" placeholder="Answer" rows={5} value={editingItem.answer || ''} onChange={e => setEditingItem({...editingItem, answer: e.target.value})} />
                  </>
                )}
                {activeTab === 'testimonials' && (
                  <>
                    <input className="admin-input" placeholder="Name" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                    <input className="admin-input" type="number" min="1" max="5" placeholder="Rating (1-5)" value={editingItem.rating || 5} onChange={e => setEditingItem({...editingItem, rating: parseInt(e.target.value)})} />
                    <textarea className="admin-input" placeholder="Content" rows={4} value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} />
                  </>
                )}
                <Button variant="primary" className="w-full py-4" onClick={() => handleSaveItem(activeTab, editingItem)}>SAVE CHANGES</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
