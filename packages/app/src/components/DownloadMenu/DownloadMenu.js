import React, { useState, createRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import i18n from '@dhis2/d2-i18n'
import ImageIcon from '@material-ui/icons/Image'
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'
import ListIcon from '@material-ui/icons/List'
import ListAltIcon from '@material-ui/icons/ListAlt'
import {
    FlyoutMenu,
    MenuSectionHeader,
    MenuItem,
    Popover,
    colors,
} from '@dhis2/ui'
import { VIS_TYPE_PIVOT_TABLE } from '@dhis2/analytics'

import {
    sGetUiType,
    sGetUiLayout,
    sGetUiInterpretation,
} from '../../reducers/ui'
import { sGetCurrent } from '../../reducers/current'
import { sGetChart } from '../../reducers/chart'
import {
    apiDownloadImage,
    apiDownloadData,
    apiDownloadTable,
} from '../../api/analytics'
import MenuButton from '../MenuButton/MenuButton'
import MoreHorizontalIcon from '../../assets/MoreHorizontalIcon'

const DenseMenuItem = ({ Icon, children, ...rest }) => (
    <MenuItem
        dense
        icon={Icon && <Icon style={{ color: colors.grey600 }} />}
        {...rest}
    >
        {children}
    </MenuItem>
)

DenseMenuItem.propTypes = {
    Icon: PropTypes.elementType,
    children: PropTypes.array,
}

export const DownloadMenu = ({
    current,
    rows,
    columns,
    chart,
    relativePeriodDate,
    visType,
}) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false)

    const toggleMenu = () => setDialogIsOpen(!dialogIsOpen)

    const downloadImage = format => async () => {
        const formData = new URLSearchParams()

        formData.append('filename', current.name)

        if (chart) {
            formData.append('svg', chart)
        }

        const blob = await apiDownloadImage(format, formData)
        const url = URL.createObjectURL(blob)

        toggleMenu()

        window.open(url, '_blank')
    }

    const downloadData = (format, idScheme, path) => async () => {
        const url = await apiDownloadData({
            current,
            format,
            options: { relativePeriodDate },
            idScheme,
            path,
        })

        toggleMenu()

        window.open(url, format.match(/(xls|csv)/) ? '_top' : '_blank')
    }

    const downloadTable = format => async () => {
        const url = await apiDownloadTable({
            current,
            format,
            options: { relativePeriodDate },
            rows,
            columns,
        })

        toggleMenu()

        window.open(url, format === 'html' ? '_blank' : '_top')
    }

    /* eslint-disable react/jsx-key */
    const graphicsMenuSection = () =>
        React.Children.toArray([
            <MenuSectionHeader label={i18n.t('Graphics')} />,
            <DenseMenuItem
                Icon={ImageIcon}
                label={i18n.t('Image (.png)')}
                onClick={downloadImage('png')}
            />,
            <DenseMenuItem
                Icon={PictureAsPdfIcon}
                label={i18n.t('PDF (.pdf)')}
                onClick={downloadImage('pdf')}
            />,
        ])

    const tableMenuSection = () =>
        React.Children.toArray([
            <MenuSectionHeader label={i18n.t('Table layout')} />,
            <DenseMenuItem
                Icon={ListAltIcon}
                label={i18n.t('Excel (.xls)')}
                onClick={downloadTable('xls')}
            />,
            <DenseMenuItem
                Icon={ListAltIcon}
                label={i18n.t('CSV (.csv)')}
                onClick={downloadTable('csv')}
            />,
            <DenseMenuItem
                Icon={ListAltIcon}
                label={i18n.t('HTML (.html)')}
                onClick={downloadTable('html')}
            />,
        ])

    const plainDataSourceSubLevel = format =>
        React.Children.toArray([
            <MenuSectionHeader label={i18n.t('Metadata ID scheme')} />,
            <DenseMenuItem
                label={i18n.t('ID')}
                onClick={downloadData(format, 'UID')}
            />,
            <DenseMenuItem
                label={i18n.t('Code')}
                onClick={downloadData(format, 'CODE')}
            />,
            <DenseMenuItem
                label={i18n.t('Name')}
                onClick={downloadData(format, 'NAME')}
            />,
        ])
    /* eslint-enable react/jsx-key */

    const buttonRef = createRef()

    return (
        <>
            <div ref={buttonRef}>
                <MenuButton onClick={toggleMenu} disabled={!current}>
                    {i18n.t('Download')}
                </MenuButton>
            </div>
            {dialogIsOpen && (
                <Popover
                    arrow={false}
                    reference={buttonRef}
                    placement="bottom-start"
                    onClickOutside={toggleMenu}
                >
                    <FlyoutMenu>
                        {visType === VIS_TYPE_PIVOT_TABLE
                            ? tableMenuSection()
                            : graphicsMenuSection()}
                        <MenuSectionHeader
                            label={i18n.t('Plain data source')}
                        />
                        <DenseMenuItem Icon={ListIcon} label={i18n.t('JSON')}>
                            {plainDataSourceSubLevel('json')}
                        </DenseMenuItem>
                        <DenseMenuItem Icon={ListIcon} label={i18n.t('XML')}>
                            {plainDataSourceSubLevel('xml')}
                        </DenseMenuItem>
                        <DenseMenuItem Icon={ListIcon} label={i18n.t('Excel')}>
                            {plainDataSourceSubLevel('xls')}
                        </DenseMenuItem>
                        <DenseMenuItem Icon={ListIcon} label={i18n.t('CSV')}>
                            {plainDataSourceSubLevel('csv')}
                        </DenseMenuItem>
                        <DenseMenuItem
                            Icon={MoreHorizontalIcon}
                            label={i18n.t('Advanced')}
                        >
                            <MenuSectionHeader
                                label={i18n.t('Data value set')}
                            />
                            <DenseMenuItem
                                label={i18n.t('JSON')}
                                onClick={downloadData(
                                    'json',
                                    null,
                                    'dataValueSet'
                                )}
                            />
                            <DenseMenuItem
                                label={i18n.t('XML')}
                                onClick={downloadData(
                                    'xml',
                                    null,
                                    'dataValueSet'
                                )}
                            />
                            <MenuSectionHeader
                                label={i18n.t('Other formats')}
                            />
                            <DenseMenuItem
                                label={i18n.t('JRXML')}
                                onClick={downloadData('jrxml')}
                            />
                            <DenseMenuItem
                                label={i18n.t('Raw data SQL')}
                                onClick={downloadData('sql', null, 'debug/sql')}
                            />
                        </DenseMenuItem>
                    </FlyoutMenu>
                </Popover>
            )}
        </>
    )
}

const relativePeriodDateSelector = createSelector(
    [sGetUiInterpretation],
    interpretation => interpretation.created || undefined
)

DownloadMenu.propTypes = {
    chart: PropTypes.string,
    columns: PropTypes.array,
    current: PropTypes.object,
    relativePeriodDate: PropTypes.string,
    rows: PropTypes.array,
    visType: PropTypes.string,
}

const mapStateToProps = state => ({
    current: sGetCurrent(state),
    relativePeriodDate: relativePeriodDateSelector(state),
    rows: sGetUiLayout(state).rows,
    columns: sGetUiLayout(state).columns,
    chart: sGetChart(state),
    visType: sGetUiType(state),
})

export default connect(mapStateToProps)(DownloadMenu)
