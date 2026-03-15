import React, { useContext, useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { addCategoryApi, deleteCategoryApi, getCategoryApi, updateCategoryApi } from "../../services/allApi";
import serverUrl from "../../services/serverUrl";
import { displaycategoryContext } from "../../Context/OtherPurpuseContextApi";
import addImage from '../../assets/addImage.jpg'
import { toast } from "react-toastify";

function AddCategory() {

  const { setCategoryResponse, setaddsandCatogoryResponse } = useContext(displaycategoryContext)
  const [imageadd, setimageadd] = useState()
  const [CategoryData, setCategoryData] = useState({ categoryname: "", categoryimg: "" })
  const [editingCategory, setEditingCategory] = useState(null);
  const [getAllCategorydata, setgetAllCategorydata] = useState()

  useEffect(() => {
    if (CategoryData?.categoryimg instanceof File) {
      const imageUrl = URL.createObjectURL(CategoryData?.categoryimg);
      setimageadd(imageUrl)
    }
    else if (CategoryData.categoryimg) {
      setimageadd(`${serverUrl}/uploads/${CategoryData.categoryimg}`);
    }

  }, [CategoryData.categoryimg])

  useEffect(() => {

    getAllcategory()

  }, [])


  // get all category api
  const getAllcategory = async () => {
    try {
      const result = await getCategoryApi()
      console.log("API response:", result.data); // Add this line
      setgetAllCategorydata(result.data)
      setaddsandCatogoryResponse(result.data)
      setCategoryResponse(result.data)
      
    } catch (error) {
      console.log("API error:", error);
    }
  }

  const handleAddOrUpdateCategory = async (e) => {
    e.preventDefault()
    const { categoryname, categoryimg } = CategoryData


    if (categoryname && categoryimg) {

      if (editingCategory) {

        const id = editingCategory._id

        const reqbody = new FormData()
        reqbody.append("categoryname", categoryname)
        imageadd ? reqbody.append("categoryimg", categoryimg) : reqbody.append("categoryimg", editingCategory.categoryimg)

        const reqheader = {
          "Content-type": "multipart/form-data"
        }

        try {
          const result = await updateCategoryApi(id, reqbody, reqheader)

          setgetAllCategorydata(result.data)
          setaddsandCatogoryResponse(result.data)
          if(result.status>=200&&result.status<=300){
            toast.success("successfully updated catogory!!")
            getAllcategory()
          }
         

        } catch (error) {
          console.log(error);

        }

        setEditingCategory(null);
      } else {

        const reqbody = new FormData()
        reqbody.append("categoryname", categoryname)
        reqbody.append("categoryimg", categoryimg)

        const reqheader = {
          "Content-type": "multipart/form-data"
        }

        try {

          const result = await addCategoryApi(reqbody, reqheader)

          if (result.status >= 200 && result.status <= 300) {
            toast.success("successfully Added catogory!!")
            getAllcategory()
          }

        } catch (error) {
          console.log(error);

        }
      }
      setimageadd("")
      setCategoryData({ categoryname: "", categoryimg: "" })
    }
    else {
      toast.warning("please compleate ")
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const result = await deleteCategoryApi(id)
      
      if (result.status >= 200 && result.status <= 300) {
        getAllcategory()
        toast.success("successfully removed catogory!!")
      }
    } catch (error) {
      console.log(error);

    }
  };

  const handleEditCategory = (cat) => {
    setCategoryData({ categoryname: cat.categoryname, categoryimg: cat.categoryimg })
    setimageadd(`${serverUrl}/uploads/${cat.categoryimg}`);
    toast.success("catogory selected")
    setEditingCategory(cat);

  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-slideUp">
      <div className="mb-6">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Admin</p>
        <p className="text-2xl font-bold text-gray-800 section-title">
          {editingCategory ? "Edit Category" : "Add Category"}
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 12px rgba(24,119,242,0.07)" }}>
        <div className="flex flex-col items-center gap-4">
          <label htmlFor="fileInput" className="cursor-pointer relative inline-block">
            <div className="w-36 h-36 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1877F2, #42a5f5)", boxShadow: "0 4px 20px rgba(24,119,242,0.3)" }}>
              <img src={imageadd ? imageadd : addImage} alt="Category" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              style={{ background: "#1877F2" }}>
              <i className="fa-solid fa-camera text-white text-xs"></i>
            </div>
          </label>
          <input id="fileInput" type="file" accept="image/*" className="hidden"
            onChange={(e) => setCategoryData({ ...CategoryData, categoryimg: e.target.files[0] })} />
          <input
            type="text"
            value={CategoryData.categoryname}
            onChange={(e) => setCategoryData({ ...CategoryData, categoryname: e.target.value })}
            placeholder="Enter category name"
            className="w-full max-w-sm p-3 rounded-xl focus:outline-none input-glow transition-all text-center"
            style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
          />
          <button onClick={(e) => handleAddOrUpdateCategory(e)}
            className="px-8 py-3 rounded-xl text-white font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: "linear-gradient(135deg, #1877F2, #42a5f5)", boxShadow: "0 4px 16px rgba(24,119,242,0.4)" }}>
            {editingCategory ? "Update Category" : "Add Category"}
          </button>
        </div>
      </div>

      {/* Category List */}
      <div className="flex flex-col gap-2">
        {getAllCategorydata?.length > 0 ? getAllCategorydata.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-2xl transition-all animate-fadeIn"
            style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 8px rgba(24,119,242,0.06)", animationDelay: `${index * 30}ms` }}>
            <div className="flex items-center gap-3">
              <img src={`${serverUrl}/uploads/${item.categoryimg}`} alt="" className="w-14 h-14 object-cover rounded-xl"
                style={{ border: "2px solid #bfdbfe" }} />
              <span className="font-semibold text-gray-800">{item.categoryname}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEditCategory(item)}
                className="p-2.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", boxShadow: "0 2px 8px rgba(245,158,11,0.3)" }}>
                <Edit size={16} />
              </button>
              <button onClick={() => handleDeleteCategory(item._id)}
                className="p-2.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg, #ef4444, #f87171)", boxShadow: "0 2px 8px rgba(239,68,68,0.3)" }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-10 rounded-2xl text-gray-400 text-sm"
            style={{ background: "rgba(255,255,255,0.6)", border: "1.5px dashed #bfdbfe" }}>No categories found.</div>
        )}
      </div>
    </div>
  );
}

export default AddCategory;