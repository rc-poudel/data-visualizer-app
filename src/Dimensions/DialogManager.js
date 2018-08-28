import React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
} from '@material-ui/core';
import {
    DataDimension,
    PeriodDimension,
    OrgUnitDimension,
} from '../components/index';
import { tSetDimensions } from '../actions/dimensions';

// Placeholder for the dimension popup dialogs - using the Options dialog until the components are created
const dimensionsArr = [
    <DataDimension />,
    <PeriodDimension />,
    <OrgUnitDimension />,
];

export const DialogManager = ({
    dialogIsOpen,
    id,
    toggleDialog,
    setDimension,
}) => {
    return (
        <Dialog open={dialogIsOpen} onClose={() => toggleDialog(null)}>
            <DialogContent>{dimensionsArr[id]}</DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        setDimension(id);
                        toggleDialog(null);
                    }}
                >
                    {i18n.t('Submit')}
                </Button>
                <Button onClick={() => toggleDialog(null)}>
                    {i18n.t('Cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const mapDispatchToProps = dispatch => ({
    setDimension: id => dispatch(tSetDimensions(id)),
});

export default connect(
    null,
    mapDispatchToProps
)(DialogManager);
