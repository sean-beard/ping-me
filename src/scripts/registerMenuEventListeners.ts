export const registerMenuEventListeners = (
  toggleButton: HTMLElement,
  list: HTMLElement,
) => {
  toggleButton.addEventListener("click", () => {
    list.classList.toggle("open");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && list.classList.contains("open")) {
      list.classList.remove("open");
    }
  });

  document.addEventListener("click", (event) => {
    const eventTarget = event.target as HTMLElement | null;

    if (!eventTarget) {
      return;
    }

    if (
      !list.contains(eventTarget) &&
      !toggleButton.contains(eventTarget) &&
      list.classList.contains("open")
    ) {
      list.classList.remove("open");
    }
  });

  list.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      list.classList.remove("open");
    });
  });
};
