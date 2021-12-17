class Modal {
  static open(){
    document.querySelector('.modal-overlay').classList.add('active');
  }
  static close(){
    document.querySelector('.modal-overlay').classList.remove('active');
  }
}
// Criar uma classe para adicionar description e retirar description

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
      this.addTransaction(informationsForTd, tr);
      Modal.close();
    });
  }

  catchInformationsForDataTable() {
    const modalDescription = document.querySelector('#description');
    const modalValue = document.querySelector('#amount');
    const modalDate = document.querySelector('#date');
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


  addTransaction(arrayOfValues, tr) {
    let classTdValue = this.getClassTdValue(arrayOfValues.value[0]);

    const tbody = document.querySelector('#bodyOfData-table');
    const tdDescription = this.createTd('description',arrayOfValues.description);
    const tdValue = this.createTd(classTdValue, arrayOfValues.value);
    const tdDate = this.createTd('date', arrayOfValues.date);
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