import { preprocessTeX } from './texPreprocessor';

describe('preprocessTeX', () => {
  it('should convert \\cite{key} to an HTML anchor tag', () => {
    const tex = 'This is a citation \\cite{Hermite1848}.';
    const expectedHtml = 'This is a citation <a href="#citation-Hermite1848" class="citation" data-citation="Hermite1848">[Hermite1848]</a>.';
    expect(preprocessTeX(tex)).toBe(expectedHtml);
  });

  it('should convert \\ref{label} to an HTML anchor tag', () => {
    const tex = 'See section \\ref{sec:intro}.';
    const expectedHtml = 'See section <a href="#sec:intro" class="reference" data-reference="sec:intro">[intro]</a>.';
    expect(preprocessTeX(tex)).toBe(expectedHtml);
  });

  it('should convert \\ref{eq:label} to an HTML anchor tag with only the final part', () => {
    const tex = 'As shown in Eq. \\ref{eq:hapd_main}.';
    const expectedHtml = 'As shown in Eq. <a href="#eq:hapd_main" class="reference" data-reference="eq:hapd_main">[hapd_main]</a>.';
    expect(preprocessTeX(tex)).toBe(expectedHtml);
  });

  it('should convert \\textbf{text} to markdown bold', () => {
    const tex = 'Some \\textbf{bold text} here.';
    const expectedHtml = 'Some **bold text** here.';
    expect(preprocessTeX(tex)).toBe(expectedHtml);
  });

  it('should convert \\textit{text} to markdown italic', () => {
    const tex = 'Some \\textit{italic text} here.';
    const expectedHtml = 'Some *italic text* here.';
    expect(preprocessTeX(tex)).toBe(expectedHtml);
  });

  it('should convert enumerate to numbered markdown list', () => {
    const tex = `
\\begin{enumerate}
\\item First item.
\\item Second item.
\\end{enumerate}
    `;
    // Note: preprocessTeX adds extra newlines
    const expectedHtml = '\n1. First item.\n2. Second item.\n\n    ';
    expect(preprocessTeX(tex)).toBe(expectedHtml);
  });

   it('should convert itemize to bulleted markdown list', () => {
    const tex = `
\\begin{itemize}
\\item First point.
\\item Second point.
\\end{itemize}
    `;
    // Note: preprocessTeX adds extra newlines
    const expectedHtml = '\n* First point.\n* Second point.\n\n    ';
    expect(preprocessTeX(tex)).toBe(expectedHtml);
  });
  
  // Add more tests for other commands and environments...
}); 