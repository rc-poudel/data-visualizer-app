import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    DIMENSION_ID_DATA,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ASSIGNED_CATEGORIES,
} from '@dhis2/analytics'

// Transform from ui.layout to pie layout format
export const pieLayoutAdapter = layout => {
    const columns = layout[AXIS_ID_COLUMNS].slice()
    const rows = layout[AXIS_ID_ROWS].slice()

    return {
        [AXIS_ID_COLUMNS]: [columns.shift() || rows.shift()],
        [AXIS_ID_ROWS]: [],
        [AXIS_ID_FILTERS]: [...layout[AXIS_ID_FILTERS], ...columns, ...rows],
    }
}

// Transform from ui.layout to year on year layout format
export const yearOverYearLayoutAdapter = layout => ({
    [AXIS_ID_COLUMNS]: [],
    [AXIS_ID_ROWS]: [],
    [AXIS_ID_FILTERS]: [
        ...layout[AXIS_ID_FILTERS],
        ...layout[AXIS_ID_COLUMNS],
        ...layout[AXIS_ID_ROWS],
    ].filter(
        dim =>
            dim !== DIMENSION_ID_PERIOD &&
            dim !== DIMENSION_ID_ASSIGNED_CATEGORIES
    ),
})

// Transform from ui.layout to single value layout format
export const singleValueLayoutAdapter = layout => {
    const columns = layout[AXIS_ID_COLUMNS].slice()
    const rows = layout[AXIS_ID_ROWS].slice()

    return {
        [AXIS_ID_COLUMNS]: [DIMENSION_ID_DATA],
        [AXIS_ID_ROWS]: [],
        [AXIS_ID_FILTERS]: [
            ...layout[AXIS_ID_FILTERS],
            ...columns,
            ...rows,
        ].filter(
            dim =>
                dim !== DIMENSION_ID_DATA &&
                dim !== DIMENSION_ID_ASSIGNED_CATEGORIES
        ),
    }
}
