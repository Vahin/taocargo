export class SmoothScroll {
    constructor({ list, speed = 3, breakpoint = 0, onEnd = () => {} }) {
        this.list = list;
        this.speed = speed;
        this.breakpoint = breakpoint;
        this.smoothScrollTo = this.smoothScrollTo.bind(this);
        this.onEnd = onEnd;

        this.list.forEach((item) => {
            let target = item.dataset.anchor;
            let targetNumber;

            if (target.match(/\:/)) {
                [target, targetNumber] = item.dataset.anchor.split(":");
            }

            item.addEventListener("click", (event) => {
                this.onClick({
                    event,
                    target,
                    targetNumber,
                    speed: this.speed,
                });
            });
        });
    }

    onClick({ event, target, targetNumber, speed = 1 }) {
        event.preventDefault();

        this.smoothScrollTo({
            element: document.querySelector(`.${target}`),
            speed,
        });
    }

    smoothScrollTo({ element, onEnd = () => {} }) {
        if (!element) return;
        let offsetTop = document.querySelector("header").offsetHeight;

        let startPosition = window.pageYOffset;
        let endPosition = element.getBoundingClientRect().top;
        if (endPosition < 0 && window.clientWidth < this.breakpoint) endPosition -= offsetTop;

        if (startPosition + endPosition < 0) {
            endPosition = -startPosition;
        }
        let y = startPosition + endPosition;

        window.scrollBy({
            top: endPosition,
            behavior: "smooth",
        });

        let endInterval = setInterval(() => {
            if (window.pageYOffset >= y - 20 && window.pageYOffset <= y + 20) {
                onEnd();
                clearInterval(endInterval);
            }
        }, 20);
    }
}
