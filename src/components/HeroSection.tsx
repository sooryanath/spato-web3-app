
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-gray-600 text-gray-300 text-sm mb-8 hover:border-purple-400 transition-all duration-300">
          <span className="mr-2">⚡</span>
          Next-Generation Financial Infrastructure
        </div>
      </div>
      
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 max-w-6xl leading-tight">
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Deep Tier Financing
        </span>
        <br />
        <span className="text-white">Platform for MSMEs</span>
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-4xl font-medium">
        Instant Working Capital Loans for credit vendors
      </p>
      
      <p className="text-lg text-gray-400 mb-12 max-w-4xl leading-relaxed">
        Blockchain-powered tokenization ecosystem connecting Banks, NBFCs, syndicate companies and vendors. Enable efficient deep tier financing with advanced Credit Access Tokens and smart contract automation.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 flex items-center gap-2"
        >
          Launch Platform
          <ArrowRight className="w-5 h-5" />
        </Button>
        <Button 
          variant="outline" 
          className="border-gray-600 text-gray-300 hover:text-white hover:border-white bg-transparent px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105"
        >
          Read Documentation
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
