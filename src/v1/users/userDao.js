class UserDao {

	async getById(payload) {
        return await connection.query( `SELECT * from users where id=?`,[Number(payload.id)]);
    }

    async getUser(payload) {
        return await connection.query( `SELECT * from users where id = ? and otp = ? and isActive = 0 and isDeleted = 0`,[payload.id,payload.otp]);
    }

    async getUserMobile(payload) {
        return await connection.query( `SELECT * from users where mobile = ? and otp = ? and isActive = 1 and isDeleted = 0`,[payload.mobile,payload.otp]);
    }

    async getByEmail(payload) {
        return await connection.query( `SELECT * from users where email=?`,[payload.email]);
    }

    async getByMobile(payload) {
        return await connection.query( `SELECT * from users where mobile=?`,[payload.mobile]);
    }

    async getByEmailAndMobile(payload) {
        return await connection.query( `SELECT id,email,mobile,	isActive from users where mobile=? OR email=?`,[payload.mobile,payload.email]);
    }

	async signup(payload) {
         let data = await connection.query(`INSERT into users SET ?`,[payload]);
         return data;
    }

    async updateUser(payload,id) {
        let data = await connection.query(`UPDATE users SET ? where id=?`,[payload,id]);
        return data;
   }

}
exports.userDao = new UserDao();