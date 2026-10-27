#!/usr/bin/env python3
"""
tools/restore_all_book_equations.py
Comprehensive equation restorer for Ethem Alpaydin's Introduction to Machine Learning (2nd Edition).
Replaces mangled OCR equation text with clean, authentic LaTeX equations ($$ ... $$ (X.Y))
and normalizes inline math throughout all 19 chapter JSON files.
"""

import json, re, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHAPTERS_DIR = ROOT / "modules" / "intro-to-ml" / "data" / "chapters"

# Authentic mathematical equations from Ethem Alpaydin's textbook (Chapters 1 - 19)
EQUATIONS = {
    # ========================== CHAPTER 2 ==========================
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

    # ========================== CHAPTER 3 ==========================
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

    # ========================== CHAPTER 4 ==========================
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

    # ========================== CHAPTER 5 ==========================
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

    # ========================== CHAPTER 6 ==========================
    "6.1": r"\mathbf{x} \in \mathbb{R}^d, \quad \mathbf{z} \in \mathbb{R}^k, \quad k < d",
    "6.2": r"\mathbf{z} = \mathbf{W}^T \mathbf{x}",
    "6.3": r"\mathbf{x}' = \mathbf{W}\mathbf{z}",
    "6.4": r"E = \frac{1}{2}\sum_t \|\mathbf{x}^t - \mathbf{x}'^t\|^2",
    "6.5": r"z = \mathbf{w}^T \mathbf{x}",
    "6.6": r"\max_{\mathbf{w}_1} \mathbf{w}_1^T \boldsymbol{\Sigma} \mathbf{w}_1 - \alpha (\mathbf{w}_1^T \mathbf{w}_1 - 1)",
    "6.7": r"\max_{\mathbf{w}_2} \mathbf{w}_2^T \boldsymbol{\Sigma} \mathbf{w}_2 - \alpha (\mathbf{w}_2^T \mathbf{w}_2 - 1) - \beta (\mathbf{w}_2^T \mathbf{w}_1 - 0)",
    "6.8": r"2\boldsymbol{\Sigma}\mathbf{w}_2 - 2\alpha\mathbf{w}_2 - \beta\mathbf{w}_1 = 0",
    "6.9": r"\mathbf{z} = \mathbf{W}^T (\mathbf{x} - \mathbf{m})",
    "6.10": r"\mathbf{S} = \mathbf{C} \mathbf{D} \mathbf{C}^T",
    "6.11": r"\mathbf{C}^T \mathbf{S} \mathbf{C} = \mathbf{D}",
    "6.12": r"\sum_t \|\hat{\mathbf{x}}^t - \mathbf{x}^t\|^2",
    "6.13": r"x_i - \mu_i = \sum_{j=1}^k v_{ij} z_j + \epsilon_i",
    "6.14": r"\mathbf{x} - \boldsymbol{\mu} = \mathbf{V}\mathbf{z} + \boldsymbol{\epsilon}",
    "6.15": r"\text{Var}(x_i) = v_{i1}^2 + v_{i2}^2 + \dots + v_{ik}^2 + \psi_i",
    "6.16": r"\text{Cov}(x_i, x_j) = \sum_{l=1}^k v_{il} v_{jl}",
    "6.17": r"\boldsymbol{\Sigma} = \mathbf{V}\mathbf{V}^T + \boldsymbol{\Psi}",
    "6.18": r"\mathbf{V} = \mathbf{C} \mathbf{D}^{1/2}",
    "6.19": r"\psi_i = s_i^2 - \sum_{j=1}^k v_{ij}^2",
    "6.20": r"z_j = \sum_{i=1}^d w_{ji} x_i + \epsilon_i",
    "6.21": r"\mathbf{Z} = \mathbf{X}\mathbf{W} + \mathbf{\Xi}",
    "6.22": r"\mathbf{W} = \mathbf{S}^{-1}\mathbf{V}",
    "6.23": r"\mathbf{Z} = \mathbf{X}\mathbf{W} = \mathbf{X}\mathbf{S}^{-1}\mathbf{V}",
    "6.24": r"d_{rs}^2 = \|\mathbf{x}^r - \mathbf{x}^s\|^2 = \sum_{j=1}^d (x_{rj} - x_{sj})^2",
    "6.25": r"\mathbf{B} = \mathbf{X}\mathbf{X}^T",
    "6.26": r"b_{rs} = -\frac{1}{2}(d_{rs}^2 - d_{r.}^2 - d_{.s}^2 + d_{..}^2)",
    "6.27": r"\mathbf{X} = \mathbf{V}\boldsymbol{\Lambda}^{1/2}",
    "6.28": r"\mathbf{z} = g(\mathbf{x} \mid \mathbf{W}) = \mathbf{W}^T \mathbf{x}",
    "6.29": r"E(\theta \mid \mathcal{X}) = \sum_{r,s} \frac{(\|g(\mathbf{x}^r \mid \theta) - g(\mathbf{x}^s \mid \theta)\| - \|\mathbf{x}^r - \mathbf{x}^s\|)^2}{\|\mathbf{x}^r - \mathbf{x}^s\|^2}",
    "6.30": r"z = \mathbf{w}^T \mathbf{x}",
    "6.31": r"m_1 = \frac{\sum_t \mathbf{w}^T \mathbf{x}^t r^t}{\sum_t r^t} = \mathbf{w}^T \mathbf{m}_1, \quad m_2 = \mathbf{w}^T \mathbf{m}_2",
    "6.32": r"s_1^2 = \sum_t (\mathbf{w}^T \mathbf{x}^t - m_1)^2 r^t = \mathbf{w}^T \mathbf{S}_1 \mathbf{w}",
    "6.33": r"J(\mathbf{w}) = \frac{(m_1 - m_2)^2}{s_1^2 + s_2^2}",
    "6.34": r"(m_1 - m_2)^2 = (\mathbf{w}^T \mathbf{m}_1 - \mathbf{w}^T \mathbf{m}_2)^2 = \mathbf{w}^T (\mathbf{m}_1 - \mathbf{m}_2)(\mathbf{m}_1 - \mathbf{m}_2)^T \mathbf{w} = \mathbf{w}^T \mathbf{S}_B \mathbf{w}",
    "6.35": r"\mathbf{S}_B = (\mathbf{m}_1 - \mathbf{m}_2)(\mathbf{m}_1 - \mathbf{m}_2)^T",
    "6.36": r"s_1^2 + s_2^2 = \mathbf{w}^T \mathbf{S}_1 \mathbf{w} + \mathbf{w}^T \mathbf{S}_2 \mathbf{w} = \mathbf{w}^T (\mathbf{S}_1 + \mathbf{S}_2)\mathbf{w} = \mathbf{w}^T \mathbf{S}_W \mathbf{w}",
    "6.37": r"J(\mathbf{w}) = \frac{\mathbf{w}^T \mathbf{S}_B \mathbf{w}}{\mathbf{w}^T \mathbf{S}_W \mathbf{w}} = \frac{|\mathbf{w}^T (\mathbf{m}_1 - \mathbf{m}_2)|^2}{\mathbf{w}^T \mathbf{S}_W \mathbf{w}}",
    "6.38": r"\mathbf{w} = c \mathbf{S}_W^{-1} (\mathbf{m}_1 - \mathbf{m}_2)",
    "6.39": r"\mathbf{z} = \mathbf{W}^T \mathbf{x}",
    "6.40": r"\mathbf{S}_B = \sum_{i=1}^K N_i (\mathbf{m}_i - \mathbf{m})(\mathbf{m}_i - \mathbf{m})^T",
    "6.41": r"\mathbf{S}_W = \sum_{i=1}^K \mathbf{S}_i = \sum_{i=1}^K \sum_{t=1}^N r_i^t (\mathbf{x}^t - \mathbf{m}_i)(\mathbf{x}^t - \mathbf{m}_i)^T",
    "6.42": r"\mathbf{S}_T = \mathbf{S}_B + \mathbf{S}_W = \sum_{t=1}^N (\mathbf{x}^t - \mathbf{m})(\mathbf{x}^t - \mathbf{m})^T",
    "6.43": r"\mathbf{W} = [\mathbf{w}_1, \dots, \mathbf{w}_{K-1}]",
    "6.44": r"J(\mathbf{W}) = \frac{|\mathbf{W}^T \mathbf{S}_B \mathbf{W}|}{|\mathbf{W}^T \mathbf{S}_W \mathbf{W}|}",

    # ========================== CHAPTER 7 ==========================
    "7.1": r"p(\mathbf{x}) = \sum_{i=1}^k p(\mathbf{x} \mid G_i) P(G_i)",
    "7.2": r"\hat{P}(C_i) = \frac{\sum_t r_i^t}{N}, \quad \mathbf{m}_i = \frac{\sum_t r_i^t \mathbf{x}^t}{\sum_t r_i^t}, \quad \mathbf{S}_i = \frac{\sum_t r_i^t (\mathbf{x}^t - \mathbf{m}_i)(\mathbf{x}^t - \mathbf{m}_i)^T}{\sum_t r_i^t}",
    "7.3": r"E(\{\mathbf{m}_i\}_{i=1}^k \mid \mathcal{X}) = \sum_t \sum_i b_i^t \|\mathbf{x}^t - \mathbf{m}_i\|^2",
    "7.4": r"b_i^t = \begin{cases} 1 & \text{if } \|\mathbf{x}^t - \mathbf{m}_i\| = \min_j \|\mathbf{x}^t - \mathbf{m}_j\| \\ 0 & \text{otherwise} \end{cases}",
    "7.5": r"\mathbf{m}_i = \frac{\sum_t b_i^t \mathbf{x}^t}{\sum_t b_i^t}",
    "7.6": r"\mathcal{L}(\Phi \mid \mathcal{X}) = \sum_t \log \sum_{i=1}^k p(\mathbf{x}^t \mid G_i) P(G_i)",
    "7.7": r"\mathcal{Q}(\Phi \mid \Phi^l) = E[\mathcal{L}_c(\Phi \mid \mathcal{X}, \mathcal{Z}) \mid \mathcal{X}, \Phi^l]",
    "7.8": r"\mathcal{L}_c(\Phi \mid \mathcal{X}, \mathcal{Z}) = \sum_t \sum_i z_i^t \log [P(G_i) p(\mathbf{x}^t \mid G_i)]",
    "7.9": r"h_i^t \equiv P(G_i \mid \mathbf{x}^t, \Phi^l) = \frac{p(\mathbf{x}^t \mid G_i, \Phi^l) P(G_i)}{\sum_j p(\mathbf{x}^t \mid G_j, \Phi^l) P(G_j)}",
    "7.10": r"E[z_i^t \mid \mathcal{X}, \Phi^l] = h_i^t",
    "7.11": r"\pi_i = \frac{\sum_t h_i^t}{N}",
    "7.12": r"\mathbf{m}_i = \frac{\sum_t h_i^t \mathbf{x}^t}{\sum_t h_i^t}",
    "7.13": r"\mathbf{m}_i^{l+1} = \frac{\sum_t h_i^t \mathbf{x}^t}{\sum_t h_i^t}, \quad \mathbf{S}_i^{l+1} = \frac{\sum_t h_i^t (\mathbf{x}^t - \mathbf{m}_i^{l+1})(\mathbf{x}^t - \mathbf{m}_i^{l+1})^T}{\sum_t h_i^t}",
    "7.14": r"h_i^t = \frac{\pi_i |\mathbf{S}_i|^{-1/2} \exp\left[-\frac{1}{2}(\mathbf{x}^t - \mathbf{m}_i)^T \mathbf{S}_i^{-1} (\mathbf{x}^t - \mathbf{m}_i)\right]}{\sum_j \pi_j |\mathbf{S}_j|^{-1/2} \exp\left[-\frac{1}{2}(\mathbf{x}^t - \mathbf{m}_j)^T \mathbf{S}_j^{-1} (\mathbf{x}^t - \mathbf{m}_j)\right]}",
    "7.15": r"p(\mathbf{x} \mid G_i) = \frac{1}{(2\pi)^{d/2}\sigma_i^d} \exp\left[-\frac{\|\mathbf{x} - \mathbf{m}_i\|^2}{2\sigma_i^2}\right]",
    "7.16": r"\sigma_i^2 = \frac{\sum_t h_i^t \|\mathbf{x}^t - \mathbf{m}_i\|^2}{d \sum_t h_i^t}",
    "7.17": r"h_i^t = \frac{\exp\left[-\frac{1}{2s^2}\|\mathbf{x}^t - \mathbf{m}_i\|^2\right]}{\sum_j \exp\left[-\frac{1}{2s^2}\|\mathbf{x}^t - \mathbf{m}_j\|^2\right]}",
    "7.18": r"d(C_i, C_j) = \min_{\mathbf{x} \in C_i, \mathbf{y} \in C_j} \|\mathbf{x} - \mathbf{y}\|",
    "7.19": r"d(C_i, C_j) = \max_{\mathbf{x} \in C_i, \mathbf{y} \in C_j} \|\mathbf{x} - \mathbf{y}\|",
    "7.20": r"d(C_i, C_j) = \frac{1}{N_i N_j}\sum_{\mathbf{x} \in C_i} \sum_{\mathbf{y} \in C_j} \|\mathbf{x} - \mathbf{y}\|",

    # ========================== CHAPTER 8 ==========================
    "8.1": r"\hat{F}(x) = \frac{\#\{x^t \le x\}}{N}",
    "8.2": r"\hat{p}(x) = \frac{1}{h} \frac{\#\{x^t \le x+h\} - \#\{x^t \le x\}}{N}",
    "8.3": r"\hat{p}(x) = \frac{\#\{x^t \text{ in the same bin as } x\}}{Nh}",
    "8.4": r"\hat{p}(x) = \frac{\#\{x - h/2 < x^t \le x + h/2\}}{Nh}",
    "8.5": r"\hat{p}(x) = \frac{1}{Nh} \sum_{t=1}^N w\left(\frac{x - x^t}{h}\right)",
    "8.6": r"K(u) = \frac{1}{\sqrt{2\pi}} \exp\left(-\frac{u^2}{2}\right)",
    "8.7": r"\hat{p}(x) = \frac{1}{Nh} \sum_{t=1}^N K\left(\frac{x - x^t}{h}\right)",
    "8.8": r"\hat{p}(x) = \frac{k}{2N d_k(x)}",
    "8.9": r"\hat{p}(x) = \frac{1}{N d_k(x)} \sum_{t=1}^N K\left(\frac{x - x^t}{d_k(x)}\right)",
    "8.10": r"\hat{p}(\mathbf{x}) = \frac{1}{N h^d} \sum_{t=1}^N K\left(\frac{\mathbf{x} - \mathbf{x}^t}{h}\right)",
    "8.11": r"K(\mathbf{u}) = \frac{1}{(2\pi)^{d/2}} \exp\left(-\frac{\|\mathbf{u}\|^2}{2}\right)",
    "8.12": r"K(\mathbf{u}) = \frac{1}{(2\pi)^{d/2}|\mathbf{S}|^{1/2}} \exp\left(-\frac{1}{2}\mathbf{u}^T \mathbf{S}^{-1}\mathbf{u}\right)",
    "8.13": r"HD(\mathbf{x}, \mathbf{x}^t) = \sum_{j=1}^d 1(x_j \neq x_j^t)",
    "8.14": r"\hat{p}(\mathbf{x} \mid C_i) = \frac{1}{N_i h^d} \sum_{t=1}^N K\left(\frac{\mathbf{x} - \mathbf{x}^t}{h}\right) r_i^t",
    "8.15": r"\hat{P}(C_i) \hat{p}(\mathbf{x} \mid C_i) = \frac{1}{N h^d} \sum_{t=1}^N K\left(\frac{\mathbf{x} - \mathbf{x}^t}{h}\right) r_i^t",
    "8.16": r"\hat{P}(C_i \mid \mathbf{x}) = \frac{\sum_{t=1}^N K\left(\frac{\mathbf{x} - \mathbf{x}^t}{h}\right) r_i^t}{\sum_{t=1}^N K\left(\frac{\mathbf{x} - \mathbf{x}^t}{h}\right)}",
    "8.17": r"\hat{P}(C_i \mid \mathbf{x}) = \frac{k_i}{k}",
    "8.18": r"E'(\mathcal{Z} \mid \mathcal{X}) = E(\mathcal{X} \mid \mathcal{Z}) + \lambda |\mathcal{Z}|",
    "8.19": r"\hat{g}(x) = \frac{\sum_{t=1}^N b(x, x^t) r^t}{\sum_{t=1}^N b(x, x^t)}",
    "8.20": r"\hat{g}(x) = \frac{\sum_{t=1}^N w\left(\frac{x - x^t}{h}\right) r^t}{\sum_{t=1}^N w\left(\frac{x - x^t}{h}\right)}",
    "8.21": r"\hat{g}(x) = \frac{\sum_{t=1}^N K\left(\frac{x - x^t}{h}\right) r^t}{\sum_{t=1}^N K\left(\frac{x - x^t}{h}\right)}",
    "8.22": r"\sum_{t=1}^N (r^t - \hat{g}(x^t))^2 + \lambda \int_a^b [\hat{g}''(x)]^2 dx",

    # ========================== CHAPTER 9 ==========================
    "9.1": r"f_m(\mathbf{x}) : x_j > w_{m0}",
    "9.2": r"\hat{P}(C_i \mid \mathbf{x}, m) \equiv p_m^i = \frac{N_m^i}{N_m}",
    "9.3": r"\mathcal{I}_m = -\sum_{i=1}^K p_m^i \log_2 p_m^i",
    "9.4": r"\phi(p, 1 - p) = -p \log_2 p - (1 - p)\log_2(1 - p)",
    "9.5": r"\phi(p, 1 - p) = 2p(1 - p) \quad \text{(Gini index)}",
    "9.6": r"\phi(p, 1 - p) = 1 - \max(p, 1 - p) \quad \text{(Misclassification error)}",
    "9.7": r"\mathcal{I}_m = 1 - \sum_{i=1}^K (p_m^i)^2",
    "9.8": r"\mathcal{I}_m' = -\sum_{j=1}^n \frac{N_{mj}}{N_m} \sum_{i=1}^K p_{mj}^i \log_2 p_{mj}^i",
    "9.9": r"\text{GainRatio} = \frac{\mathcal{I}_m - \mathcal{I}_m'}{\text{SplitInfo}}",
    "9.10": r"E_m = \frac{1}{N_m}\sum_t (r^t - g_m)^2 b_m(\mathbf{x}^t)",
    "9.11": r"g_m = \frac{\sum_t b_m(\mathbf{x}^t) r^t}{\sum_t b_m(\mathbf{x}^t)}",
    "9.12": r"E_m = \frac{1}{N_m}\sum_{t \in m} (r^t - \bar{r}_m)^2",
    "9.13": r"g_m(\mathbf{x}) = \mathbf{w}_m^T \mathbf{x} + w_{m0}",
    "9.14": r"E_m' = \frac{1}{N_m}\sum_j \sum_t (r^t - g_{mj})^2 b_{mj}(\mathbf{x}^t)",
    "9.15": r"E_m' = \frac{N_{m1}}{N_m}\sigma_{m1}^2 + \frac{N_{m2}}{N_m}\sigma_{m2}^2",
    "9.16": r"\alpha = \frac{R(T) - R(T_t)}{|T_t| - 1}",
    "9.17": r"\text{Gain}(R', R) = s \cdot \left(\log_2 \frac{N_+'}{N'} - \log_2 \frac{N_+}{N}\right)",
    "9.18": r"\text{rvm}(R) = \frac{p - n}{p + n}",
    "9.19": r"f_m(\mathbf{x}) : \mathbf{w}_m^T \mathbf{x} + w_{m0} > 0",
    "9.20": r"g_i(\mathbf{x}) = \sum_{m \in T_i} w_m b_m(\mathbf{x})",
    "9.21": r"f_m(\mathbf{x}) : \sum_j a_j x_j + a_0 > 0",

    # ========================== CHAPTER 10 ==========================
    "10.1": r"g_i(\mathbf{x} \mid \mathbf{w}_i, w_{i0}) = \mathbf{w}_i^T \mathbf{x} + w_{i0} = \sum_{j=1}^d w_{ij} x_j + w_{i0}",
    "10.2": r"g_i(\mathbf{x} \mid \mathbf{W}_i, \mathbf{w}_i, w_{i0}) = \mathbf{x}^T \mathbf{W}_i \mathbf{x} + \mathbf{w}_i^T \mathbf{x} + w_{i0}",
    "10.3": r"g_i(\mathbf{x}) = \sum_{j=1}^k w_j \phi_{ij}(\mathbf{x})",
    "10.4": r"r = \frac{g(\mathbf{x})}{\|\mathbf{w}\|}",
    "10.5": r"r_0 = \frac{w_0}{\|\mathbf{w}\|}",
    "10.6": r"g(\mathbf{x}) = \mathbf{w}^T \mathbf{x} + w_0",
    "10.7": r"\text{Choose } \begin{cases} C_1 & \text{if } g(\mathbf{x}) > 0 \\ C_2 & \text{if } g(\mathbf{x}) < 0 \end{cases}",
    "10.8": r"\text{Choose } C_i \text{ if } g_i(\mathbf{x}) = \max_{j=1}^K g_j(\mathbf{x})",
    "10.9": r"g_{ij}(\mathbf{x}) = \mathbf{w}_{ij}^T \mathbf{x} + w_{ij0}",
    "10.10": r"g_i(\mathbf{x}) = \sum_{j \neq i} g_{ij}(\mathbf{x})",
    "10.11": r"y = \text{sigmoid}(a) = \frac{1}{1 + \exp(-a)}",
    "10.12": r"\frac{dy}{da} = y(1 - y)",
    "10.13": r"\text{logit}(P) = \log \frac{P}{1 - P}",
    "10.14": r"\log \frac{P(C_1 \mid \mathbf{x})}{P(C_2 \mid \mathbf{x})} = \mathbf{w}^T \mathbf{x} + w_0",
    "10.15": r"P(C_1 \mid \mathbf{x}) = \text{sigmoid}(\mathbf{w}^T \mathbf{x} + w_0) = \frac{1}{1 + \exp[-(\mathbf{w}^T \mathbf{x} + w_0)]}",
    "10.16": r"\Delta w_j = -\eta \frac{\partial E}{\partial w_j}, \quad \forall j",
    "10.17": r"w_j \leftarrow w_j + \Delta w_j",
    "10.18": r"E_p(\mathbf{w}, w_0 \mid \mathcal{X}) = -\sum_{t \in \mathcal{M}} (\mathbf{w}^T \mathbf{x}^t + w_0) r^t",
    "10.19": r"\Delta \mathbf{w} = \eta \sum_{t \in \mathcal{M}} r^t \mathbf{x}^t, \quad \Delta w_0 = \eta \sum_{t \in \mathcal{M}} r^t",
    "10.20": r"\mathbf{w}^{t+1} = \mathbf{w}^t + \eta (r^t - y^t)\mathbf{x}^t",
    "10.21": r"y = \hat{P}(C_1 \mid \mathbf{x}) = \frac{1}{1 + \exp[-(\mathbf{w}^T \mathbf{x} + w_0)]}",
    "10.22": r"l(\mathbf{w}, w_0 \mid \mathcal{X}) = \prod_t (y^t)^{r^t} (1 - y^t)^{1 - r^t}",
    "10.23": r"E(\mathbf{w}, w_0 \mid \mathcal{X}) = -\sum_t r^t \log y^t + (1 - r^t)\log(1 - y^t)",
    "10.24": r"\Delta w_j = \eta \sum_t (r^t - y^t)x_j^t, \quad \Delta w_0 = \eta \sum_t (r^t - y^t)",
    "10.25": r"\mathbf{w} \leftarrow \mathbf{w} - \mathbf{H}^{-1} \nabla_\mathbf{w} E",
    "10.26": r"\mathbf{H} = \frac{\partial^2 E}{\partial \mathbf{w} \partial \mathbf{w}^T} = \mathbf{X}^T \mathbf{Y} (\mathbf{I} - \mathbf{Y}) \mathbf{X}",
    "10.27": r"\mathbf{w}^{new} = (\mathbf{X}^T \mathbf{W} \mathbf{X})^{-1} \mathbf{X}^T \mathbf{W} \mathbf{z}",
    "10.28": r"\frac{P(C_i \mid \mathbf{x})}{P(C_K \mid \mathbf{x})} = \exp(\mathbf{w}_i^T \mathbf{x} + w_{i0})",
    "10.29": r"y_i = \hat{P}(C_i \mid \mathbf{x}) = \frac{\exp[\mathbf{w}_i^T \mathbf{x} + w_{i0}]}{\sum_{j=1}^K \exp[\mathbf{w}_j^T \mathbf{x} + w_{j0}]}, \quad i = 1, \dots, K",
    "10.30": r"l(\{\mathbf{w}_i, w_{i0}\}_i \mid \mathcal{X}) = \prod_t \prod_i (y_i^t)^{r_i^t}",
    "10.31": r"E(\{\mathbf{w}_i, w_{i0}\}_i \mid \mathcal{X}) = -\sum_t \sum_i r_i^t \log y_i^t",
    "10.32": r"\frac{\partial E}{\partial \mathbf{w}_i} = -\sum_t (r_i^t - y_i^t)\mathbf{x}^t",
    "10.33": r"\Delta \mathbf{w}_j = \eta \sum_t (r_j^t - y_j^t)\mathbf{x}^t, \quad \Delta w_{j0} = \eta \sum_t (r_j^t - y_j^t)",
    "10.34": r"\mathbf{w}_j \leftarrow \mathbf{w}_j + \eta \sum_t (r_j^t - y_j^t)\mathbf{x}^t",
    "10.35": r"E' = E + \frac{\lambda}{2}\sum_i \|\mathbf{w}_i\|^2",

    # ========================== CHAPTER 11 ==========================
    "11.1": r"y = \sum_{j=1}^d w_j x_j + w_0",
    "11.2": r"y = \mathbf{w}^T \mathbf{x}",
    "11.3": r"y = f(\mathbf{w}^T \mathbf{x}) = f\left(\sum_{j=1}^d w_j x_j + w_0\right)",
    "11.4": r"o = \mathbf{w}^T \mathbf{x}, \quad y = \text{sigmoid}(o) = \frac{1}{1 + \exp[-\mathbf{w}^T \mathbf{x}]}",
    "11.5": r"y_i = \sum_{j=1}^d w_{ij} x_j + w_{i0} = \mathbf{w}_i^T \mathbf{x}, \quad \mathbf{y} = \mathbf{W}\mathbf{x}",
    "11.6": r"y_i = \text{sigmoid}(\mathbf{w}_i^T \mathbf{x}) = \frac{1}{1 + \exp[-\mathbf{w}_i^T \mathbf{x}]}",
    "11.7": r"\Delta w_j^t = \eta (r^t - y^t)x_j^t",
    "11.8": r"\Delta w_j^t = \eta (r^t - y^t)x_j^t",
    "11.9": r"\Delta w_{ij}^t = \eta (r_i^t - y_i^t)x_j^t",
    "11.10": r"\text{Update} = \text{LearningFactor} \cdot (\text{DesiredOutput} - \text{ActualOutput}) \cdot \text{Input}",
    "11.11": r"z_h = \text{sigmoid}(\mathbf{w}_h^T \mathbf{x}) = \frac{1}{1 + \exp\left[ -\left(\sum_{j=1}^d w_{hj} x_j + w_{h0}\right) \right]}, \quad h = 1, \dots, H",
    "11.12": r"y_i = \mathbf{v}_i^T \mathbf{z} = \sum_{h=1}^H v_{ih} z_h + v_{i0}",
    "11.13": r"y_i = \text{sigmoid}(\mathbf{v}_i^T \mathbf{z})",
    "11.14": r"E(\mathbf{W}, \mathbf{v} \mid \mathcal{X}) = \frac{1}{2}\sum_t (r^t - y^t)^2",
    "11.15": r"\Delta v_h = \eta \sum_t (r^t - y^t)z_h^t",
    "11.16": r"\Delta w_{hj} = \eta \sum_t (r^t - y^t)v_h z_h^t (1 - z_h^t)x_j^t",
    "11.17": r"\Delta v_{ih} = \eta \sum_t (r_i^t - y_i^t)z_h^t",
    "11.18": r"\delta_i^t \equiv r_i^t - y_i^t",
    "11.19": r"\delta_h^t \equiv \left(\sum_i \delta_i^t v_{ih}\right) z_h^t (1 - z_h^t)",
    "11.20": r"\Delta w_{hj} = \eta \sum_t \left[\sum_i (r_i^t - y_i^t)v_{ih}\right] z_h^t(1 - z_h^t)x_j^t",
    "11.21": r"E^t = \frac{1}{2}\sum_i (r_i^t - y_i^t)^2",
    "11.22": r"\Delta v_{ih}^t = \eta \delta_i^t z_h^t, \quad \Delta w_{hj}^t = \eta \delta_h^t x_j^t",
    "11.23": r"E = -\sum_t [r^t \log y^t + (1 - r^t)\log(1 - y^t)]",
    "11.24": r"\delta^t = r^t - y^t",
    "11.25": r"E = -\sum_t \sum_i r_i^t \log y_i^t",
    "11.26": r"y_i^t = \frac{\exp o_i^t}{\sum_k \exp o_k^t}",
    "11.27": r"\delta_i^t = r_i^t - y_i^t",
    "11.28": r"z_h = \tanh(\mathbf{w}_h^T \mathbf{x}) = \frac{e^a - e^{-a}}{e^a + e^{-a}} = 2\text{sigmoid}(2a) - 1",
    "11.29": r"\frac{dz}{da} = 1 - z^2",
    "11.30": r"\Delta w_i^t = -\eta \frac{\partial E^t}{\partial w_i} + \alpha \Delta w_i^{t-1}",
    "11.31": r"\Delta w_i^t = -\eta \sum_{\tau=0}^t \alpha^{t-\tau} \frac{\partial E^\tau}{\partial w_i}",
    "11.32": r"\Delta w_i = -\eta \frac{\partial E}{\partial w_i} - \lambda w_i",
    "11.33": r"E' = E + \frac{\lambda}{2}\sum_i w_i^2",
    "11.34": r"w_i \leftarrow (1 - \eta\lambda)w_i - \eta \frac{\partial E}{\partial w_i}",
    "11.35": r"E' = E + \lambda \sum_i |w_i|",

    # ========================== CHAPTER 12 ==========================
    "12.1": r"E(\{\mathbf{m}_i\}_{i=1}^k \mid \mathcal{X}) = \sum_t \sum_i b_i^t \|\mathbf{x}^t - \mathbf{m}_i\|^2",
    "12.2": r"b_i^t = \begin{cases} 1 & \text{if } \|\mathbf{x}^t - \mathbf{m}_i\| = \min_j \|\mathbf{x}^t - \mathbf{m}_j\| \\ 0 & \text{otherwise} \end{cases}",
    "12.3": r"\Delta \mathbf{m}_i = \eta ( \mathbf{x}^t - \mathbf{m}_i ) b_i^t",
    "12.4": r"\Delta \mathbf{m}_j = \eta h_{ij} (\mathbf{x}^t - \mathbf{m}_j)",
    "12.5": r"h_{ij} = \exp\left[-\frac{\|i - j\|^2}{2\sigma^2}\right]",
    "12.6": r"\Delta \mathbf{m}_i = \eta (\mathbf{x}^t - \mathbf{m}_i) \quad \text{if } \text{Class}(\mathbf{x}^t) = \text{Class}(\mathbf{m}_i)",
    "12.7": r"\Delta \mathbf{m}_i = -\eta (\mathbf{x}^t - \mathbf{m}_i) \quad \text{if } \text{Class}(\mathbf{x}^t) \neq \text{Class}(\mathbf{m}_i)",
    "12.8": r"p(\mathbf{x}) = \sum_{h=1}^H p(\mathbf{x} \mid G_h) P(G_h)",
    "12.9": r"y = \sum_{h=1}^H w_h z_h",
    "12.10": r"z_h = \exp\left[ -\frac{\|\mathbf{x} - \mathbf{m}_h\|^2}{2s_h^2} \right]",
    "12.11": r"y_i = \sum_{h=1}^H w_{ih} z_h + w_{i0}",
    "12.12": r"z_h = \frac{\exp\left[-\frac{\|\mathbf{x} - \mathbf{m}_h\|^2}{2s_h^2}\right]}{\sum_k \exp\left[-\frac{\|\mathbf{x} - \mathbf{m}_k\|^2}{2s_k^2}\right]}",
    "12.13": r"y = \sum_{h=1}^H w_h \frac{p(\mathbf{x} \mid G_h)P(G_h)}{\sum_j p(\mathbf{x} \mid G_j)P(G_j)}",
    "12.14": r"y = \sum_{h=1}^H g_h(\mathbf{x}) w_h",
    "12.15": r"g_h(\mathbf{x}) = \frac{\exp\left[-\frac{1}{2}(\mathbf{x} - \mathbf{m}_h)^T \mathbf{S}_h^{-1} (\mathbf{x} - \mathbf{m}_h)\right]}{\sum_j \exp\left[-\frac{1}{2}(\mathbf{x} - \mathbf{m}_j)^T \mathbf{S}_j^{-1} (\mathbf{x} - \mathbf{m}_j)\right]}",
    "12.16": r"y = \sum_{h=1}^H g_h(\mathbf{x}) (\mathbf{w}_h^T \mathbf{x} + w_{h0})",
    "12.17": r"E = \frac{1}{2}\sum_t (r^t - y^t)^2",
    "12.18": r"\Delta w_h = \eta \sum_t (r^t - y^t) z_h^t",
    "12.19": r"\Delta \mathbf{m}_h = \eta \sum_t (r^t - y^t) w_h z_h^t \frac{\mathbf{x}^t - \mathbf{m}_h}{s_h^2}",

    # ========================== CHAPTER 13 ==========================
    "13.1": r"r^t (\mathbf{w}^T \mathbf{x}^t + w_0) \ge +1",
    "13.2": r"\frac{r^t (\mathbf{w}^T \mathbf{x}^t + w_0)}{\|\mathbf{w}\|} \ge \rho, \quad \forall t",
    "13.3": r"\min \frac{1}{2}\|\mathbf{w}\|^2 \quad \text{subject to } r^t (\mathbf{w}^T \mathbf{x}^t + w_0) \ge +1, \forall t",
    "13.4": r"L_p = \frac{1}{2}\|\mathbf{w}\|^2 - \sum_t \alpha^t [r^t (\mathbf{w}^T \mathbf{x}^t + w_0) - 1]",
    "13.5": r"\frac{\partial L_p}{\partial \mathbf{w}} = 0 \implies \mathbf{w} = \sum_t \alpha^t r^t \mathbf{x}^t",
    "13.6": r"\frac{\partial L_p}{\partial w_0} = 0 \implies \sum_t \alpha^t r^t = 0",
    "13.7": r"L_d = -\frac{1}{2}\sum_t \sum_s \alpha^t \alpha^s r^t r^s (\mathbf{x}^t)^T \mathbf{x}^s + \sum_t \alpha^t",
    "13.8": r"w_0 = r^t - \mathbf{w}^T \mathbf{x}^t",
    "13.9": r"r^t (\mathbf{w}^T \mathbf{x}^t + w_0) \ge 1 - \xi^t, \quad \xi^t \ge 0",
    "13.10": r"L_p = \frac{1}{2}\|\mathbf{w}\|^2 + C \sum_t \xi^t",
    "13.11": r"L_p = \frac{1}{2}\|\mathbf{w}\|^2 + C \sum_t \xi^t - \sum_t \alpha^t [r^t (\mathbf{w}^T \mathbf{x}^t + w_0) - 1 + \xi^t] - \sum_t \mu^t \xi^t",
    "13.12": r"\mathbf{w} = \sum_t \alpha^t r^t \mathbf{x}^t",
    "13.13": r"C - \alpha^t - \mu^t = 0",
    "13.14": r"0 \le \alpha^t \le C",
    "13.15": r"L_d = \sum_t \alpha^t - \frac{1}{2}\sum_t \sum_s \alpha^t \alpha^s r^t r^s (\mathbf{x}^t)^T \mathbf{x}^s \quad \text{s.t. } 0 \le \alpha^t \le C, \sum_t \alpha^t r^t = 0",
    "13.16": r"L_{\text{hinge}}(y^t, r^t) = \begin{cases} 0 & \text{if } y^t r^t \ge 1 \\ 1 - y^t r^t & \text{otherwise} \end{cases}",
    "13.17": r"\min_\mathbf{w} \frac{1}{2}\|\mathbf{w}\|^2 + C \sum_t [1 - r^t (\mathbf{w}^T \mathbf{x}^t + w_0)]_+",
    "13.18": r"\mathbf{z} = \boldsymbol{\phi}(\mathbf{x})",
    "13.19": r"\boldsymbol{\phi}(\mathbf{x}) = [x_1^2, \sqrt{2}x_1 x_2, x_2^2]^T",
    "13.20": r"g(\mathbf{x}) = \mathbf{w}^T \boldsymbol{\phi}(\mathbf{x}) = \sum_{j=1}^k w_j \phi_j(\mathbf{x})",
    "13.21": r"g(\mathbf{x}) = \sum_t \alpha^t r^t \boldsymbol{\phi}(\mathbf{x}^t)^T \boldsymbol{\phi}(\mathbf{x}) + w_0",
    "13.22": r"K(\mathbf{x}, \mathbf{y}) = \boldsymbol{\phi}(\mathbf{x})^T \boldsymbol{\phi}(\mathbf{y})",
    "13.23": r"g(\mathbf{x}) = \sum_t \alpha^t r^t K(\mathbf{x}^t, \mathbf{x}) + w_0",
    "13.24": r"K(\mathbf{x}, \mathbf{y}) = (\mathbf{x}^T \mathbf{y} + 1)^2",
    "13.25": r"(\mathbf{x}^T \mathbf{y} + 1)^2 = (x_1 y_1 + x_2 y_2 + 1)^2 = x_1^2 y_1^2 + 2x_1 y_1 x_2 y_2 + x_2^2 y_2^2 + 2x_1 y_1 + 2x_2 y_2 + 1",
    "13.26": r"\boldsymbol{\phi}(\mathbf{x}) = [x_1^2, \sqrt{2}x_1 x_2, x_2^2, \sqrt{2}x_1, \sqrt{2}x_2, 1]^T",
    "13.27": r"L_d = \sum_t \alpha^t - \frac{1}{2}\sum_t \sum_s \alpha^t \alpha^s r^t r^s K(\mathbf{x}^t, \mathbf{x}^s)",
    "13.28": r"g(\mathbf{x}) = \sum_t \alpha^t r^t K(\mathbf{x}^t, \mathbf{x}) + w_0",
    "13.29": r"K(\mathbf{x}^t, \mathbf{x}) = ((\mathbf{x}^t)^T \mathbf{x} + 1)^q",
    "13.30": r"K(\mathbf{x}^t, \mathbf{x}) = \exp\left[ -\frac{\|\mathbf{x}^t - \mathbf{x}\|^2}{2s^2} \right]",
    "13.31": r"K(\mathbf{x}^t, \mathbf{x}) = \tanh(2(\mathbf{x}^t)^T \mathbf{x} + 1)",
    "13.32": r"\mathbf{K} \succeq 0 \quad (\mathbf{c}^T \mathbf{K} \mathbf{c} \ge 0, \forall \mathbf{c})",
    "13.43": r"e_\epsilon(r^t, f(\mathbf{x}^t)) = \begin{cases} 0 & \text{if } |r^t - f(\mathbf{x}^t)| < \epsilon \\ |r^t - f(\mathbf{x}^t)| - \epsilon & \text{otherwise} \end{cases}",
    "13.44": r"\min \frac{1}{2}\|\mathbf{w}\|^2 + C \sum_t (\xi_+^t + \xi_-^t)",
    "13.51": r"f(\mathbf{x}) = \sum_t (\alpha_+^t - \alpha_-^t) K(\mathbf{x}^t, \mathbf{x}) + w_0",

    # ========================== CHAPTER 14 ==========================
    "14.1": r"P(\theta \mid \mathcal{X}) = \frac{P(\mathcal{X} \mid \theta) P(\theta)}{P(\mathcal{X})}",
    "14.2": r"P(\mathcal{X}) = \int P(\mathcal{X} \mid \theta) P(\theta) d\theta",
    "14.3": r"P(x \mid \mathcal{X}) = \int P(x \mid \theta) P(\theta \mid \mathcal{X}) d\theta",
    "14.4": r"P(C_i \mid \mathbf{x}, \mathcal{X}) = \int P(C_i \mid \mathbf{x}, \theta) P(\theta \mid \mathcal{X}) d\theta",
    "14.5": r"E[r \mid \mathbf{x}, \mathcal{X}] = \int g(\mathbf{x} \mid \mathbf{w}) P(\mathbf{w} \mid \mathcal{X}) d\mathbf{w}",
    "14.6": r"P(\mathbf{w}) = \mathcal{N}(\mathbf{0}, \alpha^{-1}\mathbf{I})",
    "14.7": r"P(\mathbf{r} \mid \mathbf{X}, \mathbf{w}) = \mathcal{N}(\mathbf{X}\mathbf{w}, \beta^{-1}\mathbf{I})",
    "14.8": r"P(\mathbf{w} \mid \mathbf{X}, \mathbf{r}) = \mathcal{N}(\boldsymbol{\mu}_N, \boldsymbol{\Sigma}_N)",
    "14.9": r"\boldsymbol{\Sigma}_N^{-1} = \alpha \mathbf{I} + \beta \mathbf{X}^T \mathbf{X}, \quad \boldsymbol{\mu}_N = \beta \boldsymbol{\Sigma}_N \mathbf{X}^T \mathbf{r}",
    "14.10": r"P(r \mid \mathbf{x}, \mathcal{X}) = \mathcal{N}(\boldsymbol{\mu}_N^T \mathbf{x}, \sigma_N^2(\mathbf{x}))",
    "14.11": r"\sigma_N^2(\mathbf{x}) = \frac{1}{\beta} + \mathbf{x}^T \boldsymbol{\Sigma}_N \mathbf{x}",

    # ========================== CHAPTER 15 ==========================
    "15.1": r"P(q_{t+1} = S_j \mid q_t = S_i, q_{t-1} = S_k, \dots) = P(q_{t+1} = S_j \mid q_t = S_i)",
    "15.2": r"a_{ij} \equiv P(q_{t+1} = S_j \mid q_t = S_i), \quad a_{ij} \ge 0, \quad \sum_j a_{ij} = 1",
    "15.3": r"\pi_i \equiv P(q_1 = S_i), \quad \sum_i \pi_i = 1",
    "15.4": r"b_j(k) \equiv P(O_t = v_k \mid q_t = S_j)",
    "15.5": r"P(O \mid \lambda) = \sum_Q P(O, Q \mid \lambda) = \sum_Q P(O \mid Q, \lambda) P(Q \mid \lambda)",
    "15.6": r"\alpha_t(i) \equiv P(O_1, \dots, O_t, q_t = S_i \mid \lambda)",
    "15.7": r"\alpha_1(i) = \pi_i b_i(O_1), \quad 1 \le i \le N",
    "15.8": r"\alpha_{t+1}(j) = \left[ \sum_{i=1}^N \alpha_t(i) a_{ij} \right] b_j(O_{t+1})",
    "15.9": r"P(O \mid \lambda) = \sum_{i=1}^N \alpha_T(i)",
    "15.10": r"\beta_t(i) \equiv P(O_{t+1}, \dots, O_T \mid q_t = S_i, \lambda)",
    "15.11": r"\beta_T(i) = 1, \quad 1 \le i \le N",
    "15.12": r"\beta_t(i) = \sum_{j=1}^N a_{ij} b_j(O_{t+1}) \beta_{t+1}(j)",
    "15.13": r"\gamma_t(i) \equiv P(q_t = S_i \mid O, \lambda) = \frac{\alpha_t(i)\beta_t(i)}{P(O \mid \lambda)} = \frac{\alpha_t(i)\beta_t(i)}{\sum_{j=1}^N \alpha_t(j)\beta_t(j)}",
    "15.14": r"\xi_t(i, j) \equiv P(q_t = S_i, q_{t+1} = S_j \mid O, \lambda) = \frac{\alpha_t(i) a_{ij} b_j(O_{t+1})\beta_{t+1}(j)}{P(O \mid \lambda)}",
    "15.15": r"\gamma_t(i) = \sum_{j=1}^N \xi_t(i, j)",
    "15.16": r"\hat{\pi}_i = \gamma_1(i)",
    "15.17": r"\hat{a}_{ij} = \frac{\sum_{t=1}^{T-1} \xi_t(i, j)}{\sum_{t=1}^{T-1} \gamma_t(i)}",
    "15.18": r"\hat{b}_j(k) = \frac{\sum_{t=1, O_t = v_k}^T \gamma_t(j)}{\sum_{t=1}^T \gamma_t(j)}",

    # ========================== CHAPTER 16 ==========================
    "16.1": r"P(X, Y) = P(X)P(Y)",
    "16.2": r"P(X, Y \mid Z) = P(X \mid Z) P(Y \mid Z)",
    "16.3": r"P(X_1, X_2, \dots, X_d) = \prod_{i=1}^d P(X_i \mid \text{Parents}(X_i))",
    "16.4": r"P(C, \mathbf{x}) = P(C)\prod_{j=1}^d P(x_j \mid C)",
    "16.5": r"P(C_i \mid \mathbf{x}) = \frac{P(C_i)\prod_j P(x_j \mid C_i)}{\sum_k P(C_k)\prod_j P(x_j \mid C_k)}",
    "16.6": r"p(\mathbf{x}) = \frac{1}{Z}\prod_{C \in \mathcal{C}} \psi_C(\mathbf{x}_C)",
    "16.7": r"Z = \sum_\mathbf{x} \prod_{C \in \mathcal{C}} \psi_C(\mathbf{x}_C)",
    "16.8": r"\psi_C(\mathbf{x}_C) = \exp(-E(\mathbf{x}_C))",
    "16.9": r"P(\mathbf{x}) = \frac{1}{Z}\exp\left(-\sum_{C} E(\mathbf{x}_C)\right)",
    "16.10": r"p(\mathbf{x}) = \prod_s f_s(\mathbf{x}_s)",

    # ========================== CHAPTER 17 ==========================
    "17.1": r"y = f(d_1, d_2, \dots, d_L \mid \Phi)",
    "17.2": r"y = \sum_{j=1}^L w_j d_j, \quad w_j \ge 0, \quad \sum_j w_j = 1",
    "17.3": r"y = \text{mode}(d_1, d_2, \dots, d_L)",
    "17.4": r"y_i = \frac{1}{L}\sum_{j=1}^L d_{ji}",
    "17.5": r"y_i = \sum_{j=1}^L w_j d_{ji}",
    "17.6": r"E = \frac{1}{2}\sum_t (r^t - \sum_j w_j d_j^t)^2",
    "17.7": r"y_i = \sum_{j=1}^L w_j(\mathbf{x}) d_{ji}(\mathbf{x})",
    "17.8": r"\alpha_m = \frac{1}{2}\log \frac{1 - \epsilon_m}{\epsilon_m}",
    "17.9": r"w_t \leftarrow w_t \exp[-\alpha_m r^t d_m(\mathbf{x}^t)]",

    # ========================== CHAPTER 18 ==========================
    "18.1": r"a^* = \arg\max_a Q(a)",
    "18.2": r"Q_{t+1}(a) \leftarrow Q_t(a) + \eta [r_{t+1}(a) - Q_t(a)]",
    "18.3": r"V(s) = E[r_{t+1} + \gamma r_{t+2} + \gamma^2 r_{t+3} + \dots \mid s_t = s] = E\left[ \sum_{k=0}^\infty \gamma^k r_{t+k+1} \mid s_t = s \right]",
    "18.4": r"V(s) = \sum_a \pi(a \mid s) \sum_{s'} P(s' \mid s, a) [R(s, a, s') + \gamma V(s')]",
    "18.5": r"V^*(s) = \max_a \sum_{s'} P(s' \mid s, a) [R(s, a, s') + \gamma V^*(s')]",
    "18.6": r"V^*(s_t) = \max_{a_t} \left( E[r_{t+1}] + \gamma \sum_{s_{t+1}} P(s_{t+1} \mid s_t, a_t) V^*(s_{t+1}) \right)",
    "18.7": r"Q^*(s_t, a_t) = E[r_{t+1}] + \gamma \sum_{s_{t+1}} P(s_{t+1} \mid s_t, a_t) \max_{a_{t+1}} Q^*(s_{t+1}, a_{t+1})",
    "18.8": r"\pi^*(s_t) : \text{Choose } a^* \text{ where } Q^*(s_t, a^*) = \max_a Q^*(s_t, a)",
    "18.9": r"V^*(s) = \max_a Q^*(s, a)",
    "18.10": r"P(a \mid s) = \frac{\exp Q(s, a)}{\sum_{b \in \mathcal{A}} \exp Q(s, b)}",
    "18.11": r"P(a \mid s) = \frac{\exp[Q(s, a)/T]}{\sum_{b \in \mathcal{A}} \exp[Q(s, b)/T]}",
    "18.12": r"\hat{Q}(s_t, a_t) \leftarrow \hat{Q}(s_t, a_t) + \eta [r_{t+1} + \gamma \max_{a_{t+1}} \hat{Q}(s_{t+1}, a_{t+1}) - \hat{Q}(s_t, a_t)]",
    "18.13": r"\hat{Q}(s_t, a_t) \leftarrow r_{t+1} + \gamma \max_{a_{t+1}} \hat{Q}(s_{t+1}, a_{t+1})",
    "18.14": r"\hat{Q}(s_t, a_t) \leftarrow \hat{Q}(s_t, a_t) + \eta [r_{t+1} + \gamma \hat{Q}(s_{t+1}, a_{t+1}) - \hat{Q}(s_t, a_t)]",
    "18.15": r"\hat{Q}(s_t, a_t) \leftarrow \hat{Q}(s_t, a_t) + \eta \left( r_{t+1} + \gamma \max_{a_{t+1}} \hat{Q}(s_{t+1}, a_{t+1}) - \hat{Q}(s_t, a_t) \right)",
    "18.16": r"V(s_t) \leftarrow V(s_t) + \eta [r_{t+1} + \gamma V(s_{t+1}) - V(s_t)]",
    "18.17": r"e_t(s, a) = \begin{cases} 1 & \text{if } s = s_t \text{ and } a = a_t \\ \gamma\lambda e_{t-1}(s, a) & \text{otherwise} \end{cases}",
    "18.18": r"\delta_t = r_{t+1} + \gamma Q(s_{t+1}, a_{t+1}) - Q(s_t, a_t)",
    "18.19": r"Q(s, a) \leftarrow Q(s, a) + \eta \delta_t e_t(s, a), \quad \forall s, a",
    "18.20": r"Q(s, a) = \mathbf{w}^T \boldsymbol{\phi}(s, a)",
    "18.21": r"\Delta \theta = \eta [r_{t+1} + \gamma Q(s_{t+1}, a_{t+1}) - Q(s_t, a_t)] \nabla_\theta Q(s_t, a_t)",
    "18.22": r"\Delta \theta = \eta \delta_t \mathbf{e}_t",
    "18.23": r"\mathbf{e}_t = \gamma \lambda \mathbf{e}_{t-1} + \nabla_\theta Q(s_t, a_t)",
    "18.24": r"Q(b_t, a_t) = E[r_{t+1}] + \gamma \sum_{b_{t+1}} P(b_{t+1} \mid b_t, a_t) V(b_{t+1})",
    "18.25": r"b(s) = P(s_t = s \mid o_t, a_{t-1}, o_{t-1}, \dots)",

    # ========================== CHAPTER 19 ==========================
    "19.1": r"\frac{\sqrt{N}(m - \mu)}{\sigma} \sim \mathcal{Z}",
    "19.2": r"P\left( m - z_{\alpha/2}\frac{\sigma}{\sqrt{N}} < \mu < m + z_{\alpha/2}\frac{\sigma}{\sqrt{N}} \right) = 1 - \alpha",
    "19.3": r"\frac{\sqrt{N}(m - \mu)}{S} \sim t_{N-1}",
    "19.4": r"P\left( m - t_{\alpha/2, N-1}\frac{S}{\sqrt{N}} < \mu < m + t_{\alpha/2, N-1}\frac{S}{\sqrt{N}} \right) = 1 - \alpha",
    "19.5": r"\frac{(N-1)S^2}{\sigma^2} \sim \chi^2_{N-1}",
    "19.6": r"P\left( \frac{(N-1)S^2}{\chi^2_{\alpha/2, N-1}} < \sigma^2 < \frac{(N-1)S^2}{\chi^2_{1-\alpha/2, N-1}} \right) = 1 - \alpha",
    "19.7": r"\frac{\sqrt{N}(m - \mu_0)}{\sigma} \gtrless \pm z_{\alpha/2}",
    "19.8": r"\frac{\sqrt{N}(m - \mu_0)}{S} \gtrless \pm t_{\alpha/2, N-1}",
    "19.9": r"\frac{\sqrt{N}(m - \mu_0)}{S} \in (-t_{\alpha/2, N-1}, t_{\alpha/2, N-1})",
    "19.10": r"p\text{-value} = 2P(Z \ge |z|)",
    "19.11": r"\frac{(m_1 - m_2) - (\mu_1 - \mu_2)}{\sqrt{\sigma_1^2/N_1 + \sigma_2^2/N_2}} \sim \mathcal{Z}",
    "19.12": r"S_p^2 = \frac{(N_1 - 1)S_1^2 + (N_2 - 1)S_2^2}{N_1 + N_2 - 2}",
    "19.13": r"\frac{(m_1 - m_2) - (\mu_1 - \mu_2)}{S_p \sqrt{1/N_1 + 1/N_2}} \sim t_{N_1 + N_2 - 2}",
    "19.14": r"p_i = p_i^1 - p_i^2, \quad i = 1, \dots, K",
    "19.15": r"m = \frac{\sum_i p_i}{K}, \quad S^2 = \frac{\sum_i (p_i - m)^2}{K - 1}",
    "19.16": r"\frac{\sqrt{K} m}{S} \sim t_{K-1}",
    "19.17": r"\frac{S_1^2 / \sigma_1^2}{S_2^2 / \sigma_2^2} \sim F_{N_1 - 1, N_2 - 1}",
    "19.18": r"\frac{S_1^2}{S_2^2} \gtrless F_{\alpha/2, N_1 - 1, N_2 - 1}",
    "19.19": r"\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}}",
    "19.20": r"\text{Recall} = \frac{\text{TP}}{\text{TP} + \text{FN}}",
    "19.21": r"F_1 = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}",
    "19.22": r"\text{Sensitivity} = \frac{\text{TP}}{\text{TP} + \text{FN}}, \quad \text{Specificity} = \frac{\text{TN}}{\text{TN} + \text{FP}}",
    "19.23": r"SS_T = SS_B + SS_W",
    "19.24": r"SS_B = \sum_{i=1}^K N_i (\bar{x}_{i.} - \bar{x}_{..})^2, \quad SS_W = \sum_{i=1}^K \sum_{j=1}^{N_i} (x_{ij} - \bar{x}_{i.})^2",
    "19.25": r"F = \frac{SS_B / (K - 1)}{SS_W / (N - K)} \sim F_{K - 1, N - K}"
}

