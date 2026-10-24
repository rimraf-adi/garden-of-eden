import json, re, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHAPTERS_DIR = ROOT / "public" / "data" / "chapters"

# Authentic mathematical equations from Ethem Alpaydin's textbook
EQUATIONS = {
    # Chapter 2
    "2.1": r"\mathbf{x} = \begin{bmatrix} x_1 \\ x_2 \end{bmatrix}",
    "2.2": r"r = \begin{cases} 1 & \text{if } \mathbf{x} \text{ is a positive example} \\ 0 & \text{if } \mathbf{x} \text{ is a negative example} \end{cases}",
    "2.3": r"\mathcal{X} = \{ (\mathbf{x}^t, r^t) \}_{t=1}^N",
    "2.4": r"(p_1 \le \text{price} \le p_2) \wedge (e_1 \le \text{engine power} \le e_2)",
    "2.5": r"h(\mathbf{x}) = \begin{cases} 1 & \text{if } h \text{ classifies } \mathbf{x} \text{ as positive} \\ 0 & \text{if } h \text{ classifies } \mathbf{x} \text{ as negative} \end{cases}",
    "2.6": r"E(h \mid \mathcal{X}) = \sum_{t=1}^N 1(h(\mathbf{x}^t) \neq r^t)",
    "2.7": r"N \ge \frac{4}{\epsilon} \log \frac{4}{\delta}",
    "2.8": r"r_i^t = \begin{cases} 1 & \text{if } \mathbf{x}^t \in C_i \\ 0 & \text{if } \mathbf{x}^t \in C_j, j \neq i \end{cases}",
    "2.9": r"h_i(\mathbf{x}^t) = \begin{cases} 1 & \text{if } \mathbf{x}^t \in C_i \\ 0 & \text{if } \mathbf{x}^t \in C_j, j \neq i \end{cases}",
    "2.10": r"E(\{h_i\}_{i=1}^K \mid \mathcal{X}) = \sum_{t=1}^N \sum_{i=1}^K 1(h_i(\mathbf{x}^t) \neq r_i^t)",
    "2.11": r"r^t = f(\mathbf{x}^t) + \epsilon",
    "2.12": r"r^t = f^*(\mathbf{x}^t, \mathbf{z}^t)",
    "2.13": r"E(g \mid \mathcal{X}) = \frac{1}{N} \sum_{t=1}^N [r^t - g(\mathbf{x}^t)]^2",
    "2.14": r"g(\mathbf{x}) = w_1 x_1 + \dots + w_d x_d + w_0 = \sum_{j=1}^d w_j x_j + w_0",
    "2.15": r"g(x) = w_1 x + w_0",
    "2.16": r"E(w_1, w_0 \mid \mathcal{X}) = \frac{1}{N} \sum_{t=1}^N [r^t - (w_1 x^t + w_0)]^2",
    "2.17": r"w_1 = \frac{\sum_t x^t r^t - \bar{x}\bar{r}N}{\sum_t (x^t)^2 - N\bar{x}^2}, \quad w_0 = \bar{r} - w_1 \bar{x}",
    "2.18": r"g(x) = w_2 x^2 + w_1 x + w_0",
    "2.19": r"\mathcal{X} = \{ (\mathbf{x}^t, r^t) \}_{t=1}^N",
    "2.20": r"E(\theta \mid \mathcal{X}) = \sum_t L(r^t, g(\mathbf{x}^t \mid \theta))",
    "2.21": r"\theta^* = \arg\min_\theta E(\theta \mid \mathcal{X})",

    # Chapter 3
    "3.1": r"\text{Choose } \begin{cases} C = 1 & \text{if } P(C=1 \mid x_1, x_2) > P(C=0 \mid x_1, x_2) \\ C = 0 & \text{otherwise} \end{cases}",
    "3.2": r"P(C \mid \mathbf{x}) = \frac{P(C)p(\mathbf{x} \mid C)}{p(\mathbf{x})}",
    "3.3": r"p(\mathbf{x}) = \sum_C p(\mathbf{x}, C) = p(\mathbf{x} \mid C=1)P(C=1) + p(\mathbf{x} \mid C=0)P(C=0)",
    "3.4": r"P(C_i) \ge 0 \quad \text{and} \quad \sum_{i=1}^K P(C_i) = 1",
    "3.5": r"P(C_i \mid \mathbf{x}) = \frac{p(\mathbf{x} \mid C_i)P(C_i)}{p(\mathbf{x})} = \frac{p(\mathbf{x} \mid C_i)P(C_i)}{\sum_{k=1}^K p(\mathbf{x} \mid C_k)P(C_k)}",
    "3.6": r"\text{Choose } C_i \text{ if } P(C_i \mid \mathbf{x}) = \max_k P(C_k \mid \mathbf{x})",
    "3.7": r"R(\alpha_i \mid \mathbf{x}) = \sum_{k=1}^K \lambda_{ik} P(C_k \mid \mathbf{x})",
    "3.8": r"\text{Choose } \alpha_i \text{ if } R(\alpha_i \mid \mathbf{x}) = \min_k R(\alpha_k \mid \mathbf{x})",
    "3.9": r"\lambda_{ik} = \begin{cases} 0 & \text{if } i = k \\ 1 & \text{if } i \neq k \end{cases}",
    "3.10": r"\lambda_{ik} = \begin{cases} 0 & \text{if } i = k \\ \lambda & \text{if } i = K + 1 \\ 1 & \text{otherwise} \end{cases}",
    "3.11": r"R(\alpha_{K+1} \mid \mathbf{x}) = \sum_{k=1}^K \lambda P(C_k \mid \mathbf{x}) = \lambda",
    "3.12": r"R(\alpha_i \mid \mathbf{x}) = \sum_{k \neq i} P(C_k \mid \mathbf{x}) = 1 - P(C_i \mid \mathbf{x})",
    "3.13": r"\text{Choose } C_i \text{ if } R(\alpha_i \mid \mathbf{x}) < R(\alpha_k \mid \mathbf{x}), \forall k \neq i \text{ and } R(\alpha_i \mid \mathbf{x}) < R(\alpha_{K+1} \mid \mathbf{x}); \quad \text{Reject if } R(\alpha_{K+1} \mid \mathbf{x}) < R(\alpha_i \mid \mathbf{x})",
    "3.14": r"\text{Choose } C_i \text{ if } P(C_i \mid \mathbf{x}) > P(C_k \mid \mathbf{x}), \forall k \neq i \text{ and } P(C_i \mid \mathbf{x}) > 1 - \lambda; \quad \text{Reject otherwise}",
    "3.15": r"\text{Choose } C_i \text{ if } g_i(\mathbf{x}) = \max_k g_k(\mathbf{x})",
    "3.16": r"EU(\alpha_i \mid \mathbf{x}) = \sum_k U_{ik} P(S_k \mid \mathbf{x})",
    "3.17": r"\text{Choose } \alpha_i \text{ if } EU(\alpha_i \mid \mathbf{x}) = \max_j EU(\alpha_j \mid \mathbf{x})",
    "3.18": r"\text{Support}(X, Y) \equiv P(X, Y) = \frac{\#\{\text{customers who bought } X \text{ and } Y\}}{\#\{\text{customers}\}}",
    "3.19": r"\text{Confidence}(X \to Y) \equiv P(Y \mid X) = \frac{P(X, Y)}{P(X)} = \frac{\#\{\text{customers who bought } X \text{ and } Y\}}{\#\{\text{customers who bought } X\}}",
    "3.20": r"\text{Lift}(X \to Y) = \frac{P(X, Y)}{P(X)P(Y)} = \frac{P(Y \mid X)}{P(Y)}",

    # Chapter 4
    "4.1": r"l(\theta \mid \mathcal{X}) \equiv p(\mathcal{X} \mid \theta) = \prod_{t=1}^N p(x^t \mid \theta)",
    "4.2": r"\mathcal{L}(\theta \mid \mathcal{X}) \equiv \log l(\theta \mid \mathcal{X}) = \sum_{t=1}^N \log p(x^t \mid \theta)",
    "4.3": r"P(x) = p^x (1 - p)^{1-x}, \quad x \in \{0, 1\}",
    "4.4": r"\hat{p} = \frac{\sum_t x^t}{N}",
    "4.5": r"P(x_1, x_2, \dots, x_K) = \prod_{i=1}^K p_i^{x_i}",
    "4.6": r"\hat{p}_i = \frac{\sum_t x_i^t}{N}",
    "4.7": r"p(x) = \frac{1}{\sqrt{2\pi}\sigma} \exp\left[-\frac{(x - \mu)^2}{2\sigma^2}\right], \quad -\infty < x < \infty",
    "4.8": r"m = \frac{\sum_t x^t}{N}, \quad s^2 = \frac{\sum_t (x^t - m)^2}{N}",
    "4.9": r"r(d, \theta) = E[(d(\mathcal{X}) - \theta)^2]",
    "4.10": r"b_\theta(d) = E[d(\mathcal{X})] - \theta",
    "4.11": r"r(d, \theta) = \underbrace{E[(d - E[d])^2]}_{\text{variance}} + \underbrace{(E[d] - \theta)^2}_{\text{bias}^2}",
    "4.12": r"r(d, \theta) = \text{Var}(d) + (b_\theta(d))^2",
    "4.13": r"p(\theta \mid \mathcal{X}) = \frac{p(\mathcal{X} \mid \theta)p(\theta)}{p(\mathcal{X})} = \frac{p(\mathcal{X} \mid \theta)p(\theta)}{\int p(\mathcal{X} \mid \theta')p(\theta') d\theta'}",
    "4.14": r"\theta_{\text{MAP}} = \arg\max_\theta p(\theta \mid \mathcal{X})",
    "4.15": r"\theta_{\text{ML}} = \arg\max_\theta p(\mathcal{X} \mid \theta)",
    "4.16": r"\theta_{\text{Bayes}} = E[\theta \mid \mathcal{X}] = \int \theta p(\theta \mid \mathcal{X}) d\theta",
    "4.17": r"E[(\theta - c)^2] = E[(\theta - \mu)^2] + (\mu - c)^2",
    "4.18": r"E[\theta \mid \mathcal{X}] = \frac{N/\sigma^2}{N/\sigma^2 + 1/\sigma_0^2} m + \frac{1/\sigma_0^2}{N/\sigma^2 + 1/\sigma_0^2} \mu_0",
    "4.19": r"P(C_i \mid x) = \frac{p(x \mid C_i)P(C_i)}{p(x)} = \frac{p(x \mid C_i)P(C_i)}{\sum_{k=1}^K p(x \mid C_k)P(C_k)}",
    "4.20": r"g_i(x) = \log p(x \mid C_i) + \log P(C_i)",
    "4.21": r"p(x \mid C_i) = \frac{1}{\sqrt{2\pi}\sigma_i} \exp\left[-\frac{(x - \mu_i)^2}{2\sigma_i^2}\right]",
    "4.22": r"g_i(x) = -\frac{1}{2}\log 2\pi - \log \sigma_i - \frac{(x - \mu_i)^2}{2\sigma_i^2} + \log P(C_i)",
    "4.23": r"\mathcal{X} = \{ (\mathbf{x}^t, r^t) \}_{t=1}^N",
    "4.24": r"r_i^t = \begin{cases} 1 & \text{if } \mathbf{x}^t \in C_i \\ 0 & \text{if } \mathbf{x}^t \in C_k, k \neq i \end{cases}",
    "4.25": r"m_i = \frac{\sum_t x^t r_i^t}{\sum_t r_i^t}",
    "4.26": r"s_i^2 = \frac{\sum_t (x^t - m_i)^2 r_i^t}{\sum_t r_i^t}",
    "4.27": r"\hat{P}(C_i) = \frac{\sum_t r_i^t}{N}",
    "4.28": r"g_i(x) = -\frac{1}{2}\log 2\pi - \log s_i - \frac{(x - m_i)^2}{2s_i^2} + \log \hat{P}(C_i)",
    "4.29": r"g_i(x) = -(x - m_i)^2",
    "4.30": r"p(r \mid x) \sim \mathcal{N}(g(x \mid \theta), \sigma^2)",
    "4.31": r"\mathcal{L}(\theta \mid \mathcal{X}) = -N \log(\sqrt{2\pi}\sigma) - \frac{1}{2\sigma^2} \sum_{t=1}^N [r^t - g(x^t \mid \theta)]^2",
    "4.32": r"E(\theta \mid \mathcal{X}) = \frac{1}{2} \sum_{t=1}^N [r^t - g(x^t \mid \theta)]^2",
    "4.33": r"\mathbf{w} = (\mathbf{D}^T \mathbf{D})^{-1} \mathbf{D}^T \mathbf{r}",
    "4.34": r"E_{\text{RSE}} = \frac{\sum_t [r^t - g(x^t \mid \theta)]^2}{\sum_t (r^t - \bar{r})^2}",
    "4.35": r"E[(r - g(x))^2 \mid x] = \underbrace{E[(r - E[r \mid x])^2 \mid x]}_{\text{noise}} + \underbrace{(E[r \mid x] - g(x))^2}_{\text{squared error}}",
    "4.36": r"E_{\mathcal{X}}[(E[r \mid x] - g(x))^2 \mid x] = \underbrace{(E[r \mid x] - E_{\mathcal{X}}[g(x)])^2}_{\text{bias}^2} + \underbrace{E_{\mathcal{X}}[(g(x) - E_{\mathcal{X}}[g(x)])^2]}_{\text{variance}}",
    "4.37": r"E' = \text{error on data} + \lambda \cdot \text{model complexity}",
    "4.38": r"p(\text{model} \mid \text{data}) = \frac{p(\text{data} \mid \text{model})p(\text{model})}{p(\text{data})}",
    "4.39": r"\log p(\text{model} \mid \text{data}) = \log p(\text{data} \mid \text{model}) + \log p(\text{model}) - c",
    "4.40": r"E = \sum_t [r^t - g(x^t \mid \mathbf{w})]^2 + \lambda \sum_i w_i^2",

    # Chapter 5
    "5.1": r"E[\mathbf{x}] = \boldsymbol{\mu} = [\mu_1, \dots, \mu_d]^T",
    "5.2": r"\sigma_{ij} \equiv \text{Cov}(X_i, X_j) = E[(X_i - \mu_i)(X_j - \mu_j)] = E[X_i X_j] - \mu_i \mu_j",
    "5.3": r"\boldsymbol{\Sigma} \equiv \text{Cov}(\mathbf{X}) = E[(\mathbf{X} - \boldsymbol{\mu})(\mathbf{X} - \boldsymbol{\mu})^T] = E[\mathbf{X}\mathbf{X}^T] - \boldsymbol{\mu}\boldsymbol{\mu}^T",
    "5.4": r"\text{Corr}(X_i, X_j) \equiv \rho_{ij} = \frac{\sigma_{ij}}{\sigma_i \sigma_j}",
    "5.5": r"\mathbf{m} = \frac{\sum_{t=1}^N \mathbf{x}^t}{N}, \quad m_i = \frac{\sum_{t=1}^N x_i^t}{N}, \quad i = 1, \dots, d",
    "5.6": r"s_i^2 = \frac{\sum_{t=1}^N (x_i^t - m_i)^2}{N}",
    "5.7": r"s_{ij} = \frac{\sum_{t=1}^N (x_i^t - m_i)(x_j^t - m_j)}{N}",
    "5.8": r"r_{ij} = \frac{s_{ij}}{s_i s_j}",
    "5.9": r"p(\mathbf{x}) = \frac{1}{(2\pi)^{d/2}|\boldsymbol{\Sigma}|^{1/2}} \exp\left[ -\frac{1}{2}(\mathbf{x} - \boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x} - \boldsymbol{\mu}) \right]",
    "5.10": r"D_{\text{Mahalanobis}}^2 = (\mathbf{x} - \boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x} - \boldsymbol{\mu})",
    "5.11": r"p(x_1, x_2) = \frac{1}{2\pi\sigma_1\sigma_2\sqrt{1-\rho^2}} \exp\left[ -\frac{1}{2(1-\rho^2)} (z_1^2 - 2\rho z_1 z_2 + z_2^2) \right]",
    "5.12": r"p(\mathbf{x}) = \prod_{i=1}^d p_i(x_i) = \frac{1}{(2\pi)^{d/2}\prod_{i=1}^d \sigma_i} \exp\left[ -\frac{1}{2}\sum_{i=1}^d \left(\frac{x_i - \mu_i}{\sigma_i}\right)^2 \right]",
    "5.13": r"E[\mathbf{w}^T \mathbf{x}] = \mathbf{w}^T E[\mathbf{x}] = \mathbf{w}^T \boldsymbol{\mu}",
    "5.14": r"\text{Var}(\mathbf{w}^T \mathbf{x}) = \mathbf{w}^T \boldsymbol{\Sigma} \mathbf{w}",
    "5.15": r"\mathbf{W}^T \mathbf{x} \sim \mathcal{N}_k(\mathbf{W}^T \boldsymbol{\mu}, \mathbf{W}^T \boldsymbol{\Sigma} \mathbf{W})",
    "5.16": r"p(\mathbf{x} \mid C_i) = \frac{1}{(2\pi)^{d/2}|\boldsymbol{\Sigma}_i|^{1/2}} \exp\left[ -\frac{1}{2}(\mathbf{x} - \boldsymbol{\mu}_i)^T \boldsymbol{\Sigma}_i^{-1} (\mathbf{x} - \boldsymbol{\mu}_i) \right]",
    "5.17": r"g_i(\mathbf{x}) = -\frac{d}{2}\log 2\pi - \frac{1}{2}\log |\boldsymbol{\Sigma}_i| - \frac{1}{2}(\mathbf{x} - \boldsymbol{\mu}_i)^T \boldsymbol{\Sigma}_i^{-1} (\mathbf{x} - \boldsymbol{\mu}_i) + \log P(C_i)",
    "5.18": r"\hat{P}(C_i) = \frac{\sum_t r_i^t}{N}, \quad \mathbf{m}_i = \frac{\sum_t r_i^t \mathbf{x}^t}{\sum_t r_i^t}, \quad \mathbf{S}_i = \frac{\sum_t r_i^t (\mathbf{x}^t - \mathbf{m}_i)(\mathbf{x}^t - \mathbf{m}_i)^T}{\sum_t r_i^t}",
    "5.19": r"g_i(\mathbf{x}) = -\frac{1}{2}\log |\mathbf{S}_i| - \frac{1}{2}(\mathbf{x} - \mathbf{m}_i)^T \mathbf{S}_i^{-1} (\mathbf{x} - \mathbf{m}_i) + \log \hat{P}(C_i)",
    "5.20": r"g_i(\mathbf{x}) = \mathbf{x}^T \mathbf{W}_i \mathbf{x} + \mathbf{w}_i^T \mathbf{x} + w_{i0}",
    "5.21": r"\mathbf{S} = \sum_i \hat{P}(C_i)\mathbf{S}_i",
    "5.22": r"g_i(\mathbf{x}) = -\frac{1}{2}(\mathbf{x} - \mathbf{m}_i)^T \mathbf{S}^{-1} (\mathbf{x} - \mathbf{m}_i) + \log \hat{P}(C_i)",
    "5.23": r"g_i(\mathbf{x}) = \mathbf{w}_i^T \mathbf{x} + w_{i0}, \quad \mathbf{w}_i = \mathbf{S}^{-1}\mathbf{m}_i, \quad w_{i0} = -\frac{1}{2}\mathbf{m}_i^T \mathbf{S}^{-1}\mathbf{m}_i + \log \hat{P}(C_i)",
    "5.24": r"g_i(\mathbf{x}) = -\frac{1}{2}\sum_{j=1}^d \left(\frac{x_j^t - m_{ij}}{s_j}\right)^2 + \log \hat{P}(C_i)",
    "5.25": r"g_i(\mathbf{x}) = -\frac{\|\mathbf{x} - \mathbf{m}_i\|^2}{2s^2} + \log \hat{P}(C_i)",
    "5.26": r"g_i(\mathbf{x}) = -\|\mathbf{x} - \mathbf{m}_i\|^2 = -(\mathbf{x} - \mathbf{m}_i)^T (\mathbf{x} - \mathbf{m}_i)",
    "5.27": r"g_i(\mathbf{x}) = \mathbf{w}_i^T \mathbf{x} + w_{i0}, \quad \mathbf{w}_i = \mathbf{m}_i, \quad w_{i0} = -\frac{1}{2}\|\mathbf{m}_i\|^2",
    "5.28": r"g_i(\mathbf{x}) = \mathbf{m}_i^T \mathbf{x}",
    "5.29": r"\mathbf{S}_i' = \alpha \sigma^2 \mathbf{I} + \beta \mathbf{S} + (1 - \alpha - \beta)\mathbf{S}_i",
    "5.30": r"g_i(\mathbf{x}) = \sum_j [x_j \log p_{ij} + (1 - x_j)\log(1 - p_{ij})] + \log P(C_i)",
    "5.31": r"\hat{p}_{ij} = \frac{\sum_t x_j^t r_i^t}{\sum_t r_i^t}",
    "5.32": r"p(\mathbf{x} \mid C_i) = \prod_{j=1}^d \prod_{k=1}^{n_j} p_{ijk}^{z_{jk}}",
    "5.33": r"g_i(\mathbf{x}) = \sum_j \sum_k z_{jk} \log p_{ijk} + \log P(C_i)",
    "5.34": r"\hat{p}_{ijk} = \frac{\sum_t z_{jk}^t r_i^t}{\sum_t r_i^t}",
    "5.35": r"r^t = g(\mathbf{x}^t \mid w_0, w_1, \dots, w_d) + \epsilon = w_0 + w_1 x_1^t + \dots + w_d x_d^t + \epsilon",
    "5.36": r"E(w_0, w_1, \dots, w_d \mid \mathcal{X}) = \frac{1}{2}\sum_t (r^t - w_0 - w_1 x_1^t - \dots - w_d x_d^t)^2",
    "5.37": r"\sum_t r^t = N w_0 + w_1 \sum_t x_1^t + \dots + w_d \sum_t x_d^t",
    "5.38": r"\mathbf{X}^T \mathbf{X} \mathbf{w} = \mathbf{X}^T \mathbf{r}",
    "5.39": r"\mathbf{w} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{r}",

    # Chapter 6
    "6.5": r"z = \mathbf{w}^T \mathbf{x}",
    "6.6": r"\max_{\mathbf{w}_1} \mathbf{w}_1^T \boldsymbol{\Sigma} \mathbf{w}_1 - \alpha (\mathbf{w}_1^T \mathbf{w}_1 - 1)",
    "6.7": r"\max_{\mathbf{w}_2} \mathbf{w}_2^T \boldsymbol{\Sigma} \mathbf{w}_2 - \alpha (\mathbf{w}_2^T \mathbf{w}_2 - 1) - \beta (\mathbf{w}_2^T \mathbf{w}_1 - 0)",
    "6.9": r"\mathbf{z} = \mathbf{W}^T (\mathbf{x} - \mathbf{m})",
    "6.10": r"\mathbf{S} = \mathbf{C} \mathbf{D} \mathbf{C}^T",
    "6.11": r"\mathbf{C}^T \mathbf{S} \mathbf{C} = \mathbf{D}",
    "6.12": r"\sum_t \|\hat{\mathbf{x}}^t - \mathbf{x}\|^2",
    "6.13": r"x_i - \mu_i = \sum_{j=1}^k v_{ij} z_j + \epsilon_i",
    "6.14": r"\mathbf{x} - \boldsymbol{\mu} = \mathbf{V}\mathbf{z} + \boldsymbol{\epsilon}",
    "6.15": r"\text{Var}(x_i) = v_{i1}^2 + v_{i2}^2 + \dots + v_{ik}^2 + \psi_i",
    "6.17": r"\boldsymbol{\Sigma} = \mathbf{V}\mathbf{V}^T + \boldsymbol{\Psi}",
    "6.18": r"\mathbf{V} = \mathbf{C} \mathbf{D}^{1/2}",
    "6.19": r"\psi_i = s_i^2 - \sum_{j=1}^k v_{ij}^2",
    "6.20": r"z_j = \sum_{i=1}^d w_{ji} x_i + \epsilon_i",
    "6.21": r"\mathbf{Z} = \mathbf{X}\mathbf{W} + \mathbf{\Xi}",
    "6.22": r"\mathbf{W} = \mathbf{S}^{-1}\mathbf{V}",
    "6.23": r"\mathbf{Z} = \mathbf{X}\mathbf{W} = \mathbf{X}\mathbf{S}^{-1}\mathbf{V}",
    "6.28": r"\mathbf{z} = g(\mathbf{x} \mid \mathbf{W}) = \mathbf{W}^T \mathbf{x}",
    "6.29": r"E(\theta \mid \mathcal{X}) = \sum_{r,s} \frac{(\|g(\mathbf{x}^r \mid \theta) - g(\mathbf{x}^s \mid \theta)\| - \|\mathbf{x}^r - \mathbf{x}^s\|)^2}{\|\mathbf{x}^r - \mathbf{x}^s\|^2}",
    "6.30": r"z = \mathbf{w}^T \mathbf{x}",
    "6.33": r"J(\mathbf{w}) = \frac{(m_1 - m_2)^2}{s_1^2 + s_2^2}",
    "6.37": r"J(\mathbf{w}) = \frac{\mathbf{w}^T \mathbf{S}_B \mathbf{w}}{\mathbf{w}^T \mathbf{S}_W \mathbf{w}} = \frac{|\mathbf{w}^T (\mathbf{m}_1 - \mathbf{m}_2)|^2}{\mathbf{w}^T \mathbf{S}_W \mathbf{w}}",
    "6.38": r"\mathbf{w} = c \mathbf{S}_W^{-1} (\mathbf{m}_1 - \mathbf{m}_2)",
    "6.39": r"\mathbf{z} = \mathbf{W}^T \mathbf{x}",
    "6.44": r"J(\mathbf{W}) = \frac{|\mathbf{W}^T \mathbf{S}_B \mathbf{W}|}{|\mathbf{W}^T \mathbf{S}_W \mathbf{W}|}",

    # Chapter 7
    "7.1": r"p(\mathbf{x}) = \sum_{i=1}^k p(\mathbf{x} \mid G_i) P(G_i)",
    "7.2": r"\hat{P}(C_i) = \frac{\sum_t r_i^t}{N}, \quad \mathbf{m}_i = \frac{\sum_t r_i^t \mathbf{x}^t}{\sum_t r_i^t}, \quad \mathbf{S}_i = \frac{\sum_t r_i^t (\mathbf{x}^t - \mathbf{m}_i)(\mathbf{x}^t - \mathbf{m}_i)^T}{\sum_t r_i^t}",
    "7.3": r"E(\{\mathbf{m}_i\}_{i=1}^k \mid \mathcal{X}) = \sum_t \sum_i b_i^t \|\mathbf{x}^t - \mathbf{m}_i\|^2",
    "7.4": r"b_i^t = \begin{cases} 1 & \text{if } \|\mathbf{x}^t - \mathbf{m}_i\| = \min_j \|\mathbf{x}^t - \mathbf{m}_j\| \\ 0 & \text{otherwise} \end{cases}",
    "7.5": r"\mathbf{m}_i = \frac{\sum_t b_i^t \mathbf{x}^t}{\sum_t b_i^t}",
    "7.6": r"\mathcal{L}(\Phi \mid \mathcal{X}) = \sum_t \log \sum_{i=1}^k p(\mathbf{x}^t \mid G_i) P(G_i)",
    "7.9": r"h_i^t \equiv P(G_i \mid \mathbf{x}^t, \Phi^l) = \frac{p(\mathbf{x}^t \mid G_i, \Phi^l) P(G_i)}{\sum_j p(\mathbf{x}^t \mid G_j, \Phi^l) P(G_j)}",
    "7.11": r"\pi_i = \frac{\sum_t h_i^t}{N}",
    "7.13": r"\mathbf{m}_i^{l+1} = \frac{\sum_t h_i^t \mathbf{x}^t}{\sum_t h_i^t}, \quad \mathbf{S}_i^{l+1} = \frac{\sum_t h_i^t (\mathbf{x}^t - \mathbf{m}_i^{l+1})(\mathbf{x}^t - \mathbf{m}_i^{l+1})^T}{\sum_t h_i^t}",
    "7.14": r"h_i^t = \frac{\pi_i |\mathbf{S}_i|^{-1/2} \exp\left[-\frac{1}{2}(\mathbf{x}^t - \mathbf{m}_i)^T \mathbf{S}_i^{-1} (\mathbf{x}^t - \mathbf{m}_i)\right]}{\sum_j \pi_j |\mathbf{S}_j|^{-1/2} \exp\left[-\frac{1}{2}(\mathbf{x}^t - \mathbf{m}_j)^T \mathbf{S}_j^{-1} (\mathbf{x}^t - \mathbf{m}_j)\right]}",
    "7.17": r"h_i^t = \frac{\exp\left[-\frac{1}{2s^2}\|\mathbf{x}^t - \mathbf{m}_i\|^2\right]}{\sum_j \exp\left[-\frac{1}{2s^2}\|\mathbf{x}^t - \mathbf{m}_j\|^2\right]}",

    # Chapter 9
    "9.1": r"f_m(\mathbf{x}) : x_j > w_{m0}",
    "9.2": r"\hat{P}(C_i \mid \mathbf{x}, m) \equiv p_m^i = \frac{N_m^i}{N_m}",
    "9.3": r"\mathcal{I}_m = -\sum_{i=1}^K p_m^i \log_2 p_m^i",
    "9.4": r"\phi(p, 1 - p) = -p \log_2 p - (1 - p)\log_2(1 - p)",
    "9.5": r"\phi(p, 1 - p) = 2p(1 - p) \quad \text{(Gini index)}",
    "9.6": r"\phi(p, 1 - p) = 1 - \max(p, 1 - p) \quad \text{(Misclassification error)}",
    "9.8": r"\mathcal{I}_m' = -\sum_{j=1}^n \frac{N_{mj}}{N_m} \sum_{i=1}^K p_{mj}^i \log_2 p_{mj}^i",
    "9.10": r"E_m = \frac{1}{N_m}\sum_t (r^t - g_m)^2 b_m(\mathbf{x}^t)",
    "9.11": r"g_m = \frac{\sum_t b_m(\mathbf{x}^t) r^t}{\sum_t b_m(\mathbf{x}^t)}",
    "9.14": r"E_m' = \frac{1}{N_m}\sum_j \sum_t (r^t - g_{mj})^2 b_{mj}(\mathbf{x}^t)",
    "9.17": r"\text{Gain}(R', R) = s \cdot \left(\log_2 \frac{N_+'}{N'} - \log_2 \frac{N_+}{N}\right)",
    "9.18": r"\text{rvm}(R) = \frac{p - n}{p + n}",
    "9.19": r"f_m(\mathbf{x}) : \mathbf{w}_m^T \mathbf{x} + w_{m0} > 0",

    # Chapter 10
    "10.1": r"g_i(\mathbf{x} \mid \mathbf{w}_i, w_{i0}) = \mathbf{w}_i^T \mathbf{x} + w_{i0} = \sum_{j=1}^d w_{ij} x_j + w_{i0}",
    "10.4": r"r = \frac{g(\mathbf{x})}{\|\mathbf{w}\|}",
    "10.5": r"r_0 = \frac{w_0}{\|\mathbf{w}\|}",
    "10.8": r"\text{Choose } C_i \text{ if } g_i(\mathbf{x}) = \max_{j=1}^K g_j(\mathbf{x})",
    "10.15": r"P(C_1 \mid \mathbf{x}) = \text{sigmoid}(\mathbf{w}^T \mathbf{x} + w_0) = \frac{1}{1 + \exp[-(\mathbf{w}^T \mathbf{x} + w_0)]}",
    "10.16": r"\Delta w_j = -\eta \frac{\partial E}{\partial w_j}, \quad \forall j",
    "10.17": r"w_j = w_j + \Delta w_j",
    "10.21": r"y = \hat{P}(C_1 \mid \mathbf{x}) = \frac{1}{1 + \exp[-(\mathbf{w}^T \mathbf{x} + w_0)]}",
    "10.23": r"E(\mathbf{w}, w_0 \mid \mathcal{X}) = -\sum_t r^t \log y^t + (1 - r^t)\log(1 - y^t)",
    "10.24": r"\Delta w_j = \eta \sum_t (r^t - y^t)x_j^t, \quad \Delta w_0 = \eta \sum_t (r^t - y^t)",
    "10.29": r"y_i = \hat{P}(C_i \mid \mathbf{x}) = \frac{\exp[\mathbf{w}_i^T \mathbf{x} + w_{i0}]}{\sum_{j=1}^K \exp[\mathbf{w}_j^T \mathbf{x} + w_{j0}]}, \quad i = 1, \dots, K",
    "10.31": r"E(\{\mathbf{w}_i, w_{i0}\}_i \mid \mathcal{X}) = -\sum_t \sum_i r_i^t \log y_i^t",
    "10.33": r"\Delta \mathbf{w}_j = \eta \sum_t (r_j^t - y_j^t)\mathbf{x}^t, \quad \Delta w_{j0} = \eta \sum_t (r_j^t - y_j^t)",

    # Chapter 11
    "11.1": r"y = \sum_{j=1}^d w_j x_j + w_0",
    "11.2": r"y = \mathbf{w}^T \mathbf{x}",
    "11.4": r"o = \mathbf{w}^T \mathbf{x}, \quad y = \text{sigmoid}(o) = \frac{1}{1 + \exp[-\mathbf{w}^T \mathbf{x}]}",
    "11.5": r"y_i = \sum_{j=1}^d w_{ij} x_j + w_{i0} = \mathbf{w}_i^T \mathbf{x}, \quad \mathbf{y} = \mathbf{W}\mathbf{x}",
    "11.7": r"\Delta w_j^t = \eta (r^t - y^t)x_j^t",
    "11.8": r"\Delta w_j^t = \eta (r^t - y^t)x_j^t",
    "11.9": r"\Delta w_{ij}^t = \eta (r_i^t - y_i^t)x_j^t",
    "11.10": r"\text{Update} = \text{LearningFactor} \cdot (\text{DesiredOutput} - \text{ActualOutput}) \cdot \text{Input}",
    "11.11": r"z_h = \text{sigmoid}(\mathbf{w}_h^T \mathbf{x}) = \frac{1}{1 + \exp\left[ -\left(\sum_{j=1}^d w_{hj} x_j + w_{h0}\right) \right]}, \quad h = 1, \dots, H",
    "11.12": r"y_i = \mathbf{v}_i^T \mathbf{z} = \sum_{h=1}^H v_{ih} z_h + v_{i0}",
    "11.14": r"E(\mathbf{W}, \mathbf{v} \mid \mathcal{X}) = \frac{1}{2}\sum_t (r^t - y^t)^2",
    "11.15": r"\Delta v_h = \eta \sum_t (r^t - y^t)z_h^t",
    "11.16": r"\Delta w_{hj} = \eta \sum_t (r^t - y^t)v_h z_h^t (1 - z_h^t)x_j^t",
    "11.20": r"\Delta w_{hj} = \eta \sum_t \left[\sum_i (r_i^t - y_i^t)v_{ih}\right] z_h^t(1 - z_h^t)x_j^t",
    "11.26": r"y_i^t = \frac{\exp o_i^t}{\sum_k \exp o_k^t}",
    "11.30": r"\Delta w_i^t = -\eta \frac{\partial E^t}{\partial w_i} + \alpha \Delta w_i^{t-1}",
    "11.32": r"\Delta w_i = -\eta \frac{\partial E}{\partial w_i} - \lambda w_i",
    "11.33": r"E' = E + \frac{\lambda}{2}\sum_i w_i^2",

    # Chapter 13
    "13.1": r"r^t (\mathbf{w}^T \mathbf{x}^t + w_0) \ge +1",
    "13.2": r"\frac{r^t (\mathbf{w}^T \mathbf{x}^t + w_0)}{\|\mathbf{w}\|} \ge \rho, \quad \forall t",
    "13.3": r"\min \frac{1}{2}\|\mathbf{w}\|^2 \quad \text{subject to } r^t (\mathbf{w}^T \mathbf{x}^t + w_0) \ge +1, \forall t",
    "13.7": r"L_d = -\frac{1}{2}\sum_t \sum_s \alpha^t \alpha^s r^t r^s (\mathbf{x}^t)^T \mathbf{x}^s + \sum_t \alpha^t",
    "13.8": r"w_0 = r^t - \mathbf{w}^T \mathbf{x}^t",
    "13.9": r"r^t (\mathbf{w}^T \mathbf{x}^t + w_0) \ge 1 - \xi^t",
    "13.10": r"L_p = \frac{1}{2}\|\mathbf{w}\|^2 + C \sum_t \xi^t",
    "13.12": r"\mathbf{w} = \sum_t \alpha^t r^t \mathbf{x}^t",
    "13.15": r"L_d = \sum_t \alpha^t - \frac{1}{2}\sum_t \sum_s \alpha^t \alpha^s r^t r^s (\mathbf{x}^t)^T \mathbf{x}^s \quad \text{s.t. } 0 \le \alpha^t \le C, \sum_t \alpha^t r^t = 0",
    "13.16": r"L_{\text{hinge}}(y^t, r^t) = \begin{cases} 0 & \text{if } y^t r^t \ge 1 \\ 1 - y^t r^t & \text{otherwise} \end{cases}",
    "13.20": r"g(\mathbf{x}) = \mathbf{w}^T \boldsymbol{\phi}(\mathbf{x}) = \sum_{j=1}^k w_j \phi_j(\mathbf{x})",
    "13.27": r"L_d = \sum_t \alpha^t - \frac{1}{2}\sum_t \sum_s \alpha^t \alpha^s r^t r^s K(\mathbf{x}^t, \mathbf{x}^s)",
    "13.28": r"g(\mathbf{x}) = \sum_t \alpha^t r^t K(\mathbf{x}^t, \mathbf{x}) + w_0",
    "13.29": r"K(\mathbf{x}^t, \mathbf{x}) = ((\mathbf{x}^t)^T \mathbf{x} + 1)^q",
    "13.30": r"K(\mathbf{x}^t, \mathbf{x}) = \exp\left[ -\frac{\|\mathbf{x}^t - \mathbf{x}\|^2}{2s^2} \right]",
    "13.43": r"e_\epsilon(r^t, f(\mathbf{x}^t)) = \begin{cases} 0 & \text{if } |r^t - f(\mathbf{x}^t)| < \epsilon \\ |r^t - f(\mathbf{x}^t)| - \epsilon & \text{otherwise} \end{cases}",
    "13.44": r"\min \frac{1}{2}\|\mathbf{w}\|^2 + C \sum_t (\xi_+^t + \xi_-^t)",
    "13.51": r"f(\mathbf{x}) = \sum_t (\alpha_+^t - \alpha_-^t) K(\mathbf{x}^t, \mathbf{x}) + w_0",

    # Chapter 18
    "18.1": r"a^* = \arg\max_a Q(a)",
    "18.2": r"Q_{t+1}(a) \leftarrow Q_t(a) + \eta [r_{t+1}(a) - Q_t(a)]",
    "18.6": r"V^*(s_t) = \max_{a_t} \left( E[r_{t+1}] + \gamma \sum_{s_{t+1}} P(s_{t+1} \mid s_t, a_t) V^*(s_{t+1}) \right)",
    "18.7": r"Q^*(s_t, a_t) = E[r_{t+1}] + \gamma \sum_{s_{t+1}} P(s_{t+1} \mid s_t, a_t) \max_{a_{t+1}} Q^*(s_{t+1}, a_{t+1})",
    "18.8": r"\pi^*(s_t) : \text{Choose } a^* \text{ where } Q^*(s_t, a^*) = \max_a Q^*(s_t, a)",
    "18.10": r"P(a \mid s) = \frac{\exp Q(s, a)}{\sum_{b \in \mathcal{A}} \exp Q(s, b)}",
    "18.11": r"P(a \mid s) = \frac{\exp[Q(s, a)/T]}{\sum_{b \in \mathcal{A}} \exp[Q(s, b)/T]}",
    "18.13": r"\hat{Q}(s_t, a_t) \leftarrow r_{t+1} + \gamma \max_{a_{t+1}} \hat{Q}(s_{t+1}, a_{t+1})",
    "18.15": r"\hat{Q}(s_t, a_t) \leftarrow \hat{Q}(s_t, a_t) + \eta \left( r_{t+1} + \gamma \max_{a_{t+1}} \hat{Q}(s_{t+1}, a_{t+1}) - \hat{Q}(s_t, a_t) \right)",
    "18.16": r"V(s_t) \leftarrow V(s_t) + \eta [r_{t+1} + \gamma V(s_{t+1}) - V(s_t)]",
    "18.17": r"e_t(s, a) = \begin{cases} 1 & \text{if } s = s_t \text{ and } a = a_t \\ \gamma\lambda e_{t-1}(s, a) & \text{otherwise} \end{cases}",
    "18.18": r"\delta_t = r_{t+1} + \gamma Q(s_{t+1}, a_{t+1}) - Q(s_t, a_t)",
    "18.19": r"Q(s, a) \leftarrow Q(s, a) + \eta \delta_t e_t(s, a), \quad \forall s, a",
    "18.21": r"\Delta \theta = \eta [r_{t+1} + \gamma Q(s_{t+1}, a_{t+1}) - Q(s_t, a_t)] \nabla_\theta Q(s_t, a_t)",
    "18.24": r"Q(b_t, a_t) = E[r_{t+1}] + \gamma \sum_{b_{t+1}} P(b_{t+1} \mid b_t, a_t) V(b_{t+1})"
}

