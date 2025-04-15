import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Import test implementations
import { 
  runHAPDAlgorithm, 
  runMatrixApproach, 
  runSinSquaredAlgorithm 
} from '../components/TestImplementations';

const Testing = () => {
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'output', content: 'Interactive Test Environment for Hermite\'s Problem' },
    { type: 'output', content: 'Type "help" to see available commands' },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [testParameters, setTestParameters] = useState({
    a: 0, // coefficients for the cubic polynomial
    b: -2,
    c: -1,
    maxIterations: 20,
    tolerance: 0.00001,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of terminal when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Focus on input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    
    if (!currentCommand.trim()) return;
    
    // Add command to terminal output
    setTerminalOutput(prev => [
      ...prev,
      { type: 'command', content: currentCommand }
    ]);
    
    // Process command
    processCommand(currentCommand);
    
    // Clear current command
    setCurrentCommand('');
  };

  const processCommand = (command) => {
    const cmd = command.trim().toLowerCase();
    const args = cmd.split(' ');
    
    switch(args[0]) {
      case 'help':
        displayHelp();
        break;
      case 'run':
        if (args.length > 1) {
          runTest(args[1]);
        } else {
          addOutput('Please specify a test to run: "run hapd", "run matrix", "run sinsquared", or "run all"', 'error');
        }
        break;
      case 'set':
        if (args.length === 3) {
          setParameter(args[1], args[2]);
        } else {
          addOutput('Usage: set <parameter> <value>', 'error');
        }
        break;
      case 'show':
        if (args.length > 1) {
          showParameter(args[1]);
        } else {
          showAllParameters();
        }
        break;
      case 'clear':
        setTerminalOutput([
          { type: 'output', content: 'Terminal cleared' }
        ]);
        break;
      case 'reset':
        resetParameters();
        break;
      default:
        addOutput(`Unknown command: "${command}". Type "help" for available commands.`, 'error');
    }
  };

  const displayHelp = () => {
    addOutput([
      'Available commands:',
      '  help                      - Display this help message',
      '  run <test>                - Run a specific test (hapd, matrix, sinsquared, all)',
      '  set <parameter> <value>   - Set a test parameter value',
      '  show [parameter]          - Show all parameters or a specific one',
      '  clear                     - Clear the terminal',
      '  reset                     - Reset parameters to default values',
      '',
      'Available parameters:',
      '  a                         - Coefficient a of cubic polynomial x³ + ax² + bx + c',
      '  b                         - Coefficient b of cubic polynomial x³ + ax² + bx + c',
      '  c                         - Coefficient c of cubic polynomial x³ + ax² + bx + c',
      '  maxIterations             - Maximum number of iterations to run',
      '  tolerance                 - Convergence tolerance'
    ]);
  };

  const addOutput = (content, type = 'output') => {
    if (Array.isArray(content)) {
      setTerminalOutput(prev => [
        ...prev,
        ...content.map(line => ({ type, content: line }))
      ]);
    } else {
      setTerminalOutput(prev => [
        ...prev,
        { type, content }
      ]);
    }
  };

  const setParameter = (param, value) => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      addOutput(`Invalid value: "${value}" is not a number`, 'error');
      return;
    }
    
    if (Object.keys(testParameters).includes(param)) {
      setTestParameters(prev => ({
        ...prev,
        [param]: numValue
      }));
      addOutput(`Parameter ${param} set to ${numValue}`, 'success');
    } else {
      addOutput(`Unknown parameter: ${param}`, 'error');
    }
  };

  const showParameter = (param) => {
    if (Object.keys(testParameters).includes(param)) {
      addOutput(`${param} = ${testParameters[param]}`);
    } else {
      addOutput(`Unknown parameter: ${param}`, 'error');
    }
  };

  const showAllParameters = () => {
    const params = Object.entries(testParameters).map(([key, value]) => `${key} = ${value}`);
    addOutput(['Current parameters:', ...params]);
  };

  const resetParameters = () => {
    setTestParameters({
      a: 0,
      b: -2,
      c: -1,
      maxIterations: 20,
      tolerance: 0.00001,
    });
    addOutput('Parameters reset to default values', 'success');
    setTestResults(null);
  };

  const runTest = async (testName) => {
    setIsRunning(true);
    
    try {
      addOutput(`Running ${testName === 'all' ? 'all tests' : testName + ' test'}...`);
      
      const results = {};
      const { a, b, c, maxIterations, tolerance } = testParameters;
      
      // Run selected tests
      if (testName === 'hapd' || testName === 'all') {
        addOutput('Executing HAPD algorithm...');
        const hapdResult = await runHAPDAlgorithm(a, b, c, maxIterations, tolerance);
        results.hapd = hapdResult;
        addOutput([
          'HAPD Algorithm Results:',
          `  Periodic: ${hapdResult.isPeriodic ? 'Yes' : 'No'}`,
          `  Period: ${hapdResult.period}`,
          `  Iterations: ${hapdResult.iterations}`,
          `  Execution time: ${hapdResult.executionTime}ms`
        ]);
      }
      
      if (testName === 'matrix' || testName === 'all') {
        addOutput('Executing Matrix approach...');
        const matrixResult = await runMatrixApproach(a, b, c, maxIterations, tolerance);
        results.matrix = matrixResult;
        addOutput([
          'Matrix Approach Results:',
          `  Periodic: ${matrixResult.isPeriodic ? 'Yes' : 'No'}`,
          `  Period: ${matrixResult.period}`,
          `  Iterations: ${matrixResult.iterations}`,
          `  Execution time: ${matrixResult.executionTime}ms`
        ]);
      }
      
      if (testName === 'sinsquared' || testName === 'all') {
        addOutput('Executing Modified sin²-Algorithm...');
        const sinSquaredResult = await runSinSquaredAlgorithm(a, b, c, maxIterations, tolerance);
        results.sinSquared = sinSquaredResult;
        addOutput([
          'Modified sin²-Algorithm Results:',
          `  Periodic: ${sinSquaredResult.isPeriodic ? 'Yes' : 'No'}`,
          `  Period: ${sinSquaredResult.period}`,
          `  Iterations: ${sinSquaredResult.iterations}`,
          `  Execution time: ${sinSquaredResult.executionTime}ms`
        ]);
      }
      
      if (testName !== 'hapd' && testName !== 'matrix' && testName !== 'sinsquared' && testName !== 'all') {
        addOutput(`Unknown test: ${testName}`, 'error');
      } else {
        addOutput('Tests completed successfully', 'success');
        setTestResults(results);
      }
    } catch (error) {
      addOutput(`Error running tests: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  // Data for results chart
  const chartData = testResults ? {
    labels: ['HAPD Algorithm', 'Matrix Approach', 'Modified sin²-Algorithm'],
    datasets: [
      {
        label: 'Execution Time (ms)',
        data: [
          testResults.hapd?.executionTime || 0,
          testResults.matrix?.executionTime || 0,
          testResults.sinSquared?.executionTime || 0
        ],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
      },
      {
        label: 'Iterations',
        data: [
          testResults.hapd?.iterations || 0,
          testResults.matrix?.iterations || 0,
          testResults.sinSquared?.iterations || 0
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
      }
    ],
  } : null;

  return (
    <div>
      <h2>Interactive Test Environment</h2>
      <p>Run algorithm tests directly in your browser. Use the terminal below to execute commands and see results.</p>
      
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Test Terminal</h5>
              <div>
                <button 
                  className="btn btn-sm btn-primary me-2" 
                  onClick={() => !isRunning && runTest('all')}
                  disabled={isRunning}
                >
                  <FontAwesomeIcon icon={faPlay} /> Run All Tests
                </button>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => setTerminalOutput([])}
                >
                  <FontAwesomeIcon icon={faTrash} /> Clear
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="terminal" ref={terminalRef}>
                {terminalOutput.map((line, index) => (
                  <div key={index} className={`terminal-${line.type}`}>
                    {line.type === 'command' ? '> ' + line.content : line.content}
                  </div>
                ))}
                <form onSubmit={handleCommandSubmit}>
                  <div className="terminal-input">
                    <span className="terminal-prefix">{'>'}</span>
                    <input
                      type="text"
                      className="terminal-command"
                      value={currentCommand}
                      onChange={(e) => setCurrentCommand(e.target.value)}
                      ref={inputRef}
                      disabled={isRunning}
                      autoComplete="off"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Test Parameters</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="param-a" className="form-label">Coefficient a:</label>
                <input
                  type="number"
                  className="form-control"
                  id="param-a"
                  value={testParameters.a}
                  onChange={(e) => setTestParameters(prev => ({...prev, a: parseFloat(e.target.value)}))}
                  disabled={isRunning}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="param-b" className="form-label">Coefficient b:</label>
                <input
                  type="number"
                  className="form-control"
                  id="param-b"
                  value={testParameters.b}
                  onChange={(e) => setTestParameters(prev => ({...prev, b: parseFloat(e.target.value)}))}
                  disabled={isRunning}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="param-c" className="form-label">Coefficient c:</label>
                <input
                  type="number"
                  className="form-control"
                  id="param-c"
                  value={testParameters.c}
                  onChange={(e) => setTestParameters(prev => ({...prev, c: parseFloat(e.target.value)}))}
                  disabled={isRunning}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="param-maxIterations" className="form-label">Max Iterations:</label>
                <input
                  type="number"
                  className="form-control"
                  id="param-maxIterations"
                  value={testParameters.maxIterations}
                  onChange={(e) => setTestParameters(prev => ({...prev, maxIterations: parseInt(e.target.value)}))}
                  disabled={isRunning}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="param-tolerance" className="form-label">Tolerance:</label>
                <input
                  type="number"
                  className="form-control"
                  id="param-tolerance"
                  value={testParameters.tolerance}
                  step="0.00001"
                  onChange={(e) => setTestParameters(prev => ({...prev, tolerance: parseFloat(e.target.value)}))}
                  disabled={isRunning}
                />
              </div>
              <div className="d-flex">
                <button
                  className="btn btn-primary me-2"
                  onClick={() => !isRunning && runTest('all')}
                  disabled={isRunning}
                >
                  <FontAwesomeIcon icon={faPlay} /> Run Tests
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={resetParameters}
                  disabled={isRunning}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {testResults && (
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="mb-0">Test Results</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Algorithm</th>
                      <th>Periodic</th>
                      <th>Period</th>
                      <th>Iterations</th>
                      <th>Time (ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.hapd && (
                      <tr>
                        <td>HAPD</td>
                        <td>{testResults.hapd.isPeriodic ? 'Yes' : 'No'}</td>
                        <td>{testResults.hapd.period}</td>
                        <td>{testResults.hapd.iterations}</td>
                        <td>{testResults.hapd.executionTime}</td>
                      </tr>
                    )}
                    {testResults.matrix && (
                      <tr>
                        <td>Matrix</td>
                        <td>{testResults.matrix.isPeriodic ? 'Yes' : 'No'}</td>
                        <td>{testResults.matrix.period}</td>
                        <td>{testResults.matrix.iterations}</td>
                        <td>{testResults.matrix.executionTime}</td>
                      </tr>
                    )}
                    {testResults.sinSquared && (
                      <tr>
                        <td>sin²</td>
                        <td>{testResults.sinSquared.isPeriodic ? 'Yes' : 'No'}</td>
                        <td>{testResults.sinSquared.period}</td>
                        <td>{testResults.sinSquared.iterations}</td>
                        <td>{testResults.sinSquared.executionTime}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                {chartData && (
                  <div className="results-chart">
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          title: {
                            display: true,
                            text: 'Algorithm Performance Comparison'
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testing; 