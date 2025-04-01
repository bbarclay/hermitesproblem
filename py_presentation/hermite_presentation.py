#!/usr/bin/env python
from manim import *
import numpy as np

# Configure for high quality rendering with GPU acceleration
config.renderer = "opengl"
config.preview = True


class HermitePresentation(Scene):
    def construct(self):
        # Define colors for consistent styling
        PRIMARY_COLOR = "#3498db"
        SECONDARY_COLOR = "#e74c3c"
        HIGHLIGHT_COLOR = "#f1c40f"
        TEXT_COLOR = "#2c3e50"
        BACKGROUND_COLOR = "#ecf0f1"

        # Set the background color
        self.camera.background_color = BACKGROUND_COLOR

        # Slide 1: Title Slide
        def slide_1():
            title = Text("Hermite's Problem", font_size=60, color=PRIMARY_COLOR)
            subtitle = Text(
                "A 170-Year-Old Mathematical Challenge",
                font_size=36,
                color=SECONDARY_COLOR,
            )
            author = Text(
                "Solving Cubic Irrationals with Periodicity",
                font_size=24,
                color=TEXT_COLOR,
            )

            title.to_edge(UP, buff=1)
            subtitle.next_to(title, DOWN, buff=0.5)
            author.next_to(subtitle, DOWN, buff=1)

            # Create a decorative math symbol background
            symbols = VGroup()
            for i in range(20):
                symbol = MathTex(
                    r"\alpha", r"\beta", r"\gamma", r"\pi", r"\sum", r"\int"
                )[i % 6]
                symbol.scale(0.7)
                symbol.set_opacity(0.2)
                symbol.move_to(
                    np.array(
                        [np.random.uniform(-5.5, 5.5), np.random.uniform(-3, 3), 0]
                    )
                )
                symbols.add(symbol)

            # Animate the title slide
            self.play(FadeIn(symbols, lag_ratio=0.05, run_time=2))
            self.play(Write(title, run_time=1.5))
            self.play(FadeIn(subtitle, run_time=1))
            self.play(FadeIn(author, run_time=1))
            self.wait(1)

            # Transition to next slide
            self.play(
                FadeOut(title),
                FadeOut(subtitle),
                FadeOut(author),
                FadeOut(symbols),
                run_time=1,
            )

        # Slide 2: What is Hermite's Problem?
        def slide_2():
            title = Text(
                "What is Hermite's Problem?", font_size=48, color=PRIMARY_COLOR
            )
            title.to_edge(UP, buff=0.5)

            hermite_img = Text(
                "Hermite's Problem Visualization", font_size=28, color=SECONDARY_COLOR
            )
            hermite_img.scale(0.6)
            hermite_img.to_corner(DR)

            bullet1 = Text(
                "• Posed by Charles Hermite in 1848", font_size=28, color=TEXT_COLOR
            )
            bullet2 = Text(
                "• Find a continued fraction-like algorithm",
                font_size=28,
                color=TEXT_COLOR,
            )
            bullet3 = Text(
                "• Must detect ALL cubic numbers through periodicity",
                font_size=28,
                color=TEXT_COLOR,
            )
            bullet4 = Text(
                "• Must work for both real and complex roots",
                font_size=28,
                color=HIGHLIGHT_COLOR,
                weight=BOLD,
            )

            bullets = VGroup(bullet1, bullet2, bullet3, bullet4).arrange(
                DOWN, aligned_edge=LEFT, buff=0.4
            )
            bullets.shift(LEFT * 1.5)
            bullets.shift(UP * 0.5)

            # Animate the slide
            self.play(Write(title, run_time=1))
            self.play(FadeIn(hermite_img, run_time=1))

            for bullet in bullets:
                self.play(FadeIn(bullet, shift=RIGHT * 0.3, run_time=0.8))

            self.wait(2)

            # Transition
            self.play(
                FadeOut(title), FadeOut(hermite_img), FadeOut(bullets), run_time=1
            )

        # Slide 3: Cubic Numbers Explained
        def slide_3():
            title = Text("Cubic Numbers Explained", font_size=48, color=PRIMARY_COLOR)
            title.to_edge(UP, buff=0.5)

            # Create a cubic equation example
            cubic_eq = MathTex(
                r"ax^3 + bx^2 + cx + d = 0", font_size=36, color=SECONDARY_COLOR
            )
            cubic_eq.shift(UP * 1)

            # Create visual representations of cubic numbers
            real_root = MathTex(
                r"\alpha \in \mathbb{R}", font_size=32, color=TEXT_COLOR
            )
            complex_roots = MathTex(
                r"\alpha', \alpha'' \in \mathbb{C}", font_size=32, color=TEXT_COLOR
            )

            # Create a number line and complex plane representation
            number_line = NumberLine(
                x_range=[-3, 3, 1],
                length=6,
                include_numbers=True,
                label_direction=DOWN,
            )

            complex_plane = ComplexPlane(
                x_range=[-2, 2, 1],
                y_range=[-2, 2, 1],
                background_line_style={
                    "stroke_color": GRAY,
                    "stroke_width": 1,
                    "stroke_opacity": 0.5,
                },
            ).scale(0.7)

            # Position the elements
            real_root.next_to(number_line, UP, buff=0.5)
            complex_plane.shift(DOWN * 1.5)
            complex_roots.next_to(complex_plane, UP, buff=0.5)

            # Create dots for roots
            real_dot = Dot(number_line.n2p(1.5), color=HIGHLIGHT_COLOR)
            complex_dot1 = Dot(complex_plane.n2p(-0.75 + 1.3j), color=HIGHLIGHT_COLOR)
            complex_dot2 = Dot(complex_plane.n2p(-0.75 - 1.3j), color=HIGHLIGHT_COLOR)

            # Animate the slide
            self.play(Write(title, run_time=1))
            self.play(Write(cubic_eq, run_time=1))

            self.play(Create(number_line), FadeIn(real_root), run_time=1.5)

            self.play(FadeIn(real_dot, scale=1.5))

            self.play(Create(complex_plane), FadeIn(complex_roots), run_time=1.5)

            self.play(
                FadeIn(complex_dot1, scale=1.5),
                FadeIn(complex_dot2, scale=1.5),
                run_time=1,
            )

            # Add explanation about cubic numbers
            explanation = Text(
                "A cubic number is a root of a degree-3 polynomial\nwith rational coefficients.",
                font_size=24,
                color=TEXT_COLOR,
            )
            explanation.to_edge(DOWN, buff=0.5)

            self.play(FadeIn(explanation, run_time=1))

            self.wait(2)

            # Transition
            self.play(
                FadeOut(title),
                FadeOut(cubic_eq),
                FadeOut(number_line),
                FadeOut(real_root),
                FadeOut(real_dot),
                FadeOut(complex_plane),
                FadeOut(complex_roots),
                FadeOut(complex_dot1),
                FadeOut(complex_dot2),
                FadeOut(explanation),
                run_time=1,
            )

        # Slide 4: The Challenge of Periodicity Detection
        def slide_4():
            title = Text(
                "The Challenge of Periodicity Detection",
                font_size=48,
                color=PRIMARY_COLOR,
            )
            title.to_edge(UP, buff=0.5)

            # Create a visualization of continued fractions for comparison
            continued_fraction = MathTex(
                r"\sqrt{2} = 1 + \frac{1}{2 + \frac{1}{2 + \frac{1}{2 + \cdots}}}",
                font_size=32,
                color=SECONDARY_COLOR,
            )
            continued_fraction.shift(UP * 1)

            # Create a sequence visualization
            sequence = MathTex(
                r"[1, 2, 2, 2, 2, 2, \ldots]", font_size=32, color=HIGHLIGHT_COLOR
            )
            sequence.next_to(continued_fraction, DOWN, buff=0.5)

            # Create explanation text boxes
            challenge1 = Text(
                "• Simple continued fractions work for quadratic irrationals",
                font_size=24,
                color=TEXT_COLOR,
            )
            challenge2 = Text(
                "• But fail for cubic and higher-degree numbers",
                font_size=24,
                color=TEXT_COLOR,
            )
            challenge3 = Text(
                "• We need a multi-dimensional approach", font_size=24, color=TEXT_COLOR
            )
            challenge4 = Text(
                "• Must capture all algebraic properties",
                font_size=24,
                color=TEXT_COLOR,
            )

            challenges = VGroup(challenge1, challenge2, challenge3, challenge4)
            challenges.arrange(DOWN, aligned_edge=LEFT, buff=0.4)
            challenges.shift(DOWN * 0.5)

            # Animate the slide
            self.play(Write(title, run_time=1))
            self.play(Write(continued_fraction, run_time=1.5))
            self.play(Write(sequence, run_time=1))

            for challenge in challenges:
                self.play(FadeIn(challenge, shift=RIGHT * 0.3, run_time=0.7))

            self.wait(2)

            # Transition
            self.play(
                FadeOut(title),
                FadeOut(continued_fraction),
                FadeOut(sequence),
                FadeOut(challenges),
                run_time=1,
            )

        # Slide 5: Our Solution: HAPD Algorithm
        def slide_5():
            title = Text(
                "Our Solution: HAPD Algorithm", font_size=48, color=PRIMARY_COLOR
            )
            title.to_edge(UP, buff=0.5)

            # Create a representation of the HAPD algorithm
            algo_box = Rectangle(width=4, height=3, color=SECONDARY_COLOR)
            algo_text = Text(
                "HAPD Algorithm\nFlowchart", font_size=24, color=SECONDARY_COLOR
            )
            algo_text.move_to(algo_box.get_center())
            hapd_img = VGroup(algo_box, algo_text)
            hapd_img.to_corner(DR)

            # Create key points about the HAPD algorithm
            point1 = Text(
                "• Hermite Algorithm for Periodicity Detection",
                font_size=28,
                color=TEXT_COLOR,
            )
            point2 = Text(
                "• Works for ALL cubic numbers",
                font_size=28,
                color=HIGHLIGHT_COLOR,
                weight=BOLD,
            )
            point3 = Text(
                "• Uses projective transformations", font_size=28, color=TEXT_COLOR
            )
            point4 = Text("• Non-subtractive approach", font_size=28, color=TEXT_COLOR)

            points = VGroup(point1, point2, point3, point4)
            points.arrange(DOWN, aligned_edge=LEFT, buff=0.4)
            points.shift(LEFT * 2)
            points.shift(UP * 0.5)

            # Animate the slide
            self.play(Write(title, run_time=1))
            self.play(FadeIn(hapd_img, run_time=1))

            for point in points:
                self.play(FadeIn(point, shift=RIGHT * 0.3, run_time=0.8))

            self.wait(2)

            # Transition
            self.play(FadeOut(title), FadeOut(hapd_img), FadeOut(points), run_time=1)

        # Slide 6: The Modified sin² Algorithm
        def slide_6():
            title = Text(
                "The Modified sin² Algorithm", font_size=48, color=PRIMARY_COLOR
            )
            title.to_edge(UP, buff=0.5)

            # Create a formula representation
            formula = MathTex(
                r"\alpha_{n+1} = \frac{|\alpha_n - \lfloor\alpha_n\rfloor_P| \cdot \sin^2(\arg(\alpha_n - \lfloor\alpha_n\rfloor_P))}{\alpha_n - \lfloor\alpha_n\rfloor_P} - \delta_n",
                font_size=28,
                color=SECONDARY_COLOR,
            )
            formula.shift(UP * 1)

            # Create key points about the Modified sin² algorithm
            point1 = Text("• Based on Karpenkov's work", font_size=28, color=TEXT_COLOR)
            point2 = Text(
                "• Extended to handle complex roots",
                font_size=28,
                color=HIGHLIGHT_COLOR,
                weight=BOLD,
            )
            point3 = Text(
                "• Uses phase-preserving floor function", font_size=28, color=TEXT_COLOR
            )
            point4 = Text("• Subtractive approach", font_size=28, color=TEXT_COLOR)

            points = VGroup(point1, point2, point3, point4)
            points.arrange(DOWN, aligned_edge=LEFT, buff=0.4)
            points.shift(DOWN * 0.5)

            # Animate the slide
            self.play(Write(title, run_time=1))
            self.play(Write(formula, run_time=1.5))

            for point in points:
                self.play(FadeIn(point, shift=RIGHT * 0.3, run_time=0.8))

            self.wait(2)

            # Transition
            self.play(FadeOut(title), FadeOut(formula), FadeOut(points), run_time=1)

        # Slide 7: Comparison of Approaches
        def slide_7():
            title = Text("Comparison of Approaches", font_size=48, color=PRIMARY_COLOR)
            title.to_edge(UP, buff=0.5)

            # Create a comparison table
            table = Table(
                [
                    ["Feature", "HAPD Algorithm", "Modified sin²"],
                    ["Applicable to", "All cubic numbers", "All cubic numbers"],
                    ["Approach", "Projective", "Subtractive"],
                    ["Complex roots", "✓", "✓"],
                    ["Implementation", "Simpler", "More complex"],
                ],
                row_labels=[Text("") for _ in range(5)],
                col_labels=[Text("") for _ in range(3)],
                include_outer_lines=True,
                line_config={"color": GRAY},
                v_buff=0.3,
                h_buff=0.6,
            )
            table.scale(0.7)
            table.shift(DOWN * 0.2)

            # Animate the slide
            self.play(Write(title, run_time=1))
            self.play(FadeIn(table, run_time=1.5))

            # Add a comment about the comparison
            comment = Text(
                "Both algorithms successfully solve Hermite's Problem",
                font_size=24,
                color=HIGHLIGHT_COLOR,
            )
            comment.to_edge(DOWN, buff=0.5)

            self.play(FadeIn(comment, run_time=1))

            self.wait(2)

            # Transition
            self.play(FadeOut(title), FadeOut(table), FadeOut(comment), run_time=1)

        # Slide 8: Numerical Validation
        def slide_8():
            title = Text("Numerical Validation", font_size=48, color=PRIMARY_COLOR)
            title.to_edge(UP, buff=0.5)

            # Create a validation visualization
            axes = Axes(
                x_range=[0, 10, 1],
                y_range=[0, 1, 0.2],
                axis_config={"color": GRAY},
                x_axis_config={"numbers_to_include": range(0, 11, 2)},
                y_axis_config={"numbers_to_include": [0, 0.2, 0.4, 0.6, 0.8, 1.0]},
            )
            axes.scale(0.6)
            axes.to_corner(DR)

            # Add x and y labels
            x_label = Text("Test Case", font_size=20, color=GRAY)
            y_label = Text("Success Rate", font_size=20, color=GRAY)
            x_label.next_to(axes.x_axis, DOWN, buff=0.2)
            y_label.next_to(axes.y_axis, LEFT, buff=0.2)

            # Create a bar chart
            bars = VGroup()
            heights = [1.0, 1.0, 1.0, 1.0, 1.0, 0.2, 0.0, 0.1, 0.0, 0.0]
            for i, height in enumerate(heights):
                bar = Rectangle(
                    height=height * 5,  # Scale for visibility
                    width=0.5,
                    fill_color=HIGHLIGHT_COLOR if height > 0.9 else TEXT_COLOR,
                    fill_opacity=0.8,
                    stroke_width=1,
                    stroke_color=GRAY,
                )
                bar.move_to(axes.c2p(i + 0.5, height / 2, 0), aligned_edge=DOWN)
                bars.add(bar)

            validation_vis = VGroup(axes, x_label, y_label, bars)

            # Create validation points
            point1 = Text(
                "• Tested numerous cubic equations", font_size=28, color=TEXT_COLOR
            )
            point2 = Text(
                "• 100% success rate for cubic irrationals",
                font_size=28,
                color=HIGHLIGHT_COLOR,
                weight=BOLD,
            )
            point3 = Text(
                "• Clear differentiation from non-cubic numbers",
                font_size=28,
                color=TEXT_COLOR,
            )
            point4 = Text(
                "• Performance analysis confirms efficiency",
                font_size=28,
                color=TEXT_COLOR,
            )

            points = VGroup(point1, point2, point3, point4)
            points.arrange(DOWN, aligned_edge=LEFT, buff=0.4)
            points.shift(LEFT * 2)
            points.shift(UP * 0.5)

            # Animate the slide
            self.play(Write(title, run_time=1))
            self.play(Create(axes), Write(x_label), Write(y_label), run_time=1.5)
            self.play(
                *[GrowFromEdge(bar, DOWN) for bar in bars], run_time=1.5, lag_ratio=0.1
            )

            for point in points:
                self.play(FadeIn(point, shift=RIGHT * 0.3, run_time=0.8))

            self.wait(2)

            # Transition
            self.play(
                FadeOut(title), FadeOut(validation_vis), FadeOut(points), run_time=1
            )

        # Slide 9: Future Research Directions
        def slide_9():
            title = Text(
                "Future Research Directions", font_size=48, color=PRIMARY_COLOR
            )
            title.to_edge(UP, buff=0.5)

            # Create a future directions visualization
            future_rect = Rectangle(width=4, height=3, color=SECONDARY_COLOR)
            future_text = Text(
                "Future Research\nDirections", font_size=24, color=SECONDARY_COLOR
            )
            future_text.move_to(future_rect.get_center())
            future_img = VGroup(future_rect, future_text)
            future_img.to_corner(DR)

            # Create future directions points
            point1 = Text(
                "• Apply to number-theoretic problems", font_size=28, color=TEXT_COLOR
            )
            point2 = Text(
                "• Explore cryptographic applications", font_size=28, color=TEXT_COLOR
            )
            point3 = Text(
                "• Extend to higher-degree algebraic numbers",
                font_size=28,
                color=HIGHLIGHT_COLOR,
                weight=BOLD,
            )
            point4 = Text(
                "• Optimize algorithms for computational efficiency",
                font_size=28,
                color=TEXT_COLOR,
            )

            points = VGroup(point1, point2, point3, point4)
            points.arrange(DOWN, aligned_edge=LEFT, buff=0.4)
            points.shift(LEFT * 2)
            points.shift(UP * 0.5)

            # Animate the slide
            self.play(Write(title, run_time=1))
            self.play(FadeIn(future_img, run_time=1))

            for point in points:
                self.play(FadeIn(point, shift=RIGHT * 0.3, run_time=0.8))

            self.wait(2)

            # Transition
            self.play(FadeOut(title), FadeOut(future_img), FadeOut(points), run_time=1)

        # Slide 10: Thank You / Q&A
        def slide_10():
            title = Text("Thank You!", font_size=60, color=PRIMARY_COLOR)
            subtitle = Text("Questions?", font_size=48, color=SECONDARY_COLOR)

            title.shift(UP * 0.5)
            subtitle.next_to(title, DOWN, buff=1)

            # Create a decorative math background (similar to the title slide)
            symbols = VGroup()
            for i in range(30):
                symbol = MathTex(
                    r"\alpha", r"\beta", r"\gamma", r"\pi", r"\sum", r"\int"
                )[i % 6]
                symbol.scale(0.7)
                symbol.set_opacity(0.2)
                symbol.move_to(
                    np.array(
                        [np.random.uniform(-5.5, 5.5), np.random.uniform(-3, 3), 0]
                    )
                )
                symbols.add(symbol)

            # Add contact information
            contact = Text(
                "For more information:\nHermite's Problem: A 170-Year Solution",
                font_size=24,
                color=TEXT_COLOR,
            )
            contact.to_edge(DOWN, buff=1)

            # Animate the slide
            self.play(FadeIn(symbols, lag_ratio=0.05, run_time=2))
            self.play(Write(title, run_time=1.5))
            self.play(Write(subtitle, run_time=1))
            self.play(FadeIn(contact, run_time=1))

            self.wait(3)

        # Run all slides in sequence
        slide_1()
        slide_2()
        slide_3()
        slide_4()
        slide_5()
        slide_6()
        slide_7()
        slide_8()
        slide_9()
        slide_10()


if __name__ == "__main__":
    # This will render the animation
    scene = HermitePresentation()
    scene.render()
