import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, Rectangle

# Set up figure with clean style
plt.figure(figsize=(8, 10))
ax = plt.gca()
ax.set_xlim(0, 10)
ax.set_ylim(0, 12)
ax.axis("off")

# Define styles for nodes
process_style = dict(
    boxstyle="round,pad=0.6", facecolor="#1f77b4", edgecolor="#0c4063", alpha=0.9
)

decision_style = dict(
    boxstyle="round4,pad=0.6", facecolor="#ff7f0e", edgecolor="#b35900", alpha=0.9
)

# Create nodes with clear positioning
nodes = [
    {"type": "process", "position": (5, 10), "text": "Input: Cubic Irrational α"},
    {"type": "process", "position": (5, 8.5), "text": "Initialize Triple (α, α², 1)"},
    {
        "type": "process",
        "position": (5, 7),
        "text": "Compute Integer Parts\na₁ = ⌊v₁/v₃⌋, a₂ = ⌊v₂/v₃⌋",
    },
    {
        "type": "process",
        "position": (5, 5.5),
        "text": "Calculate Remainders\nr₁ = v₁ - a₁v₃, r₂ = v₂ - a₂v₃",
    },
    {
        "type": "process",
        "position": (5, 4),
        "text": "Update Triple\n(r₁, r₂, v₃ - a₁r₁ - a₂r₂)",
    },
    {"type": "process", "position": (5, 2.5), "text": "Record Pair (a₁, a₂)"},
    {"type": "decision", "position": (5, 1), "text": "Previously\nseen triple?"},
]

output_node = {
    "type": "process",
    "position": (2.5, 1),
    "text": "Output:\nPeriod Detected",
}

# Add nodes to plot
for node in nodes:
    style = process_style if node["type"] == "process" else decision_style
    ax.text(
        node["position"][0],
        node["position"][1],
        node["text"],
        ha="center",
        va="center",
        color="white",
        bbox=style,
        fontsize=11,
    )

# Add output node
ax.text(
    output_node["position"][0],
    output_node["position"][1],
    output_node["text"],
    ha="center",
    va="center",
    color="white",
    bbox=process_style,
    fontsize=11,
)

# Define arrow paths
arrows = [
    ((5, 9.5), (5, 9)),  # Input to Initialize
    ((5, 8), (5, 7.5)),  # Initialize to Compute
    ((5, 6.5), (5, 6)),  # Compute to Calculate
    ((5, 5), (5, 4.5)),  # Calculate to Update
    ((5, 3.5), (5, 3)),  # Update to Record
    ((5, 2), (5, 1.5)),  # Record to Decision
    ((4.5, 1), (3, 1)),  # Decision to Output (Yes)
    ((5.5, 1), (8, 1), (8, 7), (5.5, 7)),  # Decision to Compute (No)
]

# Add arrow labels
arrow_labels = [((3.8, 1.2), "Yes"), ((6.5, 0.8), "No")]

# Draw arrows
for arrow in arrows:
    if len(arrow) == 2:  # Simple straight arrow
        ax.add_patch(
            FancyArrowPatch(
                arrow[0],
                arrow[1],
                arrowstyle="->",
                color="#333333",
                linewidth=1.5,
                mutation_scale=15,
                connectionstyle="arc3,rad=0",
            )
        )
    else:  # Loop back arrow (for the No path)
        # Draw line segments
        ax.plot(
            [arrow[0][0], arrow[1][0]], [arrow[0][1], arrow[1][1]], "k-", linewidth=1.5
        )
        ax.plot(
            [arrow[1][0], arrow[2][0]], [arrow[1][1], arrow[2][1]], "k-", linewidth=1.5
        )
        ax.plot(
            [arrow[2][0], arrow[3][0]], [arrow[2][1], arrow[3][1]], "k-", linewidth=1.5
        )

        # Add arrow head to the last segment
        ax.add_patch(
            FancyArrowPatch(
                (arrow[2][0], arrow[2][1]),
                (arrow[3][0], arrow[3][1]),
                arrowstyle="->",
                color="#333333",
                linewidth=1.5,
                mutation_scale=15,
                connectionstyle="arc3,rad=0",
            )
        )

# Add labels to arrows
for label_pos, label_text in arrow_labels:
    ax.text(
        label_pos[0],
        label_pos[1],
        label_text,
        ha="center",
        va="center",
        fontsize=10,
        fontweight="bold",
    )

# Add title
ax.text(
    5,
    11.2,
    "HAPD Algorithm Flowchart",
    ha="center",
    va="center",
    fontsize=16,
    weight="bold",
)

# Add explanation box at the bottom
explanation = (
    "The HAPD algorithm detects periodicity in cubic irrationals by tracking triples in projective space.\n"
    "When a triple is projectively equivalent to a previous triple, a period has been found."
)
ax.text(
    5,
    0.5,
    explanation,
    ha="center",
    va="center",
    fontsize=9,
    bbox=dict(boxstyle="round", facecolor="#f8f8f8", alpha=0.9, pad=0.5),
)

# Save the figure
plt.tight_layout()
plt.savefig("hapd_algorithm_flowchart.pdf", dpi=300, bbox_inches="tight")
plt.savefig("hapd_algorithm_flowchart.png", dpi=300, bbox_inches="tight")
plt.close()

print("Generated improved HAPD algorithm flowchart visualization.")
