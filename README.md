# Step by step

## What is it?
This module attempts to implement the Gov.uk [Step by step navigation](https://design-system.service.gov.uk/patterns/step-by-step-navigation/) journeys.

Our implementation provides a *Step by step homepage* content type that refers to several pages of the *Step by step page* content type.  When this homepage or any of the Step by step pages is viewed, the Step by step navigation appears.  This navigation lists all the Step by step pages belonging to the related Step by step homepage.

## What is in it?
- 2 x Content types:
  - Step by step homepage
  - Step by step page
- 3 x blocks all coming out of a View:
  - Step by step navigation.  This is supposed to appear in all Step by step pages.
  - A similar Step by step navigation, but this one is for the Step by step homepage.
  - Previous/Next links for each Step by step page.

## Install process
- Standard Drupal module installation process applies.  But...
- The 3 x block configuration files are only installed if you are using the Bartik theme which is unlikely.  So *before* installing this module, open these three files and replace "bartik" with your theme name:
  - config/optional/block.block.step_by_step_navigation.yml
  - config/optional/block.block.step_by_step_navigation_block_for_homepage.yml
  - config/optional/block.block.step_by_step_prev_next.yml

  You can revert these changes after module installation as these files are no longer needed.
- Alternatively, add these three blocks from the Drupal block layout admin page.  The Prev/Next block should be placed after the "Main page content" block.  The other two Step by step navigation blocks can be placed in the second sidebar or after the "Main page content" block based on your preferences.

## How to use it
- Add one or more Step by step homepages.
- Add a few Step by step pages.  In each of the page, use the "Step by step homepage" autocomplete field to refer to the relevant Step by step homepage.
- To reorder the Step by step pages, edit the related Step by step homepage and drag the Step by step pages.

## Configuration update
Use the [Features](https://www.drupal.org/project/features) module to *reimport* Drupal configurations carried by this
module:
```
$ drush features:import gull_step_by_step
```

## Limitations
Unlike the gov.uk Step by step prototype, we do not provide pages for substeps.

## Known bugs
If you *change* the Step by step homepage of a Step by step page, the old homepage will still refer to the Step by step page.  This breaks the Step by step navigation.  In such scenarios, manually remove the reference to the Step by step page from the old Step by step homepage.  A fix has been planned.
