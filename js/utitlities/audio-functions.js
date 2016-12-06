import fourier from 'fourier';

function isPowerOf2(number) {
    return number>0 && ((number & (number-1)) == 0);
}

export class Range {
    constructor(xs, ys, width, height) {
        this.xs = xs;
        this.ys = ys;
        this.width = width;
        this.height = height;
    }
}

export const audioContext = new AudioContext();
export const analyzer = audioContext.createAnalyser();
analyzer.connect(audioContext.destination);
let periodicWave = audioContext.createOscillator();
periodicWave.start(0);

export let wholeWave = [];
export let joinedWave = [];
export let joinedWaveWidth = 0;
export let joinedWaveHeight = 0;
export function convertImage(imgData, sectionRange, storeAsWhole) {
    if (!imgData) {
        return;
    }

    let data = imgData.data;
    joinedWaveWidth = imgData.width;
    joinedWaveHeight = imgData.height;

    if (sectionRange) {
        joinedWaveWidth = sectionRange.width;
        joinedWaveHeight = sectionRange.height;
        // The section's height can't be larger than the imgData's
        if (joinedWaveHeight > imgData.height - sectionRange.ys) {
            joinedWaveHeight = imgData.height - sectionRange.ys;
        }
        // Set imgData to just the section we're interested in
        const col = sectionRange.xs;
        const row = sectionRange.ys;
        const startIndex = row*imgData.width*4 + col*4;
        const endIndex = startIndex + imgData.width*joinedWaveHeight*4 + joinedWaveWidth*4;
        data = data.slice(startIndex, endIndex);
    }

    // Separate each column of pixels into its own frequency spectrum of reals
    const columnReals = [];
    for (let col = 0; col < joinedWaveWidth; col++) {
        let colReal = [];
        for (let row = 0; row < joinedWaveHeight; row++) {
            const red = data[row*imgData.width*4 + col*4];
            const green = data[row*imgData.width*4 + col*4 + 1];
            const blue = data[row*imgData.width*4 + col*4 + 2];
            colReal[row] = (1/3)*(red + green + blue);
        }
        columnReals[col] = colReal;
    }

    let dsp = new FFT(columnReals[0].length);
    const zeros = new Float32Array(columnReals[0].length);
    joinedWave = [];
    for (let col = 0; col < columnReals.length; col++) {
        // Inverse transform column spectrums to time domain
        let timeDomainWave;
        if (!isPowerOf2(joinedWaveWidth) || !isPowerOf2(joinedWaveHeight)) {
            timeDomainWave = fourier.idft(columnReals[col], zeros)[0];
        }
        else {
            timeDomainWave = dsp.inverse(columnReals[col], zeros);
        }
        // Then add the waves together one after another
        joinedWave = joinedWave.concat(Array.from(timeDomainWave));
    }

    if (storeAsWhole) {
        wholeWave = joinedWave.slice(0);
    }
}

export function sonifyImgData(imgData, period, sectionRange) {
    if (!imgData) {
        return;
    }

    convertImage(imgData, sectionRange);

    // Fourier transform to get the joined wave as a spectrum so we can pass it to createPeriodicWave
    // We could avoid this unnecessary transform if we knew how createPeriodicWave produces
    // the wave's table, but sadly, we don't >:(
    let dsp;
    if (!isPowerOf2(joinedWaveWidth) || !isPowerOf2(joinedWaveHeight)) {
        dsp = new DFT(joinedWave.length);
    }
    else { // Can accelerate using inverse FFT instead of DFT if it's a perfect square
        dsp = new FFT(joinedWave.length);
    }
    dsp.forward(joinedWave);
    const waveTable = audioContext.createPeriodicWave(Float32Array.from(dsp.real), Float32Array.from(dsp.imag));
    periodicWave.setPeriodicWave(waveTable);
    changeTotalPeriod(period);
    turnAudioOn();
}

export function turnAudioOn() {
    periodicWave.connect(analyzer);
}

export function turnAudioOff() {
    periodicWave.disconnect(analyzer);
}

export function changeTotalPeriod(period) {
    periodicWave.frequency.value = 1/period;
}