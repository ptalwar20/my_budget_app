var budgetController = (function(){
  var Income = function(id,description,value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Expense = function(id,description,value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      inc: [],
      exp: []
    },
    total_income: 0,
    total_expenses: 0
  };

  return {
    addNewItem: function(newItem){
      var ID,addedItem;
      //Create new ID
      if(data.allItems[newItem.type].length>0) {
        ID = data.allItems[newItem.type][ data.allItems[newItem.type].length -1].id + 1;
      } else {
        ID = 0;
      }
      if(newItem.type==='inc'){
        addedItem = new Income(ID,newItem.description,newItem.value);
        data.total_income+=newItem.value;
        data.allItems.inc.push(addedItem);
      } else if(newItem.type==='exp'){
        addedItem = new Expense(ID,newItem.description,newItem.value);
        data.total_expenses+=newItem.value;
        data.allItems.exp.push(addedItem);
      }
      return addedItem;
    },
    getTotalIncome: function(){
      return data.total_income;
      
    },
    getTotalExpenses: function(){
      return data.total_expenses;
    },
    calculateBudget: function(){
      return data.total_income - data.total_expenses;
    }
  };
})();

var UIController = (function(){
  return {
    getInput: function(){
      return {
        type: document.querySelector('.add__type').value,
        description: document.querySelector('.add__description').value,
        value: parseFloat(document.querySelector('.add__value').value)
      }
       
    },
    //2. Add listItem from data to UI
    addListItem: function(obj,type){
      // console.log(obj);
      var html, newHtml;
      html = '<div class="item item-%id%"><h3>%id%</h3><h3>%description%</h3><h3 class="value">%value%</h3></div>';
    newHtml = html.replace(/%id%/g,obj.id);
    newHtml = newHtml.replace('%description%',obj.description);
    newHtml = newHtml.replace('%value%',obj.value);
    if(type==='inc'){
      document.querySelector('.show__incomes--items').insertAdjacentHTML('beforeend',newHtml);
    } else if(type==='exp') {
      document.querySelector('.show__expenses--items').insertAdjacentHTML('beforeend',newHtml);
    }
  },
  displayBudget: function(budget,tInc,tExp){
    document.querySelector('.budget__value').textContent = budget;
    document.querySelector('.budget__income--value').textContent = tInc;
    document.querySelector('.budget__expenses--value').textContent = tExp;
  }
};
})();

var controller = (function(budgetCtrl,UICtrl){
  var setupEventListeners =  function(){
    document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);
    document.addEventListener('keypress',function(event){
      //What if there are no values -- doubt
      if(event.keyCode=== 13 || event.which === 13){
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function(){
    var listItem, newItem, budget,tIncome,tExpenses;
    //1. Get Input Values
    newItem = UICtrl.getInput();
    //2. Add newItem into data structure
    listItem = budgetCtrl.addNewItem(newItem);
    //3. Add newItem into UI
    UICtrl.addListItem(listItem,newItem.type);
    //4. Calculate Budget, get Total current Income & get Total Current Expenses
    budget = budgetCtrl.calculateBudget();
    tIncome = budgetCtrl.getTotalIncome();
    tExpenses = budgetCtrl.getTotalExpenses();
    //5. Display budget onto UI
    UICtrl.displayBudget(budget,tIncome,tExpenses);
  };

  return {
    init:  function(){
      console.log("Application has started.");
      setupEventListeners();
    }
  };
})(budgetController,UIController);

controller.init();