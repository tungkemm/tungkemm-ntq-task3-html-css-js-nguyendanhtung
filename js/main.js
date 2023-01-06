import { EMPLOYEES } from "./MOCK_DATA.js";

//////// get element
const $ = document.querySelector.bind(document);
const contentEl = $(".content");
const employeeListEl = $(".content-staff");
const logoPageEl = $(".header-logo");
const currentPageEl = $(".header-option-page-info span:nth-child(1)");
const totalPageEl = $(".header-option-page-info span:nth-child(2)");
const prevPageEl = $(".header-option-page-icon.prev");
const nextPageEl = $(".header-option-page-icon.next");
const inputSearchEl = $(".header-option-search input");
const btnDeleteSearchEl = $(".header-option-deleteicon");
const btnSearchEl = $(".header-option-searchicon");
const sortPageIdEl = $(".header-sort-item-id");
const sortPageAZEl = $(".header-sort-item1");
const sortPageZAEl = $(".header-sort-item2");
const recordSelectEl = $(".header-option-record-list");
const btnOpenModalAdd = $(".header-option-add");
const modalAddEl = $(".modal-block");
const modalFormEl = $(".modal-add-staff");
const closeModalAddEl = $(".modal-add-staff-close");
const inputNameAddEl = $(".modal-add-staff-input input");
const selectPositionAddEl = $(".modal-add-staff-select select");
const inputEmailAddEl = $(".modal-add-staff-email input");
const btnAddEl = $(".modal-add-staff-submit button");
const notiSortEl = $(".sideBar-info-sort");
const notiSortDetailEl = $(".sideBar-info-sort span");

const contentEmpty = document.createElement("div");

///////// khai bao phan trang
const listEmployee = EMPLOYEES;
let perPage = 40; // so employee trong 1 page
let currentPage = 1; // page hien tai
let totalPage = Math.ceil(listEmployee.length / perPage); // tong so page
let perEmployees = listEmployee.slice(
  (currentPage - 1) * perPage,
  (currentPage - 1) * perPage + perPage
); //  list employee trong 1 page

///////// khai bao search
let inputValueSearch = "";
let filterListEmployee = [];

///////// arr css btn prev and next when onclick
const cssBtnWhenAddOrSortOrSearch = [
  prevPageEl,
  0.4,
  "not-allowed",
  nextPageEl,
  1,
  "pointer",
];

