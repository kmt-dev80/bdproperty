import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Weblayout from '../layout/Weblayout';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    // Reset submission status after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <Weblayout>  
      {/* Hero Section */}
      <section className="contact-hero py-5 bg-dark text-white">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Contact LuxuryHomes</h1>
              <p className="lead mb-4">
                We're here to help you with all your real estate needs. 
                Reach out to us with any questions or to schedule a consultation.
              </p>
              <div className="d-flex gap-3">
                <a href="tel:+12125551234" className="btn btn-warning btn-lg px-4">
                  <i className="fas fa-phone me-2"></i> Call Now
                </a>
                <a href="mailto:info@luxuryhomes.com" className="btn btn-outline-light btn-lg px-4">
                  <i className="fas fa-envelope me-2"></i> Email Us
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Contact LuxuryHomes" 
                className="img-fluid rounded-3 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 mb-5 mb-lg-0">
              <h2 className="fw-bold display-5 mb-4">Get In Touch</h2>
              <p className="text-muted mb-4">
                Have questions or need assistance? Reach out to our team and we'll be happy to help.
              </p>
              <div className="divider bg-warning mb-4"></div>
              
              <div className="d-flex mb-4">
                <div className="me-3 text-warning">
                  <i className="fas fa-map-marker-alt fa-2x"></i>
                </div>
                <div>
                  <h5 className="mb-1">Address</h5>
                  <p className="text-muted mb-0">
                    123 Real Estate Ave, Suite 400<br/>
                    New York, NY 10001
                  </p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="me-3 text-warning">
                  <i className="fas fa-phone-alt fa-2x"></i>
                </div>
                <div>
                  <h5 className="mb-1">Phone</h5>
                  <p className="text-muted mb-0">(212) 555-1234</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="me-3 text-warning">
                  <i className="fas fa-envelope fa-2x"></i>
                </div>
                <div>
                  <h5 className="mb-1">Email</h5>
                  <p className="text-muted mb-0">info@luxuryhomes.com</p>
                </div>
              </div>
              
              <div className="d-flex">
                <div className="me-3 text-warning">
                  <i className="fas fa-clock fa-2x"></i>
                </div>
                <div>
                  <h5 className="mb-1">Working Hours</h5>
                  <p className="text-muted mb-0">
                    Monday - Friday: 9am - 6pm<br/>
                    Saturday: 10am - 4pm
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-7">
              <div className="card border-0 shadow">
                <div className="card-body p-4 p-lg-5">
                  <h3 className="mb-4">Send Us a Message</h3>
                  {submitted && (
                    <div className="alert alert-success mb-4">
                      Thank you for your message! We'll get back to you soon.
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Your Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="name" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Your Email</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          id="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input 
                          type="tel" 
                          className="form-control" 
                          id="phone" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="subject" className="form-label">Subject</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="subject" 
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="message" className="form-label">Message</label>
                        <textarea 
                          className="form-control" 
                          id="message" 
                          rows="5" 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <button 
                          type="submit" 
                          className="btn btn-warning px-4 py-2 fw-bold"
                        >
                          Send Message <i className="fas fa-paper-plane ms-2"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-0">
        <div className="ratio ratio-21x9">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215209179042!2d-73.987844924239!3d40.74844097138996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1689877740724!5m2!1sen!2sus" 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </Weblayout>
  );
}

export default Contact;