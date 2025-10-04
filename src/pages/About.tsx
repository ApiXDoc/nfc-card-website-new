import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Zap, Shield, Target, Heart } from 'lucide-react';
import './About.css';

const About: React.FC = () => {
  const stats = [
    { label: 'Happy Customers', value: '10,000+' },
    { label: 'Cards Delivered', value: '50,000+' },
    { label: 'Countries Served', value: '25+' },
    { label: 'Years of Experience', value: '5+' }
  ];

  const values = [
    {
      icon: <Target size={32} />,
      title: 'Innovation',
      description: 'We constantly push the boundaries of NFC technology to bring you cutting-edge solutions.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Quality',
      description: 'Every card is crafted with premium materials and undergoes rigorous quality testing.'
    },
    {
      icon: <Heart size={32} />,
      title: 'Customer Focus',
      description: 'Your success is our priority. We provide exceptional support and service.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Reliability',
      description: 'Our NFC cards are built to last and perform consistently in any environment.'
    }
  ];

  // Team data for future use
  /*
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c2?w=300&h=300&fit=crop',
      description: 'Visionary leader with 15+ years in tech innovation.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      description: 'Expert in NFC technology and product development.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      description: 'Creative director ensuring beautiful, functional designs.'
    }
  ];
  */

  return (
    <motion.div 
      className="about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1>About Digital Zin</h1>
            <p>
              We're revolutionizing professional networking with innovative NFC technology. 
              Our mission is to help modern professionals make meaningful connections 
              through smart, sustainable business cards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <motion.div 
              className="story-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2>Our Story</h2>
              <p>
                Founded in 2019, Digital Zin emerged from a simple frustration: the wastefulness 
                and inefficiency of traditional business cards. Our founders, a team of 
                technology enthusiasts and design experts, envisioned a world where 
                professional networking could be instant, sustainable, and impressive.
              </p>
              <p>
                What started as a small startup has grown into a global leader in NFC 
                business card technology. We've helped thousands of professionals and 
                businesses transform their networking approach, creating meaningful 
                connections in seconds rather than minutes.
              </p>
              <p>
                Today, we continue to innovate, developing new features and designs 
                that push the boundaries of what's possible with NFC technology.
              </p>
            </motion.div>
            <motion.div 
              className="story-image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" 
                alt="Our team working together" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Values
          </motion.h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <motion.div 
            className="mission-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Our Mission</h2>
            <p>
              To revolutionize professional networking by making it instant, sustainable, 
              and memorable. We believe that every professional interaction should be 
              seamless and impactful, and our NFC cards make that vision a reality.
            </p>
            <div className="mission-features">
              <div className="mission-feature">
                <Users size={24} />
                <span>Connecting Professionals Worldwide</span>
              </div>
              <div className="mission-feature">
                <Award size={24} />
                <span>Setting Industry Standards</span>
              </div>
              <div className="mission-feature">
                <Zap size={24} />
                <span>Driving Innovation Forward</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
