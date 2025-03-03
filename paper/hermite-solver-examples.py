"""
Examples demonstrating the use of the Hermite Solver library.

This file contains example scripts that demonstrate:
1. Basic usage of the Hermite Solver
2. Detailed examples of each component
3. Practical applications for detecting and analyzing cubic irrationals
"""

import math
import numpy as np
import matplotlib.pyplot as plt
from mpmath import mp

# Import the Hermite Solver library
from hermite_solver import (
    Utils, HAPD, MatrixApproach, ComputationalMethods, HermiteSolver
)

# Set precision
mp.dps = 100

#============================================================================
# Example 1: Basic Usage
#============================================================================

def example_basic_usage():
    """Demonstrate basic usage of the Hermite Solver."""
    print("\n" + "=" * 50)
    print("EXAMPLE 1: BASIC USAGE")
    print("=" * 50)
    
    # Create a solver instance
    solver = HermiteSolver()
    
    # Test numbers to analyze
    test_numbers = [
        (2**(1/3), "Cube root of 2 (cubic irrational)"),
        (3**(1/3), "Cube root of 3 (cubic irrational)"),
        (1 + 2**(1/3), "1 + cube root of 2 (cubic irrational)"),
        (2**(1/2), "Square root of 2 (quadratic irrational)"),
        ((1 + 5**(1/2))/2, "Golden ratio (quadratic irrational)"),
        (math.pi, "Pi (transcendental)"),
        (3/2, "3/2 (rational)")
    ]
    
    for number, description in test_numbers:
        print(f"\nAnalyzing: {description}")
        
        # Detect if the number is a cubic irrational
        result = solver.detect_cubic_irrational(number)
        
        print(f"Classification: {result['classification']}")
        print(f"Confidence: {result['confidence']}")
        print(f"Method: {result.get('method', 'N/A')}")
        
        # Show continued fraction
        cf = Utils.continued_fraction(number, max_terms=10)
        print(f"Continued fraction (first 10 terms): {cf}")

#============================================================================
# Example 2: HAPD Algorithm
#============================================================================

def example_hapd_algorithm():
    """Demonstrate the HAPD algorithm."""
    print("\n" + "=" * 50)
    print("EXAMPLE 2: HAPD ALGORITHM")
    print("=" * 50)
    
    # Create a HAPD instance
    hapd = HAPD(max_iterations=100, tolerance=1e-20)
    
    # Test on a cubic irrational: cube root of 2
    alpha = 2**(1/3)
    print(f"\nRunning HAPD on cube root of 2 = {float(alpha):.10f}")
    
    result = hapd.run(alpha)
    
    print(f"Status: {result['status']}")
    print(f"Classification: {result['classification']}")
    
    if result['status'] == 'periodic':
        print(f"Preperiod length: {result['preperiod']}")
        print(f"Period length: {result['period']}")
        
        # Display the pattern of pairs
        pairs = result['pairs']
        preperiod = result['preperiod']
        period = result['period']
        
        print("\nPairs sequence:")
        for i, pair in enumerate(pairs):
            if i == preperiod:
                print("[ Periodic part starts ]")
            print(f"  {i}: {pair}")
            if i >= preperiod + period - 1 and i < len(pairs) - 1:
                print("  ...")
                break
    
    # Test on a quadratic irrational: square root of 2
    alpha = 2**(1/2)
    print(f"\nRunning HAPD on square root of 2 = {float(alpha):.10f}")
    
    result = hapd.run(alpha)
    
    print(f"Status: {result['status']}")
    print(f"Classification: {result['classification']}")
    
    if result['status'] == 'periodic':
        print(f"Preperiod length: {result['preperiod']}")
        print(f"Period length: {result['period']}")
    else:
        print("As expected, no periodicity detected within iterations")
    
    # Test on a rational number: 3/2
    alpha = 3/2
    print(f"\nRunning HAPD on 3/2 = {float(alpha):.10f}")
    
    result = hapd.run(alpha)
    
    print(f"Status: {result['status']}")
    print(f"Classification: {result['classification']}")
    print(f"Terminated after {result['iterations']} iterations")

#============================================================================
# Example 3: Matrix-Based Verification
#============================================================================

