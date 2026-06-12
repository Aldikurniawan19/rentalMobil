import React, { useState, useEffect } from 'react';
import { getLandingContent, saveLandingContent } from '../utils/localStorageHelper';
import { LandingContent, FAQ, Testimonial } from '../types';

export default function Content() {
  const [content, setContent] = useState<LandingContent | null>(null);
  const [activeSection, setActiveSection] = useState<'hero' | 'promo' | 'faqs' | 'testimonials'>('hero');
  
  // FAQ form state
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);

  // Testimonial form state
  const [editingTesti, setEditingTesti] = useState<Testimonial | null>(null);
  const [testiName, setTestiName] = useState('');
  const [testiRole, setTestiRole] = useState('');
  const [testiComment, setTestiComment] = useState('');
  const [testiRating, setTestiRating] = useState(5);
  const [isTestiFormOpen, setIsTestiFormOpen] = useState(false);

  useEffect(() => {
    setContent(getLandingContent());
  }, []);

  if (!content) return <div className="text-center p-8 text-xs font-bold text-slate-400">Memuat Konten...</div>;

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updated: LandingContent = {
      ...content,
      hero: {
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        ctaText: formData.get('ctaText') as string,
      }
    };
    setContent(updated);
    saveLandingContent(updated);
    alert('Konten Hero berhasil disimpan di database simulasi!');
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updated: LandingContent = {
      ...content,
      promo: {
        title: formData.get('title') as string,
        discountPercent: Number(formData.get('discountPercent')),
        code: formData.get('code') as string,
        expiry: formData.get('expiry') as string,
      }
    };
    setContent(updated);
    saveLandingContent(updated);
    alert('Konten Promo Banner berhasil disimpan di database simulasi!');
  };

  // FAQ Operations
  const openAddFaq = () => {
    setEditingFaq(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setIsFaqFormOpen(true);
  };

  const openEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setIsFaqFormOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedFaqs: FAQ[];

    if (editingFaq) {
      updatedFaqs = content.faqs.map(f => 
        f.id === editingFaq.id ? { ...f, question: faqQuestion, answer: faqAnswer } : f
      );
    } else {
      updatedFaqs = [
        ...content.faqs,
        { id: Date.now(), question: faqQuestion, answer: faqAnswer }
      ];
    }

    const updated = { ...content, faqs: updatedFaqs };
    setContent(updated);
    saveLandingContent(updated);
    setIsFaqFormOpen(false);
  };

  const handleDeleteFaq = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
      const updatedFaqs = content.faqs.filter(f => f.id !== id);
      const updated = { ...content, faqs: updatedFaqs };
      setContent(updated);
      saveLandingContent(updated);
    }
  };

  // Testimonial Operations
  const openAddTesti = () => {
    setEditingTesti(null);
    setTestiName('');
    setTestiRole('');
    setTestiComment('');
    setTestiRating(5);
    setIsTestiFormOpen(true);
  };

  const openEditTesti = (testi: Testimonial) => {
    setEditingTesti(testi);
    setTestiName(testi.name);
    setTestiRole(testi.role);
    setTestiComment(testi.comment);
    setTestiRating(testi.rating);
    setIsTestiFormOpen(true);
  };

  const handleSaveTesti = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedTestis: Testimonial[];

    if (editingTesti) {
      updatedTestis = content.testimonials.map(t => 
        t.id === editingTesti.id ? { 
          ...t, 
          name: testiName, 
          role: testiRole, 
          comment: testiComment, 
          rating: testiRating 
        } : t
      );
    } else {
      updatedTestis = [
        ...content.testimonials,
        { 
          id: Date.now(), 
          name: testiName, 
          role: testiRole, 
          comment: testiComment, 
          rating: testiRating,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        }
      ];
    }

    const updated = { ...content, testimonials: updatedTestis };
    setContent(updated);
    saveLandingContent(updated);
    setIsTestiFormOpen(false);
  };

  const handleDeleteTesti = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus testimonial ulasan ini?')) {
      const updatedTestis = content.testimonials.filter(t => t.id !== id);
      const updated = { ...content, testimonials: updatedTestis };
      setContent(updated);
      saveLandingContent(updated);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-fade-in">
      {/* Side Tabs Menu */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-1">
        {[
          { id: 'hero', name: 'Hero Banner Section', icon: 'ph-fill ph-slideshow' },
          { id: 'promo', name: 'Promo Banner & Diskon', icon: 'ph-fill ph-tag' },
          { id: 'faqs', name: 'Tanya Jawab (FAQ)', icon: 'ph-fill ph-question' },
          { id: 'testimonials', name: 'Testimoni & Review', icon: 'ph-fill ph-chat-centered-text' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === tab.id
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <i className={`${tab.icon} text-lg`}></i>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Editing Area */}
      <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[50vh]">
        {/* HERO SECTION EDITOR */}
        {activeSection === 'hero' && (
          <form onSubmit={handleSaveHero} className="space-y-6">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Edit Hero Section</h4>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Headline Tagline</label>
              <input
                type="text"
                name="title"
                defaultValue={content.hero.title}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800 font-extrabold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sub-Headline Deskripsi</label>
              <textarea
                name="subtitle"
                defaultValue={content.hero.subtitle}
                required
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-600 leading-relaxed resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Teks Tombol Aksi (CTA Button)</label>
              <input
                type="text"
                name="ctaText"
                defaultValue={content.hero.ctaText}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-700 font-bold"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Simpan Perubahan Hero
            </button>
          </form>
        )}

        {/* PROMO BANNER EDITOR */}
        {activeSection === 'promo' && (
          <form onSubmit={handleSavePromo} className="space-y-6">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Edit Promo Banner</h4>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Teks Judul Promo</label>
              <input
                type="text"
                name="title"
                defaultValue={content.promo.title}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800 font-extrabold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Persentase Diskon (%)</label>
                <input
                  type="number"
                  name="discountPercent"
                  defaultValue={content.promo.discountPercent}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kode Voucher Kupon</label>
                <input
                  type="text"
                  name="code"
                  defaultValue={content.promo.code}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-mono text-blue-600 font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tanggal Berakhir Kupon</label>
                <input
                  type="date"
                  name="expiry"
                  defaultValue={content.promo.expiry}
                  required
                  className="w-full px-3 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-700 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Simpan Perubahan Promo
            </button>
          </form>
        )}

        {/* FAQ LIST EDITOR */}
        {activeSection === 'faqs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800">Daftar Pertanyaan FAQ</h4>
              <button
                onClick={openAddFaq}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-lg text-xs transition-all cursor-pointer"
              >
                <i className="ph ph-plus-circle font-bold"></i> Tambah FAQ
              </button>
            </div>

            <div className="space-y-4">
              {content.faqs.map((faq) => (
                <div key={faq.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Tanya Jawab</span>
                    <h5 className="text-xs font-bold text-slate-700">{faq.question}</h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">{faq.answer}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditFaq(faq)}
                      className="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit FAQ"
                    >
                      <i className="ph ph-pencil-simple font-bold"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Hapus FAQ"
                    >
                      <i className="ph ph-trash font-bold"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS LIST EDITOR */}
        {activeSection === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800">Daftar Testimoni Pelanggan</h4>
              <button
                onClick={openAddTesti}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-lg text-xs transition-all cursor-pointer"
              >
                <i className="ph ph-plus-circle font-bold"></i> Tambah Testimoni
              </button>
            </div>

            <div className="space-y-4">
              {content.testimonials.map((testi) => (
                <div key={testi.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <img
                      src={testi.avatar}
                      alt={testi.name}
                      className="w-10 h-10 object-cover rounded-full border border-slate-200 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-slate-700">{testi.name}</h5>
                        <span className="text-[10px] text-slate-400 font-semibold">{testi.role}</span>
                      </div>
                      <div className="flex gap-0.5 text-amber-400 my-1">
                        {Array.from({ length: testi.rating }).map((_, i) => (
                          <i key={i} className="ph-fill ph-star text-xs"></i>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 italic leading-relaxed font-medium">"{testi.comment}"</p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEditTesti(testi)}
                      className="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit Testimoni"
                    >
                      <i className="ph ph-pencil-simple font-bold"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteTesti(testi.id)}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Hapus Ulasan"
                    >
                      <i className="ph ph-trash font-bold"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAQ Add/Edit Modal */}
      {isFaqFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-md font-extrabold text-slate-800">
                {editingFaq ? 'Ubah Rincian FAQ' : 'Tambah FAQ Baru'}
              </h4>
              <button
                onClick={() => setIsFaqFormOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ph ph-x text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pertanyaan</label>
                <input
                  type="text"
                  required
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800 font-bold"
                  placeholder="Contoh: Apakah ada biaya overtime?"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jawaban Penjelasan</label>
                <textarea
                  required
                  rows={4}
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white resize-none text-slate-600 leading-relaxed font-medium"
                  placeholder="Jelaskan detail jawaban atau kebijakan secara ringkas dan informatif..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFaqFormOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-blue-500/10"
                >
                  Simpan FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Add/Edit Modal */}
      {isTestiFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-md font-extrabold text-slate-800">
                {editingTesti ? 'Ubah Rincian Ulasan' : 'Tambah Testimoni Ulasan Baru'}
              </h4>
              <button
                onClick={() => setIsTestiFormOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ph ph-x text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveTesti} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Pengulas</label>
                  <input
                    type="text"
                    required
                    value={testiName}
                    onChange={(e) => setTestiName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800 font-bold"
                    placeholder="Contoh: Roni Wijaya"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status / Kota Asal</label>
                  <input
                    type="text"
                    required
                    value={testiRole}
                    onChange={(e) => setTestiRole(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-700"
                    placeholder="Contoh: Swasta, Sleman"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rating Ulasan Bintang</label>
                <select
                  value={testiRating}
                  onChange={(e) => setTestiRating(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-semibold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                  <option value={3}>⭐⭐⭐ (3 Bintang)</option>
                  <option value={2}>⭐⭐ (2 Bintang)</option>
                  <option value={1}>⭐ (1 Bintang)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ulasan Deskripsi</label>
                <textarea
                  required
                  rows={4}
                  value={testiComment}
                  onChange={(e) => setTestiComment(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white resize-none text-slate-600 leading-relaxed font-medium"
                  placeholder="Tulis ulasan positif atau feedback dari customer..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTestiFormOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-blue-500/10"
                >
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
