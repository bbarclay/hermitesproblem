import os
import re
import json
from pathlib import Path


def clean_tex_content(content):
    """Clean TeX content for web display."""
    # Remove comments
    content = re.sub(r"%.*$", "", content, flags=re.MULTILINE)
    # Remove empty lines
    content = re.sub(r"\n\s*\n", "\n", content)
    # Process environments and references
    content = process_environments(content)
    return content.strip()

def process_environments(content):
    # Process algorithm environments
    content = process_algorithm_environments(content)
    # Process theorem environments
    content = process_theorem_environments(content)
    # Process figures
    content = process_figures(content)
    # Process references
    content = process_references(content)
    return content

def process_algorithm_environments(content):
    """Process algorithm_def environments into React components."""
    pattern = r"\\begin{algorithm_def}\[(.*?)\]\\label{(.*?)}(.*?)\\end{algorithm_def}"
    
    def replace_algorithm(match):
        title = match.group(1)
        label = match.group(2)
        body = match.group(3)
        
        # Fix numbering in lists
        body = re.sub(r"\\begin{enumerate}", "<ol>", body)
        body = re.sub(r"\\end{enumerate}", "</ol>", body)
        body = re.sub(r"\\item\s+", "<li>", body)
        # Ensure each item is closed
        body = re.sub(r"<li>(.*?)(?=<li>|</ol>)", r"<li>\1</li>", body, flags=re.DOTALL)
        
        return f'<Algorithm id="{label}" title="{title}">{body}</Algorithm>'
    
    return re.sub(pattern, replace_algorithm, content, flags=re.DOTALL)

def process_theorem_environments(content):
    """Process theorem and proof environments."""
    # Process theorems
    theorem_pattern = r"\\begin{theorem}\[(.*?)\]\\label{(.*?)}(.*?)\\end{theorem}"
    content = re.sub(
        theorem_pattern,
        r'<Theorem id="\2" title="\1">\3</Theorem>',
        content,
        flags=re.DOTALL
    )
    
    # Process proofs
    proof_pattern = r"\\begin{proof}(.*?)\\end{proof}"
    content = re.sub(
        proof_pattern,
        r'<Proof>\1</Proof>',
        content,
        flags=re.DOTALL
    )
    
    # Process definitions
    def_pattern = r"\\begin{definition}\[(.*?)\]\\label{(.*?)}(.*?)\\end{definition}"
    content = re.sub(
        def_pattern,
        r'<Definition id="\2" title="\1">\3</Definition>',
        content,
        flags=re.DOTALL
    )
    
    return content

def process_figures(content):
    """Process figure environments."""
    figure_pattern = r"\\begin{figure}.*?\\includegraphics.*?{(.*?)}.*?\\caption{(.*?)}\\label{(.*?)}.*?\\end{figure}"
    
    def replace_figure(match):
        path = match.group(1)
        caption = match.group(2)
        label = match.group(3)
        
        # Convert PDF to appropriate web format if needed
        web_path = path
        if path.endswith('.pdf'):
            web_path = f"/images/{path.split('/')[-1].replace('.pdf', '.png')}"
        
        return f'<Figure id="{label}" src="{web_path}" caption="{caption}" />'
    
    return re.sub(figure_pattern, replace_figure, content, flags=re.DOTALL)

def process_references(content):
    """Process cross-references."""
    # Create a dictionary of all labels and their display text
    labels = {}
    
    # Extract all labelable items (theorems, figures, equations, etc.)
    label_pattern = r"\\label{(.*?)}"
    for label in re.findall(label_pattern, content):
        # Determine the type of label and set appropriate text
        if label.startswith("fig:"):
            labels[label] = "Figure"
        elif label.startswith("thm:"):
            labels[label] = "Theorem"
        elif label.startswith("prop:"):
            labels[label] = "Proposition"
        elif label.startswith("lem:"):
            labels[label] = "Lemma"
        elif label.startswith("def:"):
            labels[label] = "Definition"
        elif label.startswith("alg:"):
            labels[label] = "Algorithm"
        else:
            labels[label] = "Section"
    
    # Replace references
    ref_pattern = r"\[(.*?)\]"
    
    def replace_ref(match):
        ref = match.group(1)
        if ref in labels:
            return f'<a href="#{ref}" className="reference">{labels[ref]} {ref.split(":")[-1]}</a>'
        return match.group(0)
    
    return re.sub(ref_pattern, replace_ref, content)

