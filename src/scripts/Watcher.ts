export class Watcher {
  private observer: MutationObserver;

  constructor(mutationCallback: (mutation: MutationRecord) => void) {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutationCallback(mutation);
      });
    });
  }

  startWatching(watchTarget: HTMLElement) {
    this.observer.observe(watchTarget, {
      childList: true,
      subtree: true,
    });
  }

  stopWatching() {
    this.observer.disconnect();
  }
}
