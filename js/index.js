/**
 *  + Create personal
 *  + Read personals
 *  + Delete personal
 *  + Search personal (account + name)
 *  + Update personal
 *  + Validate form
 *  + phân rã lớp đối tượng
 *   (1 lớp Nhân viênên : tkNV , tenNV , email, password, ngày làm, lương CB, Chức vụ, giờ làm , Tổng Lương )
 *  + Testing (QC)
 *  + production
 */

var personalList = [];

function validateForm() {
  var personalAccount = document.getElementById("tkNV").value;
  var personalName = document.getElementById("name").value;
  var personalEmail = document.getElementById("email").value;
  var personalPassword = document.getElementById("password").value;
  var personalWorkDate = document.getElementById("datepicker").value;
  var personalBasicSalary = +document.getElementById("luongCB").value;
  var personalDuty = +document.getElementById("chucvu").value;
  var personalWorkingTime = +document.getElementById("gioLam").value;

  var isValid = true;

  isValid &=
    required(personalAccount, "tbTKNV") &&
    checkLength(personalAccount, "tbTKNV", 4, 6);
  isValid &=
    required(personalName, "tbTen") && checkPersonalName(personalName, "tbTen");
  isValid &=
    required(personalEmail, "tbEmail") &&
    checkPersonalEmail(personalEmail, "tbEmail");
  isValid &=
    required(personalPassword, "tbMatKhau") &&
    checkPersonalPassword(personalPassword, "tbMatKhau");
  isValid &=
    required(personalWorkDate, "tbNgay") &&
    checkPersonalWorkDate(personalWorkDate, "tbNgay");
  isValid &=
    required(personalBasicSalary, "tbLuongCB") &&
    checkPersonalBasicSalary(
      personalBasicSalary,
      "tbLuongCB",
      1000000,
      20000000
    );
  isValid &=
    required(personalDuty, "tbChucVu") &&
    checkPersonalDuty(personalDuty, "tbChucVu");
  isValid &=
    required(personalWorkingTime, "tbGiolam") &&
    checkPersonalWorkingTime(personalWorkingTime, "tbGiolam", 80, 200);
  // nếu isValid = true, form đúng và ngược lại

  return isValid;
}

function createPersonal() {
  // validate dữ liệu

  var isValid = validateForm();
  if (!isValid) return;

  // 1. lấy thông tin người dùng nhập từ input

  var personalAccount = document.getElementById("tkNV").value;
  var personalName = document.getElementById("name").value;
  var personalEmail = document.getElementById("email").value;
  var personalPassword = document.getElementById("password").value;
  var personalWorkDate = document.getElementById("datepicker").value;
  var personalBasicSalary = +document.getElementById("luongCB").value;
  var personalDuty = +document.getElementById("chucvu").value;
  var personalWorkingTime = +document.getElementById("gioLam").value;

  // 1.5. kiểm tra personalAccount có bị trùng ko
  for (var i = 0; i < personalList.length; i++) {
    if (personalList[i].personalAccount === personalAccount) {
      document.getElementById("tbTKNV").display.style = "inline-block";
      document.getElementById("tbTKNV").innerHTML = "Tài khoản đã tồn tại";
      return;
    }
  }

  // 2. tạo đối tượng nhân viên từ thông tin ngdung nhập
  var personal = new Personal(
    personalAccount,
    personalName,
    personalEmail,
    personalPassword,
    personalWorkDate,
    personalBasicSalary,
    personalDuty,
    personalWorkingTime
  );

  // 3. thêm nhân viên mới vào danh sách
  personalList.push(personal);
  // in danh sách nhân viên ra bảng
  // render dự liệu
  renderPersonals();

  // lưu ds nhân viên xuống local storage
  // Lưu dự liệu
  saveData();
}

// personalList = [{}, {}, {}] => tr,tr,tr
function renderPersonals(data) {
  if (!data) data = personalList;

  var html = "";
  for (var i = 0; i < data.length; i++) {
    html += `
      <tr>
        <td>${data[i].personalAccount}</td>
        <td>${data[i].fullName}</td>
        <td>${data[i].email}</td>
        <td>${data[i].workDate}</td>
        `;
    if (data[i].duty == 3) {
      html += "<td> Sếp </td>";
    }
    if (data[i].duty == 2) {
      html += "<td>Trưởng phòng</td>";
    }
    if (data[i].duty == 1) {
      html += "<td>Nhân viên</td>";
    }

    html += `</td>
        <td>${data[i].totalSalary()}</td>
        <td>${data[i].rating()}</td>
        <td>
            <button onclick="deletePersonal('${
              data[i].personalAccount
            }')" class="btn btn-danger">Xoá</button>

            <button onclick="getPersonalDetail('${
              data[i].personalAccount
            }')" class="btn btn-info" 
            data-toggle="modal"
            data-target="#myModal"
            >Sửa</button>
        </td>
      </tr>`;
  }
  document.getElementById("tableDanhSach").innerHTML = html;
}

