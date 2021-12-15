class Modal {
  static open(){
    document.querySelector('.modal-overlay').classList.add('active');
  }
  static close(){
    document.querySelector('.modal-overlay').classList.remove('active');
  }
}

class DevFinance {
  linkForModal = document.querySelector('a.button.new')
  linkForCloseModal = document.querySelector('a.button.cancel')
  
  init() {
    document.addEventListener('click', (event) => {
      if(event.target == this.linkForModal) Modal.open();
      if(event.target == this.linkForCloseModal) Modal.close();
    });


  }
}

const devFinance = new DevFinance();
devFinance.init();