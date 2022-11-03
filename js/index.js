/**
 * Project: Personal Management (CRUD)
 * Features:
 *  + Create personal
 *  + Read personals
 *  + Delete personal
 *  + Search personal (id + name)
 *  + Update personal
 *  + Validate form
 * Start project
 *  + (PM BA PO) write product requirements document (PRD)
 *  + designer
 *  + Front end => UI
 *  + phân rã lớp đối tượng
 *   (1 lớp Nhân viênên : tkNV , tenNV , email, password, ngày làm, lương CB, Chức vụ, giờ làm , Tổng Lương )
 *  + Testing (QC)
 *  + production
 */

var personalList = [];

function validateForm() {
  var personalAccount = document.getElementById("tkNV").value;
  var personalName = document.getElementById("name").value;

  var isValid = true;

  isValid &=
    required(personalAccount, "tbTKNV") &&
    checkLength(personalAccount, "tbTKNV", 4, 6);
  isValid &=
    required(personalName, "spanTenNV") &&
    checkpersonalName(personalName, "spanTenNV");
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
      alert("Tài khoản nhân viên trùng lặp!!");
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
  renderPersonals();

  // lưu ds nhân viên xuống local storage
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
        <td>${data[i].duty}</td>
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
  renderPersonals();
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
  var keyword = document.getElementById("txtSearch").value;

  for (var i = 0; i < personalList.length; i++) {
    var currentPersonalAccount = personalList[i].personalAccount;
    var currentPersonalName = personalList[i].fullName;

    if (
      currentPersonalAccount === keyword ||
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
  document.getElementById("datepicker").value = personal.workDate;
  document.getElementById("luongCB").value = personal.basicSalary;
  document.getElementById("chucvu").value = personal.duty;
  document.getElementById("gioLam").value = personal.workingTime;

  document.getElementById("tkNV").disabled = true;

  document.getElementById("btnCapNhat").style.display = "inline";
  document.getElementById("btnThemNV").style.display = "none";
}

// update 2: cho phép người dùng sửa trên form, người dùng nhấn nút lưu => cập nhật
function updatePersonal() {
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

  renderPersonals();

  saveData();

  document.getElementById("formQLNV").reset();
  document.getElementById("tkNV").disabled = false;

  document.getElementById("btnThem").style.display = "block";
  document.getElementById("btnCapNhat").style.display = "none";
  document.getElementById("btnThemNV").style.display = "block";
}

window.onload = function () {
  // code ở trong này sẽ chạy khi người dùng load trang
  console.log("window onload");
  getData();
};

function resetForm() {
  document.getElementById("tkNV").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("datepicker").value = "";
  document.getElementById("luongCB").value = "";
  document.getElementById("chucvu").value = "";
  document.getElementById("gioLam").value = "";
  document.getElementById("tkNV").disabled = false;
}

// ------------ VALIDATE FUNCTIONS -----------
// check required---------

function required(value, spanAccount) {
  if (value.length === 0) {
    document.getElementById(spanAccount).style.display = "block";
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
    document.getElementById(spanAccount).style.display = "block";
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

function checkpersonalName(value, spanAccount) {
  var pattern = /^[A-z ]+$/g;
  if (pattern.test(value)) {
    document.getElementById(spanAccount).innerHTML = "";
    return true;
  }

  document.getElementById(spanAccount).innerHTML = "*Chỉ chấp nhận từ A-z";
  return false;
}
