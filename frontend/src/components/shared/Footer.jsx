import { Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      className="text-gray-500 bg-white border-t border-purple-50 mt-16"
      style={{
        boxShadow: '0 -8px 30px rgba(99, 102, 241, 0.04)',
      }}
    >
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Panchayat<span className="text-[#8B5CF6]">.</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 font-medium">
              Connecting communities with trusted local professionals for every service need — reliable, fast, and verified.
            </p>
            <div className="flex gap-3 pt-1">
              {[
                { Icon: Globe, label: 'Website' },
                { Icon: Share2, label: 'Share' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 hover:-translate-y-1 bg-purple-50 text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { label: 'Home', href: '/' },
                { label: 'Browse Services', href: '/services' },
                { label: 'Top Providers', href: '/providers' },
                { label: 'Join as a Professional', href: '/register' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-gray-500 hover:text-[#8B5CF6] hover:pl-1 transition-all duration-200 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-5">Legal</h3>
            <ul className="space-y-3 text-sm font-medium">
              {['Terms of Service', 'Privacy Policy', 'Refund Policy', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-[#8B5CF6] hover:pl-1 transition-all duration-200 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-5">Contact Us</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-purple-50 border border-purple-100 text-[#8B5CF6]">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-gray-500 leading-relaxed">123 Business Park, Mumbai, 400051</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-purple-50 border border-purple-100 text-[#8B5CF6]">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="tel:+919876543210" className="text-gray-500 hover:text-[#8B5CF6] transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-purple-50 border border-purple-100 text-[#8B5CF6]">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:support@panchayathub.com" className="text-gray-500 hover:text-[#8B5CF6] transition-colors">
                  support@panchayathub.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-50 bg-[#FAFAFF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-medium text-gray-400">
          <p>© {new Date().getFullYear()} Panchayat Services. All rights reserved.</p>
          <p>
            Built with <span className="text-[#8B5CF6]">♥</span> for local communities
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
