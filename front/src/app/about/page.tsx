export default function About() {
    return (
      <main className="bg-light dark:bg-dark-green min-h-screen flex justify-center items-center pt-12 px-6">
        <div className="w-full max-w-3xl p-8 bg-white dark:bg-dark-card rounded-lg shadow-lg dark:text-white">
          {/* Introduction Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-extrabold text-dark-green dark:text-green-300 mb-6">About the Application</h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              This project was designed to provide a simple and effective solution for comparing the carbon footprint of different trips based on the modes of transport used. It allows users to know the amount of CO2 emitted for each type of transport in a given situation, taking into account geographical specifics and available options.
            </p>
          </section>
          
          {/* Mission Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-dark-green dark:text-green-300 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              The main goal of this application is to raise public awareness about the carbon footprint of daily travel. By allowing users to compare CO2 emissions from different modes of transport, our platform encourages more responsible and eco-friendly choices. Whether it's local, national, or international travel, our aim is to provide users with the tools they need to reduce their environmental impact.
            </p>
          </section>
          
          {/* Technology and Features Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-dark-green dark:text-green-300 mb-4">Technology and Features</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
              The application relies on a centralized database containing information on transport modes and their CO2 emissions. Using a precise calculation algorithm, the application estimates the carbon footprint of each trip in real-time. Users can choose from a variety of transport options, including walking, cycling, driving, taking a train, flying, etc.
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              The platform also allows administrators to update information related to transport modes and CO2 emissions, ensuring a constantly updated database. Users can easily simulate local, national, or international trips and receive recommendations on the most eco-friendly transport options.
            </p>
          </section>
    
          {/* Origin and Background Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-dark-green dark:text-green-300 mb-4">Origin of the Project</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              This project was initiated as part of an effort to reduce the carbon footprint of daily commutes. Inspired by the current environmental challenges and the growing need for sustainable solutions, this site aims to make information accessible to everyone while facilitating responsible decision-making. It is part of a broader movement aimed at raising awareness and taking action for the preservation of the environment.
            </p>
          </section>
    
          {/* Call to Action Section */}
          <section>
            <h2 className="text-3xl font-semibold text-dark-green dark:text-green-300 mb-4">Join Us in Our Mission</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              We believe that small actions can make a big difference. Use our application to make informed decisions and reduce your carbon footprint. Explore, compare, and choose the transportation mode that best contributes to the preservation of our planet.
            </p>
          </section>
        </div>
      </main>
    );
  }
  