def example_matrix_verification():
    """Demonstrate the matrix-based verification approach."""
    print("\n" + "=" * 50)
    print("EXAMPLE 3: MATRIX-BASED VERIFICATION")
    print("=" * 50)
    
    # Create a MatrixApproach instance
    matrix = MatrixApproach(tolerance=1e-10)
    
    # Test on cube root of 2
    alpha = 2**(1/3)
    print(f"\nVerifying cube root of 2 = {float(alpha):.10f}")
    
    result = matrix.verify_cubic_irrational(alpha)
    
    print(f"Classification: {result['classification']}")
    
    if result['classification'] == 'cubic_irrational':
        print(f"Minimal polynomial: {result['polynomial']}")
        
        # Show trace verification details
        print("\nTrace verification:")
        for vr in result['verification_results']:
            print(f"  k={vr['k']}: expected={vr['expected']:.6f}, actual={vr['actual']:.6f}, error={vr['error']:.6e}")
    
    # Test on a non-cubic number: square root of 2
    alpha = 2**(1/2)
    print(f"\nVerifying square root of 2 = {float(alpha):.10f}")
    
    result = matrix.verify_cubic_irrational(alpha)
    
    print(f"Classification: {result['classification']}")
    if 'reason' in result:
        print(f"Reason: {result['reason']}")

#============================================================================
# Example 4: Computational Methods
#============================================================================

def example_computational_methods():
    """Demonstrate the advanced computational methods."""
    print("\n" + "=" * 50)
    print("EXAMPLE 4: COMPUTATIONAL METHODS")
    print("=" * 50)
    
    # Create a ComputationalMethods instance
    comp = ComputationalMethods()
    
    # Test numbers
    test_numbers = [
        (2**(1/3), "Cube root of 2 (cubic irrational)"),
        (2**(1/2), "Square root of 2 (quadratic irrational)"),
        (math.pi, "Pi (transcendental)")
    ]
    
    for number, description in test_numbers:
        print(f"\nAnalyzing: {description}")
        
        # Calculate entropy metrics
        metrics = comp.entropy_metrics(number, max_terms=50)
        
        print("Entropy analysis:")
        print(f"  Final entropy: {metrics[-1]['entropy']:.6f}")
        
        # Perform spectral analysis
        cf = Utils.continued_fraction(number, max_terms=40)
        spectrum = comp.spectral_analysis(cf)
        
        if 'error' not in spectrum:
            print("\nSpectral analysis:")
            print(f"  Spectral energy: {spectrum['spectral_energy']:.6f}")
            print("  Top 3 dominant frequencies:")
            for i, freq in enumerate(spectrum['dominant_frequencies'][:3]):
                print(f"    {i+1}. Frequency {freq['frequency']}: magnitude {freq['magnitude']:.6f}")
        
        # Run combined discriminator
        result = comp.combined_discriminator(number)
        
        print("\nCombined discriminator:")
        print(f"  Classification: {result['classification']}")
        print(f"  Confidence: {result['confidence']}")
        print(f"  Votes: {result['votes']} out of 4")
        
        # Show method results
        print("  Individual method results:")
        for method_result in result['methods_results']:
            print(f"    {method_result['method']}: {method_result['result']}")

#============================================================================
# Example 5: Comprehensive Analysis
#============================================================================

def example_comprehensive_analysis():
    """Demonstrate comprehensive analysis of a number."""
    print("\n" + "=" * 50)
    print("EXAMPLE 5: COMPREHENSIVE ANALYSIS")
    print("=" * 50)
    
    # Create a HermiteSolver instance
    solver = HermiteSolver()
    
    # Analyze cube root of 2
    alpha = 2**(1/3)
    print(f"\nComprehensive analysis of cube root of 2 = {float(alpha):.10f}")
    
    # Perform analysis
    result = solver.analyze_number(alpha)
    
    print(f"Classification: {result['classification']}")
    print(f"Confidence: {result['confidence']}")
    
    if 'polynomial' in result:
        poly_str = " + ".join([f"{c}x^{len(result['polynomial'])-i-1}" for i, c in enumerate(result['polynomial']) if c != 0])
        print(f"Minimal polynomial: {poly_str}")
    
    print(f"\nContinued fraction (first 10 terms): {result['continued_fraction'][:10]}")
    
    # Show additional details
    if 'hapd_details' in result:
        hapd = result['hapd_details']
        if hapd['status'] == 'periodic':
            print(f"\nHAPD details:")
            print(f"  Periodicity detected: preperiod={hapd['preperiod']}, period={hapd['period']}")
    
    if 'matrix_details' in result:
        matrix = result['matrix_details']
        if matrix['classification'] == 'cubic_irrational':
            print(f"\nMatrix verification:")
            print(f"  Verification success: {matrix['verification_success']}")
    
    # If we have entropy details, show them
    if 'entropy_details' in result:
        entropy = result['entropy_details']
        if 'entropy' in entropy:
            print(f"\nEntropy analysis:")
            print(f"  Entropy: {entropy['entropy']:.6f}")