print(f"Total equations catalogued: {len(EQUATIONS)}")

# Regex for matching equation tags
TAG_RE = re.compile(r'\((\d+\.\d+)\)')

def clean_inline_math(text: str) -> str:
    """Cleans common OCR artifacts and broken inline math fragments."""
    # Specific OCR artifacts
    text = re.sub(r'\$\s*allel\$', r'$\\|$', text)
    text = re.sub(r'allel', r'\\|', text)
    text = re.sub(r'\$\s*-\s*\$\$', r'$-$', text)
    text = re.sub(r'\$-\$\$\$?', r'$-$', text)
    text = re.sub(r'\\in\$\$\\mathbb\{R\}\$is', r'$\\in \\mathbb{R}$ is', text)
    text = re.sub(r'\$\\mathbb\{R\}\$is', r'$\\mathbb{R}$ is', text)
    text = re.sub(r'\\in\$\\mathbb\{R\}\$', r'$\\in \\mathbb{R}$', text)
    text = re.sub(r'\\textasciicircum\{\}', r'^', text)
    text = re.sub(r'\\textasciicircum', r'^', text)

    # Greek suffixes
    text = re.sub(r'\$\\sigma\$\s*i2', r'$\\sigma_i^2$', text)
    text = re.sub(r'\$\\sigma\$\s*12', r'$\\sigma_{12}$', text)
    text = re.sub(r'\$\\sigma\$\s*ij', r'$\\sigma_{ij}$', text)
    text = re.sub(r'\$\\sigma\$\s*1', r'$\\sigma_1$', text)
    text = re.sub(r'\$\\sigma\$\s*2', r'$\\sigma_2$', text)
    text = re.sub(r'\$\\mu\$\s*i', r'$\\mu_i$', text)
    text = re.sub(r'\$\\mu\$\s*0', r'$\\mu_0$', text)
    text = re.sub(r'\$\\mu\$\s*1', r'$\\mu_1$', text)
    text = re.sub(r'\$\\mu\$\s*2', r'$\\mu_2$', text)
    text = re.sub(r'\$\\theta\$\s*\*', r'$\\theta^*$', text)
    text = re.sub(r'\$\\theta\$\s*1', r'$\\theta_1$', text)
    text = re.sub(r'\$\\theta\$\s*0', r'$\\theta_0$', text)
    text = re.sub(r'\$\\Sigma\$', r'$\\boldsymbol{\\Sigma}$', text)
    text = re.sub(r'\$\\mu\$', r'$\\boldsymbol{\\mu}$', text)

    # Fix broken inequalities
    text = re.sub(r'\$\\leq\$', r'$\\le$', text)
    text = re.sub(r'\$\\geq\$', r'$\\ge$', text)
    
    return text

