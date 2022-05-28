export class SimpleSlider {
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
    }) {
        this.slider = document.querySelector(sliderSelector);
        this.viewport = this.slider.querySelector(".slider-viewport");
        this.items = this.slider.querySelectorAll(".slider-item");

        this.activeClassName = activeClassName;
        this.disableClassName = disableClassName;
        this.transition = transition;
        this.activeSlide = 0;
        this.slidesCount = slidesCount;
        this.slidesMargin = slidesMargin;
        this.viewportHeight = viewportHeight;
        this.needArrowControl = needArrowControl;
        this.needPagination = needPagination;
        this.needClickablePagination = needClickablePagination;
        this.needSwipeControl = needSwipeControl;
        this.slidesInterval = slidesInterval;

        this.onPrevClick = this.onPrevClick.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
        this.onPaginationClick = this.onPaginationClick.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onResize = this.onResize.bind(this);
        this.moveSliderTo = this.moveSliderTo.bind(this);

        this.createTrack();
        this.addListeners();
        this.windowInit();

        this.setSliderInterval();
    }

    createTrack() {
        this.track = document.createElement("div");

        this.track.style.position = "relative";
        this.track.style.transition = `all ${this.transition}ms`;

        this.items.forEach((item) => {
            this.track.append(item);
            item.style.position = "absolute";
            item.style.top = "0";
            item.style.left = "0";
        });

        this.viewport.innerHTML = "";

        this.viewport.append(this.track);
    }

    windowInit() {
        this.itemWidth = (this.viewport.offsetWidth - this.slidesMargin * (this.slidesCount - 1)) / this.slidesCount;
        let heights = [];

        this.items.forEach((item, index) => {
            item.style.height = "";
            item.style.width = this.itemWidth + "px";
            item.style.left = (this.itemWidth + this.slidesMargin) * index + "px";

            heights.push(item.offsetHeight);

            if (index < this.activeSlide || index > this.activeSlide + this.slidesCount - 1) this.removeClasses(index);

            if (index == this.activeSlide) {
                this.addClasses(index);
            }
        });

        let height = Math.max(...heights);
        if (this.viewportHeight) height = this.viewport.offsetHeight;

        this.items.forEach((item, index) => {
            item.style.height = height + "px";
        });

        this.track.style.width = this.itemWidth * this.items.length + "px";
        this.track.style.height = height + "px";

        this.moveSlider(this.activeSlide);
    }

    addListeners() {
        if (this.needArrowControl) {
            this.arrowsPrev = this.slider.querySelectorAll(".slider-prev");
            this.arrowsNext = this.slider.querySelectorAll(".slider-next");

            this.arrowsPrev.forEach((prev) => {
                prev.addEventListener("click", this.onPrevClick);
            });

            this.arrowsNext.forEach((next) => {
                next.addEventListener("click", this.onNextClick);
            });
        }

        if (this.needPagination) {
            this.paginationItems = this.slider.querySelectorAll(".slider-pagination-item");

            if (this.needClickablePagination) {
                this.paginationItems.forEach((item, index) => {
                    item.addEventListener("click", (event) => {
                        this.onPaginationClick(event, index);
                    });
                });
            }
        }

        if (this.needSwipeControl) {
            this.slider.style.touchAction = "pan-y";
            this.slider.style.userSelect = "none";

            this.viewport.addEventListener("pointerdown", this.onPointerDown);
        }

        window.addEventListener("resize", this.onResize);
    }

    addClasses(index) {
        this.items[index].classList.add(this.activeClassName);
        if (this.paginationItems) {
            for (let i = 0; i < this.slidesCount; i++) {
                if (index + i >= this.paginationItems.length) return;
                this.paginationItems[index + i].classList.add(this.activeClassName);
            }
        }
    }

    removeClasses(index) {
        this.items[index].classList.remove(this.activeClassName);
        if (this.paginationItems) {
            for (let i = 0; i < this.slidesCount; i++) {
                if (!this.paginationItems[index + i]) return;
                this.paginationItems[index + i].classList.remove(this.activeClassName);
            }
        }
    }

    checkArrowStatus() {
        if (!this.needArrowControl) return;

        this.arrowsNext.forEach((item) => {
            item.classList.remove(this.disableClassName);

            if (this.activeSlide == this.items.length - this.slidesCount) {
                item.classList.add(this.disableClassName);
            }
        });

        this.arrowsPrev.forEach((item) => {
            item.classList.remove(this.disableClassName);

            if (this.activeSlide == 0) {
                item.classList.add(this.disableClassName);
            }
        });
    }

    moveSlider(index) {
        this.currentX = -(this.itemWidth + this.slidesMargin) * index;

        this.track.style.transform = `translateX(${this.currentX}px)`;
        this.checkArrowStatus();
    }

    moveSliderTo(index) {
        if (index < 0 || index > this.items.length - 1) return;

        if (index > this.items.length - this.slidesCount) {
            index = this.items.length - this.slidesCount;
        }

        this.removeClasses(this.activeSlide);
        this.activeSlide = index;
        this.moveSlider(this.activeSlide);
        this.addClasses(this.activeSlide);
        if (this.sliderInterval) clearInterval(this.sliderInterval);
        this.setSliderInterval();
    }

    moveSliderBy(x) {
        this.track.style.transform = `translateX(${this.currentX + x}px)`;
    }

    onPrevClick(event) {
        event.preventDefault();
        if (this.activeSlide <= 0) return;

        this.moveSliderTo(this.activeSlide - 1);
    }

    onNextClick(event) {
        event.preventDefault();
        if (this.activeSlide >= this.items.length - this.slidesCount) return;

        this.moveSliderTo(this.activeSlide + 1);
    }

    onPaginationClick(event, index) {
        event.preventDefault();
        if (index < 0 || index > this.items.length - 1) return;
        if (index > this.items.length - this.slidesCount) {
            index = this.items.length - this.slidesCount;
        }

        this.moveSliderTo(index);
    }

    onPointerDown(event) {
        this.startX = event.clientX;
        this.startTime = Date.now();
        this.track.style.transition = "all 0.1s";
        this.track.style.cursor = "grab";

        document.addEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    onPointerMove(event) {
        this.lastX = event.clientX;
        this.lastTime = Date.now();

        this.moveSliderBy(this.lastX - this.startX);
    }

    onPointerUp(event) {
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);

        this.track.style.cursor = "auto";
        this.track.style.transition = `all ${this.transition}ms`;

        let deltaX = this.lastX - this.startX;
        let deltaTime = this.lastTime - this.startTime;
        let speed = (deltaX / deltaTime) * this.slidesCount;
        if (!speed) speed = 0;
        let isPositiveSpeed;
        if (speed > 0) {
            speed = Math.floor(speed);
            isPositiveSpeed = true;
        }
        if (speed < 0) {
            speed = Math.ceil(speed);
            isPositiveSpeed = false;
        }
        if (speed == 0 && Math.abs(deltaX) > this.itemWidth / 2) {
            if (Math.abs(deltaX) < this.itemWidth) deltaX *= 2;
            speed = Math.floor(Math.abs(deltaX) / this.itemWidth);
            speed = isPositiveSpeed ? speed : -speed;
        }

        let newIndex = this.activeSlide - speed;
        if (newIndex >= this.items.length - this.slidesCount) {
            newIndex = this.items.length - this.slidesCount;
        }
        if (newIndex <= 0) {
            newIndex = 0;
        }

        this.moveSliderTo(newIndex);
    }

    onResize() {
        this.windowInit();
    }

    setSliderInterval() {
        if (this.slidesInterval) {
            this.sliderInterval = setInterval(() => {
                this.onNextClick(new Event("click"));
            }, this.slidesInterval);
        }
    }
}

//TODO 1. Продумать прокрутку слайдов, отрегулировать скорость. При нескольких слайдах
//TODO    становиться слишком чувствительным.
