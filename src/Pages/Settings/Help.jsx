import React from 'react';

function Help() {
  const helpItems = [
    { icon: "fa-rocket", title: "Getting Started", desc: "New to our platform? Explore our guides and tutorials to navigate and use our services effectively.", color: "#1877F2" },
    { icon: "fa-user-gear", title: "Account Management", desc: "Learn how to create, update, or delete your account. Our support team is always here to help.", color: "#7c3aed" },
    { icon: "fa-wrench", title: "Troubleshooting", desc: "Facing technical issues? Check our FAQ section or contact support for immediate assistance.", color: "#f59e0b" },
    { icon: "fa-headset", title: "Contact Support", desc: "Reach out via email or live chat. We are available 24/7 to assist you.", color: "#22c55e" },
    { icon: "fa-circle-question", title: "FAQs", desc: "Find answers to the most commonly asked questions about our platform, services, and policies.", color: "#ef4444" },
  ];

  return (
    <div className="max-w-2xl mx-auto animate-slideUp">
      <div className="mb-6 md:mt-0 mt-4">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Resources</p>
        <p className="text-2xl font-bold text-gray-800 section-title">Help & Support</p>
      </div>
      <div className="flex flex-col gap-3">
        {helpItems.map((item, i) => (
          <div key={i} className="flex items-start gap-4 rounded-2xl p-4 transition-all hover:scale-[1.01]"
            style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 12px rgba(24,119,242,0.06)", animationDelay: `${i * 60}ms` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${item.color}18` }}>
              <i className={`fa-solid ${item.icon} text-sm`} style={{ color: item.color }}></i>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
              <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Help;
