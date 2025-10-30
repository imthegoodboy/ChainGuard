import { useEffect, useState } from 'react';
import { Shield, Activity, AlertTriangle, TrendingUp, Clock, FileText, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, ContractScan, MonitoredContract, SecurityAlert } from '../lib/supabase';

type DashboardPageProps = {
  onNavigate: (page: string) => void;
};

export const DashboardPage = ({ onNavigate }: DashboardPageProps) => {
  const { user, profile } = useAuth();
  const [scans, setScans] = useState<ContractScan[]>([]);
  const [monitoredContracts, setMonitoredContracts] = useState<MonitoredContract[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const [scansData, contractsData, alertsData] = await Promise.all([
        supabase
          .from('contract_scans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('monitored_contracts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('security_alerts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (scansData.data) setScans(scansData.data);
      if (contractsData.data) setMonitoredContracts(contractsData.data);
      if (alertsData.data) setAlerts(alertsData.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'pro':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  const totalVulnerabilities = scans.reduce((sum, scan) => sum + scan.vulnerability_count, 0);
  const avgRiskScore = scans.length > 0
    ? Math.round(scans.reduce((sum, scan) => sum + scan.risk_score, 0) / scans.length)
    : 0;

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600 mb-6">Access your dashboard by signing in</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Dashboard</h1>
          <p className="text-gray-600">Monitor your smart contracts and security scans</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getTierBadgeColor(profile.subscription_tier)}`}>
                {profile.subscription_tier.toUpperCase()}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {profile.total_scans}
            </div>
            <div className="text-sm text-gray-600">Total Scans</div>
            {profile.subscription_tier === 'free' && (
              <div className="mt-3 text-xs text-gray-500">
                {5 - profile.free_scans_used} free scans left
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {totalVulnerabilities}
            </div>
            <div className="text-sm text-gray-600">Vulnerabilities Found</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className={`text-2xl font-bold mb-1 ${getRiskColor(avgRiskScore)}`}>
              {avgRiskScore}
            </div>
            <div className="text-sm text-gray-600">Avg Risk Score</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {monitoredContracts.length}
            </div>
            <div className="text-sm text-gray-600">Monitored Contracts</div>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-600" />
                Recent Alerts
              </h2>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Recent Scans
              </h2>
              <button
                onClick={() => onNavigate('scanner')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                New Scan
              </button>
            </div>
            {scans.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No scans yet</p>
                <button
                  onClick={() => onNavigate('scanner')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  Start First Scan
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{scan.contract_name}</h3>
                        <span className="text-xs text-gray-500">
                          {scan.scan_type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1 text-orange-600" />
                          {scan.vulnerability_count} issues
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          {new Date(scan.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${getRiskColor(scan.risk_score)}`}>
                        {scan.risk_score}
                      </div>
                      <div className="text-xs text-gray-500">Risk</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-purple-600" />
                Monitored Contracts
              </h2>
            </div>
            {monitoredContracts.length === 0 ? (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">No contracts monitored</p>
                <p className="text-sm text-gray-500 mb-4">
                  Upgrade to Pro for live monitoring
                </p>
                <button
                  onClick={() => onNavigate('wallet')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600"
                >
                  Upgrade Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {monitoredContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{contract.contract_name}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        contract.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contract.is_active ? 'ACTIVE' : 'PAUSED'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mb-2">
                      {contract.contract_address.slice(0, 10)}...{contract.contract_address.slice(-8)}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {contract.alerts_count} alerts
                      </span>
                      <span className="text-gray-500">
                        {contract.network.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {profile.subscription_tier === 'free' && (
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-blue-100 mb-4">
                  Get unlimited scans, live monitoring, and real-time alerts for just $49/month
                </p>
                <button
                  onClick={() => onNavigate('wallet')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Connect Wallet to Upgrade
                </button>
              </div>
              <Shield className="w-24 h-24 text-white opacity-20" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
