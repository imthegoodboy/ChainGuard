import { Shield, Zap, Globe, DollarSign, AlertTriangle, CheckCircle, ArrowRight, Lock, Eye, Network } from 'lucide-react';

type LandingPageProps = {
  onNavigate: (page: string) => void;
};

export const LandingPage = ({ onNavigate }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-white opacity-70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>Powered by AI on Polygon Network</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered Smart Contract
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Security Guardian
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Protect your smart contracts from exploits with real-time AI monitoring.
              Stop hackers before they strike. Save millions with automated security.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => onNavigate('auth')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Start Free Scan</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('scanner')}
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all"
              >
                View Demo
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              5 free scans • No credit card required • Instant results
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Problem: Billions Lost to Smart Contract Hacks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional audits cost $50K+ and take weeks. Small teams can't afford them.
              Meanwhile, hackers exploit vulnerabilities in minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <AlertTriangle className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">$3.8B Lost in 2023</h3>
              <p className="text-gray-600">
                Smart contract exploits cost billions annually, with most victims being indie developers
                who couldn't afford proper security audits.
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
              <DollarSign className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">$50K+ Per Audit</h3>
              <p className="text-gray-600">
                Traditional security audits are prohibitively expensive and slow, putting them out of
                reach for most developers and startups.
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
              <AlertTriangle className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Minutes to Exploit</h3>
              <p className="text-gray-600">
                Hackers can identify and exploit vulnerabilities in minutes, while traditional audits
                take weeks to complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How ChainGuard AI Protects You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three layers of AI-powered protection for your smart contracts
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pre-Deployment Shield</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>AI scans code before deployment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Identifies vulnerabilities using ML trained on exploits</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Suggests fixes in plain English</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="bg-cyan-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Guardian Mode</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Continuous 24/7 contract monitoring</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Real-time suspicious transaction detection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Auto-pause on anomaly detection</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Network className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Defense</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Network learns from all attacks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Instant protection for all contracts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Collective security intelligence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built on Polygon: Fast, Cheap, Scalable
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Low gas fees make micro-transactions viable. Fast finality enables real-time monitoring.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
              <Globe className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Polygon Network</h4>
              <p className="text-sm text-gray-600">Built exclusively on Polygon for optimal performance</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <Zap className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600">2-second block times for instant alerts</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-green-50 rounded-xl">
              <DollarSign className="w-10 h-10 text-cyan-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Ultra Low Fees</h4>
              <p className="text-sm text-gray-600">$0.01 transactions vs $50+ on Ethereum</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
              <Lock className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Ethereum Secure</h4>
              <p className="text-sm text-gray-600">Backed by Ethereum's security</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              From $5 per scan to enterprise solutions
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Tier</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">/ 5 scans</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  5 pre-deployment scans
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Basic vulnerability detection
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Plain English recommendations
                </li>
              </ul>
              <button
                onClick={() => onNavigate('auth')}
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Start Free
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-8 shadow-xl border-2 border-blue-600 transform scale-105">
              <div className="bg-white text-blue-600 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$49</span>
                <span className="text-blue-100 ml-2">/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-2" />
                  Unlimited scans
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-2" />
                  Live contract monitoring (3 contracts)
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-2" />
                  Real-time alerts
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-2" />
                  Advanced AI detection
                </li>
              </ul>
              <button
                onClick={() => onNavigate('wallet')}
                className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Unlimited everything
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Dedicated AI model
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Custom integrations
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  24/7 priority support
                </li>
              </ul>
              <button
                onClick={() => window.open('mailto:enterprise@chainguard.ai', '_blank')}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Secure Your Smart Contracts?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers protecting billions in assets
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl inline-flex items-center space-x-2"
          >
            <span>Start Your Free Scans</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};
