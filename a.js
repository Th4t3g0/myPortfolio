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



	function populateProjectCards() {
		const projects = portfolioData.projects?.items || [];
		const containerEl = document.querySelector('#projects-root');
		if (!containerEl) return;

		containerEl.innerHTML = projects.map(p => {
			const imgHtml = p.images && p.images.length
				? `<img src="${p.images[0]}" alt="${p.title}">`
				: `<div style="height:320px;background:#f3f4f6;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#9ca3af">No image</div>`;
			const catLabel = p.category ? (p.category.charAt(0).toUpperCase() + p.category.slice(1)) : '';
			return `
      <article class="project-block" data-category="${p.category}">
        <div class="project-media">${imgHtml}</div>
        <div class="project-body">
          <div class="category-chip category-${p.category}">${catLabel}</div>
          <h3>${p.title}</h3>
          <div class="meta">${p.organization} • ${p.year}</div>
          <p>${p.description}</p>
          <div class="project-tech">${p.tech}</div>
        </div>
      </article>
    `;
		}).join('');
	}



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
      containerEl.innerHTML = projects.items.map((proj, idx) => `
        <div class="carousel-slide ${idx === 0 ? 'active' : ''}">
          <div class="slide-content">
            ${proj.images && proj.images.length ? 
              `<img src="${proj.images[0]}" alt="${proj.title}" class="slide-image">` :
              `<div class="slide-image-placeholder"><span>${proj.title}</span></div>`
            }
            <div class="slide-info">
              <h4>${proj.title}</h4>
              <p class="slide-meta">${proj.organization} • ${proj.year}</p>
              <p class="slide-desc">${proj.description}</p>
              <p class="slide-tech">${proj.tech}</p>
            </div>
          </div>
        </div>
      `).join('');
    }
    
    if(dotsEl && projects.items){
      dotsEl.innerHTML = projects.items.map((_, idx) => `
        <span class="dot ${idx === 0 ? 'active' : ''}" data-slide="${idx}"></span>
      `).join('');
    }
  }

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








