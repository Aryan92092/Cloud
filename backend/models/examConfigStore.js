/**
 * Examination Configuration Store
 * Holds active examination marking scheme and passing rules.
 */

const DEFAULT_CONFIG = {
  numSubjects: 6,
  maxMarksPerSubject: 100,
  passingMarksPerSubject: 40
};

let currentConfig = { ...DEFAULT_CONFIG };

function validateConfig(config) {
  const errors = [];
  const numSubjects = Number(config.numSubjects);
  const maxMarks = Number(config.maxMarksPerSubject);
  const passingMarks = Number(config.passingMarksPerSubject);

  if (isNaN(numSubjects) || numSubjects <= 0 || !Number.isInteger(numSubjects)) {
    errors.push('Number of subjects must be an integer greater than 0');
  }

  if (isNaN(maxMarks) || maxMarks <= 0) {
    errors.push('Maximum marks per subject must be greater than 0');
  }

  if (isNaN(passingMarks) || passingMarks < 0) {
    errors.push('Passing marks per subject must be greater than or equal to 0');
  }

  if (!isNaN(maxMarks) && !isNaN(passingMarks) && passingMarks > maxMarks) {
    errors.push('Passing marks cannot be greater than maximum marks.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function getExamConfig() {
  const maxTotalMarks = currentConfig.numSubjects * currentConfig.maxMarksPerSubject;
  return {
    ...currentConfig,
    maxTotalMarks,
    passingRule: `Students must score at least ${currentConfig.passingMarksPerSubject} marks in EVERY subject to be considered PASS.`
  };
}

function setExamConfig(newConfig) {
  const validation = validateConfig(newConfig);
  if (!validation.isValid) {
    const err = new Error(validation.errors.join('; '));
    err.status = 400;
    err.validationErrors = validation.errors;
    throw err;
  }

  currentConfig = {
    numSubjects: parseInt(newConfig.numSubjects, 10),
    maxMarksPerSubject: Number(newConfig.maxMarksPerSubject),
    passingMarksPerSubject: Number(newConfig.passingMarksPerSubject)
  };

  return getExamConfig();
}

function resetExamConfig() {
  currentConfig = { ...DEFAULT_CONFIG };
  return getExamConfig();
}

module.exports = {
  DEFAULT_CONFIG,
  validateConfig,
  getExamConfig,
  setExamConfig,
  resetExamConfig
};
