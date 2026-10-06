(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const entrance = $("entrance"), gallery = $("gallery"), finale = $("finale"), goodbye = $("goodbye");
  const halls = [$("hall-1"), $("hall-2"), $("hall-3"), $("hall-4")];
  const hallNames = ["ЗАЛ I · ПРОИСХОЖДЕНИЕ", "ЗАЛ II · НАУЧНЫЙ ОТДЕЛ", "ЗАЛ III · АРТЕФАКТЫ", "ЗАЛ IV · АРХИВ"];
  const exhibits = {
    origin: { number: "ЭКСПОНАТ №001 · ПРОИСХОЖДЕНИЕ", title: "Ксюша", text: "Редкий представитель вида Homo ksushensis. Отличается независимым мнением, внезапной нежностью и способностью заметить, что исследователь опять усложнил простую задачу." },
    coffee: { number: "АРТЕФАКТ №014 · БЫТОВОЙ", title: "Кофе", text: "Вещество, после которого планы звучат выполнимо, а Алексей получает временную надежду на то, что сегодня ляжет вовремя." },
    music: { number: "АРТЕФАКТ №021 · ЗВУКОВОЙ", title: "Музыка", text: "Персональный портал. Вход осуществляется через наушники; выход — когда закончится ещё одна песня." },
    book: { number: "АРТЕФАКТ №033 · ПЕЧАТНЫЙ", title: "Книга", text: "Устройство для путешествий без сборов и билетов. Иногда владелица пропадает внутри на несколько часов. Поиск не требуется." },
    heart: { number: "АРТЕФАКТ №047 · НЕОЦЕНИМЫЙ", title: "Сердце", text: "Экспонат поступил без бирки и оценочной шкалы. Куратор отказался назначать ему цену и теперь выглядит подозрительно счастливым." }
  };
  let room = 0, returnFocus = null, finaleTimers = [];

  function transition(view) { [entrance, gallery, finale, goodbye].forEach((item) => item.classList.toggle("hidden", item !== view)); }
  function showRoom(index) {
    room = Math.max(0, Math.min(halls.length - 1, index));
    halls.forEach((hall, i) => { hall.classList.toggle("hidden", i !== room); hall.classList.toggle("visible-room", i === room); });
    $("hall-name").textContent = hallNames[room];
    $("room-index").textContent = String(room + 1).padStart(2, "0");
    $("footer-page").textContent = String(room + 1).padStart(2, "0");
    $("previous-room").disabled = room === 0;
    $("next-room").innerHTML = room === 3 ? '<span>ЗАВЕРШИТЬ ЭКСКУРСИЮ</span> →' : '<span>СЛЕДУЮЩИЙ ЗАЛ</span> →';
    [...$("nav-progress").children].forEach((dot, i) => dot.classList.toggle("active", i === room));
  }
  function openExhibit(key, button) {
    const item = exhibits[key];
    if (!item) return;
    returnFocus = button;
    $("detail-number").textContent = item.number;
    $("detail-title").textContent = item.title;
    $("detail-text").textContent = item.text;
    $("exhibit-detail").classList.remove("hidden");
    $("detail-close").focus();
  }
  function closeExhibit() { $("exhibit-detail").classList.add("hidden"); returnFocus?.focus(); }
  function openSecret() { $("secret-reveal").classList.remove("hidden"); $("secret-close").focus(); }
  function closeSecret() { $("secret-reveal").classList.add("hidden"); $("secret-button").focus(); }
  function beginFinale() {
    finaleTimers.forEach(clearTimeout); finaleTimers = [];
    transition(finale);
    ["final-line-1", "final-line-2", "final-line-3", "final-line-4"].forEach((id) => $(id).classList.remove("shown"));
    $("exit-button").classList.add("hidden");
    [["final-line-1", 1300], ["final-line-2", 2900], ["final-line-3", 4700], ["final-line-4", 6100]].forEach(([id, delay]) => finaleTimers.push(setTimeout(() => $(id).classList.add("shown"), delay)));
    finaleTimers.push(setTimeout(() => $("exit-button").classList.remove("hidden"), 7350));
  }

  $("enter-button").addEventListener("click", () => {
    entrance.classList.add("departing");
    setTimeout(() => { entrance.classList.remove("departing"); transition(gallery); showRoom(0); }, 500);
  });
  $("previous-room").addEventListener("click", () => showRoom(room - 1));
  $("next-room").addEventListener("click", () => { if (room < 3) showRoom(room + 1); else beginFinale(); });
  document.querySelectorAll(".exhibit-trigger").forEach((button) => button.addEventListener("click", () => openExhibit(button.dataset.exhibit, button)));
  $("detail-close").addEventListener("click", closeExhibit);
  $("secret-button").addEventListener("click", openSecret);
  $("secret-close").addEventListener("click", closeSecret);
  $("secret-reveal").addEventListener("click", (event) => { if (event.target === $("secret-reveal")) closeSecret(); });
  $("exit-button").addEventListener("click", () => { finaleTimers.forEach(clearTimeout); transition(goodbye); });
  $("return-button").addEventListener("click", () => transition(entrance));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!$("secret-reveal").classList.contains("hidden")) closeSecret();
      else if (!$("exhibit-detail").classList.contains("hidden")) closeExhibit();
    }
    if ($("gallery").classList.contains("hidden") || !$("exhibit-detail").classList.contains("hidden") || !$("secret-reveal").classList.contains("hidden")) return;
    if (event.key === "ArrowRight" && room < 3) showRoom(room + 1);
    if (event.key === "ArrowLeft" && room > 0) showRoom(room - 1);
  });
})();
