import { getPortfolioCollection } from "../data/portfolio-collections.js";

/**
 * Menyiapkan galeri Portfolio berdasarkan kategori.
 *
 * Fitur:
 * - Membuka satu dialog reusable dari enam kartu kategori
 * - Menampilkan gambar utama dan thumbnail berdasarkan kategori
 * - Mengganti gambar melalui thumbnail, keyboard, dan swipe
 * - Mendukung ArrowLeft, ArrowRight, Home, End, dan Escape
 * - Menutup melalui tombol close dan backdrop
 * - Mengunci body scroll
 * - Mengembalikan focus ke kartu pembuka
 */
export function initializePortfolioGallery() {
  const categoryTriggers = Array.from(
    document.querySelectorAll("[data-portfolio-category]"),
  );

  const dialog = document.querySelector("[data-portfolio-dialog]");

  const dialogTitle = document.querySelector("[data-portfolio-dialog-title]");

  const mainImage = document.querySelector("[data-portfolio-main-image]");

  const stage = document.querySelector("[data-portfolio-stage]");

  const thumbnailsContainer = document.querySelector(
    "[data-portfolio-thumbnails]",
  );

  const closeButton = document.querySelector("[data-portfolio-dialog-close]");

  if (
    categoryTriggers.length === 0 ||
    !dialog ||
    !dialogTitle ||
    !mainImage ||
    !stage ||
    !thumbnailsContainer ||
    !closeButton
  ) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  let currentCollection = null;
  let currentIndex = 0;
  let lastTrigger = null;

  const SWIPE_THRESHOLD = 48;

  let activePointerId = null;
  let swipeStartX = 0;
  let swipeStartY = 0;

  /**
   * Menjaga index tetap berada di dalam jumlah foto.
   *
   * Contoh:
   * - Previous dari foto pertama menuju foto terakhir.
   * - Next dari foto terakhir kembali ke foto pertama.
   */
  function normalizeIndex(index) {
    const totalImages = currentCollection?.images.length ?? 0;

    if (totalImages === 0) {
      return 0;
    }

    return (index + totalImages) % totalImages;
  }

  /**
   * Membersihkan state gesture swipe.
   */
  function resetSwipeState() {
    activePointerId = null;
    swipeStartX = 0;
    swipeStartY = 0;
  }

  /**
   * Memperbarui thumbnail yang sedang aktif.
   */
  function updateActiveThumbnail({ scrollIntoView = false } = {}) {
    const thumbnails = Array.from(
      thumbnailsContainer.querySelectorAll("[data-portfolio-thumbnail]"),
    );

    thumbnails.forEach((thumbnail, index) => {
      const isActive = index === currentIndex;

      thumbnail.classList.toggle("is-active", isActive);

      if (isActive) {
        thumbnail.setAttribute("aria-current", "true");
      } else {
        thumbnail.removeAttribute("aria-current");
      }
    });

    if (!scrollIntoView) {
      return;
    }

    const activeThumbnail = thumbnails[currentIndex];

    activeThumbnail?.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }

  /**
   * Menampilkan foto berdasarkan index.
   */
  function showImage(index, options = {}) {
    if (!currentCollection || currentCollection.images.length === 0) {
      return;
    }

    currentIndex = normalizeIndex(index);

    const image = currentCollection.images[currentIndex];

    const updateImageLayout = () => {
      if (mainImage.naturalWidth <= 0 || mainImage.naturalHeight <= 0) {
        return;
      }

      const isPortrait = mainImage.naturalHeight > mainImage.naturalWidth;

      stage.style.aspectRatio = `${mainImage.naturalWidth} / ${mainImage.naturalHeight}`;

      stage.classList.toggle("is-portrait", isPortrait);
    };

    mainImage.onload = updateImageLayout;

    mainImage.src = image.src;
    mainImage.alt = image.alt;

    // Jika gambar sudah tersimpan di browser cache,
    // event load bisa saja sudah selesai sebelum listener dipasang.
    if (mainImage.complete && mainImage.naturalWidth > 0) {
      updateImageLayout();
    }

    updateActiveThumbnail(options);
  }

  /**
   * Membuat daftar thumbnail berdasarkan kategori.
   */
  function renderThumbnails(collection) {
    const fragment = document.createDocumentFragment();

    collection.images.forEach((image, index) => {
      const thumbnailButton = document.createElement("button");
      const thumbnailImage = document.createElement("img");

      thumbnailButton.className = "portfolio-dialog__thumbnail";

      thumbnailButton.type = "button";

      thumbnailButton.dataset.portfolioThumbnail = "";

      thumbnailButton.dataset.index = String(index);

      thumbnailButton.setAttribute(
        "aria-label",
        `Tampilkan ${image.title}, foto ${index + 1} dari ${
          collection.images.length
        }`,
      );

      thumbnailImage.src = image.thumbnail;
      thumbnailImage.alt = "";
      thumbnailImage.width = 320;
      thumbnailImage.height = 200;
      thumbnailImage.loading = "lazy";
      thumbnailImage.decoding = "async";

      thumbnailButton.append(thumbnailImage);
      fragment.append(thumbnailButton);
    });

    thumbnailsContainer.replaceChildren(fragment);
  }

  /**
   * Membersihkan state sesudah dialog ditutup.
   */
  function cleanupDialogState() {
    document.body.classList.remove("portfolio-dialog-open");

    const triggerToRestore = lastTrigger;

    currentCollection = null;
    currentIndex = 0;
    lastTrigger = null;

    if (triggerToRestore && triggerToRestore.isConnected) {
      window.requestAnimationFrame(() => {
        triggerToRestore.focus();
      });
    }
  }

  /**
   * Membuka dialog berdasarkan kartu kategori.
   */
  function openDialog(trigger) {
    const categorySlug = trigger.dataset.portfolioCategory;

    const collection = getPortfolioCollection(categorySlug);

    if (!collection || collection.images.length === 0 || dialog.open) {
      return;
    }

    currentCollection = collection;
    currentIndex = 0;
    lastTrigger = trigger;

    dialogTitle.textContent = collection.name;

    renderThumbnails(collection);
    showImage(0);

    document.body.classList.add("portfolio-dialog-open");

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    window.requestAnimationFrame(() => {
      closeButton.focus();
    });
  }

  /**
   * Menutup dialog kategori.
   */
  function closeDialog() {
    if (!dialog.open) {
      return;
    }

    if (typeof dialog.close === "function") {
      dialog.close();
      return;
    }

    dialog.removeAttribute("open");
    cleanupDialogState();
  }

  /**
   * Membuka collection melalui kartu Portfolio.
   */
  categoryTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openDialog(trigger);
    });
  });

  /**
   * Mengganti gambar melalui thumbnail.
   *
   * Event delegation digunakan agar listener tidak perlu
   * dibuat ulang setiap collection dibuka.
   */
  thumbnailsContainer.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const thumbnail = event.target.closest("[data-portfolio-thumbnail]");

    if (!thumbnail || !thumbnailsContainer.contains(thumbnail)) {
      return;
    }

    const index = Number.parseInt(thumbnail.dataset.index ?? "", 10);

    if (!Number.isInteger(index)) {
      return;
    }

    showImage(index);
  });

  /**
   * Menyimpan posisi awal gesture pada perangkat sentuh.
   *
   * Mouse sengaja diabaikan karena navigasi desktop
   * sudah tersedia melalui thumbnail dan keyboard.
   */
  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" || !currentCollection) {
      return;
    }

    activePointerId = event.pointerId;
    swipeStartX = event.clientX;
    swipeStartY = event.clientY;

    stage.setPointerCapture?.(event.pointerId);
  });

  /**
   * Mengganti foto ketika gesture horizontal
   * melewati batas minimum swipe.
   */
  stage.addEventListener("pointerup", (event) => {
    if (event.pointerId !== activePointerId || !currentCollection) {
      return;
    }

    const deltaX = event.clientX - swipeStartX;
    const deltaY = event.clientY - swipeStartY;

    resetSwipeState();

    const isHorizontalGesture = Math.abs(deltaX) > Math.abs(deltaY);

    const passesThreshold = Math.abs(deltaX) >= SWIPE_THRESHOLD;

    if (!isHorizontalGesture || !passesThreshold) {
      return;
    }

    const nextIndex = deltaX < 0 ? currentIndex + 1 : currentIndex - 1;

    showImage(nextIndex, {
      scrollIntoView: true,
    });
  });

  /**
   * Membersihkan gesture ketika browser membatalkan pointer,
   * misalnya saat pengguna melakukan scroll vertikal.
   */
  stage.addEventListener("pointercancel", resetSwipeState);

  /**
   * Menutup melalui tombol close.
   */
  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    closeDialog();
  });

  /**
   * Menutup ketika backdrop diklik.
   */
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  /**
   * Navigasi keyboard.
   *
   * Escape ditangani secara native oleh elemen dialog.
   */
  dialog.addEventListener("keydown", (event) => {
    if (!currentCollection) {
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();

        showImage(currentIndex - 1, {
          scrollIntoView: true,
        });

        break;

      case "ArrowRight":
        event.preventDefault();

        showImage(currentIndex + 1, {
          scrollIntoView: true,
        });

        break;

      case "Home":
        event.preventDefault();

        showImage(0, {
          scrollIntoView: true,
        });

        break;

      case "End":
        event.preventDefault();

        showImage(currentCollection.images.length - 1, {
          scrollIntoView: true,
        });

        break;

      default:
        break;
    }
  });

  /**
   * Event close juga dipanggil ketika dialog ditutup
   * menggunakan Escape.
   */
  dialog.addEventListener("close", cleanupDialogState);
}