#============================================================================
# Example 6: Visualization of Results
#============================================================================

def example_visualization():
    """Visualize the results for different number types."""
    print("\n" + "=" * 50)
    print("EXAMPLE 6: VISUALIZATION OF RESULTS")
    print("=" * 50)
    
    # Create instances
    comp = ComputationalMethods()
    
    # Test numbers
    test_numbers = [
        (2**(1/3), "Cube root of 2", "cubic"),
        (3**(1/3), "Cube root of 3", "cubic"),
        (5**(1/3), "Cube root of 5", "cubic"),
        (2**(1/2), "Square root of 2", "quadratic"),
        (3**(1/2), "Square root of 3", "quadratic"),
        ((1 + 5**(1/2))/2, "Golden ratio", "quadratic"),
        (math.pi, "Pi", "transcendental"),
        (math.e, "e", "transcendental"),
        (3/2, "3/2", "rational"),
        (22/7, "22/7", "rational")
    ]
    
    # Collect entropy data
    entropy_data = {}
    for number, name, category in test_numbers:
        metrics = comp.entropy_metrics(number, max_terms=50)
        if metrics:
            entropy_data[name] = {
                'entropy': metrics[-1]['entropy'],
                'category': category
            }
    
    # Collect spectral data
    spectral_data = {}
    for number, name, category in test_numbers:
        cf = Utils.continued_fraction(number, max_terms=40)
        spectrum = comp.spectral_analysis(cf)
        if 'error' not in spectrum:
            # Get magnitude at frequencies 1 and 6
            freq1 = next((f['magnitude'] for f in spectrum['frequencies'] if f['frequency'] == 1), 0)
            freq6 = next((f['magnitude'] for f in spectrum['frequencies'] if f['frequency'] == 6), 0)
            
            spectral_data[name] = {
                'freq1': freq1,
                'freq6': freq6,
                'category': category
            }
    
    # Create plots
    plt.figure(figsize=(14, 6))
    
    # Entropy plot
    plt.subplot(1, 2, 1)
    
    categories = {'cubic': [], 'quadratic': [], 'transcendental': [], 'rational': []}
    for name, data in entropy_data.items():
        categories[data['category']].append(data['entropy'])
    
    positions = np.arange(4)
    labels = ['Cubic', 'Quadratic', 'Transcendental', 'Rational']
    colors = ['blue', 'green', 'red', 'purple']
    
    plt.boxplot([categories['cubic'], categories['quadratic'], 
                categories['transcendental'], categories['rational']],
                positions=positions)
    plt.xticks(positions, labels)
    plt.ylabel('Entropy')
    plt.title('Entropy of Continued Fractions by Number Type')
    
    # Spectral plot
    plt.subplot(1, 2, 2)
    
    for name, data in spectral_data.items():
        if data['category'] == 'cubic':
            color = 'blue'
            marker = 'o'
        elif data['category'] == 'quadratic':
            color = 'green'
            marker = 's'
        elif data['category'] == 'transcendental':
            color = 'red'
            marker = '^'
        else:  # rational
            color = 'purple'
            marker = 'D'
            
        plt.scatter(data['freq1'], data['freq6'], color=color, marker=marker, s=100, label=name)
    
    plt.xlabel('Magnitude at Frequency 1')
    plt.ylabel('Magnitude at Frequency 6')
    plt.title('Spectral Properties of Different Number Types')
    plt.grid(True)
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    
    plt.tight_layout()
    plt.savefig('hermite_solver_results.png')
    
    print("Visualization created and saved as 'hermite_solver_results.png'")
    print("The plots show:")
    print("1. Entropy distribution by number type")
    print("2. Spectral properties (frequencies 1 and 6) for different numbers")

#============================================================================
# Main function to run all examples
#============================================================================

def run_all_examples():
    """Run all examples."""
    example_basic_usage()
    example_hapd_algorithm()
    example_matrix_verification()
    example_computational_methods()
    example_comprehensive_analysis()
    example_visualization()

if __name__ == "__main__":
    run_all_examples()
