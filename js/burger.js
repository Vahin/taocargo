export class Burger {
    constructor({ burger, menu, activeClassName = "active", bodyLockClass = "lock-burger", hideResize = 950 }) {
        this.burger = burger;
        this.menu = menu;
        this.burgerClass = burger.classList[0];
        this.menuClass = menu.classList[0];
        this.body = document.querySelector("body");
        this.activeClassName = activeClassName;
        this.bodyLockClass = bodyLockClass;
        this.hideResize = hideResize;

        this.onButtonClick = this.onButtonClick.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onResize = this.onResize.bind(this);

        this.burger.addEventListener("click", this.onButtonClick);
    }

    onButtonClick(event) {
        event.preventDefault();

        if (!this.burger.classList.contains(this.activeClassName)) {
            this.showMenu();
            return;
        }

        this.hideMenu();
    }

    onDocumentClick(event) {
        event.preventDefault();

        if (event.target.classList.contains(this.menuClass)) return;
        if (event.target.closest(this.menuClass)) return;
        if (event.target.classList.contains(this.burgerClass)) return;
        if (event.target.closest(`.${this.burgerClass}`)) return;

        this.hideMenu();
    }

    onResize(event) {
        if (document.documentElement.clientWidth >= this.hideResize) {
            this.hideMenu();
        }
    }

    hideMenu() {
        this.burger.classList.remove(this.activeClassName);
        this.menu.classList.remove(this.activeClassName);
        this.body.classList.remove(this.bodyLockClass);
        this.menu.style.maxHeight = 0;

        document.removeEventListener("click", this.onDocumentClick);
        window.removeEventListener("resize", this.onResize);
    }

    showMenu() {
        this.burger.classList.add(this.activeClassName);
        this.menu.classList.add(this.activeClassName);
        this.body.classList.add(this.bodyLockClass);
        this.menu.style.maxHeight = this.menu.scrollHeight + 10 + "px";

        document.addEventListener("click", this.onDocumentClick);
        window.addEventListener("resize", this.onResize);
    }
}

// TODO - Сменить название переменных, по необходимости.