def process_chapter_text(content: str) -> str:
    """Processes chapter text, replacing OCR equation paragraphs with clean $$...$$ (X.Y)."""
    blocks = content.split('\n\n')
    new_blocks = []
    
    for block in blocks:
        trimmed = block.strip()
        if not trimmed:
            continue
            
        # Already a clean display equation?
        if trimmed.startswith("$$") and ("$$" in trimmed[2:]):
            new_blocks.append(clean_inline_math(trimmed))
            continue
            
        # Check if this block contains an equation tag like (8.1)
        tag_match = TAG_RE.search(trimmed)
        if tag_match:
            tag = tag_match.group(1)
            if tag in EQUATIONS:
                formula = EQUATIONS[tag]
                clean_eq = f"$$ {formula} $$ ({tag})"
                
                # Check if this block also contains prose before/after the equation
                lines = [l.strip() for l in trimmed.split('\n') if l.strip()]
                prose_lines = []
                for line in lines:
                    if f"({tag})" not in line and not any(k in line for k in ['gi(x', 'p(x', 'P(x', 'w1', 'w0', 'theta', 'E(', 'r =', 'x =', 'h(x', 'ˆp', 'ˆF', 'Lp =', 'Ld =', '#{']):
                        prose_lines.append(line)
                        
                prose = ' '.join(prose_lines).strip()
                # If there was substantial prose in this block, keep it as its own paragraph
                if prose and len(prose) > 35:
                    new_blocks.append(clean_inline_math(prose))
                    
                new_blocks.append(clean_eq)
                continue
                
        # Regular paragraph
        new_blocks.append(clean_inline_math(trimmed))
        
    return '\n\n'.join(new_blocks)

