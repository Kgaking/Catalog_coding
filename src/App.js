import React, { useState } from 'react';

function App() {
  const [fileData, setFileData] = useState(null);
  const [constantTerm, setConstantTerm] = useState(null);

  // Function to handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonData = JSON.parse(event.target.result);
      setFileData(jsonData);
    };
    reader.readAsText(file);
  };

  // Function to decode value from the given base
  const decodeValue = (base, value) => {
    return parseInt(value, base);
  };

  // Function for Lagrange interpolation to calculate constant term
  const lagrangeInterpolation = (points, k) => {
    const basisPolynomial = (i, x) => {
      let numerator = 1;
      let denominator = 1;
      const [xi, _] = points[i];
      for (let j = 0; j < k; j++) {
        if (j !== i) {
          const [xj, _] = points[j];
          numerator *= (x - xj);
          denominator *= (xi - xj);
        }
      }
      return numerator / denominator;
    };

    let constantTerm = 0;
    for (let i = 0; i < k; i++) {
      const [xi, yi] = points[i];
      constantTerm += yi * basisPolynomial(i, 0);
    }
    return constantTerm;
  };

  // Function to compute the constant term
  const computeConstantTerm = () => {
    if (!fileData) return;

    const { n, k } = fileData.keys;

    // Extract the points and decode the y-values
    const points = [];
    Object.keys(fileData).forEach((key) => {
      if (!isNaN(key)) {
        const x = parseInt(key, 10);
        const base = parseInt(fileData[key].base, 10);
        const value = fileData[key].value;
        const y = decodeValue(base, value);
        points.push([x, y]);
      }
    });

    // Sort points by x-value
    points.sort((a, b) => a[0] - b[0]);

    // Calculate constant term using Lagrange interpolation
    const constant = lagrangeInterpolation(points, k);
    setConstantTerm(constant);
  };

  return (
    <div className="App">
      <h1>Shamir's Secret Sharing</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={computeConstantTerm}>Compute Constant Term</button>

      {constantTerm !== null && (
        <div>
          <h2>The constant term 'c' is: {constantTerm}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
