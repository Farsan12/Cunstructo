import commonApi from "./commonApi";
import serverUrl from "./serverUrl";

// Payment APIs
export const savePaymentApi = async (reqbody, reqheader) => {
    return await commonApi("POST", `${serverUrl}/payment/save`, reqbody, reqheader)
}

export const getAllPaymentsApi = async () => {
    return await commonApi("GET", `${serverUrl}/payment/all`, "", "")
}

export const deletePaymentApi = async (id) => {
    return await commonApi("DELETE", `${serverUrl}/payment/${id}`, "", "")
}

// usser realted API

export const RegisterApi=async(reqbody)=>{
    return await commonApi("POST",`${serverUrl}/userregister`,reqbody,"")
}

export const LoginApi=async(reqbody)=>{
    return await commonApi("POST",`${serverUrl}/userlogin`,reqbody,"")
}

export const AdminLoginApi=async(reqbody)=>{
    return await commonApi("POST",`${serverUrl}/adminlogin`,reqbody,"")
}

export const getAllusersApi=async()=>{
    return await commonApi("GET",`${serverUrl}/get-all-users`,"","")
}

export const getAllworkerApi=async()=>{
    return await commonApi("GET",`${serverUrl}/get-all-workers`,"","")
}

export const deleteUserApi=async(id)=>{
    return await commonApi("DELETE",`${serverUrl}/remove-users/${id}`,{})
}

export const searchCategoryApi = async(searchkey,reqheader)=>{
    return await commonApi("GET",`${serverUrl}/categoryselect?search=${searchkey}`,"",reqheader)
}

export const changePasswordApi=async(reqbody,reqheader)=>{
    return await commonApi("PUT",`${serverUrl}/updatepassword`,reqbody,reqheader)
}

export const getSingleuserApi=async(reqheader)=>{
    return await commonApi("GET",`${serverUrl}/getsingleuser`,"",reqheader)
}

export const updateProfileApi=async(reqbody,reqheader)=>{
    return await commonApi("PUT",`${serverUrl}/updateProfile`,reqbody,reqheader)
}

export const deleteMyaccountApi=async(reqbody,reqheader)=>{
    return await commonApi("DELETE",`${serverUrl}/deleteaccount`,reqbody,reqheader)
}

//blocked user

export const updateBlockApi=async(id,reqbody)=>{
    return await commonApi("PUT",`${serverUrl}/updateuserblock/${id}`,reqbody,"")
}

export const getAllblockedUsersApi=async(reqbody)=>{
    return await commonApi("POST",`${serverUrl}/getblockusers`,reqbody,"")
}


// category
export const addCategoryApi=async(reqbody,reqheader)=>{
    return await commonApi("POST",`${serverUrl}/addcategory`,reqbody,reqheader)
}

export const getCategoryApi=async()=>{
    return await commonApi("GET",`${serverUrl}/getallcategory`)
}

export const deleteCategoryApi=async(id)=>{
    return await commonApi("DELETE",`${serverUrl}/deletecategory/${id}`)
}

export const updateCategoryApi=async(id,reqbody,reqheader)=>{
    return await commonApi("PUT",`${serverUrl}/updatecategory/${id}`,reqbody,reqheader)
}

// adds

export const addADDSApi=async(reqbody,reqheader)=>{
    return await commonApi("POST",`${serverUrl}/addAdds`,reqbody,reqheader)
}

export const getADDSApi=async()=>{
    return await commonApi("GET",`${serverUrl}/getalladds`)
}

export const deleteADDSApi=async(id)=>{
    return await commonApi("DELETE",`${serverUrl}/deleteadds/${id}`)
}

export const updateADDSApi=async(id,reqbody,reqheader)=>{
    return await commonApi("PUT",`${serverUrl}/updateadds/${id}`,reqbody,reqheader)
}

// feedback realted api

export const sendFeedbackApi=async(reqbody,reqheader)=>{
    return await commonApi("POST",`${serverUrl}/feedback`,reqbody,reqheader)
}

export const getAllfeedbackApi=async()=>{
    return await commonApi("GET",`${serverUrl}/getallfeedback`)
}
export const deletefeedbackApi=async(id)=>{
    return await commonApi("DELETE",`${serverUrl}/deletefeedback/${id}`,{})
}

//chat panel

export const getuserforsidebarApi=async(reqheader)=>{
    return await commonApi("GET",`${serverUrl}/getuserforsidebar`,{},reqheader)
}
export const getusersandworkersforsidebarApi=async(reqheader)=>{
    return await commonApi("GET",`${serverUrl}/getusers&workersforsidebar`,{},reqheader)
}

export const getmessageApi=async(id,reqheader)=>{
    return await commonApi("GET",`${serverUrl}/getmessage/${id}`,{},reqheader)
}
export const sendmessageApi=async(id,reqbody,reqheader)=>{
    return await commonApi("POST",`${serverUrl}/sendmessage/${id}`,reqbody,reqheader)
}

// ratings
export const submitRatingApi = async (reqbody, reqheader) =>
    commonApi("POST", `${serverUrl}/rating/submit`, reqbody, reqheader)
export const getWorkerRatingsApi = async (workerId) =>
    commonApi("GET", `${serverUrl}/rating/worker/${workerId}`, {}, "")
export const getMyRatingApi = async (workerId, reqheader) =>
    commonApi("GET", `${serverUrl}/rating/my/${workerId}`, {}, reqheader)

// socketio

// export const ConnectSocket =() => {
//     return io(serverUrl); // This returns a connected socket instance
//   };
// export const disconnectSocket=() =>{
//     return io(serverUrl)
// }