import { SimpleSlider } from "./simpleslider.js";

export class WelcomeSlider extends SimpleSlider {
    constructor({
        sliderSelector,
        activeClassName = "active",
        disableClassName = "disable",
        transition = 600,
        slidesCount = 1,
        slidesMargin = 0,
        slidesInterval = 0,
        viewportHeight = true,
        needArrowControl = false,
        needPagination = false,
        needClickablePagination = false,
        needSwipeControl = false,

        flexArrows = {
            containerSelector,
            spotPoint,
        },
        sectionSelector,
    }) {
        super({
            sliderSelector,
            activeClassName,
            disableClassName,
            transition,
            slidesCount,
            slidesMargin,
            slidesInterval,
            viewportHeight,
            needArrowControl,
            needPagination,
            needClickablePagination,
            needSwipeControl,
        });
        this.flexArrows = flexArrows;
        this.section = document.querySelector(sectionSelector);
        this.resizeSection();
        this.windowInit();
        this.resizeArrows();
    }

    onResize() {
        this.resizeSection();
        this.resizeArrows();
        super.onResize();
    }

    resizeArrows() {
        if (this.flexArrows.spotPoint < document.documentElement.clientWidth) {
            this.arrowsPrev[0].style.width = `${
                (this.viewport.offsetWidth - document.querySelector(this.flexArrows.containerSelector).offsetWidth) / 2
            }px`;
            this.arrowsNext[0].style.width = `${
                (this.viewport.offsetWidth - document.querySelector(this.flexArrows.containerSelector).offsetWidth) / 2
            }px`;
        } else {
            this.arrowsPrev[0].style.width = "";
            this.arrowsNext[0].style.width = "";
        }
    }

    resizeSection() {
        let headerHeight = document.querySelector(".header").offsetHeight;

        if (document.documentElement.clientWidth <= this.section.offsetWidth + 10) {
            this.section.style.minHeight = `${document.documentElement.clientHeight}px`;
            return;
        }

        this.section.style.minHeight = `${document.documentElement.clientHeight - headerHeight - 20}px`;
    }
}
