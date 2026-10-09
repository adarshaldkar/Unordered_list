const XLSX = require('xlsx');
const path = require('path');

// Jumbled unordered columns demonstrating real-world client messiness:
// Subject columns scrambled, student meta columns scattered, inconsistent order
const unorderedData = [
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
    "Mathematics": 32, // < 35, fail in Maths
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

const worksheet = XLSX.utils.json_to_sheet(unorderedData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Raw_Unordered_Marks");

const outputPath = path.join(__dirname, 'client_unordered_marks_sample.xlsx');
XLSX.writeFile(workbook, outputPath);
console.log('Successfully generated sample unordered Excel at:', outputPath);
