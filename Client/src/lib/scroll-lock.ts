type LenisLike = {
  stop: () => void;
  start: () => void;
  scrollTo: (v: number, opts?: { immediate?: boolean }) => void;
};

declare global {
  interface Window {
    __novaLenis?: LenisLike | null;
  }
}

let lockCount = 0;
let scrollX = 0;
let scrollY = 0;

function blockEvent(e: Event) {
  e.preventDefault();
  e.stopPropagation();
}

function freezeScrollPosition() {
  window.scrollTo(scrollX, scrollY);
}

export function lockPageScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  scrollX = window.scrollX || window.pageXOffset || 0;
  scrollY = window.scrollY || window.pageYOffset || 0;

  document.documentElement.dataset.canvasDrag = "true";
  document.documentElement.classList.add("nova-scroll-locked");
  document.body.classList.add("nova-scroll-locked");

  window.__novaLenis?.stop();

  window.addEventListener("wheel", blockEvent, { passive: false, capture: true });
  window.addEventListener("touchmove", blockEvent, { passive: false, capture: true });
  window.addEventListener("scroll", freezeScrollPosition, { passive: false, capture: true });
}

export function unlockPageScroll() {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  document.documentElement.dataset.canvasDrag = "false";
  document.documentElement.classList.remove("nova-scroll-locked");
  document.body.classList.remove("nova-scroll-locked");

  window.removeEventListener("wheel", blockEvent, true);
  window.removeEventListener("touchmove", blockEvent, true);
  window.removeEventListener("scroll", freezeScrollPosition, true);

  window.scrollTo(scrollX, scrollY);
  window.__novaLenis?.scrollTo(scrollY, { immediate: true });
  window.__novaLenis?.start();
}

export function scrollToTopImmediate() {
  window.__novaLenis?.scrollTo(0, { immediate: true });
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