function saveData() {
  // chuyển từ một mảng object sang định dạng JSON
  var personalListJSON = JSON.stringify(personalList);

  localStorage.setItem("SL", personalListJSON);
}

function getData() {
  var personalListJSON = localStorage.getItem("SL");

  if (!personalListJSON) return;

  var personalListLocal = JSON.parse(personalListJSON);
  personalList = mapData(personalListLocal);

  // render dự liệu
  renderPersonals();
}

// input: mảng nhân viên từ local => ouput: mảng nhân viên mới
function mapData(dataFromLocal) {
  var result = [];
  for (var i = 0; i < dataFromLocal.length; i++) {
    var oldPersonal = dataFromLocal[i];
    var newPersonal = new Personal(
      oldPersonal.personalAccount,
      oldPersonal.fullName,
      oldPersonal.email,
      oldPersonal.password,
      oldPersonal.workDate,
      oldPersonal.basicSalary,
      oldPersonal.duty,
      oldPersonal.workingTime
    );
    result.push(newPersonal);
  }

  return result;
}

function deletePersonal(personalAccount) {
  var index = findByPersonal(personalAccount);
  if (index === -1) {
    alert("Không tìm thấy account phù hợp.");
    return;
  }
  personalList.splice(index, 1);
  // render dự liệu
  renderPersonals();
  // Lưu dự liệu
  saveData();
}

// input : account => output: index
function findByPersonal(account) {
  for (var i = 0; i < personalList.length; i++) {
    if (personalList[i].personalAccount === account) {
      return i;
    }
  }
  return -1;
}

function searchPersonals() {
  var result = [];
  var keyword = document.getElementById("searchName").value;

  for (var i = 0; i < personalList.length; i++) {
    var currentPersonalAccount = personalList[i].personalAccount;
    var currentPersonalName = personalList[i].fullName;

    if (
      currentPersonalAccount.includes(keyword) ||
      currentPersonalName.includes(keyword)
    ) {
      result.push(personalList[i]);
    }
  }

  renderPersonals(result);
}

// update 1: đưa thông tin của nhân viên muốn update lên form
function getPersonalDetail(personalAccount) {
  var index = findByPersonal(personalAccount);
  if (index === -1) {
    alert("Không tìm thấy id phù hợp.");
    return;
  }
  var personal = personalList[index];

  document.getElementById("tkNV").value = personal.personalAccount;
  document.getElementById("name").value = personal.fullName;
  document.getElementById("email").value = personal.email;
  document.getElementById("password").value = personal.password;
  document.getElementById("datepicker").value = personal.workDate;
  document.getElementById("luongCB").value = personal.basicSalary;
  document.getElementById("chucvu").value = personal.duty;
  document.getElementById("gioLam").value = personal.workingTime;

  document.getElementById("tkNV").disabled = true;
  document.getElementById("tkNV").style.backgroundColor = "rgba(0,0,0,0.1)";

  document.getElementById("password").type = "text";

  document.getElementById("btnCapNhat").style.display = "inline";
  document.getElementById("btnThemNV").style.display = "none";
}

// update 2: cho phép người dùng sửa trên form, người dùng nhấn nút lưu => cập nhật

function updatePersonal() {
  //varlidation update

  var isValid = validateForm();
  if (!isValid) return;

  // input

  var personalAccount = document.getElementById("tkNV").value;
  var personalName = document.getElementById("name").value;
  var personalEmail = document.getElementById("email").value;
  var personalPassword = document.getElementById("password").value;
  var personalWorkDate = document.getElementById("datepicker").value;
  var personalBasicSalary = +document.getElementById("luongCB").value;
  var personalDuty = +document.getElementById("chucvu").value;
  var personalWorkingTime = +document.getElementById("gioLam").value;

  var index = findByPersonal(personalAccount);

  if (index === -1) {
    alert("Không tìm thấy account phù hợp!");
    return;
    z;
  }

  var personal = personalList[index];

  personal.fullName = personalName;
  personal.email = personalEmail;
  personal.password = personalPassword;
  personal.workDate = personalWorkDate;
  personal.basicSalary = personalBasicSalary;
  personal.duty = personalDuty;
  personal.workingTime = personalWorkingTime;

  // render dự liệu
  renderPersonals();

  // Lưu dự liệu
  saveData();

  document.getElementById("formQLNV").reset();
  document.getElementById("tkNV").disabled = false;

  document.getElementById("btnThem").style.display = "block";
  document.getElementById("btnCapNhat").style.display = "none";
  document.getElementById("btnThemNV").style.display = "block";
  document.getElementById("btnCapNhat").dataDismiss = "modal";
}

window.onload = function () {
  // code ở trong này sẽ chạy khi người dùng load trang
  console.log("window onload");
  getData();
};

// Đặt lại form

