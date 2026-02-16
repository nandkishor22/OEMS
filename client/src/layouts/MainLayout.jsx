
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen font-inter relative bg-[#0F172A] text-white overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">

            {/* 🌌 GLOBAL COSMIC BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Subtle Stardust Texture */}
                <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.15]"></div>

                {/* Global Blobs - REFINED (More subtle opacity and blur) */}
                <div className="absolute top-[-10%] left-[-10%] w-[900px] h-[900px] bg-orange-600/10 rounded-full blur-[100px] animate-pulse will-change-opacity"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-red-600/10 rounded-full blur-[100px] animate-pulse delay-1000 will-change-opacity"></div>

                {/* Extra deep accent for depth */}
                <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[150px] animate-float will-change-transform"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-24">
                    <Outlet />
                </main>
                <Footer />
            </div>

            <Toaster
                position="top-center"
                toastOptions={{
                    className: '!bg-slate-900/80 !backdrop-blur-xl !border !border-white/10 !text-white !shadow-2xl !rounded-2xl',
                    style: {
                        background: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(16px)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '16px',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)'
                    },
                    success: {
                        iconTheme: {
                            primary: '#f97316', // Orange-500
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444', // Red-500
                            secondary: '#fff',
                        },
                    }
                }}
            />
        </div>
    );
};

export default MainLayout;
