import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, Rectangle, Arc, Circle

# Set up figure with clean style
plt.style.use("seaborn-v0_8-whitegrid")
fig, ax = plt.subplots(figsize=(8, 6))

# Turn off axis
ax.axis("off")

# Define positions and dimensions
center_x = 0.5
center_y = 0.5
width = 0.8
height = 0.8

# Draw the complex plane (unit circle)
theta = np.linspace(0, 2 * np.pi, 100)
x = center_x + width / 2 * np.cos(theta)
y = center_y + height / 2 * np.sin(theta)
ax.plot(x, y, "k-", alpha=0.5)

# Add axes
ax.plot(
    [center_x - width / 2, center_x + width / 2], [center_y, center_y], "k-", alpha=0.5
)
ax.plot(
    [center_x, center_x],
    [center_y - height / 2, center_y + height / 2],
    "k-",
    alpha=0.5,
)

# Label the axes
ax.text(
    center_x + width / 2 + 0.02, center_y, "Re", ha="left", va="center", fontsize=12
)
ax.text(
    center_x, center_y + height / 2 + 0.02, "Im", ha="center", va="bottom", fontsize=12
)

# Example point on unit circle (complex cubic root)
angle1 = np.pi / 6  # 30 degrees
x1 = center_x + width / 2 * np.cos(angle1)
y1 = center_y + height / 2 * np.sin(angle1)

# Conjugate point
angle2 = -np.pi / 6  # -30 degrees
x2 = center_x + width / 2 * np.cos(angle2)
y2 = center_y + height / 2 * np.sin(angle2)

# Plot the points
ax.scatter(x1, y1, color="#1f77b4", s=100, zorder=10)
ax.scatter(x2, y2, color="#1f77b4", s=100, zorder=10)

# Connect to origin with lines showing the complex numbers
ax.plot([center_x, x1], [center_y, y1], "--", color="#1f77b4", alpha=0.7)
ax.plot([center_x, x2], [center_y, y2], "--", color="#1f77b4", alpha=0.7)

# Label the points
ax.text(x1 + 0.05, y1 + 0.03, r"$\alpha$", fontsize=14, color="#1f77b4")
ax.text(x2 + 0.05, y2 - 0.03, r"$\bar{\alpha}$", fontsize=14, color="#1f77b4")

# Visualize the sin² operation
# Draw angles and labels
ax.plot([center_x, center_x + 0.1], [center_y, center_y], "k-", linewidth=1)
arc1 = Arc(
    (center_x, center_y), 0.2, 0.2, theta1=0, theta2=np.degrees(angle1), color="black"
)
ax.add_patch(arc1)
ax.text(center_x + 0.12, center_y + 0.05, r"$\theta$", fontsize=12)

# Sin² visualization
sin_squared = np.sin(angle1) ** 2
ax.text(0.1, 0.1, r"$\sin^2(\theta) = %.3f$" % sin_squared, fontsize=12)

# Phase-preserving floor function
phase_angle = np.pi / 4  # Example angle for visualization
phase_x = center_x + width / 2 * 0.8 * np.cos(phase_angle)
phase_y = center_y + height / 2 * 0.8 * np.sin(phase_angle)

# Draw arc showing phase preservation
ax.scatter(phase_x, phase_y, color="#ff7f0e", s=80, zorder=10)
# Use LaTeX for the floor function notation to ensure proper rendering
ax.text(
    phase_x + 0.05,
    phase_y + 0.03,
    r"$\lfloor z \rfloor_p$",  # Using LaTeX instead of Unicode
    fontsize=12,
    color="#ff7f0e",
)

# Add a curved arrow to show the phase-preserving operation
phase_arrow = FancyArrowPatch(
    (center_x, center_y),
    (phase_x, phase_y),
    arrowstyle="->",
    connectionstyle="arc3,rad=0.2",
    color="#ff7f0e",
    alpha=0.7,
    linewidth=1.5,
)
ax.add_patch(phase_arrow)
ax.text(
    center_x + 0.2,
    center_y + 0.15,
    "Preserves phase",
    fontsize=10,
    color="#ff7f0e",
)

# Add explanation
ax.text(
    0.05,
    0.9,
    "Modified sin² Algorithm for Complex Cubic Roots",
    fontsize=14,
    weight="bold",
    ha="left",
    va="top",
)

ax.text(
    0.05,
    0.82,
    "The modified sin² algorithm extends Karpenkov's approach to cubic"
    + "\n"
    + "irrationals with complex conjugate roots by using:"
    + "\n"
    + "1. Phase-preserving floor function in complex plane"
    + "\n"
    + "2. Cubic field correction to maintain algebraic relationships"
    + "\n"
    + "3. Sin² operation to map complex angles to real values",
    fontsize=10,
    ha="left",
    va="top",
    bbox=dict(boxstyle="round", facecolor="white", alpha=0.7),
)

# Save the figure
plt.tight_layout()
plt.savefig("sin2_algorithm_visualization.pdf", dpi=300, bbox_inches="tight")
plt.savefig("sin2_algorithm_visualization.png", dpi=300, bbox_inches="tight")
plt.close()

print("Generated improved sin² algorithm visualization.")
