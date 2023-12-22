const hobbies = ["Coding", "Gaming", "Reading", "Dance", "Swimming"];

(function (doc, hobbies) {
  const wrapper = doc.getElementsByClassName("draggable-list-wrapper")[0];
  const init = () => {
    render();
    bindEvents();
  };
  const render = () => {
    const list = createList();
    console.log(list);

    wrapper.append(list);
  };

  const bindEvents = () => {
    const draggableList = wrapper.getElementsByClassName("draggable-list")[0],
      draggableItems = draggableList.querySelectorAll(".draggable-item");

    draggableList.addEventListener("dragover", handleDragOver, false);

    draggableList.addEventListener(
      "dragenter",
      (e) => e.preventDefault(),
      false
    );
    window.addEventListener("dragover", (e) => e.preventDefault(), false);
    window.addEventListener("dragenter", (e) => e.preventDefault(), false);
    // draggable
    draggableItems.forEach((item) => {
      // 拖动动作的开始结束 其实都落在了触发事件的元素上 所以需要同时做：dragstart dragend 操作
      item.addEventListener("dragstart", handleDragStart, false);
      item.addEventListener("dragend", handleDragEnd, false);
    });
  };
  function handleDragOver(e) {
    e.preventDefault();

    const draggableList = this;

    const draggingItem = draggableList.querySelector(".dragging"),
      sibblingItems = draggableList.querySelectorAll(
        ".draggable-item:not(.dragging)"
      ),
      sibbling = [...sibblingItems].find(
        (item) => e.pageY <= item.offsetTop + item.offsetHeight / 2
      );

    draggableList.insertBefore(draggingItem, sibbling);
  }

  function handleDragStart(e) {
    const _this = this;
    setTimeout(() => {
      this.classList.add("dragging");
    }, 0);
  }
  function handleDragEnd(e) {
    const _this = this;
    setTimeout(() => {
      this.classList.remove("dragging");
    }, 0);
  }

  const createList = () => {
    const ul = doc.createElement("ul");
    ul.classList.add("draggable-list");

    hobbies.forEach((hobby) => {
      const li = doc.createElement("li");
      li.className = "draggable-item";
      li.draggable = true;
      li.innerHTML = `<span>${hobby}</span>`;

      ul.append(li);
    });

    return ul;
  };

  init();
})(document, hobbies);
