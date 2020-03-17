const PAGE ={
  data:{
    index: 0,
    duration: 500,
    translateX: 0, //偏移量
    defaultLenght: null,//默认项目数量
    itemWidth: null,//单个项目宽度
    isLock: false,
  },
  init:function(){
    this.bind();
    this.clone();
  },
  bind:function(){
    let swiperPrev = document.getElementById('swiper-prev');
    let swiperNext = document.getElementById('swiper-next');
    swiperPrev.addEventListener('click',this.swiperPrev);
    swiperNext.addEventListener('click',this.swiperNext);
    let swiperSwitch = document.getElementsByClassName('swiper-pagination-switch');
    for (let i = 0; i < swiperSwitch.length; i++ ){
      swiperSwitch[i].setAttribute(`data-index`,1);
      swiperSwitch[i].addEventListener('click',this.swiperSwitch);
    }
    window.addEventListener('resize',this.swiperReset);
  },
  swiperReset:function(){
    let swiperList = document.getElementById('swiper-list');
    let swiperItemWidth =swiperList.offsetWidth;
    let index = PAGE.data.index;
    let translateX = -(swiperItemWidth + swiperItemWidth * index);
    PAGE.data.itemWidth = swiperItemWidth;
    PAGE.data.translateX = translateX;
    swiperList.style.transform = `translateX(${translateX}px)`;
  },
  clone:function(){
    let swiperItem = document.getElementsByClassName('swiper-item');
    let firstItem = swiperItem[0].cloneNode();
    let lastItem = swiperItem[swiperItem.length - 1].cloneNode();
    let swiperList = document.getElementById('swiper-list');
    let index = PAGE.data.index;
    let swiperItemWidth = swiperList.offsetWidth;
    PAGE.data.defaultLenght = swiperItem.length;
    PAGE.data.itemWidth = swiperList.offsetWidth;
    PAGE.data.translateX = -(swiperItemWidth + swiperItemWidth * index);
    swiperList.appendChild(firstItem);
    swiperList.prepend(lastItem);
    PAGE.goindex(index);
  },
  goindex:function(index){
    let swiperDuration = PAGE.data.duration;
    let swiperItemWidth = PAGE.data.itemWidth;
    let beginTranslateX = PAGE.data.translateX;
    let endTranslateX = -( swiperItemWidth + swiperItemWidth * index);
    let swiperList = document.getElementById('swiper-list');
    let isLock = PAGE.data.isLock;
    if(isLock){ 
      return
    }
    PAGE.data.isLock = true;
    PAGE.animateTo(beginTranslateX,endTranslateX,swiperDuration,function(value){
      swiperList.style.transform = `translateX(${value}px)`;
    },function(value){
      let swiperLength = PAGE.data.defaultLenght;
      if(index === -1){
        index = swiperLength - 1;
        value =  - (swiperItemWidth + swiperItemWidth * index);
      }
      if(index === swiperLength){
        index = 0;
        value =  - (swiperItemWidth + swiperItemWidth * index);
      }
      swiperList.style.transform = `translateX(${value}px)`;
      PAGE.data.index = index;
      PAGE.data.translateX = value;
      PAGE.data.isLock = false;
      PAGE.hightlight(index);
    })
  },
  animateTo:function(begin,end,duration,changeCallback,finishCallback){
    let startTime = Date.now();
    requestAnimationFrame(function update(){
      let dataNow = Date.now();
      let time = dataNow - startTime;
      let value = PAGE.linear(time,begin,end,duration);
      typeof changeCallback === `function` && changeCallback(value)
      if(startTime + duration > dataNow){
        requestAnimationFrame(update)
      }else{
        typeof finishCallback === `function` && finishCallback(end)
      }
    })
  },
  linear:function(time,begin,end,duration){
    return (end - begin) * time / duration +begin;
  },
  swiperPrev:function(){
    let index = PAGE.data.index;
    PAGE.goindex(index - 1);
  }, 
  swiperNext:function(){
    let index = PAGE.data.index;
    PAGE.goindex(index + 1);
  },
  swiperSwitch:function(e){
    let index = e.target.dataset.index;
    index = Number(index);
    PAGE.goindex(index);
  },
  hightlight:function(index){
    let swiperItem = document.getElementsByClassName('swiper-pagination-switch');
    for( let i = 0; i< swiperItem.length; i++){
      swiperItem[i].className = `swiper-pagination-switch `;
    }
    swiperItem[index].className = `swiper-pagination-switch active`;
  }
}

PAGE.init();