import { useState } from 'react';
import { Upload, Github, FileCode, Shield, AlertTriangle, CheckCircle, Loader, AlertCircle, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { analyzeContract, fetchGitHubContract, Vulnerability } from '../lib/vulnerabilityDetector';

type ScannerPageProps = {
  onNavigate: (page: string) => void;
};

export const ScannerPage = ({ onNavigate }: ScannerPageProps) => {
  const { user, profile, refreshProfile } = useAuth();
  const [scanType, setScanType] = useState<'upload' | 'github'>('upload');
  const [githubUrl, setGithubUrl] = useState('');
  const [uploadedCode, setUploadedCode] = useState('');
  const [contractName, setContractName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    vulnerabilities: Vulnerability[];
    riskScore: number;
    scanDuration: number;
  } | null>(null);
  const [error, setError] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const filteredVulnerabilities =
    scanResult && scanResult.vulnerabilities
      ? severityFilter === 'all'
        ? scanResult.vulnerabilities
        : scanResult.vulnerabilities.filter((v) => v.severity === severityFilter)
      : [];

  const handleDownloadReport = () => {
    if (!scanResult) return;

    const contractLabel =
      contractName ||
      (scanType === 'github' ? githubUrl.split('/').pop()?.replace('.sol', '') || 'contract' : 'contract');

    const data = {
      contractName: contractLabel,
      scannedAt: new Date().toISOString(),
      scanType,
      ...scanResult,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contractLabel}-security-report.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const canScan = () => {
    if (!user || !profile) return false;
    if (profile.subscription_tier !== 'free') return true;
    return profile.free_scans_used < 5;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedCode(event.target?.result as string);
        setContractName(file.name.replace('.sol', ''));
      };
      reader.readAsText(file);
    }
  };

  const handleScan = async () => {
    if (!user || !profile) {
      setError('Please sign in to scan contracts');
      onNavigate('auth');
      return;
    }

    if (!canScan()) {
      setError('You have used all 5 free scans. Please connect your wallet to continue.');
      onNavigate('wallet');
      return;
    }

    setError('');
    setScanning(true);
    setScanResult(null);

    try {
      let code = '';
      let sourceUrl = '';
      let name = contractName;

      if (scanType === 'github') {
        if (!githubUrl) {
          throw new Error('Please enter a GitHub URL');
        }
        code = await fetchGitHubContract(githubUrl);
        sourceUrl = githubUrl;
        name = githubUrl.split('/').pop()?.replace('.sol', '') || 'Unknown';
      } else {
        if (!uploadedCode) {
          throw new Error('Please upload a contract file');
        }
        code = uploadedCode;
        sourceUrl = 'file_upload';
      }

      const result = await analyzeContract(code);

      const { error: scanError } = await supabase
        .from('contract_scans')
        .insert({
          user_id: user.id,
          contract_name: name,
          contract_code: code,
          scan_type: scanType === 'github' ? 'github_repo' : 'file_upload',
          source_url: sourceUrl,
          status: 'completed',
          vulnerability_count: result.vulnerabilities.length,
          risk_score: result.riskScore,
          vulnerabilities: result.vulnerabilities,
          recommendations: result.vulnerabilities.map(v => v.recommendation),
          scan_duration: result.scanDuration,
          is_paid: profile.subscription_tier !== 'free',
        })
        .select()
        .single();

      if (scanError) throw scanError;

      if (profile.subscription_tier === 'free') {
        await supabase
          .from('profiles')
          .update({
            free_scans_used: profile.free_scans_used + 1,
            total_scans: profile.total_scans + 1,
          })
          .eq('id', user.id);
      } else {
        await supabase
          .from('profiles')
          .update({
            total_scans: profile.total_scans + 1,
          })
          .eq('id', user.id);
      }

      await refreshProfile();
      setScanResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to scan contract');
    } finally {
      setScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Smart Contract Scanner</h1>
          <p className="text-xl text-gray-600">
            Upload your contract or paste a GitHub URL for instant AI-powered security analysis
          </p>
          {user && profile && (
            <p className="text-sm text-gray-500 mt-2">
              {profile.subscription_tier === 'free'
                ? `${5 - profile.free_scans_used} free scans remaining`
                : 'Unlimited scans'}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 max-w-3xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-4xl mx-auto">
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              <button
                onClick={() => setScanType('upload')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  scanType === 'upload'
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="w-5 h-5 inline-block mr-2" />
                Upload File
              </button>
              <button
                onClick={() => setScanType('github')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  scanType === 'github'
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Github className="w-5 h-5 inline-block mr-2" />
                GitHub URL
              </button>
            </div>
          </div>

          <div className="p-8">
            {scanType === 'upload' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Solidity Contract
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".sol"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileCode className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">.sol files only</p>
                  </label>
                </div>
                {uploadedCode && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <CheckCircle className="w-4 h-4 inline-block mr-2" />
                      File uploaded: {contractName}.sol
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  GitHub Contract URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/user/repo/blob/main/Contract.sol"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Paste a direct link to a .sol file on GitHub
                </p>
              </div>
            )}

            {scanType === 'upload' && uploadedCode && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Contract Name
                </label>
                <input
                  type="text"
                  value={contractName}
                  onChange={(e) => setContractName(e.target.value)}
                  placeholder="MyContract"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            )}

            <button
              onClick={handleScan}
              disabled={scanning || (!uploadedCode && !githubUrl) || !user}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center space-x-2"
            >
              {scanning ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Scanning Contract...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Scan for Vulnerabilities</span>
                </>
              )}
            </button>

            {!user && (
              <p className="mt-4 text-center text-sm text-gray-600">
                <button
                  onClick={() => onNavigate('auth')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </button>{' '}
                to start scanning
              </p>
            )}
          </div>
        </div>

        {scanResult && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Scan Results</h2>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={handleDownloadReport}
                    className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON</span>
                  </button>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${getRiskColor(scanResult.riskScore)}`}>
                      {scanResult.riskScore}
                    </div>
                    <div className="text-sm text-gray-500">Risk Score</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {scanResult.vulnerabilities.length}
                  </div>
                  <div className="text-sm text-gray-600">Issues Found</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {scanResult.vulnerabilities.filter(v => v.severity === 'critical' || v.severity === 'high').length}
                  </div>
                  <div className="text-sm text-gray-600">Critical/High</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {(scanResult.scanDuration / 1000).toFixed(1)}s
                  </div>
                  <div className="text-sm text-gray-600">Scan Time</div>
                </div>
              </div>

              {scanResult.vulnerabilities.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Vulnerabilities Found</h3>
                  <p className="text-gray-600">Your contract appears to be secure!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">Vulnerabilities Detected</h3>
                    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-600 overflow-hidden">
                      {(['all', 'critical', 'high', 'medium', 'low'] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setSeverityFilter(level)}
                          className={`px-3 py-1 border-l border-gray-200 first:border-l-0 transition-colors ${
                            severityFilter === level
                              ? 'bg-white text-blue-600'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {level === 'all'
                            ? 'All'
                            : level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredVulnerabilities.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No vulnerabilities found for this severity filter.
                    </p>
                  ) : (
                    filteredVulnerabilities.map((vuln, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getSeverityColor(vuln.severity)}`}>
                              {vuln.severity.toUpperCase()}
                            </span>
                            <span className="text-sm font-medium text-gray-700">{vuln.category}</span>
                          </div>
                          <span className="text-xs text-gray-500">{vuln.location}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{vuln.description}</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-blue-900 mb-1">Recommendation:</p>
                          <p className="text-sm text-blue-800">{vuln.recommendation}</p>
                        </div>
                        {vuln.codeSnippet && (
                          <div className="mt-3">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                              <code>{vuln.codeSnippet}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
