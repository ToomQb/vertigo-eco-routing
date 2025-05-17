"use client";

import Link from "next/link";

const About = () => {
  return (
    <main className="about-page bg-green dark:bg-dark-green min-h-screen flex justify-center items-start px-6 pt-14 pb-14">
      <div className="w-full max-w-[90rem] p-24 bg-white dark:bg-dark-card shadow-lg rounded-lg dark:text-white">

        {/* Main Illustration */}
        <img
          src="..." // à remplacer
          alt="Eco-friendly transportation illustration"
          className="shadow-md mb-4 rounded-lg"
        />

        {/* Introduction */}
        <section className="mb-16">
          <h1 className="text-4xl font-extrabold text-dark-green dark:text-green-300 mb-6">
            About the Application
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
            This project was designed to provide a simple and effective solution for comparing the carbon footprint of different trips based on the modes of transport used. 
            It allows users to know the amount of CO2 emitted for each type of transport in a given situation, taking into account geographical specifics and available options.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-dark-green dark:text-green-300 mb-5">
              Our Mission
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
              The main goal of this application is to raise public awareness about the carbon footprint of daily travel. 
              By allowing users to compare CO2 emissions from different modes of transport, our platform encourages more responsible and eco-friendly choices. 
              Whether it is local, national, or international travel, our aim is to provide users with the tools they need to reduce their environmental impact.
            </p>
          </div>

          <img
            src="..." // à remplacer
            alt="People using different transport modes"
            className="mr-8 shadow-md rounded-lg"
          />
        </section>

        {/* Technology and Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-dark-green dark:text-green-300 mb-6">
            Technology and Features
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-5 leading-relaxed text-justify">
            The application relies on a centralized database containing information on transport modes and their CO2 emissions. 
            Using a precise calculation algorithm, the application estimates the carbon footprint of each trip in real-time. 
            Users can choose from a variety of transport options, including walking, cycling, driving, taking a train, flying, etc.
          </p>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
            The platform also allows administrators to update information related to transport modes and CO2 emissions, ensuring a constantly updated database. 
            Users can easily simulate local, national, or international trips and receive recommendations on the most eco-friendly transport options.
          </p>
        </section>

        {/* Project Origin */}
        <section className="mb-16 grid md:grid-cols-2 gap-10 items-center">
          <img
            src="..." // à remplacer
            alt="Environmental background"
            className="shadow-md rounded-lg order-last md:order-first"
          />

          <div>
            <h2 className="text-3xl font-semibold text-dark-green dark:text-green-300 mb-5">
              Origin of the Project
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
              This project was developed within our Master's program, led by professors committed to addressing environmental challenges. 
              Its goal is to reduce the carbon footprint of daily commutes and raise awareness about sustainable transportation choices. 
              Inspired by current environmental concerns and the growing need for eco-friendly solutions, this platform aims to make information accessible to all and encourage responsible decision-making.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-dark-green dark:text-green-300 mb-4">
            Join Us in Our Mission
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-justify w-full mb-4">
            We believe that small actions can make a big difference. Use our application to make informed decisions and reduce your carbon footprint. 
            Explore, compare, and choose the transportation mode that best contributes to the preservation of our planet.
          </p>
          <Link href="/">
            <button className="p-8 mt-3 py-2 text-xl rounded-lg text-white transition bg-dark-green hover:bg-green cursor-pointer">
              Start comparing emissions
            </button>
          </Link>
        </section>

      </div>
    </main>
  );
};

export default About;
