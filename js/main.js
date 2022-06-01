// IMPORTS
import { Burger } from "./burger.js";
import { HideOnScroll } from "./hideonscroll.js";
import { SetBGImage } from "./sbi.js";
import { FormModal } from "./modal.js";
import { BreakpointsSlider } from "./breakpointsslider.js";
import { OptionSlider } from "./optionsslider.js";
import { Accordeon } from "./accordeon.js";
import { QuestionsForm } from "./questionsform.js";
import { SmoothScroll } from "./SmoothScroll.js";
import { formMixin } from "./formMixin.js";

// FUNCTIONS
function addClassOnResize({ element, className, size }) {
    if (document.documentElement.clientWidth <= size) {
        element.classList.add(className);
    }

    window.addEventListener("resize", () => {
        if (document.documentElement.clientWidth <= size) {
            element.classList.add(className);
            return;
        }
        element.classList.remove(className);
    });
}

// BODY
new Burger({
    burger: document.querySelector(".burger"),
    menu: document.querySelector(".header__nav"),
});

//! --------- Исправить плавность на мобилках --------- !//

new HideOnScroll({
    element: document.querySelector(".header"),
    menu: document.querySelector(".header__nav"),
});

new SetBGImage({
    elements: document.querySelectorAll("[data-sbi]"),
});

addClassOnResize({
    element: document.querySelector(".header__request-button"),
    className: "button_big",
    size: 950,
});

// --------- Слайдер титульного экрана --------- //

