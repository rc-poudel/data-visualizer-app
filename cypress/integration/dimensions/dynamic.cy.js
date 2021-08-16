import { DIMENSION_ID_DATA, VIS_TYPE_COLUMN } from '@dhis2/analytics'
import { expectVisualizationToBeVisible } from '../../elements/chart'
import { expectAppToNotBeLoading } from '../../elements/common'
import {
    changeSelectionToAutomatic,
    changeSelectionToManual,
    clickDimensionModalAddToButton,
    clickDimensionModalUpdateButton,
    expectAutomaticSelectionToBeChecked,
    expectDimensionModalToBeVisible,
    expectItemToBeSelected,
    expectManualSelectionToBeChecked,
    selectDataElements,
    selectItemByButton,
} from '../../elements/dimensionModal'
import { openDimension } from '../../elements/dimensionsPanel'
import { saveNewAO } from '../../elements/fileMenu'
import {
    expectDimensionToHaveAllItemsSelected,
    expectDimensionToHaveItemAmount,
} from '../../elements/layout'
import { goToStartPage } from '../../elements/startScreen'
import { TEST_DATA_ELEMENTS } from '../../utils/data'
import { getRandomArrayItem } from '../../utils/random'
import { expectWindowConfigSeriesToHaveLength } from '../../utils/window'

const TEST_DATA_ELEMENT_NAME = getRandomArrayItem(TEST_DATA_ELEMENTS).name
const TEST_DYNAMIC_DIMENSION = {
    id: 'J5jldMd8OHv',
    name: 'Facility type',
    itemAmount: 5,
}

describe(`Dynamic dimension - ${TEST_DYNAMIC_DIMENSION.name}`, () => {
    it('navigates to the start page and adds a data item', () => {
        goToStartPage()
        openDimension(DIMENSION_ID_DATA)
        selectDataElements([TEST_DATA_ELEMENT_NAME])
        clickDimensionModalUpdateButton()
        expectVisualizationToBeVisible(VIS_TYPE_COLUMN)
    })
    const TEST_ITEM = 'Hospital'
    it('adds an item manually', () => {
        openDimension(TEST_DYNAMIC_DIMENSION.id)
        expectDimensionModalToBeVisible(TEST_DYNAMIC_DIMENSION.id)
        expectManualSelectionToBeChecked()
        selectItemByButton(TEST_ITEM)
        clickDimensionModalAddToButton()
        expectVisualizationToBeVisible(VIS_TYPE_COLUMN)
        expectWindowConfigSeriesToHaveLength(1)
        expectDimensionToHaveItemAmount(TEST_DYNAMIC_DIMENSION.id, 1)
    })
    it('adds all items automatically', () => {
        openDimension(TEST_DYNAMIC_DIMENSION.id)
        expectDimensionModalToBeVisible(TEST_DYNAMIC_DIMENSION.id)
        expectManualSelectionToBeChecked()
        changeSelectionToAutomatic()
        expectAutomaticSelectionToBeChecked()
        clickDimensionModalUpdateButton()
        expectVisualizationToBeVisible(VIS_TYPE_COLUMN)
        expectWindowConfigSeriesToHaveLength(TEST_DYNAMIC_DIMENSION.itemAmount)
        expectDimensionToHaveAllItemsSelected(TEST_DYNAMIC_DIMENSION.id)
    })
    it('switches back to manual and previous item is presisted', () => {
        openDimension(TEST_DYNAMIC_DIMENSION.id)
        expectDimensionModalToBeVisible(TEST_DYNAMIC_DIMENSION.id)
        expectAutomaticSelectionToBeChecked()
        changeSelectionToManual()
        expectManualSelectionToBeChecked()
        expectItemToBeSelected(TEST_ITEM)
        clickDimensionModalUpdateButton()
        expectVisualizationToBeVisible(VIS_TYPE_COLUMN)
        expectWindowConfigSeriesToHaveLength(1)
        expectDimensionToHaveItemAmount(TEST_DYNAMIC_DIMENSION.id, 1)
    })
    it('switches back to automatic, saving, the selection is presisted', () => {
        openDimension(TEST_DYNAMIC_DIMENSION.id)
        expectDimensionModalToBeVisible(TEST_DYNAMIC_DIMENSION.id)
        expectManualSelectionToBeChecked()
        changeSelectionToAutomatic()
        expectAutomaticSelectionToBeChecked()
        clickDimensionModalUpdateButton()
        expectVisualizationToBeVisible(VIS_TYPE_COLUMN)
        expectWindowConfigSeriesToHaveLength(TEST_DYNAMIC_DIMENSION.itemAmount)
        expectDimensionToHaveAllItemsSelected(TEST_DYNAMIC_DIMENSION.id)
        saveNewAO(
            `TEST DYNAMIC DIMENSION AUTOMATIC SELECTION ${new Date().toLocaleString()}`,
            'Generated by Cypress'
        )
        expectAppToNotBeLoading()
        expectVisualizationToBeVisible(VIS_TYPE_COLUMN)
        expectWindowConfigSeriesToHaveLength(TEST_DYNAMIC_DIMENSION.itemAmount)
        expectDimensionToHaveAllItemsSelected(TEST_DYNAMIC_DIMENSION.id)
    })
})
