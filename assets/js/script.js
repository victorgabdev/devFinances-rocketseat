class Modal {
  static open(){
    document.querySelector('.modal-overlay').classList.add('active');
  }
  static close(){
    const devFinance = new DevFinance();
    devFinance.clearInputValues();  // limpando o input toda vez que o usuário fechar o modal
    document.querySelector('.modal-overlay').classList.remove('active');
  }
}

// Validar data e entrada

class DevFinance {
  // Links
  linkForModal = document.querySelector('a.button.new');
  linkForCloseModal = document.querySelector('a.button.cancel');

  //img close
  imgsCloseNodeList = document.querySelectorAll('.img-close');
  imgsCloseArray = Array.prototype.slice.call(this.imgsCloseNodeList);

  // submit de modal
  form = document.querySelector('#form');
  
  init() {
    document.addEventListener('click', (event) => {
      if(event.target == this.linkForModal) Modal.open();
      if(event.target == this.linkForCloseModal) Modal.close();
      this.imgsCloseArray.forEach((tagImg) => {
        if(this.tagImgisEventTarget(tagImg, event.target)) this.removeTransaction(tagImg);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const informationsForTd = this.catchInformationsForDataTable();
      const tr = this.createTr();
      const isValid = this.inputsIsValid(informationsForTd);
      if(!isValid.valid) {
        this.showErrorMessage(isValid.id);
      } else {
        this.addNoErrorClass(isValid.id)
        this.addTransaction(informationsForTd, tr);
        this.clearInputValues();
        Modal.close();
      }
    });
  }

  catchInformationsForDataTable() {
    const tags = this.defineInputTags();
    const modalDescription = tags[0];
    const modalValue = tags[1];
    const modalDate = tags[2];
    const dateInBrStyle = this.tranformingDateToBrStyle(modalDate.value);
    return {
      description: modalDescription.value,
      value: modalValue.value,
      date: dateInBrStyle
    }
  }

  tranformingDateToBrStyle(dateEng) {
    const dateEngArray = dateEng.split('-');
    const year = dateEngArray[0];
    const month = dateEngArray[1];
    const days = dateEngArray[2];
    return `${days}/${month}/${year}`;
  }

  defineInputTags() {
    const modalDescription = document.querySelector('#description');
    const modalValue = document.querySelector('#amount');
    const modalDate = document.querySelector('#date');
    return [modalDescription, modalValue, modalDate];
  }

  clearInputValues() {
    const tagsInput = this.defineInputTags();
    tagsInput[0].value = ''; // description
    tagsInput[1].value = '';  // value
    tagsInput[2].value = '';  // date
  }

  inputsIsValid(objectOfValues) {
    const ids = ['#error-description', '#error-value', '#error-date'];
    if(objectOfValues.description === '') return {valid: false, id: ids[0]};
    if(objectOfValues.value === '' || objectOfValues.value == 0) return {valid: false, id: ids[1]};
    if(objectOfValues.date === 'undefined/undefined/') return {valid: false, id: ids[2]};
    return {valid: true, id: ids};
  }

  addNoErrorClass(ids) {
    for(let id of ids) {
      let tagOfError = document.querySelector(id);
      tagOfError.classList.add('no-error');
    }
  }

  showErrorMessage(id) {
    const tagError = document.querySelector(id);
    tagError.classList.remove('no-error');
  }

  createTr() {
    const tr = document.createElement('tr');
    return tr;
  }

  createTd(clas, msg) {
    return `<td class="${clas}">${msg}</td>`;
  }
  
  createTdImage() {
    const path = './assets/img/minus.svg';
    const alt = 'Imagem que representa um botao de saída da descrição da tabela';
    const clas = "img-close";
    return `<td><img src="${path}" alt="${alt}" class="${clas}"></td>`;
  }

  getClassTdValue(firstElement) {
    let classTdValue = 'income';
    if (firstElement === '-') classTdValue = 'expense';
    return classTdValue;
  }


  addTransaction(objectOfValues, tr) {
    let classTdValue = this.getClassTdValue(objectOfValues.value[0]);

    const tbody = document.querySelector('#bodyOfData-table');
    const tdDescription = this.createTd('description',objectOfValues.description);
    const tdValue = this.createTd(classTdValue, objectOfValues.value);
    const tdDate = this.createTd('date', objectOfValues.date);
    const tdImage = this.createTdImage();


    tr.innerHTML = tdDescription + tdValue + tdDate + tdImage;
    tbody.append(tr);
    this.addImageToImgCloses(tr);
  }
  
  addImageToImgCloses(tr) {
    const img = tr.lastElementChild.lastElementChild;
    this.imgsCloseArray.push(img);
  }

  tagImgisEventTarget(tagImg, currentTag) {
    if(tagImg === currentTag) return true;
  }

  removeTransaction(tagImg) {
    tagImg.parentNode.parentNode.remove();
  }
}

const devFinance = new DevFinance();
devFinance.init();