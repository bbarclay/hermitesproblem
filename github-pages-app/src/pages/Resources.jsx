import React from 'react';
import { Link } from 'react-router-dom';

const Resources = () => {
  return (
    <div>
      <h2 className="mb-4">Resources</h2>
      
      <div className="card mb-4">
        <div className="card-header">
          <h4>Code Repository</h4>
        </div>
        <div className="card-body">
          <p>The implementations of the algorithms described in this paper are available in our GitHub repository:</p>
          <a href="https://github.com/yourusername/hermites-problem" className="btn btn-primary" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h4>Interactive Visualizations</h4>
        </div>
        <div className="card-body">
          <p>Interactive visualizations of the projective space approach and other algorithms are available in the Interactive section.</p>
          <Link to="/interactive" className="btn btn-primary">Go to Interactive Elements</Link>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h4>Bibliography</h4>
        </div>
        <div className="card-body">
          <p>Key references from the paper:</p>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Hermite, C. (1848). "Letter to C.G.J. Jacobi." Journal für die reine und angewandte Mathematik, 40, 286.</li>
            <li className="list-group-item">Karpenkov, O. (2019). "A periodic continued fraction for the golden ratio." arXiv:1905.05086.</li>
            <li className="list-group-item">Karpenkov, O. (2022). "Algorithmic Periodicity Detection for Quadratic Irrationals." Moscow Mathematical Journal, 22(2), 339-355.</li>
            <li className="list-group-item">Horn, R. A., & Johnson, C. R. (2012). "Matrix Analysis." Cambridge University Press.</li>
            <li className="list-group-item">Cox, D. A. (2012). "Galois Theory." John Wiley & Sons.</li>
          </ul>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h4>Download Materials</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Full Paper (PDF)</h5>
                  <p className="card-text">Download the complete research paper in PDF format.</p>
                  <a href="#" className="btn btn-primary">Download PDF</a>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Presentation Slides</h5>
                  <p className="card-text">Download slides summarizing the research findings.</p>
                  <a href="#" className="btn btn-primary">Download Slides</a>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Algorithm Implementations</h5>
                  <p className="card-text">Download code implementations in Python.</p>
                  <a href="#" className="btn btn-primary">Download Code</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources; 