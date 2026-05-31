import { useState } from "react";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Clock, 
  ClipboardPaste, 
  ScanLine,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  Info
} from "lucide-react";

export function WalletWithdraw() {
  const [selectedCurrency, setSelectedCurrency] = useState("TON");
  
  return (
    <div className="flex justify-center bg-black min-h-screen font-sans">
      <div className="w-[390px] bg-[#0f0f11] text-white overflow-hidden shadow-2xl relative flex flex-col h-[844px] sm:h-[100dvh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-[#0f0f11]/90 backdrop-blur-md z-10 border-b border-white/5">
          <button className="p-2 -ml-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold tracking-wide text-gray-100">My Wallet</h1>
          <button className="p-2 -mr-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10">
            <ShieldCheck size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-8 scrollbar-hide">
          {/* Balance Overview */}
          <div className="px-4 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* TON Card */}
              <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/5 shadow-lg">
                <p className="text-xs text-gray-400 font-medium mb-1">Available Balance</p>
                <div className="flex items-baseline space-x-1 mb-1">
                  <span className="text-xl font-bold text-[#0098EA] tracking-tight">124.50</span>
                  <span className="text-sm font-semibold text-[#0098EA]">TON</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">≈ $361.05 USD</p>
                <button className="w-full py-2 bg-[#0098EA]/10 hover:bg-[#0098EA]/20 text-[#0098EA] rounded-xl text-sm font-semibold transition-colors border border-[#0098EA]/20">
                  Withdraw TON
                </button>
              </div>

              {/* USDT Card */}
              <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/5 shadow-lg">
                <p className="text-xs text-gray-400 font-medium mb-1">Available Balance</p>
                <div className="flex items-baseline space-x-1 mb-1">
                  <span className="text-xl font-bold text-[#26A17B] tracking-tight">234.80</span>
                  <span className="text-sm font-semibold text-[#26A17B]">USDT</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">≈ $234.80 USD</p>
                <button className="w-full py-2 bg-[#26A17B]/10 hover:bg-[#26A17B]/20 text-[#26A17B] rounded-xl text-sm font-semibold transition-colors border border-[#26A17B]/20">
                  Withdraw USDT
                </button>
              </div>
            </div>

            {/* Pending / Locked Chips */}
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide py-1">
              <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 whitespace-nowrap">
                <Lock size={14} className="text-amber-500" />
                <span className="text-xs font-medium text-amber-500">Escrow locked: 89.20 USDT</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2 whitespace-nowrap">
                <Clock size={14} className="text-purple-400" />
                <span className="text-xs font-medium text-purple-400">Pending commission: 12.40 USDT</span>
              </div>
            </div>
          </div>

          {/* Withdraw Form */}
          <div className="px-4 mb-6">
            <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0098EA]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <h2 className="text-base font-semibold text-white mb-4 flex items-center">
                Withdraw Funds
              </h2>

              {/* Currency Selector */}
              <div className="flex bg-[#2c2c2e] p-1 rounded-xl mb-5">
                {["TON", "USDT-TON", "USDT-TRC20"].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setSelectedCurrency(curr)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      selectedCurrency === curr
                        ? "bg-[#3c3c3e] text-white shadow-sm"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>

              {/* Address Input */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Send to wallet</label>
                <div className="flex items-center bg-[#0f0f11] border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-[#0098EA]/50 transition-colors">
                  <input
                    type="text"
                    defaultValue="UQAb4x...7Kp"
                    className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder-gray-600 font-mono"
                    placeholder="Wallet address"
                  />
                  <div className="flex items-center space-x-2 pl-2 border-l border-white/10 ml-2">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <ClipboardPaste size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <ScanLine size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Amount ({selectedCurrency})</label>
                <div className="flex items-center bg-[#0f0f11] border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-[#0098EA]/50 transition-colors">
                  <input
                    type="text"
                    defaultValue="50"
                    className="flex-1 bg-transparent text-lg font-semibold text-white focus:outline-none placeholder-gray-600"
                    placeholder="0.00"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">{selectedCurrency}</span>
                    <button className="bg-white/10 hover:bg-white/20 text-xs font-semibold px-2 py-1 rounded text-white transition-colors">
                      Max
                    </button>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="bg-[#0f0f11] rounded-xl p-3 mb-5 border border-white/5">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Amount</span>
                    <span className="text-gray-200 font-medium">50 TON</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Platform fee (0.5%)</span>
                    <span className="text-gray-200 font-medium">0.25 TON</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Network gas</span>
                    <span className="text-gray-200 font-medium">~0.01 TON</span>
                  </div>
                  <div className="h-px bg-white/10 my-1" />
                  <div className="flex justify-between text-gray-300 font-medium">
                    <span>You receive</span>
                    <span className="text-white font-bold text-sm">49.74 TON</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#0098EA] hover:bg-[#0088CC] text-white font-semibold py-3.5 rounded-xl shadow-[0_0_15px_rgba(0,152,234,0.3)] transition-all active:scale-[0.98]">
                Confirm Withdraw
              </button>

              <div className="mt-4 flex items-start space-x-2 text-red-400/80 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                <Info size={14} className="mt-0.5 shrink-0" />
                <p className="text-[11px] font-medium leading-tight">Funds sent directly on-chain. Irreversible. Verify address before confirming.</p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="px-4 mb-6">
            <h3 className="text-sm font-semibold text-white mb-3 px-1">Recent Transactions</h3>
            <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden border border-white/5">
              <div className="divide-y divide-white/5">
                {/* Tx 1 */}
                <div className="flex items-center justify-between p-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#26A17B]/10 flex items-center justify-center">
                      <ArrowDownLeft size={16} className="text-[#26A17B]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Commission — Order #8821</p>
                      <p className="text-xs text-gray-500">May 29</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#26A17B]">+0.40 USDT</p>
                  </div>
                </div>
                
                {/* Tx 2 */}
                <div className="flex items-center justify-between p-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#26A17B]/10 flex items-center justify-center">
                      <ArrowDownLeft size={16} className="text-[#26A17B]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Order payment released</p>
                      <p className="text-xs text-gray-500">PhoneZone • May 28</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#26A17B]">+5.0 TON</p>
                  </div>
                </div>

                {/* Tx 3 */}
                <div className="flex items-center justify-between p-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <ArrowUpRight size={16} className="text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200 truncate max-w-[130px]">Withdrawal to UQAb...7Kp</p>
                      <p className="text-xs text-gray-500">May 27</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-300">-50 TON</p>
                  </div>
                </div>

                {/* Tx 4 */}
                <div className="flex items-center justify-between p-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#26A17B]/10 flex items-center justify-center">
                      <ArrowDownLeft size={16} className="text-[#26A17B]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Commission — Order #8804</p>
                      <p className="text-xs text-gray-500">May 26</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#26A17B]">+0.32 USDT</p>
                  </div>
                </div>

                {/* Tx 5 */}
                <div className="flex items-center justify-between p-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#26A17B]/10 flex items-center justify-center">
                      <ArrowDownLeft size={16} className="text-[#26A17B]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Affiliate payout</p>
                      <p className="text-xs text-gray-500">May 25</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#26A17B]">+12.40 USDT</p>
                  </div>
                </div>
              </div>
              <button className="w-full p-3 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center space-x-1">
                <span>View all transactions</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Security Section */}
          <div className="px-4 mb-8">
            <h3 className="text-sm font-semibold text-white mb-3 px-1">Wallet Security</h3>
            <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden border border-white/5">
              <div className="divide-y divide-white/5">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-200">2FA via Telegram</p>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <CheckCircle2 size={12} className="text-[#26A17B]" />
                      <span className="text-xs text-[#26A17B]">Enabled</span>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-[#0098EA] bg-[#0098EA]/10 px-3 py-1.5 rounded-lg">
                    Manage
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-200">Withdrawal whitelist</p>
                    <p className="text-xs text-gray-500 mt-0.5">1 address saved</p>
                  </div>
                  <button className="text-xs font-semibold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                    Edit
                  </button>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-200">Daily limit</p>
                    <p className="text-xs text-gray-500 mt-0.5">500 USDT</p>
                  </div>
                  <button className="text-xs font-semibold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default WalletWithdraw;
