import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch

# Set up figure with clean style
plt.style.use("seaborn-v0_8-whitegrid")
fig, ax = plt.subplots(figsize=(8, 6))

# Define a single example trajectory
# These are simplified points that form a trajectory with periodicity
points = [
    (0.5, 0.5),  # v0
    (1.5, 1.0),  # v1
    (1.8, 1.8),  # v2
    (1.0, 2.3),  # v3
    (0.2, 2.0),  # v4
    (-0.5, 1.2),  # v5
    (-0.3, 0.3),  # v6
    (0.48, 0.53),  # v7 (≈ v0, showing periodicity)
]

# Extract x and y coordinates
x_coords, y_coords = zip(*points)

# Plot trajectory
ax.plot(x_coords, y_coords, "-", color="#1f77b4", linewidth=2, alpha=0.7)

# Plot points
for i, (x, y) in enumerate(points):
    ax.scatter(x, y, color="#1f77b4", s=80, zorder=10)
    ax.text(x + 0.1, y + 0.1, f"$v_{i}$", fontsize=12)

# Highlight the periodicity detection
tolerance_radius = 0.1
ax.add_patch(
    Circle(
        points[0],
        tolerance_radius,
        fill=False,
        linestyle="--",
        color="#ff7f0e",
        alpha=0.8,
        label="Equivalence region",
    )
)

# Add an arrow connecting the last point to the first
arrow = FancyArrowPatch(
    points[-1],
    points[0],
    arrowstyle="->",
    color="#ff7f0e",
    linewidth=2,
    mutation_scale=15,
)
ax.add_patch(arrow)

# Add text annotation about equivalence
ax.text(
    (points[-1][0] + points[0][0]) / 2,
    (points[-1][1] + points[0][1]) / 2 + 0.2,
    "Projective equivalence detected",
    color="#ff7f0e",
    fontsize=10,
    ha="center",
    va="center",
    bbox=dict(facecolor="white", alpha=0.7, boxstyle="round"),
)

# Set labels and title
ax.set_xlabel("Projective Space Coordinate 1")
ax.set_ylabel("Projective Space Coordinate 2")
ax.set_title("Periodicity Detection in HAPD Algorithm")

# Add explanatory text
ax.text(
    0.02,
    0.02,
    "The HAPD algorithm detects periodicity when a point returns to\n"
    "the projective equivalence region of a previous point.\n"
    "Point $v_7$ is projectively equivalent to $v_0$, establishing a period of 7.",
    transform=ax.transAxes,
    fontsize=9,
    verticalalignment="bottom",
    bbox=dict(boxstyle="round", facecolor="white", alpha=0.7),
)

# Set axis limits
ax.set_xlim([-1, 2.5])
ax.set_ylim([-0.5, 3])

# Add a legend
ax.legend(loc="upper right")

# Save the figure
plt.tight_layout()
plt.savefig("periodicity_detection.pdf", dpi=300, bbox_inches="tight")
plt.savefig("periodicity_detection.png", dpi=300, bbox_inches="tight")
plt.close()

print("Generated periodicity_detection visualization.")
