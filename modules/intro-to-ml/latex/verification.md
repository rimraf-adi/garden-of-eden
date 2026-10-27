# Chapter-level reconciliation report

Ground truth is `../docs/book.pdf`. Token coverage compares normalized alphabetic word occurrences from each PDF chapter page range with its generated `.tex` file. It is a mechanical completeness signal, not evidence that equations, figures, tables, or page geometry were reconstructed.

| Chapter | PDF pages | Source tokens | LaTeX tokens | Source-token coverage | Manual visual check |
| --- | ---: | ---: | ---: | ---: | --- |
| 1. Introduction | 36-55 | 6,970 | 6,755 | 93.6% | Reviewed: opening-page visual comparison |
| 2. Supervised Learning | 56-81 | 6,685 | 6,498 | 94.0% | Pending |
| 3. Bayesian Decision Theory | 82-95 | 3,719 | 3,599 | 93.8% | Pending |
| 4. Parametric Methods | 96-121 | 5,938 | 5,776 | 94.4% | Pending |
| 5. Multivariate Methods | 122-143 | 4,609 | 4,459 | 93.9% | Pending |
| 6. Dimensionality Reduction | 144-177 | 8,545 | 8,331 | 95.1% | Pending |
| 7. Clustering | 178-197 | 5,358 | 5,232 | 95.2% | Pending |
| 8. Nonparametric Methods | 198-219 | 4,415 | 4,263 | 92.9% | Pending |
| 9. Decision Trees | 220-243 | 7,045 | 6,831 | 93.9% | Pending |
| 10. Linear Discrimination | 244-267 | 4,664 | 4,526 | 94.5% | Pending |
| 11. Multilayer Perceptrons | 268-313 | 11,521 | 11,189 | 94.2% | Pending |
| 12. Local Models | 314-343 | 8,100 | 7,890 | 94.7% | Pending |
| 13. Kernel Machines | 344-375 | 7,519 | 7,262 | 93.3% | Pending |
| 14. Bayesian Estimation | 376-397 | 4,299 | 4,173 | 94.7% | Pending |
| 15. Hidden Markov Models | 398-421 | 5,382 | 5,230 | 95.0% | Pending |
| 16. Graphical Models | 422-453 | 7,357 | 7,122 | 93.9% | Pending |
| 17. Combining Multiple Learners | 454-481 | 8,501 | 8,117 | 91.2% | Pending |
| 18. Reinforcement Learning | 482-509 | 8,188 | 7,995 | 95.4% | Pending |
| 19. Design and Analysis of Machine Learning Experiments | 510-551 | 12,208 | 11,561 | 91.1% | Pending |

## Manual review protocol

For each row marked Pending, compare the source chapter's first page, one dense middle page, and its final page against the generated chapter. Confirm: (1) correct chapter boundaries and section order; (2) prose continuation across PDF page breaks; (3) figure/table/equation locations are recognizable; and (4) no text is visibly clipped in the compiled `main.pdf`.

The project compilation was run with `latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex`; the final log contained no LaTeX errors, unresolved-group notices, Unicode failures, or overfull/underfull box notices.
