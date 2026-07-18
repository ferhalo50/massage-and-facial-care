/* =========================
   SCROLL ANIMATIONS
========================= */

const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");
        }
    });
});

hiddenElements.forEach((el) => observer.observe(el));

/* =========================
   MOBILE MENU
========================= */

const header = document.getElementById("header");
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const mobileBreakpoint = window.matchMedia("(max-width: 768px)");

function setMobileMenu(isOpen){

    if(!menuToggle || !nav){

        return;
    }

    nav.classList.toggle("active", isOpen);
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    const menuLabel = currentLanguage === "es"
    ? (isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación")
    : (isOpen ? "Close navigation menu" : "Open navigation menu");

    menuToggle.setAttribute("aria-label", menuLabel);
}

if(menuToggle && nav){

    menuToggle.addEventListener("click", () => {

        setMobileMenu(!nav.classList.contains("active"));
    });

    nav.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            setMobileMenu(false);
        });
    });

    document.addEventListener("click", (event) => {

        if(
            mobileBreakpoint.matches &&
            nav.classList.contains("active") &&
            header &&
            !header.contains(event.target)
        ){

            setMobileMenu(false);
        }
    });

    document.addEventListener("keydown", (event) => {

        if(event.key === "Escape"){

            setMobileMenu(false);
        }
    });

    window.addEventListener("resize", () => {

        if(!mobileBreakpoint.matches){

            setMobileMenu(false);
        }
    });
}

/* =========================
   HEADER SCROLL EFFECT
========================= */

window.addEventListener("scroll", () => {

    if(!header){

        return;
    }

    header.classList.toggle("header-scrolled", window.scrollY > 80);
});

/* =========================
   LANGUAGE SYSTEM
========================= */

const languageToggle = document.getElementById("language-toggle");
let currentLanguage = localStorage.getItem("language") || "en";

const appointmentEmailAddress = "spatherapy@hotmail.com";

function updateAppointmentEmailLinks(){

    const isSpanish = currentLanguage === "es";

    const subject = isSpanish
    ? "Solicitud de cita – Massage & Facial Care"
    : "Appointment Request – Massage & Facial Care";

    const body = isSpanish
    ? "Hola,\n\nMe gustaría agendar una cita. Por favor, indíquenme su disponibilidad.\n\nFecha preferida:\nServicio de interés:\n\nGracias."
    : "Hello,\n\nI would like to schedule an appointment. Please let me know your availability.\n\nPreferred date:\nService of interest:\n\nThank you.";

    const mailtoLink = `mailto:${appointmentEmailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    document
    .querySelectorAll("[data-appointment-email]")
    .forEach((link) => {

        link.href = mailtoLink;
    });
}

function updateLocalizedAttributes(){

    const localizedAttributes = [
        ["aria-label", "aria-label"],
        ["alt", "alt"],
        ["title", "title"],
        ["lightbox-alt", "data-lightbox-alt"]
    ];

    localizedAttributes.forEach(([dataSuffix, targetAttribute]) => {

        document
        .querySelectorAll(`[data-en-${dataSuffix}]`)
        .forEach((element) => {

            const translatedValue = element.getAttribute(
                `data-${currentLanguage}-${dataSuffix}`
            );

            if(translatedValue !== null){

                element.setAttribute(targetAttribute, translatedValue);
            }
        });
    });
}

function updateReadMoreButtons(){

    document
    .querySelectorAll(".read-more-btn")
    .forEach((button) => {

        const reviewText = button.previousElementSibling;
        const isExpanded = reviewText?.classList.contains("expanded");

        button.textContent = isExpanded
        ? (currentLanguage === "es" ? button.dataset.lessEs : button.dataset.lessEn)
        : (currentLanguage === "es" ? button.dataset.readEs : button.dataset.readEn);
    });
}

function updateLanguage(){

    document.documentElement.lang = currentLanguage;

    document
    .querySelectorAll("[data-en]")
    .forEach((element) => {

        element.textContent = element.getAttribute(`data-${currentLanguage}`);
    });

    document
    .querySelectorAll("[data-en-placeholder]")
    .forEach((element) => {

        element.placeholder = element.getAttribute(
            `data-${currentLanguage}-placeholder`
        );
    });

    if(languageToggle){

        languageToggle.textContent = currentLanguage === "en" ? "ES" : "EN";
    }

    updateLocalizedAttributes();

    if(menuToggle && nav){

        setMobileMenu(nav.classList.contains("active"));
    }

    updateReadMoreButtons();
    updateAppointmentEmailLinks();
}

updateLanguage();

if(languageToggle){

    languageToggle.addEventListener("click", () => {

        currentLanguage = currentLanguage === "en" ? "es" : "en";

        localStorage.setItem("language", currentLanguage);

        updateLanguage();
    });
}

/* =========================
   LOADER
========================= */

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    loader?.classList.add("hidden-loader");
});

/* =========================
   ACTIVE NAVIGATION
========================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach((section) => {

        if(window.pageYOffset >= section.offsetTop - 200){

            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {

        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${current}`
        );
    });
});

/* =========================
   IMAGE LIGHTBOX
========================= */

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");

function openLightbox(src, alt){

    if(!lightbox || !lightboxImg || !src){

        return;
    }

    lightboxImg.src = src;
    lightboxImg.alt = alt || (currentLanguage === "es" ? "Imagen ampliada" : "Expanded image");
    lightbox.classList.add("active");
    document.body.classList.add("lightbox-open");
}

function closeLightbox(){

    if(!lightbox){

        return;
    }

    lightbox.classList.remove("active");
    document.body.classList.remove("lightbox-open");
}

if(lightbox && lightboxImg && lightboxClose){

    document
    .querySelectorAll(".gallery-item img")
    .forEach((img) => {

        img.addEventListener("click", () => {

            openLightbox(
                img.currentSrc || img.src,
                img.alt || (currentLanguage === "es" ? "Imagen de la galería" : "Gallery image")
            );
        });
    });

    document
    .querySelectorAll("[data-lightbox-src]")
    .forEach((trigger) => {

        trigger.addEventListener("click", () => {

            openLightbox(
                trigger.dataset.lightboxSrc,
                trigger.dataset.lightboxAlt || (currentLanguage === "es" ? "Imagen ampliada" : "Expanded image")
            );
        });
    });

    lightboxClose.addEventListener("click", closeLightbox);

    lightboxClose.addEventListener("keydown", (event) => {

        if(event.key === "Enter" || event.key === " "){

            event.preventDefault();
            closeLightbox();
        }
    });

    lightbox.addEventListener("click", (event) => {

        if(event.target === lightbox){

            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {

        if(event.key === "Escape"){

            closeLightbox();
        }
    });
}

/* =========================
   READ MORE REVIEWS
========================= */

document
.querySelectorAll(".read-more-btn")
.forEach((button) => {

    button.addEventListener("click", () => {

        const reviewText = button.previousElementSibling;

        if(!reviewText){

            return;
        }

        reviewText.classList.toggle("expanded");

        updateReadMoreButtons();
    });
});
