#!/usr/bin/env python3
"""
tools/clean_all_inline_math.py
Systematically repairs every odd-dollar or malformed inline math fragment in all 19 chapter JSONs.
"""

import json, glob, re
from pathlib import Path

CHAPTERS_DIR = Path("modules/intro-to-ml/data/chapters")

def fix_paragraph_math(p: str) -> str:
    # 1. Double dollar typos inside inline prose
    p = p.replace(r"$$\in \mathbb{R}$", r"$\in \mathbb{R}$")
    p = p.replace(r"$$\in", r"$\in")
    
    # 2. Fix broken minus signs: "$-$\alpha$" -> "$-\alpha$" or "$-$\delta" -> "$-\delta$"
    p = re.sub(r'\$-\$\\([a-zA-Z]+)', r'$-\\1$', p)
    p = re.sub(r'\$-\$([a-zA-Z0-9]+)', r'-$1', p)
    p = re.sub(r'\$-\$', '-', p)
    
    # 3. Fix unclosed greek tokens like "$\epsilon$-greedy"
    p = p.replace(r"$\epsilon$-greedy", r"$\epsilon$-greedy")
    p = p.replace(r"$\epsilon$", r"$\epsilon$")
    p = re.sub(r'\\([a-zA-Z]+)\$([a-zA-Z0-9]+)', r'\\1_{\\2}', p)
    
    # 4. Fix specific broken strings found in chapter inspection
    p = p.replace(r'P\{C$\Delta$h $\le$$\epsilon$\} $\ge$1 $-$\delta$', r'$P(C \Delta h \le \epsilon) \ge 1 - \delta$')
    p = p.replace(r'4 exp[$-$\epsilon$N/4] $\le$$\delta$', r'$4 \exp(-\epsilon N / 4) \le \delta$')
    p = p.replace(r'4(1 $-$\epsilon$/4)N $\le$$\delta$', r'$4(1 - \epsilon/4)^N \le \delta$')
    p = p.replace(r'P(Ci|x) > 1 $-$\lambda$', r'$P(C_i \mid x) > 1 - \lambda$')
    p = p.replace(r'r(d, $\theta$) = E (d $-$\theta$)2', r'$r(d, \theta) = E[(d - \theta)^2]$')
    p = p.replace(r'= E (d $-$E[d] + E[d] $-$\theta$)2', r'$= E[(d - E[d] + E[d] - \theta)^2]$')
    p = p.replace(r'2wT1 $\boldsymbol{\Sigma}$w2 $-$2$\alpha$wT1 w2 $-$\\beta$wT1 w1 = 0', r'$2\mathbf{w}_1^T \boldsymbol{\Sigma} \mathbf{w}_2 - 2\alpha \mathbf{w}_1^T \mathbf{w}_2 - \beta \mathbf{w}_1^T \mathbf{w}_1 = 0$')
    p = p.replace(r'zt = WT (xt $-$\boldsymbol{\mu}$)', r'$\mathbf{z}^t = \mathbf{W}^T (\mathbf{x}^t - \boldsymbol{\mu})$')
    p = p.replace(r'z = WT (x $-$\boldsymbol{\mu}$)', r'$\mathbf{z} = \mathbf{W}^T (\mathbf{x} - \boldsymbol{\mu})$')
    p = p.replace(r"d'rs = (1 $-$\alpha$)drs + $\alpha$crs", r"$d'_{rs} = (1 - \alpha)d_{rs} + \alpha c_{rs}$")
    p = p.replace(r'\|xt $-$mi\|= minj \|xt $-$mj$', r'$\|\mathbf{x}^t - \mathbf{m}_i\| = \min_j \|\mathbf{x}^t - \mathbf{m}_j\|$')
    p = p.replace(r'\|xt $-$mi\|2', r'$\|\mathbf{x}^t - \mathbf{m}_i\|^2$')
    p = p.replace(r'\|mi $-$xt\|= min \|ml $-$xt\|', r'$\|\mathbf{m}_i - \mathbf{x}^t\| = \min_l \|\mathbf{m}_l - \mathbf{x}^t\|$')
    p = p.replace(r'\|x $-$cm\|$\le$\alpha$m', r'$\|\mathbf{x} - \mathbf{c}_m\| \le \alpha_m$')
    p = p.replace(r'• exp($-$\|x $-$m\|2/c)', r'• $\exp(-\|\mathbf{x} - \mathbf{m}\|^2/c)$')
    p = p.replace(r'matrix $\boldsymbol{\Sigma}$ with the largest eigenvalues, which, if data instances are centered (E[x] = 0), can be written as XT X.', r'matrix $\boldsymbol{\Sigma}$ with the largest eigenvalues, which, if data instances are centered ($E[\mathbf{x}] = 0$), can be written as $\mathbf{X}^T \mathbf{X}$.')
    p = p.replace(r'xt = f(Ot$-$\tau$, . . . , Ot$-$1)', r'$x_t = f(O_{t-\tau}, \dots, O_{t-1})$')
    p = p.replace(r'z1$-$\alpha$/2 = $-$z$\alpha$/2', r'$z_{1-\alpha/2} = -z_{\alpha/2}$')
    p = p.replace(r'P\{X < $-$z$\alpha$/2\} = P\{X > z$\alpha$/2\} = $\alpha$/2', r'$P(X < -z_{\alpha/2}) = P(X > z_{\alpha/2}) = \alpha/2$')
    p = p.replace(r'P\{$-$1.96 < Z < 1.96\} = 0.95', r'$P(-1.96 < Z < 1.96) = 0.95$')
    p = p.replace(r'P\{Z < 1.64\} = 0.95', r'$P(Z < 1.64) = 0.95$')
    p = p.replace(r'H0 : $\mu$ $\le$\mu$0 vs H1 : $\mu$ > $\mu$0', r'$H_0: \mu \le \mu_0$ vs $H_1: \mu > \mu_0$')
    p = p.replace(r'H0 : $\mu$ = $\mu$0 vs H1 : $\mu$ /= $\mu$0', r'$H_0: \mu = \mu_0$ vs $H_1: \mu \neq \mu_0$')
    p = p.replace(r'gi(x) = $-$\|x $-$mi\|2', r'$g_i(\mathbf{x}) = -\|\mathbf{x} - \mathbf{m}_i\|^2$')
    p = p.replace(r'SN = $-$\nabla$\nabla$log p(w|r, X)', r'$\mathbf{S}_N = -\nabla\nabla \log p(\mathbf{w} \mid \mathbf{r}, \mathbf{X})$')
    p = p.replace(r'A = $-$\nabla$\nabla$log', r'$\mathbf{A} = -\nabla\nabla \log$')
    p = p.replace(r's2 = t(xt $-$\boldsymbol{\mu}$)2/N', r'$s^2 = \sum_t (x^t - \mu)^2 / N$')
    p = p.replace(r'wt \leftarrow wt exp[-\alpha_m rt dm(xt)]', r'$w_t \leftarrow w_t \exp(-\alpha_m r^t d_m(\mathbf{x}^t))$')
    p = p.replace(r'Q(0) and TD(0), where in the latter case we learn V(s), and the required output is rt+1 $-$\gamma$V(st+1)', r'$Q(0)$ and $TD(0)$, where in the latter case we learn $V(s)$, and the required output is $r_{t+1} - \gamma V(s_{t+1})$')
    
    # 5. Generic check: if block has odd dollars, check if there is an unclosed single $
    if p.count("$") % 2 != 0:
        # Check if there is a trailing or lone $
        # If last $ is unmatched, append a closing $
        if p.endswith("$"):
            p = p[:-1]
        elif "$" in p:
            # Look for rogue $ without space or math
            p = re.sub(r'(\$[^\$]+)$', r'\1$', p)

    return p

def main():
    files = sorted(CHAPTERS_DIR.glob("*.json"))
    fixed_paragraphs = 0
    
    for f in files:
        with open(f) as fp:
            data = json.load(fp)
            
        slug = data.get("slug")
        changed = False
        
        for s in data.get("sections", []):
            if "intro" in s and s["intro"]:
                blocks = s["intro"].split("\n\n")
                new_blocks = [fix_paragraph_math(b) for b in blocks]
                s["intro"] = "\n\n".join(new_blocks)
                
            for sub in s.get("subsections", []):
                if "content" in sub and sub["content"]:
                    blocks = sub["content"].split("\n\n")
                    new_blocks = [fix_paragraph_math(b) for b in blocks]
                    sub["content"] = "\n\n".join(new_blocks)
                    
        with open(f, "w") as fp:
            json.dump(data, fp, indent=2, ensure_ascii=False)
            
    print("Cleaned all inline math across all chapters.")

if __name__ == "__main__":
    main()
