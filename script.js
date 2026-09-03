const card = document.getElementById("card");

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xzebgqnp";

async function sendDateResponse(date, time, type, place) {
    const formData = new URLSearchParams();

    formData.append("name", "Ульяна");
    formData.append("date", formatDate(date));
    formData.append("time", time);
    formData.append("activity", type);
    formData.append("place", place || "Не указано");
    formData.append("consent", "Согласна ❤️");
    formData.append("subject", "❤️ Ульяна согласилась на свидание");

    formData.append(
        "message",
        `Ульяна согласилась на свидание!

Дата: ${formatDate(date)}
Время: ${time}
Что будем делать: ${type}
Место встречи: ${place || "Не указано"}`
    );

    const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
    });

    if (!response.ok) {
        throw new Error("Не удалось отправить данные в Formspree");
    }
}


// =========================
// МУЗЫКА
// =========================

const music = new Audio("music.mp3");
music.loop = true;
music.volume = 0.5;

let musicStarted = false;

function startMusic() {
    if (musicStarted) {
        return;
    }

    music.play()
        .then(() => {
            musicStarted = true;
        })
        .catch(() => {});
}

startMusic();

document.addEventListener(
    "click",
    startMusic,
    { once: true }
);

document.addEventListener(
    "touchstart",
    startMusic,
    { once: true }
);


// =========================
// КНОПКА "ДА"
// =========================

document
    .getElementById("yesButton")
    .addEventListener("click", () => {

        startMusic();
        createHearts();
        showDatePlanner();

    });


// =========================
// КНОПКА "НЕТ"
// =========================

const noButton =
    document.getElementById("noButton");

const MOVE_AREA_WIDTH = 1500;
const MOVE_AREA_HEIGHT = 900;

let noButtonIsFlying = false;


function getMovementArea() {

    const width =
        Math.min(
            MOVE_AREA_WIDTH,
            window.innerWidth
        );

    const height =
        Math.min(
            MOVE_AREA_HEIGHT,
            window.innerHeight
        );

    const left =
        Math.max(
            0,
            (window.innerWidth - width) / 2
        );

    const top =
        Math.max(
            0,
            (window.innerHeight - height) / 2
        );

    return {
        left,
        top,
        width,
        height
    };
}


noButton.addEventListener(
    "mouseover",
    moveNoButton
);

noButton.addEventListener(
    "touchstart",
    moveNoButton,
    { passive: false }
);


function moveNoButton(event) {

    if (event) {
        event.preventDefault();
    }

    const button =
        document.getElementById("noButton");

    if (!button) {
        return;
    }

    if (!noButtonIsFlying) {

        document.body.appendChild(button);

        noButtonIsFlying = true;

        button.style.setProperty(
            "position",
            "fixed",
            "important"
        );

        button.style.setProperty(
            "z-index",
            "100000",
            "important"
        );

        button.style.setProperty(
            "margin",
            "0",
            "important"
        );

        button.style.setProperty(
            "transform",
            "none",
            "important"
        );

        button.style.setProperty(
            "transition",
            "left 0.18s ease, top 0.18s ease",
            "important"
        );
    }

    const area =
        getMovementArea();

    const rect =
        button.getBoundingClientRect();

    const buttonWidth =
        rect.width;

    const buttonHeight =
        rect.height;

    const maxX =
        Math.max(
            0,
            area.width - buttonWidth
        );

    const maxY =
        Math.max(
            0,
            area.height - buttonHeight
        );

    const randomX =
        area.left +
        Math.random() * maxX;

    const randomY =
        area.top +
        Math.random() * maxY;

    const safeX =
        Math.max(
            area.left,
            Math.min(
                randomX,
                area.left + maxX
            )
        );

    const safeY =
        Math.max(
            area.top,
            Math.min(
                randomY,
                area.top + maxY
            )
        );

    button.style.left =
        `${Math.round(safeX)}px`;

    button.style.top =
        `${Math.round(safeY)}px`;

    createClickHeart(button);
}


// =========================
// УДАЛЕНИЕ КНОПКИ "НЕТ"
// =========================

function removeNoButton() {

    const button =
        document.getElementById("noButton");

    if (button && button.parentElement) {
        button.remove();
    }

    noButtonIsFlying = false;
}


