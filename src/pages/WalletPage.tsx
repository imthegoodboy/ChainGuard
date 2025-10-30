import { useState, useEffect } from 'react';
import { Wallet, CheckCircle, AlertCircle, Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { connectWallet, checkMetaMask } from '../lib/web3';
import { supabase } from '../lib/supabase';

type WalletPageProps = {
  onNavigate: (page: string) => void;
};

export const WalletPage = ({ onNavigate }: WalletPageProps) => {
  const { user, profile, walletAddress, setWalletAddress, refreshProfile } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasMetaMask, setHasMetaMask] = useState(false);

  useEffect(() => {
    setHasMetaMask(checkMetaMask());
  }, []);

  const handleConnectWallet = async () => {
    if (!user) {
      setError('Please sign in first');
      onNavigate('auth');
      return;
    }

    setError('');
    setSuccess('');
    setConnecting(true);

    try {
      const address = await connectWallet();
      setWalletAddress(address);

      await supabase
        .from('profiles')
        .update({ wallet_address: address })
        .eq('id', user.id);

      await refreshProfile();
      setSuccess('Wallet connected successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const handleUpgradeToPro = async () => {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setError('');
    setSuccess('');

    try {
      await supabase
        .from('profiles')
        .update({ subscription_tier: 'pro' })
        .eq('id', user!.id);

      await supabase.from('payments').insert({
        user_id: user!.id,
        amount: 49,
        currency: 'MATIC',
        payment_type: 'subscription',
        transaction_hash: '0xdemo' + Date.now(),
        status: 'completed',
      });

      await refreshProfile();
      setSuccess('Successfully upgraded to Pro! You now have unlimited scans and live monitoring.');
      setTimeout(() => onNavigate('dashboard'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to upgrade');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600 mb-6">Connect your wallet by signing in first</p>
          <button
            onClick={() => onNavigate('auth')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Connect Your Wallet</h1>
          <p className="text-xl text-gray-600">
            Connect to Polygon network and upgrade your account
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {!hasMetaMask && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">MetaMask Required</h3>
                <p className="text-sm text-yellow-800 mb-4">
                  You need MetaMask installed to connect your wallet and interact with the Polygon network.
                </p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                >
                  <span>Install MetaMask</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Wallet Connection</h2>

            {walletAddress ? (
              <div className="space-y-6">
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="font-bold text-green-900">Wallet Connected</h3>
                  </div>
                  <p className="text-sm text-green-800 font-mono break-all">
                    {walletAddress}
                  </p>
                </div>

                {profile && (
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-4">Account Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Subscription Tier</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          profile.subscription_tier === 'pro'
                            ? 'bg-blue-100 text-blue-800'
                            : profile.subscription_tier === 'enterprise'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {profile.subscription_tier.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Scans</span>
                        <span className="font-semibold text-gray-900">{profile.total_scans}</span>
                      </div>
                      {profile.subscription_tier === 'free' && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Free Scans Remaining</span>
                          <span className="font-semibold text-gray-900">
                            {5 - profile.free_scans_used} / 5
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-6">
                  Connect your MetaMask wallet to access premium features and unlimited scans.
                  Make sure you're on the Polygon network for the best experience.
                </p>
                <button
                  onClick={handleConnectWallet}
                  disabled={connecting || !hasMetaMask}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center space-x-2"
                >
                  <Wallet className="w-5 h-5" />
                  <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {walletAddress && profile?.subscription_tier === 'free' && (
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-xl border-2 border-blue-600 p-8 text-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-block bg-white text-blue-600 text-sm font-bold px-3 py-1 rounded-full mb-4">
                  RECOMMENDED
                </div>
                <h2 className="text-3xl font-bold mb-2">Upgrade to Pro</h2>
                <p className="text-blue-100 text-lg mb-6">
                  Unlock unlimited power with our Pro subscription
                </p>
              </div>
              <Shield className="w-16 h-16 text-white opacity-20" />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="w-6 h-6 mb-2" />
                <h4 className="font-semibold mb-1">Unlimited Scans</h4>
                <p className="text-sm text-blue-100">Scan as many contracts as you need</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <Globe className="w-6 h-6 mb-2" />
                <h4 className="font-semibold mb-1">Live Monitoring</h4>
                <p className="text-sm text-blue-100">24/7 real-time contract monitoring</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <Zap className="w-6 h-6 mb-2" />
                <h4 className="font-semibold mb-1">Instant Alerts</h4>
                <p className="text-sm text-blue-100">Get notified of threats immediately</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <Shield className="w-6 h-6 mb-2" />
                <h4 className="font-semibold mb-1">Advanced AI</h4>
                <p className="text-sm text-blue-100">Enhanced vulnerability detection</p>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 mb-6">
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-5xl font-bold">$49</span>
                <span className="text-xl text-blue-100">/month</span>
              </div>
              <p className="text-sm text-blue-100">Billed monthly in MATIC on Polygon</p>
            </div>

            <button
              onClick={handleUpgradeToPro}
              className="w-full bg-white text-blue-600 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Upgrade to Pro Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-sm text-blue-100 mt-4">
              Instant activation • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        )}

        <div className="mt-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Why Polygon?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Globe className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Built for Polygon</h4>
              <p className="text-sm text-gray-600">
                Optimized exclusively for Polygon network's architecture and performance
              </p>
            </div>
            <div>
              <Zap className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Ultra-Low Fees</h4>
              <p className="text-sm text-gray-600">
                Pay pennies instead of dollars. $0.01 transactions vs $50+ on Ethereum
              </p>
            </div>
            <div>
              <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600">
                2-second block times enable real-time monitoring and instant alerts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
