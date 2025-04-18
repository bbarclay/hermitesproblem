import re
import os
import json
import argparse
from pathlib import Path


class LaTeXParser:
    """Parser for converting LaTeX to structured JSON format for web rendering."""

    def __init__(self):
        self.section_counter = 0
        self.theorem_counter = 0
        self.equation_counter = 0
        self.figure_counter = 0

    def parse_file(self, filename):
        """Parse a LaTeX file and convert it to structured JSON."""
        # Read the LaTeX file
        with open(filename, "r", encoding="utf-8") as f:
            content = f.read()

        # Extract the base filename without extension
        base_filename = os.path.basename(filename)
        name_without_ext = os.path.splitext(base_filename)[0]

        # Process the content
        json_content = self.latex_to_json(content)

        # Add metadata
        json_content["filename"] = base_filename
        json_content["id"] = name_without_ext
        json_content["order"] = self.determine_order(name_without_ext)

        return json_content

    def determine_order(self, filename):
        """Determine the logical order of sections."""
        # This is a simplified example. Would need to be expanded with actual ordering.
        section_order = {
            "abstract": 0,
            "introduction": 1,
            "galois-theory": 2,
            "hapd-algorithm": 3,
            "matrix-approach": 4,
            "matrix-verification": 5,
            "matrix-computational": 6,
            "equivalence": 7,
            "subtractive-algorithm": 8,
            "numerical-validation": 9,
            "objections-tex": 10,
            "implementation-examples": 11,
            "conclusion": 12,
            "bibliography": 13,
        }
        return section_order.get(filename, 999)

    def latex_to_json(self, latex_content):
        """Convert LaTeX content to structured JSON format."""
        # Initialize result structure
        result = {"sections": []}

        # Extract sections using regex
        section_pattern = r"\\section\{(.*?)\}([\s\S]*?)(?=\\section\{|\Z)"
        sections = re.findall(section_pattern, latex_content)

        # If no sections found, create a single unnamed section
        if not sections:
            sections = [("Unnamed Section", latex_content)]

        # Process each section
        for idx, (title, content) in enumerate(sections):
            section_id = re.sub(r"[^a-z0-9]+", "-", title.lower())
            section = {
                "title": title,
                "id": section_id,
                "level": "section",
                "content": self.process_section_content(content),
                "blocks": self.extract_blocks(content),
            }
            result["sections"].append(section)

        return result

    def process_section_content(self, section_content):
        """Process the content of a section to prepare it for markdown rendering."""
        # Split content into manageable chunks
        chunks = []

        # Add section title as markdown
        current_content = []

        # Split at major LaTeX environments to create content blocks
        lines = section_content.strip().split("\n")
        buffer = []

        for line in lines:
            # If we find a begin environment marker, store current buffer as a chunk
            if re.match(
                r"\\begin\{(theorem|definition|lemma|proposition|corollary|example|proof|equation|align|figure|table|itemize|enumerate)\}",
                line,
            ):
                if buffer:
                    chunks.append("\n".join(buffer))
                    buffer = []
                buffer.append(line)
            # If we find an end environment marker, add line, store as chunk, and reset buffer
            elif re.match(
                r"\\end\{(theorem|definition|lemma|proposition|corollary|example|proof|equation|align|figure|table|itemize|enumerate)\}",
                line,
            ):
                buffer.append(line)
                chunks.append("\n".join(buffer))
                buffer = []
            # Otherwise, add to current buffer
            else:
                buffer.append(line)

        # Add any remaining content
        if buffer:
            chunks.append("\n".join(buffer))

        # Process each chunk to handle LaTeX constructs
        processed_chunks = [self.preprocess_latex(chunk) for chunk in chunks]

        return processed_chunks

    def extract_blocks(self, content):
        """Extract structured blocks from the content (theorems, equations, figures, etc.)."""
        blocks = []

        # Extract theorems and similar environments
        theorem_pattern = r"\\begin\{(theorem|definition|lemma|proposition|corollary|example)\}([\s\S]*?)\\end\{\1\}"
        theorems = re.finditer(theorem_pattern, content)

        for theorem in theorems:
            env_type = theorem.group(1)
            content = theorem.group(2).strip()
            self.theorem_counter += 1

            blocks.append(
                {
                    "type": env_type,
                    "id": f"{env_type}-{self.theorem_counter}",
                    "content": content,
                    "number": self.theorem_counter,
                }
            )

        # Extract equations
        equation_pattern = r"\\begin\{(equation|align)\}([\s\S]*?)\\end\{\1\}"
        equations = re.finditer(equation_pattern, content)

        for equation in equations:
            env_type = equation.group(1)
            content = equation.group(2).strip()
            self.equation_counter += 1

            blocks.append(
                {
                    "type": "equation",
                    "id": f"equation-{self.equation_counter}",
                    "content": content,
                    "number": self.equation_counter,
                    "environment": env_type,
                }
            )

        # Extract figures
        figure_pattern = (
            r"\\begin\{figure\}([\s\S]*?)\\caption\{(.*?)\}([\s\S]*?)\\end\{figure\}"
        )
        figures = re.finditer(figure_pattern, content)

        for figure in figures:
            pre_caption = figure.group(1)
            caption = figure.group(2)
            post_caption = figure.group(3)

            # Try to extract image path
            includegraphics = re.search(
                r"\\includegraphics(?:\[.*?\])?\{(.*?)\}", pre_caption + post_caption
            )
            image_path = includegraphics.group(1) if includegraphics else ""

            self.figure_counter += 1

            blocks.append(
                {
                    "type": "figure",
                    "id": f"figure-{self.figure_counter}",
                    "caption": caption,
                    "image": image_path,
                    "number": self.figure_counter,
                }
            )

        return blocks

    def preprocess_latex(self, content):
        """Preprocess LaTeX content for markdown rendering."""
        # Start with the raw content
        processed = content

        # Handle special LaTeX commands
        processed = processed.replace("\\S", "§")
        processed = re.sub(r"\\ref\{([^}]+)\}", r"[§]", processed)
        processed = re.sub(r"\\cite\{([^}]+)\}", r"[\\1]", processed)
        processed = re.sub(r"\\label\{([^}]+)\}", "", processed)

        # Return the preprocessed content
        return processed


