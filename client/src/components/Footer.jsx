// ============================================================
// BootZone Client - Footer
// File: client/src/components/Footer.jsx
// Premium multi-column footer with newsletter
// ============================================================

import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-ink-950 text-ink-300">
      {/* Top section */}
      <div className="container-bz py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-display text-4xl tracking-tight text-white">
                Boot<span className="text-flame-500">Zone</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
              Premium football boots for serious players. We curate only the finest
              boots from Nike, Adidas, Puma and Mizuno — backed by authenticity and
              a love for the beautiful game.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-800 text-ink-300 transition-colors hover:bg-flame-600 hover:text-white"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="transition-colors hover:text-white">All Boots</Link></li>
              <li><Link to="/products?brand=nike" className="transition-colors hover:text-white">Nike</Link></li>
              <li><Link to="/products?brand=adidas" className="transition-colors hover:text-white">Adidas</Link></li>
              <li><Link to="/products?brand=puma" className="transition-colors hover:text-white">Puma</Link></li>
              <li><Link to="/products?brand=mizuno" className="transition-colors hover:text-white">Mizuno</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="transition-colors hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-white">Contact</Link></li>
              <li><a href="#" className="transition-colors hover:text-white">Careers</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Press</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Sustainability</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="transition-colors hover:text-white">Shipping</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Returns</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Size Guide</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Track Order</a></li>
              <li><a href="#" className="transition-colors hover:text-white">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Contact row */}
        <div className="mt-12 grid grid-cols-1 gap-4 border-t border-ink-800 pt-8 sm:grid-cols-3">
          <div className="flex items-center gap-3 text-sm">
            <FiMail className="h-5 w-5 text-flame-500" />
            <span>khoeurnvathana21@gmail.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FiPhone className="h-5 w-5 text-flame-500" />
            <span>+855 96 3953 596</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FiMapPin className="h-5 w-5 text-flame-500" />
            <span>Phnom Penh, Cambodia</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-800">
        <div className="container-bz flex flex-col items-center justify-between gap-4 py-6 text-xs text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} BootZone. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
