import { SimpleSlider } from "./simpleslider.js";

export class BreakpointsSlider extends SimpleSlider {
    constructor({
        sliderSelector,
        activeClassName = "active",
        disableClassName = "disable",
        transition = 600,

        breakpoints = [
            {
                maxClientWidth: 99999,
                slidesCount: 1,
                slidesMargin: 0,
                viewportHeight: true,
                needArrowControl: false,
                needPagination: false,
                needClickablePagination: false,
                needSwipeControl: false,
            },
        ],
    }) {
        super({
            sliderSelector,
            activeClassName,
            disableClassName,
            transition,
            slidesCount: breakpoints[0].slidesCount,
            slidesMargin: breakpoints[0].slidesMargin,
            viewportHeight: breakpoints[0].viewportHeight,
            needArrowControl: breakpoints[0].needArrowControl,
            needPagination: breakpoints[0].needPagination,
            needClickablePagination: breakpoints[0].needClickablePagination,
            needSwipeControl: breakpoints[0].needSwipeControl,
        });

        this.breakpoints = breakpoints;
        this.variablesInit(this.breakpoints);
    }

    variablesInit(breakpoints) {
        for (let i = 0; i < breakpoints.length; i++) {
            if (document.documentElement.clientWidth > breakpoints[i].maxClientWidth) {
                this.clearSlider();
                return;
            }

            if (breakpoints[i + 1] && breakpoints[i + 1].maxClientWidth >= document.documentElement.clientWidth) continue;

            this.slidesCount = breakpoints[i].slidesCount;
            this.slidesMargin = breakpoints[i].slidesMargin;
            this.viewportHeight = breakpoints[i].viewportHeight;
            this.needArrowControl = breakpoints[i].needArrowControl;
            this.needPagination = breakpoints[i].needPagination;
            this.needClickablePagination = breakpoints[i].needClickablePagination;
            this.needSwipeControl = breakpoints[i].needSwipeControl;

            if (this.activeSlide > this.items.length - this.slidesCount) {
                this.activeSlide = this.items.length - this.slidesCount;
            }

            this.createTrack();
            this.addListeners();
            this.windowInit();
            this.checkArrowStatus();

            return;
        }
    }

    destroyTrack() {
        this.items.forEach((item) => {
            item.style.position = "relative";
            item.style.top = "0";
            item.style.left = "0";
            this.viewport.append(item);
        });
        this.track.remove();
    }

    removeListeners() {
        if (!this.needArrowControl && this.arrowsPrev && this.arrowsNext) {
            this.arrowsPrev.forEach((prev) => {
                prev.removeEventListener("click", this.onPrevClick);
            });

            this.arrowsNext.forEach((next) => {
                next.addEventListener("click", this.onNextClick);
            });
        }

        if (!this.needSwipeControl) {
            this.viewport.removeEventListener("pointerdown", this.onPointerDown);
        }

        this.listeners = false;
    }

    clearSlider() {
        this.destroyTrack();
        this.removeListeners();

        this.items.forEach((item) => {
            item.style.width = "";
            item.style.height = "";
            item.style.left = "";
        });
    }

    onResize() {
        this.variablesInit(this.breakpoints);
    }
}