const app = {
  // ham render
  render: function () {
    const htmls = perEmployees.map((employee) => {
      // xu ly render avatar
      const isName = typeof employee.name === "boolean";
      const fullName = !isName && employee.name.replace(/[0-9]/g, "");
      const arrFullname = fullName.trim().split(" ");
      const firstName = arrFullname[arrFullname.length - 1].split("")[0];

      return `
        <div class="content-staff-row">
            <div class="content-staff-block">
                <div class="content-staff-img">
                    <p class="content-staff-img-avatar">${firstName}</p>
                    <p class="content-staff-img-detail">
                        <i class="fa-solid fa-comments"></i>
                        <span>15</span>
                        <i class="fa-solid fa-users"></i>
                        <span>3</span>
                    </p>
                </div>
            <div class="content-staff-info">
                <p class="content-staff-name">${employee.name}</p>
                <li class="content-staff-position">${employee.job}</li>
                <div class="content-staff-email">
                    <i class="fa-solid fa-envelope"></i>
                    <p>${employee.email}</p>
                </div>
                <button class="content-staff-btn">Follow</button>
            </div>
        </div>
    </div>
    `;
    });
    // render list
    employeeListEl.innerHTML = htmls.join("");

    // render so trang va tong so trang
    currentPageEl.innerHTML = currentPage;
    totalPageEl.innerHTML = totalPage;
  },

  // ham sort A-Z
  sortListDataAZ: function (listdata) {
    return listdata.sort((a, b) =>
      a.name
        .toLowerCase()
        .split(" ")
        [a.name.split(" ").length - 1].localeCompare(
          b.name.toLowerCase().split(" ")[b.name.split(" ").length - 1]
        )
    );
  },

  // ham sort Z-A
  sortListDataZA: function (listdata) {
    return this.sortListDataAZ(listdata).reverse();
  },

  // ham sort id
  sortListDataId: function (listdata) {
    return listdata.sort((a, b) => a.id - b.id);
  },

  // ham update perEmployees
  updatePerEmployees: function (listdata) {
    return listdata.slice(
      (currentPage - 1) * perPage,
      (currentPage - 1) * perPage + perPage
    );
  },

  // ham update page khi thay doi record
  updatePageWhenChangeOptionRecord: function (value, listdata) {
    perPage = Number(value);
    currentPage = 1;
    perEmployees = this.updatePerEmployees(listdata);
    totalPage = Math.ceil(listdata.length / perPage);
  },

  // ham update currentPage, perEmployees when next
  updatePageWhenNext: function (listdata) {
    currentPage = currentPage + 1;
    perEmployees = this.updatePerEmployees(listdata);
  },

  // ham update currentPage, perEmployees when prev
  updatePageWhenPrev: function (listdata) {
    currentPage = currentPage - 1;
    perEmployees = this.updatePerEmployees(listdata);
  },

  // ham update currentPage, perEmployees, totalPage when search or sort or add
  updatePageWhenSearchOrSortOrAdd: function (listdata) {
    currentPage = 1;
    perEmployees = this.updatePerEmployees(listdata);
    totalPage = Math.ceil(listdata.length / perPage);
  },

  // ham delete dau tieng viet
  convertName: (name) => {
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    name = name.replace(/Đ/g, "D");
    name = name.replace(/đ/g, "d");
    return name;
  },

  // ham get input email tu value input name (form add nhan vien)
  getInputEmail: function (input) {
    // input name -> input email
    let inputEmail;
    let inputEmailNew;
    const arrEmailNameAdd = this.convertName(input.slice())
      .toLowerCase()
      .split(" ");
    if (arrEmailNameAdd.length === 1) {
      inputEmail = arrEmailNameAdd.join("");
      inputEmailNew = `${inputEmail}@ntq-solution.com.vn`;
    } else {
      const firstEmailName = arrEmailNameAdd[0];
      const lastEmailName = arrEmailNameAdd[arrEmailNameAdd.length - 1];
      const arrNewEmail = [];
      arrNewEmail.push(firstEmailName);
      arrNewEmail.push(lastEmailName);
      inputEmail = arrNewEmail.reverse().join(".");
      inputEmailNew = `${inputEmail}@ntq-solution.com.vn`;
    }

    // filter ra arr gom nhung email trung voi email input
    const filterCoincidentEmail = listEmployee.filter((employee) => {
      const isCheckTypeEmail = typeof employee.email === "boolean";
      const g = !isCheckTypeEmail && employee.email.replace(/[0-9]/g, "");
      return g === inputEmailNew;
    });

    // arr gom nhung so trong list email trung ten
    const sliceNumberCoincidentEmail = filterCoincidentEmail.map((item) => {
      const isCheckTypeEmail = typeof item.email === "boolean";
      if (!isCheckTypeEmail) {
        return Number(item.email.replace(/[^0-9]/g, ""));
      }
    });

    // update lai email input
    if (filterCoincidentEmail.length) {
      const arrNumberEmail = sliceNumberCoincidentEmail.sort((a, b) => a - b);
      inputEmail = `${inputEmail}${
        arrNumberEmail[arrNumberEmail.length - 1] + 1
      }@ntq-solution.com.vn`;
    } else {
      inputEmail = inputEmailNew;
    }

    return inputEmail;
  },

  // ham active and hide noti sort
  getNotiSort: function (element, text) {
    element.setAttribute("style", "left:0");
    notiSortDetailEl.innerHTML = `${text}`;

    setTimeout(() => {
      element.setAttribute("style", "left:-160px");
    }, 3000);
  },

  // ham css btn prev or next when not active
  cssBtnPrevOrNext: function (element, opacity, cursor) {
    element.setAttribute("style", `opacity: ${opacity}; cursor: ${cursor}`);
  },

  // ham update css btn prev and btn next when add or sort or search
  updateCssBtnWhenAddOrSortOrSearch: function (
    elPrev,
    opacity,
    notAllowed,
    elNext,
    active,
    pointer
  ) {
    this.cssBtnPrevOrNext(elPrev, opacity, notAllowed);
    this.cssBtnPrevOrNext(elNext, active, pointer);
    if (currentPage >= totalPage) {
      this.cssBtnPrevOrNext(elNext, opacity, notAllowed);
    }
  },

  // ham update css btn prev and btn next when next
  updateCssBtnPrevWhenNext: function (
    elPrev,
    opacity,
    notAllowed,
    elNext,
    active,
    pointer
  ) {
    this.cssBtnPrevOrNext(elPrev, active, pointer);
    if (currentPage === totalPage) {
      this.cssBtnPrevOrNext(elNext, opacity, notAllowed);
    }
  },

  // ham update css btn next and btn next when prev
  updateCssBtnNextWhenPrev: function (
    elPrev,
    opacity,
    notAllowed,
    elNext,
    active,
    pointer
  ) {
    this.cssBtnPrevOrNext(elNext, active, pointer);
    if (currentPage === 1) {
      this.cssBtnPrevOrNext(elPrev, opacity, notAllowed);
    }
  },

  // ham handle search nhan vien
  handleSearchEmployee: function (search) {
    inputValueSearch = this.convertName(search.value).trim().toLowerCase();
    if (inputValueSearch) {
      filterListEmployee = listEmployee.filter((employee) => {
        return (
          this.convertName(employee.name)
            .toLowerCase()
            .includes(inputValueSearch) ||
          (employee.email &&
            employee.email.toLowerCase().includes(inputValueSearch)) ||
          employee.job.toLowerCase().includes(inputValueSearch)
        );
      });
      if (filterListEmployee.length === 0) {
        contentEmpty.innerHTML = `
          <div class="content-notfound">
            <div class="sketch">
              <div class="bee-sketch red"></div>
              <div class="bee-sketch blue"></div>
            </div>
            <h1 class="content-notfound-title">404
            <small class="content-notfound-noti">No Search Results Found</small></h1>
          </div>
        `;
        contentEl.appendChild(contentEmpty);
      } else {
        contentEmpty.remove();
      }
      this.updatePageWhenSearchOrSortOrAdd(filterListEmployee);
      this.render();
      this.updateCssBtnWhenAddOrSortOrSearch(...cssBtnWhenAddOrSortOrSearch);
    } else {
      alert("Chua nhap gi trong input search");
    }
  },

  // ham handle add nhan vien
  handleAddEmployee: function (name, position) {
    const inputNameAdd = name.value.trim();
    const selectPositionAdd = position.value.trim();
    if (inputNameAdd && selectPositionAdd) {
      if (inputNameAdd.replace(/[^0-9]/g, "").length === 0) {
        // select id nhan vien cuoi cung
        const arrId = [];
        listEmployee.forEach((employee) => arrId.push(employee.id));
        const id = arrId.sort()[arrId.sort().length - 1];

        // input email
        const inputEmail = this.getInputEmail(inputNameAdd);

        // add nhan vien
        listEmployee.unshift({
          id: id + 1,
          name: inputNameAdd,
          email: inputEmail,
          job: selectPositionAdd,
        });

        inputNameAddEl.value = "";
        selectPositionAddEl.value = "Team Leader";
        inputEmailAddEl.value = "";
        inputValueSearch = "";
        inputSearchEl.value = "";
        modalAddEl.classList.remove("active");
        modalAddEl.classList.add("hide");

        this.updatePageWhenSearchOrSortOrAdd(listEmployee);
        this.render();
        this.updateCssBtnWhenAddOrSortOrSearch(...cssBtnWhenAddOrSortOrSearch);
        contentEmpty.remove();
      } else {
        alert("Ten nhan vien khong duoc nhap so");
      }
    } else {
      alert("Chua nhap day du thong tin");
    }
  },

  /////////////// xu ly su kien
  start: function () {
    ///// khi load trang
    window.onload = function () {
      app.render();
      app.getNotiSort(notiSortEl, "Original Data");
      app.updateCssBtnWhenAddOrSortOrSearch(...cssBtnWhenAddOrSortOrSearch);
    };

    ///// khi change select record
    recordSelectEl.onchange = function (e) {
      const newPerPage = e.target.value.trim();
      let _listEmployee = inputValueSearch ? filterListEmployee : listEmployee;
      app.updatePageWhenChangeOptionRecord(newPerPage, _listEmployee);
      app.render();
      app.updateCssBtnWhenAddOrSortOrSearch(...cssBtnWhenAddOrSortOrSearch);
    };

    ///// khi click btn next page
    nextPageEl.onclick = function () {
      let _listEmployee = inputValueSearch ? filterListEmployee : listEmployee;
      if (currentPage < totalPage) {
        app.updatePageWhenNext(_listEmployee);
        app.render();
        app.updateCssBtnPrevWhenNext(...cssBtnWhenAddOrSortOrSearch);
      }
    };

    ////// khi click btn prev page
    prevPageEl.onclick = function () {
      let _listEmployee = inputValueSearch ? filterListEmployee : listEmployee;
      if (currentPage > 1) {
        app.updatePageWhenPrev(_listEmployee);
        app.render();
        app.updateCssBtnNextWhenPrev(...cssBtnWhenAddOrSortOrSearch);
      }
    };

    ////// khi click btn search
    btnSearchEl.onclick = function () {
      app.handleSearchEmployee(inputSearchEl);
    };

    ///// khi click btn delete text search
    btnDeleteSearchEl.onclick = function () {
      inputValueSearch = "";
      inputSearchEl.value = "";
      app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      app.render();
      app.updateCssBtnWhenAddOrSortOrSearch(...cssBtnWhenAddOrSortOrSearch);
      contentEmpty.remove();
    };

    ///// khi click logo NTQ
    logoPageEl.onclick = function () {
      inputValueSearch = "";
      app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      app.render();
      app.updateCssBtnWhenAddOrSortOrSearch(...cssBtnWhenAddOrSortOrSearch);
      contentEmpty.remove();
    };

    ////// khi click sort A-Z
    sortPageAZEl.onclick = function () {
      let _listEmployee = inputValueSearch ? filterListEmployee : listEmployee;
      app.sortListDataAZ(_listEmployee);
      app.updatePageWhenSearchOrSortOrAdd(_listEmployee);
      app.getNotiSort(notiSortEl, "A-Z");
      app.render();
      app.updateCssBtnWhenAddOrSortOrSearch(...cssBtnWhenAddOrSortOrSearch);
    };

    ////// khi click sort Z-A
    sortPageZAEl.onclick = function () {
      let _listEmployee = inputValueSearch ? filterListEmployee : listEmployee;
      app.sortListDataZA(_listEmployee);
      app.updatePageWhenSearchOrSortOrAdd(_listEmployee);
      app.getNotiSort(notiSortEl, "Z-A");
      app.render();
      app.updateCssBtnWhenAddOrSortOrSearch(...cssBtnWhenAddOrSortOrSearch);
    };

    ////// khi click sort Id
    sortPageIdEl.onclick = function () {
      let _listEmployee = inputValueSearch ? filterListEmployee : listEmployee;
      app.sortListDataId(_listEmployee);
      app.updatePageWhenSearchOrSortOrAdd(_listEmployee);
      app.getNotiSort(notiSortEl, "Id");
      app.render();
      app.updateCssBtnWhenAddOrSortOrSearch(...cssBtnWhenAddOrSortOrSearch);
    };

    /////// khi active modal add
    btnOpenModalAdd.onclick = function () {
      modalAddEl.classList.remove("hide");
      modalAddEl.classList.add("active");
    };

    ////// khi hide modal add bang icon
    closeModalAddEl.onclick = function (e) {
      e.stopImmediatePropagation();
      modalAddEl.classList.remove("active");
      modalAddEl.classList.add("hide");
    };

    ///// hide form add khi click vao background modal add
    modalAddEl.onclick = function () {
      modalAddEl.classList.remove("active");
      modalAddEl.classList.add("hide");
    };

    ///// ngan noi bot khi click vao form add nhan vien
    modalFormEl.onclick = (e) => {
      e.stopPropagation();
    };

    ///// khi change input name (form add nhan vien)
    inputNameAddEl.onkeyup = function () {
      const inputNameAdd = inputNameAddEl.value.trim();
      if (inputNameAdd) {
        const inputEmail = app.getInputEmail(inputNameAdd);
        inputEmailAddEl.value = inputEmail;
      }
    };

    ///// khi click btn add nhan vien
    btnAddEl.onclick = function () {
      app.handleAddEmployee(inputNameAddEl, selectPositionAddEl);
    };
  },
};

app.start();