// =========================
// АДАПТАЦИЯ КНОПКИ ПРИ RESIZE
// =========================

window.addEventListener(
    "resize",
    () => {

        if (!noButtonIsFlying) {
            return;
        }

        const button =
            document.getElementById("noButton");

        if (!button) {
            return;
        }

        const area =
            getMovementArea();

        const rect =
            button.getBoundingClientRect();

        const buttonWidth =
            rect.width;

        const buttonHeight =
            rect.height;

        const maxX =
            area.left +
            Math.max(
                0,
                area.width - buttonWidth
            );

        const maxY =
            area.top +
            Math.max(
                0,
                area.height - buttonHeight
            );

        let currentX =
            parseFloat(button.style.left);

        let currentY =
            parseFloat(button.style.top);

        if (Number.isNaN(currentX)) {
            currentX = area.left;
        }

        if (Number.isNaN(currentY)) {
            currentY = area.top;
        }

        const safeX =
            Math.max(
                area.left,
                Math.min(
                    currentX,
                    maxX
                )
            );

        const safeY =
            Math.max(
                area.top,
                Math.min(
                    currentY,
                    maxY
                )
            );

        button.style.left =
            `${Math.round(safeX)}px`;

        button.style.top =
            `${Math.round(safeY)}px`;
    }
);


// =========================
// ВЫБОР СВИДАНИЯ
// =========================

function showDatePlanner() {

    removeNoButton();

    card.innerHTML = `

        <div class="heart">💖</div>

        <h1>Тогда давай всё организуем</h1>

        <p class="subtitle">
            Выбирай что те нравится, ток сандали не перепутай️
        </p>

        <div class="form">

            <label>
                📅 Дата
                <input
                    type="date"
                    id="dateInput"
                >
            </label>

            <label>
                🕐 Время
                <input
                    type="time"
                    id="timeInput"
                >
            </label>

            <div class="label-title">
                💕 Что будем делать?
            </div>

            <div class="date-types">

                <button
                    class="date-type"
                    data-type="🎬 Кино"
                >
                    🎬
                    <span>Кино</span>
                </button>

                <button
                    class="date-type"
                    data-type="🍝 Ресторан"
                >
                    🍝
                    <span>Ресторан</span>
                </button>

                <button
                    class="date-type"
                    data-type="🎭 Театр"
                >
                    🎭
                    <span>Театр</span>
                </button>

                <button
                    class="date-type"
                    data-type="🌆 Прогулка"
                >
                    🌆
                    <span>Прогулка</span>
                </button>

                <button
                    class="date-type"
                    data-type="✨ Сюрприз"
                >
                    ✨
                    <span>Сюрприз</span>
                </button>

            </div>

            <label>
                📍 Место встречи

                <input
                    type="text"
                    id="placeInput"
                    placeholder="Например: у метро..."
                >
            </label>

            <button
                id="confirmButton"
                class="confirm-button"
            >
                Перейти к договору ❤️
            </button>

        </div>
    `;


    // =========================
    // ОГРАНИЧЕНИЕ ДАТЫ
    // =========================

    const dateInput =
        document.getElementById("dateInput");

    const timeInput =
        document.getElementById("timeInput");

    const today =
        new Date();


    const dayOfWeek =
        today.getDay();


    let daysUntilSaturday =
        (6 - dayOfWeek + 7) % 7;


    const saturday =
        new Date(today);

    saturday.setDate(
        today.getDate() +
        daysUntilSaturday
    );


    const saturdayYear =
        saturday.getFullYear();

    const saturdayMonth =
        String(
            saturday.getMonth() + 1
        ).padStart(2, "0");

    const saturdayDay =
        String(
            saturday.getDate()
        ).padStart(2, "0");


    const saturdayString =
        `${saturdayYear}-${saturdayMonth}-${saturdayDay}`;


    dateInput.min =
        saturdayString;


    function updateTimeRestriction() {

        if (
            dateInput.value ===
            saturdayString
        ) {

            timeInput.min = "14:00";

            if (
                timeInput.value &&
                timeInput.value < "14:00"
            ) {

                timeInput.value = "";
            }

        } else {

            timeInput.removeAttribute("min");
        }
    }


    dateInput.addEventListener(
        "change",
        updateTimeRestriction
    );


    // =========================
    // ВЫБОР ТИПА
    // =========================

    const dateButtons =
        document.querySelectorAll(
            ".date-type"
        );

    let selectedType = "";


    dateButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    dateButtons.forEach(
                        btn => {

                            btn.classList.remove(
                                "selected"
                            );

                        }
                    );


                    button.classList.add(
                        "selected"
                    );


                    selectedType =
                        button.dataset.type;


                    createClickHeart(
                        button
                    );
                }
            );
        }
    );


    // =========================
    // ПЕРЕХОД К ДОГОВОРУ
    // =========================

    document
        .getElementById("confirmButton")
        .addEventListener(
            "click",
            () => {

                const date =
                    dateInput.value;

                const time =
                    timeInput.value;

                const place =
                    document
                        .getElementById(
                            "placeInput"
                        )
                        .value;


                if (!date) {

                    alert(
                        "Сначала выбери дату ❤️"
                    );

                    return;
                }


                if (!time) {

                    alert(
                        "И время тоже нужно выбрать 😌"
                    );

                    return;
                }


                if (
                    date === saturdayString &&
                    time < "14:00"
                ) {

                    alert(
                        "В субботу свидание можно назначить только после 14:00 ❤️"
                    );

                    return;
                }


                if (!selectedType) {

                    alert(
                        "Выбери, что будем делать ❤️"
                    );

                    return;
                }


                showContract(
                    date,
                    time,
                    selectedType,
                    place
                );
            }
        );
}


