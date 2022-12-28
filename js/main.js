import { EMPLOYEES } from "./MOCK_DATA.js";

//////// get element
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const employeeListEl = $(".content-staff");
const currentPageEl = $(".header-option-page-info span:nth-child(1)");
const totalPageEl = $(".header-option-page-info span:nth-child(2)");
const prevPageEl = $(".header-option-page-icon.prev");
const nextPageEl = $(".header-option-page-icon.next");
const inputSearchEl = $(".header-option-search input");
const btnSearchEl = $(".header-option-searchicon");
const sortPageAZEl = $(".header-option-sort-icon.down");
const sortPageZAEl = $(".header-option-sort-icon.up");
const btnOpenModalAdd = $(".header-option-add");
const modalAddEl = $(".modal-block");
const closeModalAddEl = $(".modal-add-staff-close");
const inputNameAddEl = $(".modal-add-staff-input input");
const selectPositionAddEl = $(".modal-add-staff-select select");
// const inputEmailAddEl = $(".modal-add-staff-email input")
const btnAddEl = $(".modal-add-staff-submit button");
console.log(btnAddEl);

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
  render: function () {
    const htmls = perEmployees.map((employee) => {
      const arrFullname = employee.name.trim().split(" ");
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

  // update perEmployees
  updatePerEmployees: function (listdata) {
    return listdata.slice(
      (currentPage - 1) * perPage,
      (currentPage - 1) * perPage + perPage
    );
  },

  // ham sort A-Z
  sortListDataAZ: function (listdata) {
    return listdata.sort((a, b) =>
      a.name
        .split(" ")
        [a.name.split(" ").length - 1].localeCompare(
          b.name.split(" ")[b.name.split(" ").length - 1]
        )
    );
  },

  // ham sort Z-A
  sortListDataZA: function (listdata) {
    return listdata
      .sort((a, b) =>
        a.name
          .split(" ")
          [a.name.split(" ").length - 1].localeCompare(
            b.name.split(" ")[b.name.split(" ").length - 1]
          )
      )
      .reverse();
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

  // ham update currentPage, perEmployees, totalPage when search or sort
  updatePageWhenSearchOrSortOrAdd: function (listdata) {
    currentPage = 1;
    perEmployees = this.updatePerEmployees(listdata);
    totalPage = Math.ceil(listdata.length / perPage);
  },

  handleEvents: function () {
    //////// xu ly khi next page
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

    /////// xu ly khi prev page
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

    /////// xu ly khi search
    btnSearchEl.onclick = function () {
      inputValueSearch = inputSearchEl.value.trim().toLowerCase();
      if (inputValueSearch) {
        filterListEmployee = listEmployee.filter((employee) => {
          return (
            employee.name.toLowerCase().includes(inputValueSearch) ||
            (employee.email &&
              employee.email.toLowerCase().includes(inputValueSearch)) ||
            employee.job.toLowerCase().includes(inputValueSearch)
          );
        });

        app.updatePageWhenSearchOrSortOrAdd(filterListEmployee);
      } else {
        app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      }
      app.render();
    };

    /////// xu ly khi sort A-Z
    sortPageAZEl.onclick = function () {
      if (inputValueSearch) {
        app.sortListDataAZ(filterListEmployee);
        app.updatePageWhenSearchOrSortOrAdd(filterListEmployee);
      } else {
        app.sortListDataAZ(listEmployee);
        app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      }
      app.render();
    };

    /////// xu ly khi sort Z-A
    sortPageZAEl.onclick = function () {
      if (inputValueSearch) {
        app.sortListDataZA(filterListEmployee);
        app.updatePageWhenSearchOrSortOrAdd(filterListEmployee);
      } else {
        app.sortListDataZA(listEmployee);
        app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      }
      app.render();
    };

    /////// xu ly khi active modal add
    btnOpenModalAdd.onclick = function () {
      modalAddEl.classList.remove("hide");
      modalAddEl.classList.add("active");
    };

    ///// xu ly khi hide modal add
    closeModalAddEl.onclick = function () {
      modalAddEl.classList.remove("active");
      modalAddEl.classList.add("hide");
    };

    ///// xu ly khi add nhan vien
    btnAddEl.onclick = function () {
      const convertName = (name) => {
        name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        name = name.replace(/Đ/g, "D");
        name = name.replace(/đ/g, "d");

        return name;
      };

      const inputNameAdd = inputNameAddEl.value.trim();
      const selectPositionAdd = selectPositionAddEl.value.trim();

      if (inputNameAdd && selectPositionAdd) {
        // select id nhan vien cuoi cung
        const arrId = [];
        listEmployee.forEach((employee) => arrId.push(employee.id));
        const sortArrId = arrId.sort();
        const id = sortArrId[sortArrId.length - 1];

        // clone input name va convert loai bo dau
        let newInputNameAdd = inputNameAdd.slice();
        newInputNameAdd = convertName(newInputNameAdd);

        // xu ly get input email tu input name
        const arrEmailNameAdd = newInputNameAdd.toLowerCase().split(" ");
        const firstEmailName = arrEmailNameAdd[0];
        const lastEmailName = arrEmailNameAdd[arrEmailNameAdd.length - 1];
        // if(arrEmailNameAdd.length=1) {
          // xu ly chi nhap 1 ten
        // }
        const arrNewEmail = [];
        arrNewEmail.push(firstEmailName);
        arrNewEmail.push(lastEmailName);
        let inputEmail = arrNewEmail.reverse().join(".");
        const inputEmailNew = `${inputEmail}@ntq-solution.com.vn`;

        // filter mang ban dau ra mang moi gom nhung email giong voi email input
        const filterCoincidentEmail = listEmployee.filter((employee) => {
          const isEmail = typeof employee.email === "boolean";
          const g = !isEmail && employee.email.replace(/[0-9]/g, "");
          return g === inputEmailNew;
        });

        // update lai email input
        inputEmail = filterCoincidentEmail.length
          ? `${inputEmail}${filterCoincidentEmail.length}@ntq-solution.com.vn`
          : inputEmailNew;

        // add nhan vien
        listEmployee.unshift({
          id: id + 1,
          name: inputNameAdd,
          email: inputEmail,
          job: selectPositionAdd,
        });

        inputNameAddEl.value = "";
        modalAddEl.classList.remove("active");
        modalAddEl.classList.add("hide");

        app.updatePageWhenSearchOrSortOrAdd(listEmployee);
        app.render();
      } else {
        alert("Chua nhap day du thong tin");
      }
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
