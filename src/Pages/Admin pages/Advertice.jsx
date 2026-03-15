import React, { useState, useEffect, useContext } from "react";
import { Trash2, Edit } from "lucide-react";
import { addADDSApi, deleteADDSApi, getADDSApi, updateADDSApi } from "../../services/allApi";
import serverUrl from "../../services/serverUrl";
import advertice from "../../assets/advertice.jpg"
import { toast } from "react-toastify";
import { displayadvertisContext } from "../../Context/OtherPurpuseContextApi";

function Advertice() {
    const { refreshAds } = useContext(displayadvertisContext);
    const [adImage, setAdImage] = useState();
    const [adsdata, setAdsdata] = useState({ adsimg: "", adsname: "" });
    const [editingAd, setEditingAd] = useState(null);
    const [getAds, setAllads] = useState([]);

    useEffect(() => {
        getAllAds();
    }, []);

    const getAllAds = async () => {
        try {
            const result = await getADDSApi();
            setAllads([...result.data]); // Ensure state updates properly
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (adsdata.adsimg instanceof File) {
            const imageUrl = URL.createObjectURL(adsdata.adsimg);
            setAdImage(imageUrl);
        } else if (adsdata.adsimg) {
            setAdImage(`${serverUrl}/uploads/${adsdata.adsimg}`);
        }
    }, [adsdata.adsimg]);

    const handleAddOrUpdateAd = async (e) => {
        e.preventDefault();
        const { adsname, adsimg } = adsdata;

        if (adsname && adsimg) {
            try {
                const reqbody = new FormData();
                reqbody.append("adsname", adsname.toLowerCase());
                reqbody.append("adsimg", adsimg);

                const reqheader = { 
                    "Content-type": "multipart/form-data" };

                if (editingAd) {
                    const result = await updateADDSApi(editingAd._id, reqbody, reqheader);
                    setEditingAd(null);
                    if (result.status >= 200 && result.status <= 300) {
                        toast.success("Successfully updated Advertisement!")
                    }
                } else {
                    const result = await addADDSApi(reqbody, reqheader);
                    if (result.status >= 200 && result.status <= 300) {
                        toast.success("Successfully added Advertisement!")
                    }
                }

                getAllAds();
                refreshAds();
                setAdsdata({ adsname: "", adsimg: "" });
                setAdImage("");
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleDeleteAd = async (id) => {
        try {
            const result = await deleteADDSApi(id);
            if (result.status >= 200 && result.status <= 300) {
                toast.success("Successfully removed Advertisement!")
            }
            getAllAds();
            refreshAds();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditAd = (ad) => {
        setAdsdata({ adsname: ad.adsname, adsimg: ad.adsimg });
        setAdImage(`${serverUrl}/uploads/${ad.adsimg}`);
        toast.success("Advertice selected")
        setEditingAd(ad);
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-slideUp">
            <div className="mb-6">
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Admin</p>
                <p className="text-2xl font-bold text-gray-800 section-title">
                    {editingAd ? "Edit Advertisement" : "Update Advertisement"}
                </p>
            </div>

            {/* Form */}
            <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 12px rgba(24,119,242,0.07)" }}>
                <div className="flex flex-col items-center gap-4">
                    <label className="cursor-pointer w-full max-w-lg" onClick={() => document.getElementById("fileInput").click()}>
                        <div className="rounded-2xl overflow-hidden" style={{ border: "2px dashed #93c5fd" }}>
                            <img src={adImage || advertice} alt="Ad Preview"
                                className="w-full h-44 lg:h-60 object-cover transition-transform hover:scale-[1.02]" />
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-1">Click to change image</p>
                    </label>
                    <input id="fileInput" type="file" accept="image/*" className="hidden"
                        onChange={(e) => setAdsdata({ ...adsdata, adsimg: e.target.files[0] })} />
                    <input
                        type="text"
                        value={adsdata.adsname}
                        onChange={(e) => setAdsdata({ ...adsdata, adsname: e.target.value })}
                        placeholder="Enter company name"
                        className="w-full max-w-sm p-3 rounded-xl focus:outline-none input-glow transition-all text-center"
                        style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                    />
                    <button onClick={handleAddOrUpdateAd}
                        className="px-8 py-3 rounded-xl text-white font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-95"
                        style={{ background: "linear-gradient(135deg, #1877F2, #42a5f5)", boxShadow: "0 4px 16px rgba(24,119,242,0.4)" }}>
                        {editingAd ? "Update Ad" : "Add Ad"}
                    </button>
                </div>
            </div>

            {/* Ads List */}
            <div className="flex flex-col gap-2">
                {getAds.length > 0 ? getAds.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 rounded-2xl transition-all"
                        style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 8px rgba(24,119,242,0.06)" }}>
                        <div className="flex items-center gap-3">
                            <img src={`${serverUrl}/uploads/${item.adsimg}`} alt="" className="w-16 h-14 object-cover rounded-xl"
                                style={{ border: "2px solid #bfdbfe" }} />
                            <span className="font-semibold text-gray-800 capitalize">{item.adsname}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEditAd(item)}
                                className="p-2.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95"
                                style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", boxShadow: "0 2px 8px rgba(245,158,11,0.3)" }}>
                                <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeleteAd(item._id)}
                                className="p-2.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95"
                                style={{ background: "linear-gradient(135deg, #ef4444, #f87171)", boxShadow: "0 2px 8px rgba(239,68,68,0.3)" }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 rounded-2xl text-gray-400 text-sm"
                        style={{ background: "rgba(255,255,255,0.6)", border: "1.5px dashed #bfdbfe" }}>No Ads Found</div>
                )}
            </div>
        </div>
    );
}

export default Advertice;