print(f"Catalogued {len(EQUATIONS)} core textbook equations.")

# Now scan and inject into each chapter
for f in sorted(CHAPTERS_DIR.glob("*.json")):
    data = json.load(open(f))
    changed = False

    def process_text(content):
        global changed
        paragraphs = content.split('\n\n')
        new_p = []
        for p in paragraphs:
            trimmed = p.strip()
            # Check if this paragraph contains an equation tag like (2.1)
            eq_match = re.search(r'\((\d+\.\d+)\)', trimmed)
            if eq_match:
                tag = eq_match.group(1)
                if tag in EQUATIONS:
                    # If this paragraph is mostly just the equation or mangled equation
                    # Replace with clean $$ formula $$ (tag)
                    latex_formula = EQUATIONS[tag]
                    # If paragraph already has prose, separate it
                    prose_before = ""
                    # Check if there is prose before the equation
                    lines = trimmed.split('\n')
                    clean_lines = []
                    for line in lines:
                        if tag not in line and not any(sym in line for sym in ['w1', 'w0', 'theta', 'g(x)', 'E(h', 'E(w', 'r =', 'x =', 'h(x)', 'p(x)', 'P(x)']):
                            clean_lines.append(line)
                    if clean_lines and len(' '.join(clean_lines)) > 40:
                        prose_before = ' '.join(clean_lines).strip()
                    
                    if prose_before:
                        new_p.append(prose_before)
                    new_p.append(f"$$ {latex_formula} $$ ({tag})")
                    changed = True
                    continue
            new_p.append(p)
        return '\n\n'.join(new_p)

    for s in data['sections']:
        if 'intro' in s and s['intro']:
            s['intro'] = process_text(s['intro'])
        for sub in s.get('subsections', []):
            if 'content' in sub and sub['content']:
                sub['content'] = process_text(sub['content'])

    if changed:
        with open(f, 'w') as out:
            json.dump(data, out, indent=2, ensure_ascii=False)
        print(f"Injected equations into {f.name}")
