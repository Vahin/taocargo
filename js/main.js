// IMPORTS
import { Burger } from "./burger.js";
import { HideOnScroll } from "./hideonscroll.js";
import { SetBGImage } from "./sbi.js";
import { FormSlider } from "./formslider.js";
import { FormModal } from "./modal.js";
import { BreakpointsSlider } from "./breakpointsslider.js";
import { OptionSlider } from "./optionsslider.js";
import { Accordeon } from "./accordeon.js";
import { QuestionsForm } from "./questionsform.js";
import { SmoothScroll } from "./SmoothScroll.js";

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
});

new FormSlider({
    sliderSelector: ".order__slider",
    slidesCount: 1,
    slidesMargin: 0,
    viewportHeight: false,
    needArrowControl: true,
    needPagination: true,
    needClickablePagination: false,
    needSwipeControl: false,
    formSelector: ".order__form",
});

new FormModal({ modalSelector: ".bid" });

new BreakpointsSlider({
    sliderSelector: ".choiseus__slider",

    breakpoints: [
        {
            maxClientWidth: 1300,
            slidesCount: 3,
            slidesMargin: 0,
            viewportHeight: false,
            needArrowControl: false,
            needPagination: true,
            needClickablePagination: true,
            needSwipeControl: true,
        },
        {
            maxClientWidth: 950,
            slidesCount: 1,
            slidesMargin: 0,
            viewportHeight: false,
            needArrowControl: false,
            needPagination: true,
            needClickablePagination: true,
            needSwipeControl: true,
        },
    ],
});

new OptionSlider({
    sliderSelector: ".options__slider",

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
