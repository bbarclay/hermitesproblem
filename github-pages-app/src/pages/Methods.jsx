import React from 'react';
import { InlineMath } from 'react-katex';

const Methods = () => {
  return (
    <div>
      <h2 className="mb-4">Three Novel Approaches to Solving Hermite's Problem</h2>
      
      <div className="methods-container">
        <div className="method-card">
          <h4 className="method-title">HAPD Algorithm</h4>
          <p>The Hermite Algorithm for Periodicity Detection (HAPD) operates in projective space, providing a geometric view of the periodicity problem.</p>
          <h5>Key Features:</h5>
          <ul>
            <li>Leverages projective geometry</li>
            <li>Visualizes periodicity geometrically</li>
            <li>Handles all cubic irrationals</li>
          </ul>
          <div className="figure">
            <img src="/path/to/hapd_algorithm_flowchart.png" alt="HAPD Algorithm Flowchart" />
            <div className="figure-caption">Flowchart of the HAPD algorithm process</div>
          </div>
        </div>
        
        <div className="method-card">
          <h4 className="method-title">Matrix Approach</h4>
          <p>This approach utilizes companion matrices and trace sequences with modular periodicity to characterize cubic irrationals.</p>
          <h5>Key Features:</h5>
          <ul>
            <li>Algebraic characterization</li>
            <li>Efficient trace computation</li>
            <li>Clear connection to Galois theory</li>
          </ul>
          <div className="theorem">
            <strong>Theorem:</strong> A cubic irrational <InlineMath math={"\\alpha"} /> generates a periodic sequence if and only if its trace sequence exhibits modular periodicity.
          </div>
        </div>
        
        <div className="method-card">
          <h4 className="method-title">Modified sin²-Algorithm</h4>
          <p>An adaptation of Karpenkov's algorithm specifically designed to handle cubic irrationals with complex conjugate roots.</p>
          <h5>Key Features:</h5>
          <ul>
            <li>Extends existing algorithms</li>
            <li>Specialized for complex roots</li>
            <li>Algorithmic efficiency</li>
          </ul>
          <div className="example">
            <strong>Example:</strong> For a cubic with complex conjugate roots, the algorithm transforms the geometric interpretation to account for rotational components.
          </div>
        </div>
      </div>
      
      <div className="section">
        <h4>Equivalence of Methods</h4>
        <p>
          A significant contribution of this work is the demonstration that these three approaches are mathematically equivalent but offer different insights and computational advantages. Each method illuminates different aspects of the mathematical structure underlying Hermite's problem.
        </p>
        <div className="theorem">
          <strong>Equivalence Theorem:</strong> For any cubic irrational <InlineMath math={"\\alpha"} />, the following are equivalent:
          <ol>
            <li>The HAPD algorithm produces a periodic sequence.</li>
            <li>The trace sequence from the matrix approach exhibits modular periodicity.</li>
            <li>The modified sin²-algorithm detects periodicity.</li>
          </ol>
        </div>
      </div>
      
      <div className="alert alert-info mt-4">
        <p>Detailed mathematical proofs and algorithms will be added in the final version.</p>
      </div>
    </div>
  );
};

export default Methods; 