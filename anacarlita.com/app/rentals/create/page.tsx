'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../../../app/utils/firebase';
import { useAuth } from '../../context/AuthContext';
import { createStripeProduct } from '../../../../app/utils/stripe';
import { RentalListingFormData } from '../../types';
import styles from './create.module.scss';

// Form validation schema
const rentalSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  pricePerDay: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0, 
    { message: 'Price must be a positive number' }
  ),
  category: z.string().min(1, { message: 'Please select a category' }),
  location: z.string().min(1, { message: 'Location is required' }),
  availabilityStart: z.string().min(1, { message: 'Start date is required' }),
  availabilityEnd: z.string().min(1, { message: 'End date is required' }),
  features: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof rentalSchema>;

export default function CreateRentalPage() {
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Define categories
  const categories = [
    'furniture',
    'tableware',
    'decorations',
    'linens',
    'lighting',
    'audiovisual',
    'tents'
  ];

  // React Hook Form setup
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      features: []
    }
  });

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      
      // Only allow up to 5 images
      if (images.length + newImages.length > 5) {
        alert('You can upload a maximum of 5 images.');
        return;
      }
      
      setImages(prev => [...prev, ...newImages]);
    }
  };

  // Remove image from selection
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Add feature to the list
  const addFeature = () => {
    if (featureInput.trim() && features.length < 10) {
      setFeatures(prev => [...prev, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  // Remove feature from the list
  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  // Handle feature input keypress (add on Enter)
  const handleFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  // Upload images to Firebase Storage
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    
    const imageUrls: string[] = [];
    const uploadPromises = files.map(async (file, index) => {
      const storageRef = ref(storage, `rental-images/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadTask.ref);
      
      // Update progress
      setUploadProgress(Math.round(((index + 1) / files.length) * 100));
      
      return downloadUrl;
    });
    
    return Promise.all(uploadPromises);
  };

  // Form submission handler
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) {
      setSubmissionError('You must be logged in to create a listing');
      return;
    }
    
    if (images.length === 0) {
      setSubmissionError('Please upload at least one image');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmissionError('');
      
      // Upload images to Firebase Storage
      const imageUrls = await uploadImages(images);
      
      // Create a Stripe product
      const { productId, priceId } = await createStripeProduct(
        data.title,
        data.description,
        Number(data.pricePerDay),
        imageUrls[0] // Use the first image as the product image
      );
      
      // Create rental listing in Firestore
      const rentalData = {
        userId: user.id,
        title: data.title,
        description: data.description,
        pricePerDay: Number(data.pricePerDay),
        images: imageUrls,
        category: data.category,
        location: data.location,
        availability: {
          start: new Date(data.availabilityStart).toISOString(),
          end: new Date(data.availabilityEnd).toISOString(),
        },
        features: features,
        status: 'available',
        stripeProductId: productId,
        stripePriceId: priceId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const rentalRef = await addDoc(collection(firestore, 'rentalItems'), rentalData);
      
      // Reset form and state
      reset();
      setImages([]);
      setFeatures([]);
      setUploadProgress(0);
      
      // Redirect to the new rental listing page
      router.push(`/rentals/${rentalRef.id}`);
    } catch (err) {
      console.error('Error creating rental listing:', err);
      setSubmissionError('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the auth is still loading or user is not logged in, show appropriate message
  if (authLoading) {
    return (
      <div className={styles.createRentalPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className={styles.createRentalPage}>
        <div className={styles.container}>
          <div className={styles.notLoggedIn}>
            <h1>Login Required</h1>
            <p>You need to be logged in to create a rental listing.</p>
            <button 
              onClick={() => router.push('/login?callback=/rentals/create')}
              className={styles.loginButton}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.createRentalPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Create a Rental Listing</h1>
          <p>Share your equipment with others and earn income</p>
        </div>
        
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formSection}>
              <h2>Basic Information</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="title">Title*</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter a descriptive title for your item"
                  {...register('title')}
                />
                {errors.title && (
                  <p className={styles.errorMessage}>{errors.title.message}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  placeholder="Provide detailed information about your item"
                  rows={5}
                  {...register('description')}
                />
                {errors.description && (
                  <p className={styles.errorMessage}>{errors.description.message}</p>
                )}
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="pricePerDay">Price Per Day ($)*</label>
                  <input
                    type="number"
                    id="pricePerDay"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    {...register('pricePerDay')}
                  />
                  {errors.pricePerDay && (
                    <p className={styles.errorMessage}>{errors.pricePerDay.message}</p>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="category">Category*</label>
                  <select id="category" {...register('category')}>
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className={styles.errorMessage}>{errors.category.message}</p>
                  )}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="location">Location*</label>
                <input
                  type="text"
                  id="location"
                  placeholder="City, State"
                  {...register('location')}
                />
                {errors.location && (
                  <p className={styles.errorMessage}>{errors.location.message}</p>
                )}
              </div>
            </div>
            
            <div className={styles.formSection}>
              <h2>Availability</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="availabilityStart">Available From*</label>
                  <input
                    type="date"
                    id="availabilityStart"
                    {...register('availabilityStart')}
                  />
                  {errors.availabilityStart && (
                    <p className={styles.errorMessage}>{errors.availabilityStart.message}</p>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="availabilityEnd">Available Until*</label>
                  <input
                    type="date"
                    id="availabilityEnd"
                    {...register('availabilityEnd')}
                  />
                  {errors.availabilityEnd && (
                    <p className={styles.errorMessage}>{errors.availabilityEnd.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className={styles.formSection}>
              <h2>Features</h2>
              
              <div className={styles.featureInput}>
                <input
                  type="text"
                  placeholder="Add a feature (e.g., 'Adjustable height')"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={handleFeatureKeyPress}
                />
                <button 
                  type="button" 
                  onClick={addFeature}
                  disabled={!featureInput.trim() || features.length >= 10}
                >
                  Add
                </button>
              </div>
              
              {features.length > 0 && (
                <div className={styles.featuresList}>
                  {features.map((feature, index) => (
                    <div key={index} className={styles.featureTag}>
                      {feature}
                      <button 
                        type="button" 
                        onClick={() => removeFeature(index)}
                        className={styles.removeFeature}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input 
                type="hidden" 
                {...register('features')} 
                value={features.join(',')} 
              />
            </div>
            
            <div className={styles.formSection}>
              <h2>Images</h2>
              
              <div className={styles.imageUpload}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.uploadButton}
                  disabled={images.length >= 5}
                >
                  {images.length > 0 ? 'Add More Images' : 'Upload Images'}
                </button>
                <span className={styles.imageLimit}>
                  {images.length}/5 images
                </span>
              </div>
              
              {images.length > 0 && (
                <div className={styles.imagePreviewContainer}>
                  {images.map((image, index) => (
                    <div key={index} className={styles.imagePreview}>
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index}`} 
                      />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)}
                        className={styles.removeImage}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {submissionError && (
              <div className={styles.submissionError}>{submissionError}</div>
            )}
            
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => router.back()}
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 
                  uploadProgress > 0 ? 
                    `Uploading... ${uploadProgress}%` : 
                    'Creating Listing...' : 
                  'Create Listing'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 