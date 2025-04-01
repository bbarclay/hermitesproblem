import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon

# Set up figure with clean style
plt.style.use("seaborn-v0_8-whitegrid")
fig, ax = plt.subplots(figsize=(8, 6))

# Define the projective space grid
x = np.linspace(-1, 1, 20)
y = np.linspace(-1, 1, 20)
X, Y = np.meshgrid(x, y)

# Draw a simple grid for projective space
ax.grid(True, linestyle="--", alpha=0.3)

# Define a simplified fundamental domain
domain_vertices = np.array([[-0.5, -0.3], [0.5, -0.3], [0.3, 0.5], [-0.3, 0.5]])
domain = Polygon(
    domain_vertices,
    closed=True,
    facecolor="#1f77b4",
    alpha=0.3,
    edgecolor="#1f77b4",
    linewidth=2,
)
ax.add_patch(domain)

# Define a few adjacent domains to show the tiling of projective space
adjacent_offsets = [
    [1.0, 0.0],
    [0.0, 1.0],
    [-1.0, 0.0],
    [0.0, -1.0],
    [1.0, 1.0],
    [-1.0, 1.0],
    [1.0, -1.0],
    [-1.0, -1.0],
]

for offset in adjacent_offsets:
    offset_vertices = domain_vertices + offset
    adjacent_domain = Polygon(
        offset_vertices,
        closed=True,
        facecolor="#ff7f0e",
        alpha=0.1,
        edgecolor="#ff7f0e",
        linewidth=1,
    )
    ax.add_patch(adjacent_domain)

# Place a point representing a cubic irrational
ax.scatter(0, 0, color="#2ca02c", s=100, zorder=10, label="Cubic irrational")

# Add trajectory points showing how the algorithm processes the point
trajectory = [
    [0, 0],
    [0.2, 0.3],
    [0.4, 0.1],
    [-0.2, 0.4],
    [-0.4, -0.1],
    [0.1, -0.4],
    [0.3, 0.2],
]

# Connect trajectory points
for i in range(len(trajectory) - 1):
    ax.plot(
        [trajectory[i][0], trajectory[i + 1][0]],
        [trajectory[i][1], trajectory[i + 1][1]],
        "k-",
        alpha=0.5,
        linewidth=1,
    )

    ax.scatter(
        trajectory[i + 1][0], trajectory[i + 1][1], color="#2ca02c", s=60, alpha=0.7
    )

    # Label each point
    ax.text(
        trajectory[i + 1][0] + 0.05,
        trajectory[i + 1][1] + 0.05,
        f"$v_{i+1}$",
        fontsize=10,
    )

# Label the initial point
ax.text(trajectory[0][0] + 0.05, trajectory[0][1] + 0.05, "$v_0$", fontsize=10)

# Add a title and labels
ax.set_xlabel("Projective Coordinate 1")
ax.set_ylabel("Projective Coordinate 2")
ax.set_title("Fundamental Domain in Projective Space")

# Add explanation
ax.text(
    0.02,
    0.02,
    "The HAPD algorithm operates in projective space, where a cubic irrational\n"
    "generates a trajectory that eventually returns to the fundamental domain.\n"
    "Each domain represents an equivalence class in projective space.\n"
    "Periodicity is detected when a point revisits the same domain.",
    transform=ax.transAxes,
    fontsize=9,
    verticalalignment="bottom",
    bbox=dict(boxstyle="round", facecolor="white", alpha=0.7),
)

# Set axis limits
ax.set_xlim(-1.5, 1.5)
ax.set_ylim(-1.5, 1.5)

# Equal aspect ratio
ax.set_aspect("equal")

# Add legend
ax.legend(loc="upper right")

# Save the figure
plt.tight_layout()
plt.savefig(
    "projective_space_regions.pdf", dpi=300, bbox_inches="tight"
)
plt.savefig(
    "projective_space_regions.png", dpi=300, bbox_inches="tight"
)
plt.close()

print("Generated projective space regions visualization.")
