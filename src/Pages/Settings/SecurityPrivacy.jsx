import React, { useState } from 'react';
import { changePasswordApi, deleteMyaccountApi } from '../../services/allApi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function SecurityPrivacy() {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [changePass, setChangePass] = useState({ currentPass: "", email: "", newPass: "", confirpass: "" })
  const [deleteAcountdata, setdeleteAccountdata] = useState({ email: "", password: "" })

  const handleChangePass = async () => {
    const updatedChangePass = { ...changePass, email: user.email };
    setChangePass(updatedChangePass);

    const { confirpass, currentPass, email, newPass } = updatedChangePass;

    if (confirpass && currentPass && email && newPass) {
      if (confirpass === newPass) {
        const reqheader = {
          "content-type": "application/json",
          "authorization": `Bearer ${token}`
        };

        try {
          const result = await changePasswordApi(updatedChangePass, reqheader);
          console.log(result);

          if (result.status >= 200 && result.status <= 299) {
            setChangePass({ currentPass: "", email: "", newPass: "", confirpass: "" });
            toast.success("Password updated successfully!");
          }
        } catch (error) {
          console.log(error);
          toast.warning(error?.response?.data?.message || "Something went wrong. Please try again.");
        }
      } else {
        toast.error("Passwords do not match!");
      }
    } else {
      toast.error("Please complete the form.");
    }
  };

  const handleDeleteAccount = async () => {
   
    if (!deleteAcountdata.email || !deleteAcountdata.password) {
      toast.warning("Please fill in both fields before deleting.");
      return;
    }

    else {
      const reqheader = {
        "content-type": "application/json",
        "authorization": `Bearer ${token}`
      };
      try {
        const result = await deleteMyaccountApi(deleteAcountdata, reqheader)
        
        if (result.status == 200) {
          localStorage.clear()
          navigate('/')
        }
        else {
          toast.warning(result.response.data)
        }
      } catch (error) {
        console.log(error);

      }
    }

  };

  return (
    <div className="max-w-2xl mx-auto mb-8 animate-slideUp">
      <div className="mb-6 md:mt-0 mt-4">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Account</p>
        <p className="text-2xl font-bold text-gray-800 section-title">Security & Privacy</p>
      </div>

      {/* Password Change */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 12px rgba(24,119,242,0.07)" }}>
        <div className="flex items-center gap-2 mb-1">
          <i className="fa-solid fa-lock text-blue-500 text-sm"></i>
          <h3 className="text-base font-semibold text-gray-800">Change Password</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">Update your password for better security.</p>
        <div className="flex flex-col gap-2">
          <input value={changePass.currentPass} onChange={(e) => setChangePass({ ...changePass, currentPass: e.target.value })} type="password" placeholder="Current Password"
            className="w-full p-3 rounded-xl focus:outline-none input-glow transition-all" style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }} />
          <input value={changePass.newPass} onChange={(e) => setChangePass({ ...changePass, newPass: e.target.value })} type="password" placeholder="New Password"
            className="w-full p-3 rounded-xl focus:outline-none input-glow transition-all" style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }} />
          <input value={changePass.confirpass} onChange={(e) => setChangePass({ ...changePass, confirpass: e.target.value })} type="password" placeholder="Confirm New Password"
            className="w-full p-3 rounded-xl focus:outline-none input-glow transition-all" style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }} />
          <button onClick={handleChangePass}
            className="w-fit px-5 py-2.5 rounded-xl text-white font-semibold transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: "linear-gradient(135deg, #1877F2, #42a5f5)", boxShadow: "0 4px 14px rgba(24,119,242,0.35)" }}>
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 12px rgba(24,119,242,0.07)" }}>
        <div className="flex items-center gap-2 mb-1">
          <i className="fa-solid fa-shield-halved text-blue-500 text-sm"></i>
          <h3 className="text-base font-semibold text-gray-800">Two-Factor Authentication (2FA)</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">Enhance security by enabling 2FA.</p>
        <div className="flex items-center gap-3">
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} className="hidden" />
            <span className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${twoFactorAuth ? 'bg-green-400' : 'bg-gray-300'}`}>
              <span className="bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300" style={{ transform: twoFactorAuth ? 'translateX(24px)' : 'translateX(0px)' }}></span>
            </span>
          </label>
          <span className={`text-sm font-medium ${twoFactorAuth ? 'text-green-600' : 'text-gray-500'}`}>{twoFactorAuth ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 12px rgba(24,119,242,0.07)" }}>
        <div className="flex items-center gap-2 mb-1">
          <i className="fa-solid fa-eye-slash text-blue-500 text-sm"></i>
          <h3 className="text-base font-semibold text-gray-800">Privacy Settings</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">Manage how others interact with you.</p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" className="w-4 h-4 accent-blue-600" /> Hide my profile from search results
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" className="w-4 h-4 accent-blue-600" /> Block third-party tracking
          </label>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,240,240,0.9)", border: "1.5px solid #ffc9c9", boxShadow: "0 2px 12px rgba(239,68,68,0.07)" }}>
        <div className="flex items-center gap-2 mb-1">
          <i className="fa-solid fa-triangle-exclamation text-red-500 text-sm"></i>
          <h3 className="text-base font-semibold text-red-600">Delete Account</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">This action is permanent and cannot be undone.</p>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-5 py-2.5 rounded-xl text-white font-semibold transition-all hover:scale-[1.02] active:scale-95 w-full"
          style={{ background: "linear-gradient(135deg, #ef4444, #f87171)", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}>
          ⚠️ Danger Zone
        </button>
        {isOpen && (
          <div className="mt-3 rounded-xl p-4" style={{ background: "#fff5f5", border: "1.5px solid #fca5a5" }}>
            <p className="text-xs text-gray-500 mb-2">Once you delete your account, there is no going back.</p>
            <input onChange={(e) => setdeleteAccountdata({ ...deleteAcountdata, email: e.target.value })} type="email" placeholder="Enter your email"
              className="w-full p-2.5 rounded-xl mb-2 focus:outline-none input-glow" style={{ border: "1.5px solid #fca5a5", background: "#fff8f8" }} />
            <input onChange={(e) => setdeleteAccountdata({ ...deleteAcountdata, password: e.target.value })} type="password" placeholder="Enter your password"
              className="w-full p-2.5 rounded-xl mb-3 focus:outline-none input-glow" style={{ border: "1.5px solid #fca5a5", background: "#fff8f8" }} />
            <button onClick={handleDeleteAccount}
              className="w-full py-2.5 rounded-xl text-white font-bold transition-all hover:scale-[1.01] active:scale-95"
              style={{ background: "linear-gradient(135deg, #dc2626, #ef4444)" }}>
              Delete My Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SecurityPrivacy;