function resetForm() {
  // Nội dung Personal

  document.getElementById("tkNV").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("datepicker").value = "";
  document.getElementById("luongCB").value = "";
  document.getElementById("chucvu").value = "";
  document.getElementById("gioLam").value = "";
  document.getElementById("tkNV").disabled = false;
  document.getElementById("password").type = "password";

  // id

  document.getElementById("tkNV").style.backgroundColor = "transparent";

  // Ẩn nút cập nhật

  document.getElementById("btnCapNhat").style.display = "none";
  document.getElementById("btnThemNV").style.display = "inline-block";

  // Content Thông báo

  document.getElementById("tbTKNV").innerHTML = "";
  document.getElementById("tbTen").innerHTML = "";
  document.getElementById("tbEmail").innerHTML = "";
  document.getElementById("tbMatKhau").innerHTML = "";
  document.getElementById("tbNgay").innerHTML = "";
  document.getElementById("tbLuongCB").innerHTML = "";
  document.getElementById("tbChucVu").innerHTML = "";
  document.getElementById("tbGiolam").innerHTML = "";

  // display Thông báo

  document.getElementById("tbTKNV").style.display = "none";
  document.getElementById("tbTen").style.display = "none";
  document.getElementById("tbEmail").style.display = "none";
  document.getElementById("tbMatKhau").style.display = "none";
  document.getElementById("tbNgay").style.display = "none";
  document.getElementById("tbLuongCB").style.display = "none";
  document.getElementById("tbChucVu").style.display = "none";
  document.getElementById("tbGiolam").style.display = "none";
}

// ------------ VALIDATE FUNCTIONS -----------
// check required---------

function required(value, spanAccount) {
  if (value.length === 0) {
    document.getElementById(spanAccount).style.display = "inline-block";
    document.getElementById(spanAccount).innerHTML =
      "*Trường này bắt buộc nhập.";
    return false;
  }

  document.getElementById(spanAccount).innerHTML = "";
  return true;
}

// check minlength - maxlength
function checkLength(value, spanAccount, min, max) {
  if (value.length < min || value.length > max) {
    document.getElementById(spanAccount).style.display = "inline-block";
    document.getElementById(
      spanAccount
    ).innerHTML = `*Độ dài phải từ ${min} tới ${max} kí tự`;
    return false;
  }

  document.getElementById(spanAccount).innerHTML = "";
  return true;
}

// pattern
// regular expression: biểu thức chính quy

function checkPersonalName(value, spanAccount) {
  var pattern =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/g;
  if (pattern.test(value)) {
    document.getElementById(spanAccount).innerHTML = "";
    return true;
  }
  document.getElementById(spanAccount).style.display = "inline-block";

  document.getElementById(spanAccount).innerHTML =
    "*Không có ký tự đặc biệt & số";
  return false;
}
// Test Email

function checkPersonalEmail(value, spanAccount) {
  var pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
  if (pattern.test(value)) {
    document.getElementById(spanAccount).innerHTML = "";
    return true;
  }
  document.getElementById(spanAccount).style.display = "inline-block";
  document.getElementById(spanAccount).innerHTML = "*Nhập đúng định dạng email";
  return false;
}

// Test password

function checkPersonalPassword(value, spanAccount) {
  var pattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  if (pattern.test(value)) {
    document.getElementById(spanAccount).innerHTML = "";
    return true;
  }

  document.getElementById(spanAccount).style.display = "inline-block";
  document.getElementById(spanAccount).innerHTML =
    "*Nhập password từ 8 đến 15 ký tự trong đó có ít nhất một chữ cái thường, một chữ cái viết hoa, một chữ số và một ký tự đặc biệt";
  return false;
}

// Test workDate

function checkPersonalWorkDate(value, spanAccount) {
  var pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/g;
  if (pattern.test(value)) {
    document.getElementById(spanAccount).innerHTML = "";
    return true;
  }

  document.getElementById(spanAccount).style.display = "inline-block";
  document.getElementById(spanAccount).innerHTML = "*Định dạng mm/dd/yyyy";
  return false;
}

// Test basicSalary

function checkPersonalBasicSalary(value, spanAccount, min, max) {
  if (value < min || value > max) {
    document.getElementById(spanAccount).style.display = "inline-block";
    document.getElementById(
      spanAccount
    ).innerHTML = `*Lương phải từ ${min} $ tới ${max} $`;
    return false;
  }

  document.getElementById(spanAccount).innerHTML = "";
  return true;
}

// Test duty

function checkPersonalDuty(value, spanAccount) {
  if (!value) {
    document.getElementById(spanAccount).style.display = "inline-block";
    document.getElementById(spanAccount).innerHTML = `Phải chọn chức vụ hợp lệ`;
    return false;
  }
  document.getElementById(spanAccount).innerHTML = "";
  return true;
}

// Test workingTime

function checkPersonalWorkingTime(value, spanAccount, min, max) {
  if (value < min || value > max) {
    document.getElementById(spanAccount).style.display = "inline-block";
    document.getElementById(
      spanAccount
    ).innerHTML = `*Só giờ phải từ ${min} h tới ${max} h`;
    return false;
  }

  document.getElementById(spanAccount).innerHTML = "";
  return true;
}
