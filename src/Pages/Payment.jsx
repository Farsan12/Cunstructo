import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../Componets/Header";
import { savePaymentApi } from "../services/allApi";
import { sendmessageApi } from "../services/allApi";

function Payment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const workerName = searchParams.get("workerName") || "Worker";

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paid, setPaid] = useState(false);
  const [paidAmount, setPaidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  // Generate a dummy payment ID
  const generateDummyPaymentId = () =>
    "pay_" + Math.random().toString(36).substr(2, 14).toUpperCase();

  const handlePay = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError("");
    setShowModal(true);
  };

  const handleModalPay = (e) => {
    e.preventDefault();
    setModalLoading(true);
    // Simulate processing delay
    setTimeout(async () => {
      const dummyId = generateDummyPaymentId();
      setModalLoading(false);
      setShowModal(false);
      setPaidAmount(amount);
      setPaymentId(dummyId);
      setPaid(true);

      // Save payment to backend DB
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const record = {
        paymentId: dummyId,
        amount: Number(amount),
        workerName,
        workerId: searchParams.get("workerId") || "",
        paidBy: loggedInUser?.username || "Unknown",
        paidByEmail: loggedInUser?.email || "",
        note: note || "",
        method: activeTab,
      };
      try {
        await savePaymentApi(record, { "Content-Type": "application/json" });
      } catch (_) {}
      // Also keep localStorage as fallback
      const existing = JSON.parse(localStorage.getItem("paymentHistory") || "[]");
      localStorage.setItem("paymentHistory", JSON.stringify([{ ...record, date: new Date().toISOString() }, ...existing]));

      // Send payment as a GPay-style chat message to the worker
      const workerId = searchParams.get("workerId") || "";
      const token = localStorage.getItem("token");
      if (workerId && token) {
        const reqheader = { "content-type": "application/json", authorization: `Bearer ${token}` };
        const paymentMsg = {
          text: `💸 Paid ₹${Number(amount).toLocaleString("en-IN")} to ${workerName}`,
          type: "payment",
          paymentData: {
            paymentId: dummyId,
            amount: Number(amount),
            method: activeTab,
            workerName,
            note: note || "",
          },
        };
        try { await sendmessageApi(workerId, paymentMsg, reqheader); } catch (_) {}
      }
    }, 2000);
  };

  return (
    <>
    <div className="min-h-screen flex flex-col" style={{ background: "#f0f4ff" }}>
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        {!paid ? (
          /* ─── Payment Form ─── */
          <div
            className="w-full max-w-md bg-white rounded-3xl p-8"
            style={{ boxShadow: "0 8px 40px rgba(24,119,242,0.15)", border: "1px solid #e8edf5" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-blue-50 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1877f2" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div>
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Secure Payment</p>
                <h2 className="text-2xl font-bold text-gray-900">Pay Worker</h2>
              </div>
            </div>

            {/* Worker Info */}
            <div
              className="flex items-center gap-3 p-4 rounded-2xl mb-6"
              style={{ background: "#f0f4ff", border: "1px solid #c7d7fa" }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #1877f2, #0ea5e9)" }}
              >
                {workerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{workerName}</p>
                <p className="text-xs text-gray-400">Professional Worker</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">Verified ✓</span>
              </div>
            </div>

            <form onSubmit={handlePay} className="flex flex-col gap-4">
              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold text-lg">₹</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setError(""); }}
                    className="w-full py-3 pl-10 pr-4 rounded-xl focus:outline-none text-gray-800 font-semibold text-lg transition-all"
                    style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                    onFocus={e => (e.target.style.border = "1.5px solid #1877f2")}
                    onBlur={e => (e.target.style.border = "1.5px solid #c7d7fa")}
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                  Note (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Plumbing work payment"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl focus:outline-none text-gray-700 text-sm transition-all"
                  style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                  onFocus={e => (e.target.style.border = "1.5px solid #1877f2")}
                  onBlur={e => (e.target.style.border = "1.5px solid #c7d7fa")}
                />
              </div>

              {/* Quick Amount Chips */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Quick select:</p>
                <div className="flex gap-2 flex-wrap">
                  {[200, 500, 1000, 2000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(String(val))}
                      className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                      style={{
                        border: amount === String(val) ? "1.5px solid #1877f2" : "1.5px solid #c7d7fa",
                        background: amount === String(val) ? "#e8f0fe" : "#f8faff",
                        color: amount === String(val) ? "#1877f2" : "#6b7280",
                      }}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Razorpay Pay Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base mt-2 transition-all duration-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(90deg, #1877f2 0%, #0ea5e9 100%)", boxShadow: "0 4px 16px rgba(24,119,242,0.35)" }}
              >
                <img src="https://razorpay.com/favicon.ico" alt="razorpay" className="w-5 h-5 rounded" />
                Pay with Razorpay
              </button>
            </form>

            {/* Security Note */}
            <p className="text-center text-xs text-gray-400 mt-4">
              🔒 Powered by Razorpay · 100% Secure & Encrypted
            </p>
          </div>
        ) : (
          /* ─── Success Screen ─── */
          <div
            className="w-full max-w-md bg-white rounded-3xl p-10 flex flex-col items-center text-center"
            style={{ boxShadow: "0 8px 40px rgba(24,119,242,0.15)", border: "1px solid #e8edf5" }}
          >
            {/* Animated checkmark */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                boxShadow: "0 8px 32px rgba(34,197,94,0.4)",
                animation: "scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">Payment Successful!</h2>
            <p className="text-gray-500 text-sm mb-6">
              You have successfully paid{" "}
              <span className="font-semibold text-gray-700">₹{paidAmount}</span> to{" "}
              <span className="font-semibold text-blue-600">{workerName}</span>
              {note && (
                <span className="block text-xs text-gray-400 mt-1">"{note}"</span>
              )}
            </p>

            {/* Receipt Card */}
            <div
              className="w-full rounded-2xl p-4 mb-6 text-left"
              style={{ background: "#f0f4ff", border: "1px solid #c7d7fa" }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Recipient</span>
                <span className="font-semibold text-gray-700">{workerName}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-green-600">₹{paidAmount}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Payment ID</span>
                <span className="text-xs text-gray-500 break-all">{paymentId}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-semibold">✓ Paid via Razorpay</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-700">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => navigate(-2)}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm border transition-all"
                style={{ border: "1.5px solid #c7d7fa", color: "#1877f2", background: "#f8faff" }}
              >
                Back to Workers
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm text-white transition-all"
                style={{ background: "linear-gradient(90deg, #1877f2 0%, #0ea5e9 100%)" }}
              >
                Go Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* ─── Dummy Razorpay Modal ─── */}
    {showModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.55)" }}
      >
        <div
          className="bg-white w-full max-w-sm rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
        >
          {/* Razorpay-style top bar */}
          <div className="flex items-center justify-between px-5 py-4" style={{ background: "#2d88ff" }}>
            <div className="flex items-center gap-2">
              <img src="https://razorpay.com/favicon.ico" alt="razorpay" className="w-6 h-6 rounded" />
              <div>
                <p className="text-white font-bold text-sm">Constructo</p>
                <p className="text-blue-100 text-xs">₹{amount}</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-white text-xl font-bold leading-none hover:opacity-70"
            >
              ×
            </button>
          </div>

          {/* Payment tabs */}
          <div className="flex border-b" style={{ borderColor: "#e8edf5" }}>
            {["Card", "UPI", "Netbanking"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className="flex-1 py-2.5 text-xs font-semibold transition-colors"
                style={{
                  color: activeTab === t ? "#2d88ff" : "#9ca3af",
                  borderBottom: activeTab === t ? "2px solid #2d88ff" : "2px solid transparent",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleModalPay} className="p-5 flex flex-col gap-3">

            {/* ── Card Tab ── */}
            {activeTab === "Card" && (
              <>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Card Number</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4111 1111 1111 1111"
                    value={cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setCardNumber(v.replace(/(.{4})/g, "$1 ").trim());
                    }}
                    className="w-full py-2.5 px-3 rounded-lg text-sm focus:outline-none"
                    style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-lg text-sm focus:outline-none"
                    style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Expiry</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setExpiry(v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v);
                      }}
                      className="w-full py-2.5 px-3 rounded-lg text-sm focus:outline-none"
                      style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      className="w-full py-2.5 px-3 rounded-lg text-sm focus:outline-none"
                      style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── UPI Tab ── */}
            {activeTab === "UPI" && (
              <>
                <p className="text-xs text-gray-400">Enter your UPI ID to pay instantly</p>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-lg text-sm focus:outline-none"
                    style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                    required
                  />
                </div>
                {/* Popular UPI apps */}
                <div>
                  <p className="text-xs text-gray-400 mb-2">Or pay using:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: "GPay",    upi: "user@oksbi",    logo: "https://www.google.com/s2/favicons?domain=pay.google.com&sz=64" },
                      { name: "PhonePe", upi: "user@ybl",      logo: "https://www.google.com/s2/favicons?domain=phonepe.com&sz=64" },
                      { name: "Paytm",   upi: "user@paytm",   logo: "https://www.google.com/s2/favicons?domain=paytm.com&sz=64" },
                      { name: "BHIM",    upi: "user@upi",     logo: "https://www.google.com/s2/favicons?domain=bhimupi.org.in&sz=64" },
                    ].map((app) => (
                      <button
                        key={app.name}
                        type="button"
                        onClick={() => setUpiId(app.upi)}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                        style={{
                          border: upiId === app.upi ? "1.5px solid #2d88ff" : "1.5px solid #e8edf5",
                          background: upiId === app.upi ? "#e8f0fe" : "#fafafa",
                        }}
                      >
                        <img
                          src={app.logo}
                          alt={app.name}
                          className="w-10 h-10 rounded-xl object-contain bg-white p-1"
                          onError={(e) => { e.target.style.display="none"; }}
                        />
                        <span className="text-xs text-gray-600 font-medium">{app.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── Netbanking Tab ── */}
            {activeTab === "Netbanking" && (
              <>
                <p className="text-xs text-gray-400">Select your bank to continue</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "SBI",      logo: "https://www.google.com/s2/favicons?domain=sbi.co.in&sz=64",        color: "#2563eb" },
                    { name: "HDFC",     logo: "https://www.google.com/s2/favicons?domain=hdfcbank.com&sz=64",     color: "#dc2626" },
                    { name: "ICICI",    logo: "https://www.google.com/s2/favicons?domain=icicibank.com&sz=64",    color: "#ca8a04" },
                    { name: "Axis",     logo: "https://www.google.com/s2/favicons?domain=axisbank.com&sz=64",     color: "#7c3aed" },
                    { name: "Kotak",    logo: "https://www.google.com/s2/favicons?domain=kotak.com&sz=64",        color: "#16a34a" },
                    { name: "Yes Bank", logo: "https://www.google.com/s2/favicons?domain=yesbank.in&sz=64",       color: "#0891b2" },
                  ].map((bank) => (
                    <button
                      key={bank.name}
                      type="button"
                      onClick={() => setSelectedBank(bank.name)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        border: selectedBank === bank.name ? `1.5px solid ${bank.color}` : "1.5px solid #e8edf5",
                        background: selectedBank === bank.name ? "#f0f4ff" : "#fafafa",
                        color: selectedBank === bank.name ? bank.color : "#374151",
                      }}
                    >
                      <img
                        src={bank.logo}
                        alt={bank.name}
                        className="w-8 h-8 rounded-md object-contain bg-white p-0.5 flex-shrink-0"
                        onError={(e) => { e.target.style.display="none"; }}
                      />
                      {bank.name}
                    </button>
                  ))}
                </div>
                {!selectedBank && (
                  <p className="text-xs text-red-400 text-center">Please select a bank to proceed</p>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={modalLoading || (activeTab === "Netbanking" && !selectedBank)}
              className="w-full py-3 rounded-xl text-white font-bold text-sm mt-1 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(90deg, #2d88ff 0%, #0ea5e9 100%)" }}
            >
              {modalLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Processing…
                </>
              ) : (
                `Pay ₹${amount}`
              )}
            </button>

            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              🔒 Secured by Razorpay
            </p>
          </form>
        </div>
      </div>
    )}
    </>
  );
}

export default Payment;
