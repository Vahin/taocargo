import { SimpleSlider } from "./simpleslider.js";
import { formMixin } from "./formMixin.js";

Object.assign(SimpleSlider.prototype, formMixin);

export class FormSlider extends SimpleSlider {
    constructor({
        sliderSelector,
        activeClassName = "active",
        disableClassName = "disable",
        validClassName = "valid",
        invalidClassName = "invalid",
        transition = 600,
        slidesCount = 1,
        slidesMargin = 0,
        viewportHeight = true,
        needArrowControl = false,
        needPagination = false,
        needClickablePagination = false,
        needSwipeControl = false,
        formSelector,
    }) {
        super({
            sliderSelector,
            activeClassName,
            disableClassName,
            transition,
            slidesCount,
            slidesMargin,
            viewportHeight,
            needArrowControl,
            needPagination,
            needClickablePagination,
            needSwipeControl,
        });
        this.onLoadFile = this.onLoadFile.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onLoadFile = this.onLoadFile.bind(this);
        this.onCalculateButtonClick = this.onCalculateButtonClick.bind(this);
        this.onCrossClick = this.onCrossClick.bind(this);
        this.onCalculateButton = this.onCalculateButton.bind(this);
        this.onVolumeChange = this.onVolumeChange.bind(this);
        this.addStorageEvent = this.addStorageEvent.bind(this);
        this.onStorage = this.onStorage.bind(this);
        this.onKeydown = this.onKeydown.bind(this);

        this.storageList = this.slider.querySelectorAll("[data-storage]");
        this.form = document.querySelector(formSelector);

        this.validClassName = validClassName;
        this.invalidClassName = invalidClassName;
        this.inputSlides = Array.from(this.items).map((item) => {
            return item.querySelectorAll(".form__input");
        });
        this.addFormListeners();

        this.paginationItems.forEach((pagItem) => {
            pagItem.style.left = `0px`;
        });

        this.unloadButton = this.slider.querySelector(".form__assistant-button_red");
        this.unloadButton.addEventListener("click", (event) => event.preventDefault());
        this.calculateButton = this.slider.querySelector(".form__assistant-button_orange");
        this.calculateButton.addEventListener("click", this.onCalculateButtonClick);
        this.calculateTarget = this.slider.querySelector("[data-target=volume]");
        this.volumeModal = this.slider.querySelector(".modal");
        this.volumeCross = this.volumeModal.querySelector(".modal__cross");
        this.volumeButton = this.volumeModal.querySelector(".modal-button");

        this.volumeSlides = this.volumeModal.querySelectorAll("input");
        this.volumeSelect = this.volumeModal.querySelector("select");

        this.addStorageEvent(this.storageList);

        this.onStorage(this.storageList);
        window.addEventListener("storage", () => {
            this.onStorage(this.storageList);
        });

        this.form.addEventListener("keydown", this.onKeydown);
    }

    removeClasses(index) {
        this.items[index].classList.remove(this.activeClassName);
    }

    setValidationClasses(className, input) {
        input.classList.add(className);

        setTimeout(() => input.classList.remove(className), this.transition * 2);
    }

    onNextClick(event) {
        event.preventDefault();
        if (this.activeSlide >= this.items.length - 1) return;
        if (
            this.isValidList(this.inputSlides[this.activeSlide], {
                invalidCallback: this.setValidationClasses.bind(this, this.invalidClassName),
            })
        ) {
            super.onNextClick(event);
            if (this.activeSlide == this.items.length - 1) {
                setInterval(this.onSubmitForm(), this.transition);
            }
        }
    }

    onKeydown(event) {
        if (event.code == "Enter") {
            event.preventDefault();
            this.onNextClick(event);
        }
        let result;

        if (event.target == this.inputSlides[this.activeSlide][this.inputSlides[this.activeSlide].length - 1]) result = true;

        if (event.code == "Tab" && result) {
            event.preventDefault();
            this.onNextClick(event);
        }
    }

    onLoadFile(item, url) {
        item.style.background = `url(${url}) center center / cover no-repeat`;
        this.unloadButton.addEventListener("click", (event) => {
            this.onUnloadFile(event, item);
        });
    }

    onUnloadFile(event, item) {
        event.preventDefault();
        item.style.background = `none`;
        item.previousElementSibling.value = null;
    }

