import { formMixin } from "./formMixin.js";

class Temp {
    constructor() {}
}

Object.assign(Temp.prototype, formMixin);

export class QuestionsForm extends Temp {
    constructor({ formSelector, invalidClassName = "invalid", transition = 600 }) {
        super();

        this.form = document.querySelector(formSelector);
        this.list = this.form.querySelectorAll("[data-type]");
        this.submit = this.form.querySelector(".form-submit");
        this.onClick = this.onClick.bind(this);
        this.invalidClassName = invalidClassName;
        this.transition = transition;

        this.list.forEach((item) => {
            if (item.dataset.type == "tel") {
                item.addEventListener("input", (event) => {
                    this.onTelephoneInput(event, item);
                });
            }
        });

        this.addStorageEvent(this.list);

        this.onStorage(this.list);
        window.addEventListener("storage", () => {
            this.onStorage(this.list);
        });

        this.submit.addEventListener("click", this.onClick);
    }

    onClick(event) {
        event.preventDefault();

        if (
            !this.isValidList(this.list, {
                invalidCallback: this.setValidationClasses.bind(this, this.invalidClassName),
            })
        )
            return;
    }

    setValidationClasses(className, input) {
        input.classList.add(className);

        setTimeout(() => input.classList.remove(className), this.transition * 2);
    }
}
