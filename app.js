/**
 * EduMark Pro — Institutional Examination & Marks Management System
 * Core Application Engine
 */

// ==========================================================================
// 1. Data Structures & Configuration
// ==========================================================================

const SUBJECT_CONFIG = [
  { id: 'tamil', name: 'Tamil', code: 'TAM', maxMarks: 100, passMarks: 35 },
  { id: 'english', name: 'English', code: 'ENG', maxMarks: 100, passMarks: 35 },
  { id: 'maths', name: 'Mathematics', code: 'MAT', maxMarks: 100, passMarks: 35 },
  { id: 'science', name: 'Science', code: 'SCI', maxMarks: 100, passMarks: 35 },
  { id: 'social', name: 'Social Science', code: 'SOC', maxMarks: 100, passMarks: 35 }
];

// Demo dataset showcasing realistic unordered data:
// Notice the keys are scrambled and students are unsorted
const DEMO_UNORDERED_SOURCE = [
  {
    "Science": 85,
    "Academic Year": "2024-2025",
    "Remarks": "Very attentive and consistent",
    "Admission No": "ADM-2024-001",
    "Tamil": 82,
    "Section": "A",
    "Social Science": 78,
    "Student Name": "Kavitha Raman",
    "Mathematics": 91,
    "Class": "10",
    "English": 76
  },
  {
    "Science": 92,
    "Academic Year": "2024-2025",
    "Remarks": "Exceptional math & analytical skills",
    "Admission No": "ADM-2024-004",
    "Tamil": 88,
    "Section": "A",
    "Social Science": 90,
    "Student Name": "Arjun Sundaram",
    "Mathematics": 99,
    "Class": "10",
    "English": 89
  },
  {
    "Science": 48,
    "Academic Year": "2024-2025",
    "Remarks": "Needs support in Science and Maths",
    "Admission No": "ADM-2024-002",
    "Tamil": 54,
    "Section": "A",
    "Social Science": 61,
    "Student Name": "Dinesh Kumar",
    "Mathematics": 32, // < 35 Fail
    "Class": "10",
    "English": 45
  },
  {
    "Science": 95,
    "Academic Year": "2024-2025",
    "Remarks": "Top performing all-rounder",
    "Admission No": "ADM-2024-008",
    "Tamil": 94,
    "Section": "B",
    "Social Science": 96,
    "Student Name": "Sneha Balaji",
    "Mathematics": 98,
    "Class": "10",
    "English": 93
  },
  {
    "Science": 65,
    "Academic Year": "2024-2025",
    "Remarks": "Regular attendance and steady effort",
    "Admission No": "ADM-2024-003",
    "Tamil": 71,
    "Section": "A",
    "Social Science": 74,
    "Student Name": "Pooja Venkat",
    "Mathematics": 68,
    "Class": "10",
    "English": 70
  },
  {
    "Science": 72,
    "Academic Year": "2024-2025",
    "Remarks": "Creative writer, good communicator",
    "Admission No": "ADM-2024-007",
    "Tamil": 80,
    "Section": "B",
    "Social Science": 82,
    "Student Name": "Rahul Vignesh",
    "Mathematics": 64,
    "Class": "10",
    "English": 85
  },
  {
    "Science": 55,
    "Academic Year": "2024-2025",
    "Remarks": "Encouraged to focus more in class",
    "Admission No": "ADM-2024-006",
    "Tamil": 62,
    "Section": "B",
    "Social Science": 58,
    "Student Name": "Manoj Natarajan",
    "Mathematics": 51,
    "Class": "10",
    "English": 49
  },
  {
    "Science": 80,
    "Academic Year": "2024-2025",
    "Remarks": "Hardworking and disciplined student",
    "Admission No": "ADM-2024-005",
    "Tamil": 77,
    "Section": "A",
    "Social Science": 83,
    "Student Name": "Ananya Krishnan",
    "Mathematics": 84,
    "Class": "10",
    "English": 82
  }
];

// App State
let state = {
  rawUploadedData: [],
  rawHeaders: [],
  students: [],
  isMarksLocked: false,
  userRole: 'admin', // admin, teacher, viewer
  activeExam: 'Annual Exam',
  academicYear: '2024-2025',
  searchQuery: '',
  filterClass: 'ALL',
  filterSection: 'ALL',
  filterStatus: 'ALL',
  sortBy: 'rank-asc'
};

// ==========================================================================
// 2. Calculation & Grade Logic
// ==========================================================================

function calculateGrade(percentage) {
  if (percentage >= 91) return 'A+';
  if (percentage >= 81) return 'A';
  if (percentage >= 71) return 'B+';
  if (percentage >= 61) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 35) return 'D';
  return 'F';
}

