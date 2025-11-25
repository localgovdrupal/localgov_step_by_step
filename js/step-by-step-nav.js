/**
 * @file
 * Additional behaviour for the Step by step navigation.
 */

(function lgdStepByStepScript(Drupal) {
  Drupal.behaviors.stepByStepNav = {
    /**
     * Creates step-list disclosures and an overall control button for them.
     *
     * @param {object} context
     *   The current page DOM context for this iteration of the behavior.
     *
     * @return {undefined}
     */
    attach(context) {
      const stepManager = {
        stepListEl: null,
        stepEls: null,
        stepAriaAttr: 'aria-expanded',
        stepControlStateAttr: 'data-pressed',
        steps: [],
        stepIds: [],
        stepControlButton: null,
        stepControlIcon: null,

        /**
         * Toggles the state of a step button.
         *
         * @param {object} step
         *   A simple object containing button, link, summary, and title of a
         *   given step.
         * @param {boolean} expanded
         *   The expanded state to *set* on the step button.
         *
         * @return {undefined}
         */
        toggleStepButton({ button, summary, title }, expanded) {
          let ariaLabel;

          if (expanded) {
            ariaLabel = Drupal.t('Hide step summary - !stepTitle', {
              '!stepTitle': title,
            });
          } else {
            ariaLabel = Drupal.t('Show step summary - !stepTitle', {
              '!stepTitle': title,
            });
          }

          button.innerHTML = Drupal.theme('stepButtonText', expanded);
          button.setAttribute(this.stepAriaAttr, expanded);
          button.setAttribute('aria-label', ariaLabel);
          summary.classList[expanded ? 'add' : 'remove']('step-show-summary');
        },

        /**
         * Toggles all summaries
         *
         * @param {boolean} expanded
         *   The state to set on the individual summaries.
         *
         * @return {undefined}
         */
        toggleAllSummaries(expanded) {
          const attrValue = String(expanded);
          let message;

          this.steps.forEach((step) => {
            if (step.button.getAttribute(this.stepAriaAttr) !== attrValue) {
              this.toggleStepButton(step, expanded);
            }
          });

          if (expanded) {
            message = Drupal.t('Step summaries expanded');
          } else {
            message = Drupal.t('Step summaries collapsed');
          }

          Drupal.announce(message);
        },

        /**
         * Toggles the state of the control button.
         *
         * @param {boolean} pressed
         *   The state to set on the control button.
         *
         * @return {undefined}
         * @note As the label of the button changes, we're not using aria-pressed,
         *   but rather a custom data-pressed attribute to track the current state
         *   of the button. Per MDN, "If you want the label to toggle [...] don't
         *   use aria-pressed."
         * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-pressed
         */
        toggleControlButton(pressed) {
          this.stepControlButton.innerHTML =
            Drupal.theme.controlButtonText(pressed);
          this.stepControlButton.setAttribute(
            this.stepControlStateAttr,
            pressed,
          );

          if (this.stepControlIcon && pressed) {
            this.stepControlIcon.classList.add(
              this.stepControlIcon.dataset.pressedClass,
            );
            this.stepControlIcon.classList.remove(
              this.stepControlIcon.dataset.unpressedClass,
            );
          } else if (this.stepControlIcon && !pressed) {
            this.stepControlIcon.classList.add(
              this.stepControlIcon.dataset.unpressedClass,
            );
            this.stepControlIcon.classList.remove(
              this.stepControlIcon.dataset.pressedClass,
            );
          }
        },

        /**
         * Handle clicks on individual step buttons.
         *
         * @param {object} step
         *   A simple object containing button, link, summary, and title of a
         *   given step.
         *
         * @return {undefined}
         */
        handleControlButtonClick({ currentTarget, target }) {
          if (currentTarget !== target) {
            return;
          }

          const pressed =
            target.getAttribute(this.stepControlStateAttr) !== 'true';
          this.toggleControlButton(pressed);
          this.toggleAllSummaries(pressed);
        },

        /**
         * Handle clicks on Show/Hide all summaries button.
         *
         * @param {number} index
         *   The index of the step containing the clicked button.
         * @param {Event} event
         *   The event object passed in by the listener.
         *
         * @return {undefined}
         */
        handleStepButtonClick(index, { currentTarget, target }) {
          if (currentTarget !== target) {
            return;
          }

          this.toggleStepButton(
            this.steps[index],
            target.getAttribute(this.stepAriaAttr) !== 'true',
          );

          const hiddenSteps = !!this.steps.some(
            (step) => step.button.getAttribute(this.stepAriaAttr) === 'false',
          );

          // 'Show all' control displayed if any steps are hidden, and 'Hide all'
          // control displayed otherwise.
          this.toggleControlButton(!hiddenSteps);
        },

        /**
         * Constructs an id attribute value for step summaries.
         *
         * aria-controls is not well-supported, but we should provide some means
         * to relate the buttons to the summaries they control. It would be even
         * better if they were siblings in the markup, but that would be a break-
         * ing change.
         *
         * @return {string}
         *   An attribute value consisting of 's' + a zero-padded random value
         *   between 0-999.
         */
        getStepId() {
          return `s${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        },

        /**
         * Initialize the step-by-step navigation.
         *
         * @return {undefined}
         */
        init() {
          [this.stepListEl] = once('sts-steplist', 'ol.step-list', context);

          if (!this.stepListEl) {
            return;
          }

          this.stepEls = once('sts-step', '.step', this.stepListEl);

          /**
           * Set up step buttons.
           */
          const stepButtonTemplate = document.createElement('template');
          stepButtonTemplate.innerHTML = Drupal.theme('stepButtonHtml');
          this.stepEls.forEach((stepEl, index) => {
            const stepId = this.getStepId();
            const buttonMarkup = stepButtonTemplate.content.cloneNode(true);
            const stepTitleEl = stepEl.querySelector('.step__title');
            const step = {
              button: buttonMarkup.querySelector('button'),
              link: stepEl.querySelector('a[href]'),
              summary: stepEl.querySelector('.step__summary'),
              title: stepTitleEl.textContent.trim(),
            };

            // If there's no summary *content*, we need go no further.
            if (!step.summary.children.length) {
              return;
            }

            // Insert button into DOM.
            stepTitleEl.append(buttonMarkup);

            // Populate button.
            this.toggleStepButton(step, false);

            // Add button id attribute, add button event listener, passing
            // current index to handler.
            step.button.setAttribute('aria-controls', stepId);
            step.button.addEventListener(
              'click',
              this.handleStepButtonClick.bind(this, index),
            );

            // Add id attribute to summary.
            step.summary.id = stepId;

            // Cache each step for later use.
            this.steps.push(step);

            // Likewise with the id.
            this.stepIds.push(stepId);
          });

          /**
           * Set up master control button.
           */

          // If there are no steps with content, we don't need to continue.
          if (!this.steps.some((step) => step.summary.children.length)) {
            return;
          }

          const stepControlTemplate = document.createElement('template');
          stepControlTemplate.innerHTML = Drupal.theme('controlButtonHtml');
          const stepControlMarkup = stepControlTemplate.content.cloneNode(true);
          this.stepControlButton = stepControlMarkup.querySelector('button');
          this.stepControlIcon = stepControlMarkup.querySelector('i.fas');

          // Insert button into DOM.
          this.stepListEl.parentElement.prepend(stepControlMarkup);

          // Populate button.
          this.toggleControlButton(false);

          // Add aria-controls attribute.
          this.stepControlButton.setAttribute(
            'aria-controls',
            this.stepIds.join(' '),
          );

          // Add button event listener.
          this.stepControlButton.addEventListener(
            'click',
            this.handleControlButtonClick.bind(this),
          );
        },
      };

      stepManager.init();
    },
  };
})(Drupal);
