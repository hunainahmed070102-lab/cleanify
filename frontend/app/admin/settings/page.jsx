'use client'
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Save, Store, Phone, Mail, Link as LinkIcon, MessageSquare, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSettings, saveSettings } from '@/lib/settingsService';
import { logout } from '@/lib/authService';
import { getAdminPassword, updateAdminPassword, verifyPassword } from '@/lib/passwordService';
import { useRouter } from 'next/navigation';

const SectionCard = memo(({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Icon size={16} className="text-green-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800">{title}</h3>
        </div>
        <div className="p-6 space-y-4">{children}</div>
    </div>
));

SectionCard.displayName = 'SectionCard';

export default function AdminSettings() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        siteName: '',
        businessEmail: '',
        businessPhone: '',
        businessAddress: '',
        whatsappNumber: '',
        instagramUrl: '',
        adminName: '',
        adminEmail: '',
    });
    const [loading, setLoading] = useState(true);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const loaded = getSettings();
        setSettings({
            siteName: loaded.siteName || 'Cleanify',
            businessEmail: loaded.businessEmail || 'info@cleanify.co.uk',
            businessPhone: loaded.businessPhone || '+44 20 1234 5678',
            businessAddress: loaded.businessAddress || '123 London Road, London, UK',
            whatsappNumber: loaded.whatsappNumber || '',
            instagramUrl: loaded.instagramUrl || '',
            adminName: loaded.adminName || 'Admin',
            adminEmail: loaded.adminEmail || 'admin@cleanify.co.uk',
        });
        setLoading(false);
    }, []);

    const handleInputChange = useCallback((field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    }, []);

    const handlePasswordChange = useCallback((field, value) => {
        setPasswordForm(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSave = useCallback(() => {
        const success = saveSettings(settings);
        if (success) {
            toast.success('Settings saved successfully!');
            window.dispatchEvent(new Event('storage'));
        } else {
            toast.error('Failed to save settings');
        }
    }, [settings]);

    const handleChangePassword = useCallback(() => {
        // Verify current password
        if (!verifyPassword(passwordForm.currentPassword)) {
            toast.error('Current password is incorrect');
            return;
        }

        // Validate new password
        if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        // Check if passwords match
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New password and confirm password do not match');
            return;
        }

        // Update the password
        const success = updateAdminPassword(passwordForm.newPassword);
        
        if (success) {
            toast.success('Password changed successfully! Please login again.');
            
            // Clear form
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Logout and redirect after a short delay
            setTimeout(() => {
                logout();
                router.push('/admin/login');
            }, 1500);
        } else {
            toast.error('Failed to change password. Please try again.');
        }
    }, [passwordForm, router]);

    if (loading) return null;

    const inputClass = "w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all text-slate-800 text-sm";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

    return (
        <div className="text-slate-500 pb-20 md:pb-12">
            {/* Header */}
            <div className="mb-6 p-6 bg-white rounded-2xl border-2 border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-1">Settings</h1>
                    <p className="text-slate-500">Configure your business details and contact information.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-sm"
                >
                    <Save size={16} />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <SectionCard icon={Store} title="Business Info">
                        <div>
                            <label className={labelClass}>Business Name</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => handleInputChange('siteName', e.target.value)}
                                className={inputClass}
                                placeholder="Cleanify"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Business Address</label>
                            <input
                                type="text"
                                value={settings.businessAddress}
                                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                                className={inputClass}
                                placeholder="123 London Road, London, UK"
                            />
                        </div>
                    </SectionCard>

                    <SectionCard icon={Phone} title="Contact Details">
                        <div>
                            <label className={labelClass}>Public Email</label>
                            <input
                                type="email"
                                value={settings.businessEmail}
                                onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                                className={inputClass}
                                placeholder="info@cleanify.co.uk"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Support Phone</label>
                            <input
                                type="tel"
                                value={settings.businessPhone}
                                onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                                className={inputClass}
                                placeholder="+44 20 1234 5678"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>WhatsApp Business Number</label>
                            <div className="relative">
                                <MessageSquare size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="tel"
                                    value={settings.whatsappNumber}
                                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all text-slate-800 text-sm"
                                    placeholder="+447000000000"
                                />
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard icon={Mail} title="Admin Account">
                        <div>
                            <label className={labelClass}>Admin Name</label>
                            <input
                                type="text"
                                value={settings.adminName}
                                onChange={(e) => handleInputChange('adminName', e.target.value)}
                                className={inputClass}
                                placeholder="Admin"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Admin Email</label>
                            <input
                                type="email"
                                value={settings.adminEmail}
                                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                                className={inputClass}
                                placeholder="admin@cleanify.co.uk"
                            />
                        </div>
                    </SectionCard>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <SectionCard icon={LinkIcon} title="Social Links">
                        <div>
                            <label className={labelClass}>Instagram URL</label>
                            <input
                                type="url"
                                value={settings.instagramUrl}
                                onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                                className={inputClass}
                                placeholder="https://instagram.com/cleanify"
                            />
                        </div>
                    </SectionCard>

                    <SectionCard icon={Lock} title="Change Password">
                        <div>
                            <label className={labelClass}>Current Password *</label>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                className={inputClass}
                                placeholder="Enter current password"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>New Password *</label>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                className={inputClass}
                                placeholder="Enter new password (min 6 characters)"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Confirm New Password *</label>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                className={inputClass}
                                placeholder="Confirm new password"
                            />
                        </div>
                        <button
                            onClick={handleChangePassword}
                            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Lock size={16} />
                            Change Password
                        </button>
                    </SectionCard>
                </div>
            </div>

            {/* Mobile Save Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:hidden z-10 shadow-lg">
                <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-xl font-semibold text-sm"
                >
                    <Save size={16} />
                    Save Settings
                </button>
            </div>
        </div>
    );
}
