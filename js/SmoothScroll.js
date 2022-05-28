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

    smoothScrollTo({
        element,
        speed = 1,
        timing = (time) => {
            return time < 0.5 ? 4 * Math.pow(time, 3) : 1 - Math.pow(-2 * time + 2, 3) / 2;
        },
        onEnd = () => {},
    }) {
        if (!element) return;
        let offsetTop = document.querySelector("header").offsetHeight;

        let startPosition = window.pageYOffset;
        let finishPosition = element.getBoundingClientRect().top;
        if (finishPosition < 0 && window.clientWidth < this.breakpoint) finishPosition -= offsetTop;

        if (startPosition + finishPosition < 0) {
            finishPosition = -startPosition;
        }

        let pathLength = Math.abs(finishPosition);
        let duration = pathLength / speed;

        let start = null;

        function step(time) {
            if (start === null) start = time;
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            let progress = timing(timeFraction);
            let yOffset =
                finishPosition < 0
                    ? Math.max(startPosition - progress * pathLength, startPosition + finishPosition)
                    : Math.min(startPosition + progress * pathLength, startPosition + finishPosition);

            window.scrollTo(0, yOffset);

            if (timeFraction < 1) {
                requestAnimationFrame(step);
            } else {
                onEnd();
            }
        }

        requestAnimationFrame(step);
    }
}