def extract_section_info(content):
    """Extract section information from TeX content."""
    sections = []
    current_section = None

    # Regular expressions for section matching - updated to handle different label formats
    section_patterns = {
        "section": r"\\section{(.*?)}(?:\\label{(.*?)})?",
        "subsection": r"\\subsection{(.*?)}(?:\\label{(.*?)})?",
        "subsubsection": r"\\subsubsection{(.*?)}(?:\\label{(.*?)})?",
    }

    for line in content.split("\n"):
        found_section = False
        for level, pattern in section_patterns.items():
            match = re.search(pattern, line)
            if match:
                title, label = match.groups()
                # If no label is provided, create one from the title
                if not label:
                    label = "sec:" + re.sub(r"[^a-zA-Z0-9]", "", title.lower())
                sections.append(
                    {"level": level, "title": title, "id": label, "content": []}
                )
                current_section = sections[-1]
                found_section = True
                break

        if not found_section and current_section is not None:
            current_section["content"].append(line)

    return sections


def get_file_order_from_main(main_file_path):
    """Extract the order of included files from main.tex."""
    try:
        with open(main_file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Look for include statements like \include{filename} or \input{filename}
        include_pattern = r"\\(?:include|input){([^}]+)}"
        includes = re.findall(include_pattern, content)

        # Strip .tex extension if present
        ordered_files = [f.replace(".tex", "") for f in includes]

        print(f"Found {len(ordered_files)} ordered files in main.tex: {ordered_files}")
        return ordered_files
    except Exception as e:
        print(f"Error reading main.tex: {e}")
        return []


def process_tex_files(source_dir, output_dir):
    """Process all TeX files and generate JSON structure."""
    tex_files = {}
    source_path = Path(source_dir).resolve()  # Get absolute path
    output_path = Path(output_dir).resolve()  # Get absolute path

    output_path.mkdir(parents=True, exist_ok=True)

    # Get ordered list of files from main.tex
    main_file_path = source_path / "main.tex"
    ordered_files = get_file_order_from_main(main_file_path)

    # Print info about available TeX files
    print(f"Looking for TeX files in: {source_path}")
    tex_file_list = list(source_path.glob("*.tex"))
    print(f"Found {len(tex_file_list)} TeX files")

    # Process files in the order they appear in main.tex first, then any others
    processed_files = set()
    ordered_tex_files = []

    # First add files in the order from main.tex
    for ordered_file in ordered_files:
        file_path = source_path / f"{ordered_file}.tex"
        if file_path.exists():
            ordered_tex_files.append(file_path)
            processed_files.add(ordered_file)
            print(f"Added {ordered_file}.tex from main.tex order")

    # Then add any remaining files
    for tex_file in tex_file_list:
        if tex_file.stem not in processed_files and tex_file.name != "main.tex":
            ordered_tex_files.append(tex_file)
            processed_files.add(tex_file.stem)
            print(f"Added {tex_file.name} (not in main.tex)")

    # Process each file
    for tex_file in ordered_tex_files:
        if tex_file.name in ["main.tex"]:  # Skip main file
            continue

        print(f"Processing: {tex_file.name}")
        try:
            with open(tex_file, "r", encoding="utf-8") as f:
                content = f.read()

            clean_content = clean_tex_content(content)
            sections = extract_section_info(clean_content)

            print(f"  Found {len(sections)} sections in {tex_file.name}")

            if not sections:  # If no sections found, create a default one
                sections = [
                    {
                        "level": "section",
                        "title": tex_file.stem.replace("-", " ").title(),
                        "id": f"file:{tex_file.stem}",
                        "content": [clean_content],
                    }
                ]
                print(f"  Created default section for {tex_file.name}")

            tex_files[tex_file.stem] = {
                "filename": tex_file.name,
                "sections": sections,
                "order": (
                    ordered_files.index(tex_file.stem)
                    if tex_file.stem in ordered_files
                    else 999
                ),
            }

            # Save processed content
            output_file = output_path / f"{tex_file.stem}.json"
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(tex_files[tex_file.stem], f, indent=2)
                print(f"  Saved {output_file}")
        except Exception as e:
            print(f"  Error processing {tex_file.name}: {e}")

    # Generate table of contents
    toc = []
    # Sort by order field to maintain document structure
    for filename, data in sorted(
        tex_files.items(), key=lambda x: x[1].get("order", 999)
    ):
        for section in data["sections"]:
            toc.append(
                {
                    "file": filename,
                    "title": section["title"],
                    "id": section["id"],
                    "level": section["level"],
                }
            )

    # Save table of contents
    toc_file = output_path / "toc.json"
    with open(toc_file, "w", encoding="utf-8") as f:
        json.dump(toc, f, indent=2)
        print(f"Saved TOC with {len(toc)} entries to {toc_file}")

    return tex_files


if __name__ == "__main__":
    # Use absolute path to the arxiv_submission directory
    base_dir = Path(__file__).parent.parent.parent / "arxiv_submission"
    output_dir = Path(__file__).parent.parent / "public/content"

    print(f"Base directory: {base_dir}")
    print(f"Output directory: {output_dir}")

    process_tex_files(base_dir, output_dir)
