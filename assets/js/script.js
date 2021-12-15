class Modal {
  static open(){
    document.querySelector('.modal-overlay').classList.add('active');
  }
  static close(){
    document.querySelector('.modal-overlay').classList.remove('active');
  }
}

class DevFinance {
  // Links
  linkForModal = document.querySelector('a.button.new');
  linkForCloseModal = document.querySelector('a.button.cancel');

  // submit de modal
  form = document.querySelector('#form');
  
  init() {
    document.addEventListener('click', (event) => {
      if(event.target == this.linkForModal) Modal.open();
      if(event.target == this.linkForCloseModal) Modal.close();
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const informationsForTd = this.catchInformationsForDataTable();
      const tr = this.createTr();
      this.addDescription(informationsForTd, tr);
      // fechar modal
      Modal.close();
      // validar valores digitados no form
    });
  }

  catchInformationsForDataTable() {
    const modalDescription = document.querySelector('#description');
    const modalValue = document.querySelector('#amount');
    const modalDate = document.querySelector('#date');
    return {
      description: modalDescription.value,
      value: modalValue.value,
      date: modalDate.value
    }
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
    return `<td><img src="${path}" alt="${alt}"></td>`
  }

  getClassTdValue(firstElement) {
    let classTdValue = 'income';
    if (firstElement === '-') classTdValue = 'expense';
    return classTdValue;
  }


  addDescription(arrayOfValues, tr) {
    let classTdValue = this.getClassTdValue(arrayOfValues.value[0]);

    const tbody = document.querySelector('#bodyOfData-table');
    const tdDescription = this.createTd('description',arrayOfValues.description);
    const tdValue = this.createTd(classTdValue, arrayOfValues.value);
    const tdDate = this.createTd('date', arrayOfValues.date);
    const tdImage = this.createTdImage();


    tr.innerHTML = tdDescription + tdValue + tdDate + tdImage;
    tbody.append(tr); 
  }
  

}

const devFinance = new DevFinance();
devFinance.init();