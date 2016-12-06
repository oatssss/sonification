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
                    <BlockMath math={'\\sum_{i=0}^{N}x(i) y(i)'}/>
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
                                    For both cases, the product of <InlineMath>x(i)y(i)</InlineMath> will be positive (since <InlineMath>pos*pos=neg</InlineMath> and <InlineMath>neg*neg=pos</InlineMath>).
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
                </ol>
            </div>
        );
    }
}
