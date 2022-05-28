export let formMixin = {
    onTelephoneInput(event, element) {
        if (!event.data) return;
        if (!element) return;

        let regex = /[^\d]/g;

        if (event.data.match(regex)) {
            element.value = element.value.replace(/[^\(\)\-\+\d]/gi, "");
            return;
        }

        let number = element.value.replace(/[\(\)\-\+]/gi, "");
        let result = "";

        if (number[0] == "7" || number[0] == "8") {
            result = result + "+7(";
        } else {
            number = "7" + number;
            result = result + "+7(";
        }

        for (let i = 1; i < number.length && i < 11; i++) {
            if (i == 4) result += ")";
            if (i == 7 || i == 9) result += "-";

            result += number[i];
        }

        element.value = result;
    },

    onLoadingFile({ element, preview, loading = () => {}, complete = () => {}, error = () => {} }) {
        let file = element.files[0];
        let reader = new FileReader();

        reader.onloadend = function () {
            let url = reader.result;
            complete(preview, url);
        };

        if (file) {
            reader.readAsDataURL(file);
            loading(preview);
        } else {
            error(preview);
        }
    },

    isValidList(list, { invalidCallback, validCallback }) {
        let inputArray = Array.from(list).filter((item) => {
            return item.dataset.type;
        });

        return inputArray.reduce((result, item) => {
            return this.isValid(item, item.dataset.type, { invalidCallback, validCallback }) && result;
        }, true);
    },

    isValid(item, type, { invalidCallback, validCallback }) {
        let doCallbacks = function (isValidResult) {
            if (!isValidResult && invalidCallback) {
                invalidCallback(item);
            }

            if (isValidResult && validCallback) {
                validCallback(item);
            }
        };

        if (type == "text") {
            let regex = /[a-zа-яё\d]+/gi;
            let result = item.value.match(regex);

            doCallbacks(result);

            return result;
        }

        if (type == "name") {
            let regex = /[а-яёa-z\s]+/gi;
            let result = item.value.match(regex);

            doCallbacks(result);

            return result;
        }

        if (type == "number") {
            let regex = /[\d]+\.?[\d]*/gi;
            let result = item.value.match(regex);
            if (item.value == 0) result = false;

            doCallbacks(result);

            return result;
        }

        /* if (type == "file") {
            doCallbacks(item.value);

            return item.value;
        } */

        if (type == "tel") {
            let regex = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/i;
            let result = item.value.match(regex);

            doCallbacks(result);

            return result;
        }

        if (type == "email") {
            let regex = /.+@.+\..+/i;
            let result = item.value.match(regex);

            doCallbacks(result);

            return result;
        }

        return true;
    },

    setStorage(item) {
        if (!item.dataset.storage) return;
        localStorage.setItem(item.dataset.storage, item.value);
    },

    getStorage(item) {
        if (!item.dataset.storage) return;
        return localStorage.getItem(item.dataset.storage);
    },

    addStorageEvent(list) {
        if (!list) return;

        if (!list.length) {
            list.addEventListener("change", () => {
                this.setStorage(list);
                list.dispatchEvent(new Event("storage", { bubbles: true }));
            });
            return;
        }

        list.forEach((item) => {
            if (item.dataset.storage) {
                item.addEventListener("change", () => {
                    this.setStorage(item);
                    item.dispatchEvent(new Event("storage", { bubbles: true }));
                });
            }
        });
    },

    onStorage(list) {
        list.forEach((item) => {
            if (item.dataset.storage) {
                item.value = this.getStorage(item);
            }
        });
    },
};
