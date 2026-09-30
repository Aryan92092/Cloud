const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { generateStudentRecords } = require('../seed/dataGenerator');
const { assignRanks, studentComparator } = require('../algorithms/ranking/rankingAlgorithm');
const mergeSort = require('../algorithms/sorting/mergeSort');

// In-memory / local JSON store fallback
let memoryStudents = [];
let isMongoConnected = false;

// Mongoose Student Schema
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  marks: { type: Number, required: true, min: 0 }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, index: true },
  rollNumber: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  subjects: [subjectSchema],
  total: { type: Number, default: 0 },
  average: { type: Number, default: 0 },
  percentage: { type: Number, default: 0, index: true },
  grade: { type: String, default: 'F' },
  status: { type: String, enum: ['PASS', 'FAIL'], default: 'FAIL' },
  failedSubjects: { type: Number, default: 0 },
  failedSubjectsCount: { type: Number, default: 0 },
  rank: { type: Number, default: 0, index: true }
}, { timestamps: true });

let StudentModel = null;

async function initDataStore() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2500
      });
      isMongoConnected = true;
      StudentModel = mongoose.models.Student || mongoose.model('Student', studentSchema);
      console.log(' connected successfully to MongoDB:', mongoUri);

      const count = await StudentModel.countDocuments();
      if (count === 0) {
        console.log(' Seeding 100 initial students to MongoDB...');
        const initial = generateStudentRecords(100);
        const sorted = mergeSort(initial).sortedData;
        const ranked = assignRanks(sorted);
        await StudentModel.insertMany(ranked);
        console.log(' MongoDB seeded with 100 ranked student records.');
      }
      return;
    } catch (err) {
      console.warn('⚠️ MongoDB connection failed, falling back to in-memory JSON data store:', err.message);
      isMongoConnected = false;
    }
  } else {
    console.log('ℹ️ No MONGODB_URI provided. Initializing fast in-memory store with local persistence.');
  }

  // Load fallback seed data
  if (memoryStudents.length === 0) {
    const raw = generateStudentRecords(100);
    const sorted = mergeSort(raw).sortedData;
    memoryStudents = assignRanks(sorted);
    console.log(` Initialized in-memory store with ${memoryStudents.length} student records.`);
  }
}

// Data Store CRUD operations
async function getAllStudents() {
  if (isMongoConnected && StudentModel) {
    return await StudentModel.find().lean();
  }
  return [...memoryStudents];
}

async function getStudentById(id) {
  if (isMongoConnected && StudentModel) {
    return await StudentModel.findOne({ $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { studentId: id }, { rollNumber: id }] }).lean();
  }
  return memoryStudents.find(s => s._id === id || s.studentId === id || s.rollNumber === id) || null;
}

async function createStudent(studentData) {
  if (isMongoConnected && StudentModel) {
    const newDoc = new StudentModel(studentData);
    return await newDoc.save();
  }
  const newStudent = {
    _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    ...studentData,
    createdAt: new Date().toISOString()
  };
  memoryStudents.push(newStudent);
  return newStudent;
}

async function updateStudent(id, updateData) {
  if (isMongoConnected && StudentModel) {
    return await StudentModel.findOneAndUpdate(
      { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { studentId: id }, { rollNumber: id }] },
      updateData,
      { new: true }
    ).lean();
  }
  const idx = memoryStudents.findIndex(s => s._id === id || s.studentId === id || s.rollNumber === id);
  if (idx === -1) return null;
  memoryStudents[idx] = { ...memoryStudents[idx], ...updateData, updatedAt: new Date().toISOString() };
  return memoryStudents[idx];
}

async function deleteStudent(id) {
  if (isMongoConnected && StudentModel) {
    const res = await StudentModel.findOneAndDelete({ $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { studentId: id }, { rollNumber: id }] });
    return !!res;
  }
  const initialLen = memoryStudents.length;
  memoryStudents = memoryStudents.filter(s => s._id !== id && s.studentId !== id && s.rollNumber !== id);
  return memoryStudents.length < initialLen;
}

async function replaceAllStudents(newStudentsList) {
  if (isMongoConnected && StudentModel) {
    await StudentModel.deleteMany({});
    if (newStudentsList.length > 0) {
      await StudentModel.insertMany(newStudentsList);
    }
    return newStudentsList.length;
  }
  memoryStudents = [...newStudentsList];
  return memoryStudents.length;
}

function getStoreStatus() {
  return {
    isMongoConnected,
    totalRecords: isMongoConnected ? 'Dynamic MongoDB' : memoryStudents.length,
    engine: isMongoConnected ? 'MongoDB (Mongoose)' : 'In-Memory JSON Store'
  };
}

module.exports = {
  initDataStore,
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  replaceAllStudents,
  getStoreStatus
};
