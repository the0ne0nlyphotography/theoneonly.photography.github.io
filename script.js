const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const gallery = document.querySelector("#gallery");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

function openLightbox(image) {
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

async function loadGallery() {
  if (!gallery) return;

  try {
    const response = await fetch(
      "https://api.github.com/repos/the0ne0nlyphotography/theoneonly.photography.github.io/contents/images"
    );

    if (!response.ok) {
      throw new Error("Could not load images.");
    }

    const files = await response.json();

    const imageFiles = files
      .filter(file => {
        const name = file.name.toLowerCase();

        return (
          file.type === "file" &&
          (
            name.endsWith(".jpg") ||
            name.endsWith(".jpeg") ||
            name.endsWith(".png") ||
            name.endsWith(".webp")
          )
        );
      })
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: "base"
        })
      );

    gallery.innerHTML = "";

    if (imageFiles.length === 0) {
      gallery.innerHTML = "<p>No photos found.</p>";
      return;
    }

    imageFiles.forEach((file, index) => {
      const figure = document.createElement("figure");

      const layoutClasses = [
        "gallery-item",
        "gallery-item--large",
        "gallery-item--tall",
        "gallery-item--wide"
      ];

      figure.className =
        layoutClasses[index % layoutClasses.length];

      const button = document.createElement("button");
      button.className = "gallery-button";
      button.type = "button";
      button.setAttribute(
        "aria-label",
        `Open ${file.name}`
      );

      const image = document.createElement("img");

      image.src = file.download_url;
      image.alt =
        "Photography by The One Only Photography";
      image.loading = "lazy";

      button.appendChild(image);
      figure.appendChild(button);
      gallery.appendChild(figure);

      button.addEventListener("click", () => {
        openLightbox(image);
      });
    });

  } catch (error) {
    console.error(error);

    gallery.innerHTML =
      "<p>Unable to load the photography gallery right now.</p>";
  }
}

document
  .querySelector(".lightbox-close")
  ?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    lightbox.classList.contains("is-open")
  ) {
    closeLightbox();
  }
});

document.getElementById("year").textContent =
  new Date().getFullYear();

loadGallery();
