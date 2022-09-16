'use strict';

(() =>{
  class Box{
    constructor(){
      this.board = document.querySelector('.board');
      this.colors = [];
      this.shuffleColors = [];
      this.numbers = [];
      this.shuffleNumbers = [];
      this.dupli = false;
      this.quizChoice = Math.floor(Math.random() * 2);

      this.selectColors = [
        'red', 'blue', 'green', 'purple', 'skyblue', 'yellow', 'brown', 'gray',
      ]

      this.convertColors = [
        '赤色', '青色', '緑色', '紫色', '水色', '黄色', '茶色', '灰色',
      ]

      for(let i = 0; i < 4; i++){
        this.colorAdd();
        this.numberAdd();

        const div = document.createElement('div');
        div.classList.add(this.selectColors[this.colors[i]]);
        div.textContent = `${this.numbers[i]}`;

        this.board.appendChild(div);
      }

      if(this.quizChoice === 0){
        this.shuffleColors = this.shuffle(this.shuffleColors);
      } else {
        this.shuffleNumbers = this.shuffle(this.shuffleNumbers);
      }  
    }

    colorAdd(){
      const n = Math.floor(Math.random() * this.selectColors.length);
      this.colors.forEach(color =>{
        if(color === n){
          this.dupli = true;
        }
      });

      if(this.dupli){
        this.dupli = false;
        this.colorAdd();
        return;
      }
      
      this.colors.push(n);
      this.shuffleColors.push(n);
    }

    numberAdd(){
      const n = Math.floor(Math.random() * 20) + 10;
      this.numbers.forEach(number =>{
        if(number === n){
          this.dupli = true;
        }
      });

      if(this.dupli){
        this.dupli = false;
        this.numberAdd();
        return;
      }
      
      this.numbers.push(n);
      this.shuffleNumbers.push(n);
    }

    shuffle(array){
      for(let i = array.length - 1; i > 0; i--){
        const n = Math.floor(Math.random() * (i + 1));
        [array[i], array[n]] = [array[n], array[i]];
      }

      return array;
    }
  }

  class Answer{
    constructor(){
      this.blind = document.querySelector('.blind');
      this.ul = document.querySelector('.answers');
      this.direction = Math.floor(Math.random() * 4);
      this.result = false;
      this.push = false;
      this.startTime = Date.now();

      this.selectDirections = [
        '左上', '右上', '左下', '右下',
      ];

      for(let i = 0; i < 4; i++){
        const li = document.createElement('li');
        if(box.quizChoice === 0){
          li.textContent = `${box.convertColors[box.shuffleColors[i]]}`;
        } else {
          li.textContent = `${box.shuffleNumbers[i]}`;
        }

        this.ul.appendChild(li);
      }

      this.directionSet();

      this.blind.classList.remove('hidden');
      this.ul.classList.remove('hidden');

      this.answer();
    }

    directionSet(){
      const question = document.getElementById('question');

      if(box.quizChoice === 0){
        question.textContent = `${this.selectDirections[this.direction]}の色はなに？`;
      } else {
        question.textContent = `${this.selectDirections[this.direction]}の数字はなに？`;
      }
    }

    answer(){
      const list = document.querySelectorAll('.answers > li');
      list.forEach((li, index) =>{
        li.addEventListener('click', () =>{
          if(this.push){
            return;
          }

          const elapsedTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
          this.blind.classList.add('hidden');

          switch(box.quizChoice){
            case 0:
              if(box.shuffleColors[index] === box.colors[this.direction]){
                li.classList.add('correct');
                this.result = true;
              } else {
                li.classList.add('incorrect');
                list.forEach((l, i) =>{
                  if(box.shuffleColors[i] === box.colors[this.direction]){
                    l.classList.add('correct');
                  }
                });
                this.result = false;
              }
              break;
            case 1:
              if(box.shuffleNumbers[index] === box.numbers[this.direction]){
                li.classList.add('correct');
                this.result = true;
              } else {
                li.classList.add('incorrect');
                list.forEach((l, i) =>{
                  if(box.shuffleNumbers[i] === box.numbers[this.direction]){
                    l.classList.add('correct');
                  }
                });
                this.result = false;
              }
              break;
          }

          this.push = true;
          new Result(this.result, elapsedTime);
        });
      });
    }
  }

  class Result{
    constructor(result, time){
      this.resultDisplay = document.querySelector('.result');
      this.clearTime = document.getElementById('clearTime');

      this.resultDisplay.classList.remove('hidden');
      if(result){
        this.clearTime.textContent = `${time}秒かかりました!`;
      } else {
        this.clearTime.textContent = '残念!';
      }

      console.log(result);
      console.log(time);
    }
  }

  const title = document.querySelector('.title');
  const container = document.querySelector('.container');
  const startBtn = document.getElementById('start-btn');

  const box = new Box();

  startBtn.addEventListener('click', () =>{
    title.classList.add('hidden');
    container.classList.remove('hidden');

    setTimeout(() =>{
      new Answer();
    }, 3000);
  });
})();