// =========================
// ДОГОВОР
// =========================

function showContract(
    date,
    time,
    type,
    place
) {

    const formattedDate =
        formatDate(date);


    card.innerHTML = `

        <div class="heart">📜</div>

        <h1>Официальный договор</h1>

        <p class="subtitle">
            Договор о проведении совместного свидания
        </p>

        <div class="contract">

            <p>
                <strong>Ульяна</strong>
                обязуется прийти на свидание.
            </p>

            <p>
                <strong>Я</strong>
                обязуюсь организовать хороший вечер.
            </p>

            <p>
                <strong>Оба</strong>
                обязуются хорошо провести время.
            </p>

        </div>

        <div class="date-summary">

            <div>
                📅 ${formattedDate}
            </div>

            <div>
                🕐 ${time}
            </div>

            <div>
                ${type}
            </div>

            ${
                place
                    ? `<div>📍 ${place}</div>`
                    : ""
            }

        </div>

        <button
            id="agreeButton"
            class="confirm-button"
        >
            ☑️ Согласна ❤️
        </button>

    `;


    document
        .getElementById("agreeButton")
        .addEventListener(
            "click",
            async () => {

                const agreeButton =
                    document.getElementById(
                        "agreeButton"
                    );

                agreeButton.disabled = true;

                agreeButton.textContent =
                    "Отправляю ответ... ❤️";


                try {

                    await sendDateResponse(
                        date,
                        time,
                        type,
                        place
                    );


                    createHearts();
                    createConfetti();


                    setTimeout(
                        () => {

                            showConfirmation(
                                date,
                                time,
                                type,
                                place
                            );

                        },
                        700
                    );

                } catch (error) {

                    console.error(
                        "Ошибка отправки Formspree:",
                        error
                    );


                    agreeButton.disabled = false;

                    agreeButton.textContent =
                        "☑️ Согласна ❤️";


                    alert(
                        "Не получилось отправить ответ 😔 Проверь интернет и попробуй ещё раз."
                    );
                }
            }
        );
}


// =========================
// ФИНАЛЬНЫЙ ЭКРАН
// =========================

function showConfirmation(
    date,
    time,
    type,
    place
) {

    const formattedDate =
        formatDate(date);


    card.innerHTML = `

        <div class="heart">💖</div>

        <h1>Свидание назначено!!</h1>

        <div class="date-summary">

            <div>
                📅
                <strong>
                    ${formattedDate}
                </strong>
            </div>

            <div>
                🕐
                <strong>
                    ${time}
                </strong>
            </div>

            <div>
                ${type}
            </div>

            ${
                place
                    ? `
                        <div>
                            📍
                            <strong>
                                ${place}
                            </strong>
                        </div>
                    `
                    : ""
            }

        </div>

        <div class="countdown-title">
            До свидания осталось:
        </div>

        <div class="countdown-box">

            <div class="time-unit">
                <span id="days">00</span>
                <small>дней</small>
            </div>

            <div class="time-unit">
                <span id="hours">00</span>
                <small>часов</small>
            </div>

            <div class="time-unit">
                <span id="minutes">00</span>
                <small>минут</small>
            </div>

            <div class="time-unit">
                <span id="seconds">00</span>
                <small>секунд</small>
            </div>

        </div>

        <p class="subtitle final-text">
            Я буду ждать тебя️
        </p>

    `;


    startCountdown(
        date,
        time
    );
}