const welcomeSlider = new Swiper(".welcome__swiper", {
    lazy: {
        loadPrevNext: true,
    },
    navigation: {
        prevEl: ".swiper-custom-button-prev",
        nextEl: ".swiper-custom-button-next",
        disabledClass: "swiper-custom-button-disabled",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    speed: 600,
    on: {
        resize: () => {
            setNavWidth(".swiper-custom-button", ".swiper-wrapper", ".welcome__container");
            setSwiperHeight(".welcome__swiper");
        },
    },
});

function getMarginLeft(selector1, selector2, min) {
    let el1 = document.querySelector(selector1);
    let el2 = document.querySelector(selector2);

    let margin = el1.getBoundingClientRect().left - el2.getBoundingClientRect().left;
    margin = Math.abs(margin);

    return margin < min ? min : margin;
}

function setNavWidth(selector, x, y) {
    let navs = document.querySelectorAll(selector);

    for (let nav of navs) {
        nav.style.width = getMarginLeft(x, y, 50) + "px";
    }
}

function setSwiperHeight(selector) {
    let headerHeight = document.querySelector(".header").offsetHeight;
    let windowHeight = document.documentElement.clientHeight;
    let h;

    if (document.documentElement.offsetWidth <= 950) {
        h = windowHeight;
    } else {
        h = windowHeight - headerHeight;
    }

    document.querySelector(selector).style.height = h + "px";
}

setSwiperHeight(".welcome__swiper");

setNavWidth(".swiper-custom-button", ".swiper-wrapper", ".welcome__container");

// --------------------------------------------- //

// ---------- Слайдер формы ---------- //

const formSlides = document.querySelector(".order__slider").querySelectorAll(".swiper-slide");
let inputsList = [];
const orederForm = document.querySelector(".order__form");

formSlides.forEach((formSlide, index) => {
    let slide = {};
    slide.inputs = formSlide.querySelectorAll("input");

    if (formSlide.querySelector(".slider-prev")) {
        slide.prev = formSlide.querySelector(".slider-prev");
        slide.prev.addEventListener("click", (event) => {
            event.preventDefault();
            formSlider.slidePrev();
        });
    }

    if (formSlide.querySelector(".slider-next")) {
        slide.next = formSlide.querySelector(".slider-next");
        slide.next.addEventListener("click", (event) => {
            event.preventDefault();
            onOrderFormNext(index);
        });
    }

    if (formSlide.querySelectorAll("[data-type=tel]")) {
        const telInputs = formSlide.querySelectorAll("[data-type=tel]");
        telInputs.forEach((input) => {
            input.addEventListener("input", (event) => {
                formMixin.onTelephoneInput(event, input);
            });
        });
    }

    if (formSlide.querySelectorAll("[data-type=file]")) {
        const fileInputs = formSlide.querySelectorAll("[data-type=file]");
        fileInputs.forEach((input) => {
            input.addEventListener("input", (event) => {
                formMixin.onLoadingFile({
                    element: input,
                    preview: input.nextElementSibling,
                    complete: onLoadFile,
                });
            });
        });
    }

    inputsList.push(slide);
});

const formSlider = new Swiper(".order__slider", {
    allowTouchMove: false,
});

let unloadButton = document.querySelector(".order__slider").querySelector(".form__assistant-button_red");
unloadButton.addEventListener("click", (event) => event.preventDefault());

function onLoadFile(item, url) {
    item.style.background = `url(${url}) center center / cover no-repeat`;
    unloadButton.addEventListener("click", (event) => {
        onUnloadFile(event, item);
    });
}

function onUnloadFile(event, item) {
    event.preventDefault();
    item.style.background = `none`;
    item.previousElementSibling.value = null;
}

function onOrderFormNext(index) {
    if (
        formMixin.isValidList(inputsList[index].inputs, {
            invalidCallback: (input) => {
                input.classList.add("invalid");

                setTimeout(() => input.classList.remove("invalid"), 600);
            },
        })
    ) {
        formSlider.slideNext();
        orederForm.querySelectorAll(".slider-pagination-item")[index + 1].classList.add("active");
    }
}

const calculateButton = orederForm.querySelector(".form__assistant-button_orange");
const volumeModal = orederForm.querySelector(".modal");
const volumeCross = volumeModal.querySelector(".modal__cross");
const volumeButton = volumeModal.querySelector(".modal-button");
const volumeSelect = volumeModal.querySelector("select");
const volumeSlides = volumeModal.querySelectorAll("input");

calculateButton.addEventListener("click", onCalculateButtonClick);
volumeSelect.addEventListener("change", onVolumeChange);

function onCalculateButtonClick(event) {
    event.preventDefault();

    volumeModal.classList.add("active");
    document.querySelector("body").classList.add("lock");

    volumeCross.addEventListener("click", onCrossClick);
    volumeModal.addEventListener("click", onCrossClick);
    volumeButton.addEventListener("click", onCalculateButton);
    volumeSelect.addEventListener("change", onVolumeChange);
}

function onCrossClick(event) {
    event.preventDefault();

    if (!(event.target == volumeModal) && !(event.target == volumeCross)) return;

    closeOrderModal();
}

function closeOrderModal() {
    volumeModal.classList.remove("active");
    document.querySelector("body").classList.remove("lock");
}

const calculateTarget = orederForm.querySelector("[data-target=volume]");

function onCalculateButton() {
    if (
        formMixin.isValidList(volumeSlides, {
            invalidCallback: (input) => {
                input.classList.add("invalid");

                setTimeout(() => input.classList.remove("invalid"), 600);
            },
        })
    ) {
        calculateTarget.value = calculateVolume();
        formMixin.setStorage(calculateTarget);
        closeOrderModal();
    }
}

function calculateVolume() {
    let result = 1;
    if (volumeSelect.value == "meters") {
        for (let i = 0; i < volumeSlides.length; i++) {
            result *= volumeSlides[i].value;
        }
    }

    if (volumeSelect.value == "santimeters") {
        for (let i = 0; i < volumeSlides.length; i++) {
            result *= volumeSlides[i].value / 100;
        }
    }

    return result ? result : 0;
}

function onVolumeChange() {
    if (volumeSelect.value == "meters") {
        for (let i = 0; i < volumeSlides.length; i++) {
            volumeSlides[i].value = this.volumeSlides[i].value / 100;
            volumeSlides[i].setAttribute("step", "0.1");
        }
    }

    if (volumeSelect.value == "santimeters") {
        for (let i = 0; i < volumeSlides.length; i++) {
            volumeSlides[i].value = volumeSlides[i].value * 100;
            volumeSlides[i].setAttribute("step", "10");
        }
    }
}

const storageList = orederForm.querySelectorAll("[data-storage]");

formMixin.addStorageEvent(storageList);

formMixin.onStorage(storageList);

window.addEventListener("storage", () => {
    formMixin.onStorage(storageList);
});

// --------------------------------- //

new FormModal({ modalSelector: ".bid" });

// ---------- Слайдер .choiseus ---------- //
const choiseusSwiper = new Swiper(".choiseus__slider", {
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    slidesPerView: 1,
    grid: {
        rows: 1,
    },
    spaceBetween: 0,
    breakpoints: {
        950: {
            slidesPerView: 3,
            grid: {
                rows: 1,
            },
            spaceBetween: 30,
        },
        1300: {
            slidesPerView: 4,
            grid: {
                rows: 2,
            },
            spaceBetween: 30,
        },
    },
});

// --------------------------------------- //

const optionSlider = new Swiper(".options__slider", {
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    spaceBetween: 30,
    slidesPerView: 1,

    breakpoints: {
        750: {
            spaceBetween: 30,
            slidesPerView: 2,
        },
        1270: {
            spaceBetween: 30,
            slidesPerView: 3,
        },
    },
});

if (document.documentElement.clientWidth >= 1300) {
    setNavWidth(".swiper-options-button", ".options", ".options__slider");
}

window.addEventListener("resize", () => {
    if (document.documentElement.clientWidth >= 1300) {
        setNavWidth(".swiper-options-button", ".options", ".options__slider");
    }
});

const optionButtonPrev = document.querySelector(".swiper-options-button-prev");
const optionButtonNext = document.querySelector(".swiper-options-button-next");

function toggleDisabledClass(prev, next, slider) {
    if (slider.isBeginning) {
        prev.classList.add("disabled");
    } else {
        prev.classList.remove("disabled");
    }

    if (slider.isEnd) {
        next.classList.add("disabled");
    } else {
        next.classList.remove("disabled");
    }
}

toggleDisabledClass(optionButtonPrev, optionButtonNext, optionSlider);

optionSlider.on("activeIndexChange", () => {
    toggleDisabledClass(optionButtonPrev, optionButtonNext, optionSlider);
});

optionButtonPrev.addEventListener("click", () => {
    optionSlider.slidePrev();
});
optionButtonNext.addEventListener("click", () => {
    optionSlider.slideNext();
});

// ------------------------------------------ //

const serviceSlider = new OptionSlider({
    sliderSelector: ".services__slider",

    breakpoints: [
        {
            maxClientWidth: 99999,
            slidesCount: 3,
            slidesMargin: 30,
            viewportHeight: false,
            needArrowControl: true,
            needPagination: false,
            needClickablePagination: false,
            needSwipeControl: true,
        },
        {
            maxClientWidth: 1140,
            slidesCount: 2,
            slidesMargin: 30,
            viewportHeight: false,
            needArrowControl: false,
            needPagination: true,
            needClickablePagination: true,
            needSwipeControl: true,
        },
        {
            maxClientWidth: 950,
            slidesCount: 1,
            slidesMargin: 30,
            viewportHeight: false,
            needArrowControl: false,
            needPagination: true,
            needClickablePagination: true,
            needSwipeControl: true,
        },
    ],
});

const questAccord = new Accordeon({
    accordeonSelector: ".questions__accordeon",
});

new QuestionsForm({
    formSelector: ".questions__form",
});

class TaoScroll extends SmoothScroll {
    constructor({ list, speed = 3, breakpoint = 950 }) {
        super({ list, speed, breakpoint });
    }

    onClick({ event, target, targetNumber, speed = 1 }) {
        event.preventDefault();

        if (!targetNumber) {
            super.onClick({ event, target, targetNumber, speed });
            return;
        }

        if (target == "services") {
            this.smoothScrollTo({
                element: document.querySelector(`.${target}`),
                speed,
                onEnd: () => {
                    serviceSlider.moveSliderTo(targetNumber - 1);
                },
            });
        }

        if (target == "questions") {
            this.smoothScrollTo({
                element: document.querySelector(`.${target}`),
                speed,
                onEnd: () => {
                    questAccord.onClick(new Event("click"), targetNumber - 1);
                },
            });
        }
    }
}

new TaoScroll({
    list: document.querySelectorAll("[data-anchor]"),
    breakpoint: 950,
});
