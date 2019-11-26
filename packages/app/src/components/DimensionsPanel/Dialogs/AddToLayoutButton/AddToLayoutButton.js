import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { getAvailableAxes } from '@dhis2/analytics';

import UpdateButton from '../../../UpdateButton/UpdateButton';
import Menu from './Menu';
import {
    sGetUiActiveModalDialog,
    sGetDimensionIdsFromLayout,
    sGetUiType,
} from '../../../../reducers/ui';
import {
    acSetUiActiveModalDialog,
    acAddUiLayoutDimensions,
} from '../../../../actions/ui';
import { tSetCurrentFromUi } from '../../../../actions/current';

import { ADD_TO_LAYOUT_OPTIONS } from '../../../../modules/layout';
import styles from './styles/AddToLayoutButton.style';

export class AddToLayoutButton extends Component {
    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
    }

    state = { anchorEl: null };

    onClose = () => this.setState({ anchorEl: null });

    onToggle = event =>
        this.state.anchorEl
            ? this.onClose()
            : this.setState({ anchorEl: event.currentTarget });

    onUpdate = axisId => {
        this.props.onAddDimension({
            [this.props.dialogId]: axisId,
        });

        this.props.onUpdate();

        this.props.closeDialog(null);
    };

    getAxisMeta = axisIdArray =>
        axisIdArray.map(axisId =>
            ADD_TO_LAYOUT_OPTIONS.find(
                axisMetaObj => axisMetaObj.axisId === axisId
            )
        );

    renderMenuItems = () =>
        this.getAxisMeta(getAvailableAxes(this.props.visType))
            .slice(1)
            .map(axisMetaObj => (
                <MenuItem
                    className={this.props.classes.menuItem}
                    component="li"
                    key={axisMetaObj.axisId}
                    onClick={() => this.onUpdate(axisMetaObj.axisId)}
                >
                    {axisMetaObj.name}
                </MenuItem>
            ));

    renderAddToLayoutButton = () => {
        const availableAxisMeta = this.getAxisMeta(
            getAvailableAxes(this.props.visType)
        );

        return (
            <div ref={addToRef => (this.buttonRef = addToRef)}>
                <Button
                    className={this.props.classes.button}
                    variant="contained"
                    color="primary"
                    disableRipple
                    disableFocusRipple
                    onClick={() => this.onUpdate(availableAxisMeta[0].axisId)}
                >
                    {availableAxisMeta[0].name}
                </Button>
                {availableAxisMeta.length > 1 ? (
                    <Menu
                        onClose={this.onClose}
                        onClick={this.onToggle}
                        anchorEl={this.state.anchorEl}
                        menuItems={this.renderMenuItems()}
                        addToButtonRef={this.buttonRef}
                    />
                ) : null}
            </div>
        );
    };

    renderUpdateButton = () => (
        <UpdateButton
            className={this.props.className}
            onClick={() => this.props.closeDialog(null)}
        />
    );

    layoutHasDimension = dimensionId =>
        this.props.dimensionIdsInLayout.includes(dimensionId);

    render() {
        const displayButton = this.layoutHasDimension(this.props.dialogId)
            ? this.renderUpdateButton()
            : this.renderAddToLayoutButton();

        return displayButton;
    }
}

AddToLayoutButton.propTypes = {
    classes: PropTypes.object.isRequired,
    visType: PropTypes.string.isRequired,
    dialogId: PropTypes.string.isRequired,
    dimensionIdsInLayout: PropTypes.array.isRequired,
    onAddDimension: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    visType: sGetUiType(state),
    dialogId: sGetUiActiveModalDialog(state),
    dimensionIdsInLayout: sGetDimensionIdsFromLayout(state),
});

export default connect(
    mapStateToProps,
    {
        onAddDimension: acAddUiLayoutDimensions,
        onUpdate: tSetCurrentFromUi,
        closeDialog: acSetUiActiveModalDialog,
    }
)(withStyles(styles)(AddToLayoutButton));
