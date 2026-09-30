require('dotenv').config();
const mongoose = require('mongoose');
const { generateStudentRecords } = require('./dataGenerator');
const mergeSort = require('../algorithms/sorting/mergeSort');
const { assignRanks } = require('../algorithms/ranking/rankingAlgorithm');
const dataStore = require('../models/dataStore');

async function runSeed() {
  console.log('🌱 Starting MongoDB Database Seeder for Student Ranking System...');
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_ranking_daa';

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log(' Connected to MongoDB:', mongoUri);

    const count = parseInt(process.argv[2], 10) || 100;
    console.log(` Generating ${count} realistic student academic records...`);

    const raw = generateStudentRecords(count);
    const sorted = mergeSort(raw).sortedData;
    const ranked = assignRanks(sorted);

    // Save
    await dataStore.replaceAllStudents(ranked);
    console.log(`✅ Successfully seeded ${ranked.length} student records into database.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    console.log('ℹ️ Local in-memory fallback will automatically be used if MongoDB server is offline.');
    process.exit(0);
  }
}

runSeed();
