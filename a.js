/* a.js — Load portfolio data from JSON and render dynamically */

const PortfolioApp = (function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  let portfolioData = {};
  let currentSlide = 0;

  async function init(){
    try {
      const response = await fetch('data.json');
      portfolioData = await response.json();
      
      // Populate all sections
      renderHero();
      renderAbout();
      renderSkills();
    renderProjects();
		populateProjectCards();
	  setupProjectTabs();//new additions
      renderContact();
      renderFooter();
      
      // Setup interactions
      setupCarousel();
      setupScrollEffects();
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    }
  }
////

 
///

  
  function populateProjectCards() {
    const projects = portfolioData.projects?.items || [];
    const containerEl = document.querySelector('#projects-root');
    if (!containerEl) return;

    containerEl.innerHTML = projects.map(p => {
      const catLabel = p.category ? (p.category.charAt(0).toUpperCase() + p.category.slice(1)) : '';

      // Media carousel for project.html
      const mediaHtml = (p.media && p.media.length)
        ? `<div class="project-media-carousel">
        ${p.media.map(m => {
          if (m.type === 'video') {
            return `<video src="${m.src}" muted playsinline 
                       style="width:100%;height:280px;object-fit:cover;border-radius:8px;margin-bottom:8px;"></video>`;
          } else if (m.type === 'image') {
            return `<img src="${m.src}" alt="${p.title}" 
                       style="width:100%;height:280px;object-fit:cover;border-radius:8px;margin-bottom:8px;">`;
          }
          return '';
        }).join('')}
        </div>`
        : `<div style="height:280px;background:#f3f4f6;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#9ca3af;margin-bottom:8px">No media</div>`;

      return `
    <article class="project-block" data-category="${p.category}">
      ${mediaHtml}
      <div class="project-body">
        <div class="category-chip category-${p.category}">${catLabel}</div>
        <div class="project-header">
          <h3>${p.title}</h3>
          ${p.status ? `<span class="status-badge status-${p.status.toLowerCase().replace(' ', '-')}">${p.status}</span>` : ''}
        </div>
        <div class="meta">${p.organization} • ${p.year}</div>
        <p>${p.description}</p>
        <div class="project-tech">${p.tech}</div>
      </div>
    </article>
  `;
    }).join('');

    // Initialize smart slideshow for project.html media
    const carousels = document.querySelectorAll('.project-media-carousel');
    carousels.forEach(carousel => {
      const slides = Array.from(carousel.children);
      //if (slides.length <= 1) return; // no slideshow needed
      if (slides[0].tagName === 'VIDEO') {
        slides[0].play().catch(() => { });
      }
      if (slides.length === 1) {
        slides[0].style.display = 'block';
        return;
      }
      

      let current = 0;
      let timeoutId = null;
      let isVideoPlaying = false;

      // Function to show a specific slide
      function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => { slide.style.display = 'none'; });

        // Show the current slide
        slides[index].style.display = 'block';
        current = index;

        // Clear any existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        // Check if current slide is a video
        const currentSlide = slides[current];
        if (currentSlide.tagName === 'VIDEO') {
          // Reset and play video
          currentSlide.currentTime = 0;
          currentSlide.play().catch(e => console.log('Video autoplay failed:', e));
          isVideoPlaying = true;

          // When video ends, move to next slide
          currentSlide.onended = () => {
            isVideoPlaying = false;
            const nextIndex = (current + 1) % slides.length;
            showSlide(nextIndex);
          };
        } else {
          // For images, set timeout for 4 seconds
          isVideoPlaying = false;
          timeoutId = setTimeout(() => {
            const nextIndex = (current + 1) % slides.length;
            showSlide(nextIndex);
          }, 4000);
        }
      }

      // Start with first slide
      showSlide(0);
    });
  }



  ///
  // function populateProjectCards() {
  //   const projects = portfolioData.projects?.items || [];
  //   const containerEl = document.querySelector('#projects-root');
  //   if (!containerEl) return;

  //   containerEl.innerHTML = projects.map(p => {
  //     const catLabel = p.category ? (p.category.charAt(0).toUpperCase() + p.category.slice(1)) : '';

  //     // Media carousel for project.html
  //     const mediaHtml = (p.media && p.media.length)
  //       ? `<div class="project-media-carousel">
  //         ${p.media.map(m => {
  //         if (m.type === 'video') {
  //           return `<video src="${m.src}" autoplay muted loop playsinline 
  //                      style="width:100%;height:280px;object-fit:cover;border-radius:8px;margin-bottom:8px;"></video>`;
  //         } else if (m.type === 'image') {
  //           return `<img src="${m.src}" alt="${p.title}" 
  //                      style="width:100%;height:280px;object-fit:cover;border-radius:8px;margin-bottom:8px;">`;
  //         }
  //         return '';
  //       }).join('')}
  //       </div>`
  //       : `<div style="height:280px;background:#f3f4f6;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#9ca3af;margin-bottom:8px">No media</div>`;

  //     return `
  //     <article class="project-block" data-category="${p.category}">
  //       ${mediaHtml}
  //       <div class="project-body">
  //         <div class="category-chip category-${p.category}">${catLabel}</div>
  //         <div class="project-header">
  //           <h3>${p.title}</h3>
  //           ${p.status ? `<span class="status-badge status-${p.status.toLowerCase().replace(' ', '-')}">${p.status}</span>` : ''}
  //         </div>
  //         <div class="meta">${p.organization} • ${p.year}</div>
  //         <p>${p.description}</p>
  //         <div class="project-tech">${p.tech}</div>
  //       </div>
  //     </article>
  //   `;
  //   }).join('');

  //   // Optional: initialize a simple slideshow for project.html media
  //   const carousels = document.querySelectorAll('.project-media-carousel');
  //   carousels.forEach(carousel => {
  //     const slides = Array.from(carousel.children);
  //     if (slides.length <= 1) return; // no slideshow needed

  //     let current = 0;
  //     slides.forEach((slide, idx) => { slide.style.display = idx === 0 ? 'block' : 'none'; });

  //     setInterval(() => {
  //       slides[current].style.display = 'none';
  //       current = (current + 1) % slides.length;
  //       slides[current].style.display = 'block';
  //     }, 4000); // change slide every 4s
  //   });
  // }




/////
  function renderHero(){
    const hero = portfolioData.hero || {};
    const nameEl = $('#hero-name');
    const greetingEl = $('#hero-greeting');
    const descEl = $('#hero-description');
    
    if(nameEl) nameEl.textContent = hero.fullName || '';
    if(greetingEl) greetingEl.textContent = hero.greeting || '';
    if(descEl) descEl.textContent = hero.description || '';
  }

  function renderAbout(){
    const about = portfolioData.about || {};
    const titleEl = $('#about-title');
    const contentEl = $('#about-content');
    
    if(titleEl) titleEl.textContent = about.title || '';
    if(contentEl) contentEl.textContent = about.content || '';
  }

  function renderSkills(){
    const skills = portfolioData.skills || {};
    const titleEl = $('#skills-title');
    const gridEl = $('#skills-grid');
    
    if(titleEl) titleEl.textContent = skills.title || '';
    
    if(gridEl && skills.items){
      gridEl.innerHTML = skills.items.map(skill => `
        <div class="skill-block">
          <div class="skill-logo">
            <img src="${skill.logo}" alt="${skill.name} Logo" title="${skill.name}">
          </div>
          <div class="skill-name">${skill.name}</div>
        </div>
      `).join('');
    }
  }
//////

	function setupProjectTabs() {
		const tabs = document.querySelectorAll('.tab');
		const projects = document.querySelectorAll('.project-block');

		if (!tabs.length || !projects.length) return;

		tabs.forEach(tab => {
			tab.addEventListener('click', () => {
				const category = tab.dataset.tab;

				tabs.forEach(t => {
					t.classList.toggle('active', t === tab);
					t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
				});

				projects.forEach(p => {
					p.style.display = (category === 'all' || p.dataset.category === category) ? '' : 'none';
				});
			});
		});
	}


	//
function renderProjects(){
  const projects = portfolioData.projects || {};
  const titleEl = $('#projects-title');
  const containerEl = $('#carousel-container');
  const dotsEl = $('#carousel-dots');

  if(titleEl) titleEl.textContent = projects.title || '';

  if(containerEl && projects.items){
    containerEl.innerHTML = projects.items.map((proj, idx) => {
      let firstMediaHtml = `<div class="slide-image-placeholder"><span>${proj.title}</span></div>`;

      if(proj.media && proj.media.length){
        const firstMedia = proj.media[0];
        if(firstMedia.type === 'image'){
          firstMediaHtml = `<img src="${firstMedia.src}" alt="${proj.title}" class="slide-image">`;
        } else if(firstMedia.type === 'video'){
          firstMediaHtml = `<video src="${firstMedia.src}" class="slide-video" autoplay muted loop playsinline></video>`;
        }
      }

      return `
        <div class="carousel-slide ${idx === 0 ? 'active' : ''}">
          <div class="slide-content">
            ${firstMediaHtml}
            <div class="slide-info">
              <h4>${proj.title}</h4>
              <p class="slide-meta">${proj.organization} • ${proj.year}</p>
              <p class="slide-tech">${proj.tech}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  if(dotsEl && projects.items){
    dotsEl.innerHTML = projects.items.map((_, idx) => `
      <span class="dot ${idx === 0 ? 'active' : ''}" data-slide="${idx}"></span>
    `).join('');
  }
}


  // function renderProjects(){
  //   const projects = portfolioData.projects || {};
  //   const titleEl = $('#projects-title');
  //   const containerEl = $('#carousel-container');
  //   const dotsEl = $('#carousel-dots');
    
  //   if(titleEl) titleEl.textContent = projects.title || '';
    
  //   if(containerEl && projects.items){
  //     containerEl.innerHTML = projects.items.map((proj, idx) => `
  //       <div class="carousel-slide ${idx === 0 ? 'active' : ''}">
  //         <div class="slide-content">
  //           ${proj.images && proj.images.length ? 
  //             `<img src="${proj.images[0]}" alt="${proj.title}" class="slide-image">` :
  //             `<div class="slide-image-placeholder"><span>${proj.title}</span></div>`
  //           }
  //           <div class="slide-info">
  //             <h4>${proj.title}</h4>
  //             <p class="slide-meta">${proj.organization} • ${proj.year}</p>
              
  //             <p class="slide-tech">${proj.tech}</p>
  //           </div>
  //         </div>
  //       </div>
  //     `).join('');
  //   }
    
  //   if(dotsEl && projects.items){
  //     dotsEl.innerHTML = projects.items.map((_, idx) => `
  //       <span class="dot ${idx === 0 ? 'active' : ''}" data-slide="${idx}"></span>
  //     `).join('');
  //   }
  // }

  function renderContact(){
    const contact = portfolioData.contact || {};
    const titleEl = $('#contact-title');
    const contentEl = $('#contact-content');
    
    if(titleEl) titleEl.textContent = contact.title || '';
    if(contentEl && contact.email){
      contentEl.innerHTML = `Email: <a href="mailto:${contact.email}">${contact.email}</a>`;
    }
  }

  function renderFooter(){
    const footer = portfolioData.footer || {};
    const copyrightEl = $('#footer-copyright');
    
    if(copyrightEl) copyrightEl.textContent = footer.copyright || '';
  }

  function setupCarousel(){
    const prevBtn = $('#carousel-prev');
    const nextBtn = $('#carousel-next');
    const dots = $$('.dot');
    const slides = $$('.carousel-slide');

    function showSlide(n) {
      if(slides.length === 0) return;
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === n);
      });
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === n);
      });
      currentSlide = n;
    }

    function nextSlide() {
      showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
      showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    if(prevBtn) prevBtn.addEventListener('click', prevSlide);
    if(nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const slideIdx = parseInt(e.currentTarget.dataset.slide);
        showSlide(slideIdx);
      });
    });
  }

  function setupScrollEffects(){
    const hero = $('.hero');
    if(hero) {
      let lastScrollY = 0;
      window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if(currentScrollY > lastScrollY && currentScrollY > 100) {
          hero.style.maxHeight = '0';
          hero.style.overflow = 'hidden';
          hero.style.opacity = '0';
        } else if(currentScrollY < 100) {
          hero.style.maxHeight = '100vh';
          hero.style.overflow = 'visible';
          hero.style.opacity = '1';
        }
        lastScrollY = currentScrollY;
      }, { passive: true });
    }
  }

  // Start app
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { portfolioData };
})();








