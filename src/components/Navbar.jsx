import React, { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [scrollDirection, setScrollDirection] = useState("up");
    const lastScrollY = useRef(0);
    
    const navItems = [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Portofolio", label: "Portofolio" },
        { href: "#Contact", label: "Contact" },
    ];

    // Enhanced smooth scrolling with easing
    const smoothScrollTo = (target, duration = 1200) => {
        const targetPosition = target.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        
        // Determine scroll direction with throttling
        if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
            setScrollDirection(currentScrollY > lastScrollY.current ? "down" : "up");
            lastScrollY.current = currentScrollY;
        }
        
        setScrolled(currentScrollY > 20);
        
        // Enhanced active section detection
        const sections = navItems.map(item => {
            const section = document.querySelector(item.href);
            if (section) {
                return {
                    id: item.href.replace("#", ""),
                    offset: section.offsetTop - 200,
                    height: section.offsetHeight
                };
            }
            return null;
        }).filter(Boolean);

        const currentPosition = currentScrollY + 200;
        const active = sections.find(section => 
            currentPosition >= section.offset && 
            currentPosition < section.offset + section.height
        );

        if (active && active.id !== activeSection) {
            setActiveSection(active.id);
        }
    }, [activeSection, navItems]);

    useEffect(() => {
        let rafId;
        const throttledHandleScroll = () => {
            rafId = requestAnimationFrame(handleScroll);
        };

        window.addEventListener("scroll", throttledHandleScroll, { passive: true });
        handleScroll();
        
        return () => {
            window.removeEventListener("scroll", throttledHandleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [handleScroll]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px'; // Prevent layout shift
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    const scrollToSection = useCallback((e, href) => {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            smoothScrollTo(section);
            setIsOpen(false);
        }
    }, []);

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-700 ease-out ${
                scrollDirection === "down" && scrolled ? "transform -translate-y-full" : "transform translate-y-0"
            } ${
                isOpen
                    ? "bg-[#030014]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
                    : scrolled
                    ? "bg-[#030014]/30 backdrop-blur-xl border-b border-white/5 shadow-lg"
                    : "bg-transparent"
            }`}
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-[10%]">
                <div className="flex items-center justify-between h-16">
                    {/* Logo with enhanced animation */}
                    <div className="flex-shrink-0">
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
                        >
                            Kabir singh
                        </a>
                    </div>
        
                    {/* Enhanced Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-8 flex items-center space-x-8">
                            {navItems.map((item, index) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className="group relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-white/5"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <span
                                        className={`relative z-10 transition-all duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold scale-105"
                                                : "text-[#e2d3fd] group-hover:text-white group-hover:scale-105"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                    <span
                                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transform origin-left transition-all duration-500 rounded-full ${
                                            activeSection === item.href.substring(1)
                                                ? "scale-x-100 opacity-100"
                                                : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                                        }`}
                                    />
                                    {/* Hover glow effect */}
                                    <span
                                        className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 opacity-100"
                                                : "bg-gradient-to-r from-[#6366f1]/5 to-[#a855f7]/5"
                                        }`}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
        
                    {/* Enhanced Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`relative p-3 rounded-xl text-[#e2d3fd] hover:text-white transition-all duration-300 ease-out transform hover:scale-110 ${
                                isOpen 
                                    ? "rotate-180 scale-110 bg-white/10 backdrop-blur-md" 
                                    : "rotate-0 scale-100 hover:bg-white/5"
                            }`}
                        >
                            <div className="relative z-10">
                                {isOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </div>
                            {/* Animated background for button */}
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 transition-opacity duration-300 ${
                                isOpen ? "opacity-100" : "opacity-0"
                            }`} />
                        </button>
                    </div>
                </div>
            </div>
        
            {/* Enhanced Glassmorphic Mobile Menu Overlay */}
            <div
                className={`md:hidden fixed inset-0 z-40 transition-all duration-500 ease-out ${
                    isOpen
                        ? "opacity-100 backdrop-blur-2xl"
                        : "opacity-0 backdrop-blur-0 pointer-events-none"
                }`}
                style={{ top: "64px" }}
            >
                {/* Glassmorphic background with animated gradient */}
                <div className={`absolute inset-0 transition-all duration-700 ${
                    isOpen 
                        ? "bg-gradient-to-br from-[#030014]/95 via-[#1a0b2e]/90 to-[#030014]/95" 
                        : "bg-transparent"
                }`}>
                    {/* Animated gradient orbs for glassmorphism effect */}
                    <div className={`absolute top-20 left-10 w-32 h-32 rounded-full transition-all duration-1000 ${
                        isOpen ? "bg-[#6366f1]/20 blur-xl scale-100" : "bg-[#6366f1]/0 blur-0 scale-0"
                    }`} />
                    <div className={`absolute top-40 right-10 w-24 h-24 rounded-full transition-all duration-1000 delay-200 ${
                        isOpen ? "bg-[#a855f7]/20 blur-xl scale-100" : "bg-[#a855f7]/0 blur-0 scale-0"
                    }`} />
                    <div className={`absolute bottom-32 left-1/2 w-20 h-20 rounded-full transition-all duration-1000 delay-400 ${
                        isOpen ? "bg-[#8b5cf6]/20 blur-xl scale-100" : "bg-[#8b5cf6]/0 blur-0 scale-0"
                    }`} />
                </div>
                
                {/* Enhanced menu content */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Menu items container with glassmorphic card */}
                    <div className={`m-6 p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl transition-all duration-700 ${
                        isOpen ? "transform translate-y-0 opacity-100" : "transform -translate-y-10 opacity-0"
                    }`}>
                        <div className="space-y-2">
                            {navItems.map((item, index) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className={`group block px-6 py-4 text-lg font-medium rounded-xl transition-all duration-500 ease-out hover:bg-white/10 hover:backdrop-blur-md hover:scale-105 hover:shadow-lg ${
                                        activeSection === item.href.substring(1)
                                            ? "bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 border border-white/20 shadow-lg"
                                            : "hover:border hover:border-white/10"
                                    }`}
                                    style={{
                                        transitionDelay: `${index * 150}ms`,
                                        transform: isOpen ? "translateX(0) scale(1)" : "translateX(50px) scale(0.95)",
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                >
                                    <span
                                        className={`relative flex items-center justify-between transition-all duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                                : "text-[#e2d3fd] group-hover:text-white"
                                        }`}
                                    >
                                        {item.label}
                                        {/* Active indicator */}
                                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] scale-100"
                                                : "bg-white/20 scale-0 group-hover:scale-100"
                                        }`} />
                                    </span>
                                    {/* Animated underline */}
                                    <div className={`h-0.5 mt-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] transition-all duration-500 ${
                                        activeSection === item.href.substring(1)
                                            ? "w-full opacity-100"
                                            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"
                                    }`} />
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    {/* Additional glassmorphic decorative element */}
                    <div className={`mx-6 mb-6 p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-700 delay-300 ${
                        isOpen ? "transform translate-y-0 opacity-100" : "transform translate-y-10 opacity-0"
                    }`}>
                        <p className="text-center text-sm text-gray-400">
                            Swipe up to close menu
                        </p>
                    </div>
                </div>
            </div>
        </nav>
    
    );
};

export default Navbar;