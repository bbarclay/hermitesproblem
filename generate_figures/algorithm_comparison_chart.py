import matplotlib.pyplot as plt
import numpy as np
import matplotlib.patches as mpatches

# Create figure with clean style
plt.figure(figsize=(10, 8.5))
ax = plt.gca()
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis("off")

# Algorithms to compare
algorithms = [
    "Traditional CF",
    "Jacobi-Perron",
    "Karpenkov's sin²",
    "HAPD (Our Work)",
    "Modified sin² (Our Work)",
]
n_algorithms = len(algorithms)

# Properties to evaluate
properties = [
    "Handles Cubic Irrationals with Complex Roots",
    "Guaranteed Periodicity Detection",
    "Computational Efficiency",
    "Theoretical Elegance",
    "Matrix Interpretation",
    "Implementation Complexity (inverse)",
    "Short Period Length",
]
n_properties = len(properties)

# Scores for each algorithm (0-10 scale)
scores = np.array(
    [
        [10, 0, 10, 5, 0, 9, 10],  # Traditional CF
        [5, 5, 7, 7, 7, 6, 5],  # Jacobi-Perron
        [2, 2, 6, 8, 6, 5, 4],  # Karpenkov's sin²
        [10, 10, 9, 9, 10, 7, 8],  # HAPD
        [10, 10, 7, 8, 7, 5, 5],  # Modified sin²
    ]
)

# Color map for algorithms
colors = ["#d62728", "#ff7f0e", "#2ca02c", "#1f77b4", "#9467bd"]

# Define positions
prop_positions = np.linspace(1, 9, n_properties)
alg_positions = np.linspace(1, 9, n_algorithms)


# Create the radar chart background
def draw_radar_background():
    # Draw background circles
    for radius in [2, 4, 6, 8, 10]:
        circle = plt.Circle(
            (5, 5), radius / 2, fill=False, color="gray", linestyle="--", alpha=0.5
        )
        ax.add_patch(circle)

    # Draw lines from center to properties
    for i, prop in enumerate(prop_positions):
        angle = i * 2 * np.pi / n_properties
        x = 5 + 5 * np.cos(angle)
        y = 5 + 5 * np.sin(angle)
        ax.plot([5, x], [5, y], color="gray", linestyle="-", alpha=0.5)

        # Add property label
        label_x = 5 + 5.5 * np.cos(angle)
        label_y = 5 + 5.5 * np.sin(angle)
        ha = "left" if label_x > 5 else "right"
        va = "bottom" if label_y > 5 else "top"
        if abs(label_x - 5) < 0.5:
            ha = "center"
        if abs(label_y - 5) < 0.5:
            va = "center"

        ax.text(
            label_x,
            label_y,
            properties[i],
            ha=ha,
            va=va,
            fontsize=10,
            fontweight="bold",
            wrap=True,
            bbox=dict(facecolor="white", alpha=0.8, boxstyle="round,pad=0.3"),
        )


# Draw radar chart for each algorithm
def draw_algorithm_radar(alg_idx):
    alg_scores = scores[alg_idx]
    points = []

    for i, score in enumerate(alg_scores):
        angle = i * 2 * np.pi / n_properties
        radius = score / 2
        x = 5 + radius * np.cos(angle)
        y = 5 + radius * np.sin(angle)
        points.append((x, y))

    # Connect points
    for i in range(len(points)):
        next_i = (i + 1) % len(points)
        ax.plot(
            [points[i][0], points[next_i][0]],
            [points[i][1], points[next_i][1]],
            color=colors[alg_idx],
            linewidth=2,
            alpha=0.8,
        )

    # Fill polygon
    polygon = plt.Polygon(
        points, closed=True, fill=True, color=colors[alg_idx], alpha=0.3
    )
    ax.add_patch(polygon)


# Draw background
draw_radar_background()

# Draw all algorithm radars
for i in range(n_algorithms):
    draw_algorithm_radar(i)

# Add title
plt.title("Algorithm Comparison Chart", fontsize=16, pad=40)

# Add legend
patches = [
    mpatches.Patch(color=colors[i], label=algorithms[i]) for i in range(n_algorithms)
]
ax.legend(
    handles=patches,
    loc="upper center",
    bbox_to_anchor=(0.5, 0.12),
    ncol=3,
    fontsize=10,
    frameon=True,
    facecolor="white",
    edgecolor="gray",
)

# Save the figure
plt.tight_layout(rect=[0, 0.05, 1, 0.95])
plt.savefig("algorithm_comparison_chart.pdf", dpi=300, bbox_inches="tight")
plt.savefig("algorithm_comparison_chart.png", dpi=300, bbox_inches="tight")
plt.close()

print("Generated algorithm comparison chart.")
