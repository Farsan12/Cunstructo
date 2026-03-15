import React, { useEffect, useState } from "react";
import { Trash2, RefreshCw } from "lucide-react";
import { getAllPaymentsApi, deletePaymentApi } from "../../services/allApi";

function PaymentHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await getAllPaymentsApi();
      if (res?.data?.success && Array.isArray(res.data.payments)) {
        setHistory(res.data.payments);
      } else {
        const data = JSON.parse(localStorage.getItem("paymentHistory") || "[]");
        setHistory(data);
      }
    } catch (_) {
      const data = JSON.parse(localStorage.getItem("paymentHistory") || "[]");
      setHistory(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    if (record._id) {
      await deletePaymentApi(record._id);
    } else {
      const updated = history.filter((p) => p.paymentId !== record.paymentId);
      localStorage.setItem("paymentHistory", JSON.stringify(updated));
    }
    setHistory((prev) => prev.filter((p) => p.paymentId !== record.paymentId));
  };

  const handleClearAll = async () => {
    await Promise.all(history.filter((p) => p._id).map((p) => deletePaymentApi(p._id)));
    localStorage.removeItem("paymentHistory");
    setHistory([]);
  };

  const methods = ["All", "Card", "UPI", "Netbanking"];

  const filtered = history.filter((p) => {
    const matchSearch =
      p.workerName?.toLowerCase().includes(search.toLowerCase()) ||
      p.paidBy?.toLowerCase().includes(search.toLowerCase()) ||
      p.paymentId?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.method === filter;
    return matchSearch && matchFilter;
  });

  const totalAmount = filtered.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const methodColor = { Card: "#1877f2", UPI: "#16a34a", Netbanking: "#7c3aed" };
  const methodBg   = { Card: "#e8f0fe", UPI: "#dcfce7", Netbanking: "#f3e8ff" };

  return (
    <div className="w-full max-w-5xl mx-auto animate-slideUp">
      <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Admin</p>
          <p className="text-2xl font-bold text-gray-800">Payment History</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadHistory} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-500 border border-blue-200 hover:bg-blue-50 transition-all">
            <RefreshCw size={13} /> Refresh
          </button>
          {history.length > 0 && (
            <button onClick={handleClearAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-all">
              <Trash2 size={13} /> Clear All
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Payments", value: history.length, bg: "#e8f0fe", color: "#1877f2" },
              { label: "Total Amount", value: `₹${history.reduce((s, p) => s + Number(p.amount || 0), 0).toLocaleString("en-IN")}`, bg: "#dcfce7", color: "#16a34a" },
              { label: "Via UPI", value: history.filter((p) => p.method === "UPI").length, bg: "#f3e8ff", color: "#7c3aed" },
              { label: "Via Card", value: history.filter((p) => p.method === "Card").length, bg: "#fef3c7", color: "#d97706" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background: s.bg, border: `1px solid ${s.color}22` }}>
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mb-5 items-center">
            <input type="text" placeholder="Search by worker, user or payment ID..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-sm focus:outline-none" style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }} />
            <div className="flex gap-2 flex-wrap">
              {methods.map((m) => (
                <button key={m} onClick={() => setFilter(m)} className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: filter === m ? "#1877f2" : "#f0f4ff", color: filter === m ? "#fff" : "#6b7280", border: filter === m ? "1.5px solid #1877f2" : "1.5px solid #c7d7fa" }}>{m}</button>
              ))}
            </div>
          </div>

          {(filter !== "All" || search) && (
            <p className="text-xs text-gray-400 mb-3">
              Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""} - Total: <span className="font-semibold text-green-600">₹{totalAmount.toLocaleString("en-IN")}</span>
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-2xl" style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #dce9ff" }}>
              <span className="text-4xl mb-3">💳</span>
              <p className="text-gray-500 font-medium">No payment records found</p>
              <p className="text-xs text-gray-400 mt-1">Payments made by users will appear here</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((p, index) => {
                const dateVal = p.createdAt || p.date;
                return (
                  <div key={p.paymentId || index} className="flex items-center justify-between p-4 rounded-2xl animate-fadeIn"
                    style={{ background: "rgba(255,255,255,0.95)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 10px rgba(24,119,242,0.07)", animationDelay: `${index * 30}ms` }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ background: methodBg[p.method] || "#f0f4ff" }}>
                        {p.method === "Card" ? "💳" : p.method === "UPI" ? "📲" : "🏦"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800 text-sm truncate">{p.workerName || "-"}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: methodBg[p.method] || "#f0f4ff", color: methodColor[p.method] || "#1877f2" }}>{p.method}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">Paid by <span className="font-medium text-gray-600">{p.paidBy}</span>{p.paidByEmail && <span className="ml-1 text-gray-400">({p.paidByEmail})</span>}</p>
                        {p.note && <p className="text-xs text-blue-400 mt-0.5 truncate">"{p.note}"</p>}
                        <p className="text-xs text-gray-300 mt-0.5 font-mono">{p.paymentId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ml-2">
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-sm">₹{Number(p.amount).toLocaleString("en-IN")}</p>
                        <p className="text-xs text-gray-400">{dateVal ? new Date(dateVal).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-"}</p>
                        <p className="text-xs text-gray-300">{dateVal ? new Date(dateVal).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                      </div>
                      <button onClick={() => handleDelete(p)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={15} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PaymentHistory;
