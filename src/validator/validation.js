const isValid = function(value){
    if(typeof value === "undefined" || value === null) return false
    if(typeof value === "string" && value.trim().length === 0 ) return false
    if(typeof value === Number && value.trim().length===0) return false
    return true;
}



const isValidRequestBody = function (value) {
  return Object.keys(value).length > 0
}

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      }



      const isValidMobile = function (num) {
        return /^[6789]\d{9}$/.test(num);
      };

      
const passwordValidate = function(value){
    let regex =    /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9!@#$%^&*]{8,15})$/
    return regex.test(value)
   }
      