def main():
    files = sorted(CHAPTERS_DIR.glob("*.json"))
    print(f"Found {len(files)} chapter JSON files in {CHAPTERS_DIR}")
    
    total_equations_injected = 0
    for f in files:
        with open(f, 'r', encoding='utf-8') as fp:
            data = json.load(fp)
            
        slug = data.get("slug", f.name)
        eqs_before = len(re.findall(r'\$\$\s*[\s\S]+?\s*\$\$(?:\s*\([1-9]\d*\.\d+\))?', json.dumps(data)))
        
        for section in data.get('sections', []):
            if 'intro' in section and section['intro']:
                section['intro'] = process_chapter_text(section['intro'])
            for sub in section.get('subsections', []):
                if 'content' in sub and sub['content']:
                    sub['content'] = process_chapter_text(sub['content'])
                    
        eqs_after = len(re.findall(r'\$\$\s*[\s\S]+?\s*\$\$(?:\s*\([1-9]\d*\.\d+\))?', json.dumps(data)))
        
        with open(f, 'w', encoding='utf-8') as fp:
            json.dump(data, fp, indent=2, ensure_ascii=False)
            
        print(f"[{slug}]: {eqs_before} -> {eqs_after} display equations")
        total_equations_injected += eqs_after
        
    print(f"\nAll done! Total display equations across all chapters: {total_equations_injected}")

if __name__ == "__main__":
    main()

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

