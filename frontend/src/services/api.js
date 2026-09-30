const API_BASE_URL = '/api';

async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || ('HTTP error ' + res.status));
    }
    return data;
  } catch (err) {
    console.error('API error on ' + url + ':', err);
    throw err;
  }
}

export const api = {
  // Students
  getAllStudents: () => fetchJson(API_BASE_URL + '/students'),
  getStudentById: (id) => fetchJson(API_BASE_URL + '/students/' + id),
  createStudent: (data) => fetchJson(API_BASE_URL + '/students', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateStudent: (id, data) => fetchJson(API_BASE_URL + '/students/' + id, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteStudent: (id) => fetchJson(API_BASE_URL + '/students/' + id, {
    method: 'DELETE'
  }),
  importStudents: (students, examConfig = null) => fetchJson(API_BASE_URL + '/students/import', {
    method: 'POST',
    body: JSON.stringify({ students, examConfig })
  }),

  // Examination Configuration & Marking Scheme
  getExamConfig: () => fetchJson(API_BASE_URL + '/config'),
  updateExamConfig: (config) => fetchJson(API_BASE_URL + '/config', {
    method: 'PUT',
    body: JSON.stringify(config)
  }),
  resetExamConfig: () => fetchJson(API_BASE_URL + '/config/reset', {
    method: 'POST'
  }),

  // Results & Ranking
  processAndRank: (algorithm) => fetchJson(API_BASE_URL + '/results/process', {
    method: 'POST',
    body: JSON.stringify({ algorithm })
  }),
  loadDemoDataset: (count = 100) => fetchJson(API_BASE_URL + '/results/load-demo', {
    method: 'POST',
    body: JSON.stringify({ count })
  }),
  getMeritList: (limit = 0) => fetchJson(API_BASE_URL + '/results/merit-list?limit=' + limit),

  // Search
  searchStudents: (params) => fetchJson(API_BASE_URL + '/search', {
    method: 'POST',
    body: JSON.stringify(params)
  }),

  // Benchmark
  runBenchmark: (sizes) => fetchJson(API_BASE_URL + '/benchmark', {
    method: 'POST',
    body: JSON.stringify({ sizes })
  }),

  // Analytics
  getAnalytics: () => fetchJson(API_BASE_URL + '/analytics'),
  getHealth: () => fetchJson(API_BASE_URL + '/health')
};
