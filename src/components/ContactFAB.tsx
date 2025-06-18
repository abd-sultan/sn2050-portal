'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations, useLocale } from 'next-intl';
import { Label } from '@/components/ui/label';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [step, setStep] = useState<'form' | 'confirmation' | 'sending'>('form');
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const locale = useLocale();

  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' | null }>({ 
    show: false, 
    message: '', 
    type: null 
  });

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setStep('form');
      setFormData({ name: '', email: '', message: '' });
    }
  };
  
  // Fonction pour afficher des notifications
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    
    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setNotification({ show: false, message: '', type: null });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = locale === 'fr' ? 'Le nom est requis' : 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = locale === 'fr' ? 'L\'email est requis' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = locale === 'fr' ? 'Email invalide' : 'Invalid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = locale === 'fr' ? 'Le message est requis' : 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStep('sending');
    
    try {
      // Envoyer le message à l'API
      const response = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          type: 'contact'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setStep('confirmation');
      // Notification de succès
      showNotification(
        locale === 'fr' 
          ? 'Message envoyé avec succès !' 
          : 'Message sent successfully!',
        'success'
      );
      
    } catch (error) {
      console.error('Error sending message:', error);
      setStep('form');
      // Notification d'échec
      showNotification(
        locale === 'fr' 
          ? 'Erreur lors de l\'envoi du message. Veuillez réessayer.' 
          : 'Error sending message. Please try again.',
        'error'
      );
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 px-6 py-4 rounded-md shadow-lg flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
          <p>{notification.message}</p>
        </div>
      )}
      {/* FAB Button */}
      <Button
        onClick={toggleChat}
        className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageSquare size={24} />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform">
          {/* Chat Header */}
          <div className="bg-blue-600 p-4 text-white font-bold flex justify-between items-center">
            <span>
              {locale === 'fr' ? 'Contactez-nous' : 'Contact us'}
            </span>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    {locale === 'fr' ? 'Nom' : 'Name'}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={locale === 'fr' ? 'Votre nom' : 'Your name'}
                    className={`bg-gray-800 border-gray-700 text-white ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={locale === 'fr' ? 'Votre email' : 'Your email'}
                    className={`bg-gray-800 border-gray-700 text-white ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">
                    {locale === 'fr' ? 'Message' : 'Message'}
                  </Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={locale === 'fr' ? 'Votre message' : 'Your message'}
                    className={`w-full min-h-[100px] rounded-md px-3 py-2 text-white bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.message ? 'border-red-500' : ''}`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {locale === 'fr' ? 'Envoyer' : 'Send'} <Send size={16} className="ml-2" />
                </Button>
              </form>
            )}

            {step === 'sending' && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
                <p className="text-white text-center">
                  {locale === 'fr' ? 'Envoi en cours...' : 'Sending...'}
                </p>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto bg-blue-500/20 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                  <Send size={24} className="text-blue-500" />
                </div>
                <h3 className="text-white text-xl font-semibold">
                  {locale === 'fr' ? 'Message envoyé !' : 'Message sent!'}
                </h3>
                <p className="text-gray-300">
                  {locale === 'fr'
                    ? 'Merci pour votre message. Nous vous répondrons dans les meilleurs délais.'
                    : 'Thank you for your message. We will get back to you as soon as possible.'}
                </p>
                <Button 
                  onClick={toggleChat}
                  variant="outline" 
                  className="mt-4 border-gray-600 text-white hover:bg-gray-800"
                >
                  {locale === 'fr' ? 'Fermer' : 'Close'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
