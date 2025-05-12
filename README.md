# 🧮 Solving Hermite's Problem 🧮
### An Interactive Mathematical Journey

<img src="https://via.placeholder.com/1400x400?text=Hermite's+Problem+Interactive+Visualization" alt="Hermite's Problem Visualization" width="100%"/>

<p align="center">
  <b>Revolutionizing our understanding of cubic irrationals through interactive visualization</b>
</p>

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![GitHub stars](https://img.shields.io/github/stars/bbarclay/hermitesproblem.svg?style=flat&label=Stars)](https://GitHub.com/bbarclay/hermitesproblem/stargazers/)
[![Visits](https://badges.pufler.dev/visits/bbarclay/hermitesproblem)](https://badges.pufler.dev)
[![Created](https://badges.pufler.dev/created/bbarclay/hermitesproblem)](https://badges.pufler.dev)
[![Made with MathJax](https://img.shields.io/badge/Made%20with-MathJax-1f425f.svg)](https://www.mathjax.org)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fbbarclay.github.io%2Fhermitesproblem&up_message=online&up_color=green&down_color=red&down_message=offline&style=flat&logo=github)](https://bbarclay.github.io/hermitesproblem)
[![Demo](https://img.shields.io/badge/interactive-demo-orange.svg)](https://bbarclay.github.io/hermitesproblem)
[![arXiv](https://img.shields.io/badge/arXiv-xxxx.xxxxx-b31b1b.svg)](https://arxiv.org)

## 💡 Illuminating Mathematics Through Interaction 💡

> **"Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding."** — William Paul Thurston

---

<details open>
<summary><b>📚 Table of Contents</b></summary>

- [🔍 Overview](#-overview)
- [✨ Interactive Features](#-interactive-features)
- [🧠 The Mathematics](#-the-mathematics)
- [🗂️ Repository Structure](#️-repository-structure)
- [🚀 How to Use](#-how-to-use)
- [📋 Requirements](#-requirements)
- [📝 Citation](#-citation)
- [⚖️ License](#️-license)
- [👏 Acknowledgments](#-acknowledgments)
- [🤝 Contribute](#-contribute)

</details>

---

## 🔍 Overview

This project is not just an academic paper—it's an **immersive mathematical experience** that transforms complex theoretical concepts into interactive visual explorations. 

<table>
<tr>
<td width="60%">

We present three groundbreaking methods for solving **Hermite's Problem** related to the characterization of **cubic irrationals**:

1. **🌟 HAPD Algorithm**: A projective space approach for detecting periodicity in cubic irrationals that provides geometric insights previously unattainable.
   
2. **📊 Matrix Approach**: Utilizing companion matrices and trace sequences to reveal patterns in the continued fraction expansion of cubic irrationals.
   
3. **📐 Modified sin²-Algorithm**: An adaptation for cubic irrationals with complex conjugate roots, extending the theoretical framework to the complex domain.
   
4. **🧮 Subtractive Algorithm**: A numerically stable variation of the HAPD algorithm that maintains precision even with large coefficients.

Each method builds upon centuries of mathematical inquiry while introducing novel perspectives that redefine our understanding of cubic irrationals.

</td>
<td width="40%">
<img src="https://via.placeholder.com/600x400?text=Algorithm+Comparison" alt="Algorithm Comparison" width="100%"/>
<p align="center"><i>Comparative analysis of our novel approaches</i></p>
</td>
</tr>
</table>

---

## ✨ Interactive Features

<p align="center"><b>See mathematics in action with our suite of interactive tools</b></p>

<table>
<tr>
<td width="33%" align="center">
<img src="https://via.placeholder.com/300x200?text=Cubic+Explorer" alt="Cubic Polynomial Explorer" width="100%"/>
<br>
<b>Cubic Polynomial Explorer</b>
<br>
Visualize polynomial behavior and roots
</td>
<td width="33%" align="center">
<img src="https://via.placeholder.com/300x200?text=Projective+Space" alt="Projective Space Visualization" width="100%"/>
<br>
<b>Projective Space Visualization</b>
<br>
Explore HAPD algorithm in action
</td>
<td width="33%" align="center">
<img src="https://via.placeholder.com/300x200?text=Matrix+Traces" alt="Matrix Trace Calculator" width="100%"/>
<br>
<b>Matrix Trace Calculator</b>
<br>
Calculate and visualize trace patterns
</td>
</tr>
<tr>
<td width="33%" align="center">
<img src="https://via.placeholder.com/300x200?text=Sin²+Demo" alt="Sin² Algorithm Demo" width="100%"/>
<br>
<b>Sin² Algorithm Demo</b>
<br>
Visualize complex root periodicity
</td>
<td width="33%" align="center">
<img src="https://via.placeholder.com/300x200?text=Subtractive+Algorithm" alt="Subtractive Algorithm Demo" width="100%"/>
<br>
<b>Subtractive Algorithm Demo</b>
<br>
Explore numerical stability
</td>
<td width="33%" align="center">
<img src="https://via.placeholder.com/300x200?text=Math+Helper" alt="Mathematical Notation Helper" width="100%"/>
<br>
<b>Mathematical Notation Helper</b>
<br>
Interactive glossary of concepts
</td>
</tr>
</table>

> **Try It Now:** [Launch Interactive Paper](https://bbarclay.github.io/hermitesproblem)

---

## 🧠 The Mathematics

<details>
<summary><b>Click to expand mathematical details</b></summary>

### The Fundamentals of Hermite's Problem

Hermite's Problem asks about the periodicity of continued fraction expansions for cubic irrationals. Given a cubic irrational $\alpha$ that satisfies:

$$ax^3 + bx^2 + cx + d = 0$$

The continued fraction expansion can be represented as:

$$\alpha = a_0 + \cfrac{1}{a_1 + \cfrac{1}{a_2 + \cfrac{1}{\ddots}}}$$

Our work provides a complete characterization of when this expansion becomes periodic, using three complementary approaches:

### HAPD Algorithm: Projective Geometric Approach

We map the problem to projective space $\mathbb{P}^2$ where:

$$\begin{pmatrix} x_n \\ y_n \\ z_n \end{pmatrix} = M^n \begin{pmatrix} x_0 \\ y_0 \\ z_0 \end{pmatrix}$$

Periodicity is detected through invariant subspaces of the transformation matrix $M$.

### Matrix Trace Sequence Detection

For companion matrix $A$ of the cubic polynomial, we analyze the sequence:

$$\text{Tr}(A^n) = \alpha^n + \beta^n + \gamma^n$$

Periodicity emerges in patterns of this trace sequence.

### Modified sin²-Algorithm

For complex conjugate roots, we utilize the identity:

$$\sin^2(\theta) = \frac{1 - \cos(2\theta)}{2}$$

to detect periodicity through angular relationships.

</details>

---

## 🗂️ Repository Structure

```
hermitesproblem
├── githubpages/            # Web version with interactive elements
│   ├── index.html          # Entry point for the interactive paper
│   ├── paper-viewer.html   # Enhanced paper viewing experience
│   ├── css/                # Styling for the interactive elements
│   └── js/                 # JavaScript for the interactive tools
├── arxiv_submission/       # LaTeX source code for arXiv submission
│   ├── main.tex            # Main LaTeX document
│   └── figures/            # Static figures for the paper
└── figures/                # Shared visualization resources
    ├── algorithms/         # Algorithm visualization resources
    └── interactive/        # Resources for interactive elements
```

---

## 🚀 How to Use

<table>
<tr>
<td width="50%">

### 🌐 Online Experience (Recommended)

Experience the full interactive paper with a single click:

1. Visit [https://bbarclay.github.io/hermitesproblem](https://bbarclay.github.io/hermitesproblem)
2. Navigate through sections using the sidebar menu
3. Interact with visualizations to deepen understanding
4. Explore algorithm demos with custom parameters
5. Toggle between paper view and interactive mode

</td>
<td width="50%">

### 💻 Local Installation

For offline access or development:

```bash
# Clone the repository
git clone https://github.com/bbarclay/hermitesproblem.git

# Navigate to the project directory
cd hermitesproblem

# Open in browser
cd githubpages
open index.html # or paper-viewer.html

# Optional: Run a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

</td>
</tr>
</table>

---

## 📋 Requirements

<table>
<tr>
<td width="33%" align="center">
<img src="https://img.shields.io/badge/browser-modern-blue.svg" alt="Modern Browser" width="80%"/>
<br>
<b>Modern Browser</b>
<br>
Chrome, Firefox, Safari, Edge
</td>
<td width="33%" align="center">
<img src="https://img.shields.io/badge/JavaScript-enabled-yellow.svg" alt="JavaScript" width="80%"/>
<br>
<b>JavaScript</b>
<br>
Enabled in browser settings
</td>
<td width="33%" align="center">
<img src="https://img.shields.io/badge/WebGL-supported-green.svg" alt="WebGL" width="80%"/>
<br>
<b>WebGL</b>
<br>
For 3D visualizations (optional)
</td>
</tr>
</table>

---

## 📝 Citation

If you find this work useful for your research on **Hermite's Problem** or **cubic irrationals**, please cite:

```bibtex
@article{hermite_problem2025,
  author    = {Brandon Barclay},
  title     = {Solving Hermite's Problem: Three Novel Approaches for Complete Characterization 
               of Cubic Irrationals},
  year      = {2025},
  journal   = {arXiv preprint},
  url       = {https://arxiv.org/abs/xxxx.xxxxx},
  keywords  = {Hermite's Problem, cubic irrationals, continued fractions, 
               number theory, interactive mathematics}
}
```

---

## ⚖️ License

<table>
<tr>
<td width="30%" align="center">
<img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by.svg" alt="CC BY 4.0" width="60%"/>
</td>
<td width="70%">

This work is licensed under the [Creative Commons Attribution 4.0 International License (CC-BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material for any purpose

Under the following terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

</td>
</tr>
</table>

---

## 👏 Acknowledgments

<p align="center">
We stand on the shoulders of giants:
</p>

<table>
<tr>
<td width="33%" align="center">
<img src="https://via.placeholder.com/100x100?text=CH" alt="Charles Hermite" width="60%" style="border-radius: 50%;"/>
<br>
<b>Charles Hermite</b>
<br>
Original problem formulation
</td>
<td width="33%" align="center">
<img src="https://via.placeholder.com/100x100?text=Math" alt="Mathematical Community" width="60%" style="border-radius: 50%;"/>
<br>
<b>Mathematical Community</b>
<br>
Prior work on continued fractions
</td>
<td width="33%" align="center">
<img src="https://via.placeholder.com/100x100?text=Tech" alt="Technology" width="60%" style="border-radius: 50%;"/>
<br>
<b>Open Source Community</b>
<br>
Libraries that power our visualizations
</td>
</tr>
</table>

<p align="center">
<b>Libraries used:</b> MathJax, JSXGraph, Desmos, Bootstrap, Prism.js
</p>

---

## �� Contribute

<table>
<tr>
<td width="70%">

### Join the Mathematical Revolution

We welcome contributions to enhance this interactive academic paper. If you're passionate about mathematics, visualization, or education:

- ⭐ **Star this repository** to show your support
- 🍴 **Fork the repo** and submit pull requests with improvements
- 🐛 **Report issues** or suggest new features
- 🔍 **Review the code** and help improve quality
- 📚 **Extend the documentation** with additional examples
- 🎨 **Create new visualizations** for complex concepts

</td>
<td width="30%" align="center">
<img src="https://via.placeholder.com/200x200?text=Join+Us" alt="Contribute" width="100%"/>
<br>
<a href="https://github.com/bbarclay/hermitesproblem/issues/new"><img src="https://img.shields.io/badge/Contribute-Now-brightgreen.svg" alt="Contribute Now" width="80%"/></a>
</td>
</tr>
</table>

<div align="center">
<p>Contact us for collaboration or feedback: <a href="mailto:contact@example.com">contact@example.com</a></p>

<h3>Let's make mathematics more accessible and engaging together!</h3>

<p>
<a href="https://twitter.com/intent/tweet?text=Check%20out%20this%20interactive%20paper%20on%20Hermite's%20Problem%20for%20cubic%20irrationals!%20https://bbarclay.github.io/hermitesproblem">
<img src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fbbarclay.github.io%2Fhermitesproblem"/>
</a>
</p>

<img src="https://via.placeholder.com/800x100?text=Explore+The+Beauty+Of+Mathematics" alt="Footer Banner" width="100%"/>
</div> 