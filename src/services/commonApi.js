import axios from 'axios'

const commonApi = async(httpMethod,url,reqbody,reqheader)=>{

    const isFormData = reqbody instanceof FormData;
    const defaultHeaders = isFormData ? {} : { "Content-Type": "application/json" };

    const reqConfig={
        method:httpMethod,
        url,
        data:reqbody,
        headers: reqheader ? { ...defaultHeaders, ...reqheader } : defaultHeaders,
        timeout: 15000
    }

    return await axios(reqConfig).then(res=>{
        return res
    }).catch(err=>{
        return err
    })
}

export default commonApi