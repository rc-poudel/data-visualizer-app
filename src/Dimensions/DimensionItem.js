import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import DimensionLabel from './DimensionLabel';
import DimensionOptions from './DimensionOptions';
import { Data, Period, OrgUnit, GenericDimension } from './icons';

const style = {
    text: {
        fontSize: 16,
        color: 'black',
    },
    itemContainer: {
        display: 'flex',
        width: 'inherit',
        height: 24,
        marginTop: 6,
        marginBottom: 6,
    },
};

export class DimensionItem extends Component {
    state = { mouseOver: false, optionButtonClicked: false };

    onMouseOver = () => {
        this.setState({ mouseOver: true });
    };

    onMouseExit = () => {
        if (!this.state.optionButtonClicked) {
            this.setState({ mouseOver: false });
        }
    };

    toggleHoverListener = () => {
        this.setState(
            { optionButtonClicked: !this.state.optionButtonClicked },
            () => this.onMouseExit()
        );
    };

    getDimensionIcon = () => {
        const fixedDimensionIcons = [<Data />, <Period />, <OrgUnit />],
            isGeneric = typeof this.props.id === 'string';

        return isGeneric ? (
            <GenericDimension />
        ) : (
            fixedDimensionIcons[this.props.id]
        );
    };

    getDimensionType = () => {
        return (
            <span style={style.text}> {i18n.t(this.props.displayName)} </span>
        );
    };

    renderOptionsOnHover = () => {
        let showOptions = null;

        if (!this.props.isSelected && this.state.mouseOver) {
            showOptions = (
                <DimensionOptions
                    toggleHoverListener={this.toggleHoverListener}
                />
            );
        }

        return showOptions;
    };

    render = () => {
        const Icon = this.getDimensionIcon(),
            Label = this.getDimensionType(),
            MoreOptions = this.renderOptionsOnHover();

        return (
            <li
                key={this.props.id}
                style={style.itemContainer}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseExit}
            >
                <DimensionLabel {...this.props}>
                    {Icon}
                    {Label}
                </DimensionLabel>
                {MoreOptions}
            </li>
        );
    };
}

DimensionItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    displayName: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    toggleDialog: PropTypes.func.isRequired,
};

export default DimensionItem;