// =========================
// COUNTDOWN
// =========================

function startCountdown(
    date,
    time
) {

    const target =
        new Date(
            `${date}T${time}:00`
        );


    function updateCountdown() {

        const now =
            new Date();

        const difference =
            target - now;


        if (difference <= 0) {

            document
                .getElementById("days")
                .textContent = "00";

            document
                .getElementById("hours")
                .textContent = "00";

            document
                .getElementById("minutes")
                .textContent = "00";

            document
                .getElementById("seconds")
                .textContent = "00";


            document
                .querySelector(
                    ".countdown-title"
                )
                .textContent =
                "❤️ Сегодня наше свидание! ❤️";

            return;
        }


        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        const hours =
            Math.floor(
                (difference /
                    (1000 * 60 * 60)) %
                24
            );


        const minutes =
            Math.floor(
                (difference /
                    (1000 * 60)) %
                60
            );


        const seconds =
            Math.floor(
                (difference / 1000) %
                60
            );


        document
            .getElementById("days")
            .textContent =
            String(days)
                .padStart(2, "0");


        document
            .getElementById("hours")
            .textContent =
            String(hours)
                .padStart(2, "0");


        document
            .getElementById("minutes")
            .textContent =
            String(minutes)
                .padStart(2, "0");


        document
            .getElementById("seconds")
            .textContent =
            String(seconds)
                .padStart(2, "0");
    }


    updateCountdown();

    setInterval(
        updateCountdown,
        1000
    );
}


// =========================
// ПЛАВАЮЩИЕ СЕРДЕЧКИ
// =========================

function createHearts() {

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        setTimeout(
            () => {

                const heart =
                    document.createElement(
                        "div"
                    );


                heart.className =
                    "floating-heart";


                heart.textContent = [
                    "❤️",
                    "💖",
                    "💕",
                    "💗",
                    "💓"
                ][
                    Math.floor(
                        Math.random() * 5
                    )
                ];


                heart.style.left =
                    Math.random() * 100 +
                    "vw";


                heart.style.animationDuration =
                    (
                        2 +
                        Math.random() * 2
                    ) + "s";


                document.body.appendChild(
                    heart
                );


                setTimeout(
                    () => {
                        heart.remove();
                    },
                    4000
                );

            },
            i * 100
        );
    }
}


// =========================
// СЕРДЕЧКО ПРИ КЛИКЕ
// =========================

function createClickHeart(element) {

    const heart =
        document.createElement(
            "span"
        );


    heart.className =
        "click-heart";


    heart.textContent =
        "❤️";


    const rect =
        element.getBoundingClientRect();


    heart.style.left =
        `${rect.left + rect.width / 2}px`;


    heart.style.top =
        `${rect.top}px`;


    document.body.appendChild(
        heart
    );


    setTimeout(
        () => {
            heart.remove();
        },
        1000
    );
}


// =========================
// КОНФЕТТИ
// =========================

function createConfetti() {

    const symbols = [
        "❤️",
        "💕",
        "💖",
        "✨",
        "💗",
        "🎉"
    ];


    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const confetti =
            document.createElement(
                "div"
            );


        confetti.className =
            "confetti";


        confetti.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        confetti.style.left =
            Math.random() * 100 +
            "vw";


        confetti.style.animationDuration =
            (
                2 +
                Math.random() * 3
            ) + "s";


        confetti.style.animationDelay =
            Math.random() * 0.5 +
            "s";


        document.body.appendChild(
            confetti
        );


        setTimeout(
            () => {
                confetti.remove();
            },
            5500
        );
    }
}


// =========================
// ФОРМАТ ДАТЫ
// =========================

function formatDate(
    dateString
) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "ru-RU",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}
