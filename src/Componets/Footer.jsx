import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";


const Footer = () => {
  const form = useRef();
  const recaptchaRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const sendEmail = async (e) => {
    e.preventDefault();
    const email = form.current.email.value;

    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const recaptchaToken = await recaptchaRef.current.executeAsync();
      if (!recaptchaToken) {
        toast.error("reCAPTCHA verification failed.");
        setIsSubmitting(false);
        return;
      }

      emailjs
        .sendForm("service_875ouap", "template_vukgtjb", form.current, {
          publicKey: "D-cn2juO2mzcrewiO",
        })
        .then(
          () => {
            toast.success("Email sent successfully!");
            form.current.reset();
            recaptchaRef.current.reset();
            setIsSubmitting(false);
          },
          (error) => {
            toast.error("Failed to send email. Try again.");
            console.error("EmailJS Error:", error);
            setIsSubmitting(false);
          }
        );
    } catch (err) {
      toast.error("Unexpected error occurred.");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { Icon: FaFacebook, link: "https://facebook.com", label: "Facebook" },
    { Icon: FaTwitter, link: "https://twitter.com", label: "Twitter" },
    { Icon: FaLinkedin, link: "https://linkedin.com", label: "LinkedIn" },
    { Icon: FaInstagram, link: "https://instagram.com", label: "Instagram" },
  ];

  const quickLinks = ["Home", "About", "Services", "Projects", "Contact"];

  return (
    <footer className="mt-12 text-white pt-12 pb-3"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d47c8 50%, #1877F2 100%)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">

          {/* Company Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 18h18v2.5H3V18z" fill="white" />
                  <path d="M12 3C7.58 3 4 6.8 4 11.5V18h16v-6.5C20 6.8 16.42 3 12 3z" fill="white" fillOpacity="0.9" />
                  <path d="M10.5 5v8M13.5 5v8" stroke="rgba(13,71,200,0.5)" strokeWidth="1.2" strokeLinecap="round" />
                  <rect x="9" y="2" width="6" height="2.5" rx="1.25" fill="white" />
                </svg>
              </div>
              <h2 className="text-2xl font-black tracking-tight">Constructo</h2>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Constructo helps users easily find skilled workers for home and building projects.
              From construction to repairs, connect with trusted professionals near you.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, link, label }, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <Icon className="text-base text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-blue-200 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-400 group-hover:bg-white transition-colors" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-bold mb-4 text-white">Contact Us</h3>
            <div className="space-y-3 text-blue-200 text-sm">
              <div className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="mt-0.5 text-blue-300 flex-shrink-0" />
                <span>123 Construction Ave, Build City BC 12345</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaEnvelope className="text-blue-300 flex-shrink-0" />
                <a href="mailto:info@constructo.com" className="hover:text-white transition-colors">info@constructo.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-blue-300 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">+1 (234) 567-890</a>
              </div>
              <div className="flex items-center gap-2.5">
                <FaClock className="text-blue-300 flex-shrink-0" />
                <span>Mon–Fri: 8 AM – 6 PM</span>
              </div>
            </div>
          </div>

          {/* Email Form */}
          <div>
            <h3 className="text-base font-bold mb-4 text-white">Get in Touch</h3>
            <form
              ref={form}
              onSubmit={sendEmail}
              className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full p-2.5 rounded-lg text-white placeholder-blue-300 text-sm focus:outline-none input-glow"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1">Subject</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Your Subject"
                    className="w-full p-2.5 rounded-lg text-white placeholder-blue-300 text-sm focus:outline-none input-glow"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1">Message</label>
                <textarea
                  name="message"
                  rows="3"
                  placeholder="Your message..."
                  className="w-full p-2.5 rounded-lg text-white placeholder-blue-300 text-sm focus:outline-none input-glow resize-none"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex justify-center items-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.92)", color: "#1877F2" }}
              >
                {isSubmitting ? "Sending..." : "Send"} <FaPaperPlane className="text-xs" />
              </button>
            </form>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-10 pt-4 flex flex-col md:flex-row items-center justify-between gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <p className="text-blue-300 text-xs">© {new Date().getFullYear()} Constructo. All rights reserved.</p>
          <p className="text-blue-400 text-xs">Built with ❤️ for workers & users</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
