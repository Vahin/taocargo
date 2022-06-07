export class HideOnScroll {
    constructor({ elementSelector, menuSelector, menuActiveClass = "active", breakpoint = 950 }) {
        this.element = document.querySelector(elementSelector);
        this.menu = document.querySelector(menuSelector);
        this.menuActiveClass = menuActiveClass;
        this.breakpoint = breakpoint;

        this.onScroll = this.onScroll.bind(this);
        this.element.style.willChange = "transform";
        this.element.style.transition = "transform 200ms";
        this.currentYOffset = 0;

        window.addEventListener("scroll", this.onScroll);
    }

    onScroll() {
        if (this.menu.classList.contains(this.menuActiveClass)) return;

        let pageY = window.pageYOffset <= 0 ? 0 : window.pageYOffset;

        let delta = pageY - this.currentYOffset;
        this.currentYOffset = pageY;

        this.toggleElement(delta);
    }

    toggleElement(delta) {
        if (!this.element.style.transform) {
            this.element.style.transform = `translateY(0px)`;
        }

        if (document.documentElement.offsetWidth > this.breakpoint) {
            this.element.style.transform = `translateY(0px)`;
            return;
        }

        let style = this.element.style.transform;

        let currentPos = +style.match(/-?\d+/)[0];

        if (currentPos - delta >= 0) {
            this.element.style.transform = `translateY(0px)`;
        } else if (currentPos - delta < -this.element.offsetHeight) {
            this.element.style.transform = `translateY(${-this.element.offsetHeight}px)`;
        } else {
            this.element.style.transform = `translateY(${currentPos - delta}px)`;
        }
    }
}
