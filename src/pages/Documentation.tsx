
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Book, Code, Globe, Shield, Users, Building, Truck, CreditCard } from "lucide-react";
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
              Deep Tier Financing Platform
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive documentation for the Token-Gated Credit Access System (TGCAS)
          </p>
        </div>

        {/* Quick Start Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300">
            <Book className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Overview</h3>
            <p className="text-gray-400 text-sm">Learn about TGCAS and how it solves deep tier financing challenges.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300">
            <CreditCard className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Credit Access Tokens</h3>
            <p className="text-gray-400 text-sm">Understand CAT lifecycle and token-based credit distribution.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300">
            <Users className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Participants</h3>
            <p className="text-gray-400 text-sm">Explore the four key roles: Banks, Companies, Vendors, and Sub-Vendors.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300">
            <Shield className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Process Flows</h3>
            <p className="text-gray-400 text-sm">Step-by-step guides for CAT lifecycle and dispute resolution.</p>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-white/20">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="process" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">Process Flows</TabsTrigger>
              <TabsTrigger value="bank" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">Bank Dashboard</TabsTrigger>
              <TabsTrigger value="company" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">Company Dashboard</TabsTrigger>
              <TabsTrigger value="vendor" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">Vendor Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8 space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Platform Overview</h2>
                <div className="space-y-6 text-gray-300">
                  <p className="text-lg">
                    This platform facilitates structured, secure credit distribution across complex supply chains using a novel 
                    Token-Gated Credit Access System. It connects four key participants:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Building className="w-6 h-6 text-blue-400" />
                        <h3 className="text-white font-semibold">Lenders (Banks, NBFCs)</h3>
                      </div>
                      <p className="text-gray-400">Regulated institutions providing formal credit.</p>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe className="w-6 h-6 text-green-400" />
                        <h3 className="text-white font-semibold">Syndicate Companies</h3>
                      </div>
                      <p className="text-gray-400">Large enterprises (e.g., Ultratech, Cochin Shipyard) with formal vendor systems.</p>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Users className="w-6 h-6 text-purple-400" />
                        <h3 className="text-white font-semibold">Vendors</h3>
                      </div>
                      <p className="text-gray-400">Companies providing direct goods/services to syndicate firms.</p>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Truck className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-white font-semibold">Sub-Vendors</h3>
                      </div>
                      <p className="text-gray-400">Tier-2 suppliers delivering goods/services to Vendors.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Problem Statement</h2>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                  <p className="text-gray-300">
                    Banks are comfortable lending to syndicate companies due to their size and credit history. However, 
                    vendors and sub-vendors—despite being operationally vital—often lack the digital footprint or 
                    documentation to access timely formal credit. This gap is known as the <strong className="text-red-400">deep tier financing problem</strong>.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Solution: Token-Gated Credit Access System (TGCAS)</h2>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6">
                  <p className="text-gray-300 mb-4">
                    TGCAS introduces <strong className="text-green-400">Credit Access Tokens (CATs)</strong> as programmable, 
                    trackable instruments of credit assurance across tiers of the supply chain.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">How it Works:</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">1</div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">CAT Issuance</h4>
                      <ul className="text-gray-400 space-y-1">
                        <li>• Syndicate companies request CATs from banks based on signed work orders.</li>
                        <li>• Banks evaluate and issue CATs to syndicate companies accordingly.</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">2</div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">CAT Distribution</h4>
                      <ul className="text-gray-400 space-y-1">
                        <li>• Syndicate companies distribute CATs to vendors when awarding work.</li>
                        <li>• Vendors can surrender CATs to banks for immediate working capital or forward CATs to sub-vendors.</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">3</div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Credit Redemption</h4>
                      <ul className="text-gray-400 space-y-1">
                        <li>• Sub-vendors can redeem CATs at partner banks for loans.</li>
                        <li>• In case of repayment failure, the bank is guaranteed repayment directly by the syndicate company.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="process" className="mt-8 space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Key Process Flows</h2>
                
                <div className="space-y-8">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Flow 1: CAT Lifecycle</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-300">Work order created by Syndicate Company</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-300">CAT request submitted to Bank</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-300">CAT issued → transferred to Vendor → optionally passed to Sub-Vendor</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-300">CAT surrendered to Bank → Loan disbursed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-300">Repayment tracked → disputes resolved via Syndicate Company guarantee</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Flow 2: Dispute Resolution</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-gray-300">Vendor/Sub-vendor defaults or under-delivers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-gray-300">Bank flags loan as disputed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-gray-300">Syndicate Company steps in:</span>
                      </div>
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span className="text-gray-400">Pays bank directly (as per agreement)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span className="text-gray-400">Resolves internal dispute separately with Vendor/Sub-vendor</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="bank" className="mt-8 space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Bank Dashboard Experience</h2>
                <p className="text-gray-300 mb-6">
                  The Bank Dashboard is the control center for managing CAT issuance, monitoring vendor engagement, 
                  tracking active loans, and resolving disputes.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Overview Metrics</h3>
                    <ul className="text-gray-400 space-y-1 text-sm">
                      <li>• Total CATs issued</li>
                      <li>• Tokens redeemed</li>
                      <li>• Active companies/vendors</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Issue New Tokens</h3>
                    <p className="text-gray-400 text-sm">Interface for banks to create CATs by entering company ID and token value.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Recent Transactions</h3>
                    <p className="text-gray-400 text-sm">View of token issuance and redemption history</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Active Loans</h3>
                    <p className="text-gray-400 text-sm">List of outstanding loans issued against CATs with due dates and remaining balances</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Disputed Loans</h3>
                    <p className="text-gray-400 text-sm">Centralized view of loans flagged for disputes, linked to associated syndicate firms</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">CAT Requests</h3>
                    <p className="text-gray-400 text-sm">Syndicate company requests for CATs, with attached work orders for bank verification and approval</p>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-3">Example Use Cases:</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <strong>Monitoring Risk:</strong> Quickly see which vendors are triggering disputes.</li>
                    <li>• <strong>Evaluating Exposure:</strong> Check total outstanding liabilities across vendor relationships.</li>
                    <li>• <strong>Auditing CAT Requests:</strong> Inspect work order files before token issuance.</li>
                  </ul>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="company" className="mt-8 space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Company Dashboard Experience</h2>
                <p className="text-gray-300 mb-6">
                  The Company Dashboard enables syndicate companies to manage their CAT requests, distribute tokens to vendors, 
                  and oversee their supply chain financing operations.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Overview Metrics</h3>
                    <ul className="text-gray-400 space-y-1 text-sm">
                      <li>• Total CATs received from banks</li>
                      <li>• CATs distributed to vendors</li>
                      <li>• Active vendor relationships</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Request CAT</h3>
                    <p className="text-gray-400 text-sm">Submit new CAT requests to banks with work order documentation and track approval status.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Transfer Tokens</h3>
                    <p className="text-gray-400 text-sm">Distribute received CATs to vendors based on work allocations and project requirements.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Vendor Management</h3>
                    <p className="text-gray-400 text-sm">View registered vendors, their token allocation history, and performance metrics.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">CAT Request History</h3>
                    <p className="text-gray-400 text-sm">Track all submitted requests to banks with status updates and approval timelines.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Guarantee Obligations</h3>
                    <p className="text-gray-400 text-sm">Monitor potential liabilities from vendor defaults and manage dispute resolution processes.</p>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-3">Example Use Cases:</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <strong>Project Planning:</strong> Request appropriate CAT amounts based on upcoming project requirements.</li>
                    <li>• <strong>Vendor Allocation:</strong> Distribute tokens efficiently across multiple vendors for different project phases.</li>
                    <li>• <strong>Risk Management:</strong> Monitor which vendors have redeemed tokens and potential exposure from guarantees.</li>
                  </ul>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="vendor" className="mt-8 space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Vendor Dashboard Experience</h2>
                <p className="text-gray-300 mb-6">
                  The Vendor Dashboard provides vendors with tools to manage received CATs, access working capital, 
                  and distribute tokens to their sub-vendors.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Overview Metrics</h3>
                    <ul className="text-gray-400 space-y-1 text-sm">
                      <li>• Total CATs received from companies</li>
                      <li>• Tokens redeemed for loans</li>
                      <li>• Active sub-vendor relationships</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Redeem Tokens</h3>
                    <p className="text-gray-400 text-sm">Convert CATs to working capital loans from partner banks with instant approval process.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Transfer to Sub-Vendors</h3>
                    <p className="text-gray-400 text-sm">Forward CATs to sub-vendors for their financing needs and project requirements.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Loan Management</h3>
                    <p className="text-gray-400 text-sm">Track active loans obtained through CAT redemption with payment schedules and balances.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Transaction History</h3>
                    <p className="text-gray-400 text-sm">Complete record of CAT receipts, redemptions, and transfers to sub-vendors.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Sub-Vendor Network</h3>
                    <p className="text-gray-400 text-sm">Manage relationships with sub-vendors and track their token utilization patterns.</p>
                  </div>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-3">Example Use Cases:</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <strong>Cash Flow Management:</strong> Redeem CATs strategically to maintain optimal working capital.</li>
                    <li>• <strong>Supply Chain Financing:</strong> Provide sub-vendors with tokens to ensure timely delivery of materials.</li>
                    <li>• <strong>Credit Optimization:</strong> Balance between direct redemption and sub-vendor distribution for maximum efficiency.</li>
                  </ul>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-3">Implementation Status</h3>
                  <p className="text-gray-300">
                    All participant dashboards (Bank, Company, Vendor) have been documented and are ready for development. 
                    Sub-vendor functionality can be added as an extension of the vendor dashboard.
                  </p>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="mt-12 grid lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Platform Overview</a></li>
              <li><a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">TGCAS Documentation</a></li>
              <li><a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">CAT Lifecycle</a></li>
              <li><a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Dashboard Guides</a></li>
              <li><a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Implementation Status</a></li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <p className="text-gray-400 text-sm mb-4">
              Need assistance with the platform? Our support team is here to help with implementation and integration.
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Contact Support
            </Button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integration Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security Audit</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Smart Contracts</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
