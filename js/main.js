import { EMPLOYEES } from "./MOCK_DATA.js";

//////// get element
const $ = document.querySelector.bind(document);
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

///////// khai bao phan trang
const listEmployee = EMPLOYEES;
let currentPage = 1; // page hien tai
const perPage = 40; // so employee trong 1 page
let totalPage = Math.ceil(listEmployee.length / perPage); // tong so page
let perEmployees = listEmployee.slice(
  (currentPage - 1) * perPage,
  (currentPage - 1) * perPage + perPage
); //  listEmployee trong 1 page

///////// khai bao search
let inputValueSearch = "";
let filterListEmployee = [];

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

  // ham loai bo dau tieng viet trong 1 chuoi
  convertName: (name) => {
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    name = name.replace(/Đ/g, "D");
    name = name.replace(/đ/g, "d");
    return name;
  },

  // ham get input email tu value input name (form add nhan vien)
  inputEmailWhenAdd: function (input) {
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
      const isEmail = typeof employee.email === "boolean";
      const g = !isEmail && employee.email.replace(/[0-9]/g, "");
      return g === inputEmailNew;
    });

    // arr gom nhung so trong list email trung ten
    const sliceNumberCoincidentEmail = filterCoincidentEmail.map((item) => {
      const f = typeof item.email === "boolean";
      if (!f) {
        return item.email.replace(/[^0-9]/g, "");
      }
    });

    // update lai email input
    if (filterCoincidentEmail.length) {
      let numberEmail;
      const arrNumberEmail = sliceNumberCoincidentEmail.sort((a, b) =>
        a.localeCompare(b)
      );
      if (arrNumberEmail[arrNumberEmail.length - 1] !== "") {
        numberEmail = Number(arrNumberEmail[arrNumberEmail.length - 1]) + 1;
      } else {
        numberEmail = 1;
      }
      inputEmail = `${inputEmail}${numberEmail}@ntq-solution.com.vn`;
    } else {
      inputEmail = inputEmailNew;
    }

    return inputEmail;
  },

  // ham active hide noti sort
  handleNotiSort: function (element, text) {
    element.setAttribute("style", "left:0");
    notiSortDetailEl.innerHTML = `${text}`;

    setTimeout(() => {
      element.setAttribute("style", "left:-160px");
    }, 3000);
  },

  handleEvents: function () {
    ////// khi click btn next page
    nextPageEl.onclick = function () {
      if (inputValueSearch) {
        if (currentPage < totalPage) {
          app.updatePageWhenNext(filterListEmployee);
          app.render();
        } else {
          alert("Khong the next them");
        }
      } else {
        if (currentPage < totalPage) {
          app.updatePageWhenNext(listEmployee);
          app.render();
        } else {
          alert("Khong the next them");
        }
      }
    };

    /////// khi clikc btn prev page
    prevPageEl.onclick = function () {
      if (inputValueSearch) {
        if (currentPage > 1) {
          app.updatePageWhenPrev(filterListEmployee);
          app.render();
        } else {
          alert("Khong the prev them");
        }
      } else {
        if (currentPage > 1) {
          app.updatePageWhenPrev(listEmployee);
          app.render();
        } else {
          alert("Khong the prev them");
        }
      }
    };

    /////// khi click btn search
    btnSearchEl.onclick = function () {
      inputValueSearch = app
        .convertName(inputSearchEl.value)
        .trim()
        .toLowerCase();
      if (inputValueSearch) {
        filterListEmployee = listEmployee.filter((employee) => {
          return (
            app
              .convertName(employee.name)
              .toLowerCase()
              .includes(inputValueSearch) ||
            (employee.email &&
              employee.email.toLowerCase().includes(inputValueSearch)) ||
            employee.job.toLowerCase().includes(inputValueSearch)
          );
        });
        if (filterListEmployee.length === 0) {
          alert("Khong tim thay thong tin nhan vien nao !!!");
        } else {
          app.updatePageWhenSearchOrSortOrAdd(filterListEmployee);
          app.render();
        }
      } else {
        alert("Chua nhap gi trong input search");
      }
    };

    ////// khi click btn delete text search
    btnDeleteSearchEl.onclick = function () {
      inputValueSearch = "";
      inputSearchEl.value = "";
      app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      app.render();
    };

    ////// khi click vao logo NTQ
    logoPageEl.onclick = function () {
      inputValueSearch = "";
      app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      app.render();
    };

    /////// khi click sort A-Z
    sortPageAZEl.onclick = function () {
      if (inputValueSearch) {
        app.sortListDataAZ(filterListEmployee);
        app.updatePageWhenSearchOrSortOrAdd(filterListEmployee);
      } else {
        app.sortListDataAZ(listEmployee);
        app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      }
      app.handleNotiSort(notiSortEl, "A-Z");
      app.render();
    };

    /////// khi click sort Z-A
    sortPageZAEl.onclick = function () {
      if (inputValueSearch) {
        app.sortListDataZA(filterListEmployee);
        app.updatePageWhenSearchOrSortOrAdd(filterListEmployee);
      } else {
        app.sortListDataZA(listEmployee);
        app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      }
      app.handleNotiSort(notiSortEl, "Z-A");
      app.render();
    };

    /////// khi click sort Id
    sortPageIdEl.onclick = function () {
      if (inputValueSearch) {
        app.sortListDataId(filterListEmployee);
        app.updatePageWhenSearchOrSortOrAdd(filterListEmployee);
      } else {
        app.sortListDataId(listEmployee);
        app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      }
      app.handleNotiSort(notiSortEl, "Id");
      app.render();
    };

    /////// khi active modal add
    btnOpenModalAdd.onclick = function () {
      modalAddEl.classList.remove("hide");
      modalAddEl.classList.add("active");
    };

    ///// khi hide modal add bang icon
    closeModalAddEl.onclick = function (e) {
      e.stopImmediatePropagation();
      modalAddEl.classList.remove("active");
      modalAddEl.classList.add("hide");
    };

    ///// hide modal add khi click vao background
    modalAddEl.onclick = function () {
      modalAddEl.classList.remove("active");
      modalAddEl.classList.add("hide");
    };

    ///// ngan noi bot khi click vao background modal
    modalFormEl.onclick = (e) => {
      e.stopPropagation();
    };

    ///// khi blur input name (form add nhan vien)
    inputNameAddEl.onblur = function () {
      const inputNameAdd = inputNameAddEl.value.trim();
      if (inputNameAdd) {
        const inputEmail = app.inputEmailWhenAdd(inputNameAdd);
        inputEmailAddEl.value = inputEmail;
      }
    };

    ///// khi click btn add nhan vien
    btnAddEl.onclick = function () {
      const inputNameAdd = inputNameAddEl.value.trim();
      const selectPositionAdd = selectPositionAddEl.value.trim();
      if (inputNameAdd && selectPositionAdd) {
        if ((inputNameAdd.replace(/[^0-9]/g, "").length === 0)) {
          // select id nhan vien cuoi cung
          const arrId = [];
          listEmployee.forEach((employee) => arrId.push(employee.id));
          const id = arrId.sort()[arrId.sort().length - 1];

          // input email
          const inputEmail = app.inputEmailWhenAdd(inputNameAdd);

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

          app.updatePageWhenSearchOrSortOrAdd(listEmployee);
          app.render();
        } else {
          alert("Ten nhan vien khong duoc nhap so");
        }
      } else {
        alert("Chua nhap day du thong tin");
      }
    };

    ///// khi load trang
    window.onload = function () {
      app.handleNotiSort(notiSortEl, "Original Data");
    };
  },

  start: function () {
    // Xu ly su kien
    this.handleEvents();

    // Render employee list
    this.render();
  },
};

app.start();
