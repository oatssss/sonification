import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import ResponsiveCanvas from './ResponsiveCanvas.jsx';
import hocRef from '../utitlities/HOCRefDecorator.jsx';
import {Range} from '../utitlities/audio-functions.js';

const jssClasses = {};

@injectSheet(jssClasses)
@hocRef
export default class InteractableCanvas extends ResponsiveCanvas {
    constructor(props) {
        super(props);

        this.drawHighlightColumn  = this.drawHighlightColumn.bind(this);
        this.eraseHighlightColumn = this.eraseHighlightColumn.bind(this);
        this.moveHighlightColumn  = this.moveHighlightColumn.bind(this);
        this.selectColumn         = this.selectColumn.bind(this);
        this.deselectColumn       = this.deselectColumn.bind(this);
        this.drawSection          = this.drawSection.bind(this);
        this.stretchSection       = this.stretchSection.bind(this);
        this.selectSection        = this.selectSection.bind(this);
        this.deselectSection      = this.deselectSection.bind(this);
        this._calcMousePixelX     = this._calcMousePixelX.bind(this);
    }

    componentDidMount() {
        // ResponsiveCanvas has an HOC wrapper,
        // so the actual canvas is a member within ResponsiveCanvas
        // under the name 'canvas'
        this.canvas = this.canvas.canvas;

        // Setup column border drawing around the cursor
        this.columnHighlight = new Konva.Rect({
            width: this.props.canvasSize/this.props.imgSize + 2,
            height: this.canvas.stage.height(),
            stroke: 'rgb(255,0,0)',
            strokeWidth: 1,
        });
        this.columnHighlightLayer = new Konva.Layer();
        this.columnHighlightLayer.add(this.columnHighlight);
        this.columnHighlightLayer.hide();
        this.canvas.stage.add(this.columnHighlightLayer);
        this.canvas.stage.on('contentMouseover', this.drawHighlightColumn);
        this.canvas.stage.on('contentMouseout', this.eraseHighlightColumn);
        this.canvas.stage.on('contentMousemove', this.moveHighlightColumn);

        // Setup column border drawing for the pixel column that's clicked
        this.columnSelect = new Konva.Rect({
            width: this.props.canvasSize/this.props.imgSize + 2,
            height: this.canvas.stage.height(),
            stroke: 'rgb(0,255,0)',
            strokeWidth: 1,
        });
        this.columnSelectLayer = new Konva.Layer();
        this.columnSelectLayer.add(this.columnSelect);
        this.columnSelectLayer.hide();
        this.canvas.stage.add(this.columnSelectLayer);
        this.canvas.stage.on('contentClick', this.selectColumn);

        // Setup section border drawing
        this.sectionSelect = new Konva.Rect({
            width: this.props.canvasSize/this.props.imgSize + 2,
            height: this.props.canvasSize/this.props.imgSize + 2,
            stroke: 'rgb(0,0,255)',
            strokeWidth: 1,
        });
        this.sectionSelectLayer = new Konva.Layer();
        this.sectionSelectLayer.add(this.sectionSelect);
        this.sectionSelectLayer.hide();
        this.canvas.stage.add(this.sectionSelectLayer);
        this.canvas.stage.on('dragstart', this.drawSection);
        this.canvas.stage.on('dragmove', this.stretchSection);
        this.canvas.stage.on('dragend', this.selectSection);

        this.columnHighlightLayer.moveToTop();
    }

    componentWillReceiveProps(nextProps) {
        const columnWidth = nextProps.canvasSize/nextProps.imgSize;
        this.columnHighlight.width(columnWidth + 2);
        this.columnSelect.width(columnWidth + 2);
    }

    drawHighlightColumn() {
        if (this.drawingSection) {
            return;
        }
        this.columnHighlightLayer.show();
        this.moveHighlightColumn();
    }

    moveHighlightColumn() {
        if (this.drawingSection) {
            return;
        }
        const mousePixelX = this._calcMousePixelX();
        const pixelWidth = this.props.canvasSize/this.props.imgSize;
        const adjustedX = mousePixelX*pixelWidth;
        this.columnHighlight.setX(adjustedX-1);
        this.columnHighlightLayer.draw();
    }

    eraseHighlightColumn() {
        this.columnHighlightLayer.hide();
    }

    selectColumn() {
        this.sectionSelectLayer.hide();
        const mousePixelX = this._calcMousePixelX();
        const pixelWidth = this.props.canvasSize/this.props.imgSize;
        const adjustedX = mousePixelX*pixelWidth;
        this.columnSelect.setX(adjustedX-1);
        this.columnSelectLayer.show();
        this.columnSelectLayer.draw();
        this.props.sonifyColumn(mousePixelX);
    }

    deselectColumn() {
        this.columnSelectLayer.hide();
    }

    drawSection() {
        this.drawingSection = true;
        this.deselectColumn();
        this.eraseHighlightColumn();
        const mousePixelX = this._calcMousePixelX();
        const mousePixelY = this._calcMousePixelY();
        this.xs = mousePixelX;
        this.ys = mousePixelY;
        const pixelSize = this.props.canvasSize/this.props.imgSize;
        const adjustedX = mousePixelX*pixelSize;
        const adjustedY = mousePixelY*pixelSize;
        this.sectionSelect.setX(adjustedX-1);
        this.sectionSelect.setY(adjustedY-1);
        this.sectionSelect.width(0);
        this.sectionSelect.height(0);
        this.sectionSelectLayer.show();
        this.sectionSelectLayer.clear();
        this.sectionSelectLayer.draw();
    }

    stretchSection() {
        const mousePixelX = this._calcMousePixelX();
        const mousePixelY = this._calcMousePixelY();
        const pixelSize = this.props.canvasSize/this.props.imgSize;
        const adjustedX = mousePixelX*pixelSize;
        const adjustedY = mousePixelY*pixelSize;
        this.sectionSelect.width(adjustedX-this.sectionSelect.getX());
        this.sectionSelect.height(adjustedY-this.sectionSelect.getY());
        this.sectionSelectLayer.clear();
        this.sectionSelect.draw();
    }

    selectSection() {
        const pixelSize = this.props.canvasSize/this.props.imgSize;
        let width = Math.round(this.sectionSelect.width()/pixelSize-0.5);
        let height = Math.round(this.sectionSelect.height()/pixelSize-0.5);
        if (width < 0) {
            width *= -1;
            this.xs = this.xs - width;
        }
        if (height < 0) {
            height *= -1;
            this.ys = this.ys - height;
        }

        this.drawingSection = false;
        this.drawHighlightColumn();
        this.props.sonifySection(new Range(this.xs, this.ys, width, height));
    }

    deselectSection() {
        this.sectionSelectLayer.hide();
    }

    _calcMousePixelX() {
        const mouseX = this.canvas.stage.getPointerPosition().x;
        const pixelWidth = this.props.canvasSize/this.props.imgSize;
        return Math.round(mouseX/pixelWidth-0.5);
    }

    _calcMousePixelY() {
        const mouseY = this.canvas.stage.getPointerPosition().y;
        const pixelHeight = this.props.canvasSize/this.props.imgSize;
        return Math.round(mouseY/pixelHeight-0.5);
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <ResponsiveCanvas
                {...this.props}
                hocRef={(canvas) => this.canvas = canvas}
            />
        );
    }
}


InteractableCanvas.propTypes = {
    ...ResponsiveCanvas.propTypes,
    sonifyColumn: PropTypes.func,
    sonifySection: PropTypes.func,
};
