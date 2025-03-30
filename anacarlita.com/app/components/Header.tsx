'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../app/context/AuthContext';
import styles from './Header.module.scss';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logOut } = useAuth();

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      closeMobileMenu();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Check if link is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" onClick={closeMobileMenu}>
            <h1>AnaCarLita</h1>
            <span>Catering & Events</span>
          </Link>
        </div>

        <button 
          className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.open : ''}`}>
          <ul>
            <li>
              <Link
                href="/"
                className={isActive('/') ? styles.active : ''}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className={isActive('/services') ? styles.active : ''}
                onClick={closeMobileMenu}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className={isActive('/events') ? styles.active : ''}
                onClick={closeMobileMenu}
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                href="/rentals"
                className={isActive('/rentals') ? styles.active : ''}
                onClick={closeMobileMenu}
              >
                Rentals
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                className={isActive('/gallery') ? styles.active : ''}
                onClick={closeMobileMenu}
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={isActive('/contact') ? styles.active : ''}
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    className={isActive('/profile') ? styles.active : ''}
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className={styles.authButton}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className={styles.authButton}
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 