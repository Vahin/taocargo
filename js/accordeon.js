export class Accordeon {
    constructor({ accordeonSelector, activeClassName = "active" }) {
        this.accordeon = document.querySelector(accordeonSelector);
        this.items = this.accordeon.querySelectorAll(".accordeon-item");
        this.changed = this.accordeon.querySelectorAll(".accordeon-changed");
        this.activeClassName = activeClassName;
        this.activeIndex = 0;

        this.addVisibility(this.activeIndex);

        this.items.forEach((item, index) => {
            item.addEventListener("click", (event) => {
                this.onClick(event, index);
            });
        });
    }

    onClick(event, index) {
        event.preventDefault();
        if (index < 0 || index >= this.items.length) return;

        this.removeVisibility(this.activeIndex);
        this.activeIndex = index;
        this.addVisibility(this.activeIndex);
    }

    removeVisibility(index) {
        this.changed[index].style.minHeight = "0";
        this.items[index].classList.remove(this.activeClassName);
    }

    addVisibility(index) {
        this.changed[index].style.minHeight = this.changed[index].scrollHeight + "px";
        this.items[index].classList.add(this.activeClassName);
    }
}
