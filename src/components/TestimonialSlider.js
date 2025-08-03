import React, { useState, useEffect } from 'react';
import '../assets/css/TestimonialSlider.css';

const TestimonialSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Jennifer Lee",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      service: "Rented an apartment",
      text: "Found my dream apartment through LuxuryHomes. The process was smooth and the agent was extremely helpful. Highly recommend!"
    },
    {
      id: 2,
      name: "Robert Taylor",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.5,
      service: "Listed a property",
      text: "As a landlord, I appreciate how easy it was to list my property. It was rented within a week at a great price. Excellent service!"
    },
    {
      id: 3,
      name: "Amanda Smith",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      rating: 5,
      service: "Found office space",
      text: "The team helped me find the perfect office space for my growing business. Their knowledge of the market saved me time and money."
    },
    {
      id: 4,
      name: "Michael Johnson",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      service: "Bought a house",
      text: "Exceptional service from start to finish. They made buying my first home a stress-free experience. Couldn't be happier with the results!"
    },
    {
      id: 5,
      name: "Sarah Wilson",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 4.5,
      service: "Commercial lease",
      text: "Professional and knowledgeable team. They understood our business needs and found us the perfect commercial space in our budget."
    },
    {
      id: 6,
      name: "David Brown",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 5,
      service: "Property investment",
      text: "Their market insights helped me make smart investment decisions. Great ROI on the properties they recommended. Highly professional!"
    },
        {
      "id": 7,
      "name": "Emily Chen",
      "image": "https://randomuser.me/api/portraits/women/42.jpg",
      "rating": 5,
      "service": "First-time homebuyer",
      "text": "As a first-time buyer, I was nervous but my agent guided me through every step. Found my dream home under budget in a great school district!"
    },
    {
      "id": 8,
      "name": "Michael Rodriguez",
      "image": "https://randomuser.me/api/portraits/men/33.jpg",
      "rating": 4,
      "service": "Luxury condo purchase",
      "text": "Impressive portfolio of high-end properties. Negotiated a great deal on a waterfront condo with amazing amenities."
    },
    {
      "id": 9,
      "name": "Jessica Lee",
      "image": "https://randomuser.me/api/portraits/women/65.jpg",
      "rating": 5,
      "service": "Relocation assistance",
      "text": "Moved across the country and they handled everything - from virtual tours to local school info. Made transition seamless for my family."
    },
    {
      "id": 10,
      "name": "Robert Johnson",
      "image": "https://randomuser.me/api/portraits/men/88.jpg",
      "rating": 4.5,
      "service": "Rental property management",
      "text": "Have managed my 3 rental properties for 2 years now. Always find quality tenants and handle maintenance promptly."
    },
    {
      "id": 11,
      "name": "Olivia Martinez",
      "image": "https://randomuser.me/api/portraits/women/12.jpg",
      "rating": 5,
      "service": "Historic home sale",
      "text": "Sold my 1920s craftsman for 15% over asking price! Their staging advice and marketing really highlighted the home's unique character."
    },
    {
      "id": 12,
      "name": "James Wilson",
      "image": "https://randomuser.me/api/portraits/men/54.jpg",
      "rating": 5,
      "service": "Investment portfolio",
      "text": "Built a diversified real estate portfolio with their guidance. Their analysis of emerging neighborhoods has been spot on."
    },
    {
      "id": 13,
      "name": "Sophia Kim",
      "image": "https://randomuser.me/api/portraits/women/77.jpg",
      "rating": 4,
      "service": "Downsizing assistance",
      "text": "Helped my parents transition from their family home to a senior community with patience and compassion."
    },
    {
      "id": 14,
      "name": "Daniel Thompson",
      "image": "https://randomuser.me/api/portraits/men/22.jpg",
      "rating": 5,
      "service": "Land purchase",
      "text": "Found the perfect 10-acre parcel for our future home. Their knowledge of zoning and development potential was invaluable."
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / getItemsPerSlide()));
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials.length]);

  const getItemsPerSlide = () => {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
      setCurrentSlide(0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="ts-star fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="ts-star-half fas fa-star-half-alt"></i>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ts-star-empty far fa-star"></i>);
    }
    
    return stars;
  };

  const getCurrentTestimonials = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return testimonials.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <section className="ts-testimonial-section">
      <div className="ts-container">
        <div className="ts-section-header">
          <h2 className="ts-title">Client Testimonials</h2>
          <p className="ts-subtitle">Hear from our delighted customers</p>
          <div className="ts-divider"></div>
        </div>
        
        <div className="ts-testimonial-wrapper">
          <button
            className="ts-nav ts-nav-prev"
            onClick={prevSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            disabled={totalSlides <= 1}
            aria-label="Previous testimonials"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <button
            className="ts-nav ts-nav-next"
            onClick={nextSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            disabled={totalSlides <= 1}
            aria-label="Next testimonials"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          
          <div className="ts-slider-container">
            <div
              className="ts-slider"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div className="ts-row">
              {getCurrentTestimonials().map((testimonial, index) => (
                <div key={testimonial.id} className={`ts-card-wrapper ts-card-${index + 1}`}>
                  <div className="ts-card">
                    <div className="ts-card-body">
                      <div className="ts-card-header">
                        <div className="ts-client-info">
                          <div className="ts-avatar-container">
                            <img
                              src={testimonial.image}
                              className="ts-avatar"
                              alt={testimonial.name}
                              loading="lazy"
                            />
                            <div className="ts-avatar-border"></div>
                          </div>
                          <div className="ts-client-details">
                            <h5 className="ts-client-name">{testimonial.name}</h5>
                            <div className="ts-rating">
                              {renderStars(testimonial.rating)}
                            </div>
                            <p className="ts-service">{testimonial.service}</p>
                          </div>
                        </div>
                        <div className="ts-quote-icon">
                          <i className="fas fa-quote-right"></i>
                        </div>
                      </div>
                      <div className="ts-testimonial-content">
                        <p className="ts-testimonial-text">"{testimonial.text}"</p>
                      </div>
                      <div className="ts-card-decoration">
                        <div className="ts-decoration-circle ts-circle-1"></div>
                        <div className="ts-decoration-circle ts-circle-2"></div>
                        <div className="ts-decoration-circle ts-circle-3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
          
          {totalSlides > 1 && (
            <div className="ts-dots-container">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  className={`ts-dot ${currentSlide === index ? 'ts-active' : ''}`}
                  onClick={() => goToSlide(index)}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          <div className="ts-progress-bar">
            <div
              className="ts-progress-fill"
              style={{
                width: `${((currentSlide + 1) / totalSlides) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;