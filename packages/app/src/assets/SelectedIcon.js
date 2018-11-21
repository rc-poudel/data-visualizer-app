import React from 'react';
import { colors } from '../modules/colors';

export const SelectedIcon = () => (
    <div
        style={{
            backgroundColor: colors.accentSecondary,
            minHeight: '6px',
            minWidth: '6px',
            margin: '0px 5px',
        }}
    />
);

export default SelectedIcon;
