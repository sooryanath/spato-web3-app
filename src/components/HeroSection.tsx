
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        {/* Top badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
          <svg className="w-4 h-4 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-white text-sm font-medium">Next-Generation Financial Infrastructure</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            Deep Tier Financing
          </span>
          <br />
          <span className="text-white">Platform for MSMEs</span>
        </h1>
        
        {/* Subheading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-300 mb-8 leading-relaxed">
          Quick Working Capital Loans against PO
        </h2>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
          Blockchain-powered tokenization ecosystem connecting Banks, NBFCs, syndicate companies and vendors. Enable efficient deep tier financing with advanced Credit Access Tokens and smart contract automation.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link to="/login">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center">
              Launch Platform
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </Link>
          <button className="border-2 border-gray-400 text-gray-300 hover:bg-gray-400 hover:text-gray-900 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-200">
            Read Documentation
          </button>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
