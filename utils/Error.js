const error = (msg,code) => {
    if(!msg)
      return {status : false, message : 'Server Error', errorCode : 500}
    return {status : false, message : msg, errorCode : code}
  }
  module.exports.error = error