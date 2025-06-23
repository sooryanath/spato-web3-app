
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, Code, Globe, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:text-purple-200 hover:bg-white/10 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-white text-xl font-bold">Spato Finance</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive guide to Spato Finance's blockchain-powered deep tier financing platform for MSMEs
          </p>
        </div>

        {/* Quick Start Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300">
            <Book className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Getting Started</h3>
            <p className="text-gray-400 text-sm">Learn the basics of our platform and how to get started with deep tier financing.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300">
            <Code className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">API Reference</h3>
            <p className="text-gray-400 text-sm">Complete API documentation for integrating with our tokenization ecosystem.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300">
            <Globe className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Integration Guide</h3>
            <p className="text-gray-400 text-sm">Step-by-step guide to integrate with banks, NBFCs, and syndicate companies.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300">
            <Shield className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Security</h3>
            <p className="text-gray-400 text-sm">Security best practices and smart contract audit information.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Documentation */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Platform Overview</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Spato Finance revolutionizes MSME financing through blockchain-powered tokenization, creating 
                  an efficient ecosystem that connects banks, NBFCs, syndicate companies, and vendors.
                </p>
                <p>
                  Our platform enables deep tier financing through Credit Access Tokens (CATs), providing 
                  instant working capital loans to credit vendors while maintaining transparency and security 
                  through smart contract automation.
                </p>
              </div>
            </section>

            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <span>Instant working capital loans for MSMEs</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <span>Blockchain-powered Credit Access Tokens (CATs)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <span>Smart contract automation for transparency</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <span>Seamless integration with financial institutions</span>
                </li>
              </ul>
            </section>

            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Vendor Registration</h3>
                    <p className="text-gray-400">Credit vendors register on the platform and undergo verification process.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Credit Assessment</h3>
                    <p className="text-gray-400">AI-powered credit scoring evaluates vendor creditworthiness and determines loan eligibility.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Token Generation</h3>
                    <p className="text-gray-400">Credit Access Tokens are generated based on approved credit limits and smart contracts.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Instant Financing</h3>
                    <p className="text-gray-400">Vendors access instant working capital loans through the tokenized ecosystem.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Platform Overview</a></li>
                <li><a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Integration Guide</a></li>
                <li><a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Smart Contracts</a></li>
                <li><a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Security Audit</a></li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Need Help?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
