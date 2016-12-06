export const idft1 = `
# Background
---
###### Signal Correlation

We can calculate how similar two signals are with the following formula:

FORMULA

Explanation:
```
x and y are signals with N samples. If the signals are similar, then x(i) will be positive at the same time y(i) is positive. Likewise, x(i) will be negative if y(i) is negative. For both cases, the product of x(i)*y(i) will be positive (positive*positive=positive and negative*negative=positive). This means the more similar the two signals are, the higher the sum will be.
```
`;

export const idft2 = `
###### Discrete Fourier Transform (DFT)

The formula for the discrete fourier transform is:
`;

export const idft3 = `
An identity exists that allows us to rewrite this as:
`;

export const idft4 = `
The rewritten discrete fourier transform makes it more obvious that we are actually calculating correlations. The cosine sum finds the correlation between the signal and cosines of various frequencies while the sine term does the same for sines of various frequencies. Each term in the sum corresponds to the amplitude of the real (cosine) and imaginary (sine) parts of the signal.

Performing the DFT on a signal deconstructs it into its harmonic components (real part) and associated phase shifts (imaginary part). The inverse discrete fourier transform (IDFT) combines the harmonics and phase shifts into a time-domain signal. In other words, the DFT maps from the time-domain to the frequency domain while the IDFT maps from the frequency domain to the time-domain. It's important to be able to convert between the two domains because speakers can only understand signals in the time-domain, but it's often easier and more interesting to manipulate a signal in the frequency domain. 
`;