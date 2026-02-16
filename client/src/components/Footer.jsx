import { FaHeart, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
    const SOCIALS = [
        { icon: FaTwitter, href: "#", color: "hover:text-blue-400" },
        { icon: FaFacebook, href: "#", color: "hover:text-blue-600" },
        { icon: FaInstagram, href: "#", color: "hover:text-pink-600" },
        { icon: FaLinkedin, href: "#", color: "hover:text-blue-700" },
        { icon: FaGithub, href: "#", color: "hover:text-white" },
        { icon: FaDiscord, href: "#", color: "hover:text-indigo-500" }
    ];

    const LINKS = [
        { title: "Product", items: ["Features", "Pricing", "Case Studies", "Reviews", "Updates"] },
        { title: "Company", items: ["About", "Careers", "Press", "News", "Contact"] },
        { title: "Resources", items: ["Blog", "Newsletter", "Events", "Help Center", "Tutorials"] },
        { title: "Legal", items: ["Terms", "Privacy", "Cookies", "Licenses", "Settings"] }
    ];

    return (
        <footer className="relative !bg-transparent pt-20 pb-10 overflow-hidden border-t border-white/5">
            {/* Dark Glass Overlay */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md z-0 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6 text-white group cursor-default">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
                                E
                            </div>
                            <span className="text-2xl font-bold font-heading tracking-tight">
                                Event<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">ify</span>
                            </span>
                        </div>
                        <p className="text-slate-400 mb-8 max-w-sm text-base leading-relaxed">
                            The next-generation platform for discovering and managing unforgettable experiences. Join the community today.
                        </p>

                        {/* Newsletter Input */}
                        <div className="relative max-w-sm group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-4 pr-32 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                            />
                            <button className="absolute right-1 top-1 bottom-1 bg-orange-600 hover:bg-orange-500 text-white px-4 rounded-lg text-sm font-semibold transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>

                    {/* Links Columns */}
                    {LINKS.map((section, idx) => (
                        <div key={idx} className="col-span-1">
                            <h3 className="text-white font-bold mb-6 font-heading text-lg">{section.title}</h3>
                            <ul className="space-y-4">
                                {section.items.map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors text-sm font-medium block transform hover:translate-x-1 duration-200">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} Eventify Inc. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        {SOCIALS.map((social, idx) => (
                            <motion.a
                                key={idx}
                                href={social.href}
                                whileHover={{ y: -3 }}
                                className={`text-slate-400 transition-colors text-xl ${social.color}`}
                            >
                                <social.icon />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
