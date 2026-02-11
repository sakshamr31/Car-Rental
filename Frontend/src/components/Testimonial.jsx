import React from 'react';
import Title from './Title';
import { assets } from '../assets/assets';

const Testimonial = () => {

    const testimonials = [
        { 
            name: "Emma Rodriguez", 
            location: "Barcelona, Spain", 
            image: assets.testimonial_image_1, 
            testimonial: "The booking process was smooth and the car was clean and well-maintained. Pickup and return were hassle-free. Overall, a reliable experience." 
        },

        {
            name: "Ellyse Devine", 
            location: "New York, USA", 
            image: assets.testimonial_image_2, 
            testimonial: "Great service and a wide selection of premium cars. The pricing was transparent and the customer support was responsive. I’ll definitely book again." 
        },

        {
            name: "Robin Clark", 
            location: "Sydney, Australia", 
            image: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
            testimonial: "Absolutely outstanding experience! From easy booking to driving a perfectly maintained luxury car, everything was seamless. This is hands down the best car rental service I’ve used." 
        }
    ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
        <Title title="Customer Reviews & Experiences ⭐" subTitle="Honest feedback from customers who chose comfort, reliability, and premium car rentals." />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
            {testimonials.map((testimonial, index) => (

                <div key={index} className="bg-white p-6 rounded-xl shadow-[0_-6px_16px_rgba(0,0,0,0.15),0_6px_16px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">

                    <div className="flex items-center gap-3">
                        <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                        <div>
                            <p className="text-xl">{testimonial.name}</p>
                            <p className="text-gray-500">{testimonial.location}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 mt-4">
                        {Array(5).fill(0).map((_, index) => (
                            <img key={index} src={assets.star_icon} alt="Star" />
                        ))}
                    </div>
                    
                    <p className="text-gray-600 max-w-90  font-light mt-4">"{testimonial.testimonial}"</p>
                </div>
            ))}
        </div>
    </div>
    )
}

export default Testimonial;