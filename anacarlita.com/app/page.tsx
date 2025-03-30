import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.homepage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Exquisite Catering & Unforgettable Events</h1>
          <p>Creating moments that last a lifetime with premium catering and expert event planning services</p>
          <div className={styles.heroButtons}>
            <Link href="/contact" className={`${styles.button} ${styles.primary}`}>
              Get a Quote
            </Link>
            <Link href="/services" className={`${styles.button} ${styles.secondary}`}>
              Our Services
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Services */}
      <section className={styles.services}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Services</h2>
            <p>We offer comprehensive catering and event planning services to make your special day perfect</p>
          </div>
          
          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="48" height="48">
                  <path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"/>
                </svg>
              </div>
              <h3>Catering Services</h3>
              <p>From intimate gatherings to grand celebrations, our culinary team creates personalized menus with the finest ingredients.</p>
              <Link href="/services/catering" className={styles.serviceLink}>Learn More</Link>
            </div>
            
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="48" height="48">
                  <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336z"/>
                </svg>
              </div>
              <h3>Event Planning</h3>
              <p>Our professional event planners handle every detail, from venue selection to floral arrangements and entertainment.</p>
              <Link href="/services/event-planning" className={styles.serviceLink}>Learn More</Link>
            </div>
            
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="48" height="48">
                  <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/>
                </svg>
              </div>
              <h3>Decoration & Design</h3>
              <p>Transform any space with our custom decorations and design services that perfectly match your event's theme.</p>
              <Link href="/services/decorations" className={styles.serviceLink}>Learn More</Link>
            </div>
            
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="48" height="48">
                  <path d="M323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5l-20.9 16.2L512 316.8V128h-.7l-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2zm22.8 124.4l-51.7 40.2C263 274.4 217.3 268 193.7 235.6c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c-11.6-4.9-24.1-7.4-36.8-7.4C234 64 215.7 69.6 200 80l-72 48V352h28.2l91.4 83.4c19.6 17.9 49.9 16.5 67.8-3.1c5.5-6.1 9.2-13.2 11.1-20.6l17 15.6c19.5 17.9 49.9 16.6 67.8-2.9c4.5-4.9 7.8-10.6 9.9-16.5c19.4 13 45.8 10.3 62.1-7.5c17.9-19.5 16.6-49.9-2.9-67.8l-134.2-123zM16 128c-8.8 0-16 7.2-16 16V352c0 17.7 14.3 32 32 32H64c17.7 0 32-14.3 32-32V128H16zM48 320a16 16 0 1 1 0 32 16 16 0 1 1 0-32zM544 128V352c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V144c0-8.8-7.2-16-16-16H544zm32 208a16 16 0 1 1 32 0 16 16 0 1 1 -32 0z"/>
                </svg>
              </div>
              <h3>Rental Equipment</h3>
              <p>Enhance your event with our premium rental equipment, from elegant tableware to furniture and decor items.</p>
              <Link href="/rentals" className={styles.serviceLink}>View Rentals</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className={styles.about}>
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
              <h2>About AnaCarLita</h2>
              <p>With over 10 years of experience in the industry, AnaCarLita has established itself as a premier catering and event planning service provider. Our team of dedicated professionals is committed to exceeding your expectations and creating memorable experiences.</p>
              <p>We pride ourselves on our attention to detail, personalized service, and exceptional cuisine. From intimate gatherings to large celebrations, we handle events of all sizes with the same level of dedication and excellence.</p>
              <Link href="/about" className={`${styles.button} ${styles.outlined}`}>
                Learn More About Us
              </Link>
            </div>
            <div className={styles.aboutImageContainer}>
              <div className={styles.aboutImage}>
                {/* Image placeholder - would be replaced with actual image */}
                <div className={styles.imagePlaceholder}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Event Types */}
      <section className={styles.eventTypes}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Events We Cater</h2>
            <p>We specialize in creating unforgettable experiences for a variety of events</p>
          </div>
          
          <div className={styles.eventGrid}>
            <div className={styles.eventCard}>
              <div className={styles.eventImageContainer}>
                <div className={styles.imagePlaceholder}></div>
              </div>
              <h3>Weddings</h3>
              <p>Make your special day truly magical with our comprehensive wedding planning and catering services.</p>
            </div>
            
            <div className={styles.eventCard}>
              <div className={styles.eventImageContainer}>
                <div className={styles.imagePlaceholder}></div>
              </div>
              <h3>Corporate Events</h3>
              <p>Impress your clients and colleagues with professionally catered meetings and corporate functions.</p>
            </div>
            
            <div className={styles.eventCard}>
              <div className={styles.eventImageContainer}>
                <div className={styles.imagePlaceholder}></div>
              </div>
              <h3>Social Gatherings</h3>
              <p>From birthday parties to anniversaries, we help you celebrate life's special moments.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>What Our Clients Say</h2>
            <p>We take pride in our client satisfaction and the positive feedback we receive</p>
          </div>
          
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialQuote}>"</div>
              <p>AnaCarLita exceeded all our expectations for our wedding. The food was exquisite, and the service was impeccable. They handled every detail with professionalism and care.</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}></div>
                <div>
                  <h4>Sarah & Michael</h4>
                  <p>Wedding, June 2023</p>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialQuote}>"</div>
              <p>We've used AnaCarLita for several corporate events, and they consistently deliver outstanding service. Their attention to detail and flexibility make them our go-to caterer.</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}></div>
                <div>
                  <h4>Jennifer T.</h4>
                  <p>Corporate Event Planner</p>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialQuote}>"</div>
              <p>The rental equipment from AnaCarLita transformed our backyard into an elegant venue for our anniversary party. Their items are high-quality and well-maintained.</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}></div>
                <div>
                  <h4>Robert & Lisa</h4>
                  <p>Anniversary Party, May 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Plan Your Next Event?</h2>
            <p>Let us help you create an unforgettable experience for you and your guests</p>
            <div className={styles.ctaButtons}>
              <Link href="/contact" className={`${styles.button} ${styles.primary}`}>
                Get Started Today
              </Link>
              <Link href="/gallery" className={`${styles.button} ${styles.secondary}`}>
                View Our Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 