import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import { turnAudioOff } from '../utitlities/audio-functions.js';

const jssClasses = {
    fileOptions: {
        marginTop: '10px',
    },
    filePicker: {
        marginRight: '10px',
    }
};

@injectSheet(jssClasses)
export default class FileSelect extends Component {
    constructor(props) {
        super(props);

        this.onButton = this.onButton.bind(this);

        this.fileReader = undefined;

        this.state = {
            sonifying: false,
        };
    }

    onButton() {
        const sonifying = !this.state.sonifying;
        this.setState({sonifying});

        if (sonifying) {
            this.props.onSonify();
        } else {
            turnAudioOff();
        }
    }

    componentDidMount() {
        // Check for the various File API support.
        if (!window.File || !window.FileReader) {
            console.error('This browser does not support the File API; unable to load image.');
        }
        else {
            this.fileReader = new FileReader();
            this.fileReader.onload = (evt) => {
                this.props.onImgSelect(evt.target.result);
            };
        }

        this.fileSelect.addEventListener('change', (evt) => {
            const files = evt.target.files;
            const file = files[0];
            if (!file) { // File selection was cancelled
                return;
            }
            this.fileReader.readAsDataURL(file);
        });
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <div className={classes.fileOptions}>
                <input ref={fileSelect => this.fileSelect = fileSelect} id='file' className='hidden' type='file' name='file' accept='image/x-png, image/gif, image/jpeg'/>
                <label id='file-selector' htmlFor='file' type='button' className={`${classes.filePicker} btn btn-default`}>Choose/Drag Image</label>
                <button id='sonify-button' onClick={this.onButton} type='button' className='btn btn-primary'>{this.state.sonifying ? 'Stop' : 'Sonify'}</button>
            </div>
        );
    }
}

FileSelect.propTypes = {
    sheet: PropTypes.object,
    children: PropTypes.node,
    onImgSelect: PropTypes.func,
    onSonify: PropTypes.func,
    onStop: PropTypes.func,
};
