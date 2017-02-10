import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import { InlineMath, BlockMath } from 'react-katex';
import { Collapse, Well, Button } from 'react-bootstrap';

const jssClasses = {
    description: {
        marginTop: '20px',
        padding: '0 20px',
        width: '100%',
        maxWidth: '800px',
    },
};

@injectSheet(jssClasses)
export default class IDFTDescription extends Component {
    static propTypes = {
        sheet: PropTypes.object,
        children: PropTypes.node
    };

    constructor(props) {
        super(props);

        this.state = {
            explanation: false,
        };
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <div className={classes.description}>
                <h1>Interface</h1>
                <hr/>
                <h5>Periodicity Slider</h5>
                <div style={{margin:'0 20px 20px 20px'}}>
                    <p>
                        Adjusts the signal's frequency/period.
                    </p>
                </div>
                <h5><b><i>Live</i></b> Oscilloscope</h5>
                <div style={{margin:'0 20px 20px 20px'}}>
                    <p>
                        A live time-domain graph of the current playing signal.
                    </p>
                </div>
                <h5><b><i>All Columns</i></b> Oscilloscope</h5>
                <div style={{margin:'0 20px 20px 20px'}}>
                    <p>
                        A time-domain graph of the concatenated signal.
                        This signal is constructed by adding together each column's individual signal.
                    </p>
                    <p>
                        Each column's signal spans a width of pixels equal to the current image size's width.
                    </p>
                </div>
                <h5><b><i>Highlighted Section</i></b> Oscilloscope</h5>
                <div style={{margin:'0 20px 20px 20px'}}>
                    <p>
                        A time-domain graph of the signal produced by concatenating the columns in the user-highlighted area.
                        If no area is highlighted, it is equal to the <b><i>All Columns</i></b> Oscilloscope.
                    </p>
                    <p>
                        Each column's signal spans a width of pixels equal to the section's width.
                    </p>
                    <p>
                        This oscilloscope not functioning correctly at the moment.
                    </p>
                </div>
                <h1>Background</h1>
                <hr/>
                <h4>Signal Correlation</h4>
                <div style={{margin:'0 20px 20px 20px'}}>
                    <p>
                        We can calculate how similar two signals are with the following formula:
                    </p>
                    <BlockMath math={'\\sum_{i=0}^{N}x(i) y(i)'}>ASDF</BlockMath>
                    <BlockMath math={'\\begin{aligned}x &= \\text{signal }x \\\\ y &= \\text{signal }y \\\\ i &= i\\text{th sample} \\\\ N &= \\text{total number of samples} \\end{aligned}'}/>
                    <p>
                        Larger values equate to stronger correlation.
                        Values close to zero mean the two signals aren't very similar at all.
                        For large negative values, the signals are similar, but flipped with respect to each other.
                    </p>
                    <Button onClick={() => this.setState({explanation:!this.state.explanation})}>
                        Explanation
                    </Button>
                    <Collapse in={this.state.explanation}>
                        <div>
                            <Well>
                                <p>
                                    <InlineMath>x</InlineMath> and <InlineMath>y</InlineMath> are signals with <InlineMath>N</InlineMath> samples.
                                    If the signals are similar, then <InlineMath>x(i)</InlineMath> will be positive at the same time <InlineMath>y(i)</InlineMath> is positive.
                                    Likewise, <InlineMath>x(i)</InlineMath> will be negative if <InlineMath>y(i)</InlineMath> is negative.
                                    For both cases, the product of <InlineMath>x(i)y(i)</InlineMath> will be positive (since <InlineMath>pos*pos=pos</InlineMath> and <InlineMath>neg*neg=pos</InlineMath>).
                                    Therefore, very similar signals will have very high sums.
                                </p>
                            </Well>
                        </div>
                    </Collapse>
                </div>
                <h4>Discrete Fourier Transform (DFT)</h4>
                <div style={{margin:'0 20px 20px 20px'}}>
                    <p>
                        The formula for the <a href={`https://en.wikipedia.org/wiki/Discrete_Fourier_transform`} target='_blank'>discrete fourier transform</a> is:
                    </p>
                    <BlockMath math={'X_k=\\sum_{n=0}^{N-1}x_n e^{-2 \\pi k n/N}'}/>
                    <BlockMath math={'\\begin{aligned}N &= \\text{Total number of time samples} \\\\ n &= n\\text{th sample} \\\\ x_n &= \\text{Amplitude at }n\\text{th time sample} \\\\ k &= k\\text{th harmonic} \\\\ X_k &= \\text{Amount of }k\\text{th harmonic (amplitude and phase)}\\end{aligned}'}/>
                    <p>
                        An identity <a href={`https://en.wikipedia.org/wiki/Euler's_formula`} target='_blank'>exists</a> that allows us to rewrite this as:
                    </p>
                    <BlockMath math={'X_k=\\sum_{n=0}^{N-1}x_n cos(\\frac{2 \\pi k n}{N})-i \\sum_{n=0}^{N-1}x_n sin(\\frac{2 \\pi k n}{N})'}/>
                    <p>
                        The rewritten discrete fourier transform makes it more obvious that we are actually calculating correlations.
                        The cosine sum finds the correlation between the signal and cosines of various frequencies while the sine term does the same for sines of various frequencies.
                        Each term in the sum corresponds to the amplitude of the real (cosine) and imaginary (sine) parts of the signal.
                    </p>
                    <p>
                        Performing the DFT on a signal deconstructs it into its harmonic components (real part) and associated phase shifts (imaginary part).
                        The inverse discrete fourier transform (IDFT) combines the harmonics and phase shifts into a time-domain signal.
                        In other words, the DFT maps from the time-domain to the frequency domain while the IDFT maps from the frequency domain to the time-domain.
                        It's important to be able to convert between the two domains because speakers can only understand signals in the time-domain, but it's often easier and more interesting to manipulate a signal in the frequency domain.
                    </p>
                </div>
                <h1>Approach</h1>
                <hr/>
                <ol>
                    <li>
                        For each column of pixels
                        <ol>
                            <li>
                                The RGB value of the pixel at row <InlineMath>i</InlineMath> dictates the amplitude of the <InlineMath>i</InlineMath>th harmonic
                                <ul>
                                    <li>
                                        Amplitude is calculated by giving equal weight to each colour component and summing to a maximum of 1
                                    </li>
                                    <li>
                                        Exact formula: <InlineMath>(1/3)(R+G+B)(1/255)</InlineMath>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                The column is now an array where the <InlineMath>i</InlineMath>th element is the amplitude of the <InlineMath>i</InlineMath>th harmonic
                            </li>
                            <li>
                                Perform IDFT on the column to get a time-domain signal corresponding to these harmonics
                            </li>
                        </ol>
                    </li>
                    <li>
                        Concatenate each column's signal into one huge time-domain signal. This joined signal "spans" all the columns.
                    </li>
                    <li>
                        Perform a DFT on the signal to get its frequency components.
                    </li>
                    <li>
                        Set signalReal[0] = 0 and signalImage[0] = 0 for no DC offset.
                    </li>
                    <li>
                        Use the Web Audio API's createPeriodicWave() to run an IDFT over the components and reconstruct the concatenated signal.
                    </li>
                </ol>
                <p>
                    Steps 3-5 are necessary due to the nature of wavetable oscillation within the browser.
                    We don't know the implementation details of createPeriodicWave() so we cannot replicate the
                    time-domain signal it produces using our own methods. Instead, we must call it with arguments its familiar with.
                </p>
                <h1>Technology Used</h1>
                <hr/>
                <ul>
                    <li>
                        <a href='https://github.com/corbanbrook/dsp.js/' target='_blank'>dsp.js</a> - Digital Sound Processing JavaScript library
                    </li>
                    <li>
                        <a href='https://facebook.github.io/react/' target='_blank'>React</a>,
                        <a href='http://getbootstrap.com/' target='_blank'>Bootstrap</a>,
                        <a href='http://www.material-ui.com/' target='_blank'>Material UI</a>,
                        and the <a href='https://konvajs.github.io/docs/' target='_blank'>Konva</a> HTML5 Canvas construct the interface components
                    </li>
                    <li>
                        <a href='https://github.com/cssinjs/jss' target='_blank'>JSS</a> - CSS styles within JS (plus a bunch of other CSS features)
                    </li>
                    <li>
                        <a href='https://khan.github.io/KaTeX/' target='_blank'>KaTeX</a> - LaTeX-like math rendering in the browser
                    </li>
                    <li>
                        <a href='https://babeljs.io/' target='_blank'>Babel</a> - Transpile es2015+ to javascript that current browsers understand
                    </li>
                    <li>
                        <a href='http://browserify.org/' target='_blank'>Browserify</a> - Concatenate all js files into a single bundle.js
                    </li>
                    <li>
                        <a href='http://gulpjs.com/' target='_blank'>Gulp</a> - Automated build tasks

                    </li>
                </ul>
                <p>
                    And of course, none of this would be possible without <a href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API' target='_blank'>Web Audio API</a> support within the browser. This allows us to create wavetable oscillators
                    that playback through the device's speakers.
                </p>
                <h1>Challenges</h1>
                <hr/>
                <ul>
                    <li>
                        The <i>Highlighted Section</i> oscilloscope is buggy and isn't always correct
                    </li>
                    <li>
                        The naive DFT becomes slow for images larger than 256x256 pixels, but the Fast Fourier Transform only works with perfect squares
                    </li>
                    <li>
                        Web development in general - writing program logic and designing an interface at the same time, not to mention the difficulty with trying to figure out css styles (esp. centering)
                    </li>
                </ul>
                <h1>Future Work</h1>
                <hr/>
                <h5><b>Different Algorithms for Calculating the Harmonic Spectrum</b></h5>
                <div style={{margin:'0 20px 20px 20px'}}>
                    <p>
                        Currently, the amplitudes of the signal's harmonic components are calculated using a very basic method,
                        but this can be as complex as we like. There's lots of potential in finding a method to map images
                        to more interesting sounds.
                    </p>
                    <p>
                        Additionally, since the current algorithm gives equal weight to each colour component in the sum,
                        an image will produce the same signal as its black/white counterpart. A better algorithm might be
                        designed that gives more importance to varying colours in an image.
                    </p>
                </div>
                <h5><b>Higher Level Approaches</b></h5>
                <div style={{margin:'0 20px 20px 20px'}}>
                    <p>
                        Forming the signal for an image by mapping its pixels to frequency components achieves the objective
                        in a very literal manner. We can explore the use of the Google Vision API and its ability to map an
                        image to related words, effectively generalizing the task of sonifying images to sonifying data.
                    </p>
                    <p>
                        An interesting task would be to try and acquire the emotional content of an image as this would
                        allow us to map images to musical scales.
                    </p>
                </div>
            </div>
        );
    }
}
