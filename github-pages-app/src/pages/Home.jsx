import React from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from 'react-katex';

const Home = () => {
  return (
    <div>
      <h1 className="text-center mb-4">Solving Hermite's Problem: Three Novel Approaches for Complete Characterization of Cubic Irrationals</h1>
      <h4 className="text-center text-muted mb-4">Brandon Barclay • April 2025</h4>

      <div className="abstract">
        <h3>Abstract</h3>
        <p>
          This paper presents a comprehensive study of Hermite's problem for cubic irrationals, offering three novel approaches for their complete characterization. The problem, first posed by Charles Hermite in 1848, concerns finding necessary and sufficient conditions for the periodicity of sequences derived from cubic irrationals. While previous research has addressed specific cases, our work provides a unified treatment that encompasses all cubic irrationals, including those with complex conjugate roots. We develop the Hermite Algorithm for Periodicity Detection (HAPD) in projective space, a matrix approach using companion matrices and trace sequences, and a modified sin²-algorithm. Our results establish equivalence relationships among these methods and provide explicit algorithms for computation. This work extends existing literature and offers new insights into the algebraic and geometric properties of cubic irrationals.
        </p>
      </div>

      <div className="section">
        <h3>Introduction</h3>
        <p>
          In 1848, the mathematician Charles Hermite posed a fundamental question in number theory: What are the necessary and sufficient conditions for the periodicity of sequences derived from cubic irrationals? This problem has profound implications for understanding the structure of algebraic numbers and their representations.
        </p>
        <p>
          This paper presents a complete solution to Hermite's problem through three distinct approaches:
        </p>
        <ol>
          <li><strong>HAPD Algorithm</strong>: A projective space approach that generates periodic sequences for cubic irrationals.</li>
          <li><strong>Matrix Approach</strong>: Uses companion matrices and trace sequences to identify and characterize cubic irrationals.</li>
          <li><strong>Modified sin²-algorithm</strong>: An extension of Karpenkov's algorithm adapted for cubic irrationals with complex conjugate roots.</li>
        </ol>
        <p>
          Each method provides a different perspective on the problem, offering mathematical insights and computational advantages. Together, they form a comprehensive framework for understanding cubic irrationals and their periodicity properties.
        </p>
      </div>

      <div className="section">
        <h3>Quick Navigation</h3>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Full Paper</h5>
                <p className="card-text">Read the complete research paper with all mathematical details.</p>
                <Link to="/paper" className="btn btn-primary">Read Paper</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">The Three Methods</h5>
                <p className="card-text">Explore the three novel approaches to solving Hermite's problem.</p>
                <Link to="/methods" className="btn btn-primary">Explore Methods</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Interactive Elements</h5>
                <p className="card-text">Explore interactive visualizations and demonstrations.</p>
                <Link to="/interactive" className="btn btn-primary">Try Interactive Tools</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Interactive Testing</h5>
                <p className="card-text">Run algorithm tests in your browser and visualize results.</p>
                <Link to="/testing" className="btn btn-primary">Test Algorithms</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 