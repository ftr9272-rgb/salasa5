import React, { useEffect, useRef, useState } from 'react';
import { X, Send, ShoppingBag, Search } from 'lucide-react';

type UserType = 'merchant' | 'supplier' | 'shipping' | 'customer';

interface ContactPayload {
  id: string;
  name: string;
  type: string;
  itemName?: string;
  item?: { id?: string; name?: string };
}

interface SmartChatWindowProps {
  onClose: () => void;
  userType: UserType;
  userName?: string;
  userRole?: string;
  initialContact?: ContactPayload | null;
}

const STORAGE_PARTNERS_KEY = 'chatPartners';
const STORAGE_SELECTED_KEY = 'chatSelectedPartner';

const SmartChatWindow: React.FC<SmartChatWindowProps> = ({ onClose, userType, userName = 'المستخدم', userRole, initialContact }) => {
  // partners source: initialContact.contact.partners || localStorage || fallback
  const [partners, setPartners] = useState<ContactPayload[]>(() => {
    try {
      if (initialContact && (initialContact as any).contact && Array.isArray((initialContact as any).contact.partners)) {
        return (initialContact as any).contact.partners as ContactPayload[];
      }
      const raw = localStorage.getItem(STORAGE_PARTNERS_KEY);
      if (raw) return JSON.parse(raw) as ContactPayload[];
    } catch (e) {
      // ignore
    }
    return [
      { id: 'p-1', name: 'شركة التوريد النموذجية', type: 'supplier' },
      { id: 'p-2', name: 'تاجر التجزئة التجريبي', type: 'merchant' },
      { id: 'p-3', name: 'شركة الشحن السريعة', type: 'shipping' }
    ];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [selectedPartner, setSelectedPartner] = useState<ContactPayload | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SELECTED_KEY);
      if (raw) return JSON.parse(raw) as ContactPayload;
    } catch (e) {}

    // Normalize initialContact: if it contains a nested contact object use that as partner
    if (!initialContact) return null;
    // some callers pass an object like { contact: { name, id, ... }, itemName } - prefer that
    // @ts-ignore
    if ((initialContact as any).contact && (initialContact as any).contact.name) {
      // @ts-ignore
      return (initialContact as any).contact as ContactPayload;
    }
    // If initialContact looks like a partner (has a supplier/merchant/shipping type), use it
    if (initialContact.type === 'supplier' || initialContact.type === 'merchant' || initialContact.type === 'shipping') {
      return initialContact as ContactPayload;
    }
    return null;
  });

  useEffect(() => {
    // debug: log initial contact and selected partner when chat window mounts
    // eslint-disable-next-line no-console
    console.debug('[SmartChatWindow] initialContact:', initialContact);
    // eslint-disable-next-line no-console
    console.debug('[SmartChatWindow] selectedPartner(initial):', selectedPartner);
    // when modal opens, focus search
    if (modalOpen) setTimeout(() => searchRef.current?.focus(), 0);
  }, [modalOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!modalOpen) return;
      if (e.key === 'Escape') setModalOpen(false);
      if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)); }
      if (e.key === 'Enter') { e.preventDefault(); const p = filtered[highlight]; if (p) selectPartner(p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, highlight]);

  const filtered = partners.filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase()) || p.type.toLowerCase().includes(query.trim().toLowerCase()));

  const openModal = () => { setQuery(''); setHighlight(0); setModalOpen(true); };

  const selectPartner = (p: ContactPayload) => {
    setSelectedPartner(p);
    localStorage.setItem(STORAGE_SELECTED_KEY, JSON.stringify(p));
    setModalOpen(false);
    // notify global controller
    window.dispatchEvent(new CustomEvent('open-chat-with-contact', { detail: { contact: p } }));
  };

  return (
    <div className="fixed right-6 bottom-6 w-[380px] max-w-[calc(100%-48px)] z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} />
            <div>
              <div className="font-semibold">مساعد {userRole || 'ذكي'}</div>
              {/* Compute a reliable partner name: prefer selectedPartner, then initialContact.contact.name, otherwise fall back to no partner */}
              {(() => {
                // @ts-ignore
                const nestedName = initialContact && (initialContact as any).contact?.name;
                const isPartnerLike = initialContact && (initialContact.type === 'supplier' || initialContact.type === 'merchant' || initialContact.type === 'shipping');
                const partnerName = selectedPartner?.name || nestedName || (isPartnerLike ? initialContact?.name : undefined);
                return <div className="text-xs opacity-90">{partnerName ? `متصل مع ${partnerName}` : 'متصل الآن'}</div>;
              })()}
              {initialContact?.itemName && (
                <div className="mt-1 text-xs text-white/90">بخصوص <strong>{initialContact.itemName}</strong></div>
              )}
              {(!initialContact?.itemName && initialContact?.item?.name) && (
                <div className="mt-1 text-xs text-white/90">بخصوص <strong>{initialContact.item.name}</strong></div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={openModal} title="اختر شريك" aria-label="اختر شريك" className="bg-white/20 text-white px-3 py-1 rounded text-sm hover:bg-white/30">اختر شريك</button>
            <button onClick={onClose} title="إغلاق المحادثة" aria-label="إغلاق المحادثة" className="p-1 hover:bg-white/20 rounded"><X size={16} /></button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-700">مرحباً {userName}. يمكنك بدء المحادثة الآن.</p>
        </div>

        <div className="border-t p-3 bg-white flex gap-2">
          <input aria-label="نص الرسالة" className="flex-1 border rounded-full px-3 py-2 text-sm" placeholder="اكتب رسالة..." />
          <button aria-label="أرسل رسالة" title="إرسال" className="bg-blue-600 text-white px-3 py-2 rounded-full"><Send size={16} /></button>
        </div>
      </div>

      {/* Modal: partner picker */}
      {modalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="اختيار شريك للمحادثة">
          <div className="fixed inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="bg-white rounded-lg shadow-xl w-[min(720px,95%)] max-h-[80vh] overflow-hidden z-70 relative">
            <div className="p-4 border-b flex items-center gap-3">
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded w-full">
                <Search className="text-gray-500" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setHighlight(0); }}
                  placeholder="ابحث عن شريك بالاسم أو النوع..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  aria-label="بحث عن الشريك"
                />
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded" title="إغلاق" aria-label="إغلاق"><X size={16} /></button>
            </div>

            <div className="p-3">
              <div className="text-sm text-gray-600 mb-2">نتائج البحث ({filtered.length})</div>
              <div ref={listRef} className="divide-y border rounded overflow-auto max-h-[56vh]">
                {filtered.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => selectPartner(p)}
                    onMouseEnter={() => setHighlight(idx)}
                    className={`w-full text-right px-4 py-3 hover:bg-gray-50 flex flex-col items-start ${highlight === idx ? 'bg-indigo-50' : ''}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="text-sm font-medium text-right">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.type}</div>
                    </div>
                    {/* optional extra info could go here */}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">لا توجد نتائج تطابق البحث</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartChatWindow;