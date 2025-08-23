

// sidebar


const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');

function openSidebar() {
  sidebar.classList.add('open');
  sidebar.setAttribute('aria-hidden', 'false');
  menuBtn.classList.add('hidden');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebar.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  menuBtn.classList.remove('hidden');
}

menuBtn.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);

document.addEventListener('click', (e) => {
  if (!sidebar.classList.contains('open')) return;
  const clickedInside = sidebar.contains(e.target) || menuBtn.contains(e.target);
  if (!clickedInside) closeSidebar();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});


// slider1


(() => {
  const slider = document.querySelector('.banner .slider');
  if (!slider) return;
  let angle = 0;
  let velocity = 0;
  let autoSpin = true;
  let lastT = 0;
  let resumeTimer = null;
  const BASE_SPEED = -360 / 40;
  const DEGREES_PER_PX = 0.1;
  const FRICTION_PER_FRAME = 0.92; 

  function tick(t) {
    if (!lastT) lastT = t;
    const dt = (t - lastT) / 1000;
    if (autoSpin) angle += BASE_SPEED * dt;
    angle += velocity * dt;
    velocity *= Math.pow(FRICTION_PER_FRAME, dt * 60);
    slider.style.setProperty('--ry', `${angle}deg`);
    lastT = t;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  let dragging = false;
  let lastX = 0;
  let lastMoveTime = 0;

  const onPointerDown = (e) => {
    dragging = true;
    autoSpin = false;
    lastX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    lastMoveTime = performance.now();
    velocity = 0;
    slider.setPointerCapture?.(e.pointerId);
    e.preventDefault?.();
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? lastX;
    const dx = x - lastX;
    const now = performance.now();
    const dt = Math.max( (now - lastMoveTime) / 1000, 1/120 );
    angle += dx * DEGREES_PER_PX;
    velocity = (dx * DEGREES_PER_PX) / dt;
    lastX = x;
    lastMoveTime = now;
  };

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    slider.releasePointerCapture?.(e.pointerId);
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { autoSpin = true; }, 900);
  };

  slider.addEventListener('pointerdown', onPointerDown);
  slider.addEventListener('pointermove', onPointerMove);
  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', endDrag);
  slider.addEventListener('pointerleave', (e) => {
    if (dragging) endDrag(e);
  });

  slider.addEventListener('touchmove', (e) => {
    if (dragging) e.preventDefault();
  }, { passive: false });
})();



// slider2 with animation


// let slider = document.querySelector('.slider2');
// let form = document.querySelector('.form');
// let mouseDownAt = 0;
// let left = 0;

// slider.onmousedown = (e) => {
//   mouseDownAt = e.clientX;
// }
// slider.onmouseup = () => {
//   mouseDownAt = 0;
//   slider.style.userSelect = 'unset';
//   slider.style.cursor = 'unset';
//   form.style.pointerEvents = 'unset';
//   form.classList.remove('left');
//   form.classList.remove('right');
// }

// slider.onmousemove = e => {
//   if(mouseDownAt == 0) return;
//   slider.style.userSelect = 'none';
//   slider.style.cursor = 'grab';
//   form.style.pointerEvents = 'none';

//   if (e.clientX > mouseDownAt){
//     form.classList.add('left');
//     form.classList.remove('right');
//   }
//   else if (e.clientX < mouseDownAt){
//     form.classList.add('right');
//     form.classList.remove('left');
//   }
//   let speed = 1.2;
//   let leftTemporary = left + ((e.clientX - mouseDownAt) / speed);
//   let leftLimit = form.offsetWidth - slider.offsetWidth / 2;

//   if (leftTemporary < 0 && Math.abs(leftTemporary) < leftLimit){
//     form.style.setProperty('--left', left + 'px');
//     left = leftTemporary;
//     mouseDownAt = e.clientX;
//   }
// }


// slider2


const slider2 = document.querySelector('.slider2');

let isDown = false;
let startX = 0;
let startScroll = 0;

slider2.addEventListener('mousedown', (e) => {
  isDown = true;
  slider2.classList.add('grabbing');
  startX = e.pageX;
  startScroll = slider2.scrollLeft;
  e.preventDefault();
});

document.addEventListener('mouseup', () => {
  isDown = false;
  slider2.classList.remove('grabbing');
});

slider2.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  const dx = e.pageX - startX;
  const speed = 1.2;
  slider2.scrollLeft = startScroll - dx * speed;
});


// lightbox


const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('.lightbox-img');
const lbBackdrop = lightbox.querySelector('.lightbox-backdrop');

function openLightbox(src) {
  lbImg.src = src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lbImg.src = '';
  document.body.style.overflow = '';
}

slider2.addEventListener('click', (e) => {
  const img = e.target.closest('.item2 img');
  if (!img) return;
  const full = img.getAttribute('data-full') || img.src;
  openLightbox(full);
});

lbBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});