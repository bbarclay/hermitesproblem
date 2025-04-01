import numpy as np
import matplotlib.pyplot as plt
from matplotlib.table import Table

# Create a clean figure
plt.figure(figsize=(9, 4))
ax = plt.gca()
ax.axis("off")

# Define the data for our matrices
input_data = [["v1"], ["v2"], ["v3"]]
matrix_data = [["1", "0", "-a1"], ["0", "1", "-a2"], ["-a1", "-a2", "a1a2+1"]]
output_data = [["v1-a1v3"], ["v2-a2v3"], ["v3'"]]


# Function to create a table at a specific position
def create_table(ax, data, position, width=0.15, height=0.45, title=None):
    # Create a table
    n_rows = len(data)
    n_cols = len(data[0])

    # Position is the center of the table
    x, y = position

    # Adjust x, y to be the bottom left corner
    x -= width / 2
    y -= height / 2

    # Create the table with specific dimensions
    table = Table(ax, bbox=[x, y, width, height])

    # Add cells with data
    cell_height = height / n_rows
    cell_width = width / n_cols

    for i in range(n_rows):
        for j in range(n_cols):
            table.add_cell(
                i,
                j,
                cell_width,
                cell_height,
                text=data[i][j],
                loc="center",
                facecolor="white",
            )

    # Add the table to the axis
    ax.add_table(table)

    # Add title if provided
    if title:
        ax.text(
            x + width / 2,
            y + height + 0.02,
            title,
            ha="center",
            va="bottom",
            fontsize=12,
        )

    return x, y, width, height


# Create our three tables with proper spacing
x1, y1, w1, h1 = create_table(
    ax, input_data, (0.2, 0.45), width=0.1, title="Input Vector"
)
x2, y2, w2, h2 = create_table(
    ax, matrix_data, (0.5, 0.45), width=0.25, title="HAPD Matrix"
)
x3, y3, w3, h3 = create_table(ax, output_data, (0.8, 0.45), width=0.15, title="Output")

# Add multiplication and equals signs
ax.text(0.32, 0.45, "×", fontsize=18, ha="center", va="center")
ax.text(0.67, 0.45, "=", fontsize=18, ha="center", va="center")

# Add main title
ax.text(
    0.5,
    0.9,
    "HAPD Matrix Transformation",
    fontsize=16,
    weight="bold",
    ha="center",
    va="center",
)

# Add explanation
explanation = "The HAPD algorithm applies this matrix transformation to triple (v1,v2,v3).\nParameters a1, a2 are integer parts of v1/v3 and v2/v3.\nThe notation v3' represents the transformed value of v3 after one iteration."
ax.text(
    0.5,
    0.1,
    explanation,
    fontsize=10,
    ha="center",
    va="center",
    bbox=dict(boxstyle="round", facecolor="#f0f0f0", alpha=0.9, pad=0.6),
)

# Save the figure
plt.savefig("matrix_transformation.pdf", dpi=300, bbox_inches="tight")
plt.savefig("matrix_transformation.png", dpi=300, bbox_inches="tight")
plt.close()

print("Generated table-based matrix transformation visualization.")
