import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Boxes,
  TicketPercent,
  BarChart3,
  Settings,
  ShieldCheck,
  History,
  LogOut,
  Bell,
  Search,
  ExternalLink,
  Menu,
  X,
  Plus,
  KeyRound,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { api, AdminUser, NotificationData } from '../../services/api';

interface AdminLayoutProps {
  user: AdminUser;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onNavigateToStorefront: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  activeTab,
  onSelectTab,
  onLogout,
  onNavigateToStorefront,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // Poll notifications
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const list = await api.getNotifications();
        setNotifications(list);
      } catch (err) {
        // ignore
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      // ignore
    }
  };

  const handleNotificationClick = async (notif: NotificationData) => {
    try {
      await api.markNotificationRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    } catch {
      // ignore
    }
    setNotifDropdownOpen(false);
    if (notif.link) {
      if (notif.link.includes('orders')) onSelectTab('orders');
      else if (notif.link.includes('inventory')) onSelectTab('inventory');
      else if (notif.link.includes('products')) onSelectTab('products');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    setPwLoading(true);
    try {
      await api.changePassword(currentPw, newPw);
      setPwSuccess('Password changed successfully.');
      setCurrentPw('');
      setNewPw('');
      setTimeout(() => {
        setPasswordModalOpen(false);
        setPwSuccess('');
      }, 1500);
    } catch (err: any) {
      setPwError(err.message || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  const isOwner = user.role === 'owner';

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'coupons', label: 'Coupons', icon: TicketPercent },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    ...(isOwner
      ? [
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'team', label: 'Staff & Team', icon: ShieldCheck },
          { id: 'activity', label: 'Audit Activity', icon: History },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F1] text-[#202820] flex font-sans antialiased">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#153D2C] text-stone-200 border-r border-[#153D2C]/40 shrink-0">
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#235841]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#3C8053] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              BZ
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight font-['Montserrat'] leading-none">
                Bird Zone
              </h1>
              <p className="text-[11px] text-[#E9BE69] mt-0.5 font-medium">
                Admin Management
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#3C8053] text-white shadow-xs font-semibold'
                    : 'text-stone-300 hover:bg-[#1a4a35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#E9BE69]' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'orders' && unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#E9BE69] text-stone-900 tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Storefront Link & User Info Footer */}
        <div className="p-4 border-t border-[#235841] bg-[#103023]">
          <button
            onClick={onNavigateToStorefront}
            className="w-full mb-3 flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-[#3C8053]/40 hover:bg-[#3C8053] text-white text-xs font-medium transition-colors border border-[#3C8053]/50 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E9BE69]" />
            <span>Open Public Storefront</span>
          </button>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#3C8053] flex items-center justify-center text-white font-bold text-xs shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <span className="text-[10px] text-[#E9BE69] uppercase font-bold tracking-wider">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded transition-colors"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 sm:h-20 bg-white border-b border-stone-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          
          {/* Left: Mobile hamburger + Active Section Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#778078] font-medium hidden sm:inline">
                  Bird Zone Wapda Town
                </span>
                <span className="text-stone-300 hidden sm:inline">/</span>
                <h2 className="text-base sm:text-lg font-bold text-[#202820] font-['Montserrat'] capitalize">
                  {activeTab.replace('-', ' ')}
                </h2>
              </div>
            </div>
          </div>

          {/* Right Topbar Actions */}
          <div className="flex items-center gap-3">
            
            {/* Quick Action: New Product */}
            <button
              onClick={() => onSelectTab('products')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#153D2C] hover:bg-[#3C8053] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Products</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-stone-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#D94848] ring-2 ring-white" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 font-['Montserrat']">
                      Notifications ({unreadCount} new)
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-[#3C8053] hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-stone-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3.5 text-xs hover:bg-stone-50 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-[#F8F7F1]/80 font-medium' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-stone-800">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {new Date(notif.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-stone-600 mt-1 leading-relaxed text-[11px]">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#153D2C] text-[#E9BE69] font-bold text-xs flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-stone-900 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-stone-500 uppercase">{user.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-900">{user.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#153D2C]/10 text-[#153D2C]">
                      {user.role === 'owner' ? 'Owner / Full Control' : 'Staff Access'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setPasswordModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-stone-400" />
                    <span>Change Password</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigateToStorefront();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                    <span>View Public Storefront</span>
                  </button>

                  <div className="border-t border-stone-100 my-1" />

                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />

          <div className="relative w-72 bg-[#153D2C] text-stone-200 h-full flex flex-col z-10 shadow-2xl">
            <div className="h-16 px-6 flex items-center justify-between border-b border-[#235841]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3C8053] flex items-center justify-center text-white font-bold text-sm">
                  BZ
                </div>
                <h1 className="font-bold text-white text-base font-['Montserrat']">
                  Bird Zone Admin
                </h1>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-[#3C8053] text-white font-semibold'
                        : 'text-stone-300 hover:bg-[#1a4a35] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#235841] bg-[#103023]">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  onNavigateToStorefront();
                }}
                className="w-full mb-2 flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-[#3C8053] text-white text-xs font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#E9BE69]" />
                <span>Open Storefront</span>
              </button>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-red-300 hover:bg-red-950/40 text-xs font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Dialog */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm font-['Montserrat']">
                Change Admin Password
              </h3>
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
              {pwError && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{pwError}</span>
                </div>
              )}
              {pwSuccess && (
                <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{pwSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded px-3 py-2 focus:outline-hidden focus:border-[#3C8053]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded px-3 py-2 focus:outline-hidden focus:border-[#3C8053]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="px-4 py-1.5 bg-[#153D2C] hover:bg-[#3C8053] text-white text-xs font-semibold rounded disabled:opacity-50"
                >
                  {pwLoading ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
