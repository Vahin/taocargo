import { formMixin } from "./formMixin.js";

class Modal {
    constructor({ modalSelector, transition = 600, activeClass = "active", buttonsDataValue = "[data-modal=bid]" }) {
        this.modal = document.querySelector(modalSelector);
        this.cross = this.modal.querySelector(".modal__cross");
        this.openButtons = document.querySelectorAll(buttonsDataValue);
        this.completeButton = this.modal.querySelector(".modal-complete");

        this.transition = transition;
        this.activeClass = activeClass;

        this.onOpen = this.onOpen.bind(this);
        this.onCross = this.onCross.bind(this);

        this.openButtons.forEach((item) => {
            item.addEventListener("click", this.onOpen);
        });

        this.cross.addEventListener("click", this.onCross);
        this.modal.addEventListener("click", this.onCross);
    }

    onOpen(event) {
        event.preventDefault();

        this.showModal(this.modal);
    }

    onCross(event) {
        event.preventDefault();

        if (!(event.target == this.modal) && !(event.target == this.cross)) return;

        this.hideModal(this.modal);
    }

    showModal(item) {
        item.classList.add(this.activeClass);
        document.querySelector("body").classList.add("lock");
        document.querySelector(".header").style.top = -document.querySelector(".header").offsetHeight + "px";
    }

    hideModal(item) {
        item.classList.remove(this.activeClass);
        document.querySelector("body").classList.remove("lock");
        document.querySelector(".header").style.top = 0 + "px";
    }
}

Object.assign(Modal.prototype, formMixin);

export class FormModal extends Modal {
    constructor({ modalSelector }) {
        super({ modalSelector });
        this.completePage = document.querySelector(".bid__complete");
        this.inputsList = this.modal.querySelectorAll("[data-type]");
        this.storageList = this.modal.querySelectorAll("[data-storage]");

        this.onComplete = this.onComplete.bind(this);
        this.onCompletePage = this.onCompletePage.bind(this);
        this.setValidationClasses = this.setValidationClasses.bind(this, "invalid");
        this.onTelephoneInput = this.onTelephoneInput.bind(this);
        this.addStorageEvent = this.addStorageEvent.bind(this);
        this.onStorage = this.onStorage.bind(this);

        this.completeButton.addEventListener("click", this.onComplete);
        this.modal.querySelectorAll("[data-type=tel]").forEach((item) => {
            item.addEventListener("input", (event) => {
                this.onTelephoneInput(event, item);
            });
        });

        this.addStorageEvent(this.storageList);

        this.onStorage(this.storageList);
        window.addEventListener("storage", () => {
            this.onStorage(this.storageList);
        });
    }

    onComplete(event) {
        event.preventDefault();

        if (
            !this.isValidList(this.inputsList, {
                invalidCallback: this.setValidationClasses,
            })
        )
            return;

        this.hideModal(this.modal);
        this.showModal(this.completePage);
        setTimeout(() => {
            this.isCompletePage = true;
        }, this.transition);
        document.addEventListener("click", this.onCompletePage);
    }

    onCompletePage(event) {
        event.preventDefault();

        if (!this.isCompletePage) return;

        this.hideModal(this.completePage);
        document.removeEventListener("click", this.onCompletePage);
        this.isCompletePage = false;
    }

    setValidationClasses(className, input) {
        input.classList.add(className);

        setTimeout(() => input.classList.remove(className), this.transition * 2);
    }
}
