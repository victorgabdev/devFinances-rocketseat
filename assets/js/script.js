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
        if(tagImg === event.target) this.removeTransaction(tagImg);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const informationsForTd = this.catchInformationsForDataTable();
      const tr = this.createTr();
      const isValid = this.inputsIsValid(informationsForTd);
      if(!isValid.valid) {
        this.showErrorMessage(isValid.id);
        return
      }
      this.addNoErrorClass(isValid.idsError)
      this.addTransaction(informationsForTd, tr);
      this.clearInputValues();
      Modal.close();
    });
  }

  catchInformationsForDataTable() {
    const tags = this.defineInputTags();
    const dateInBrStyle = this.tranformingDateToBrStyle(tags.date.value);
    return {
      description: tags.description.value,
      value: tags.value.value,
      date: dateInBrStyle
    }
  }

  tranformingDateToBrStyle(dateEnglishVersionStr) {
    const dateEnglishVersionArray = dateEnglishVersionStr.split('-');
    const year = dateEnglishVersionArray[0];
    const month = dateEnglishVersionArray[1];
    const days = dateEnglishVersionArray[2];
    return `${days}/${month}/${year}`;
  }

  defineInputTags() {
    const modalDescription = document.querySelector('#description');
    const modalValue = document.querySelector('#amount');
    const modalDate = document.querySelector('#date');
    return {description: modalDescription, value: modalValue, date: modalDate};
  }

  clearInputValues() {
    const tagsInput = this.defineInputTags();
    tagsInput.description.value = ''; 
    tagsInput.value.value = '';  
    tagsInput.date.value = '';  
  }

  inputsIsValid(objectOfValues) {
    const ids = ['#error-description', '#error-value', '#error-date'];
    if(objectOfValues.description === '') return {valid: false, id: ids[0]};
    if(objectOfValues.value === '' || objectOfValues.value == 0) return {valid: false, id: ids[1]};
    if(objectOfValues.date === 'undefined/undefined/') return {valid: false, id: ids[2]};
    return {valid: true, idsError: {description: ids[0], value: ids[1], date: ids[2]}};
  }

  addNoErrorClass(ids) {
    document.querySelector(ids.description).classList.add('no-error');
    document.querySelector(ids.value).classList.add('no-error');
    document.querySelector(ids.date).classList.add('no-error'); 
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
    this.balanceSheetAccount(objectOfValues.value, classTdValue);
  }

  transformStrInNumber(str) {
    return Number(str);
  }

  transformNumberInStr(number) {
    return String(number);
  }

  treatingValue(value) {
    value = value.replace('-', '');
    return this.transformStrInNumber(value);
  }

  handleCardsTags(id) {
    const tag = document.querySelector(id);
    let card = tag.textContent;
    card = card.replace('R$', '');
    return this.transformStrInNumber(card);
  }

  showContentOnScreen(id, card) {
    const tag = document.querySelector(id);
    card = card.toFixed(2);
    card = this.transformNumberInStr(card);
    tag.innerText =  "R$ " + card;
  }

  balanceSheetAccount(value, clas) {
    const idsTags = ['#balance-total', '#balance-income', '#balance-expense'];
    value = this.treatingValue(value);
    let cardTotal = this.handleCardsTags(idsTags[0]);

    if(clas === 'income') {
      let cardIncome = this.handleCardsTags(idsTags[1]); // card
      cardIncome += value;
      cardTotal += value;
      this.showContentOnScreen(idsTags[1], cardIncome);
    }

    if(clas === 'expense') {
      let cardExpense = this.handleCardsTags(idsTags[2]);;
      cardExpense += value;
      cardTotal -= value;
      this.showContentOnScreen(idsTags[2], cardExpense);
    }

    this.showContentOnScreen(idsTags[0], cardTotal);
  }
  
  addImageToImgCloses(tr) {
    const img = tr.lastElementChild.lastElementChild;
    this.imgsCloseArray.push(img);
  }

  removeTransaction(tagImg) {
    tagImg.parentNode.parentNode.remove();
  }
}

const devFinance = new DevFinance();
devFinance.init();