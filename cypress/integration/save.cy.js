import { DIMENSION_ID_DATA, visTypeDisplayNames } from '@dhis2/analytics'

import { openDimension } from '../elements/dimensionsPanel'
import {
    selectDataElements,
    clickDimensionModalUpdateButton,
} from '../elements/dimensionModal'
import { changeVisType } from '../elements/visualizationTypeSelector'
import {
    expectAOTitleToBeDirty,
    expectAOTitleToBeUnsaved,
    expectAOTitleToBeValue,
    expectAOTitleToNotBeDirty,
    expectVisualizationToBeVisible,
} from '../elements/chart'
import { TEST_DATA_ELEMENTS } from '../utils/data'
import {
    //openRandomAOCreatedByOthers,
    saveNewAO,
    closeFileMenu,
    saveAOAs,
    saveExistingAO,
    openAOByName,
    deleteAO,
    expectFileMenuButtonToBeEnabled,
    expectFileMenuButtonToBeDisabled,
    FILE_MENU_BUTTON_NEW,
    FILE_MENU_BUTTON_OPEN,
    FILE_MENU_BUTTON_SAVE,
    FILE_MENU_BUTTON_SAVEAS,
    FILE_MENU_BUTTON_DELETE,
    FILE_MENU_BUTTON_RENAME,
    FILE_MENU_BUTTON_TRANSLATE,
    FILE_MENU_BUTTON_SHARE,
    FILE_MENU_BUTTON_GETLINK,
} from '../elements/fileMenu'
import { expectRouteToBeAOId, expectRouteToBeEmpty } from '../elements/route'
import { getRandomVisType } from '../utils/random'
import { clickMenuBarFileButton } from '../elements/menuBar'
import {
    expectStartScreenToBeVisible,
    goToStartPage,
} from '../elements/startScreen'
import { replacePeriodItems } from '../elements/common'

const TEST_VIS_NAME = `TEST ${new Date().toLocaleString()}`
const TEST_VIS_NAME_UPDATED = `${TEST_VIS_NAME} - updated`
const TEST_VIS_DESCRIPTION = 'Generated by Cypress'
const TEST_VIS_TYPE = getRandomVisType()
const TEST_VIS_TYPE_NAME = visTypeDisplayNames[TEST_VIS_TYPE]

// TODO: Add test to check that the description is saved and shown in the interpretations panel

describe('saving an AO', () => {
    describe('"save" and "save as" for a new AO', () => {
        it('navigates to the start page', () => {
            goToStartPage()
        })
        it(`changes vis type to ${TEST_VIS_TYPE_NAME}`, () => {
            changeVisType(TEST_VIS_TYPE_NAME)
        })
        it('adds Data dimension items', () => {
            // FIXME: Won't work for Scatter, needs to add both vertical and horizontal items
            openDimension(DIMENSION_ID_DATA)
            selectDataElements(
                TEST_DATA_ELEMENTS.slice(1, 2).map(item => item.name)
            )
            clickDimensionModalUpdateButton()
        })
        it('displays an unsaved visualization', () => {
            expectVisualizationToBeVisible(TEST_VIS_TYPE)
            expectAOTitleToBeUnsaved()
            expectRouteToBeEmpty()
        })
        it('checks that Save as is disabled', () => {
            clickMenuBarFileButton()
            expectFileMenuButtonToBeDisabled(FILE_MENU_BUTTON_SAVEAS)
            closeFileMenu()
        })
        it('saves new AO using "Save"', () => {
            saveNewAO(TEST_VIS_NAME, TEST_VIS_DESCRIPTION)
            expectAOTitleToBeValue(TEST_VIS_NAME)
            expectVisualizationToBeVisible(TEST_VIS_TYPE)
        })
        it('checks that the url was changed', () => {
            expectRouteToBeAOId()
        })
        it('all File menu buttons are enabled', () => {
            clickMenuBarFileButton()
            const enabledButtons = [
                FILE_MENU_BUTTON_NEW,
                FILE_MENU_BUTTON_OPEN,
                FILE_MENU_BUTTON_SAVE,
                FILE_MENU_BUTTON_SAVEAS,
                FILE_MENU_BUTTON_RENAME,
                FILE_MENU_BUTTON_TRANSLATE,
                FILE_MENU_BUTTON_SHARE,
                FILE_MENU_BUTTON_GETLINK,
                FILE_MENU_BUTTON_DELETE,
            ]
            enabledButtons.forEach(button =>
                expectFileMenuButtonToBeEnabled(button)
            )
            closeFileMenu()
        })
        it(`replaces the selected period`, () => {
            replacePeriodItems(TEST_VIS_TYPE)
            expectAOTitleToBeDirty()
            expectVisualizationToBeVisible(TEST_VIS_TYPE)
        })
        it('saves AO using "Save"', () => {
            saveExistingAO()
            expectAOTitleToNotBeDirty()
            expectAOTitleToBeValue(TEST_VIS_NAME)
            expectVisualizationToBeVisible(TEST_VIS_TYPE)
        })
        it('saves AO using "Save As"', () => {
            saveAOAs(TEST_VIS_NAME_UPDATED)
            expectAOTitleToBeValue(TEST_VIS_NAME_UPDATED)
            expectVisualizationToBeVisible(TEST_VIS_TYPE)
        })
    })

    describe('"save" and "save as" for a saved AO created by you', () => {
        it('navigates to the start page and opens a saved AO', () => {
            goToStartPage()
            openAOByName(TEST_VIS_NAME_UPDATED)
        })
        it(`replaces the selected period`, () => {
            replacePeriodItems(TEST_VIS_TYPE, { useAltData: true })
            expectAOTitleToBeDirty()
        })
        it('saves AO using "Save"', () => {
            saveExistingAO()
            expectAOTitleToNotBeDirty()
            expectAOTitleToBeValue(TEST_VIS_NAME)
            expectVisualizationToBeVisible(TEST_VIS_TYPE)
        })
        it.skip('deletes AO', () => {
            // FIXME: Unskip once https://jira.dhis2.org/browse/DHIS2-10140 is done
            deleteAO()
            expectRouteToBeEmpty()
            expectStartScreenToBeVisible()
        })
    })

    /*
    describe('"save" for a saved AO created by others', () => {
        it('navigates to the start page', () => {
            goToStartPage()
        })
        it('opens a random AO created by others', () => {
            openRandomAOCreatedByOthers()
        })
        it('checks that Save is disabled - WIP', () => {
            clickMenuBarFileButton()
            expectFileMenuButtonToBeDisabled(FILE_MENU_BUTTON_SAVEAS)
            // TODO: This is not always true, as different AOs can have different sharing settings.
            // @edoardo will add additional tests here later
            closeFileMenu()
        })
    })
    */
})
