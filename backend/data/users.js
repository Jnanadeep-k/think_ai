// Mock/dummy users, stored in memory (an array).
// This stands in for a real Users table until the DB is connected.
// NOTE: This data resets every time the server restarts — that's expected for a skeleton/demo.
let users = [
  { id: 1, name: "Ravi Kumar", email: "ravi@thinkz.ai", role: "Learner" },
  { id: 2, name: "Priya Sharma", email: "priya@thinkz.ai", role: "Instructor" },
  { id: 3, name: "Arjun Mehta", email: "arjun@thinkz.ai", role: "TA" },
  { id: 4, name: "Anita Rao", email: "anita@thinkz.ai", role: "Admin" },
];

module.exports = { users };
