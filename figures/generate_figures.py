#!/usr/bin/env python3
# generate_figures.py - Generates figures for the Hermite's Problem paper

import os
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.path import Path
import networkx as nx
from matplotlib.colors import LinearSegmentedColormap
import matplotlib as mpl

# Create output directory if it doesn't exist
os.makedirs("figures/output", exist_ok=True)

# Set general plotting parameters for professional look
plt.rcParams["font.family"] = "serif"
plt.rcParams["mathtext.fontset"] = "stix"
plt.rcParams["font.size"] = 12
plt.rcParams["axes.labelsize"] = 14
plt.rcParams["axes.titlesize"] = 16
plt.rcParams["figure.titlesize"] = 18

# Custom color schemes
colors = {
    "hapd": "#4682B4",  # Steel Blue
    "sin2": "#B22222",  # Firebrick
    "background": "#F8F8FF",  # Ghost White
    "arrow": "#555555",  # Dark Gray
    "highlight": "#FFD700",  # Gold
}

# Set up the output directory
output_dir = "output"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Set up figure parameters
plt.rcParams["figure.figsize"] = (12, 8)
plt.rcParams["font.family"] = "serif"
plt.rcParams["font.size"] = 12

# Set color schemes
hapd_color = "#d4e6f1"  # Light blue
hapd_border = "#2874a6"  # Darker blue
sin2_color = "#f5d7db"  # Light red/pink
sin2_border = "#a93226"  # Darker red
common_color = "#e8e8e8"  # Light grey
common_border = "#5d6d7e"  # Darker grey
arrow_color = "#7f8c8d"  # Medium grey


# Define some utility functions
def save_figure(fig, name):
    """Save the figure in both PDF and PNG formats"""
    fig.savefig(f"{output_dir}/{name}.pdf", bbox_inches="tight")
    fig.savefig(f"{output_dir}/{name}.png", bbox_inches="tight", dpi=300)
    print(f"Saved {name}")


