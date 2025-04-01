import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Rectangle, FancyArrowPatch, FancyBboxPatch

# Create figure with clean style
plt.figure(figsize=(10, 8))
ax = plt.gca()
ax.set_xlim(0, 10)
ax.set_ylim(0, 8)
ax.axis("off")

# Define box style
box_style = {
    "boxstyle": "round,pad=0.6",
    "facecolor": "#e8f4f8",
    "edgecolor": "#1f77b4",
    "linewidth": 2,
    "alpha": 0.9,
}


# Create the main components
def add_box(x, y, width, height, title, details=None):
    box = FancyBboxPatch((x - width / 2, y - height / 2), width, height, **box_style)
    ax.add_patch(box)
    ax.text(
        x,
        y + height / 4,
        title,
        fontsize=14,
        ha="center",
        va="center",
        fontweight="bold",
    )

    if details:
        ax.text(
            x,
            y - height / 5,
            details,
            fontsize=11,
            ha="center",
            va="center",
            wrap=True,
            linespacing=1.5,
        )


# Add the main Hermite's Problem box
ax.text(
    5,
    7.5,
    "Hermite's Problem for Cubic Irrationals",
    fontsize=16,
    ha="center",
    va="center",
    fontweight="bold",
)

# Add the two main approaches
add_box(
    3,
    5.5,
    3.5,
    1.5,
    "Projective Approach (HAPD)",
    "• Non-subtractive algorithm\n• Projective space transformations\n• Clean geometric interpretation",
)

add_box(
    7,
    5.5,
    3.5,
    1.5,
    "Subtractive Approach (Modified sin²)",
    "• Enhanced subtractive algorithm\n• Phase-preserving floor function\n• Complex plane representation",
)

# Add the connection box
add_box(
    5,
    4,
    3.5,
    1.0,
    "Complete Solution to Hermite's Problem",
    "Both approaches detect periodicity for all cubic irrationals",
)

# Add the specific strengths boxes
add_box(
    3,
    2.5,
    3.5,
    2.0,
    "HAPD Algorithm Strengths",
    "• Shorter periods\n• More efficient computation\n• Pure projective interpretation\n• Direct matrix formulation",
)

add_box(
    7,
    2.5,
    3.5,
    2.0,
    "Modified sin² Strengths",
    "• Natural complex plane treatment\n• Explicit phase preservation\n• Extension of Karpenkov's approach\n• Compatible with existing theory",
)

# Add arrows connecting components
arrow_style = dict(
    arrowstyle="->,head_width=0.6,head_length=0.8", color="#1f77b4", linewidth=2
)

# HAPD to Complete Solution arrow
arrow1 = FancyArrowPatch(
    (3, 4.8), (4.5, 4.3), connectionstyle="arc3,rad=-0.1", **arrow_style
)
ax.add_patch(arrow1)

# Modified sin² to Complete Solution arrow
arrow2 = FancyArrowPatch(
    (7, 4.8), (5.5, 4.3), connectionstyle="arc3,rad=0.1", **arrow_style
)
ax.add_patch(arrow2)

# Complete Solution to HAPD Strengths
arrow3 = FancyArrowPatch(
    (4.5, 3.6), (3.5, 3.5), connectionstyle="arc3,rad=-0.1", **arrow_style
)
ax.add_patch(arrow3)

# Complete Solution to Modified sin² Strengths
arrow4 = FancyArrowPatch(
    (5.5, 3.6), (6.5, 3.5), connectionstyle="arc3,rad=0.1", **arrow_style
)
ax.add_patch(arrow4)

# Add explanatory text at the bottom
ax.text(
    5,
    0.5,
    "The complementary approaches to Hermite's problem provide full coverage for all cubic irrationals,\n"
    + "including those with complex conjugate roots, offering both theoretical and computational advantages.",
    fontsize=12,
    ha="center",
    va="center",
    style="italic",
)

# Save the figure
plt.tight_layout()
plt.savefig("complementary_solutions_diagram.pdf", dpi=300, bbox_inches="tight")
plt.savefig("complementary_solutions_diagram.png", dpi=300, bbox_inches="tight")
plt.close()

print("Generated complementary solutions diagram.")
