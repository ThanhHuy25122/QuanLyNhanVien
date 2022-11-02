/**
 * Project: Student Management (CRUD)
 * Features:
 *  + Create student
 *  + Read students
 *  + Delete student
 *  + Search student (id + name)
 *  + Update student
 *  + Validate form
 * Start project
 *  + (PM BA PO) write product requirements document (PRD)
 *  + designer
 *  + Front end => UI
 *  + phân rã lớp đối tượng
 *   (1 lớp SinhVien: maSV, tenSV, dob, email, khoá học, điểm toán, lý,hoá , tinhDiemTrungBinh)
 *  + Testing (QC)
 *  + production
 */

var studentList = [];

function validateForm() {
  var studentId = document.getElementById("txtMaSV").value;
  var studentName = document.getElementById("txtTenSV").value;

  var isValid = true;

  isValid &=
    required(studentId, "spanMaSV") && checkLength(studentId, "spanMaSV", 3, 9);
  isValid &=
    required(studentName, "spanTenSV") &&
    checkStudentName(studentName, "spanTenSV");

  // nếu isValid = true, form đúng và ngược lại
  return isValid;
}

function createStudent() {
  // validate dữ liệu
  var isValid = validateForm();
  if (!isValid) return;

  // 1. lấy thông tin người dùng nhập từ input
  var studentId = document.getElementById("txtMaSV").value;
  var studentName = document.getElementById("txtTenSV").value;
  var studentEmail = document.getElementById("txtEmail").value;
  var studentDob = document.getElementById("txtNgaySinh").value;
  var studentCourse = document.getElementById("khSV").value;
  var studentMath = +document.getElementById("txtDiemToan").value;
  var studentPhysic = +document.getElementById("txtDiemLy").value;
  var studentChemistry = +document.getElementById("txtDiemHoa").value;

  // 1.5. kiểm tra studentId có bị trùng ko
  for (var i = 0; i < studentList.length; i++) {
    if (studentList[i].studentId === studentId) {
      alert("Mã sinh viên trùng lặp!!");
      return;
    }
  }

  // 2. tạo đối tượng sinh viên từ thông tin ngdung nhập
  var student = new Student(
    studentId,
    studentName,
    studentEmail,
    studentDob,
    studentCourse,
    studentMath,
    studentPhysic,
    studentChemistry
  );

  // 3. thêm sinh viên mới vào danh sách
  studentList.push(student);
  // in danh sách sinh viên ra bảng
  renderStudents();

  // lưu ds sinh viên xuống local storage
  saveData();
}

// studentList = [{}, {}, {}] => tr,tr,tr
function renderStudents(data) {
  if (!data) data = studentList;

  var html = "";
  for (var i = 0; i < data.length; i++) {
    html += `
      <tr>
        <td>${data[i].studentId}</td>
        <td>${data[i].fullName}</td>
        <td>${data[i].email}</td>
        <td>${data[i].dob}</td>
        <td>${data[i].course}</td>
        <td>${data[i].calcGPA()}</td>
        <td>
            <button onclick="deleteStudent('${
              data[i].studentId
            }')" class="btn btn-danger">Xoá</button>

            <button onclick="getStudentDetail('${
              data[i].studentId
            }')" class="btn btn-info">Sửa</button>
        </td>
      </tr>`;
  }
  document.getElementById("tbodySinhVien").innerHTML = html;
}

function saveData() {
  // chuyển từ một mảng object sang định dạng JSON
  var studentListJSON = JSON.stringify(studentList);

  localStorage.setItem("SL", studentListJSON);
}

function getData() {
  var studentListJSON = localStorage.getItem("SL");

  if (!studentListJSON) return;

  var studentListLocal = JSON.parse(studentListJSON);
  studentList = mapData(studentListLocal);

  renderStudents();
}

// input: mảng sinh viên từ local => ouput: mảng sinh viên mới
function mapData(dataFromLocal) {
  var result = [];
  for (var i = 0; i < dataFromLocal.length; i++) {
    var oldStudent = dataFromLocal[i];
    var newStudent = new Student(
      oldStudent.studentId,
      oldStudent.fullName,
      oldStudent.email,
      oldStudent.dob,
      oldStudent.course,
      oldStudent.math,
      oldStudent.physic,
      oldStudent.chemistry
    );
    result.push(newStudent);
  }

  return result;
}

