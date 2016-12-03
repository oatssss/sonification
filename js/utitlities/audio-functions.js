export class Range {
    constructor(xs, ys, width, height) {
        this.xs = xs;
        this.ys = ys;
        this.width = width;
        this.height = height;
    }
}

export const audioContext = new AudioContext();
let periodicWave = audioContext.createOscillator();
periodicWave.start(0);

let currentImgData;
let currentColumnPeriod;
export function sonifyImgData(imgData, period, sectionRange) {
    let data = imgData.data;
    let width = imgData.width;
    let height = imgData.height;

    if (sectionRange) {
        width = sectionRange.width;
        height = sectionRange.height;
        // Set imgData to just the section we're interested in
        const col = sectionRange.x;
        const row = sectionRange.y;
        const startIndex = clampedRowIndex(row, width) + col;
        const endIndex = startIndex + width*height*4;
        data = data.slice(startIndex,endIndex);
    }

    // Separate each column of pixels into its own frequency spectrum of reals
    const columnReals = [];
    for (let col = 0; col < width; col++) {
        let colReal = [];
        for (let row = 0; row < height; row++) {
            // Store the RGB values into the real array
            // colReal[row*3]     = data[row*width*4 + col*4];
            // colReal[row*3 + 1] = data[row*width*4 + col*4 + 1];
            // colReal[row*3 + 2] = data[row*width*4 + col*4 + 2];
            const red = data[row*width*4 + col*4];
            const green = data[row*width*4 + col*4 + 1];
            const blue = data[row*width*4 + col*4 + 2];
            colReal[row] = (1/3)*(red + green + blue);
        }
        columnReals[col] = colReal;
    }

    let dsp = new FFT(columnReals[0].length);
    const zeros = new Float32Array(columnReals[0].length);
    let joinedWave = [];
    for (let col = 0; col < columnReals.length; col++) {
        // Inverse transform column spectrums to time domain
        const timeDomainWave = dsp.inverse(columnReals[col], zeros);
        // Then add the waves together one after another
        joinedWave = joinedWave.concat(Array.from(timeDomainWave));
    }

    // Fourier transform to get the joined wave as a spectrum so we can pass it to createPeriodicWave
    // We could avoid this unnecessary transform if we knew how createPeriodicWave produces
    // the wave's table, but sadly, we don't >:(
    dsp = new FFT(joinedWave.length);
    dsp.forward(joinedWave);
    const waveTable = audioContext.createPeriodicWave(Float32Array.from(dsp.real), Float32Array.from(dsp.imag));
    periodicWave.setPeriodicWave(waveTable);
    changeColumnPeriod(period);
    turnAudioOn();
}

export function turnAudioOn() {
    periodicWave.connect(audioContext.destination);
}

export function turnAudioOff() {
    periodicWave.disconnect(audioContext.destination);
}

export function changeColumnPeriod(period) {
    periodicWave.frequency.value = 1/period;
}