import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, ShieldCheck, Phone } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Live Bird Hand-Picking & Inspection');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('12:00 PM - 02:00 PM');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date) {
      alert('Please fill in your name, contact phone, and preferred date.');
      return;
    }
    setConfirmed(true);
  };

  const handleWhatsAppBooking = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Bird Zone Wapda Town!\n\n*Store Visit & Consultation Booking:*\n- Customer Name: ${name}\n- Phone: ${phone}\n- Service: ${service}\n- Preferred Date: ${date}\n- Preferred Time Slot: ${timeSlot}\n- Special Requests: ${notes || 'None'}\n\nPlease confirm my slot at your Wapda Town branch.`
    );
    window.open(`https://wa.me/923001234567?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="font-bold text-base text-stone-900 font-['Montserrat']">
              {confirmed ? 'Visit Scheduled!' : 'Book Shop Visit / Avian Consultation'}
            </h2>
            <p className="text-xs text-stone-500">
              Bird Zone · Commercial Area, Phase 1, Wapda Town, Lahore
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmed ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#4CAF50]/15 text-[#4CAF50] flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900 font-['Montserrat']">
                Appointment Reserved
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                We have saved your time slot for <strong className="text-stone-800">{service}</strong> on{' '}
                <strong className="text-stone-800">{date} ({timeSlot})</strong>.
              </p>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-stone-700">
                <MapPin className="w-4 h-4 text-[#4CAF50] shrink-0" />
                <span>Shop #4, Commercial Boulevard, Phase 1, Wapda Town, Lahore</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Clock className="w-4 h-4 text-[#FF9800] shrink-0" />
                <span>Store hours: 10:00 AM – 11:00 PM (Daily)</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Phone className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>Helpline / WhatsApp: +92 300 1234567</span>
              </div>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={handleWhatsAppBooking}
                className="px-4 py-2.5 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs transition-colors"
              >
                Send Confirmation to Store WhatsApp
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Select Service
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#4CAF50] bg-white"
              >
                <option value="Live Bird Hand-Picking & Inspection">Live Bird Hand-Picking & Interaction</option>
                <option value="Aviary & Flight Cage Consultation">Aviary & Flight Cage Setup Advice</option>
                <option value="Bird Grooming & Beak/Nail Trimming">Bird Grooming & Wing/Nail Trimming</option>
                <option value="Avian Diet Transition Consultation">Avian Diet & Chop Transition Consultation</option>
                <option value="Pre-Adoption Family Visit">Pre-Adoption Family & Kids Intro Visit</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Qureshi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#4CAF50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  WhatsApp / Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#4CAF50] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#4CAF50] bg-white"
                >
                  <option value="11:00 AM - 01:00 PM">Morning (11:00 AM – 01:00 PM)</option>
                  <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM – 05:00 PM)</option>
                  <option value="06:00 PM - 09:00 PM">Evening (06:00 PM – 09:00 PM)</option>
                  <option value="09:00 PM - 10:30 PM">Late Evening (09:00 PM – 10:30 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Specific Bird Species or Requirements (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Interested in hand-tamed Cockatiels or checking cage dimensions for a Ringneck"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#4CAF50]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-md bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
