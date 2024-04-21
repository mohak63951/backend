const { v4: uuidv4 } = require('uuid');;
const axios = require('axios');
const crypto = require('crypto');


module.exports.phonepe_payment_init = async(amount, MobileNumber, redirectUrl) => {
    try{
        const merchantId = process.env.PHONEPE_MERCHANT_ID_PROD;
        const merchantTransactionId = uuidv4().slice(0,10);
        const merchantUserId = uuidv4().slice(0,10);
        const redirectMode = 'REDIRECT';
        const callbackUrl = process.env.PHONEPE_CALLBACK_URL_PROD;
        const payloadData = {
            merchantId,
            merchantTransactionId,
            merchantUserId,
            amount,
            redirectUrl,
            redirectMode,
            MobileNumber,
            callbackUrl,
            paymentInstrument : {
                'type' : 'PAY_PAGE'
            }
        }
        const payloadjson = JSON.stringify(payloadData);
        const base64_Encoded_Payload = Buffer.from(payloadjson).toString('base64');
        const API_Endpoint = process.env.PHONEPE_PAY_API_ENDPOINT;
        const Phonepe_Salt_Key = process.env.PHONEPE_SALT_KEY_PROD;
        const header_payload = `${base64_Encoded_Payload}${API_Endpoint}${Phonepe_Salt_Key}`;
        const SHA256Hash = crypto.createHash('sha256').update(header_payload).digest('hex');
        const PAY_API_URL = process.env.PHONEPE_PAY_API_PROD;
        const salt_index = 1;
        
        const response = await axios.request({
            method : 'POST',
            url : `${PAY_API_URL}`, 
            headers : {
                accept : 'application/json',
                'Content-Type' : 'application/json',
                'X-VERIFY' : `${SHA256Hash}###${salt_index}`
            }, 
            data : {
                request : base64_Encoded_Payload
            }           
        });
        // console.log(response.data, "response");
        if(response.data.success === true){
            return({
                payment_request : payloadData,
                payment_response : response.data
                    
            });
        }else return('Payment Initiation Failed');
    }catch(err){
        console.log(err);
    }
    
}

module.exports.phonepe_payment_validation = async(merchantId, merchantTransactionId) => {
    try{
        const CHECK_STATUS_API_URL = process.env.PHONEPE_CHECK_STATUS_API_PROD;
        const response = await axios.request({
            method : 'get',
            url : `${CHECK_STATUS_API_URL}/${merchantId}/${merchantTransactionId}`,
            headers: {
                accept: 'application/json', 
                'Content-Type': 'application/json'
            }
            
        }
        )
      
       
        
    }catch(err){
        console.log(err);
    }
}


module.exports.phonepay_refund = async(merchantId, merchantTransactionId, originalTransactionId, merchantUserId, amount, callbackUrl) => {
    try{
        const payload = {
            merchantId, 
            merchantTransactionId, 
            originalTransactionId, 
            merchantUserId, 
            amount, 
            callbackUrl
        }
        const payloadjson = JSON.stringify(payload);
        const base64_Encoded_Payload = Buffer.from(payloadjson).toString('base64');
        const API_Endpoint = process.env.PHONEPE_REFUND_API_ENDPOINT;
        const Phonepe_Salt_Key = process.env.PHONEPE_SALT_KEY_PROD;
        const header_payload = `${base64_Encoded_Payload}${API_Endpoint}${Phonepe_Salt_Key}`;
        const SHA256Hash = crypto.createHash('sha256').update(header_payload).digest('hex');
        const REFUND_API_URL = process.env.PHONEPE_REFUND_API_PROD;
        const salt_index = 1;
        const response = await axios.request({
            method : 'POST',
            url : `${REFUND_API_URL}`, 
            headers : {
                accept : 'application/json',
                'Content-Type' : 'application/json',
                'X-VERIFY' : `${SHA256Hash}###${salt_index}`
            }, 
            data : {
                request : base64_Encoded_Payload
            }           
        });
        console.log(response.data);
        return(response.data);
    }catch(err){
        console.log(err);
    }
}