function computeStudentMetrics(student) {
  let totalMarks = 0;
  let maxTotal = 0;
  let hasFailed = false;
  let failedSubjects = [];

  const subjectResults = {};

  SUBJECT_CONFIG.forEach(sub => {
    const mark = Number(student.marks[sub.id]) || 0;
    const grade = calculateGrade((mark / sub.maxMarks) * 100);
    const passed = mark >= sub.passMarks;

    if (!passed) {
      hasFailed = true;
      failedSubjects.push(sub.name);
    }

    subjectResults[sub.id] = {
      obtained: mark,
      max: sub.maxMarks,
      grade: grade,
      passed: passed
    };

    totalMarks += mark;
    maxTotal += sub.maxMarks;
  });

  const percentage = maxTotal > 0 ? ((totalMarks / maxTotal) * 100) : 0;
  const overallGrade = hasFailed ? 'F' : calculateGrade(percentage);
  const result = hasFailed ? 'FAIL' : 'PASS';

  // Generate remarks if empty
  let remarks = student.remarks;
  if (!remarks || remarks.trim() === '') {
    if (hasFailed) {
      remarks = `Needs focused remedial support in ${failedSubjects.join(', ')}.`;
    } else if (percentage >= 90) {
      remarks = "Outstanding academic performance and conduct.";
    } else if (percentage >= 80) {
      remarks = "Excellent progress, very consistent and diligent.";
    } else if (percentage >= 70) {
      remarks = "Good performance, active classroom participation.";
    } else if (percentage >= 50) {
      remarks = "Satisfactory effort; can improve with regular practice.";
    } else {
      remarks = "Passed threshold; targeted revision recommended.";
    }
  }

  return {
    ...student,
    subjectResults,
    totalMarks,
    maxTotal,
    percentage: parseFloat(percentage.toFixed(1)),
    overallGrade,
    result,
    remarks
  };
}

function calculateClassRanks(studentsList) {
  // Pass students are ranked first by total marks descending; Failed students ranked after
  const passed = studentsList.filter(s => s.result === 'PASS').sort((a, b) => b.totalMarks - a.totalMarks);
  const failed = studentsList.filter(s => s.result === 'FAIL').sort((a, b) => b.totalMarks - a.totalMarks);

  let currentRank = 1;
  passed.forEach((student, index) => {
    if (index > 0 && student.totalMarks < passed[index - 1].totalMarks) {
      currentRank = index + 1;
    }
    student.rank = currentRank;
  });

  // Failed students get sequential rank after passed
  let failRank = passed.length + 1;
  failed.forEach((student, index) => {
    if (index > 0 && student.totalMarks < failed[index - 1].totalMarks) {
      failRank = passed.length + index + 1;
    }
    student.rank = failRank;
  });

  return [...passed, ...failed];
}

// ==========================================================================
// 3. Intelligent Header Matching & Normalization Engine
// ==========================================================================

