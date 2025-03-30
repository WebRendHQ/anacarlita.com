'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../../app/utils/firebase';
import { RentalItem } from '../types';
import Link from 'next/link';
import { formatCurrency } from '../../../app/utils/format';
import styles from './rentals.module.scss';

export default function RentalsPage() {
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Define categories
  const categories = [
    'all',
    'furniture',
    'tableware',
    'decorations',
    'linens',
    'lighting',
    'audiovisual',
    'tents'
  ];

  // Fetch rental items from Firestore
  useEffect(() => {
    const fetchRentalItems = async () => {
      try {
        setLoading(true);
        let rentalItemsQuery = collection(firestore, 'rentalItems');
        
        if (selectedCategory !== 'all') {
          rentalItemsQuery = query(
            rentalItemsQuery,
            where('category', '==', selectedCategory)
          );
        }
        
        const itemsSnapshot = await getDocs(rentalItemsQuery);
        const itemsList = itemsSnapshot.docs.map(doc => {
          const data = doc.data() as Omit<RentalItem, 'id'>;
          return {
            id: doc.id,
            ...data
          };
        });

        setRentalItems(itemsList);
      } catch (err) {
        console.error('Error fetching rental items:', err);
        setError('Failed to load rental items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRentalItems();
  }, [selectedCategory]);

  // Filter items by search term
  const filteredItems = rentalItems.filter(item => {
    return (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.rentalsPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Rental Equipment</h1>
          <p>Browse our premium rental equipment for your next event</p>
        </div>
        
        <div className={styles.filtersContainer}>
          <div className={styles.categories}>
            {categories.map(category => (
              <button
                key={category}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search rental items..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
        </div>
        
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading rental items...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className={styles.noItems}>
                <h2>No items found</h2>
                <p>
                  {searchTerm 
                    ? `No items match your search for "${searchTerm}".`
                    : `No items are available in the ${selectedCategory} category.`}
                </p>
                {searchTerm && (
                  <button 
                    className={styles.clearSearch}
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.rentalGrid}>
                {filteredItems.map(item => (
                  <Link 
                    key={item.id} 
                    href={`/rentals/${item.id}`}
                    className={styles.rentalCard}
                  >
                    <div className={styles.rentalImageContainer}>
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className={styles.rentalImage}
                        />
                      ) : (
                        <div className={styles.noImage}>
                          <span>No Image Available</span>
                        </div>
                      )}
                      <div className={styles.rentalPrice}>
                        {formatCurrency(item.pricePerDay)} / day
                      </div>
                    </div>
                    <div className={styles.rentalInfo}>
                      <h3>{item.title}</h3>
                      <p className={styles.rentalDescription}>
                        {item.description.length > 100
                          ? `${item.description.substring(0, 100)}...`
                          : item.description}
                      </p>
                      <div className={styles.rentalMeta}>
                        <span className={styles.rentalCategory}>
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                        <span className={styles.rentalLocation}>
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            <div className={styles.createListingContainer}>
              <h2>Have equipment to rent out?</h2>
              <p>
                If you have event equipment that you'd like to list for rental, you can create a 
                listing on our platform. Share your items with others and earn some extra income!
              </p>
              <Link href="/rentals/create" className={styles.createListingButton}>
                Create a Listing
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 