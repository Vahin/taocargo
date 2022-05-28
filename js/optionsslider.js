import { BreakpointsSlider } from "./breakpointsslider.js";

export class OptionSlider extends BreakpointsSlider {
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
        super({ sliderSelector, activeClassName, disableClassName, transition, breakpoints });
    }

    windowInit() {
        super.windowInit();
        if (this.arrowsNext) {
            let width = this.viewport.getBoundingClientRect().left;
            this.arrowsNext.forEach((item) => {
                item.style.width = width + "px";
            });
            this.arrowsPrev.forEach((item) => {
                item.style.width = width + "px";
            });
        }
    }
}
