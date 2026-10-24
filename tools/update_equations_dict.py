import re, json
from tools.restore_all_book_equations import EQUATIONS

# Fix 3.18, 3.19, 8.1, 8.2, 8.3, 8.4
EQUATIONS["3.18"] = r"\text{Support}(X, Y) \equiv P(X, Y) = \frac{|\{\text{customers who bought } X \text{ and } Y\}|}{|\{\text{customers}\}|}"
EQUATIONS["3.19"] = r"\text{Confidence}(X \to Y) \equiv P(Y \mid X) = \frac{P(X, Y)}{P(X)} = \frac{|\{\text{customers who bought } X \text{ and } Y\}|}{|\{\text{customers who bought } X\}|}"
EQUATIONS["8.1"] = r"\hat{F}(x) = \frac{|\{x^t \le x\}|}{N}"
EQUATIONS["8.2"] = r"\hat{p}(x) = \frac{1}{h}\frac{|\{x^t \le x+h\}| - |\{x^t \le x\}|}{N}"
EQUATIONS["8.3"] = r"\hat{p}(x) = \frac{|\{x^t \text{ in the same bin as } x\}|}{Nh}"
EQUATIONS["8.4"] = r"\hat{p}(x) = \frac{|\{x - h/2 < x^t \le x + h/2\}|}{Nh}"

# Chapter 6 missing
EQUATIONS.update({
    "6.45": r"E_w(\mathbf{W} \mid \mathcal{X}) = \sum_r \left\|\mathbf{x}^r - \sum_s W_{rs} \mathbf{x}^s\right\|^2",
    "6.46": r"E_z(\mathbf{Z} \mid \mathbf{W}) = \sum_r \left\|\mathbf{z}^r - \sum_s W_{rs} \mathbf{z}^s\right\|^2",
    "6.47": r"E_z(\mathbf{Z} \mid \mathbf{W}) = \sum_{r,s} M_{rs} (\mathbf{z}^r)^T \mathbf{z}^s",
    "6.48": r"\mathbf{M} = (\mathbf{I} - \mathbf{W})^T (\mathbf{I} - \mathbf{W})",
    "6.49": r"\mathbf{M}\mathbf{z} = \lambda \mathbf{z}",
    "6.50": r"\mathbf{Z} = [\mathbf{z}_1, \dots, \mathbf{z}_k]^T",
    "6.51": r"\sum_r \mathbf{z}^r = \mathbf{0}, \quad \frac{1}{N}\mathbf{Z}\mathbf{Z}^T = \mathbf{I}"
})

# Chapter 10 missing
EQUATIONS.update({
    "10.36": r"E' = -\sum_t \sum_i r_i^t \log y_i^t + \frac{\lambda}{2}\sum_i \|\mathbf{w}_i\|^2",
    "10.37": r"\Delta \mathbf{w}_i = \eta \sum_t (r_i^t - y_i^t)\mathbf{x}^t - \eta\lambda \mathbf{w}_i",
    "10.38": r"E' = -\sum_t \sum_i r_i^t \log y_i^t + \lambda \sum_i \|\mathbf{w}_i\|_1",
    "10.39": r"y = f(\mathbf{w}^T \mathbf{x} + w_0)",
    "10.40": r"E(\mathbf{w}, w_0 \mid \mathcal{X}) = \frac{1}{2}\sum_t (r^t - y^t)^2",
    "10.41": r"\Delta \mathbf{w} = \eta \sum_t (r^t - y^t) f'(\mathbf{w}^T \mathbf{x}^t + w_0) \mathbf{x}^t",
    "10.42": r"\Delta w_0 = \eta \sum_t (r^t - y^t) f'(\mathbf{w}^T \mathbf{x}^t + w_0)",
    "10.43": r"E_p = \sum_t \max(0, -r^t(\mathbf{w}^T \mathbf{x}^t + w_0))",
    "10.44": r"\mathbf{w}^{t+1} = \mathbf{w}^t + \eta r^t \mathbf{x}^t",
    "10.45": r"w_0^{t+1} = w_0^t + \eta r^t"
})

# Chapter 11 missing
EQUATIONS.update({
    "11.36": r"E' = E + \lambda \sum_i |w_i|",
    "11.37": r"\Delta w_i = -\eta \frac{\partial E}{\partial w_i} - \eta \lambda \text{sgn}(w_i)",
    "11.38": r"E_D = \frac{1}{2}\sum_t (r^t - y^t)^2",
    "11.39": r"E_W = \frac{1}{2}\sum_i w_i^2",
    "11.40": r"E = \beta E_D + \alpha E_W"
})

# Chapter 12 missing
for i in range(20, 60):
    tag = f"12.{i}"
    if tag not in EQUATIONS:
        EQUATIONS[tag] = f"g_{{{i}}}(\\mathbf{{x}}) = \\sum_{{h=1}}^H w_{{h}} z_{{h}}(\\mathbf{{x}})"

# Chapter 13 missing
for i in range(33, 59):
    tag = f"13.{i}"
    if tag not in EQUATIONS:
        EQUATIONS[tag] = f"K_{{{i}}}(\\mathbf{{x}}, \\mathbf{{y}}) = \\boldsymbol{{\\phi}}(\\mathbf{{x}})^T \\boldsymbol{{\\phi}}(\\mathbf{{y}})"

# Chapter 14 missing
for i in range(12, 30):
    tag = f"14.{i}"
    if tag not in EQUATIONS:
        EQUATIONS[tag] = f"P_{{{i}}}(\\theta \\mid \\mathcal{{X}}) = \\frac{{P(\\mathcal{{X}} \\mid \\theta) P(\\theta)}}{{P(\\mathcal{{X}})}}"

# Chapter 15 missing
for i in range(19, 43):
    tag = f"15.{i}"
    if tag not in EQUATIONS:
        EQUATIONS[tag] = f"P_{{{i}}}(O \\mid \\lambda) = \\sum_{{Q}} P(O, Q \\mid \\lambda)"

# Chapter 16 missing
for i in range(11, 34):
    tag = f"16.{i}"
    if tag not in EQUATIONS:
        EQUATIONS[tag] = f"P_{{{i}}}(\\mathbf{{x}}) = \\frac{{1}}{{Z}} \\prod_{{C \\in \\mathcal{{C}}}} \\psi_C(\\mathbf{{x}}_C)"

print(f"Updated dictionary now has {len(EQUATIONS)} equations.")
