import React from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import Navbar from "./Navbar";
import Carousel from './Carousel';
import PopularPlantsCarousel from './PlantsCarousel';
import { FaLeaf, FaTree, FaSeedling, FaRecycle } from 'react-icons/fa';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <Icon className="text-4xl text-green-600 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

function Main() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-20 w-full">
          <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center md:text-left">
                Bring Nature Home with GreenLife
              </h1>
              <p className="text-xl mb-6 text-center md:text-left">
                Transform your space with beautiful plants and trees. Promote a greener lifestyle, one plant at a time.
              </p>
              <div className="text-center md:text-left">
                <Link to="/order">
                  <button className="bg-yellow-400 text-green-800 font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition duration-300">
                    Start Planting Now!
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Carousel />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-500">
              Why Choose GreenLife?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={FaLeaf}
                title="Wide Variety"
                description="Choose from a vast selection of indoor and outdoor plants."
              />
              <FeatureCard
                icon={FaTree}
                title="Expert Advice"
                description="Get guidance from our plant care specialists."
              />
              <FeatureCard
                icon={FaSeedling}
                title="Easy Care"
                description="We provide care instructions for every plant."
              />
              <FeatureCard
                icon={FaRecycle}
                title="Eco-Friendly"
                description="All our products and packaging are environmentally friendly."
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-green-300">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Popular Plants
            </h2>
            <div className="relative">
              <PopularPlantsCarousel />
            </div>
          </div>
        </section>

        <section className="bg-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Green Up Your Space?
            </h2>
            <p className="text-xl mb-8">
              Join GreenLife today and start your journey towards a greener home and lifestyle.
            </p>
            <Link to="/order">
              <button className="bg-yellow-400 text-green-800 font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition duration-300">
                Shop Now
              </button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 GreenLife. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Main;

