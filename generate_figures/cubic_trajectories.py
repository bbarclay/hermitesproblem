import numpy as np
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D

# Set up figure with clean, professional style
plt.style.use("seaborn-v0_8-whitegrid")
fig, ax = plt.subplots(figsize=(8, 6))

# Define colors for different trajectories
colors = ["#1f77b4", "#ff7f0e", "#2ca02c"]

# Define starting points and transformations for different cubic irrationals
# These are simplified approximations for demonstration purposes
cubics = [
    {"name": r"$\sqrt[3]{2}$", "color": colors[0], "period": 7},
    {"name": r"$\sqrt[3]{3}$", "color": colors[1], "period": 5},
    {"name": r"$1+\sqrt[3]{2}$", "color": colors[2], "period": 4},
]

# Generate trajectories - these are simplified placeholder patterns
for i, cubic in enumerate(cubics):
    # Create a simplified circular/spiral trajectory
    # In reality, these would be calculated using the HAPD algorithm
    t = np.linspace(0, 2 * np.pi, 100)
    period = cubic["period"]

    # Generate points that form a loop with the given period
    # We'll highlight specific points along the trajectory
    points_x = []
    points_y = []

    # Creating a spiral-like trajectory that eventually repeats
    for j in range(period + 3):  # Add a few extra points for visualization
        angle = 2 * np.pi * j / period
        radius = 1.0 + 0.05 * j  # Slight spiral to separate points visually
        if j >= period:
            # Close the loop by returning to earlier points (showing periodicity)
            angle = 2 * np.pi * (j - period) / period
            radius = 1.0 + 0.05 * (j - period)

        x = radius * np.cos(angle) + 0.2 * i  # Offset each trajectory slightly
        y = radius * np.sin(angle) + 0.2 * i
        points_x.append(x)
        points_y.append(y)

    # Plot the trajectory
    ax.plot(points_x, points_y, "-", color=cubic["color"], alpha=0.7, linewidth=2)

    # Plot the points with labels
    for j in range(len(points_x)):
        if j <= period:  # Only label the main points
            ax.scatter(points_x[j], points_y[j], color=cubic["color"], s=50, zorder=10)
            ax.text(
                points_x[j] + 0.05,
                points_y[j] + 0.05,
                f"$v_{j}$",
                fontsize=10,
                color=cubic["color"],
            )

    # Highlight the periodicity with a dashed line connecting equivalent points
    if len(points_x) > period:
        ax.plot(
            [points_x[0], points_x[period]],
            [points_y[0], points_y[period]],
            "--",
            color=cubic["color"],
            linewidth=1.5,
            alpha=0.6,
        )

# Create legend
legend_elements = [
    Line2D([0], [0], color=cubic["color"], lw=2, label=cubic["name"])
    for cubic in cubics
]
ax.legend(handles=legend_elements, loc="upper right", frameon=True)

# Set labels and title
ax.set_xlabel("Projective Space Coordinate 1")
ax.set_ylabel("Projective Space Coordinate 2")
ax.set_title("Projective Trajectories for Cubic Irrationals")

# Adjust axis limits for cleaner appearance
ax.set_xlim([-1.5, 2.5])
ax.set_ylim([-1.5, 2.5])

# Remove tick numbers for cleaner appearance
ax.set_xticks([])
ax.set_yticks([])

# Equal aspect ratio for better visualization
ax.set_aspect("equal")

# Add a simple annotation explaining the visualization
ax.text(
    0.02,
    0.02,
    "Simplified visualization of projective trajectories for cubic irrationals.\n"
    "Points v₀, v₁, ... represent algorithm iterations, with periodicity\n"
    "occurring when a point returns to a previous position in projective space.",
    transform=ax.transAxes,
    fontsize=9,
    verticalalignment="bottom",
    bbox=dict(boxstyle="round", facecolor="white", alpha=0.7),
)

# Save the figure
plt.tight_layout()
plt.savefig("cubic_trajectories.pdf", dpi=300, bbox_inches="tight")
plt.savefig("cubic_trajectories.png", dpi=300, bbox_inches="tight")
plt.close()

print("Generated cubic_trajectories visualization.")
