/**
 *
 * @param {String} account Tài khoản
 * @param {String} name Họ và Tên
 * @param {String} email Email address
 * @param {String} password Mật khẩu
 * @param {ShortDate} workDate Ngày làm
 * @param {Number} basicSalary Lương Cơ Bảng
 * @param {Number} duty Hệ số lương
 * @param {Number} workingTime Số giờ làm
 *
 */

function Personal(
  account,
  name,
  email,
  password,
  workDate,
  basicSalary,
  duty,
  workingTime
) {
  this.personalAccount = account;
  this.fullName = name;
  this.email = email;
  this.password = password;
  this.workDate = workDate;
  this.basicSalary = basicSalary;
  this.duty = duty;
  this.workingTime = workingTime;

  // Tổng lương
  this.totalSalary = function () {
    return this.duty * this.basicSalary;
  };
  this.rating = function () {
    if (this.workingTime >= 192) return "Xuất sắc";
    else if (this.workingTime >= 176) return "Giỏi";
    else if (this.workingTime >= 160) return "Khá";
    else return "Trung bình";
  };
}
