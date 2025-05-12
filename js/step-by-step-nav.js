/**
 * @file
 * Additional behaviour for the Step by step navigation.
 */

(function (Drupal) {
  Drupal.behaviors.stepByStepNav = {
    attach(context) {
      /**
       * Toggles all summaries
       */
      function toggleAllSummaries(expanded) {
        const attrValue = String(expanded);
        let message;

        steps.forEach((step) => {
          if (step.button.getAttribute(stepAriaAttr) !== attrValue) {
            toggleStepButton(step, expanded);
          }
        });

        steps.filter((step) => step.button.getAttribute(stepAriaAttr) !== attrValue)

        if (expanded) {
          message = Drupal.t("Step summaries expanded");
        } else {
          message = Drupal.t("Step summaries collapsed");
        }

        Drupal.announce(message);
      }

      /**
       * Toggles the state of the control button.
       *
       * @param {boolean} pressed
       */
      function toggleControlButton(pressed) {
        stepControlButton.innerHTML = Drupal.theme.controlButtonText(pressed);
        stepControlButton.setAttribute(stepControlAriaAttr, pressed);

        if (stepControlIcon && pressed) {
          stepControlIcon.classList.add(stepControlIcon.dataset.pressedClass);
          stepControlIcon.classList.remove(
            stepControlIcon.dataset.unpressedClass,
          );
        } else if (stepControlIcon && !pressed) {
          stepControlIcon.classList.add(stepControlIcon.dataset.unpressedClass);
          stepControlIcon.classList.remove(
            stepControlIcon.dataset.pressedClass,
          );
        }
      }

      /**
       * Handle clicks on individual step buttons.
       *
       * @param {object} step
       *   A simple object containing button, link, summary, and title of a
       *   given step.
       */
      function handleControlButtonClick({ currentTarget, target }) {
        let message;

        if (currentTarget !== target) {
          return;
        }

        const pressed = target.getAttribute(stepControlAriaAttr) !== "true";
        toggleControlButton(pressed);
        toggleAllSummaries(pressed);
      }

      /**
       * Toggles the state of a step button.
       *
       * @param {object} step
       *   A simple object containing button, link, summary, and title of a
       *   given step.
       */
      function toggleStepButton({ button, summary, title }, expanded) {
        let ariaLabel;

        if (expanded) {
          ariaLabel = Drupal.t("Hide step summary - !stepTitle", {
            "!stepTitle": title,
          });
        } else {
          ariaLabel = Drupal.t("Show step summary - !stepTitle", {
            "!stepTitle": title,
          });
        }

        button.innerHTML = Drupal.theme("stepButtonText", expanded);
        button.setAttribute(stepAriaAttr, expanded);
        button.setAttribute("aria-label", ariaLabel);
        summary.classList[expanded ? "add" : "remove"]("step-show-summary");
      }

      /**
       * Handle clicks on Show/Hide all summaries button.
       *
       * @param {Event} event
       *   The event object passed in by the listener.
       */
      function handleStepButtonClick(index, { currentTarget, target }) {
        if (currentTarget !== target) {
          return;
        }

        toggleStepButton(
          steps[index],
          target.getAttribute(stepAriaAttr) !== "true",
        );

        const hiddenSteps = !!steps.some(
          (step) => step.button.getAttribute(stepAriaAttr) === "false",
        );

        // 'Show all' control displayed if any steps are hidden, and 'Hide all'
        // control displayed otherwise.
        toggleControlButton(!hiddenSteps);
      }

      // Set up interactivity.

      const [stepListEl] = once("sts-steplist", "ol.step-list", context);
      const stepAriaAttr = "aria-expanded";
      const stepControlAriaAttr = "aria-pressed";
      const steps = [];

      if (!stepListEl) {
        return;
      }

      const stepEls = once("sts-step", ".step", stepListEl);

      // Set up master control button.
      const stepControlTemplate = document.createElement("template");
      stepControlTemplate.innerHTML = Drupal.theme("controlButtonHtml");

      const stepControlMarkup = stepControlTemplate.content.cloneNode(true);
      const stepControlButton = stepControlMarkup.querySelector("button");
      const stepControlIcon = stepControlMarkup.querySelector("i.fas");

      // Insert button into DOM.
      stepListEl.parentElement.prepend(stepControlMarkup);

      // Populate button.
      toggleControlButton(false);

      // Add button event listener.
      stepControlButton.addEventListener("click", handleControlButtonClick);

      // Set up step buttons.
      const stepButtonTemplate = document.createElement("template");
      stepButtonTemplate.innerHTML = Drupal.theme("stepButtonHtml");
      stepEls.forEach((stepEl, index) => {
        const buttonMarkup = stepButtonTemplate.content.cloneNode(true);
        const stepTitleEl = stepEl.querySelector(".step__title");
        const step = {};

        step.button = buttonMarkup.querySelector("button");
        step.link = stepEl.querySelector("a[href]");
        step.summary = stepEl.querySelector(".step__summary");
        step.title = stepTitleEl.textContent.trim();

        // Insert button into DOM.
        stepTitleEl.append(buttonMarkup);

        // Populate button.
        toggleStepButton(step, false);

        // Add button event listener, passing current index to handler.
        step.button.addEventListener(
          "click",
          handleStepButtonClick.bind(null, index),
        );

        // Cache each step for later use.
        steps.push(step);
      });
    },
  };
})(Drupal);
