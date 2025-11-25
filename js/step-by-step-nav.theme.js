/**
 * @file
 * Javascript theme functions for Step by Step navigation.
 */

(function lgdStepByStepThemeScript(Drupal) {
  /**
   * Themes single show/hide summary button.
   *
   * NOTE:
   *  - the wrapper element must exist
   *   - button aria-expanded attribute is controlled byt step-by-step-nav.js
   *   - button type attribute must exist
   */
  Drupal.theme.stepButtonHtml = function () {
    return `
      <span class="step-summary-container">
        <button
          aria-expanded="false"
          class="step-show"
          type="button"
        ></button>
      </span>
    `;
  };

  /**
   * Themes the CONTENT of individual step buttons.
   *
   * Provided as a way to permit themes to modify the button content (including
   * child HTML) which is not otherwise possible given the existing install
   * base.
   *
   * @returns {string}
   *   Text for the individual step buttons.
   */
  Drupal.theme.stepButtonText = function (expanded) {
    return expanded
      ? Drupal.t('Hide step summary')
      : Drupal.t('Show step summary');
  };

  /**
   * Themes the show/hide all summaries link and wrapper.
   *
   * NOTE:
   *   - the wrapper div must exist
   *   - button data-pressed attribute is controlled by step-by-step-nav.js
   *   - button type attribute must exist
   *   - if using Fontawesome icons, the data attributes must be present
   *
   * @returns {string}
   *   HTML for the wrapper, button, icon, and whatever else is needed.
   */
  Drupal.theme.controlButtonHtml = function () {
    return `
      <div class="summaries-control">
        <i
          class="fas fa-eye"
          data-pressed-class="fa-eye-slash"
          data-unpressed-class="fa-eye"
        ></i>
        <button
          data-pressed="false"
          class="step-master ml-2"
          type="button"
        ></button>
      </div>
    `;
  };

  /**
   * Themes the CONTENT of the control button.
   *
   * Provided as a way to permit themes to modify the button content (including
   * child HTML) which is not otherwise possible given the existing install
   * base.
   *
   * @returns {string}
   *   Text for the overall controll button.
   */
  Drupal.theme.controlButtonText = function (expanded) {
    return expanded ? Drupal.t('Hide summaries') : Drupal.t('Show summaries');
  };
})(Drupal);
