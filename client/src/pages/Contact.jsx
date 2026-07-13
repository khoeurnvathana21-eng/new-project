// ============================================================
// BootZone Client - Contact Page
// File: client/src/pages/Contact.jsx
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiChevronDown
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { contactService } from '../services/shopService.js';

const faqs = [
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 3-5 business days within the US. Expedited options (2-day, overnight) are available at checkout. International orders typically arrive in 7-14 business days depending on destination.',
  },
  {
    q: 'Are your boots 100% authentic?',
    a: 'Absolutely. We are authorized retailers for Nike, Adidas, Puma, and Mizuno. Every pair is sourced directly from official distributors and comes with original packaging and authenticity guarantees.',
  },
  {
    q: 'What is your return policy?',
    a: "We offer 30-day returns on unworn boots in original packaging. Initiate a return from your account dashboard, and we'll send a prepaid return label for orders within the US.",
  },
  {
    q: 'How do I find the right size?',
    a: "Each product page has a size guide specific to the brand. If you're between sizes, we generally recommend sizing up for leather boots (which mold to your foot) and staying true to size for synthetic boots.",
  },
  {
    q: 'Do you offer team or bulk discounts?',
    a: 'Yes! For team orders of 10+ pairs, contact us at teams@bootzone.com for special pricing and customization options including name and number printing.',
  },
];

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await contactService.submit(data);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      reset();
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-ink-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 py-20">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1920&q=80"
            alt="Contact"
            className="h-full w-full object-contain opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 to-ink-950/70" />
        </div>
        <div className="container-bz relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-flame-500/30 bg-flame-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-flame-400">
              Get In Touch
            </span>
            <h1 className="mt-4 font-display text-5xl tracking-tight text-white sm:text-6xl">
              We're Here<br />To Help
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-300">
              Questions about sizing, shipping, or just want to talk boots? Our team
              of players is ready to help you find the perfect pair.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="container-bz -mt-12 relative z-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FiMail, label: 'Email Us', value: 'khoeurnvathana21@gmail.com', sub: '24/7 response' },
            { icon: FiPhone, label: 'Call Us', value: '+855 96 3953 596', sub: 'Mon-Fri, 9am-6pm PST' },
            { icon: FiMapPin, label: 'Visit Us', value: 'Phnom Penh', sub: 'Cambodia' },
            { icon: FiClock, label: 'Business Hours', value: 'Mon - Sat', sub: '9:00 AM - 8:00 PM' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card-bz p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-50 text-flame-600 dark:bg-flame-900/20">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">{item.label}</div>
                <div className="mt-1 text-sm font-bold text-ink-900 dark:text-white">{item.value}</div>
                <div className="text-xs text-ink-500 dark:text-ink-400">{item.sub}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Form + Map */}
      <section className="container-bz py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-flame-600">Send a Message</span>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-ink-900 dark:text-white">
              Let's talk boots.
            </h2>
            <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-bz">Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Your name"
                    className="input-bz"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label-bz">Phone</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="Optional"
                    className="input-bz"
                  />
                </div>
              </div>

              <div>
                <label className="label-bz">Email</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                  })}
                  placeholder="you@example.com"
                  className="input-bz"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="label-bz">Subject</label>
                <input
                  type="text"
                  {...register('subject')}
                  placeholder="How can we help?"
                  className="input-bz"
                />
              </div>

              <div>
                <label className="label-bz">Message</label>
                <textarea
                  rows={5}
                  {...register('message', { required: 'Message is required' })}
                  placeholder="Tell us more..."
                  className="input-bz resize-none"
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending...' : 'Send Message'}
                {!loading && <FiSend className="h-4 w-4" />}
              </button>
            </form>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-3xl"
          >
            <iframe
              title="BootZone location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=104.88%2C11.53%2C104.96%2C11.59&layer=mapnik"
              className="h-full min-h-[500px] w-full border-0"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-ink-50 py-20 dark:bg-ink-900">
        <div className="container-bz">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-flame-600">FAQ</span>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-ink-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-ink-500 dark:text-ink-400">
              Quick answers to the questions we hear most. Can't find what you need?
              Reach out using the form above.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="overflow-hidden rounded-2xl border border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-950"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-sm font-semibold text-ink-900 dark:text-white">{faq.q}</span>
                  <FiChevronDown
                    className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