function normalizeKey(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findMatchingKey(row, aliases) {
  const rowKeys = Object.keys(row);
  for (const alias of aliases) {
    const cleanAlias = normalizeKey(alias);
    for (const key of rowKeys) {
      if (normalizeKey(key) === cleanAlias) {
        return row[key];
      }
    }
  }
  return undefined;
}

function normalizeUnorderedRows(rawRows) {
  if (!rawRows || !rawRows.length) return [];

  const normalized = rawRows.map((row, idx) => {
    const admNo = findMatchingKey(row, ['admission no', 'admission number', 'adm no', 'adm_no', 'roll no', 'reg no', 'id']) || `ADM-${1000 + idx}`;
    const name = findMatchingKey(row, ['student name', 'name', 'student', 'candidate name', 'student_name']) || `Student ${idx + 1}`;
    const cls = findMatchingKey(row, ['class', 'grade', 'standard', 'cls']) || '10';
    const sec = findMatchingKey(row, ['section', 'sec']) || 'A';
    const yr = findMatchingKey(row, ['academic year', 'year', 'session']) || state.academicYear;
    const remarks = findMatchingKey(row, ['remarks', 'remark', 'comments', 'notes', 'evaluation']) || '';

    // Extract subjects according to standard sequence
    const marks = {
      tamil: Number(findMatchingKey(row, ['tamil', 'tam', 'language 1', 'lang1', 'first language'])) || 0,
      english: Number(findMatchingKey(row, ['english', 'eng', 'language 2', 'lang2', 'second language'])) || 0,
      maths: Number(findMatchingKey(row, ['mathematics', 'maths', 'math', 'mat'])) || 0,
      science: Number(findMatchingKey(row, ['science', 'sci', 'general science'])) || 0,
      social: Number(findMatchingKey(row, ['social science', 'social', 'soc sci', 'social studies', 'soc'])) || 0
    };

    return computeStudentMetrics({
      id: admNo.toString().trim(),
      admissionNo: admNo.toString().trim(),
      name: name.toString().trim(),
      class: cls.toString().trim(),
      section: sec.toString().trim(),
      academicYear: yr.toString().trim(),
      remarks: remarks.toString().trim(),
      marks
    });
  });

  return calculateClassRanks(normalized);
}

// ==========================================================================
// 4. UI Rendering Functions
// ==========================================================================

function getGradeBadgeClass(grade) {
  switch (grade) {
    case 'A+': return 'grade-a-plus';
    case 'A': return 'grade-a';
    case 'B+': return 'grade-b-plus';
    case 'B': return 'grade-b';
    case 'C': return 'grade-c';
    case 'D': return 'grade-d';
    case 'F': default: return 'grade-f';
  }
}

function renderOverviewStats() {
  const students = state.students;
  const total = students.length;

  document.getElementById('statTotalStudents').textContent = total;
  document.getElementById('totalStudentsCount').textContent = total;

  if (total === 0) {
    document.getElementById('statPassed').textContent = '0';
    document.getElementById('statPassRate').textContent = 'Pass Rate: 0%';
    document.getElementById('statFailed').textContent = '0';
    document.getElementById('statClassAvg').textContent = '0.0%';
    document.getElementById('statTopperName').textContent = '—';
    document.getElementById('statTopperScore').textContent = 'Score: —';
    return;
  }

  const passedCount = students.filter(s => s.result === 'PASS').length;
  const failedCount = total - passedCount;
  const passRate = ((passedCount / total) * 100).toFixed(1);

  const avgPercentage = (students.reduce((sum, s) => sum + s.percentage, 0) / total).toFixed(1);

  // Class Topper
  const topper = [...students].sort((a, b) => b.totalMarks - a.totalMarks)[0];

  document.getElementById('statPassed').textContent = passedCount;
  document.getElementById('statPassRate').textContent = `Pass Rate: ${passRate}%`;
  document.getElementById('statFailed').textContent = failedCount;
  document.getElementById('statClassAvg').textContent = `${avgPercentage}%`;

  if (topper) {
    document.getElementById('statTopperName').textContent = topper.name;
    document.getElementById('statTopperScore').textContent = `Rank #1 (${topper.totalMarks}/${topper.maxTotal} • ${topper.percentage}%)`;
  }

  renderSubjectAnalyticsBars();
}

function renderSubjectAnalyticsBars() {
  const container = document.getElementById('subjectAnalyticsBars');
  const students = state.students;
  if (!students.length) {
    container.innerHTML = '<p class="text-muted">No student records to analyze.</p>';
    return;
  }

  let html = '';
  SUBJECT_CONFIG.forEach(sub => {
    const passCount = students.filter(s => s.subjectResults[sub.id].passed).length;
    const passRate = Math.round((passCount / students.length) * 100);
    const avgScore = (students.reduce((sum, s) => sum + s.subjectResults[sub.id].obtained, 0) / students.length).toFixed(1);

    html += `
      <div class="subject-bar-row">
        <div class="subject-bar-meta">
          <span>${sub.name} (Avg: ${avgScore}/${sub.maxMarks})</span>
          <span>${passRate}% Pass Rate (${passCount}/${students.length})</span>
        </div>
        <div class="subject-bar-track">
          <div class="subject-bar-fill" style="width: ${passRate}%;"></div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function getFilteredAndSortedStudents() {
  let list = [...state.students];

  // Search filter
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase().trim();
    list = list.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.admissionNo.toLowerCase().includes(q)
    );
  }

  // Class filter
  if (state.filterClass !== 'ALL') {
    list = list.filter(s => s.class === state.filterClass);
  }

  // Section filter
  if (state.filterSection !== 'ALL') {
    list = list.filter(s => s.section === state.filterSection);
  }

  // Status filter
  if (state.filterStatus !== 'ALL') {
    list = list.filter(s => s.result === state.filterStatus);
  }

  // Sorting
  switch (state.sortBy) {
    case 'rank-asc':
      list.sort((a, b) => a.rank - b.rank);
      break;
    case 'adm-asc':
      list.sort((a, b) => a.admissionNo.localeCompare(b.admissionNo));
      break;
    case 'name-asc':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'total-desc':
      list.sort((a, b) => b.totalMarks - a.totalMarks);
      break;
  }

  return list;
}

function renderMarksTable() {
  const tbody = document.getElementById('marksTableBody');
  const emptyState = document.getElementById('emptyState');
  const visibleCountElem = document.getElementById('visibleStudentsCount');

  const filtered = getFilteredAndSortedStudents();
  visibleCountElem.textContent = filtered.length;

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  let rowsHtml = '';
  filtered.forEach(student => {
    // Rank medal badge
    let rankBadge = `<span class="rank-badge rank-standard">${student.rank}</span>`;
    if (student.rank === 1 && student.result === 'PASS') rankBadge = `<span class="rank-badge rank-1" title="1st Rank (Gold Medal)">🥇</span>`;
    else if (student.rank === 2 && student.result === 'PASS') rankBadge = `<span class="rank-badge rank-2" title="2nd Rank (Silver)">🥈</span>`;
    else if (student.rank === 3 && student.result === 'PASS') rankBadge = `<span class="rank-badge rank-3" title="3rd Rank (Bronze)">🥉</span>`;

    // Subject marks cells with highlight for failure or distinction
    const subjectCells = SUBJECT_CONFIG.map(sub => {
      const res = student.subjectResults[sub.id];
      let cellClass = 'col-subject';
      if (!res.passed) cellClass += ' mark-fail';
      else if (res.obtained >= 90) cellClass += ' mark-distinction';

      return `<td class="${cellClass}" title="${sub.name}: ${res.obtained}/${sub.max} (${res.grade})">${res.obtained}</td>`;
    }).join('');

    const statusBadge = student.result === 'PASS' 
      ? `<span class="badge badge-pass"><i class="fa-solid fa-check"></i> PASS</span>` 
      : `<span class="badge badge-fail"><i class="fa-solid fa-xmark"></i> FAIL</span>`;

    const rowFailClass = student.result === 'FAIL' ? 'row-failed' : '';
    const isLocked = state.isMarksLocked;

    rowsHtml += `
      <tr class="${rowFailClass}" data-student-id="${student.id}">
        <td class="col-rank">${rankBadge}</td>
        <td class="col-adm">${student.admissionNo}</td>
        <td class="col-name">${student.name}</td>
        <td class="col-class">${student.class}</td>
        <td class="col-sec">${student.section}</td>
        ${subjectCells}
        <td class="col-total">${student.totalMarks}</td>
        <td class="col-pct">${student.percentage}%</td>
        <td class="col-grade">
          <span class="badge-grade ${getGradeBadgeClass(student.overallGrade)}">${student.overallGrade}</span>
        </td>
        <td class="col-status">${statusBadge}</td>
        <td class="col-remarks" title="${student.remarks}">${student.remarks}</td>
        <td class="col-actions">
          <div class="action-btn-group">
            <button class="btn-table-icon btn-report" title="View & Print Official Report Card" onclick="openStudentReportCard('${student.id}')">
              <i class="fa-solid fa-id-card"></i>
            </button>
            <button class="btn-table-icon btn-edit" title="${isLocked ? 'Marks are locked' : 'Edit Marks'}" ${isLocked ? 'disabled' : ''} onclick="openEditMarksModal('${student.id}')">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = rowsHtml;
}

function renderRawSourceTable() {
  const head = document.getElementById('rawTableHead');
  const body = document.getElementById('rawTableBody');

  if (!state.rawUploadedData || !state.rawUploadedData.length) {
    head.innerHTML = '<tr><th>No Raw Data</th></tr>';
    body.innerHTML = '<tr><td class="text-muted">Upload an Excel file to preview raw unordered format.</td></tr>';
    return;
  }

  const columns = state.rawHeaders.length > 0 ? state.rawHeaders : Object.keys(state.rawUploadedData[0]);

  let headHtml = '<tr>' + columns.map(c => `<th>${c}</th>`).join('') + '</tr>';
  let bodyHtml = '';

  state.rawUploadedData.forEach(row => {
    bodyHtml += '<tr>' + columns.map(c => `<td>${row[c] !== undefined ? row[c] : ''}</td>`).join('') + '</tr>';
  });

  head.innerHTML = headHtml;
  body.innerHTML = bodyHtml;
}

// ==========================================================================
// 5. Official Student Report Card Modal & Printable Canvas
// ==========================================================================

function openStudentReportCard(studentId) {
  const student = state.students.find(s => s.id === studentId);
  if (!student) return;

  document.getElementById('rcStudentName').textContent = student.name;
  document.getElementById('rcAdmissionNo').textContent = student.admissionNo;
  document.getElementById('rcClassSection').textContent = `Class ${student.class} — Section '${student.section}'`;
  document.getElementById('rcAcademicYear').textContent = student.academicYear || state.academicYear;
  document.getElementById('rcExamName').textContent = state.activeExam;
  document.getElementById('rcRank').textContent = `Rank #${student.rank} of ${state.students.length}`;

  // Subject table matching user's exact specification:
  // Subject | Max Marks | Obtained | Grade
  let tbodyHtml = '';
  SUBJECT_CONFIG.forEach(sub => {
    const res = student.subjectResults[sub.id];
    tbodyHtml += `
      <tr>
        <td style="font-weight: 600;">${sub.name}</td>
        <td style="text-align: right; font-family: var(--font-mono);">${res.max}</td>
        <td style="text-align: right; font-family: var(--font-mono); font-weight: 700; ${!res.passed ? 'color: #dc2626;' : ''}">${res.obtained}</td>
        <td style="text-align: center;"><span class="badge-grade ${getGradeBadgeClass(res.grade)}">${res.grade}</span></td>
      </tr>
    `;
  });

  document.getElementById('rcMarksTableBody').innerHTML = tbodyHtml;

  // Footer / Total Row
  const footHtml = `
    <tr>
      <td style="font-weight: 800; font-size: 1rem;">Total</td>
      <td style="text-align: right; font-family: var(--font-mono); font-weight: 800; font-size: 1rem;">${student.maxTotal}</td>
      <td style="text-align: right; font-family: var(--font-mono); font-weight: 800; font-size: 1rem; color: #1e3a8a;">${student.totalMarks}</td>
      <td style="text-align: center;"><span class="badge-grade ${getGradeBadgeClass(student.overallGrade)}" style="font-size: 0.95rem;">${student.overallGrade}</span></td>
    </tr>
  `;
  document.getElementById('rcMarksTableFoot').innerHTML = footHtml;

  // Summary Metrics
  document.getElementById('rcPercentage').textContent = `${student.percentage}%`;
  document.getElementById('rcResultStatus').innerHTML = student.result === 'PASS' 
    ? '<span style="color: #059669;">PASS</span>' 
    : '<span style="color: #dc2626;">FAIL</span>';
  document.getElementById('rcOverallGrade').textContent = student.overallGrade;
  document.getElementById('rcRemarksText').textContent = student.remarks;

  // Show Modal
  document.getElementById('reportCardModal').classList.add('active');
}

function closeStudentReportCard() {
  document.getElementById('reportCardModal').classList.remove('active');
}

// ==========================================================================
// 6. Inline / Modal Editing Marks & Recalculation
// ==========================================================================

function openEditMarksModal(studentId) {
  if (state.isMarksLocked) {
    showToast('Marks are currently locked. Unlock to make edits.', 'warning');
    return;
  }

  const student = state.students.find(s => s.id === studentId);
  if (!student) return;

  document.getElementById('editStudentId').value = student.id;
  document.getElementById('editStudentName').textContent = student.name;
  document.getElementById('editAdmNo').value = student.admissionNo;
  document.getElementById('editClassSec').value = `Class ${student.class} - Sec ${student.section}`;
  document.getElementById('editRemarks').value = student.remarks;

  const container = document.getElementById('editSubjectsContainer');
  let inputsHtml = '';

  SUBJECT_CONFIG.forEach(sub => {
    const val = student.subjectResults[sub.id].obtained;
    inputsHtml += `
      <div class="form-group">
        <label for="edit_sub_${sub.id}">${sub.name} (Max: ${sub.maxMarks})</label>
        <input type="number" id="edit_sub_${sub.id}" class="form-control" min="0" max="${sub.maxMarks}" value="${val}" required>
      </div>
    `;
  });

  container.innerHTML = inputsHtml;
  document.getElementById('editMarksModal').classList.add('active');
}

function handleSaveEditedMarks(e) {
  e.preventDefault();
  if (state.isMarksLocked) {
    showToast('Marks are locked! Unauthorized edit rejected.', 'error');
    return;
  }

  const studentId = document.getElementById('editStudentId').value;
  const index = state.students.findIndex(s => s.id === studentId);
  if (index === -1) return;

  const current = state.students[index];
  const updatedMarks = {};

  SUBJECT_CONFIG.forEach(sub => {
    const input = document.getElementById(`edit_sub_${sub.id}`);
    const markVal = Number(input.value) || 0;
    updatedMarks[sub.id] = Math.min(Math.max(markVal, 0), sub.maxMarks);
  });

  const updatedRemarks = document.getElementById('editRemarks').value.trim();

  state.students[index] = computeStudentMetrics({
    ...current,
    marks: updatedMarks,
    remarks: updatedRemarks
  });

  // Re-rank students
  state.students = calculateClassRanks(state.students);

  document.getElementById('editMarksModal').classList.remove('active');
  renderOverviewStats();
  renderMarksTable();
  showToast(`Marks updated and recalculated for ${current.name}!`, 'success');
}

// ==========================================================================
// 7. Add New Student Flow
// ==========================================================================

function handleAddNewStudent(e) {
  e.preventDefault();
  if (state.isMarksLocked) {
    showToast('Marks are locked! Cannot add new students now.', 'warning');
    return;
  }

  const admNo = document.getElementById('newAdmNo').value.trim();
  const name = document.getElementById('newName').value.trim();
  const cls = document.getElementById('newClass').value;
  const sec = document.getElementById('newSection').value;
  const remarks = document.getElementById('newRemarks').value.trim();

  // Check unique admission no
  if (state.students.some(s => s.admissionNo.toLowerCase() === admNo.toLowerCase())) {
    showToast('A student with this Admission Number already exists!', 'error');
    return;
  }

  const marks = {
    tamil: Number(document.getElementById('newMarkTamil').value) || 0,
    english: Number(document.getElementById('newMarkEnglish').value) || 0,
    maths: Number(document.getElementById('newMarkMaths').value) || 0,
    science: Number(document.getElementById('newMarkScience').value) || 0,
    social: Number(document.getElementById('newMarkSocial').value) || 0
  };

  const newStudent = computeStudentMetrics({
    id: admNo,
    admissionNo: admNo,
    name,
    class: cls,
    section: sec,
    academicYear: state.academicYear,
    remarks,
    marks
  });

  state.students.push(newStudent);
  state.students = calculateClassRanks(state.students);

  document.getElementById('addStudentModal').classList.remove('active');
  document.getElementById('addStudentForm').reset();

  renderOverviewStats();
  renderMarksTable();
  showToast(`Successfully registered ${name} to Class ${cls}-${sec}!`, 'success');
}

// ==========================================================================
// 8. Excel Import (Parsing Any Scrambled / Unordered Sheet)
// ==========================================================================

function handleExcelFileUpload(file) {
  if (!file) return;

  const statusText = document.getElementById('fileStatusText');
  statusText.textContent = `Processing "${file.name}"...`;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (!rawJson || rawJson.length === 0) {
        showToast('The uploaded sheet is empty or invalid.', 'error');
        statusText.textContent = 'Upload failed: Empty sheet';
        return;
      }

      state.rawUploadedData = rawJson;
      state.rawHeaders = Object.keys(rawJson[0]);

      // Normalize into standard ordered structure
      state.students = normalizeUnorderedRows(rawJson);

      renderOverviewStats();
      renderMarksTable();
      renderRawSourceTable();

      statusText.innerHTML = `<span style="color: #059669;"><i class="fa-solid fa-check"></i> Loaded ${state.students.length} students & auto-ordered!</span>`;
      showToast(`Success! Reorganized ${state.students.length} student records into standard order.`, 'success');

      // Trigger celebration confetti
      if (typeof confetti === 'function') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      }

    } catch (err) {
      console.error(err);
      showToast('Error reading Excel file. Please check file format.', 'error');
      statusText.textContent = 'Error parsing file.';
    }
  };

  reader.readAsArrayBuffer(file);
}

