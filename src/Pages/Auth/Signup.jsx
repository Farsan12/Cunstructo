import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import signupimg from "../../assets/Authimg/signupimg.jpg";
import { displaycategoryContext } from "../../Context/OtherPurpuseContextApi";
import { RegisterApi } from "../../services/allApi";
import { toast } from "react-toastify";

function Signup({ isworker }) {

  const navigate = useNavigate();
  const { categoryResponse } = useContext(displaycategoryContext);

  const [rollSelect, setrollSelect] = useState(isworker ? "worker" : "user")
  const [Signupdata, setSignupdata] = useState({
    username: "",
    email: "",
    password: "",
    confpass: "",
    mobileno: "",
    aadhar: "",
    location: "",
    dob: "",
    gender: "",
    skills: [],
    experience: "",
    status: "",
    profile: "",
    roll: "",
  });

  useEffect(() => {
    setSignupdata((prev) => ({ ...prev, roll: rollSelect }));
  }, [rollSelect]);


  const handleInputChange = (e) => {
    setSignupdata({ ...Signupdata, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (category) => {
    setSignupdata((prev) => ({
      ...prev,
      skills: prev.skills.includes(category)
        ? prev.skills.filter((item) => item !== category)
        : [...prev.skills, category],
    }));
  };


  const { username, email, password, confpass, roll, mobileno, aadhar, location, skills, status } = Signupdata;

  const handleWorkerSignUp = async (e) => {

    e.preventDefault();
    console.log("worker registeration ", Signupdata);

    if (username && email && password && confpass && roll && mobileno && aadhar && location && skills && status) {



      if (password !== confpass) {
        toast.error("Passwords do not match!");
        return;
      }

      try {

        const result = await RegisterApi(Signupdata)
        console.log(result);
        if (result.status >= 200 && result.status <= 299) {
          localStorage.setItem("user", JSON.stringify(result.data.user))
          localStorage.setItem("token", result.data.token)
          navigate("/");
        }

      } catch (error) {
        console.log(error);
      }
    }
    else {
      toast.warning("please compleate form")
    }

  };

  const handleUserSignUp = async (e) => {
    e.preventDefault();

    setSignupdata({ ...Signupdata, roll: rollSelect });

    if (username && email && password && confpass && roll) {

      if (password !== confpass) {
        toast.error("Passwords do not match!");
        return;
      }

      try {
        const result = await RegisterApi(Signupdata)

        console.log(result);
        if (result.status >= 200 && result.status <= 299) {

          localStorage.setItem("user", JSON.stringify(result.data.user))
          localStorage.setItem("token", result.data.token)
          navigate("/");
        }
        else {
          toast.error(result.response.data.message)
        }
      } catch (error) {
        console.log(error);

      }

    }
    else {
      toast.warning("please complete form")
    }

  };


  return (
    <div className="min-h-screen flex w-full justify-center items-center py-8"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d47c8 40%, #1877F2 70%, #42a5f5 100%)" }}>

      {/* Background Decorative Shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute animate-float w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #60a1fa, transparent)", top: "-180px", left: "-160px" }} />
        <div className="absolute animate-float delay-300 w-[420px] h-[420px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #1565c0, transparent)", bottom: "-120px", right: "-100px" }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      <div className="relative z-10 flex justify-center items-center w-full px-6">
          <div className="animate-scaleIn xl:w-[38%] md:w-[65%] sm:w-[520px] w-full p-7 rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.11)",
              backdropFilter: "blur(22px)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)"
            }}>
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-glowPulse"
                style={{ background: "linear-gradient(145deg, #1565c0, #1877F2, #42a5f5)", boxShadow: "0 8px 28px rgba(24,119,242,0.55)" }}>
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 18h18v2.5H3V18z" fill="white" />
                  <path d="M12 3C7.58 3 4 6.8 4 11.5V18h16v-6.5C20 6.8 16.42 3 12 3z" fill="white" fillOpacity="0.92" />
                  <path d="M10.5 5v8M13.5 5v8" stroke="rgba(21,101,192,0.5)" strokeWidth="1.4" strokeLinecap="round" />
                  <rect x="9" y="2" width="6" height="2.5" rx="1.25" fill="white" />
                </svg>
              </div>
              <span className="text-white font-black text-lg tracking-widest opacity-90">CONSTRUCTO</span>
            </div>
            <h2 className="text-2xl font-bold text-white text-center tracking-tight mb-1">Create Account</h2>
            <p className="text-blue-200 text-sm text-center mb-6">
              {isworker ? "Register as a professional worker" : "Join as a user"}
            </p>

            <form className="flex flex-col gap-3.5">
              <input
                type="text"
                name="username"
                value={Signupdata.username}
                placeholder="Full Name"
                autoComplete="username"
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl text-white placeholder-blue-200 focus:outline-none input-glow transition-all"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              />
              <input
                type="email"
                name="email"
                value={Signupdata.email}
                placeholder="Email address"
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl text-white placeholder-blue-200 focus:outline-none input-glow transition-all"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              />
              <div className="flex gap-3">
                <input
                  type="password"
                  name="password"
                  value={Signupdata.password}
                  placeholder="Password"
                  autoComplete="new-password"
                  onChange={handleInputChange}
                  className="p-3 w-1/2 rounded-xl text-white placeholder-blue-200 focus:outline-none input-glow transition-all"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
                />
                <input
                  type="password"
                  name="confpass"
                  value={Signupdata.confpass}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  onChange={handleInputChange}
                  className="p-3 w-1/2 rounded-xl text-white placeholder-blue-200 focus:outline-none input-glow transition-all"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
                />
              </div>

              {isworker && (
                <>
                  <div className="flex gap-3">
                    <input
                      type="tel"
                      name="mobileno"
                      value={Signupdata.mobileno}
                      placeholder="Mobile Number"
                      onChange={handleInputChange}
                      className="p-3 w-1/2 rounded-xl text-white placeholder-blue-200 focus:outline-none input-glow transition-all"
                      style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
                    />
                    <input
                      type="text"
                      name="aadhar"
                      value={Signupdata.aadhar}
                      placeholder="Aadhar Number"
                      onChange={handleInputChange}
                      className="p-3 w-1/2 rounded-xl text-white placeholder-blue-200 focus:outline-none input-glow transition-all"
                      style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
                    />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={Signupdata.location}
                    placeholder="Location"
                    onChange={handleInputChange}
                    className="p-3 rounded-xl text-white placeholder-blue-200 focus:outline-none input-glow transition-all"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
                  />
                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <label className="block text-white font-semibold mb-3 text-sm">Select Skills:</label>
                    <div className="flex flex-wrap gap-2">
                      {categoryResponse?.length > 0 ? categoryResponse.map((category, index) => (
                        <label key={index} className="flex items-center gap-1.5 text-white text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-white/40 w-3.5 h-3.5 accent-blue-400"
                            checked={Signupdata.skills.includes(category.categoryname)}
                            onChange={() => handleCategoryChange(category.categoryname)}
                          />
                          <span className="text-blue-100">{category.categoryname}</span>
                        </label>
                      )) : (
                        <span className="text-blue-200 text-xs">Loading skills...</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-white text-sm font-semibold mb-1">Availability Status</label>
                    <select
                      name="status"
                      value={Signupdata.status}
                      onChange={handleInputChange}
                      className="p-3 rounded-xl text-white focus:outline-none input-glow"
                      style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
                    >
                      <option className="text-black" value="">Select status</option>
                      <option className="text-black" value="available">Available</option>
                      <option className="text-black" value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </>
              )}

              <button
                onClick={isworker ? handleWorkerSignUp : handleUserSignUp}
                className="w-full py-3 mt-1 rounded-xl text-white font-bold text-base tracking-wide transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #1877F2, #42a5f5)",
                  boxShadow: "0 4px 16px rgba(24,119,242,0.5)"
                }}>
                Sign Up
              </button>
            </form>
          </div>
        </div>
    </div>
  );
}

export default Signup;
