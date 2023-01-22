var btnDelete = document.getElementById('clear');
      var inputFocus = document.getElementById('myInput');

      //  btnDelete.on('click', function(e) {
      //    e.preventDefault();
      //    inputFocus.classList.add('isFocus')
      //  })
      //  inputFocus.addEventListener('click', function() {
      //    this.classList.add('isFocus')
      //  })

      btnDelete.addEventListener('click', function(e)
      {
        alert("a");
        e.preventDefault();
        document.getElementById('myInput').value = '';
        // btnDelete.classList.remove('isFocus_')
      })
      document.addEventListener('click', function(e)
      {
        if (document.getElementById('first').contains(e.target))
        {
          inputFocus.classList.add('isFocus');
          // btnDelete.classList.add('isFocus_');
        }
        else
        {
          // Clicked outside the box
          inputFocus.classList.remove('isFocus');
          // btnDelete.classList.remove('isFocus_');
        }
      });

      const choices = new Choices('[data-trigger]',
      {
        searchEnabled: false,
        itemSelectText: '',
      });

// const ratio = 0.5;
//   const options = {
//     root: null,
//     rootMargin: '0px',
//     threshold: 0.1
//   }

//   const productAnimationUp = function (entries,observer) {
//     entries.forEach(function (entry) {
//       if (entry.intersectionRatio>0.1) {
//         //visible
//         // entry.target.classList.remove('reveal');
//         if (entry.intersectionRatio<=1) {
//           entry.target.classList.remove('animate__animated','animate__fadeInDown');
//           entry.target.classList.add('animate__animated','animate__fadeInUp');
//           observer.unobserve(entry.target);//on arrete d'observer
//         } else {

//         }

//       } else {
//         //invisible
//         entry.target.classList.remove('animate__animated','animate__fadeInUp','animate__fadeInDown');
//       }
//     })
//   }
//   const productAnimationDown = function (entries,observer) {
//     entries.forEach(function (entry) {
//       if (entry.intersectionRatio>0.1) {
//         //visible
//         if (entry.intersectionRatio<=1) {
//           entry.target.classList.remove('animate__animated','animate__fadeInUp');
//           entry.target.classList.add('animate__animated','animate__fadeInDown');
//         observer.unobserve(entry.target);//on arrete d'observer
//         } else {

//         }
//       } else {
//         //invisible
//         entry.target.classList.remove('animate__animated','animate__fadeInDown','animate__fadeInUp');
//       }
//     })
//   }

//   const observer = new IntersectionObserver(productAnimationUp, options);
//   const observer1 = new IntersectionObserver(productAnimationDown, options);

// // Mais on peut regarder plusieurs éléments
// window.onload = function () {
//   const items = document.querySelectorAll('.product_');
//   items.forEach(function (item) {
//   observer.observe(item);
// });
// }

// var position = $(window).scrollTop();

// // should start at 0

// $(window).scroll(function() {
//     var scroll = $(window).scrollTop();
//     if(scroll > position) {
//       //Down
//       const items = document.querySelectorAll('.product_');
//       items.forEach(function (item) {
//         observer.observe(item);
//       });
//     } else {
//       //up
//       const items = document.querySelectorAll('.product_');
//       items.forEach(function (item) {
//         observer1.observe(item);
//       });
//     }
//     position = scroll;
// });


// // window.onscroll = function () {

// // const items = document.querySelectorAll('.product_');
// // items.forEach(function (item) {
// //   observer.observe(item);
// // });
// //



// window.onload = function (){
//   const threshold = .1
// const options = {
//   root: null,
//   rootMargin: '0px',
//   threshold
// }

// const handleIntersect = function (entries, observer) {
//   entries.forEach(function (entry) {
//     if (entry.intersectionRatio > threshold) {
//       entry.target.classList.remove('reveal')
//       entry.target.classList.add('reveal-visible')
//       observer.unobserve(entry.target)
//     }
//   })
// }



//     const observer = new IntersectionObserver(handleIntersect, options)
//     const targets = document.querySelectorAll('.reveal')
//     targets.forEach(function (target) {
//       observer.observe(target)
//     })
// }
