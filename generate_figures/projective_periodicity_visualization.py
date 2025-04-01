import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch

# Set up figure with clean style
plt.style.use("seaborn-v0_8-whitegrid")
fig, ax = plt.subplots(figsize=(8, 6))

# Turn off the normal axes
ax.axis("off")

# Create a simplified projective plane representation
# Define points in the projective space
points = [
    (0.3, 0.2, 0.7),  # v0
    (0.5, 0.7, 0.3),  # v1
    (0.8, 0.4, 0.2),  # v2
    (0.2, 0.9, 0.4),  # v3
    (0.3, 0.21, 0.69),  # v4 (≈ v0 showing periodicity)
]

# Normalize points to make visualization clearer
normalized_points = []
for p in points:
    norm = np.sqrt(p[0] ** 2 + p[1] ** 2 + p[2] ** 2)
    normalized_points.append((p[0] / norm, p[1] / norm, p[2] / norm))

# We'll project onto the x-y plane for visualization
projected_points = [(p[0], p[1]) for p in normalized_points]

# Draw the projective points
for i, p in enumerate(projected_points):
    ax.scatter(p[0], p[1], s=100, color="#1f77b4", zorder=10)
    ax.text(p[0] + 0.03, p[1] + 0.03, f"$v_{i}$", fontsize=12)

# Connect the points with arrows to show the transformation sequence
for i in range(len(projected_points) - 1):
    arrow = FancyArrowPatch(
        projected_points[i],
        projected_points[i + 1],
        arrowstyle="->",
        color="#1f77b4",
        linewidth=1.5,
        mutation_scale=15,
    )
    ax.add_patch(arrow)

# Highlight the equivalence between first and last points
# Add a circle around the first point to show the equivalence region
equivalence_radius = 0.05
ax.add_patch(
    Circle(
        projected_points[0],
        equivalence_radius,
        fill=False,
        linestyle="--",
        color="#ff7f0e",
        alpha=0.8,
    )
)

# Add a special arrow connecting the last point back to the first
return_arrow = FancyArrowPatch(
    projected_points[-1],
    projected_points[0],
    arrowstyle="->",
    color="#ff7f0e",
    linewidth=2,
    mutation_scale=15,
    connectionstyle="arc3,rad=0.3",
)
ax.add_patch(return_arrow)

# Add label for the return connection
midpoint = (
    (projected_points[-1][0] + projected_points[0][0]) / 2,
    (projected_points[-1][1] + projected_points[0][1]) / 2,
)
ax.text(
    midpoint[0] + 0.05,
    midpoint[1] + 0.05,
    "Projective\nequivalence",
    color="#ff7f0e",
    fontsize=10,
    ha="center",
    va="center",
)

# Add title
ax.text(
    0.5,
    0.95,
    "Projective Periodicity Detection",
    fontsize=14,
    weight="bold",
    ha="center",
    va="top",
    transform=ax.transAxes,
)

# Add explanation
ax.text(
    0.5,
    0.05,
    "The HAPD algorithm tracks a sequence of points in projective space.\n"
    "Periodicity is detected when a point returns to the projective equivalence\n"
    "region of a previous point, establishing a cycle in the transformation sequence.",
    fontsize=10,
    ha="center",
    va="bottom",
    transform=ax.transAxes,
    bbox=dict(boxstyle="round", facecolor="white", alpha=0.7),
)

# Set axis limits with some padding
padding = 0.2
all_x = [p[0] for p in projected_points]
all_y = [p[1] for p in projected_points]
x_min, x_max = min(all_x) - padding, max(all_x) + padding
y_min, y_max = min(all_y) - padding, max(all_y) + padding
ax.set_xlim(x_min, x_max)
ax.set_ylim(y_min, y_max)

# Equal aspect ratio for better visualization
ax.set_aspect("equal")

# Save the figure
plt.tight_layout()
plt.savefig(
    "projective_periodicity_visualization.pdf",
    dpi=300,
    bbox_inches="tight",
)
plt.savefig(
    "projective_periodicity_visualization.png",
    dpi=300,
    bbox_inches="tight",
)
plt.close()

print("Generated projective periodicity visualization.")