function deleteStudent(studentId) {
  var index = findById(studentId);
  if (index === -1) {
    alert("Không tìm thấy id phù hợp.");
    return;
  }
  studentList.splice(index, 1);
  renderStudents();
  saveData();
}

// input :id => output: index
function findById(id) {
  for (var i = 0; i < studentList.length; i++) {
    if (studentList[i].studentId === id) {
      return i;
    }
  }
  return -1;
}

function searchStudents() {
  var result = [];
  var keyword = document.getElementById("txtSearch").value;

  for (var i = 0; i < studentList.length; i++) {
    var currentStudentId = studentList[i].studentId;
    var currentStudentName = studentList[i].fullName;

    if (currentStudentId === keyword || currentStudentName.includes(keyword)) {
      result.push(studentList[i]);
    }
  }

  renderStudents(result);
}

// update 1: đưa thông tin của sinh viên muốn update lên form
function getStudentDetail(studentId) {
  var index = findById(studentId);
  if (index === -1) {
    alert("Không tìm thấy id phù hợp.");
    return;
  }
  var student = studentList[index];

  document.getElementById("txtMaSV").value = student.studentId;
  document.getElementById("txtTenSV").value = student.fullName;
  document.getElementById("txtEmail").value = student.email;
  document.getElementById("txtNgaySinh").value = student.dob;
  document.getElementById("khSV").value = student.course;
  document.getElementById("txtDiemToan").value = student.math;
  document.getElementById("txtDiemLy").value = student.physic;
  document.getElementById("txtDiemHoa").value = student.chemistry;

  document.getElementById("txtMaSV").disabled = true;

  document.getElementById("btnUpdate").style.display = "inline";
  document.getElementById("btnCreate").style.display = "none";
}

// update 2: cho phép người dùng sửa trên form, người dùng nhấn nút lưu => cập nhật
function updateStudent() {
  var studentId = document.getElementById("txtMaSV").value;
  var studentName = document.getElementById("txtTenSV").value;
  var studentEmail = document.getElementById("txtEmail").value;
  var studentDob = document.getElementById("txtNgaySinh").value;
  var studentCourse = document.getElementById("khSV").value;
  var studentMath = +document.getElementById("txtDiemToan").value;
  var studentPhysic = +document.getElementById("txtDiemLy").value;
  var studentChemistry = +document.getElementById("txtDiemHoa").value;

  var index = findById(studentId);

  if (index === -1) {
    alert("Không tìm thấy id phù hợp!");
    return;
  }

  var student = studentList[index];

  student.fullName = studentName;
  student.email = studentEmail;
  student.dob = studentDob;
  student.course = studentCourse;
  student.math = studentMath;
  student.physic = studentPhysic;
  student.chemistry = studentChemistry;

  renderStudents();

  saveData();

  document.getElementById("formQLSV").reset();
  document.getElementById("txtMaSV").disabled = false;

  document.getElementById("btnUpdate").style.display = "none";
  document.getElementById("btnCreate").style.display = "block";
}

window.onload = function () {
  // code ở trong này sẽ chạy khi người dùng load trang
  console.log("window onload");
  getData();
};

// ------------ VALIDATE FUNCTIONS --------------------
// check required

function required(value, spanId) {
  if (value.length === 0) {
    document.getElementById(spanId).innerHTML = "*Trường này bắt buộc nhập.";
    return false;
  }

  document.getElementById(spanId).innerHTML = "";
  return true;
}

// check minlength - maxlength
function checkLength(value, spanId, min, max) {
  if (value.length < min || value.length > max) {
    document.getElementById(
      spanId
    ).innerHTML = `*Độ dài phải từ ${min} tới ${max} kí tự`;
    return false;
  }

  document.getElementById(spanId).innerHTML = "";
  return true;
}

// pattern
// regular expression: biểu thức chính quy

function checkStudentName(value, spanId) {
  var pattern = /^[A-z ]+$/g;
  if (pattern.test(value)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*Chỉ chấp nhận từ A-z";
  return false;
}