def generate_toc(json_files):
    """Generate a table of contents from the processed JSON files."""
    toc = {
        "paper": {
            "title": "Hermite's Problem: Novel Approaches for Periodicity Detection in Cubic Irrationals",
            "authors": ["Research Team"],
            "date": "2023",
            "sections": [],
        }
    }

    # Sort files by their order
    sorted_files = sorted(json_files, key=lambda x: x.get("order", 999))

    # Add section information to TOC
    for file in sorted_files:
        for section in file.get("sections", []):
            toc["paper"]["sections"].append(
                {
                    "title": section.get("title", "Unnamed Section"),
                    "id": section.get("id", ""),
                    "file": file.get("id", ""),
                    "level": section.get("level", "section"),
                }
            )

    return toc


def main():
    parser = argparse.ArgumentParser(
        description="Convert LaTeX files to JSON for web rendering."
    )
    parser.add_argument(
        "--input-dir", default="./tex", help="Directory containing LaTeX files"
    )
    parser.add_argument(
        "--output-dir",
        default="./public/content",
        help="Directory for output JSON files",
    )
    parser.add_argument("--example", action="store_true", help="Run with example LaTeX")

    args = parser.parse_args()

    # Ensure output directory exists
    os.makedirs(args.output_dir, exist_ok=True)

    if args.example:
        # Example LaTeX input
        latex_example = r"""
        \section{Introduction}
        This is a \textbf{sample} document with \textit{emphasis} and math: $E = mc^2$.

        \begin{theorem}
        For every quadratic irrational $\alpha$, the continued fraction expansion is eventually periodic.
        \end{theorem}

        \subsection{Details}
        Here is a list:
        \begin{itemize}
            \item First item
            \item Second item with $a^2 + b^2 = c^2$
        \end{itemize}

        Display math:
        \begin{equation}
        \int_0^\infty e^{-x} \, dx = 1
        \end{equation}

        \begin{figure}
        \includegraphics[width=0.8\textwidth]{images/hermite_diagram.png}
        \caption{Visualization of Hermite's algorithm.}
        \end{figure}
        """

        parser = LaTeXParser()
        result = parser.latex_to_json(latex_example)

        print("JSON Output:")
        print(json.dumps(result, indent=2))

        # Save example output
        with open(
            os.path.join(args.output_dir, "example.json"), "w", encoding="utf-8"
        ) as f:
            json.dump(result, f, indent=2)

        print(f"Example JSON saved to {os.path.join(args.output_dir, 'example.json')}")

    else:
        # Process all .tex files in input directory
        input_dir = Path(args.input_dir)
        if not input_dir.exists():
            print(f"Input directory {args.input_dir} does not exist.")
            return

        json_files = []
        parser = LaTeXParser()

        for tex_file in input_dir.glob("*.tex"):
            print(f"Processing {tex_file}...")

            try:
                json_content = parser.parse_file(tex_file)
                json_files.append(json_content)

                # Write JSON to output file
                output_file = Path(args.output_dir) / f"{json_content['id']}.json"
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(json_content, f, indent=2)

                print(f"Created {output_file}")

            except Exception as e:
                print(f"Error processing {tex_file}: {e}")

        # Generate table of contents
        toc = generate_toc(json_files)
        toc_file = Path(args.output_dir) / "toc.json"
        with open(toc_file, "w", encoding="utf-8") as f:
            json.dump(toc, f, indent=2)

        print(f"Created table of contents at {toc_file}")


if __name__ == "__main__":
    main()
