import React, { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import profieimg from "../assets/profileimg/profileimg.webp";
import serverUrl from "../services/serverUrl";
import { reciverIdContext, selectedChattoUserContext } from "../Context/OtherPurpuseContextApi";
import { displayUserOnlineOrOflineContext } from "../Context/SocketioContext";
import { useWindowSize } from "@uidotdev/usehooks";
import { getWorkerRatingsApi, getMyRatingApi, submitRatingApi } from "../services/allApi";
import { toast } from "react-toastify";

// -- Star display (read-only) --------------------------------------------------
function StarDisplay({ avg, total }) {
  const filled = Math.round(avg);
  return (
    <div className="flex items-center gap-1 mt-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24"
          fill={s <= filled ? "#f59e0b" : "none"}
          stroke={s <= filled ? "#f59e0b" : "#d1d5db"} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-0.5">
        {avg > 0 ? `${avg} (${total})` : "No ratings"}
      </span>
    </div>
  );
}

// -- Interactive star picker ---------------------------------------------------
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="32" height="32" viewBox="0 0 24 24"
          className="cursor-pointer transition-transform hover:scale-110"
          fill={(hovered || value) >= s ? "#f59e0b" : "none"}
          stroke={(hovered || value) >= s ? "#f59e0b" : "#9ca3af"}
          strokeWidth="2"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

// -- Main WorkerCard ----------------------------------------------------------
function WorkerCard({ filterdWorker }) {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const { setreciveridResponse } = useContext(reciverIdContext);
  const { setselectduserResponse } = useContext(selectedChattoUserContext);
  const { onlineusersResponse } = useContext(displayUserOnlineOrOflineContext);

  const isOnline = onlineusersResponse?.includes(filterdWorker?._id);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isRegularUser = loggedInUser?.roll?.toLowerCase() === "user";

  // rating state
  const [ratingData, setRatingData] = useState({ average: 0, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // fetch worker's aggregate rating on mount
  useEffect(() => {
    if (!filterdWorker?._id) return;
    getWorkerRatingsApi(filterdWorker._id).then((res) => {
      if (res?.status === 200) {
        setRatingData({ average: res.data.average, total: res.data.total });
      }
    });
  }, [filterdWorker?._id]);

  const openRateModal = async (e) => {
    e.stopPropagation();
    setShowModal(true);
    const token = localStorage.getItem("token");
    if (token) {
      const res = await getMyRatingApi(filterdWorker._id, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });
      if (res?.status === 200 && res.data.rating) {
        setStars(res.data.rating.stars);
        setReview(res.data.rating.review || "");
      } else {
        setStars(0);
        setReview("");
      }
    }
  };

  const handleSubmitRating = async () => {
    if (!stars) return toast.warn("Please select a star rating");
    setSubmitting(true);
    const token = localStorage.getItem("token");
    const res = await submitRatingApi(
      { workerId: filterdWorker._id, stars, review },
      { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    );
    setSubmitting(false);
    if (res?.status === 200) {
      toast.success("Rating submitted!");
      getWorkerRatingsApi(filterdWorker._id).then((r) => {
        if (r?.status === 200)
          setRatingData({ average: r.data.average, total: r.data.total });
      });
      setShowModal(false);
    } else {
      toast.error("Failed to submit rating");
    }
  };

  const handileChattoworker = (id) => {
    setreciveridResponse(id);
    localStorage.setItem("reciverid", id);
    if (width < 768) {
      setreciveridResponse(filterdWorker._id);
      localStorage.setItem("toReciverData", JSON.stringify(filterdWorker));
      navigate("/chatpanel");
    } else {
      localStorage.setItem("toReciverData", JSON.stringify(filterdWorker));
      setreciveridResponse(filterdWorker._id);
      navigate("/chats");
      setselectduserResponse(filterdWorker._id);
    }
  };

  const handlePayment = (e) => {
    e.stopPropagation();
    navigate(
      `/payment?workerId=${filterdWorker._id}&workerName=${encodeURIComponent(filterdWorker.username)}`
    );
  };

  return (
    <>
      {/* Rating Modal — rendered via portal so it escapes card's transform context */}
      {showModal && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 9999, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { e.stopPropagation(); setShowModal(false); }}
        >
          <div
            className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <img
                src={filterdWorker?.profilepic ? `${serverUrl}/uploads/${filterdWorker?.profilepic}` : profieimg}
                alt={filterdWorker?.username}
                className="w-11 h-11 rounded-full object-cover border-2 border-blue-100"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">{filterdWorker?.username}</p>
                <p className="text-xs text-gray-400">Rate this worker</p>
              </div>
              <button
                className="ml-auto text-gray-400 hover:text-gray-600 text-xl leading-none"
                onClick={(e) => { e.stopPropagation(); setShowModal(false); }}
              >&times;</button>
            </div>

            {/* Stars */}
            <div className="flex flex-col items-center gap-2">
              <StarPicker value={stars} onChange={setStars} />
              {stars > 0 && (
                <span className="text-sm font-medium text-amber-500">{LABELS[stars]}</span>
              )}
            </div>

            {/* Review */}
            <textarea
              rows={3}
              placeholder="Write a review (optional)..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            {/* Submit */}
            <button
              onClick={handleSubmitRating}
              disabled={submitting || !stars}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
              style={{ background: "linear-gradient(90deg,#f59e0b,#fbbf24)" }}
            >
              {submitting ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </div>
      , document.body)}

      {/* Card */}
      <div
        onClick={() => handileChattoworker(filterdWorker._id)}
        className="group flex flex-col gap-2 p-3 bg-white rounded-2xl cursor-pointer transition-all duration-250 sm:w-[90%]"
        style={{ border: "1px solid #e8edf5", boxShadow: "0 2px 12px rgba(24,119,242,0.08)" }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(24,119,242,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(24,119,242,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        {/* Top Row */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={filterdWorker?.profilepic ? `${serverUrl}/uploads/${filterdWorker?.profilepic}` : profieimg}
              alt={filterdWorker?.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
            />
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? "bg-green-400" : "bg-gray-300"}`} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-800 font-semibold truncate text-sm group-hover:text-blue-600 transition-colors">
              {filterdWorker?.username}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              Exp: {filterdWorker?.experience === "" || !filterdWorker?.experience ? "0" : filterdWorker?.experience} yrs
              {filterdWorker?.location ? ` · ${filterdWorker.location}` : ""}
            </p>
            {filterdWorker?.skills?.length > 0 && (
              <p className="text-xs text-blue-500 truncate mt-0.5">
                {filterdWorker.skills.slice(0, 2).join(" · ")}
                {filterdWorker.skills.length > 2 ? ` +${filterdWorker.skills.length - 2}` : ""}
              </p>
            )}
            <StarDisplay avg={ratingData.average} total={ratingData.total} />
          </div>

          {/* Arrow */}
          <div className="text-blue-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* Action buttons — only for regular users */}
        {isRegularUser && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={openRateModal}
              className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-white transition-all duration-200 active:scale-95"
              style={{ background: "linear-gradient(90deg,#f59e0b,#fbbf24)", boxShadow: "0 2px 8px rgba(245,158,11,0.3)" }}
            >
              Rate Worker
            </button>
            <button
              onClick={handlePayment}
              className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-white transition-all duration-200 active:scale-95"
              style={{ background: "linear-gradient(90deg,#1877f2,#0ea5e9)", boxShadow: "0 2px 8px rgba(24,119,242,0.25)" }}
            >
              Pay Worker
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default WorkerCard;