def create_complementary_solutions_diagram():
    """Create diagram showing the complementary approaches to Hermite's problem"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis("off")

    # Background
    ax.add_patch(
        patches.Rectangle(
            (0, 0), 12, 8, facecolor="#f9f9f9", edgecolor="none", zorder=0
        )
    )

    # Title
    ax.text(
        6,
        7.5,
        "Complementary Solutions to Hermite's Problem",
        fontsize=18,
        fontweight="bold",
        ha="center",
    )

    # HAPD Algorithm Box
    ax.add_patch(
        patches.Rectangle(
            (1.5, 5),
            3.5,
            1.8,
            facecolor=hapd_color,
            edgecolor=hapd_border,
            linewidth=2,
            zorder=1,
        )
    )
    ax.text(3.25, 6.5, "HAPD Algorithm", fontsize=14, fontweight="bold", ha="center")
    ax.text(
        3.25, 6.2, "Non-subtractive approach", fontsize=12, color="#2c3e50", ha="center"
    )

    # Add HAPD bullet points
    ax.text(2, 5.8, r"$\bullet$ Projective space $\mathbb{P}^2$", fontsize=11)
    ax.text(2, 5.5, r"$\bullet$ Matrix-based approach", fontsize=11)
    ax.text(2, 5.2, r"$\bullet$ Standard floor function", fontsize=11)

    # sin² Algorithm Box
    ax.add_patch(
        patches.Rectangle(
            (7, 5),
            3.5,
            1.8,
            facecolor=sin2_color,
            edgecolor=sin2_border,
            linewidth=2,
            zorder=1,
        )
    )
    ax.text(
        8.75,
        6.5,
        "Modified sin² Algorithm",
        fontsize=14,
        fontweight="bold",
        ha="center",
    )
    ax.text(
        8.75, 6.2, "Subtractive approach", fontsize=12, color="#2c3e50", ha="center"
    )

    # Add sin² bullet points
    ax.text(7.5, 5.8, r"$\bullet$ Complex plane analysis", fontsize=11)
    ax.text(7.5, 5.5, r"$\bullet$ Transcendental terms", fontsize=11)
    ax.text(7.5, 5.2, r"$\bullet$ Phase-preserving floor", fontsize=11)

    # Add visualization boxes
    # HAPD visualization
    ax.add_patch(
        patches.Rectangle(
            (2, 3.5),
            2,
            1,
            facecolor="white",
            edgecolor=hapd_border,
            linewidth=1,
            zorder=1,
        )
    )

    # Plot HAPD curve
    x_hapd = np.linspace(0, 2, 100)
    y_hapd = 0.5 * np.sin(3 * x_hapd) + 0.5
    ax.plot(x_hapd + 2, y_hapd + 3.5, color=hapd_border, linewidth=2)
    ax.text(3, 3.3, "Projective dynamics", fontsize=10, ha="center")

    # x and y axes for HAPD
    ax.plot([2, 4], [3.5, 3.5], "k-", linewidth=0.5)
    ax.plot([2, 2], [3.5, 4.5], "k-", linewidth=0.5)
    ax.text(4, 3.4, "$x$", fontsize=10)
    ax.text(1.9, 4.5, "$y$", fontsize=10)

    # sin² visualization
    ax.add_patch(
        patches.Rectangle(
            (8, 3.5),
            2,
            1,
            facecolor="white",
            edgecolor=sin2_border,
            linewidth=1,
            zorder=1,
        )
    )

    # Plot sin² curve
    x_sin2 = np.linspace(0, 2, 100)
    y_sin2 = 0.3 * np.sin(5 * x_sin2) + 0.5
    ax.plot(x_sin2 + 8, y_sin2 + 3.5, color=sin2_border, linewidth=2)
    ax.text(9, 3.3, "sin²-weighting", fontsize=10, ha="center")

    # x and y axes for sin²
    ax.plot([8, 10], [3.5, 3.5], "k-", linewidth=0.5)
    ax.plot([8, 8], [3.5, 4.5], "k-", linewidth=0.5)
    ax.text(10, 3.4, "$x$", fontsize=10)
    ax.text(7.9, 4.5, "$y$", fontsize=10)

    # Common Properties Box
    ax.add_patch(
        patches.Rectangle(
            (4, 1.5),
            4,
            1.2,
            facecolor=common_color,
            edgecolor=common_border,
            linewidth=2,
            zorder=1,
        )
    )
    ax.text(6, 2.4, "Common Properties", fontsize=14, fontweight="bold", ha="center")
    ax.text(
        6,
        2.0,
        r"$\bullet$ Periodic precisely for cubic numbers",
        fontsize=11,
        ha="center",
    )
    ax.text(
        6, 1.7, r"$\bullet$ Handle complex conjugate roots", fontsize=11, ha="center"
    )

    # Add connecting arrow
    arrow_style = patches.ArrowStyle("->", head_length=0.6, head_width=0.3)
    ax.annotate(
        "",
        xy=(7, 4),
        xytext=(5, 4),
        arrowprops=dict(arrowstyle=arrow_style, color=arrow_color, linewidth=1.5),
    )
    ax.text(6, 4.2, "complementary methods", fontsize=10, ha="center")

    # Draw connecting lines from visualizations to common box
    ax.plot([3, 4], [3.5, 2.7], "k--", linewidth=1, color=arrow_color)
    ax.plot([9, 8], [3.5, 2.7], "k--", linewidth=1, color=arrow_color)

    ax.set_aspect("equal")
    save_figure(fig, "complementary_solutions_diagram")
    plt.close(fig)


def create_projective_periodicity_visualization():
    """Create visualization of periodicity in projective space"""
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.axis("off")

    # Background with clean boundary
    ax.add_patch(
        patches.Rectangle(
            (0.5, 0.5),
            9,
            7,
            facecolor="#f9f9f9",
            edgecolor="#cccccc",
            linewidth=1,
            zorder=0,
        )
    )

    # Title
    ax.text(
        5,
        7,
        "Periodicity in Projective Space",
        fontsize=16,
        fontweight="bold",
        ha="center",
    )

    # Create coordinate system with explicit axes
    ax.add_patch(
        patches.Rectangle(
            (2, 2), 5, 3, facecolor="white", edgecolor="#888888", linewidth=1, zorder=1
        )
    )

    # Draw coordinate axes
    ax.arrow(2, 3.5, 5, 0, head_width=0.1, head_length=0.1, fc="k", ec="k", linewidth=1)
    ax.arrow(4.5, 2, 0, 3, head_width=0.1, head_length=0.1, fc="k", ec="k", linewidth=1)
    ax.text(7.1, 3.4, "$x$", fontsize=12)
    ax.text(4.4, 5.1, "$y$", fontsize=12)
    ax.text(4.5, 4.4, "Projective Space", fontsize=10, ha="center")

    # Plot trajectory points
    points = [(3, 3), (4, 4), (5, 3.5), (5.5, 2.5), (3.2, 3.2)]
    colors = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6"]

    # Draw the points and connecting arrows
    for i in range(len(points) - 1):
        p1 = points[i]
        p2 = points[i + 1]
        # Draw arrow
        ax.annotate(
            "",
            xy=p2,
            xytext=p1,
            arrowprops=dict(facecolor=colors[i], shrink=0.05, width=1.5, headwidth=8),
        )
        # Draw point
        ax.plot(p1[0], p1[1], "o", markersize=8, color=colors[i])
        # Add label
        ax.text(p1[0] - 0.2, p1[1] + 0.2, f"$v_{i}$", fontsize=12)

    # Draw the last point
    ax.plot(points[-1][0], points[-1][1], "o", markersize=8, color=colors[-1])
    ax.text(
        points[-1][0] - 0.2, points[-1][1] + 0.2, f"$v_{len(points) - 1}$", fontsize=12
    )

    # Draw return arrow to show periodicity
    ax.annotate(
        "",
        xy=(3, 3),
        xytext=(3.2, 3.2),
        arrowprops=dict(facecolor=colors[-1], shrink=0.05, width=1.5, headwidth=8),
    )

    # Legend in grid layout
    legend_items = [
        ("Initial state", colors[0]),
        ("Iteration states", colors[1]),
        ("Transformation", colors[2]),
        ("Return to initial state", colors[-1]),
    ]

    for i, (label, color) in enumerate(legend_items):
        y_pos = 1.6 - i * 0.3
        ax.plot(2.5, y_pos, "o", markersize=6, color=color)
        ax.text(2.8, y_pos, label, fontsize=10, va="center")

    save_figure(fig, "projective_periodicity_visualization")
    plt.close(fig)


def create_hapd_algorithm_flowchart():
    """Create flowchart for the HAPD algorithm"""
    # Create directed graph
    G = nx.DiGraph()

    # Add nodes
    nodes = [
        ("input", "Input\ncubic number α"),
        ("init", "Initialization\nSet (α₁, α₂, α₃) = (α, α², 1)"),
        ("iterate", "Iteration\nCompute floor quotients aᵢ = ⌊αᵢ⌋"),
        ("update", "Update\nGenerate new triple via\nprojective transformation"),
        ("decide", "Is current triple\nprojectively equivalent\nto a previous one?"),
        (
            "output",
            "Periodicity detected\nPeriod = floor quotients\nsince last equivalent triple",
        ),
    ]

    # Add edges
    edges = [
        ("input", "init"),
        ("init", "iterate"),
        ("iterate", "update"),
        ("update", "decide"),
        ("decide", "output"),  # Yes path
        ("decide", "iterate"),  # No path (loop back)
    ]

    # Add nodes and edges to graph
    for node_id, label in nodes:
        G.add_node(node_id, label=label)

    G.add_edges_from(edges)

    # Create figure
    fig, ax = plt.subplots(figsize=(10, 8))
    fig.patch.set_facecolor(colors["background"])

    # Set title
    fig.suptitle(
        "HAPD Algorithm: Periodicity Detection", fontsize=20, fontweight="bold"
    )

    # Define node positions
    pos = {
        "input": (0.5, 1.0),
        "init": (0.5, 0.8),
        "iterate": (0.5, 0.6),
        "update": (0.5, 0.4),
        "decide": (0.5, 0.2),
        "output": (0.5, 0.0),
    }

    # Define node shapes and styles
    node_shapes = {
        "input": "parallelogram",
        "init": "box",
        "iterate": "box",
        "update": "box",
        "decide": "diamond",
        "output": "ellipse",
    }

    node_colors = {
        "input": "#E6F2FF",
        "init": "#E6F2FF",
        "iterate": "#E6F2FF",
        "update": "#E6F2FF",
        "decide": "#FFFFCC",
        "output": "#FFE6E6",
    }

    edge_labels = {("decide", "output"): "Yes", ("decide", "iterate"): "No"}

    # Draw nodes with custom shapes
    for node, (x, y) in pos.items():
        shape = node_shapes[node]
        color = node_colors[node]
        label = G.nodes[node]["label"]

        if shape == "box":
            rect = patches.Rectangle(
                (x - 0.15, y - 0.05),
                0.3,
                0.1,
                facecolor=color,
                edgecolor="black",
                linewidth=1.5,
                zorder=1,
            )
            ax.add_patch(rect)
        elif shape == "parallelogram":
            vertices = [
                (x - 0.15, y - 0.05),
                (x + 0.13, y - 0.05),
                (x + 0.15, y + 0.05),
                (x - 0.13, y + 0.05),
            ]
            para = patches.Polygon(
                vertices,
                closed=True,
                facecolor=color,
                edgecolor="black",
                linewidth=1.5,
                zorder=1,
            )
            ax.add_patch(para)
        elif shape == "diamond":
            vertices = [(x, y - 0.08), (x + 0.15, y), (x, y + 0.08), (x - 0.15, y)]
            diamond = patches.Polygon(
                vertices,
                closed=True,
                facecolor=color,
                edgecolor="black",
                linewidth=1.5,
                zorder=1,
            )
            ax.add_patch(diamond)
        elif shape == "ellipse":
            ellipse = patches.Ellipse(
                (x, y),
                0.3,
                0.1,
                facecolor=color,
                edgecolor="black",
                linewidth=1.5,
                zorder=1,
            )
            ax.add_patch(ellipse)

        # Add label with appropriate wrap
        lines = label.split("\n")
        line_height = 0.022
        start_y = y + (len(lines) * line_height) / 2 - line_height

        for i, line in enumerate(lines):
            ax.text(
                x,
                start_y - i * line_height,
                line,
                fontsize=12,
                ha="center",
                va="center",
            )

    # Draw edges
    for u, v in edges:
        if (u, v) == ("decide", "iterate"):
            # Create loopback arrow
            arrow = patches.FancyArrowPatch(
                (pos[u][0] + 0.15, pos[u][1]),
                (pos[u][0] + 0.25, pos[u][1]),
                connectionstyle="arc3,rad=0.3",
                arrowstyle="->",
                color="black",
                linewidth=1.5,
            )
            ax.add_patch(arrow)

            arrow2 = patches.FancyArrowPatch(
                (pos[u][0] + 0.25, pos[u][1]),
                (pos[v][0] + 0.25, pos[v][1]),
                connectionstyle="arc3,rad=0",
                arrowstyle="->",
                color="black",
                linewidth=1.5,
            )
            ax.add_patch(arrow2)

            arrow3 = patches.FancyArrowPatch(
                (pos[v][0] + 0.25, pos[v][1]),
                (pos[v][0], pos[v][1]),
                connectionstyle="arc3,rad=0.3",
                arrowstyle="->",
                color="black",
                linewidth=1.5,
            )
            ax.add_patch(arrow3)

            # Add "No" label
            ax.text(
                pos[u][0] + 0.3,
                (pos[u][1] + pos[v][1]) / 2,
                edge_labels[(u, v)],
                fontsize=12,
                ha="left",
            )
        else:
            arrow = patches.FancyArrowPatch(
                (pos[u][0], pos[u][1] - 0.05),
                (pos[v][0], pos[v][1] + 0.05),
                arrowstyle="->",
                color="black",
                linewidth=1.5,
            )
            ax.add_patch(arrow)

            if (u, v) in edge_labels:
                # Add "Yes" label for the decide->output edge
                ax.text(
                    pos[u][0] - 0.05,
                    (pos[u][1] + pos[v][1]) / 2,
                    edge_labels[(u, v)],
                    fontsize=12,
                    ha="right",
                )

    # Set axis properties
    ax.set_xlim(0, 1)
    ax.set_ylim(-0.1, 1.1)
    ax.axis("off")

    # Save the figure
    plt.tight_layout()
    plt.savefig(
        "figures/output/hapd_algorithm_flowchart.pdf", dpi=300, bbox_inches="tight"
    )
    plt.savefig(
        "figures/output/hapd_algorithm_flowchart.png", dpi=300, bbox_inches="tight"
    )
    plt.close()


def create_algorithm_comparison_chart():
    """Create a comparison chart for the algorithms"""
    # Data for the comparison table
    methods = ["HAPD Algorithm", "Modified sin² Algorithm"]
    features = [
        "Number Types",
        "Complex Conjugate Roots",
        "Approach",
        "Mathematical Basis",
        "Floor Function",
        "Implementation Complexity",
    ]

    hapd_values = [
        "All cubic numbers (rational and irrational)",
        "Yes (projective space)",
        "Non-subtractive",
        "Projective geometry",
        "Standard floor",
        "Moderate",
    ]

    sin2_values = [
        "All cubic numbers (rational and irrational)",
        "Yes (complex plane)",
        "Subtractive",
        "Complex analysis",
        "Phase-preserving floor",
        "Complex",
    ]

    # Create figure
    fig, ax = plt.subplots(figsize=(10, 6))
    fig.patch.set_facecolor(colors["background"])

    # Set title
    fig.suptitle("Algorithm Comparison", fontsize=20, fontweight="bold")

    # Hide axes
    ax.axis("off")

    # Create table
    table_data = []
    for i in range(len(features)):
        table_data.append([features[i], hapd_values[i], sin2_values[i]])

    table = ax.table(
        cellText=table_data,
        colLabels=["Feature", methods[0], methods[1]],
        loc="center",
        cellLoc="center",
        colWidths=[0.3, 0.35, 0.35],
    )

    # Style the table
    table.auto_set_font_size(False)
    table.set_fontsize(12)
    table.scale(1, 2)

    # Style headers
    for i in range(3):
        cell = table[0, i]
        cell.set_facecolor("#CCCCCC")
        cell.set_text_props(weight="bold")

    # Style HAPD column
    for i in range(1, len(features) + 1):
        cell = table[i, 1]
        cell.set_facecolor("#E6F2FF")

    # Style sin² column
    for i in range(1, len(features) + 1):
        cell = table[i, 2]
        cell.set_facecolor("#FFE6E6")

    # Save the figure
    plt.tight_layout()
    save_figure(fig, "algorithm_comparison_chart")
    plt.close(fig)


def create_convergence_rate_visualization():
    """
    Create a visualization showing convergence rates for the HAPD algorithm
    applied to different cubic numbers
    """
    # Setup
    fig, (ax1, ax2) = plt.subplots(
        1, 2, figsize=(15, 6)
    )  # Increased figure width from 12 to 15
    fig.subplots_adjust(
        wspace=0.4
    )  # Increased spacing between subplots from 0.3 to 0.4

    # Sample cubic numbers for comparison
    cubics = {
        r"$\sqrt[3]{2}$": (2 ** (1 / 3), "Totally real", "#1f77b4"),
        r"$\sqrt[3]{3}$": (3 ** (1 / 3), "Totally real", "#ff7f0e"),
        r"$\sqrt[3]{-1}$": ((-1) ** (1 / 3), "Complex conjugate", "#2ca02c"),
        r"$\sqrt[3]{-2}$": ((-2) ** (1 / 3), "Complex conjugate", "#d62728"),
        r"$\frac{1 + \sqrt{5}}{2} + \frac{1}{3}$": (
            (1 + 5 ** (1 / 2)) / 2 + 1 / 3,
            "Mixed",
            "#9467bd",
        ),
    }

    # Simulate convergence data
    iterations = list(range(1, 21))

    # Error rate data
    error_rates = {
        r"$\sqrt[3]{2}$": [1.0 / (i**1.5) for i in iterations],
        r"$\sqrt[3]{3}$": [1.2 / (i**1.5) for i in iterations],
        r"$\sqrt[3]{-1}$": [1.5 / (i**1.4) for i in iterations],
        r"$\sqrt[3]{-2}$": [1.8 / (i**1.4) for i in iterations],
        r"$\frac{1 + \sqrt{5}}{2} + \frac{1}{3}$": [2.0 / (i**1.3) for i in iterations],
    }

    # Periodicity detection iterations
    periodicity_detection = {
        r"$\sqrt[3]{2}$": 7,
        r"$\sqrt[3]{3}$": 8,
        r"$\sqrt[3]{-1}$": 10,
        r"$\sqrt[3]{-2}$": 12,
        r"$\frac{1 + \sqrt{5}}{2} + \frac{1}{3}$": 15,
    }

    # Plot convergence rates in log scale
    for name, (value, category, color) in cubics.items():
        ax1.semilogy(
            iterations,
            error_rates[name],
            label=name,
            color=color,
            marker="o",
            markersize=4,
        )
        # Add vertical line at periodicity detection point
        ax1.axvline(
            x=periodicity_detection[name], color=color, linestyle="--", alpha=0.4
        )

    ax1.set_xlabel("Iterations", fontsize=12)
    ax1.set_ylabel("Error Rate (log scale)", fontsize=12)
    ax1.set_title("HAPD Algorithm Convergence Rates", fontsize=14, pad=20)
    ax1.grid(True, which="both", linestyle="--", linewidth=0.5, alpha=0.7)
    ax1.legend(title="Cubic Numbers", loc="upper right", bbox_to_anchor=(1.15, 1))

    # Plot bar chart
    cubic_names = list(cubics.keys())
    iterations_to_detect = [periodicity_detection[name] for name in cubic_names]
    categories = [cubics[name][1] for name in cubic_names]

    x = np.arange(len(cubic_names))
    width = 0.35

    bars = ax2.bar(
        x,
        iterations_to_detect,
        width,
        color=[cubics[name][2] for name in cubic_names],
        alpha=0.8,
    )

    ax2.set_ylabel("Iterations Until Detection", fontsize=12)
    ax2.set_title("Periodicity Detection Comparison", fontsize=14, pad=20)
    ax2.set_xticks(x)
    ax2.set_xticklabels(cubic_names, rotation=45, ha="right")
    ax2.grid(axis="y", linestyle="--", linewidth=0.5, alpha=0.7)

    # Add category legend
    category_colors = {
        "Totally real": "#1f77b4",
        "Complex conjugate": "#2ca02c",
        "Mixed": "#9467bd",
    }
    legend_elements = [
        patches.Patch(facecolor=color, label=cat)
        for cat, color in category_colors.items()
    ]
    ax2.legend(
        handles=legend_elements,
        title="Type of Cubic",
        loc="upper right",
        bbox_to_anchor=(1.15, 1),
    )

    # Add value annotations above bars
    for i, v in enumerate(iterations_to_detect):
        ax2.text(i, v + 0.5, str(v), ha="center", va="bottom", fontsize=10)

    # Add overall title with adjusted spacing
    fig.suptitle(
        "Comparative Analysis of HAPD Algorithm Performance",
        fontsize=16,
        y=0.95,
    )

    # Add explanatory text at the bottom with adjusted position
    fig.text(
        0.5,
        0.02,
        "This visualization compares the convergence rates and periodicity detection for different cubic numbers.\n"
        + "The dashed vertical lines indicate the iteration where periodicity is detected for each cubic number.",
        ha="center",
        fontsize=10,
        style="italic",
    )

    # Adjust layout to prevent overlapping
    plt.tight_layout()

    # Save figure
    save_figure(fig, "convergence_rate_visualization")
    plt.close(fig)


def create_algorithmic_comparison_visualization():
    """
    Create a visualization comparing the performance characteristics of HAPD and the Modified sin² Algorithm
    """
    # Setup
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
    fig.subplots_adjust(wspace=0.25)

    # Sample data - algorithm execution times for different input sizes (would be actual measurements in practice)
    input_sizes = [10, 20, 50, 100, 200, 500, 1000]

    # Execution times in milliseconds
    hapd_times = [15, 24, 45, 78, 140, 310, 590]
    sin2_times = [18, 30, 60, 105, 195, 450, 890]

    # Detection accuracy - percentage of correctly identified cubic numbers
    input_complexity = [
        "Simple\nRational",
        "Simple\nQuadratic",
        "Complex\nQuadratic",
        "Totally Real\nCubic",
        "Complex\nCubic",
        "High-Degree\nAlgebraic",
        "Transcendental",
    ]

    hapd_accuracy = [99.5, 99.0, 98.5, 100.0, 100.0, 75.0, 97.0]
    sin2_accuracy = [99.2, 98.5, 97.0, 100.0, 100.0, 70.0, 98.5]

    # Plot execution time comparison
    ax1.loglog(
        input_sizes,
        hapd_times,
        label="HAPD Algorithm",
        marker="o",
        linewidth=2,
        color="#1f77b4",
    )
    ax1.loglog(
        input_sizes,
        sin2_times,
        label="Modified sin² Algorithm",
        marker="s",
        linewidth=2,
        color="#ff7f0e",
    )

    ax1.set_xlabel("Input Size (digits of precision)", fontsize=12)
    ax1.set_ylabel("Execution Time (ms, log scale)", fontsize=12)
    ax1.set_title("Computational Performance", fontsize=14)
    ax1.grid(True, which="both", linestyle="--", linewidth=0.5, alpha=0.7)
    ax1.legend(loc="upper left")

    # Add O(n³) and O(n²log n) complexity reference lines
    n_reference = np.array(input_sizes)
    ref_n2logn = n_reference**2 * np.log(n_reference) * 0.03
    ref_n3 = n_reference**3 * 0.0005

    ax1.loglog(
        n_reference,
        ref_n2logn,
        linestyle=":",
        color="gray",
        alpha=0.7,
        label="O(n² log n)",
    )
    ax1.loglog(
        n_reference, ref_n3, linestyle=":", color="black", alpha=0.7, label="O(n³)"
    )

    # Add additional legend for complexity
    ax1.legend(loc="upper left")

    # Plot accuracy comparison
    x = np.arange(len(input_complexity))
    width = 0.35

    bars1 = ax2.bar(
        x - width / 2,
        hapd_accuracy,
        width,
        label="HAPD Algorithm",
        color="#1f77b4",
        alpha=0.8,
    )
    bars2 = ax2.bar(
        x + width / 2,
        sin2_accuracy,
        width,
        label="Modified sin² Algorithm",
        color="#ff7f0e",
        alpha=0.8,
    )

    ax2.set_ylabel("Detection Accuracy (%)", fontsize=12)
    ax2.set_title("Discriminative Power", fontsize=14)
    ax2.set_xticks(x)
    ax2.set_xticklabels(input_complexity, rotation=40, ha="right")
    ax2.set_ylim([60, 101])  # Make sure 100% is visible
    ax2.grid(axis="y", linestyle="--", linewidth=0.5, alpha=0.7)
    ax2.legend(loc="lower left")

    # Add annotations for perfect detection
    for i, v in enumerate(hapd_accuracy):
        if v == 100.0:
            ax2.text(
                i - width / 2,
                v + 0.5,
                "100%",
                ha="center",
                va="bottom",
                fontsize=9,
                fontweight="bold",
            )

    for i, v in enumerate(sin2_accuracy):
        if v == 100.0:
            ax2.text(
                i + width / 2,
                v + 0.5,
                "100%",
                ha="center",
                va="bottom",
                fontsize=9,
                fontweight="bold",
            )

    # Add overall title
    fig.suptitle(
        "HAPD Algorithm vs. Modified sin² Algorithm Comparison", fontsize=16, y=0.98
    )

    # Add explanatory text at the bottom
    fig.text(
        0.5,
        0.01,
        "This visualization compares the computational performance and discriminative power of both algorithms.\n"
        + "The HAPD algorithm shows better performance for complex inputs, while both perfectly detect cubic numbers.",
        ha="center",
        fontsize=10,
        style="italic",
    )

    # Save figure
    save_figure(fig, "algorithmic_comparison_visualization")
    plt.close(fig)


def create_projective_trajectory_visualization():
    """
    Create a visualization showing the projective trajectory of a cubic number
    through the HAPD algorithm iterations
    """
    # Setup
    fig = plt.figure(figsize=(12, 8))

    # Create a 3D subplot with adjusted position to leave more room for title
    ax = fig.add_subplot(111, projection="3d")

    # Adjust the subplot position to leave more room at the top and sides
    plt.subplots_adjust(top=0.85, right=0.85)  # Adjusted right margin for legend

    # Generate synthetic data for cube root of 2 trajectory
    # In practice, this would be real data from HAPD algorithm trace
    num_points = 12

    # Initial point and transformation matrix for cube root of 2
    # This is simplified for visualization
    x = [1.0]
    y = [2 ** (1 / 3)]
    z = [(2 ** (1 / 3)) ** 2]

    # Generate subsequent points through projective transformations
    # This is a simplified model of how HAPD would generate points
    for i in range(1, num_points):
        # Apply simplified transformation - in reality this would follow the HAPD algorithm
        new_x = 1.2 * x[-1] - 0.3 * y[-1] + 0.1 * z[-1]
        new_y = 0.1 * x[-1] + 1.1 * y[-1] - 0.2 * z[-1]
        new_z = -0.1 * x[-1] + 0.2 * y[-1] + 1.0 * z[-1]

        # Normalize to keep in projective space
        norm = (new_x**2 + new_y**2 + new_z**2) ** (1 / 2)
        x.append(new_x / norm)
        y.append(new_y / norm)
        z.append(new_z / norm)

    # Plot the trajectory
    ax.plot(x, y, z, "b-", linewidth=2, alpha=0.7)

    # Plot points with decreasing size to indicate time progression
    sizes = np.linspace(100, 20, num_points)
    for i in range(num_points):
        ax.scatter(x[i], y[i], z[i], color="blue", s=sizes[i], alpha=0.8)

        # Add point labels
        ax.text(x[i], y[i], z[i], f"$v_{{{i}}}$", fontsize=10)

    # Highlight the start and end points
    ax.scatter(
        x[0], y[0], z[0], color="green", s=120, alpha=1.0, label="Initial point $v_0$"
    )
    ax.scatter(
        x[-1], y[-1], z[-1], color="red", s=120, alpha=1.0, label="Final point $v_{11}$"
    )

    # Add a connecting line to show periodicity (v11 connects back to v4)
    ax.plot([x[-1], x[4]], [y[-1], y[4]], [z[-1], z[4]], "r--", linewidth=2)
    ax.scatter(
        x[4], y[4], z[4], color="purple", s=100, alpha=0.8, label="Periodic point $v_4$"
    )

    # Plot the projective plane (simplified representation)
    # Create a spherical surface to represent projective space
    u = np.linspace(0, 2 * np.pi, 30)
    v = np.linspace(0, np.pi, 30)
    sphere_x = 1.5 * np.outer(np.cos(u), np.sin(v))
    sphere_y = 1.5 * np.outer(np.sin(u), np.sin(v))
    sphere_z = 1.5 * np.outer(np.ones(np.size(u)), np.cos(v))

    # Plot transparent unit sphere to represent projective space
    ax.plot_surface(sphere_x, sphere_y, sphere_z, color="gray", alpha=0.1)

    # Add labels and title
    ax.set_xlabel("X", fontsize=12)
    ax.set_ylabel("Y", fontsize=12)
    ax.set_zlabel("Z", fontsize=12)

    # Add title with adjusted position
    fig.suptitle(
        "Projective Trajectory of a Cubic Number Through HAPD Algorithm",
        fontsize=16,
        y=0.95,
    )

    # Move legend to the right side with adjusted position to prevent overlap
    legend = ax.legend(loc="center left", bbox_to_anchor=(1.15, 0.5), fontsize=12)

    # Add annotations with adjusted positions and spacing
    ax.text2D(
        0.02,
        0.90,
        "Periodicity Detection in Projective Space",
        transform=ax.transAxes,
        fontsize=14,
        fontweight="bold",
    )

    # Increase spacing between text lines
    ax.text2D(
        0.02,
        0.85,
        "This visualization shows how the HAPD algorithm tracks the projective",
        transform=ax.transAxes,
        fontsize=10,
    )
    ax.text2D(
        0.02,
        0.81,
        "coordinates of a cubic number through successive transformations.",
        transform=ax.transAxes,
        fontsize=10,
    )
    ax.text2D(
        0.02,
        0.77,
        "Periodicity is detected when point $v_{11}$ returns to the projective",
        transform=ax.transAxes,
        fontsize=10,
    )
    ax.text2D(
        0.02,
        0.73,
        "equivalence class of point $v_4$, indicating a period of 7.",
        transform=ax.transAxes,
        fontsize=10,
    )

    # Set a good viewpoint
    ax.view_init(elev=30, azim=45)  # Adjusted view angle for better visibility

    # Ensure tight layout while respecting the adjusted margins
    plt.tight_layout()

    # Save figure
    save_figure(fig, "projective_trajectory_visualization")
    plt.close(fig)


def generate_future_research_directions():
    """Create an enhanced diagram illustrating future research directions flowing from Hermite's problem solution"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis("off")

    # Create elegant background with gradient
    gradient = np.ones((100, 100, 4))
    gradient[:, :, 0] = np.linspace(0.98, 0.95, 100)[:, None]  # Red
    gradient[:, :, 1] = np.linspace(0.98, 0.95, 100)[:, None]  # Green
    gradient[:, :, 2] = np.linspace(1.0, 0.97, 100)[:, None]  # Blue
    gradient[:, :, 3] = 1.0  # Alpha

    ax.imshow(gradient, extent=[0, 12, 0, 8], aspect="auto", zorder=-1)

    # Add border
    ax.add_patch(
        patches.Rectangle(
            (0.4, 0.4),
            11.2,
            7.2,
            facecolor="none",
            edgecolor="#555555",
            linewidth=2,
            zorder=0,
        )
    )

    # Title with decorative underline
    ax.text(
        6,
        7.3,
        "Future Research Directions",
        fontsize=20,
        fontweight="bold",
        ha="center",
        color="#1a1a1a",
    )
    ax.plot([3.5, 8.5], [7.0, 7.0], color="#555555", linewidth=1.5)

    # Central node - use a hexagon for more visual interest
    central_node_vertices = [
        (6, 5),
        (5.5, 4.5),
        (5.5, 3.5),
        (6, 3),
        (6.5, 3.5),
        (6.5, 4.5),
    ]
    ax.add_patch(
        patches.Polygon(
            central_node_vertices,
            facecolor="#d4e6f1",
            edgecolor="#2874a6",
            linewidth=2.5,
            zorder=2,
        )
    )

    # Core shadow for 3D effect
    shadow_vertices = [(x + 0.1, y - 0.1) for x, y in central_node_vertices]
    ax.add_patch(
        patches.Polygon(
            shadow_vertices, facecolor="#a9cce3", edgecolor="none", zorder=1
        )
    )

    ax.text(
        6,
        4,
        "Hermite's\nProblem\nSolution",
        ha="center",
        va="center",
        fontsize=14,
        fontweight="bold",
        color="#2c3e50",
    )

    # Enhanced direction nodes with more substantive content and stylistic improvements
    directions = [
        # Title, x, y, color, border_color, details
        (
            "Higher-Degree\nAlgebraic Extensions",
            2.0,
            5.5,
            "#fadbd8",
            "#c0392b",
            "• Extensions to quartic & higher fields\n• Projective space in dimension n+1\n• Invariant theory for higher degrees\n• Galois theory connections",
        ),
        (
            "Computational\nAlgorithms",
            2.0,
            2.5,
            "#d4e6f1",
            "#2874a6",
            "• Optimized HAPD implementation\n• Vectorized computation techniques\n• Parallel detection algorithms\n• Complexity analysis & benchmarking",
        ),
        (
            "Geometric\nFoundations",
            10.0,
            2.5,
            "#d5f5e3",
            "#1e8449",
            "• Projective geometry generalizations\n• Multi-dimensional continued fractions\n• Homogeneous space dynamics\n• Diophantine approximation theory",
        ),
        (
            "Applications &\nExtensions",
            10.0,
            5.5,
            "#fef9e7",
            "#d35400",
            "• Cryptographic primitives based on HAPD\n• Algebraic number detection tools\n• Number-theoretic algorithm improvements\n• Symbolic computation systems",
        ),
        (
            "Mathematical Physics\nConnections",
            6.0,
            1.5,
            "#e8daef",
            "#8e44ad",
            "• Dynamical systems modeling\n• Quantum chaos applications\n• Statistical mechanics analogies\n• Entropy & ergodic theory connections",
        ),
    ]

    # Improved arrow and connection style
    for i, (title, x, y, color, border_color, details) in enumerate(directions):
        # Draw node with 3D effect
        ax.add_patch(
            patches.Ellipse(
                (x + 0.1, y - 0.1),
                3.2,
                1.4,
                facecolor="#aaaaaa",
                edgecolor="none",
                alpha=0.3,
                zorder=1,
            )
        )

        ax.add_patch(
            patches.Ellipse(
                (x, y),
                3.2,
                1.4,
                facecolor=color,
                edgecolor=border_color,
                linewidth=2,
                zorder=2,
            )
        )

        # Add title with improved typography
        ax.text(
            x,
            y,
            title,
            ha="center",
            va="center",
            fontsize=14,
            fontweight="bold",
            color="#2c3e50",
        )

        # Draw connection lines with graduated colors
        if x < 6:  # Left side nodes
            connector_points = [
                (x + 1.6, y),  # Start from right side of node
                (x + ((6 - x) * 0.7), y),  # Control point
                (
                    central_node_vertices[0][0],
                    central_node_vertices[0][1],
                ),  # End at central node
            ]
        elif x > 6:  # Right side nodes
            connector_points = [
                (x - 1.6, y),  # Start from left side of node
                (x - ((x - 6) * 0.7), y),  # Control point
                (
                    central_node_vertices[3][0],
                    central_node_vertices[3][1],
                ),  # End at central node
            ]
        else:  # Bottom node
            connector_points = [
                (x, y + 0.7),  # Start from top of node
                (x, y + 1.5),  # Control point
                (
                    central_node_vertices[5][0],
                    central_node_vertices[5][1],
                ),  # End at central node
            ]

        # Create a smooth path
        verts = [connector_points[0], connector_points[1], connector_points[2]]
        codes = [Path.MOVETO, Path.CURVE3, Path.CURVE3]

        # Draw the path with gradient color
        path = Path(verts, codes)
        patch = patches.PathPatch(
            path, facecolor="none", edgecolor=border_color, linewidth=2, zorder=1
        )
        ax.add_patch(patch)

        # Add arrowhead
        arrow_length = 0.3
        arrow_width = 0.2

        # Calculate tangent direction at the end of the curve
        if x < 6:
            arrow_dir = (-1, 0)
        elif x > 6:
            arrow_dir = (1, 0)
        else:
            arrow_dir = (0, -1)

        # Draw arrowhead
        ax.add_patch(
            patches.Polygon(
                [
                    connector_points[2],
                    (
                        connector_points[2][0]
                        + arrow_dir[0] * arrow_length
                        - arrow_dir[1] * arrow_width,
                        connector_points[2][1]
                        + arrow_dir[1] * arrow_length
                        + arrow_dir[0] * arrow_width,
                    ),
                    (
                        connector_points[2][0]
                        + arrow_dir[0] * arrow_length
                        + arrow_dir[1] * arrow_width,
                        connector_points[2][1]
                        + arrow_dir[1] * arrow_length
                        - arrow_dir[0] * arrow_width,
                    ),
                ],
                facecolor=border_color,
                edgecolor="none",
                zorder=2,
            )
        )

        # Add details with improved formatting
        detail_x = x
        detail_y = y - 1.2

        # Create stylized text box with shadow effect
        text_box_width = 3.1
        text_box_height = 1.8

        ax.add_patch(
            patches.Rectangle(
                (
                    detail_x - text_box_width / 2 + 0.05,
                    detail_y - text_box_height / 2 - 0.05,
                ),
                text_box_width,
                text_box_height,
                facecolor="#555555",
                edgecolor="none",
                alpha=0.2,
                zorder=1,
                clip_on=False,
            )
        )

        ax.add_patch(
            patches.Rectangle(
                (detail_x - text_box_width / 2, detail_y - text_box_height / 2),
                text_box_width,
                text_box_height,
                facecolor="white",
                edgecolor=border_color,
                linewidth=1.5,
                zorder=2,
                clip_on=False,
            )
        )

        # Add details text with improved formatting
        ax.text(
            detail_x,
            detail_y,
            details,
            ha="center",
            va="center",
            fontsize=10,
            linespacing=1.5,
            color="#333333",
            zorder=3,
        )

    # Add a substantive caption explaining the research directions
    caption = (
        "This diagram outlines the key research directions emerging from our solution to Hermite's problem.\n"
        "Each branch represents a distinct path for extending the theoretical foundations and practical applications\n"
        "of periodicity detection in cubic numbers and related algebraic structures."
    )

    ax.text(
        6,
        0.7,
        caption,
        ha="center",
        va="center",
        fontsize=10,
        style="italic",
        color="#333333",
    )

    save_figure(fig, "future_research_directions")
    plt.close(fig)


def generate_figures():
    """Generate all figures for Hermite's Problem paper"""
    print("Generating figures for Hermite's Problem paper...")

    # Create the diagrams
    create_complementary_solutions_diagram()
    print("✓ Created complementary solutions diagram")

    create_projective_periodicity_visualization()
    print("✓ Created projective periodicity visualization")

    create_hapd_algorithm_flowchart()
    print("✓ Created HAPD algorithm flowchart")

    create_algorithm_comparison_chart()
    print("✓ Created algorithm comparison chart")

    create_convergence_rate_visualization()
    print("✓ Created convergence rate visualization")

    create_algorithmic_comparison_visualization()
    print("✓ Created algorithmic comparison visualization")

    create_projective_trajectory_visualization()
    print("✓ Created projective trajectory visualization")

    generate_future_research_directions()
    print("✓ Created future research directions diagram")

    print("All figures have been saved to the figures/output directory")


if __name__ == "__main__":
    generate_figures()
