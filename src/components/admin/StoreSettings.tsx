import React, { useState, useEffect } from 'react';
import {
  Settings,
  Truck,
  CreditCard,
  LayoutTemplate,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { api, StoreSettingsData } from '../../services/api';

export const StoreSettings: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'delivery' | 'payment' | 'content'>('general');

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load store settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSavedSuccess(false);
    try {
      await api.updateSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleZoneChange = (index: number, field: string, value: any) => {
    if (!settings) return;
    const newZones = [...settings.delivery.zones];
    newZones[index] = { ...newZones[index], [field]: value };
    setSettings({
      ...settings,
      delivery: { ...settings.delivery, zones: newZones },
    });
  };

  const handleAddZone = () => {
    if (!settings) return;
    const newZone = {
      id: `zone-${Date.now()}`,
      name: 'New Area Zone',
      nameUrdu: 'نیا علاقہ',
      rate: 300,
      freeDeliveryThreshold: 5000,
      eta: 'Same Day',
      description: 'Custom coverage sector in Lahore.',
    };
    setSettings({
      ...settings,
      delivery: { ...settings.delivery, zones: [...settings.delivery.zones, newZone] },
    });
  };

  const handleRemoveZone = (index: number) => {
    if (!settings) return;
    const newZones = settings.delivery.zones.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      delivery: { ...settings.delivery, zones: newZones },
    });
  };

  if (loading || !settings) {
    return (
      <div className="py-12 text-center text-xs text-stone-400">
        Loading store settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header and Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-['Montserrat']">
            Store Configuration & Storefront Sync
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Modify business rules, delivery rates, payment gateways, and homepage copy.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#153D2C] hover:bg-[#3C8053] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Settings successfully synchronized with live customer storefront.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 bg-white p-2 rounded-xl text-xs font-medium">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'general' ? 'bg-[#153D2C] text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>General Info</span>
        </button>

        <button
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'delivery' ? 'bg-[#153D2C] text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Delivery Zones</span>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'payment' ? 'bg-[#153D2C] text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Gateways</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'content' ? 'bg-[#153D2C] text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Storefront Content</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* TAB 1: General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-stone-900 text-sm font-['Montserrat'] pb-2 border-b border-stone-100">
              General Store Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Store Display Name</label>
                <input
                  type="text"
                  value={settings.general.storeName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, storeName: e.target.value },
                    })
                  }
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={settings.general.tagline}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, tagline: e.target.value },
                    })
                  }
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={settings.general.contactPhone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, contactPhone: e.target.value },
                    })
                  }
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">WhatsApp Number (e.g. 923001234567)</label>
                <input
                  type="text"
                  value={settings.general.whatsappNumber}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, whatsappNumber: e.target.value },
                    })
                  }
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={settings.general.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, email: e.target.value },
                    })
                  }
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Physical Store Address</label>
                <input
                  type="text"
                  value={settings.general.address}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, address: e.target.value },
                    })
                  }
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Visiting Hours</label>
                <input
                  type="text"
                  value={settings.general.businessHours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, businessHours: e.target.value },
                    })
                  }
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Delivery Settings */}
        {activeTab === 'delivery' && (
          <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-sm font-['Montserrat']">
                  Lahore Delivery Coverage & Zones
                </h3>
                <p className="text-stone-500 text-[11px]">
                  Configured rates dynamically apply to customer checkout and cart calculator.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddZone}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded font-semibold text-stone-800"
              >
                + Add Zone
              </button>
            </div>

            <div className="space-y-4">
              {settings.delivery.zones.map((zone, idx) => (
                <div key={zone.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 font-['Montserrat']">
                      Zone {idx + 1}: {zone.name}
                    </span>
                    {settings.delivery.zones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveZone(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1">Zone Name</label>
                      <input
                        type="text"
                        value={zone.name}
                        onChange={(e) => handleZoneChange(idx, 'name', e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1">Delivery Charge (PKR)</label>
                      <input
                        type="number"
                        value={zone.rate}
                        onChange={(e) => handleZoneChange(idx, 'rate', Number(e.target.value))}
                        className="w-full p-2 bg-white border border-stone-300 rounded font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1">Free Delivery Min (PKR)</label>
                      <input
                        type="number"
                        value={zone.freeDeliveryThreshold || ''}
                        onChange={(e) =>
                          handleZoneChange(
                            idx,
                            'freeDeliveryThreshold',
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="w-full p-2 bg-white border border-stone-300 rounded font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1">Estimated Time (ETA)</label>
                      <input
                        type="text"
                        value={zone.eta}
                        onChange={(e) => handleZoneChange(idx, 'eta', e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Storefront Delivery Policy Notice
              </label>
              <textarea
                rows={2}
                value={settings.delivery.expectedDeliveryNote}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    delivery: { ...settings.delivery, expectedDeliveryNote: e.target.value },
                  })
                }
                className="w-full p-2 border border-stone-300 rounded"
              />
            </div>
          </div>
        )}

        {/* TAB 3: Payment Settings */}
        {activeTab === 'payment' && (
          <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-5 text-xs">
            <h3 className="font-bold text-stone-900 text-sm font-['Montserrat'] pb-2 border-b border-stone-100">
              Payment Gateways & Local Wallets
            </h3>

            {/* Cash on Delivery */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Cash on Delivery (COD)</span>
                <span className="text-stone-500">Standard for 95% of orders across Lahore</span>
              </div>
              <input
                type="checkbox"
                checked={settings.payment.codEnabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    payment: { ...settings.payment, codEnabled: e.target.checked },
                  })
                }
                className="w-4 h-4 text-[#153D2C] rounded"
              />
            </div>

            {/* JazzCash */}
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950">JazzCash Mobile Wallet</span>
                <input
                  type="checkbox"
                  checked={settings.payment.jazzcashEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment: { ...settings.payment, jazzcashEnabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-amber-600 rounded"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">Account Title</label>
                  <input
                    type="text"
                    value={settings.payment.jazzcashTitle}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, jazzcashTitle: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-white border border-stone-300 rounded font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">JazzCash Account Number</label>
                  <input
                    type="text"
                    value={settings.payment.jazzcashAccount}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, jazzcashAccount: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-white border border-stone-300 rounded font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Easypaisa */}
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950">Easypaisa Mobile Wallet</span>
                <input
                  type="checkbox"
                  checked={settings.payment.easypaisaEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment: { ...settings.payment, easypaisaEnabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">Account Title</label>
                  <input
                    type="text"
                    value={settings.payment.easypaisaTitle}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, easypaisaTitle: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-white border border-stone-300 rounded font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">Easypaisa Account Number</label>
                  <input
                    type="text"
                    value={settings.payment.easypaisaAccount}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, easypaisaAccount: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-white border border-stone-300 rounded font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Bank Transfer Details */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">Direct Bank Transfer (IBAN)</span>
                <input
                  type="checkbox"
                  checked={settings.payment.bankTransferEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment: { ...settings.payment, bankTransferEnabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded"
                />
              </div>
              <input
                type="text"
                placeholder="Bank Name, Account Title, IBAN"
                value={settings.payment.bankDetails}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    payment: { ...settings.payment, bankDetails: e.target.value },
                  })
                }
                className="w-full p-2 bg-white border border-stone-300 rounded font-mono"
              />
            </div>
          </div>
        )}

        {/* TAB 4: Website Content */}
        {activeTab === 'content' && (
          <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-stone-900 text-sm font-['Montserrat'] pb-2 border-b border-stone-100">
              Customer Storefront Copy & Banner
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Homepage Hero Heading (English)</label>
                <input
                  type="text"
                  value={settings.content.heroHeading}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      content: { ...settings.content, heroHeading: e.target.value },
                    })
                  }
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hero Heading (Urdu)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={settings.content.heroHeadingUrdu}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      content: { ...settings.content, heroHeadingUrdu: e.target.value },
                    })
                  }
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                value={settings.content.heroSubtitle}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    content: { ...settings.content, heroSubtitle: e.target.value },
                  })
                }
                className="w-full p-2 border border-stone-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Top Announcement Banner</label>
              <input
                type="text"
                value={settings.content.announcementText}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    content: { ...settings.content, announcementText: e.target.value },
                  })
                }
                className="w-full p-2 border border-stone-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">About Us Section Overview</label>
              <textarea
                rows={2}
                value={settings.content.aboutText}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    content: { ...settings.content, aboutText: e.target.value },
                  })
                }
                className="w-full p-2 border border-stone-300 rounded"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#153D2C] hover:bg-[#3C8053] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>

    </div>
  );
};
