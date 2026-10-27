# Linear Algebra syllabus: plan

Reference checked: the four-chapter "Vector Spaces & Linear Algebra" notes at gatexaiml.in (topic list only; none of its text is copied).

## What that reference covers
1. **Vector spaces**: vectors, norm, dot/cross product, axioms, subspaces, nullspace/column space, independence, basis, dimension, applications.
2. **Orthogonality**: orthogonal vectors/subspaces/complements, orthogonal matrices, projection matrices, symmetric matrices.
3. **Quadratic forms**: diagonalisation, definiteness, canonical form, geometry.
4. **SVD**: U/Σ/V, link to eigenvalues, computing, low-rank approximation, special-matrix shortcuts.

## What is missing from it (and from the current site)
**Your list**: linear transformations, change of basis, spectral theorem.

**Classical core that is absent entirely**
- Systems of linear equations, Gaussian elimination, row-reduced echelon form, pivots and free variables.
- Matrix algebra: products, transpose, inverse, elementary matrices, block matrices.
- LU / PLU factorisation, and operation counts.
- Determinants: definition, properties, cofactor expansion, Cramer's rule, geometric meaning (volume, orientation).
- Rank, rank-nullity theorem, the four fundamental subspaces.
- Eigenvalue theory: characteristic polynomial, algebraic vs geometric multiplicity, diagonalisation, Cayley-Hamilton, minimal polynomial, Jordan form, matrix powers and exponentials.

**Between the reference's chapters (gaps in its sequence)**
- Inner-product spaces in general (not only R^n), Cauchy-Schwarz, orthonormal bases.
- Gram-Schmidt and QR factorisation.
- Least squares, normal equations, the pseudo-inverse.
- Complex vector spaces, Hermitian and unitary matrices, normal matrices.
- Positive semidefinite matrices, Cholesky, Schur complement, Loewner order.
- Matrix norms (spectral, Frobenius, nuclear), condition number, perturbation.

**Interview / ML layer**
- PCA as eigendecomposition and as SVD; whitening.
- Matrix calculus (gradients of tr, log det, quadratic forms), vec/Kronecker.
- Markov chains and Perron-Frobenius; PageRank; graph Laplacian and spectral clustering.
- Low-rank structure: LoRA, matrix factorisation, Eckart-Young.
- Numerical linear algebra: power iteration, Krylov/Lanczos, conditioning, stability.
- Tensors: outer product, Kronecker product, einsum view.
- A closing chapter of interview problems and common traps.

## Proposed chapter order (21 chapters, four parts)
**Part I: Systems and matrices**
1. Vectors, geometry, norms, dot and cross product
2. Linear systems and Gaussian elimination
3. Matrix algebra, inverses, elementary matrices
4. LU and PLU factorisation
5. Determinants

**Part II: Vector spaces and maps**
6. Vector spaces and subspaces
7. Independence, basis, dimension
8. Rank, rank-nullity, the four fundamental subspaces
9. Linear transformations and their matrices
10. Change of basis, similarity, coordinate systems

**Part III: Geometry and spectral theory**
11. Inner-product spaces, orthogonality, Gram-Schmidt, QR
12. Projections and least squares
13. Eigenvalues and eigenvectors
14. Diagonalisation, Cayley-Hamilton, Jordan form, matrix functions
15. Symmetric and Hermitian matrices, the spectral theorem
16. Quadratic forms and definiteness; PSD matrices, Cholesky
17. Singular value decomposition, pseudo-inverse, low-rank approximation

**Part IV: Applied and interview**
18. Matrix norms and conditioning
19. PCA, matrix calculus for ML
20. Markov chains, graph Laplacians, spectral methods
21. Numerical methods and interview problem set

## Fit with the rest of the site
- Sits before Vector Calculus and Introduction to ML (they use eigen/SVD/PSD results).
- Same format as the three new books: theorem/definition/proof boxes, interview and pitfall boxes, worked examples, TikZ figures turned into SVG.
- Authoring: write original LaTeX in the same box style so the existing converter (`tools/build_books.py`) handles it with no new code.

## Status

Written, in `content/linear-algebra/` (LaTeX source, compiles to about 127 pages) and published on the site at `/paths/linear-algebra`.

Decisions applied (the three open questions): real scalars through Chapter 12 with complex numbers entering at Chapter 13 (eigenvalues); full proofs for all main theorems (existence-only sketches for Jordan form and Perron-Frobenius); written from scratch in the same box style as the other books.

Final structure (21 chapters): Part I Systems and Matrices (1-5), Part II Vector Spaces and Linear Maps (6-10), Part III Geometry and Spectral Theory (11-17), Part IV Applications (18-21: norms and conditioning, matrix calculus and PCA, Markov chains and graph Laplacians, numerical methods and interview problems).

Rebuild after editing: `python3 tools/build_books.py linear-algebra content/linear-algebra --figures`, then `node tools/validate_book_math.mjs linear-algebra`.
