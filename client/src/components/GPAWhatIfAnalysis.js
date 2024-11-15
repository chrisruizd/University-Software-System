import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function GPAWhatIfAnalysis({ role }) {
  const [currentGPA, setCurrentGPA] = useState('');
  const [totalCredits, setTotalCredits] = useState('');
  const [courses, setCourses] = useState([{ grade: '', credits: '' }]);
  const [desiredGPA, setDesiredGPA] = useState('');
  const [predictedGPA, setPredictedGPA] = useState('');
  const [requiredCourses, setRequiredCourses] = useState(null);

  // Grade point conversion
  const gradePoints = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0 };

  // Handle course input changes
  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  // Add a new course input row
  const addCourse = () => {
    setCourses([...courses, { grade: '', credits: '' }]);
  };

  // Calculate Predicted GPA
  const calculatePredictedGPA = () => {
    const currentPoints = parseFloat(currentGPA) * parseFloat(totalCredits);
    let futurePoints = 0;
    let futureCredits = 0;

    courses.forEach(course => {
      const points = gradePoints[course.grade] || 0;
      const credits = parseFloat(course.credits) || 0;
      futurePoints += points * credits;
      futureCredits += credits;
    });

    const newGPA = (currentPoints + futurePoints) / (parseFloat(totalCredits) + futureCredits);
    setPredictedGPA(newGPA.toFixed(2));
  };

  // Calculate Required Courses for Desired GPA
  const calculateRequiredCourses = () => {
    const currentPoints = parseFloat(currentGPA) * parseFloat(totalCredits);
    const desiredPoints = parseFloat(desiredGPA) * (parseFloat(totalCredits) + 3);
    let coursesNeeded = 1;
    let gradeNeeded = '';

    while (coursesNeeded <= 10) {
      const newCredits = parseFloat(totalCredits) + coursesNeeded * 3;
      const newPoints = desiredPoints * newCredits;
      const requiredGradePoints = (newPoints - currentPoints) / (coursesNeeded * 3);

      gradeNeeded = Object.keys(gradePoints).find(key => gradePoints[key] >= requiredGradePoints);

      if (gradeNeeded) {
        setRequiredCourses({
          numCourses: coursesNeeded,
          creditsPerCourse: 3,
          gradeNeeded,
        });
        return;
      }

      coursesNeeded++;
    }

    setRequiredCourses(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">{role === 'advisor' ? 'Advisor - What-If GPA Calculator' : 'Student - What-If GPA Calculator'}</h2>

      <div className="mb-4">
        <h4>Enter Your Current GPA and Total Credits</h4>
        <input
          type="number"
          step="0.01"
          placeholder="Current GPA"
          className="form-control mb-2"
          value={currentGPA}
          onChange={(e) => setCurrentGPA(e.target.value)}
        />
        <input
          type="number"
          placeholder="Total Credits Completed"
          className="form-control mb-2"
          value={totalCredits}
          onChange={(e) => setTotalCredits(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <h4>Predicted GPA based on courses</h4>
        <div>
          {courses.map((course, index) => (
            <div key={index} className="d-flex mb-2">
              <select
                className="form-control me-2"
                value={course.grade}
                onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
              >
                <option value="">Select Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
              <input
                type="number"
                placeholder="Credits"
                className="form-control"
                value={course.credits}
                onChange={(e) => handleCourseChange(index, 'credits', e.target.value)}
              />
            </div>
          ))}
          <button className="btn btn-secondary mb-3 w-100" onClick={addCourse}>
            Add Another Course
          </button>
        </div>

        <button className="btn btn-primary w-100 mb-3" onClick={calculatePredictedGPA}>
          Calculate Predicted GPA
        </button>
        {predictedGPA && <div className="alert alert-info">Predicted GPA: {predictedGPA}</div>}
      </div>

      <div className="mb-4">
        <h4>Predicted Grades needed for Desired GPA</h4>
        <input
          type="number"
          step="0.01"
          placeholder="Desired GPA"
          className="form-control mb-2"
          value={desiredGPA}
          onChange={(e) => setDesiredGPA(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={calculateRequiredCourses}>
          Calculate Required Courses
        </button>
        {requiredCourses && (
          <div className="alert alert-info">
            {requiredCourses.message ||
              `To achieve your desired GPA, you need at least ${requiredCourses.numCourses} courses with ${requiredCourses.creditsPerCourse} credits each, and a grade of at least ${requiredCourses.gradeNeeded}.`}
          </div>
        )}
      </div>
    </div>
  );
}

export default GPAWhatIfAnalysis;