// ==========================================================================
// 9. Excel Export (Pristine Standard Ordered Master Sheet)
// ==========================================================================

function exportOrderedExcel() {
  if (!state.students.length) {
    showToast('No student data to export.', 'warning');
    return;
  }

  // Create clean master records with exact standard order
  const exportRows = state.students.map(s => {
    return {
      "Class Rank": s.rank,
      "Admission No": s.admissionNo,
      "Student Name": s.name,
      "Class": s.class,
      "Section": s.section,
      "Academic Year": s.academicYear || state.academicYear,
      "Tamil (Max: 100)": s.subjectResults.tamil.obtained,
      "English (Max: 100)": s.subjectResults.english.obtained,
      "Mathematics (Max: 100)": s.subjectResults.maths.obtained,
      "Science (Max: 100)": s.subjectResults.science.obtained,
      "Social Science (Max: 100)": s.subjectResults.social.obtained,
      "Total Obtained (Max: 500)": s.totalMarks,
      "Percentage (%)": s.percentage,
      "Overall Grade": s.overallGrade,
      "Pass/Fail Status": s.result,
      "Teacher Remarks": s.remarks
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportRows);

  // Set column widths for readability
  worksheet['!cols'] = [
    { wch: 10 }, // Rank
    { wch: 16 }, // Adm No
    { wch: 22 }, // Name
    { wch: 8 },  // Class
    { wch: 8 },  // Section
    { wch: 14 }, // Year
    { wch: 16 }, // Tamil
    { wch: 16 }, // English
    { wch: 20 }, // Mathematics
    { wch: 16 }, // Science
    { wch: 20 }, // Social Science
    { wch: 22 }, // Total
    { wch: 14 }, // Percentage
    { wch: 14 }, // Grade
    { wch: 16 }, // Status
    { wch: 38 }  // Remarks
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Standard_Ordered_Marksheet");

  const fileName = `EduMark_Ordered_Marksheet_${state.activeExam.replace(/\s+/g, '_')}_${state.academicYear}.xlsx`;
  XLSX.writeFile(workbook, fileName);

  showToast('Downloaded cleaned and ordered Excel marksheet!', 'success');
}

// Download Sample Unordered File directly from browser
function downloadSampleUnorderedExcel() {
  const worksheet = XLSX.utils.json_to_sheet(DEMO_UNORDERED_SOURCE);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Messy_Unordered_Input");
  XLSX.writeFile(workbook, "Client_Unordered_Marks_Sample.xlsx");
  showToast('Sample unordered Excel downloaded! You can upload it to test.', 'success');
}

// ==========================================================================
// 10. Mark Locking & User Access Controls
// ==========================================================================

function toggleMarkLocking() {
  state.isMarksLocked = !state.isMarksLocked;
  const btn = document.getElementById('lockStatusBtn');
  const icon = document.getElementById('lockIcon');
  const label = document.getElementById('lockStatusLabel');

  if (state.isMarksLocked) {
    btn.classList.add('locked');
    icon.className = 'fa-solid fa-lock';
    label.textContent = 'Marks Locked';
    showToast('Marks are now LOCKED. No edits or additions are permitted.', 'warning');
  } else {
    btn.classList.remove('locked');
    icon.className = 'fa-solid fa-lock-open';
    label.textContent = 'Marks Unlocked';
    showToast('Marks unlocked. Authorized users may edit.', 'success');
  }

  renderMarksTable();
}

// ==========================================================================
// 11. Toast Notifications
// ==========================================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let iconClass = 'fa-solid fa-circle-info';
  if (type === 'success') iconClass = 'fa-solid fa-circle-check';
  else if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';
  else if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';

  toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// 12. Batch Print All Report Cards
// ==========================================================================

function batchPrintAllReportCards() {
  const students = getFilteredAndSortedStudents();
  if (!students.length) {
    showToast('No student records to print.', 'warning');
    return;
  }

  // Generate an offscreen print document containing all cards
  const printWindow = window.open('', '_blank');
  let cardsHtml = '';

  students.forEach(student => {
    let rowsHtml = '';
    SUBJECT_CONFIG.forEach(sub => {
      const res = student.subjectResults[sub.id];
      rowsHtml += `
        <tr>
          <td style="padding: 6px 12px; border: 1px solid #999;">${sub.name}</td>
          <td style="padding: 6px 12px; border: 1px solid #999; text-align: right;">${res.max}</td>
          <td style="padding: 6px 12px; border: 1px solid #999; text-align: right; font-weight: bold; ${!res.passed ? 'color: red;' : ''}">${res.obtained}</td>
          <td style="padding: 6px 12px; border: 1px solid #999; text-align: center;">${res.grade}</td>
        </tr>
      `;
    });

    cardsHtml += `
      <div style="page-break-after: always; padding: 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="border: 3px double #1e3a8a; padding: 20px; border-radius: 4px;">
          <div style="text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #1e3a8a; font-size: 22px;">ST. ANDREW'S ACADEMY</h2>
            <p style="margin: 4px 0; font-size: 13px; color: #555;">Institutional Examination Progress Card (2024-2025)</p>
          </div>
          <table style="width: 100%; margin-bottom: 15px; font-size: 14px;">
            <tr>
              <td><strong>Student Name:</strong> ${student.name}</td>
              <td><strong>Adm No:</strong> ${student.admissionNo}</td>
              <td><strong>Class:</strong> ${student.class}-${student.section}</td>
            </tr>
            <tr>
              <td><strong>Exam:</strong> ${state.activeExam}</td>
              <td><strong>Rank:</strong> #${student.rank}</td>
              <td><strong>Result:</strong> <span style="font-weight: bold; color: ${student.result === 'PASS' ? 'green' : 'red'};">${student.result}</span></td>
            </tr>
          </table>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 14px;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 6px 12px; border: 1px solid #999; text-align: left;">Subject</th>
                <th style="padding: 6px 12px; border: 1px solid #999; text-align: right;">Max Marks</th>
                <th style="padding: 6px 12px; border: 1px solid #999; text-align: right;">Obtained</th>
                <th style="padding: 6px 12px; border: 1px solid #999; text-align: center;">Grade</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #f8fafc; font-weight: bold;">
                <td style="padding: 8px 12px; border: 1px solid #999;">Total</td>
                <td style="padding: 8px 12px; border: 1px solid #999; text-align: right;">${student.maxTotal}</td>
                <td style="padding: 8px 12px; border: 1px solid #999; text-align: right; color: #1e3a8a;">${student.totalMarks}</td>
                <td style="padding: 8px 12px; border: 1px solid #999; text-align: center;">${student.overallGrade}</td>
              </tr>
            </tfoot>
          </table>
          <div style="font-size: 13px; margin-bottom: 25px;">
            <strong>Teacher Remarks:</strong> <em>${student.remarks}</em>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 40px; font-size: 13px;">
            <div style="text-align: center; width: 140px; border-top: 1px solid #777; padding-top: 4px;">Class Teacher</div>
            <div style="text-align: center; width: 140px; border-top: 1px solid #777; padding-top: 4px;">Exam Incharge</div>
            <div style="text-align: center; width: 140px; border-top: 1px solid #777; padding-top: 4px;">Principal</div>
          </div>
        </div>
      </div>
    `;
  });

  printWindow.document.write(`
    <html>
      <head><title>Batch Report Cards — St. Andrew's Academy</title></head>
      <body onload="window.print(); window.close();">${cardsHtml}</body>
    </html>
  `);
  printWindow.document.close();
}

// ==========================================================================
// 13. Event Listeners & Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Demo Data Loading
  state.rawUploadedData = DEMO_UNORDERED_SOURCE;
  state.rawHeaders = Object.keys(DEMO_UNORDERED_SOURCE[0]);
  state.students = normalizeUnorderedRows(DEMO_UNORDERED_SOURCE);

  renderOverviewStats();
  renderMarksTable();
  renderRawSourceTable();

  // 2. Load Demo Button
  document.getElementById('demoLoadBtn').addEventListener('click', () => {
    state.rawUploadedData = DEMO_UNORDERED_SOURCE;
    state.rawHeaders = Object.keys(DEMO_UNORDERED_SOURCE[0]);
    state.students = normalizeUnorderedRows(DEMO_UNORDERED_SOURCE);
    renderOverviewStats();
    renderMarksTable();
    renderRawSourceTable();
    document.getElementById('fileStatusText').innerHTML = `<span style="color: #059669;"><i class="fa-solid fa-check"></i> Loaded 8 demo records & normalized</span>`;
    showToast('Loaded client unordered demo dataset and normalized it into standard order!', 'success');
  });

  // 3. Download Sample Excel
  document.getElementById('downloadSampleExcelBtn').addEventListener('click', downloadSampleUnorderedExcel);

  // 4. Export Ordered Excel
  document.getElementById('exportOrderedExcelBtn').addEventListener('click', exportOrderedExcel);

  // 5. File Drag & Drop
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('excelFileInput');

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      handleExcelFileUpload(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleExcelFileUpload(e.target.files[0]);
    }
  });

  // 6. View Tabs
  const tabStandard = document.getElementById('tabStandardView');
  const tabRaw = document.getElementById('tabRawView');
  const standardView = document.getElementById('standardTableView');
  const rawView = document.getElementById('rawTableView');

  tabStandard.addEventListener('click', () => {
    tabStandard.classList.add('active');
    tabRaw.classList.remove('active');
    standardView.style.display = 'block';
    rawView.style.display = 'none';
  });

  tabRaw.addEventListener('click', () => {
    tabRaw.classList.add('active');
    tabStandard.classList.remove('active');
    standardView.style.display = 'none';
    rawView.style.display = 'block';
  });

  // 7. Search & Filters
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    renderMarksTable();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderMarksTable();
  });

  document.getElementById('filterClass').addEventListener('change', (e) => {
    state.filterClass = e.target.value;
    renderMarksTable();
  });

  document.getElementById('filterSection').addEventListener('change', (e) => {
    state.filterSection = e.target.value;
    renderMarksTable();
  });

  document.getElementById('filterStatus').addEventListener('change', (e) => {
    state.filterStatus = e.target.value;
    renderMarksTable();
  });

  document.getElementById('sortBySelect').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderMarksTable();
  });

  document.getElementById('examSelect').addEventListener('change', (e) => {
    state.activeExam = e.target.value;
    showToast(`Switched active view to ${state.activeExam}`, 'info');
  });

  document.getElementById('academicYearSelect').addEventListener('change', (e) => {
    state.academicYear = e.target.value;
    showToast(`Switched academic year to ${state.academicYear}`, 'info');
  });

  // 8. Lock Status Toggle
  document.getElementById('lockStatusBtn').addEventListener('click', toggleMarkLocking);

  // 9. Batch Print
  document.getElementById('batchPrintBtn').addEventListener('click', batchPrintAllReportCards);

  // 10. Print Single Report Card
  document.getElementById('printReportCardBtn').addEventListener('click', () => {
    window.print();
  });

  // 11. Modal Close Buttons
  document.getElementById('closeReportCardModal').addEventListener('click', closeStudentReportCard);
  document.getElementById('closeEditModalBtn').addEventListener('click', () => {
    document.getElementById('editMarksModal').classList.remove('active');
  });
  document.getElementById('cancelEditBtn').addEventListener('click', () => {
    document.getElementById('editMarksModal').classList.remove('active');
  });

  // 12. Edit Marks Form Submit
  document.getElementById('editMarksForm').addEventListener('submit', handleSaveEditedMarks);

  // 13. Add Student Modal
  document.getElementById('addStudentBtn').addEventListener('click', () => {
    if (state.isMarksLocked) {
      showToast('Marks are locked! Cannot add new students.', 'warning');
      return;
    }
    document.getElementById('addStudentModal').classList.add('active');
  });

  document.getElementById('closeAddStudentModalBtn').addEventListener('click', () => {
    document.getElementById('addStudentModal').classList.remove('active');
  });
  document.getElementById('cancelAddStudentBtn').addEventListener('click', () => {
    document.getElementById('addStudentModal').classList.remove('active');
  });

  document.getElementById('addStudentForm').addEventListener('submit', handleAddNewStudent);

  // 14. Subject Management Modal
  document.getElementById('subjectMgmtBtn').addEventListener('click', () => {
    document.getElementById('subjectMgmtModal').classList.add('active');
  });
  document.getElementById('closeSubjectModalBtn').addEventListener('click', () => {
    document.getElementById('subjectMgmtModal').classList.remove('active');
  });
  document.getElementById('closeSubjectModalFooterBtn').addEventListener('click', () => {
    document.getElementById('subjectMgmtModal').classList.remove('active');
  });

  // Close modals when clicking outside dialog
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
});
