"use client";
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [clickedButton, setClickedButton] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hide, setHide] = useState(true);
  const boxRef = useRef(null);
  const { isAuthenticated, userName,userAvatar, userId } = useSelector((state) => state.user);
  const router = useRouter();

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHide(!hide);
  };

  const handleClick = (button) => {
    if (button === 'Home') {
      router.push('/');
    }
    setClickedButton(button);
    setTimeout(() => {
      setClickedButton(null);
    }, 300);
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' }
  ];

  const mobileNavbar = (
    <div className="relative md:hidden">
      <div
        ref={boxRef}
        className="popup-box bg-red-500 rounded-xl flex items-center overflow-hidden"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 0,
          width: 0,
          height: 0
        }}
      >
        {!hide && (
          <ul className="flex  gap-4 items-center phone-items ml-4">
            <li className="phone-item text-white"><Link href="/">Home</Link></li>
            <li className="phone-item text-white"><Link href="/about">About</Link></li>
            <li className="phone-item text-white"><Link href="/services">Services</Link></li>
            <li className="phone-item text-white"><Link href="/contact">Contact</Link></li>
            {!isAuthenticated && (
              <Link href="/login">
                <button className="bg-blue-500 phone-item text-white px-6 py-4 rounded-md font-bold shadow-md hover:shadow-lg transition-shadow">
                Login
                </button>
              </Link>
            )}
          </ul>
        )}
      </div>

      <button
        className="md:hidden z-50 bg-white relative rounded-md p-2 text-black toggle-button border-2 border-yellow-200"
        onClick={handleToggle}
      >
        {isOpen ? <X className="text-black z-50" /> : <Menu className="text-black z-50" />}
      </button>
    </div>
  );

  const desktopNavbar = (
    <div className="nav-items hidden md:block z-50  rounded-md p-2 px-6 text-black">
      <ul className="flex justify-center items-center gap-6">
        {navItems.map(({ label, href }, index) => (
          <Link href={href} key={index}>
            <li
              onClick={() => handleClick(label)}
              className={`bg-red-500 p-2 rounded-lg shadow-xl transform 
                ${clickedButton === label ? 'translate-y-1 shadow-2xl' : 'hover:scale-110 hover:shadow-2xl'} 
                cursor-pointer`}
            >
              {label}
            </li>
          </Link>
        ))}
        {!isAuthenticated && (
          <Link href="/login">
            <button className="bg-blue-500 text-white px-6 py-4 rounded-md font-bold shadow-md hover:shadow-lg transition-shadow">
              Login
            </button>
          </Link>
        )}
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <span className="text-white">Hi, {userName || 'User'}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
              <Link href={`/user/${userId}`}>
                <img 
                  src={userAvatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
          </div>
        )}
      </ul>
    </div>
  );

  useEffect(() => {
    let ctx;
    if (!isMobile) {
      ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.from(".nav-items", {
          opacity: 0,
          y: -50,
          duration: 1,
          ease: "power2.out",
        })
        .from(".nav-items li", {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        });

        // ScrollTrigger.create({
        //   trigger: "body",
        //   start: "top top",
        //   end: "bottom bottom",
        //   onEnter: () => {
        //     gsap.to(".nav-items", {
        //       position: "fixed",
        //       bottom: "10px",
        //       left: "50%",
        //       xPercent: -50,
        //       duration: 0.5,
        //       ease: "power2.inOut"
        //     });
        //   },
        //   onLeaveBack: () => {
        //     gsap.to(".nav-items", {
        //       position: "static",
        //       xPercent: 0,
        //       duration: 0.5,
        //       ease: "power2.inOut",
        //       clearProps: "all"
        //     });
        //   }
        // });
      });
    }
    return () => ctx && ctx.revert();
  }, [isMobile]);

  useEffect(() => {
    let ctx;
    if (isMobile) {
      ctx = gsap.context(() => {
        if (isOpen) {
          gsap.timeline()
            .to(".toggle-button", {
              x: 25,
              duration: 0.3,
              ease: "power2.out",
            })
            .to(boxRef.current, {
              width: "400px",
              height: "90px",
              x: 25,
              duration: 0.3,
              ease: "power2.out",
            })
            .to(".phone-items .phone-item", {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.3,
              ease: "power2.out",
            });
        } else {
          gsap.timeline()
            .to(".phone-items .phone-item", {
              y: -20,
              opacity: 0,
              stagger: 0.1,
              duration: 0.2,
              ease: "power2.in",
            })
            .to(boxRef.current, {
              width: 0,
              height: 0,
              x: 0,
              duration: 0.3,
              ease: "power2.in",
            })
            .to(".toggle-button", {
              x: 0,
              duration: 0.3,
              ease: "power2.in",
            });
        }
      });
    }
    return () => ctx && ctx.revert();
  }, [isOpen, isMobile]);

  return (
    <div className="z-50 relative bg-gray-900">
      <nav className="flex justify-between items-center mx-[10%] py-2 border-b border-white/20">
        <div className="nav-logo">
          <Link href="/">
            <h1 className="font-bold text-2xl text-white">logo</h1>
          </Link>
        </div>

        {mobileNavbar}
        {desktopNavbar}
      </nav>
    </div>
  );
};

export default Navbar;
