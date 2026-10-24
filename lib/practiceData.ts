export interface PracticeExercise {
  id: string;
  chapterNum: number;
  chapterTitle: string;
  title: string;
  difficulty: 'Warmup' | 'Intermediate' | 'Advanced' | 'Rigorous';
  category: 'Derivation' | 'Numerical' | 'Algorithmic' | 'Conceptual';
  question: string;
  hints: string[];
  solution: string;
  equationRef?: string;
}

export const PRACTICE_EXERCISES: PracticeExercise[] = [
  {
    id: 'ex-01-01',
    chapterNum: 1,
    chapterTitle: 'Introduction',
    title: 'Inductive Bias & Hypothesis Capacity',
    difficulty: 'Warmup',
    category: 'Conceptual',
    question: `Explain why a learning algorithm without inductive bias cannot generalize to unseen instances. Formulate the relationship between the hypothesis space $\\mathcal{H}$ and the sample set $\\mathcal{X}$.`,
    hints: [
      'Consider the set of all possible binary functions on an input domain of size $d$.',
      'What happens if the hypothesis space contains every possible truth table on unseen inputs?'
    ],
    solution: `Without inductive bias, an algorithm considers every mathematically possible function in the universal hypothesis space $\\mathcal{U} = \\{f: \\mathcal{X} \\to \\mathcal{Y}\\}$. If the input space has cardinality $|\\mathcal{X}| = d$, there are $2^d$ possible binary functions.

Given a training set of $N$ labeled points, there remain $d - N$ unseen points. For these unseen points, exactly $2^{d-N}$ functions agree with the training sample and predict $0$ on a given test point $x^*$, while exactly $2^{d-N}$ functions predict $1$.

Thus, without an inductive bias prioritizing certain hypotheses over others (e.g. Occam\\'s razor or maximum margin), the learner has zero predictive preference on unseen points, reducing generalization accuracy to random coin-toss chance.`,
    equationRef: 'Section 1.3'
  },
  {
    id: 'ex-02-01',
    chapterNum: 2,
    chapterTitle: 'Supervised Learning',
    title: 'PAC Learning Sample Complexity Bound',
    difficulty: 'Intermediate',
    category: 'Derivation',
    question: `According to Valiant's Probably Approximately Correct (PAC) framework, derive the minimum sample size $N$ required to guarantee that with probability at least $1 - \\delta$, a consistent learner finds a hypothesis $h \\in \\mathcal{H}$ with true generalization error $E(h) \\le \\epsilon$.`,
    hints: [
      'The probability that a bad hypothesis (with error $> \\epsilon$) is consistent with one training sample is at most $(1 - \\epsilon)$.',
      'Use the union bound over all hypotheses in the finite hypothesis space $|\\mathcal{H}|$.',
      'Use the inequality $1 - \\epsilon \\le e^{-\\epsilon}$.'
    ],
    solution: `Let $\\mathcal{H}_{\\text{bad}} = \\{h \\in \\mathcal{H} : E(h) > \\epsilon\\}$.
For any specific $h \\in \\mathcal{H}_{\\text{bad}}$, the probability that it correctly classifies $N$ independent training examples is:
$$P(h \\text{ consistent}) \\le (1 - \\epsilon)^N$$

Applying the union bound over all bad hypotheses:
$$P(\\exists h \\in \\mathcal{H}_{\\text{bad}} \\text{ consistent}) \\le \\sum_{h \\in \\mathcal{H}_{\\text{bad}}} (1 - \\epsilon)^N \\le |\\mathcal{H}| (1 - \\epsilon)^N$$

Using the inequality $1 - \\epsilon \\le e^{-\\epsilon}$:
$$|\\mathcal{H}|(1 - \\epsilon)^N \\le |\\mathcal{H}| e^{-N\\epsilon}$$

We demand that this failure probability is at most $\\delta$:
$$|\\mathcal{H}| e^{-N\\epsilon} \\le \\delta \\iff e^{-N\\epsilon} \\le \\frac{\\delta}{|\\mathcal{H}|}$$

Taking the natural logarithm on both sides:
$$-N\\epsilon \\le \\ln \\left(\\frac{\\delta}{|\\mathcal{H}|}\\right) = -\\ln \\left(\\frac{|\\mathcal{H}|}{\\delta}\\right)$$

Multiplying by $-1$ and dividing by $\\epsilon$:
$$N \\ge \\frac{1}{\\epsilon} \\left( \\ln |\\mathcal{H}| + \\ln \\frac{1}{\\delta} \\right)$$

This is Alpaydın Equation (2.8).`,
    equationRef: '(2.8)'
  },
  {
    id: 'ex-03-01',
    chapterNum: 3,
    chapterTitle: 'Bayesian Decision Theory',
    title: 'Zero-One Loss Bayes Optimal Decision Rule',
    difficulty: 'Intermediate',
    category: 'Derivation',
    question: `Given a $K$-class classification problem with 0/1 loss defined as $\\lambda_{ij} = 0$ if $i=j$ and $\\lambda_{ij} = 1$ if $i \\ne j$, prove that minimizing the conditional expected risk $R(\\alpha_i \\mid x)$ is mathematically equivalent to choosing the class with the maximum posterior probability:
$$k^* = \\arg\\max_k P(C_k \\mid x)$$`,
    hints: [
      'Write the conditional risk $R(\\alpha_i \\mid x) = \\sum_{k=1}^K \\lambda_{ik} P(C_k \\mid x)$.',
      'Notice that $\\sum_{k=1}^K P(C_k \\mid x) = 1$.'
    ],
    solution: `The expected conditional risk of taking action $\\alpha_i$ (deciding class $C_i$) given observation $x$ is:
$$R(\\alpha_i \\mid x) = \\sum_{k=1}^K \\lambda_{ik} P(C_k \\mid x)$$

Under zero-one loss, $\\lambda_{ik} = 1 - \\delta_{ik}$ (where $\\delta_{ik}$ is the Kronecker delta):
$$R(\\alpha_i \\mid x) = \\sum_{k \\ne i} P(C_k \\mid x)$$

Since the total posterior probability sums to 1 ($\\sum_{k=1}^K P(C_k \\mid x) = 1$):
$$R(\\alpha_i \\mid x) = 1 - P(C_i \\mid x)$$

To minimize risk $R(\\alpha_i \\mid x)$, we must minimize $1 - P(C_i \\mid x)$, which is directly equivalent to maximizing $P(C_i \\mid x)$:
$$i^* = \\arg\\min_i R(\\alpha_i \\mid x) = \\arg\\max_i P(C_i \\mid x)$$

Hence, the optimal decision boundary is defined by the maximum a posteriori (MAP) classifier.`,
    equationRef: '(3.7)'
  },
  {
    id: 'ex-04-01',
    chapterNum: 4,
    chapterTitle: 'Parametric Methods',
    title: 'Maximum Likelihood for Gaussian Parameters',
    difficulty: 'Advanced',
    category: 'Derivation',
    question: `Derive the maximum likelihood estimators (MLE) for the mean $\\mu$ and variance $\\sigma^2$ of an independent and identically distributed sample $\\mathcal{X} = \\{x^t\\}_{t=1}^N$ drawn from a univariate normal distribution $\\mathcal{N}(\\mu, \\sigma^2)$. Explain why the MLE variance estimator is biased.`,
    hints: [
      'Write down the log-likelihood function $\\mathcal{L}(\\mu, \\sigma^2 \\mid \\mathcal{X})$.',
      'Take partial derivatives with respect to $\\mu$ and $\\sigma^2$ and set to zero.',
      'Compute the expected value $\\mathbb{E}[\\hat{\\sigma}_{\\text{MLE}}^2]$.'
    ],
    solution: `The likelihood for $N$ i.i.d. observations is:
$$p(\\mathcal{X} \\mid \\mu, \\sigma^2) = \\prod_{t=1}^N \\frac{1}{\\sqrt{2\\pi}\\sigma} \\exp \\left( -\\frac{(x^t - \\mu)^2}{2\\sigma^2} \\right)$$

The log-likelihood $\\mathcal{L} = \\ln p(\\mathcal{X} \\mid \\mu, \\sigma^2)$ is:
$$\\mathcal{L}(\\mu, \\sigma^2) = -\\frac{N}{2}\\ln(2\\pi) - \\frac{N}{2}\\ln(\\sigma^2) - \\frac{1}{2\\sigma^2}\\sum_{t=1}^N (x^t - \\mu)^2$$

1. Derivative with respect to $\\mu$:
$$\\frac{\\partial \\mathcal{L}}{\\partial \\mu} = \\frac{1}{\\sigma^2}\\sum_{t=1}^N (x^t - \\mu) = 0 \\implies \\hat{\\mu}_{\\text{MLE}} = \\frac{1}{N}\\sum_{t=1}^N x^t$$

2. Derivative with respect to $\\sigma^2$:
$$\\frac{\\partial \\mathcal{L}}{\\partial (\\sigma^2)} = -\\frac{N}{2\\sigma^2} + \\frac{1}{2(\\sigma^2)^2}\\sum_{t=1}^N (x^t - \\mu)^2 = 0$$
$$\\hat{\\sigma}_{\\text{MLE}}^2 = \\frac{1}{N}\\sum_{t=1}^N (x^t - \\hat{\\mu})^2$$

3. Expectation of the estimator:
Substituting $\\hat{\\mu}$, we know $\\mathbb{E}[\\sum_{t=1}^N (x^t - \\hat{\\mu})^2] = (N-1)\\sigma^2$.
Therefore:
$$\\mathbb{E}[\\hat{\\sigma}_{\\text{MLE}}^2] = \\frac{N-1}{N}\\sigma^2$$
Because $\\frac{N-1}{N} \\ne 1$, the estimator is biased and consistently underestimates true variance by a factor of $(N-1)/N$. The unbiased sample variance is $s^2 = \\frac{1}{N-1}\\sum_{t=1}^N (x^t - m)^2$.`,
    equationRef: '(4.8)'
  },
  {
    id: 'ex-06-01',
    chapterNum: 6,
    chapterTitle: 'Dimensionality Reduction',
    title: 'Principal Component Analysis Eigenvalue Formulation',
    difficulty: 'Advanced',
    category: 'Derivation',
    question: `Formulate Principal Component Analysis (PCA) as an optimization problem: maximize the variance of the projected sample $z^t = \\mathbf{w}^T \\mathbf{x}^t$ subject to the unit-norm constraint $\\mathbf{w}^T \\mathbf{w} = 1$. Show that $\\mathbf{w}$ must be an eigenvector of the sample covariance matrix $\\mathbf{\\Sigma}$.`,
    hints: [
      'Write the sample variance $\\text{Var}(z) = \\mathbf{w}^T \\mathbf{\\Sigma} \\mathbf{w}$.',
      'Use the method of Lagrange multipliers with constraint $\\mathbf{w}^T \\mathbf{w} - 1 = 0$.'
    ],
    solution: `Let $\\mathbf{x}^t$ be zero-mean centered data with covariance matrix $\\mathbf{\\Sigma} = \\frac{1}{N} \\sum_{t=1}^N \\mathbf{x}^t (\\mathbf{x}^t)^T$.
The projected scalar coordinate is $z^t = \\mathbf{w}^T \\mathbf{x}^t$.
The variance of the projected points is:
$$\\text{Var}(z) = \\frac{1}{N}\\sum_{t=1}^N (\\mathbf{w}^T \\mathbf{x}^t)^2 = \\mathbf{w}^T \\left( \\frac{1}{N}\\sum_{t=1}^N \\mathbf{x}^t (\\mathbf{x}^t)^T \\right) \\mathbf{w} = \\mathbf{w}^T \\mathbf{\\Sigma} \\mathbf{w}$$

We want to maximize $\\mathbf{w}^T \\mathbf{\\Sigma} \\mathbf{w}$ subject to $\\mathbf{w}^T \\mathbf{w} = 1$.
Form the Lagrangian with multiplier $\\alpha$:
$$\\mathcal{L}(\\mathbf{w}, \\alpha) = \\mathbf{w}^T \\mathbf{\\Sigma} \\mathbf{w} - \\alpha (\\mathbf{w}^T \\mathbf{w} - 1)$$

Taking the vector derivative with respect to $\\mathbf{w}$:
$$\\nabla_{\\mathbf{w}} \\mathcal{L} = 2\\mathbf{\\Sigma} \\mathbf{w} - 2\\alpha \\mathbf{w} = \\mathbf{0}$$
$$\\mathbf{\\Sigma} \\mathbf{w} = \\alpha \\mathbf{w}$$

This is the standard algebraic eigenvalue problem: $\\mathbf{w}$ must be an eigenvector of $\\mathbf{\\Sigma}$, and the multiplier $\\alpha$ is the corresponding eigenvalue.
Pre-multiplying by $\\mathbf{w}^T$:
$$\\mathbf{w}^T \\mathbf{\\Sigma} \\mathbf{w} = \\alpha \\mathbf{w}^T \\mathbf{w} = \\alpha$$
To maximize the variance, we select the eigenvector corresponding to the largest eigenvalue $\\lambda_1 = \\alpha_{\\max}$.`,
    equationRef: '(6.4)'
  },
  {
    id: 'ex-09-01',
    chapterNum: 9,
    chapterTitle: 'Decision Trees',
    title: 'Shannon Entropy & Information Gain Calculation',
    difficulty: 'Intermediate',
    category: 'Numerical',
    question: `A dataset at node $m$ has 16 positive examples and 4 negative examples. A candidate feature $x_j$ splits this node into:
- Left child $m_L$: 12 positive, 1 negative
- Right child $m_R$: 4 positive, 3 negative

Compute:
1. The initial entropy $\\mathcal{I}(m)$.
2. The split impurity $\\mathcal{I}'(m)$.
3. The total Information Gain $\\Delta \\mathcal{I}$.`,
    hints: [
      'Entropy formula: $\\mathcal{I}(m) = -\\sum_{i} P(C_i) \\log_2 P(C_i)$.',
      'Split impurity is the weighted average of child entropies: $\\mathcal{I}\'(m) = \\frac{N_L}{N}\\mathcal{I}(m_L) + \\frac{N_R}{N}\\mathcal{I}(m_R)$.',
      'Use $\\log_2(0.8) \\approx -0.322$, $\\log_2(0.2) \\approx -2.322$.'
    ],
    solution: `**Step 1: Initial node entropy**
$N = 16 + 4 = 20$.
$P(+) = 16/20 = 0.8$, $P(-) = 4/20 = 0.2$.
$$\\mathcal{I}(m) = -0.8 \\log_2(0.8) - 0.2 \\log_2(0.2) \\approx -0.8(-0.3219) - 0.2(-2.3219) = 0.2575 + 0.4644 = 0.7219 \\text{ bits}$$

**Step 2: Child impurities**
- Left child $m_L$: $N_L = 13$. $P(+) = 12/13 \\approx 0.923$, $P(-) = 1/13 \\approx 0.077$.
$$\\mathcal{I}(m_L) = -\\frac{12}{13}\\log_2\\left(\\frac{12}{13}\\right) - \\frac{1}{13}\\log_2\\left(\\frac{1}{13}\\right) \\approx 0.3912 \\text{ bits}$$

- Right child $m_R$: $N_R = 7$. $P(+) = 4/7 \\approx 0.571$, $P(-) = 3/7 \\approx 0.429$.
$$\\mathcal{I}(m_R) = -\\frac{4}{7}\\log_2\\left(\\frac{4}{7}\\right) - \\frac{3}{7}\\log_2\\left(\\frac{3}{7}\\right) \\approx 0.9852 \\text{ bits}$$

**Step 3: Weighted split impurity**
$$\\mathcal{I}'(m) = \\frac{13}{20}(0.3912) + \\frac{7}{20}(0.9852) = 0.2543 + 0.3448 = 0.5991 \\text{ bits}$$

**Step 4: Information Gain**
$$\\Delta \\mathcal{I} = \\mathcal{I}(m) - \\mathcal{I}'(m) = 0.7219 - 0.5991 = 0.1228 \\text{ bits}$$
The feature provides $0.1228$ bits of reduction in classification uncertainty.`,
    equationRef: '(9.3)'
  },
  {
    id: 'ex-10-01',
    chapterNum: 10,
    chapterTitle: 'Linear Discrimination',
    title: 'Cross-Entropy Loss & Logistic Sigmoid Gradient',
    difficulty: 'Advanced',
    category: 'Derivation',
    question: `For a binary linear logistic regression model where $y^t = \\text{sigmoid}(\\mathbf{w}^T \\mathbf{x}^t)$ and the loss is cross-entropy:
$$E(\\mathbf{w} \\mid \\mathcal{X}) = -\\sum_{t=1}^N \\left[ r^t \\ln y^t + (1 - r^t) \\ln (1 - y^t) \\right]$$
Prove that the gradient with respect to $\\mathbf{w}$ has the elegant error-difference form:
$$\\nabla_{\\mathbf{w}} E = -\\sum_{t=1}^N (r^t - y^t) \\mathbf{x}^t$$`,
    hints: [
      'First calculate the derivative of the sigmoid function: $\\frac{dy}{da} = y(1-y)$ where $a = \\mathbf{w}^T \\mathbf{x}$.',
      'Use the chain rule: $\\frac{\\partial E^t}{\\partial \\mathbf{w}} = \\frac{\\partial E^t}{\\partial y^t} \\frac{\\partial y^t}{\\partial a^t} \\frac{\\partial a^t}{\\partial \\mathbf{w}}$.'
    ],
    solution: `Let $a^t = \\mathbf{w}^T \\mathbf{x}^t$, and $y^t = \\sigma(a^t) = \\frac{1}{1 + e^{-a^t}}$.
1. Sigmoid derivative:
$$\\frac{\\partial y^t}{\\partial a^t} = y^t(1 - y^t)$$

2. Linear activation derivative:
$$\\frac{\\partial a^t}{\\partial \\mathbf{w}} = \\mathbf{x}^t$$

3. Cross-entropy single-sample error:
$$E^t = -\\left[ r^t \\ln y^t + (1 - r^t) \\ln(1 - y^t) \\right]$$
$$\\frac{\\partial E^t}{\\partial y^t} = -\\left[ \\frac{r^t}{y^t} - \\frac{1 - r^t}{1 - y^t} \\right] = -\\frac{r^t(1 - y^t) - (1 - r^t)y^t}{y^t(1 - y^t)} = -\\frac{r^t - y^t}{y^t(1 - y^t)}$$

4. Chain rule multiplication:
$$\\frac{\\partial E^t}{\\partial \\mathbf{w}} = \\frac{\\partial E^t}{\\partial y^t} \\cdot \\frac{\\partial y^t}{\\partial a^t} \\cdot \\frac{\\partial a^t}{\\partial \\mathbf{w}}$$
$$\\frac{\\partial E^t}{\\partial \\mathbf{w}} = \\left( -\\frac{r^t - y^t}{y^t(1 - y^t)} \\right) \\cdot \\left[ y^t(1 - y^t) \\right] \\cdot \\mathbf{x}^t = -(r^t - y^t) \\mathbf{x}^t$$

Summing over all $N$ samples:
$$\\nabla_{\\mathbf{w}} E = -\\sum_{t=1}^N (r^t - y^t) \\mathbf{x}^t$$
Notice how the sigmoid saturation derivative exactly cancels the denominator of the log-loss, preventing gradient vanishing during large errors!`,
    equationRef: '(10.23)'
  },
  {
    id: 'ex-11-01',
    chapterNum: 11,
    chapterTitle: 'Multilayer Perceptrons',
    title: 'Backpropagation Hidden Delta Derivation',
    difficulty: 'Rigorous',
    category: 'Derivation',
    question: `In a two-layer multilayer perceptron with hidden unit outputs $z_h = \\text{sigmoid}(\\mathbf{w}_h^T \\mathbf{x})$ and output unit activations $y_i = \\mathbf{v}_i^T \\mathbf{z}$, derive the weight update equation $\\Delta w_{hj}$ for the hidden layer weights under squared error loss $E = \\frac{1}{2} \\sum_i (r_i - y_i)^2$.`,
    hints: [
      'Write the hidden layer sensitivity $\\delta_h \\equiv -\\frac{\\partial E}{\\partial \\text{net}_h}$.',
      'The error propagates backwards through all output units connected to hidden unit $h$.'
    ],
    solution: `Let $\\text{net}_h = \\sum_j w_{hj} x_j$ and $z_h = \\sigma(\\text{net}_h)$.
The output activation is $y_i = \\sum_h v_{ih} z_h$.
The total error is $E = \\frac{1}{2}\\sum_i (r_i - y_i)^2$.

1. Output delta:
$$\\delta_i = -\\frac{\\partial E}{\\partial y_i} = (r_i - y_i)$$

2. Backpropagation to hidden unit $h$:
By the multivariable chain rule, the error depends on $\\text{net}_h$ via all output nodes $i$:
$$\\frac{\\partial E}{\\partial \\text{net}_h} = \\sum_i \\frac{\\partial E}{\\partial y_i} \\frac{\\partial y_i}{\\partial z_h} \\frac{\\partial z_h}{\\partial \\text{net}_h}$$
$$\\frac{\\partial y_i}{\\partial z_h} = v_{ih}, \\quad \\frac{\\partial z_h}{\\partial \\text{net}_h} = z_h(1 - z_h)$$

Hence:
$$\\frac{\\partial E}{\\partial \\text{net}_h} = -\\left[ \\sum_i (r_i - y_i) v_{ih} \\right] z_h(1 - z_h)$$

We define the hidden sensitivity $\\delta_h$:
$$\\delta_h \\equiv -\\frac{\\partial E}{\\partial \\text{net}_h} = \\left( \\sum_i \\delta_i v_{ih} \\right) z_h(1 - z_h)$$

3. Weight update rule:
$$\\Delta w_{hj} = -\\eta \\frac{\\partial E}{\\partial w_{hj}} = -\\eta \\frac{\\partial E}{\\partial \\text{net}_h} \\frac{\\partial \\text{net}_h}{\\partial w_{hj}} = \\eta \\delta_h x_j$$
This establishes the classic Alpaydın Equation (11.12).`,
    equationRef: '(11.12)'
  },
  {
    id: 'ex-13-01',
    chapterNum: 13,
    chapterTitle: 'Kernel Machines',
    title: 'Dual SVM Lagrangian & Support Vector Sparsity',
    difficulty: 'Rigorous',
    category: 'Derivation',
    question: `Starting from the primal hard-margin Support Vector Machine problem:
$$\\min_{\\mathbf{w}, w_0} \\frac{1}{2} \\|\\mathbf{w}\\|^2 \\quad \\text{s.t.} \\quad r^t (\\mathbf{w}^T \\mathbf{x}^t + w_0) \\ge 1, \\quad \\forall t=1,\\dots,N$$
Derive the Wolfe dual formulation and explain using the Karush-Kuhn-Tucker (KKT) complementary slackness conditions why non-support vectors have zero Lagrangian multipliers ($\\alpha^t = 0$).`,
    hints: [
      'Construct the primal Lagrangian $L_p(\\mathbf{w}, w_0, \\boldsymbol{\\alpha})$.',
      'Set $\\nabla_{\\mathbf{w}} L_p = 0$ and $\\frac{\\partial L_p}{\\partial w_0} = 0$ and eliminate $\\mathbf{w}$ and $w_0$.',
      'Examine the KKT condition $\\alpha^t [r^t (\\mathbf{w}^T \\mathbf{x}^t + w_0) - 1] = 0$.'
    ],
    solution: `**Step 1: Primal Lagrangian**
$$L_p(\\mathbf{w}, w_0, \\boldsymbol{\\alpha}) = \\frac{1}{2} \\mathbf{w}^T \\mathbf{w} - \\sum_{t=1}^N \\alpha^t \\left[ r^t (\\mathbf{w}^T \\mathbf{x}^t + w_0) - 1 \\right]$$
with $\\alpha^t \\ge 0$.

**Step 2: Vanishing derivatives**
$$\\nabla_{\\mathbf{w}} L_p = \\mathbf{w} - \\sum_{t=1}^N \\alpha^t r^t \\mathbf{x}^t = \\mathbf{0} \\implies \\mathbf{w} = \\sum_{t=1}^N \\alpha^t r^t \\mathbf{x}^t$$
$$\\frac{\\partial L_p}{\\partial w_0} = -\\sum_{t=1}^N \\alpha^t r^t = 0 \\implies \\sum_{t=1}^N \\alpha^t r^t = 0$$

**Step 3: Dual objective**
Substitute $\\mathbf{w}$ back into $L_p$:
$$\\frac{1}{2}\\mathbf{w}^T\\mathbf{w} = \\frac{1}{2} \\sum_{t} \\sum_{s} \\alpha^t \\alpha^s r^t r^s (\\mathbf{x}^t)^T \\mathbf{x}^s$$
$$\\sum_t \\alpha^t r^t \\mathbf{w}^T \\mathbf{x}^t = \\sum_t \\sum_s \\alpha^t \\alpha^s r^t r^s (\\mathbf{x}^t)^T \\mathbf{x}^s$$
$$w_0 \\sum_t \\alpha^t r^t = 0$$

The dual Lagrangian $L_d(\\boldsymbol{\\alpha})$ becomes:
$$L_d(\\boldsymbol{\\alpha}) = \\sum_{t=1}^N \\alpha^t - \\frac{1}{2} \\sum_{t=1}^N \\sum_{s=1}^N \\alpha^t \\alpha^s r^t r^s (\\mathbf{x}^t)^T \\mathbf{x}^s$$
subject to $\\alpha^t \\ge 0$ and $\\sum_t \\alpha^t r^t = 0$.

**Step 4: KKT Complementary Slackness**
The KKT conditions state:
$$\\alpha^t \\left[ r^t (\\mathbf{w}^T \\mathbf{x}^t + w_0) - 1 \\right] = 0, \\quad \\forall t$$
For any point strictly outside the margin:
$$r^t (\\mathbf{w}^T \\mathbf{x}^t + w_0) > 1 \\implies \\left[ r^t (\\mathbf{w}^T \\mathbf{x}^t + w_0) - 1 \\right] > 0$$
To satisfy the product equal to 0, its multiplier must strictly be $\\alpha^t = 0$.
Only the critical boundary points that lie exactly on the margin satisfy $r^t (\\mathbf{w}^T \\mathbf{x}^t + w_0) = 1$, allowing $\\alpha^t > 0$. These are the **Support Vectors**.`,
    equationRef: '(13.11)'
  },
  {
    id: 'ex-18-01',
    chapterNum: 18,
    chapterTitle: 'Reinforcement Learning',
    title: 'Bellman Optimality Backup Equation',
    difficulty: 'Advanced',
    category: 'Derivation',
    question: `Formulate the Bellman Optimality Equation for the state-action value function $Q^*(s, a)$ in a Markov Decision Process with transition probabilities $P(s' \\mid s, a)$, expected rewards $R(s, a, s')$, and discount factor $\\gamma \\in [0, 1)$. Show how the Q-learning temporal difference update rule converges to this condition.`,
    hints: [
      'Write $Q^*(s, a)$ as the immediate expected reward plus the discounted optimal value of the successor state $V^*(s\')$.',
      'Remember that $V^*(s\') = \\max_{a\'} Q^*(s\', a\')$.',
      'The TD error is the difference between the sampled Bellman target and the current estimate.'
    ],
    solution: `The state-action value $Q^*(s, a)$ represents the expected cumulative discounted reward of taking action $a$ in state $s$ and acting optimally thereafter:
$$Q^*(s, a) = \\mathbb{E} \\left[ r_{t+1} + \\gamma \\max_{a'} Q^*(s_{t+1}, a') \\Bigm| s_t = s, a_t = a \\right]$$

Expanding over transition probabilities:
$$Q^*(s, a) = \\sum_{s'} P(s' \\mid s, a) \\left[ R(s, a, s') + \\gamma \\max_{a'} Q^*(s', a') \\right]$$

In model-free reinforcement learning, transition probabilities $P(s' \\mid s, a)$ are unknown. At step $t$, the agent executes action $a_t$, receives reward $r_{t+1}$, and transitions to state $s_{t+1}$. The single-sample Bellman target is:
$$\\text{Target} = r_{t+1} + \\gamma \\max_{a'} Q(s_{t+1}, a')$$

The Temporal Difference (TD) error is:
$$\\delta_t = r_{t+1} + \\gamma \\max_{a'} Q(s_{t+1}, a') - Q(s_t, a_t)$$

The off-policy Q-learning update rule is:
$$Q(s_t, a_t) \\leftarrow Q(s_t, a_t) + \\eta \\left[ r_{t+1} + \\gamma \\max_{a'} Q(s_{t+1}, a') - Q(s_t, a_t) \\right]$$
By Robbins-Monro stochastic approximation conditions ($\\sum \\eta_t = \\infty, \\sum \\eta_t^2 < \\infty$), $Q(s, a)$ converges almost surely to $Q^*(s, a)$.`,
    equationRef: '(18.12)'
  }
];
