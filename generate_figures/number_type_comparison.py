import numpy as np
import matplotlib.pyplot as plt

# Set up figure with clean style
plt.style.use("seaborn-v0_8-whitegrid")
fig, ax = plt.subplots(figsize=(10, 6))

# Define categories and data
categories = [
    "Rational",
    "Quadratic\nIrrational",
    "Cubic Irrational\n(Real Roots)",
    "Cubic Irrational\n(Complex Roots)",
]

# Example period lengths (these are illustrative)
period_lengths = [0, 0, 5, 7]

# Define colors
colors = ["#dddddd", "#dddddd", "#1f77b4", "#ff7f0e"]

# Create bar chart
bars = ax.bar(categories, period_lengths, color=colors, width=0.6)

# Add value labels on top of bars
for bar in bars:
    height = bar.get_height()
    if height > 0:
        ax.text(
            bar.get_x() + bar.get_width() / 2.0,
            height + 0.1,
            f"{height}",
            ha="center",
            va="bottom",
            fontsize=12,
        )
    else:
        ax.text(
            bar.get_x() + bar.get_width() / 2.0,
            0.3,
            "No period",
            ha="center",
            va="bottom",
            fontsize=10,
            rotation=0,
            color="#555555",
        )

# Add labels and title
ax.set_xlabel("Number Type", fontsize=12)
ax.set_ylabel("Period Length", fontsize=12)
ax.set_title("Comparison of Periodicity in Different Number Types", fontsize=14)

# Add grid for y-axis only
ax.grid(axis="y", linestyle="--", alpha=0.7)

# Adjust y-axis limits
ax.set_ylim([0, 10])

# Add explanatory text
ax.text(
    0.02,
    0.95,
    "The HAPD algorithm produces periodic sequences only for cubic irrationals.\n"
    "Rational numbers terminate, while quadratic irrationals do not exhibit\n"
    "periodicity in this algorithm.",
    transform=ax.transAxes,
    fontsize=10,
    verticalalignment="top",
    bbox=dict(boxstyle="round", facecolor="white", alpha=0.7),
)

# Tight layout
plt.tight_layout()

# Save the figure
plt.savefig("number_type_comparison.pdf", dpi=300, bbox_inches="tight")
plt.savefig("number_type_comparison.png", dpi=300, bbox_inches="tight")
plt.close()

print("Generated number_type_comparison visualization.")
