
module.exports= class SMS {
  otp;
  msg;

  constructor(mobile) {
    this.mobile = mobile;
    this.otp = SMS.genOtp();
  }

  async sendOtp(msg) {
    this.msg = msg;
    return Promise.resolve(true);
  }

  static genOtp() {
    return '1234';
  }
  async sendSMS(mobile, message){
    return true;
  }
}
