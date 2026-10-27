# Inferential Statistics syllabus: plan

Outline source: the chapter 7-16 contents list of an applied engineering-statistics textbook (topics only; all chapters are written from scratch, nothing is copied).

## What Probability already covers (so we do not repeat it)
Random variables and the standard distributions, joint distributions and covariance, moments and transforms, conditional expectation, inequalities, the LLN and CLT with Slutsky and the delta method, Monte Carlo and MCMC, and a short bridge to estimation, sufficiency and Bayesian inference (Probability chapter 18).

## What is missing between probability and inference
- Sampling distributions of the statistics actually used: the sample mean and variance of a normal sample, and the chi-square, $t$ and $F$ distributions with proofs.
- Descriptive statistics and exploratory data analysis (the starting point of every analysis).
- A full treatment of estimation theory: bias, MSE, consistency, MLE and its asymptotics, Fisher information, Cramer-Rao, sufficiency and Rao-Blackwell.
- Confidence, prediction and tolerance intervals; the exact meaning of "95%".
- Hypothesis testing: Neyman-Pearson, power, p-values, likelihood ratio tests, duality with intervals.
- Two-sample methods, goodness of fit, contingency tables.
- Linear models: simple and multiple regression, Gauss-Markov, inference, diagnostics, model selection, regularisation.
- ANOVA, multiple comparisons, blocking, factorial and fractional factorial designs.
- Nonparametric and permutation methods; statistical quality control.
- Modern practice that older syllabi omit: the bootstrap, multiple testing and false discovery rate, A/B testing and sequential analysis, generalised linear models, cross-validation and the bias-variance trade-off.

## Chapters (14, five parts)
**Part I, Estimation:** 1 Sampling distributions and descriptive statistics; 2 Point estimation; 3 Confidence and prediction intervals.
**Part II, Hypothesis testing:** 4 Tests for one sample; 5 Goodness of fit and contingency tables; 6 Inference for two samples.
**Part III, Linear models:** 7 Simple linear regression and correlation; 8 Multiple linear regression.
**Part IV, Designed experiments:** 9 Single-factor ANOVA and blocking; 10 Factorial and fractional factorial designs.
**Part V, Further methods:** 11 Nonparametric and permutation methods; 12 Statistical quality control; 13 Multiple testing, A/B tests and the bootstrap; 14 Generalised linear models and model assessment.

Rebuild: `python3 tools/build_books.py inferential-statistics content/inferential-statistics --figures`, then `node tools/validate_book_math.mjs inferential-statistics`.