    addFormListeners() {
        this.inputSlides.map((nodeList) => {
            nodeList.forEach((item) => {
                if (item.dataset.type && item.dataset.type == "tel") {
                    item.addEventListener("input", (event) => {
                        this.onTelephoneInput(event, item);
                    });
                }

                if (item.dataset.type && item.dataset.type == "file") {
                    item.addEventListener("input", (event) => {
                        this.onLoadingFile({
                            element: item,
                            preview: item.nextElementSibling,
                            complete: this.onLoadFile,
                        });
                    });
                }
            });
        });
    }

    onSubmitForm() {
        this.submitAnimation();
    }

    async submitAnimation() {
        let item = this.items[this.items.length - 1];
        let pagListX = this.slider.querySelector(".slider-pagination").getBoundingClientRect().left;
        this.viewport.style.boxShadow = "5px 15px 40px 0 rgba(5, 11, 49, 0.32)";

        await new Promise((resolve) => {
            this.paginationItems.forEach((pagItem) => {
                pagItem.style.transition = `all ${this.transition}ms`;
                let deltaX = pagListX - pagItem.getBoundingClientRect().left;
                pagItem.style.left = `${deltaX}px`;
            });

            setInterval(resolve, this.transition);
        });

        await new Promise((resolve) => {
            this.viewport.transition = `all ${this.transition / 3}ms`;
            this.viewport.style.boxShadow = "10px 20px 60px 35px rgba(5, 11, 49, 0.42)";

            this.paginationItems.forEach((pagItem) => {
                pagItem.style.transition = `all ${this.transition / 3}ms`;
                pagItem.style.transform = `scale(1.5)`;
            });

            setInterval(resolve, this.transition / 3);
        });

        await new Promise((resolve) => {
            item.style.transition = `all ${this.transition / 10}ms`;
            this.viewport.transition = `all ${this.transition / 10}ms`;

            item.style.background = "none";
            this.viewport.style.boxShadow = "none";

            this.paginationItems.forEach((pagItem) => {
                pagItem.style.transition = `all ${this.transition / 10}ms`;
                pagItem.style.transform = `scale(0)`;
            });

            setInterval(resolve, this.transition / 10);
        });
    }

    onCalculateButtonClick(event) {
        event.preventDefault();

        this.volumeModal.classList.add(this.activeClassName);
        document.querySelector("body").classList.add("lock");

        this.volumeCross.addEventListener("click", this.onCrossClick);
        this.volumeModal.addEventListener("click", this.onCrossClick);
        this.volumeButton.addEventListener("click", this.onCalculateButton);
        this.volumeSelect.addEventListener("change", this.onVolumeChange);
    }

    onCrossClick(event) {
        event.preventDefault();

        if (!(event.target == this.volumeModal) && !(event.target == this.volumeCross)) return;

        this.closeModal();
    }

    closeModal() {
        this.volumeModal.classList.remove(this.activeClassName);
        document.querySelector("body").classList.remove("lock");
    }

    onCalculateButton() {
        if (
            this.isValidList(this.volumeSlides, {
                invalidCallback: this.setValidationClasses.bind(this, this.invalidClassName),
            })
        ) {
            this.calculateTarget.value = this.calculateVolume();
            this.setStorage(this.calculateTarget);
            this.closeModal();
        }
    }

    onVolumeChange() {
        if (this.volumeSelect.value == "meters") {
            for (let i = 0; i < this.volumeSlides.length; i++) {
                this.volumeSlides[i].value = this.volumeSlides[i].value / 100;
                this.volumeSlides[i].setAttribute("step", "0.1");
            }
        }

        if (this.volumeSelect.value == "santimeters") {
            for (let i = 0; i < this.volumeSlides.length; i++) {
                this.volumeSlides[i].value = this.volumeSlides[i].value * 100;
                this.volumeSlides[i].setAttribute("step", "10");
            }
        }
    }
    calculateVolume() {
        let result = 1;
        if (this.volumeSelect.value == "meters") {
            for (let i = 0; i < this.volumeSlides.length; i++) {
                result *= this.volumeSlides[i].value;
            }
        }

        if (this.volumeSelect.value == "santimeters") {
            for (let i = 0; i < this.volumeSlides.length; i++) {
                result *= this.volumeSlides[i].value / 100;
            }
        }

        return result ? result : 0;
    }
}
