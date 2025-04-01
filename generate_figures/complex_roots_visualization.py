import numpy as np
import matplotlib.pyplot as plt

# Set up figure with clean style
plt.style.use("seaborn-v0_8-whitegrid")
fig, ax = plt.subplots(figsize=(8, 6))

# Set up complex plane
ax.axhline(y=0, color="gray", linestyle="-", alpha=0.3)
ax.axvline(x=0, color="gray", linestyle="-", alpha=0.3)
ax.set_xlabel("Real Axis")
ax.set_ylabel("Imaginary Axis")
ax.set_title("Complex Conjugate Roots for Cubic Irrationals")


# Define a function for roots of a cubic polynomial
def cubic_roots(a, b, c):
    """Return the three roots of x^3 + ax^2 + bx + c"""
    p = (3 * b - a**2) / 3
    q = (2 * a**3 - 9 * a * b + 27 * c) / 27

    # Discriminant
    delta = (q / 2) ** 2 + (p / 3) ** 3

    if delta >= 0:
        # One real root and two complex conjugate roots
        u = np.cbrt(-q / 2 + np.sqrt(delta))
        v = np.cbrt(-q / 2 - np.sqrt(delta))

        root1 = u + v - a / 3
        root2 = -(u + v) / 2 - a / 3 + 1j * np.sqrt(3) / 2 * (u - v)
        root3 = -(u + v) / 2 - a / 3 - 1j * np.sqrt(3) / 2 * (u - v)

        return root1, root2, root3
    else:
        # Three real roots - not the focus of this visualization
        return None, None, None


# Example cubic irrationals with complex conjugate roots
examples = [
    {"name": r"$x^3 - 2x - 5$", "coefficients": (0, -2, -5), "color": "#1f77b4"},
    {"name": r"$x^3 - 3x^2 + 3x - 1$", "coefficients": (-3, 3, -1), "color": "#ff7f0e"},
    {"name": r"$x^3 + x + 1$", "coefficients": (0, 1, 1), "color": "#2ca02c"},
]

# Plot the roots for each example
for example in examples:
    a, b, c = example["coefficients"]
    root1, root2, root3 = cubic_roots(a, b, c)

    if root1 is not None:
        # Plot real root
        ax.scatter(
            np.real(root1),
            np.imag(root1),
            color=example["color"],
            s=100,
            label=f"{example['name']}: Real root",
        )

        # Plot complex conjugate roots
        ax.scatter(
            np.real(root2),
            np.imag(root2),
            color=example["color"],
            s=60,
            marker="x",
            alpha=0.8,
        )
        ax.scatter(
            np.real(root3),
            np.imag(root3),
            color=example["color"],
            s=60,
            marker="x",
            alpha=0.8,
        )

        # Connect the complex conjugate roots with a line
        ax.plot(
            [np.real(root2), np.real(root3)],
            [np.imag(root2), np.imag(root3)],
            "--",
            color=example["color"],
            alpha=0.6,
        )

        # Label the complex conjugate pair
        midpoint_x = (np.real(root2) + np.real(root3)) / 2
        midpoint_y = (np.imag(root2) + np.imag(root3)) / 2
        ax.text(
            midpoint_x,
            midpoint_y + 0.2,
            f"Complex\nconjugate pair",
            color=example["color"],
            ha="center",
            fontsize=8,
        )

# Add explanation text
ax.text(
    0.02,
    0.02,
    "Cubic irrationals with complex conjugate roots require special handling.\n"
    "The HAPD algorithm uses projective space to detect periodicity\n"
    "regardless of whether roots are real or complex.",
    transform=ax.transAxes,
    fontsize=9,
    verticalalignment="bottom",
    bbox=dict(boxstyle="round", facecolor="white", alpha=0.7),
)

# Adjust axis limits for better visualization
ax.set_xlim(-2, 2)
ax.set_ylim(-1.5, 1.5)

# Add legend
ax.legend(loc="upper right", fontsize=9)

# Equal aspect ratio
ax.set_aspect("equal")

# Save the figure
plt.tight_layout()
plt.savefig(
    "complex_roots_visualization.pdf", dpi=300, bbox_inches="tight"
)
plt.savefig(
    "complex_roots_visualization.png", dpi=300, bbox_inches="tight"
)
plt.close()

print("Generated complex roots visualization.")
